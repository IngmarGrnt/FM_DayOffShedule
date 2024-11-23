using AutoMapper;
using FiremanDayOffShedule.Dal.Context;
using FirmanDayOffShedule.Api.DTO;
using FirmanDayOffShedule.Api.DTO.Role;
using Microsoft.AspNetCore.Mvc;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using FiremanDayOffShedule.Dal.Entities;
using FirmanDayOffShedule.Api.DTO.SpecialityDTO;

namespace FirmanDayOffShedule.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoleController : ControllerBase
    {
        private readonly DBFirmanDayOffShedule _context;
        private readonly IMapper _mapper;

        public RoleController(DBFirmanDayOffShedule context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/roles
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoleReadDTO>>> GetRoles()
        {
            var roleDTOs = await _context.Roles
            .ProjectTo<RoleReadDTO>(_mapper.ConfigurationProvider)
            .ToListAsync();

            return Ok(roleDTOs);
        }

        // GET: api/Role/id
        [HttpGet("{id}")]
        public async Task<ActionResult<Role>> GetRole(int id)
        {
            var roleDTO = await _context.Roles
            .Where(s => s.Id == id)
            .ProjectTo<RoleReadDTO>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync();

            if (roleDTO == null)
            {
                return NotFound();
            }

            return Ok(roleDTO);

        }
    }
}
