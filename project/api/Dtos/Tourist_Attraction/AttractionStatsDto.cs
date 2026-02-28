using System;
using System.Collections.Generic;

namespace api.Dtos.Tourist_Attraction
{
    public class AttractionStatsDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public double AverageRating { get; set; }
        public int TotalReviews { get; set; }
        public Dictionary<int, int> RatingBreakdown { get; set; } = new Dictionary<int, int>();
        public int TotalFavorites { get; set; }
        public int TotalViews { get; set; }
        public List<LatestReviewDto> LatestReviews { get; set; } = new List<LatestReviewDto>();
    }

    public class LatestReviewDto
    {
        public int Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public DateTime Date { get; set; }
    }
}
