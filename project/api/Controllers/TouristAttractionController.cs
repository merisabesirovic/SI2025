using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
// using Amazon.S3;
// using Amazon.S3.Model;
using api.Data;
using api.Dtos.Reviews;
using api.Dtos.Tourist_Attraction;
using api.Helpers;
using api.Interfaces;
using api.Mappers;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace api.Controllers
{
    [Route("api/tourist_attractions")]
    [ApiController]
    public class TouristAttractionController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        private readonly ITouristAttractionInterface _attractionRepo;
        // private readonly IAmazonS3 _s3Client;
        private readonly ImageService _imageService;
        private readonly IMemoryCache _cache;

        public TouristAttractionController(ApplicationDBContext context, ITouristAttractionInterface attractionRepo, ImageService imageService, IMemoryCache cache)
        {
            _context = context;
            _attractionRepo = attractionRepo;
            // _s3Client = s3Client;
             _imageService = imageService;
             _cache = cache;
        }

        [HttpGet]
public async Task<IActionResult> GetAll([FromQuery] QueryObject query)
{
    if (!ModelState.IsValid)
        return BadRequest(ModelState);

    var touristAttractions = await _attractionRepo.GetAllAsync(query);
    var touristAttractionDto = touristAttractions.Select(s => s.ToAttractionDto()).ToList();

    return Ok(touristAttractionDto);
}

 [HttpPut("{id:int}")]
public async Task<IActionResult> Update(
    [FromRoute] int id,
    [FromForm] UpdateAttractionRequestDto updateDto)
{
    if (!ModelState.IsValid)
        return BadRequest(ModelState);

    var attraction = await _context.TouristAttractions
        .FirstOrDefaultAsync(a => a.Id == id);

    if (attraction == null)
        return NotFound();

    // Update basic fields
    attraction.Name = updateDto.Name ?? attraction.Name;
    attraction.Description = updateDto.Description ?? attraction.Description;
    if (!string.IsNullOrWhiteSpace(updateDto.Category))
    {
        attraction.Category = updateDto.Category.Trim().ToLowerInvariant();
    }
    attraction.Longitude = updateDto.Longitude ?? attraction.Longitude;
    attraction.Latitude = updateDto.Latitude ?? attraction.Latitude;

    // ---- IMAGE LOGIC ----

    var existingImages = string.IsNullOrEmpty(attraction.Photos)
        ? new List<string>()
        : attraction.Photos.Split(",").ToList();

    // 1️⃣ Delete selected images
    if (updateDto.ImagesToDelete != null && updateDto.ImagesToDelete.Any())
    {
        var toDelete = existingImages
            .Where(img => updateDto.ImagesToDelete.Contains(img))
            .ToList();

        if (toDelete.Any())
        {
            await _imageService.DeleteImagesAsync(toDelete);
            existingImages.RemoveAll(img => toDelete.Contains(img));
        }
    }

    // 2️⃣ Upload new images
    if (updateDto.NewImages != null && updateDto.NewImages.Any())
    {
        var uploadedUrls = await _imageService
            .UploadImagesAsync(updateDto.NewImages, attraction.Id);

        existingImages.AddRange(uploadedUrls);
    }

    attraction.Photos = string.Join(",", existingImages);

    await _context.SaveChangesAsync();

    return Ok(attraction.ToAttractionDto());
}



        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var touristAttraction = await _context.TouristAttractions
                .Include(c => c.Reviews)
                    .ThenInclude(r => r.User)
                .FirstOrDefaultAsync(c => c.Id == id);
            if (touristAttraction == null)
                return NotFound();

            var cacheKey = $"{id}:{HttpContext.Connection.RemoteIpAddress}";
            if (!_cache.TryGetValue(cacheKey, out _))
            {
                touristAttraction.ViewCount += 1;
                await _context.SaveChangesAsync();
                _cache.Set(cacheKey, true, TimeSpan.FromSeconds(5));
            }

            var touristAttractionDto = touristAttraction.ToAttractionDto();
            return Ok(touristAttractionDto);
        }

    
[HttpPost("create/{userId}")]
public async Task<ActionResult> Create(
    [FromRoute] string userId,
    [FromForm] CreateAttractionRequestDto attractionDto,
    [FromForm] List<IFormFile> files)
{
    if (!ModelState.IsValid)
        return BadRequest(ModelState);

    var attractionModel = attractionDto.ToAttractionFromDto();
    attractionModel.OwnerId = userId;

    await _attractionRepo.CreateAsync(attractionModel);

    if (files != null && files.Any())
    {
        var imageUrls = await _imageService.UploadImagesAsync(files, attractionModel.Id);
        attractionModel.Photos = string.Join(",", imageUrls);

        _context.TouristAttractions.Update(attractionModel);
        await _context.SaveChangesAsync();
    }

    return CreatedAtAction(
        nameof(GetById),
        new { id = attractionModel.Id },
        attractionModel.ToAttractionDto()
    );
}


[HttpGet("checkCreated/{userId}")]
public async Task<IActionResult> CheckIfUserCreatedAttraction(string userId)
{
    // Check if the user already has a tourist attraction
    var existingAttraction = await _context.TouristAttractions
                                            .FirstOrDefaultAsync(ta => ta.OwnerId == userId);

    if (existingAttraction == null)
    {
        return NotFound("You have not created a tourist attraction yet.");
    }

    return Ok($"You have already created a tourist attraction {existingAttraction.Name}.");
}


[HttpGet("myAttraction/{userId}")]
public async Task<IActionResult> GetMyAttraction(string userId)
{
    if (!ModelState.IsValid)
        return BadRequest(ModelState);

    // Retrieve the tourist attraction created by the user, including reviews
    var userAttraction = await _context.TouristAttractions
                                        .Include(ta => ta.Reviews) 
                                        .ThenInclude(r => r.User) // Ensure reviews are included
                                        .FirstOrDefaultAsync(ta => ta.OwnerId == userId);

    if (userAttraction == null)
    {
        // Return a response indicating no attraction is created
        return Ok(new 
        { 
            hasCreatedAttraction = false,
          attraction = (object)null
        });
    }

    var userAttractionDto = userAttraction.ToAttractionDto();

    // Return the attraction details with reviews already included in the DTO
    return Ok(new 
    { 
        hasCreatedAttraction = true, 
        attraction = userAttractionDto 
    });
}

    [HttpDelete("{id:int}")]
public async Task<IActionResult> Delete(int id)
{
    var attraction = await _context.TouristAttractions
        .Include(ta => ta.Reviews)
        .FirstOrDefaultAsync(ta => ta.Id == id);

    if (attraction == null)
        return NotFound();

    _context.Reviews.RemoveRange(attraction.Reviews);

    if (!string.IsNullOrEmpty(attraction.Photos))
    {
        var imageUrls = attraction.Photos.Split(",");
        await _imageService.DeleteImagesAsync(imageUrls);
    }

    _context.TouristAttractions.Remove(attraction);
    await _context.SaveChangesAsync();

    return NoContent();
}

}}
