using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Helpers;
using api.Models;

namespace api.Interfaces
{
    public interface IReviewRepository
    {
        Task<List<Review>> GetAllAsync(ReviewQueryObject reviewQueryObject);
        Task <Review?> GetByIdAsync(int id);
        Task <Review> CreateAsync(Review reviewModel);
        Task <Review?> DeleteAsync(int id);
        Task<bool> ExistsForUserAsync(string userId, int attractionId);
    }
}
