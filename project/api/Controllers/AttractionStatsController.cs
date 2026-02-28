using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Threading.Tasks;
using api.Data;
using api.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("api/attractions")]
    [ApiController]
    public class AttractionStatsController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        private readonly IAttractionStatsService _statsService;

        public AttractionStatsController(ApplicationDBContext context, IAttractionStatsService statsService)
        {
            _context = context;
            _statsService = statsService;
        }

        [HttpGet("stats/{attractionId:int}")]
        public async Task<IActionResult> GetAttractionStats([FromRoute] int attractionId)
        {
            var email = User.FindFirstValue(JwtRegisteredClaimNames.Email) 
                ?? User.FindFirstValue(ClaimTypes.Email);
            if (string.IsNullOrEmpty(email))
                return Unauthorized();

            var user = await _context.Users.AsNoTracking()
                .FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
                return Unauthorized();

            var attraction = await _context.TouristAttractions
                .AsNoTracking()
                .FirstOrDefaultAsync(a => a.Id == attractionId);

            if (attraction == null)
                return NotFound();

            if (!string.IsNullOrWhiteSpace(attraction.OwnerId) &&
                !string.Equals(attraction.OwnerId.Trim(), user.Id, System.StringComparison.OrdinalIgnoreCase))
            {
                return Forbid();
            }

            var stats = await _statsService.GetAttractionStatsAsync(attractionId);
            if (stats == null)
                return NotFound();

            return Ok(stats);
        }
    }
}
