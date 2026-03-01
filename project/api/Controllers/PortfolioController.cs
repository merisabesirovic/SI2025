using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Extensions;
using api.Interfaces;
using api.Models;
using api.Repositories;
using api.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/portfolio")]
    [ApiController]
    public class PortfolioController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly ITouristAttractionInterface _attractionRepository;
        private readonly IPortfolioRepository _portfolioRepository;
        public PortfolioController(
            UserManager<User> userManager,
            ITouristAttractionInterface attractionRepository,
            IPortfolioRepository portfolioRepository) // Use interfaces, as registered in DI
        {
        _portfolioRepository = portfolioRepository;
        _userManager = userManager;
        _attractionRepository = attractionRepository;
        }

        [HttpGet]
        [Authorize]
         public async Task<IActionResult> GetUserPortfolio()
        {
            var username = User.GetUsername();
            var appUser = await _userManager.FindByNameAsync(username);
            var userPortfolio = await  _portfolioRepository.GetUserPortfolio(appUser);
            var userPortfolioDto = userPortfolio.Select(x => x.ToAttractionDto()).ToList();
            return Ok(userPortfolioDto);
        }
        [HttpPost]
        [Authorize]
        public async Task <IActionResult> AddPortfolio(string name){
            var username = User.GetUsername();
            var appUser = await _userManager.FindByNameAsync(username);
            var attraction = await _attractionRepository.GetByNameAsync(name);
            if(attraction == null){
                return BadRequest("Attraction not found");
            }
            var userPortfolio = await _portfolioRepository.GetUserPortfolio(appUser);
            if(userPortfolio.Any(e=> e.Name.ToLower() == name.ToLower()))
                return BadRequest("Ova turistička atrakcija je već dodata u favorite");

                var portfolioModel = new Portfolio{
                    TouristAttractionId = attraction.Id,
                    UserId = appUser.Id
                };
                await _portfolioRepository.CreateAsync(portfolioModel);
                if(portfolioModel==null){
                    return StatusCode(500, "Cannot be created");
                }
                else{
                    return Created();
                }
        }
        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> DeletePortfolio(string name){
            var username = User.GetUsername();
            var appUser = await _userManager.FindByNameAsync(username);
            var userPortfolio = await _portfolioRepository.GetUserPortfolio(appUser);
            var filtered = userPortfolio.Where(s=> s.Name.ToLower()== name.ToLower()).ToList();

            if(filtered.Count == 1){
                await _portfolioRepository.DeleteAsync(appUser, name);
            }
            else{
                return BadRequest("Tourist attraction not in portfolio");
            }
            return Ok();


        }

    }
}
