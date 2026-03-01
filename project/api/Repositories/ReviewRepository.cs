using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Helpers;
using api.Interfaces;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repositories
{
    public class ReviewRepository : IReviewRepository
    {   private readonly ApplicationDBContext _context;
        public ReviewRepository(ApplicationDBContext context)
        {
            _context = context;
        }

    public async Task<Review> CreateAsync(Review reviewModel)
{
    // Npgsql expects UTC for timestamp with time zone.
    reviewModel.CreatedOn = reviewModel.CreatedOn.Kind switch
    {
        DateTimeKind.Utc => reviewModel.CreatedOn,
        DateTimeKind.Local => reviewModel.CreatedOn.ToUniversalTime(),
        _ => DateTime.SpecifyKind(reviewModel.CreatedOn, DateTimeKind.Utc)
    };

    _context.Entry(reviewModel).Reference(r => r.TouristAttraction).IsModified = false;

    await _context.Reviews.AddAsync(reviewModel);
    await _context.SaveChangesAsync();
    return reviewModel;
}

        public async Task<Review?> DeleteAsync(int id)
        {
            var reviewModel = await _context.Reviews.FirstOrDefaultAsync(x=> x.Id == id);
            if(reviewModel == null){
                return null;
            }
            _context.Reviews.Remove(reviewModel);
            await _context.SaveChangesAsync();
            return reviewModel;
        }

        public Task<bool> ExistsForUserAsync(string userId, int attractionId)
        {
            return _context.Reviews.AnyAsync(r =>
                r.UserId == userId && r.TouristAttractionId == attractionId);
        }

        public async Task<List<Review>> GetAllAsync(ReviewQueryObject queryObject)
        {
            var reviews =  _context.Reviews.Include(a => a.User).AsQueryable();
            if(!string.IsNullOrWhiteSpace(queryObject.Name)){
                reviews = reviews.Where(s => s.TouristAttraction.Name == queryObject.Name);
            }
            if(queryObject.IsDescening == true){
                reviews = reviews.OrderByDescending(c=>c.CreatedOn);
            }
            return await reviews.ToListAsync();
        }

        public async Task<Review?> GetByIdAsync(int id)
        {
            return await _context.Reviews.Include(a => a.User).FirstOrDefaultAsync(c => c.Id == id);
        }
        
    }
}
