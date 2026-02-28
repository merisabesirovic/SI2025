using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Reviews;

namespace api.Dtos.Tourist_Attraction
{
    public class TouristAttractionDto
    {
        public int Id {get; set;}
        public string Name {get; set;} = string.Empty;
        public string Description {get; set;} = string.Empty;
        public string Longitude {get; set;} = string.Empty;
        public string Latitude {get; set;} = string.Empty;
        public List<string> Photos { get; set; } = new();
         public string Category { get; set; } = string.Empty;
         public List<ReviewsDto> Reviews {get; set;}
    }
}