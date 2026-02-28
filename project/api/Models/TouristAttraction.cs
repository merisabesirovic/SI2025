using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class TouristAttraction
    {
        public int Id {get; set;}
        public string Name {get; set;} = string.Empty;
        public string Description {get; set;} = string.Empty;
        public string Longitude {get; set;} = string.Empty;
        public string Latitude {get; set;} = string.Empty;
        public string Photos { get; set; } = string.Empty;
        public string Category{ get; set; } = string.Empty;
        public int ViewCount { get; set; } = 0;
        public List<Review> Reviews { get; set; } = new List<Review>();
        public List<Portfolio> Portfolios {get; set;} = new List<Portfolio>();
        public string? OwnerId { get; set; }
        



    }

    
}
