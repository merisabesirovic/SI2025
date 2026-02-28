using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Reviews;
using api.Extensions;
using api.Helpers;
using api.Interfaces;
using api.Mappers;
using api.Models;
using api.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/comment")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewRepository _reviewRepo;
        private readonly ITouristAttractionInterface _attractionInterface;
        private readonly UserManager<User> _usermanager;
        public ReviewController(IReviewRepository reviewRepo, ITouristAttractionInterface attractionInterface, UserManager<User> userManager)
        {
            _reviewRepo = reviewRepo;
            _attractionInterface = attractionInterface;
            _usermanager = userManager;
        }
        [HttpGet]
    
        public async Task<IActionResult> GetAll([FromQuery]ReviewQueryObject queryObject){
            if(!ModelState.IsValid)
                return BadRequest(ModelState);
            var reviews = await _reviewRepo.GetAllAsync(queryObject);
            var reviewsDto = reviews.Select(s => s.ToReviewDto()).ToList();
            return Ok(reviewsDto);
        }

        [HttpGet("{id:int}")]

        public async Task<IActionResult> GetById([FromRoute] int id){
            if(!ModelState.IsValid)
                return BadRequest(ModelState);
            var review = await _reviewRepo.GetByIdAsync(id);
            if(review == null){
                return NotFound();
            }
            return Ok(review.ToReviewDto());
        }
        [HttpPost("{attractionId:int}")]
        [Authorize]
        public async Task <IActionResult> Create([FromRoute]int attractionId, CreateReviewDto reviewDto){
            if(!ModelState.IsValid)
                return BadRequest(ModelState);
            if(!await _attractionInterface.TouristAttractionExists(attractionId)){
                return BadRequest("Attraction does not exist");
            }
            var username = User.GetUsername();
            var appUser = await _usermanager.FindByNameAsync(username);

            if (await _reviewRepo.ExistsForUserAsync(appUser.Id, attractionId))
            {
                return Conflict("You have already submitted a review for this attraction.");
            }

            var reviewModel = reviewDto.ToReviewFromCreate(attractionId);
            reviewModel.UserId = appUser.Id;
            await _reviewRepo.CreateAsync(reviewModel);
            return CreatedAtAction(nameof(GetById), new{ id = reviewModel.Id}, reviewModel.ToReviewDto());
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task <IActionResult> Delete([FromRoute]int id)
        {   if(!ModelState.IsValid)
                return BadRequest(ModelState);
            var reviewModel = await _reviewRepo.DeleteAsync(id);
            if(reviewModel == null){
                return NotFound("Review does not exist");
            }
            return Ok(reviewModel);
        }
        
        
    }
}
