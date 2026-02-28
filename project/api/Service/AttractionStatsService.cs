using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos.Tourist_Attraction;
using api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace api.Service
{
    public class AttractionStatsService : IAttractionStatsService
    {
        private readonly ApplicationDBContext _context;

        public AttractionStatsService(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<AttractionStatsDto?> GetAttractionStatsAsync(int attractionId)
        {
            var attraction = await _context.TouristAttractions
                .Include(a => a.Reviews)
                    .ThenInclude(r => r.User)
                .FirstOrDefaultAsync(a => a.Id == attractionId);

            if (attraction == null)
                return null;

            var totalReviews = attraction.Reviews.Count;
            var averageRating = totalReviews > 0
                ? Math.Round(attraction.Reviews.Average(r => r.Rating), 2)
                : 0.0;

            var ratingBreakdown = new Dictionary<int, int>
            {
                { 1, 0 },
                { 2, 0 },
                { 3, 0 },
                { 4, 0 },
                { 5, 0 }
            };

            foreach (var review in attraction.Reviews)
            {
                if (ratingBreakdown.ContainsKey(review.Rating))
                {
                    ratingBreakdown[review.Rating]++;
                }
            }

            var totalFavorites = await _context.Portfolios
                .CountAsync(p => p.TouristAttractionId == attractionId);

            var latestReviews = attraction.Reviews
                .OrderByDescending(r => r.CreatedOn)
                .Take(5)
                .Select(r => new LatestReviewDto
                {
                    Rating = r.Rating,
                    Comment = r.Comment,
                    UserName = r.User?.UserName ?? "Unknown",
                    Date = r.CreatedOn
                })
                .ToList();

            return new AttractionStatsDto
            {
                Id = attraction.Id,
                Name = attraction.Name,
                AverageRating = averageRating,
                TotalReviews = totalReviews,
                RatingBreakdown = ratingBreakdown,
                TotalFavorites = totalFavorites,
                TotalViews = attraction.ViewCount,
                LatestReviews = latestReviews
            };
        }
    }
}
