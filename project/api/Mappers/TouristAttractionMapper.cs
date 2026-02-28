using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Tourist_Attraction;
using api.Models;

namespace api.Mappers
{
    public static class TouristAttractionMapper
    {
        public static TouristAttractionDto ToAttractionDto(this TouristAttraction touristAttractionModel){
                return new TouristAttractionDto{
                    Id = touristAttractionModel.Id,
                    Name = touristAttractionModel.Name,
                    Description = touristAttractionModel.Description,
                    Longitude = touristAttractionModel.Longitude,
                    Latitude = touristAttractionModel.Latitude,
                    // Photos = touristAttractionModel.Photos,
                    Category = touristAttractionModel.Category,
                    Reviews = touristAttractionModel.Reviews.Select(r => r.ToReviewDto()).ToList(),
                           Photos = string.IsNullOrEmpty(touristAttractionModel.Photos)
            ? new List<string>()
            : touristAttractionModel.Photos.Split(",").ToList()
                };
        }
        public static TouristAttraction ToAttractionFromDto(this CreateAttractionRequestDto touristAttractionDto){
            return new TouristAttraction{
                Name = touristAttractionDto.Name,
                Description = touristAttractionDto.Description,
                Longitude = touristAttractionDto.Longitude,
                Latitude = touristAttractionDto.Latitude,
                Category = touristAttractionDto.Category
            };
        }
    }
    
}