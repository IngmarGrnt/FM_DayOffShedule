using AutoMapper;
using AutoMapper.QueryableExtensions;
using FiremanDayOffShedule.Dal.Context;
using FiremanDayOffShedule.Dal.Entities;
using FirmanDayOffShedule.Api.DTO.Grade;
using FirmanDayOffShedule.Api.DTO.SpecialityDTO;
using FirmanDayOffShedule.Api.DTO.TeamDTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FirmanDayOffShedule.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SpecialityController : ControllerBase
    {

        private readonly DBFirmanDayOffShedule _context;
        private readonly IMapper _mapper;

        public SpecialityController(DBFirmanDayOffShedule context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Specialitys
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SpecialityReadDTO>>> GetSpecialitys()
        {
            var specialityDTOs = await _context.Specialities
            .ProjectTo<SpecialityReadDTO>(_mapper.ConfigurationProvider)
            .ToListAsync();

            return Ok(specialityDTOs);

        }

        // GET: api/Speciality/id
        [HttpGet("{id}")]
        public async Task<ActionResult<Speciality>> GetSpeciality(int id)
        {
            var specialityDTO = await _context.Specialities
            .Where(s => s.Id == id)
            .ProjectTo<SpecialityReadDTO>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync();

            if (specialityDTO == null)
            {
                return NotFound();
            }

            return Ok(specialityDTO);

        }
    }
}
