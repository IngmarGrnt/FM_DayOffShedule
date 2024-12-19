using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FiremanDayOffShedule.Dal.Context;
using FiremanDayOffShedule.Dal.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using FirmanDayOffShedule.Api.DTO.PersonDTO;
using FirmanDayOffShedule.Api.DTO;
using AutoMapper.QueryableExtensions;
using FirmanDayOffShedule.Api.DTO.LoginDTO;

namespace FirmanDayOffShedule.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PersonController : ControllerBase
    {
        private readonly DBFirmanDayOffShedule _context;
        private readonly IMapper _mapper;

        public PersonController(DBFirmanDayOffShedule context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Person
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PersonBaseDTO>>> GetPersons()
        {
            try
            {
                var personDTOs = await _context.Persons
                    .ProjectTo<PersonBaseDTO>(_mapper.ConfigurationProvider)
                    .ToListAsync();

                return Ok(personDTOs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Er is een fout opgetreden bij het ophalen van een persoonId)");
            }
        }

        // GET: api/Person/id
        [HttpGet("{id}")]
        public async Task<ActionResult<Person>> GetPerson(int id)
        {
            var personDTO = await _context.Persons
            .Where(p => p.Id == id)
            .ProjectTo<PersonDetailDTO>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync();

            if (personDTO == null)
            {
                return NotFound();
            }

            return Ok(personDTO);

        }

        // POST: api/Person
        [HttpPost]
        public async Task<ActionResult<PersonCreateDTO>> CreatePerson(PersonCreateDTO personCreateDTO)
        {
            // Stap 1: Map de basisgegevens van de DTO naar de entiteit
            var person = _mapper.Map<Person>(personCreateDTO);

            // Stap 2: Genereer Salt en Hash voor het wachtwoord
            if (!string.IsNullOrEmpty(personCreateDTO.Password))
            {
                person.Salt = PasswordHelper.GenerateSalt();
                person.PasswordHash = PasswordHelper.HashPassword(personCreateDTO.Password, person.Salt);
            }
            else
            {
                return BadRequest("Password is required.");
            }

            // Stap 3: Voeg de persoon toe aan de context en sla op
            _context.Persons.Add(person);
            await _context.SaveChangesAsync();

            // Stap 4: Map de opgeslagen entiteit terug naar de DTO
            var personToReturn = _mapper.Map<PersonCreateDTO>(person);

            return CreatedAtAction(nameof(GetPerson), new { id = person.Id }, personToReturn);
        }


        // PUT: api/Person/id
        [HttpPut("{id}")]
        public async Task<IActionResult> EditPerson(int id, PersonUpdateDTO personUpdateDTO)
        {
            if (id != personUpdateDTO.Id)
            {
                return BadRequest();
            }

            var person = await _context.Persons.FindAsync(id);

            if (person == null)
            {
                return NotFound();
            }

            // Map de geüpdatete gegevens naar het bestaande persoon
            _mapper.Map(personUpdateDTO, person);

            _context.Entry(person).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PersonExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }
        // PUT: api/Person/{id}/password
        [HttpPut("{id}/password")]
        public async Task<IActionResult> UpdatePassword(int id, [FromBody] UpdatePasswordDTO updatePasswordDTO)
        {
            if (id != updatePasswordDTO.Id)
            {
                return BadRequest("ID in de URL komt niet overeen met het ID in de body.");
            }

            // Zoek de persoon in de database
            var person = await _context.Persons.FindAsync(id);
            if (person == null)
            {
                return NotFound($"Persoon met ID {id} niet gevonden.");
            }

            // Controleer of een huidig wachtwoord is opgegeven
            if (!string.IsNullOrWhiteSpace(updatePasswordDTO.CurrentPassword))
            {
                // Controleer of het huidige wachtwoord klopt
                var isCurrentPasswordValid = PasswordHelper.VerifyPassword(updatePasswordDTO.CurrentPassword, person.PasswordHash, person.Salt);
                if (!isCurrentPasswordValid)
                {
                    return BadRequest("Het huidige wachtwoord is onjuist.");
                }
            }

            // Update het wachtwoord met een nieuwe salt en hash
            person.Salt = PasswordHelper.GenerateSalt();
            person.PasswordHash = PasswordHelper.HashPassword(updatePasswordDTO.NewPassword, person.Salt);

            _context.Entry(person).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return NoContent(); // Wachtwoord succesvol gewijzigd
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Fout bij het bijwerken van het wachtwoord: {ex.Message}");
            }
        }



        // DELETE: api/Person/id
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePerson(int id)
        {
            var person = await _context.Persons.FindAsync(id);
            if (person == null)
            {
                return NotFound();
            }

            _context.Persons.Remove(person);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PersonExists(int id)
        {
            return _context.Persons.Any(e => e.Id == id);
        }

        // GET: api/Person/search
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<PersonBaseDTO>>> SearchPersons(int? teamId, int? specialityId, int? gradeId)
        {
            var query = _context.Persons.AsQueryable();

            if (teamId.HasValue)
            {
                query = query.Where(p => p.TeamId == teamId.Value);
            }

            if (specialityId.HasValue)
            {
                query = query.Where(p => p.SpecialityId == specialityId.Value);
            }

            if (gradeId.HasValue)
            {
                query = query.Where(p => p.GradeId == gradeId.Value);
            }

            var personDTOs = await query
                .ProjectTo<PersonBaseDTO>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return Ok(personDTOs);
        }

        // POST: api/Person/dayoff
        [HttpPost("dayoff")]
        public async Task<ActionResult> AddDayOff(PersonDayOffDTO personDayOffDTO)
        {
            // Zoek de persoon in de database
            var person = await _context.Persons
                .Include(p => p.DayOffs)
                .FirstOrDefaultAsync(p => p.Id == personDayOffDTO.PersonId);

            if (person == null)
            {
                return NotFound($"Person with ID {personDayOffDTO.PersonId} not found.");
            }

            // Maak een nieuwe DayOff entiteit aan en voeg deze toe aan de persoon
            var dayOff = new DayOff
            {
                Date = personDayOffDTO.DayOffDate,

            };

            person.DayOffs.Add(dayOff);

            // Sla de wijzigingen op in de database
            await _context.SaveChangesAsync();

            return Ok("Day off successfully added.");
        }


        [HttpPut("dayoffs")]
        public async Task<ActionResult> UpdateDayOffs(int personId, List<PersonDayOffDTO> newDayOffs)
        {


            var person = await _context.Persons
                .Include(p => p.DayOffs)
                .FirstOrDefaultAsync(p => p.Id == personId);

            if (person == null)
            {
                return NotFound($"Person with ID {personId} not found.");
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {

                if (newDayOffs == null || !newDayOffs.Any())
                {
                    // Als er geen nieuwe dayOffs zijn, verwijder alle bestaande
                    if (person.DayOffs.Any())
                    {
                        _context.DayOffs.RemoveRange(person.DayOffs);
                        person.DayOffs.Clear();
                        await _context.SaveChangesAsync();
                    }

                    await transaction.CommitAsync();
                    return Ok(new { Message = "All day offs successfully removed." });
                }

                // Verwijder dagen die niet meer in de nieuwe lijst staan
                var newDates = newDayOffs.Select(dto => dto.DayOffDate).ToList();
                var dayOffsToRemove = person.DayOffs.Where(dayOff => !newDates.Contains(dayOff.Date)).ToList();
                foreach (var dayOff in dayOffsToRemove)
                {
                    person.DayOffs.Remove(dayOff);
                }

                // Voeg nieuwe dagen toe
                foreach (var dayOffDTO in newDayOffs)
                {
                    if (!person.DayOffs.Any(dayOff => dayOff.Date == dayOffDTO.DayOffDate))
                    {
                        person.DayOffs.Add(new DayOff
                        {
                            Date = dayOffDTO.DayOffDate
                        });
                    }
                }

                // Sla wijzigingen op
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new
                {
                    Message = "Day offs successfully updated.",
                    UpdatedDayOffs = person.DayOffs.Select(d => new
                    {
                        d.Id,
                        d.Date
                    }).ToList()
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }



        // GET: api/Person/{personId}/dayoffs
        [HttpGet("{personId}/dayoffs")]
        public async Task<ActionResult<IEnumerable<PersonDayOffDTO>>> GetDayOffsByPersonId(int personId)
        {
            var person = await _context.Persons
                .Include(p => p.DayOffs)
                .FirstOrDefaultAsync(p => p.Id == personId);

            if (person == null)
            {
                return NotFound($"Person with ID {personId} not found.");
            }

            var dayOffs = person.DayOffs.Select(dayOff => new PersonDayOffDTO
            {
                PersonId = personId,
                DayOffDate = dayOff.Date,
             
            });

            return Ok(dayOffs);
        }


    }
}
