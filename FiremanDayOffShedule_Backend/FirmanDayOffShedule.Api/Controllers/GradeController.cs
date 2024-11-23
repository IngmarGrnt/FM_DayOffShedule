using AutoMapper;
using AutoMapper.QueryableExtensions;
using FiremanDayOffShedule.Dal.Context;
using FiremanDayOffShedule.Dal.Entities;
using FirmanDayOffShedule.Api.DTO.Grade;
using FirmanDayOffShedule.Api.DTO.Role;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FirmanDayOffShedule.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GradeController : ControllerBase
    {
        private readonly DBFirmanDayOffShedule _context;
        private readonly IMapper _mapper;

        public GradeController(DBFirmanDayOffShedule context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/grades
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GradeReadDTO>>> GetGrades()
        {
            var gradeDTOs = await _context.Grades
            .ProjectTo<GradeReadDTO>(_mapper.ConfigurationProvider)
            .ToListAsync();

            return Ok(gradeDTOs);

        }
        // GET: api/Grade/id
        [HttpGet("{id}")]
        public async Task<ActionResult<Grade>> GetGrade(int id)
        {
            var gradeDTO = await _context.Grades
            .Where(g => g.Id == id)
            .ProjectTo<GradeReadDTO>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync();

            if (gradeDTO == null)
            {
                return NotFound();
            }

            return Ok(gradeDTO);

        }
    }
}
