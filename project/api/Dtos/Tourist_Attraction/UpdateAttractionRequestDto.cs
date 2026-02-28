using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace api.Dtos.Tourist_Attraction
{
    public class UpdateAttractionRequestDto{
       

        [Required]
        [MaxLength(200, ErrorMessage = "Ime mora da bude kraće od 25 karaktera")]
         public string Name {get; set;} = string.Empty;
         [Required]
        [MaxLength(2500, ErrorMessage = "Opis mora biti kraći od 2000 karaktera")]

        public string Description {get; set;} = string.Empty;
        [Required]
        [MaxLength(50, ErrorMessage = "Lokacija mora imati manje od 50 karaktera")]
       
        public string Longitude {get; set;} = string.Empty;
        [Required]
        [MaxLength(50, ErrorMessage = "Lokacija mora imati manje od 50 karaktera")]

        public string Latitude {get;set;} = string.Empty;
         
        public string Category { get; set; } = string.Empty;
        
        public List<IFormFile>? NewImages { get; set; }

        public List<string>? ImagesToDelete { get; set; }
    }
}