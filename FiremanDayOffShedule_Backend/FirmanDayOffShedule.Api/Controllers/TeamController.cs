using AutoMapper;
using AutoMapper.QueryableExtensions;
using FiremanDayOffShedule.Dal.Context;
using FiremanDayOffShedule.Dal.Entities;
using FirmanDayOffShedule.Api.DTO;
using FirmanDayOffShedule.Api.DTO.SpecialityDTO;
using FirmanDayOffShedule.Api.DTO.TeamDTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FirmanDayOffShedule.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TeamController : ControllerBase
    {
        private readonly DBFirmanDayOffShedule _context;
        private readonly IMapper _mapper;

        public TeamController(DBFirmanDayOffShedule context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Team
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TeamReadDTO>>> GetTeams()
        {
            var TeamDTOs = await _context.Teams
            .ProjectTo<TeamReadDTO>(_mapper.ConfigurationProvider)
            .ToListAsync();

            return Ok(TeamDTOs);

        }
        // GET: api/Team/id
        [HttpGet("{id}")]
        public async Task<ActionResult<Team>> GetTeam(int id)
        {
            var teamDTO = await _context.Teams
            .Where(t => t.Id == id)
            .ProjectTo<TeamReadDTO>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync();

            if (teamDTO == null)
            {
                return NotFound();
            }

            return Ok(teamDTO);

        }

        // GET: api/Team/workdays/{id}/{year}
        [HttpGet("workdays/{id}/{year}")]
        public async Task<ActionResult<object>> GetWorkDaysForYear(int id, int year)
        {
            var team = await _context.Teams
                .FirstOrDefaultAsync(t => t.Id == id);

            if (team == null)
            {
                return NotFound();
            }

            var startDate = team.StartDate;
            var shifts = new List<object>();

            // Controleer of het opgegeven jaar een schrikkeljaar is
            bool isLeapYear = DateTime.IsLeapYear(year);
            if (isLeapYear)
            {
                // Eventuele extra logica of informatie voor schrikkeljaren
                Console.WriteLine($"{year} is een schrikkeljaar.");
            }

            DateTime currentYearStart = new DateTime(year, 1, 1);
            DateTime currentYearEnd = new DateTime(year, 12, 31);
            DateTime currentDate = startDate;

            // Bereken dag- en nachtdiensten voor het gegeven jaar
            while (currentDate <= currentYearEnd)
            {
                if (currentDate.Year == year)
                {
                    shifts.Add(new
                    {
                        date = currentDate,
                        shiftType = "day"
                    });
                }

                // Voeg 4 dagen toe voor de volgende dagdienst
                currentDate = currentDate.AddDays(4);
            }

            // Bereken nachtdiensten die een dag na de startdatum beginnen
            currentDate = startDate.AddDays(1);
            while (currentDate <= currentYearEnd)
            {
                if (currentDate.Year == year)
                {
                    shifts.Add(new
                    {
                        date = currentDate,
                        shiftType = "night"
                    });
                }

                // Voeg 4 dagen toe voor de volgende nachtdienst
                currentDate = currentDate.AddDays(4);
            }

            // Sorteer de diensten op datum
            shifts = shifts.OrderBy(s => ((DateTime)s.GetType().GetProperty("date").GetValue(s)).Date).ToList();

            // Retourneer het resultaat als een object met dag- en nachtdiensten
            var result = new
            {
                shifts = shifts
            };

            return Ok(result);
        }

    }
}
   
    
