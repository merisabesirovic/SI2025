using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos;
using api.Dtos.User;
using api.Data;
using api.Interfaces;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace api.Controllers
{
    [Route("api/users")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ApplicationDBContext _context;
        private readonly IPortfolioRepository _portfolioRepository;

        [ActivatorUtilitiesConstructor]
        public UserController(
            UserManager<User> userManager,
            RoleManager<IdentityRole> roleManager,
            ApplicationDBContext context,
            IPortfolioRepository portfolioRepository)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
            _portfolioRepository = portfolioRepository;
        }

        
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userManager.Users
                .ToListAsync();

            var userDtos = new List<UserDto>();
            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                userDtos.Add(new UserDto
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    Email = user.Email,
                    IsApproved = user.IsApproved,
                    Roles = roles
                });
            }

            return Ok(userDtos);
        }

        // GET: api/users/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(string id)
        {
            var user = await _userManager.Users
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
                return NotFound("User not found.");

            var roles = await _userManager.GetRolesAsync(user);

            var userDto = new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                IsApproved = user.IsApproved,
                Roles = roles
            };

            return Ok(userDto);
        }

        // DELETE: api/users/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound("User not found.");

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
                return BadRequest("Failed to delete the user.");

            return Ok($"User '{user.UserName}' deleted successfully.");
        }

        // PUT: api/users/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserDto updateUserDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound("User not found.");

            user.UserName = updateUserDto.UserName ?? user.UserName;
            user.Email = updateUserDto.Email ?? user.Email;
            user.IsApproved = updateUserDto.IsApproved ?? user.IsApproved;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return BadRequest("Failed to update the user.");

            return Ok($"User '{user.UserName}' updated successfully.");
        }

        // PUT: api/users/{id}/roles
        [HttpPut("{id}/roles")]
        public async Task<IActionResult> UpdateUserRoles(string id, [FromBody] UpdateRolesDto updateRolesDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound("User not found.");

            var currentRoles = await _userManager.GetRolesAsync(user);
            var rolesToAdd = updateRolesDto.Roles.Except(currentRoles);
            var rolesToRemove = currentRoles.Except(updateRolesDto.Roles);

            var addResult = await _userManager.AddToRolesAsync(user, rolesToAdd);
            if (!addResult.Succeeded)
                return BadRequest("Failed to add roles.");

            var removeResult = await _userManager.RemoveFromRolesAsync(user, rolesToRemove);
            if (!removeResult.Succeeded)
                return BadRequest("Failed to remove roles.");

            return Ok($"User '{user.UserName}' roles updated successfully.");
        }

        // GET: api/users/{userId}/trip-plan
        [HttpGet("{userId}/trip-plan")]
        public async Task<IActionResult> GetTripPlan(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return NotFound("User not found.");

            var favorites = await _portfolioRepository.GetUserPortfolio(user);
            var allAttractions = await _context.TouristAttractions.AsNoTracking().ToListAsync();

            var favoriteIds = new HashSet<int>(favorites.Select(f => f.Id));
            var tripPlan = new List<TripPlanItemDto>();

            var recommendedGlobal = new HashSet<int>();

            foreach (var favorite in favorites)
            {
                tripPlan.Add(MapTripPlanItem(favorite, "favorite"));

                var candidates = allAttractions
                    .Where(a => !favoriteIds.Contains(a.Id))
                    .Select(a => new
                    {
                        Attraction = a,
                        IsSameCategory = IsSameCategory(favorite, a),
                        DistanceKm = GetDistanceKm(favorite, a)
                    })
                    .Where(x => x.IsSameCategory || (x.DistanceKm.HasValue && x.DistanceKm.Value < 2.0))
                    .OrderByDescending(x => x.IsSameCategory)
                    .ThenBy(x => x.DistanceKm ?? double.MaxValue)
                    .Take(5)
                    .ToList();

                foreach (var item in candidates)
                {
                    if (recommendedGlobal.Add(item.Attraction.Id))
                    {
                        tripPlan.Add(MapTripPlanItem(item.Attraction, "recommendation"));
                    }
                }
            }

            return Ok(tripPlan);
        }

        private static TripPlanItemDto MapTripPlanItem(TouristAttraction attraction, string type)
        {
            return new TripPlanItemDto
            {
                Id = attraction.Id,
                Name = attraction.Name,
                Category = attraction.Category,
                Latitude = attraction.Latitude,
                Longitude = attraction.Longitude,
                Type = type
            };
        }

        private static bool IsSameCategory(TouristAttraction a, TouristAttraction b)
        {
            return string.Equals(a.Category?.Trim(), b.Category?.Trim(), StringComparison.OrdinalIgnoreCase);
        }

        private static bool IsWithinDistanceKm(TouristAttraction a, TouristAttraction b, double maxKm)
        {
            var distanceKm = GetDistanceKm(a, b);
            return distanceKm.HasValue && distanceKm.Value <= maxKm;
        }

        private static double? GetDistanceKm(TouristAttraction a, TouristAttraction b)
        {
            if (!TryParseCoordinate(a.Latitude, out var lat1) ||
                !TryParseCoordinate(a.Longitude, out var lon1) ||
                !TryParseCoordinate(b.Latitude, out var lat2) ||
                !TryParseCoordinate(b.Longitude, out var lon2))
            {
                return null;
            }

            return HaversineDistanceKm(lat1, lon1, lat2, lon2);
        }

        private static bool TryParseCoordinate(string value, out double result)
        {
            return double.TryParse(value, NumberStyles.Float, CultureInfo.InvariantCulture, out result);
        }

        private static double HaversineDistanceKm(double lat1, double lon1, double lat2, double lon2)
        {
            const double EarthRadiusKm = 6371.0;
            var dLat = DegreesToRadians(lat2 - lat1);
            var dLon = DegreesToRadians(lon2 - lon1);

            var a = Math.Pow(Math.Sin(dLat / 2), 2) +
                    Math.Cos(DegreesToRadians(lat1)) *
                    Math.Cos(DegreesToRadians(lat2)) *
                    Math.Pow(Math.Sin(dLon / 2), 2);

            var c = 2 * Math.Asin(Math.Min(1, Math.Sqrt(a)));
            return EarthRadiusKm * c;
        }

        private static double DegreesToRadians(double degrees)
        {
            return degrees * (Math.PI / 180);
        }
    }
}
