using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Interfaces;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repositories
{
    public class PortfolioRepository : IPortfolioRepository
    {   private readonly ApplicationDBContext _applicationDBContext;
        public PortfolioRepository(ApplicationDBContext applicationDBContext)
        {
            _applicationDBContext = applicationDBContext;
        }

        public async Task<Portfolio> CreateAsync(Portfolio portfolio)
        {
            await _applicationDBContext.Portfolios.AddAsync(portfolio);
            await _applicationDBContext.SaveChangesAsync();
            return portfolio;
        }

        public async Task<Portfolio> DeleteAsync(User user, string name)
        {
            var portfolioModel = await _applicationDBContext.Portfolios.FirstOrDefaultAsync(x=>x.UserId == user.Id && x.TouristAttraction.Name.ToLower() == name.ToLower());
            if(portfolioModel == null){
                return null;
            }
            _applicationDBContext.Portfolios.Remove(portfolioModel);
            await _applicationDBContext.SaveChangesAsync();
            return portfolioModel;
        }

        public async Task<List<TouristAttraction>> GetUserPortfolio(User user)
        {
            return await _applicationDBContext.Portfolios.Where(u => u.UserId == user.Id)
            .Select(attraction => new TouristAttraction
            {
                Id = attraction.TouristAttractionId,
                Name = attraction.TouristAttraction.Name,
                Description = attraction.TouristAttraction.Description,
                Category = attraction.TouristAttraction.Category,
                Latitude = attraction.TouristAttraction.Latitude,
                Longitude = attraction.TouristAttraction.Longitude,
                Photos = attraction.TouristAttraction.Photos
            }).ToListAsync();
        }
        
        
    }
}
