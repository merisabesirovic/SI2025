using System.Threading.Tasks;
using api.Dtos.Tourist_Attraction;

namespace api.Interfaces
{
    public interface IAttractionStatsService
    {
        Task<AttractionStatsDto?> GetAttractionStatsAsync(int attractionId);
    }
}
