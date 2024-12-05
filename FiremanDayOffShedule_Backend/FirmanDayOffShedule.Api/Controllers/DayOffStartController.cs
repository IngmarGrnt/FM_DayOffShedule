using AutoMapper;
using AutoMapper.QueryableExtensions;
using FiremanDayOffShedule.Dal.Context;
using FiremanDayOffShedule.Dal.Entities;
using FirmanDayOffShedule.Api.DTO.DayOffStartDTO;
using FirmanDayOffShedule.Api.DTO.Grade;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FirmanDayOffShedule.Api.Controllers
{
  
        [ApiController]
        [Route("api/[controller]")]

        public class DayOffStartController : ControllerBase
        {
            private readonly DBFirmanDayOffShedule _context;
            private readonly IMapper _mapper;

            public DayOffStartController(DBFirmanDayOffShedule context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            // GET: api/dayOffstarts
            [HttpGet]
            public async Task<ActionResult<IEnumerable<DayOffStartReadDTO>>> GetDayOffStarts()
            {
                try
                {
                    var dayOffStartDTOs = await _context.DayOffstarts
                    .ProjectTo<DayOffStartReadDTO>(_mapper.ConfigurationProvider)
                    .ToListAsync();

                    return Ok(dayOffStartDTOs);
                }
                catch (Exception ex)
                {
                    // Log de fout (bijvoorbeeld naar Application Insights)
                    Console.WriteLine(ex.Message);
                    return StatusCode(500,
                        $"Er is een interne fout opgetreden. + {ex.Message}");
                }


            }
            // GET: api/dayOffStart/id
            [HttpGet("{id}")]
            public async Task<ActionResult<DayOffStart>> GetDayOfStart(int id)
            {
                try
                {
                    var dayOffStartDTOs = await _context.DayOffstarts
                    .Where(g => g.Id == id)
                    .ProjectTo<DayOffStartReadDTO>(_mapper.ConfigurationProvider)
                    .FirstOrDefaultAsync();

                    if (dayOffStartDTOs == null)
                    {
                        return NotFound();
                    }

                    return Ok(dayOffStartDTOs);
                }
                catch (Exception ex)
                {
                    // Log de fout (bijvoorbeeld naar Application Insights)
                    Console.WriteLine(ex.Message);
                    return StatusCode(500,
                        $"Er is een interne fout opgetreden. + {ex.Message}");
                }


            }
        }
    
}
