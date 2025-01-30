using Microsoft.AspNetCore.Mvc;

namespace FirmanDayOffShedule.Api.Controllers
{
    [ApiController]
    [Route("api/logtest")]
    public class LogTestController : ControllerBase
    {
        private readonly ILogger<LogTestController> _logger;

        public LogTestController(ILogger<LogTestController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IActionResult Get()
        {
            _logger.LogInformation("Dit is een informatie log.");
            _logger.LogWarning("Dit is een waarschuwing log.");
            _logger.LogError("Dit is een fout log.");

            return Ok("Logging werkt!");
        }
    }
}
