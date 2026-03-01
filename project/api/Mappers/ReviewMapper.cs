using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Reviews;
using api.Models;

namespace api.Mappers
{
    public static class ReviewMapper
    {
        public static ReviewsDto ToReviewDto(this Review reviewModel){
            return new ReviewsDto{
                Id = reviewModel.Id,
                Rating = reviewModel.Rating,
                Comment = reviewModel.Comment,
                CreatedOn = reviewModel.CreatedOn,
                TouristAttractionId = reviewModel.TouristAttractionId,
                CreatedBy = reviewModel.User?.UserName ?? "Anonymous"
            };
        }

       public static Review ToReviewFromCreate(this CreateReviewDto reviewDto, int touristAttractionId)
{
    return new Review
    {
        Rating = reviewDto.Rating,
        Comment = reviewDto.Comment,
        CreatedOn = DateTime.UtcNow,
        TouristAttractionId = touristAttractionId, // Only set the ID
        TouristAttraction = null // Ensure the navigation property is null

    };
}

    }
}
