using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{ [Table("Reviews")]
    public class Review
{
    public int Id { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedOn {get; set;} = DateTime.UtcNow;
    public int? TouristAttractionId {get; set;} 
    public TouristAttraction TouristAttraction {get; set;} = new TouristAttraction();
    public string UserId {get; set;}

    public User User {get;set;}
   
}

}
