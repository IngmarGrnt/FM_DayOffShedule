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
using System.Net.Http.Headers;
using System.Text.Json.Serialization;

namespace FirmanDayOffShedule.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PersonController : ControllerBase
    {
        private readonly DBFirmanDayOffShedule _context;
        private readonly IMapper _mapper;
        private readonly IHttpClientFactory _httpClientFactory;


        public PersonController(DBFirmanDayOffShedule context, IMapper mapper, IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _mapper = mapper;
            _httpClientFactory = httpClientFactory;
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
        // GET: api/Person/id
        [HttpGet("AuthZero")]
        public async Task<ActionResult<Person>> GetPersonAuthZero(string Auth0Id)
        {
            var personDTO = await _context.Persons
            .Where(p => p.Auth0Id == Auth0Id)
            .ProjectTo<PersonDetailDTO>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync();

            if (personDTO == null)
            {
                return NotFound();
            }

            return Ok(personDTO);

        }

        //// POST: api/Person
        //[HttpPost]
        //public async Task<ActionResult<PersonCreateDTO>> CreatePerson(PersonCreateDTO personCreateDTO)
        //{
        //    // Stap 1: Map de basisgegevens van de DTO naar de entiteit
        //    var person = _mapper.Map<Person>(personCreateDTO);

        //    // Stap 2: Genereer Salt en Hash voor het wachtwoord
        //    if (!string.IsNullOrEmpty(personCreateDTO.Password))
        //    {
        //        person.Salt = PasswordHelper.GenerateSalt();
        //        person.PasswordHash = PasswordHelper.HashPassword(personCreateDTO.Password, person.Salt);
        //    }
        //    else
        //    {
        //        return BadRequest("Password is required.");
        //    }

        //    // Stap 3: Voeg de persoon toe aan de context en sla op
        //    _context.Persons.Add(person);
        //    await _context.SaveChangesAsync();

        //    // Stap 4: Map de opgeslagen entiteit terug naar de DTO
        //    var personToReturn = _mapper.Map<PersonCreateDTO>(person);

        //    return CreatedAtAction(nameof(GetPerson), new { id = person.Id }, personToReturn);
        //}


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
        //[HttpPut("{id}/password")]
        //public async Task<IActionResult> UpdatePassword(int id, [FromBody] UpdatePasswordDTO updatePasswordDTO)
        //{
        //    if (id != updatePasswordDTO.Id)
        //    {
        //        return BadRequest("ID in de URL komt niet overeen met het ID in de body.");
        //    }

        //    // Zoek de persoon in de database
        //    var person = await _context.Persons.FindAsync(id);
        //    if (person == null)
        //    {
        //        return NotFound($"Persoon met ID {id} niet gevonden.");
        //    }

        //    // Controleer of een huidig wachtwoord is opgegeven
        //    if (!string.IsNullOrWhiteSpace(updatePasswordDTO.CurrentPassword))
        //    {
        //        // Controleer of het huidige wachtwoord klopt
        //        var isCurrentPasswordValid = PasswordHelper.VerifyPassword(updatePasswordDTO.CurrentPassword, person.PasswordHash, person.Salt);
        //        if (!isCurrentPasswordValid)
        //        {
        //            return BadRequest("Het huidige wachtwoord is onjuist.");
        //        }
        //    }

        //    // Update het wachtwoord met een nieuwe salt en hash
        //    person.Salt = PasswordHelper.GenerateSalt();
        //    person.PasswordHash = PasswordHelper.HashPassword(updatePasswordDTO.NewPassword, person.Salt);

        //    _context.Entry(person).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //        return NoContent(); // Wachtwoord succesvol gewijzigd
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, $"Fout bij het bijwerken van het wachtwoord: {ex.Message}");
        //    }
        //}



        // DELETE: api/Person/id

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email))
            {
                return BadRequest(new { message = "E-mailadres is verplicht." });
            }

            // Stuur de resetaanvraag naar Auth0
            var client = _httpClientFactory.CreateClient();
            var auth0Token = await GetAuth0TokenAsync(); // Haal het Auth0-token op

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", auth0Token);

            var resetPayload = new
            {
                client_id = "oRibFlp2kGnnOmxNd9HWqUni6ymhCWbX",
                email = request.Email,
                connection = "Username-Password-Authentication"
            };

            var response = await client.PostAsJsonAsync("https://dev-h38sgv74fxg1ziwv.us.auth0.com/dbconnections/change_password", resetPayload);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                return BadRequest($"Fout bij het resetten van wachtwoord: {errorContent}");
            }

            return Ok(new { message = "Reset-e-mail verzonden." });
        }


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

        //#################################################################################################################################

        [HttpPost]
        public async Task<ActionResult<PersonCreateDTO>> CreatePerson(PersonCreateDTO personCreateDTO)
        {
            // Stap 1: Map de basisgegevens van de DTO naar de entiteit
            var person = _mapper.Map<Person>(personCreateDTO);

            // Stap 3: Maak een gebruiker aan in Auth0
            var auth0User = new
            {
                email = personCreateDTO.EmailAdress,
                password = personCreateDTO.Password,
                connection = "Username-Password-Authentication",
                given_name = personCreateDTO.FirstName,
                family_name = personCreateDTO.LastName
            };

            var auth0Token = await GetAuth0TokenAsync(); // Haal het Auth0-token op

            using var client = new HttpClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", auth0Token);

            var response = await client.PostAsJsonAsync("https://dev-h38sgv74fxg1ziwv.us.auth0.com/api/v2/users", auth0User);
            if (!response.IsSuccessStatusCode)
            {
                return BadRequest("Failed to create user in Auth0.");
            }

            var auth0Result = await response.Content.ReadFromJsonAsync<Auth0UserResponse>();
            person.Auth0Id = auth0Result.UserId; // Sla het Auth0Id op in de database

            // Stap 4: Voeg de persoon toe aan de context en sla op
            _context.Persons.Add(person);
            await _context.SaveChangesAsync();

            // Stap 5: Map de opgeslagen entiteit terug naar de DTO
            var personToReturn = _mapper.Map<PersonCreateDTO>(person);

            return CreatedAtAction(nameof(GetPerson), new { id = person.Id }, personToReturn);
        }

        private async Task<string> GetAuth0TokenAsync()
        {
            using var client = new HttpClient();
            var tokenRequest = new
            {
                client_id = "oRibFlp2kGnnOmxNd9HWqUni6ymhCWbX",
                client_secret = "9qkdpTg1PD41p9iBr8ld1ubxX9n-0BAn9RU8e2CsB0OgCWq7US7Xqi89KWB_-gVp",
                audience = "https://dev-h38sgv74fxg1ziwv.us.auth0.com/api/v2/",
                grant_type = "client_credentials"
            };

            var response = await client.PostAsJsonAsync("https://dev-h38sgv74fxg1ziwv.us.auth0.com/oauth/token", tokenRequest);
            response.EnsureSuccessStatusCode();

            var result = await response.Content.ReadFromJsonAsync<Auth0TokenResponse>();
            return result.AccessToken;
        }

        public class Auth0UserResponse
        {
            [JsonPropertyName("user_id")]
            public string UserId { get; set; }
        }

        public class Auth0TokenResponse
        {
            [JsonPropertyName("access_token")]
            public string AccessToken { get; set; }
        }
        public class ResetPasswordRequest
        {
            public string Email { get; set; }
        }


    }
}
