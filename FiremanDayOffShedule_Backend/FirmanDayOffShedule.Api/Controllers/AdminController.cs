using FiremanDayOffShedule.DataContracts.DTO.AdminDTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace FirmanDayOffShedule.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : Controller
    {

            private readonly AdminSettingsDTO _adminSettings;

     

        public AdminController(IOptions<AdminSettingsDTO> adminSettings)
            {
                _adminSettings = adminSettings.Value;
            }

            [HttpGet("settings")]
            public IActionResult GetSettings()
            {
                return Ok(_adminSettings);
            }

            [HttpGet("year")]
            public IActionResult GetDayOffYear()
            {
                return Ok(new { Year = _adminSettings.DayOffTeamYear });
            }
        
    }
}
