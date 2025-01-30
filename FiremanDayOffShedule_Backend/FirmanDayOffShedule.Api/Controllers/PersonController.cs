using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FiremanDayOffShedule.Dal.Context;
using FiremanDayOffShedule.Dal.Entities;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using System.Net.Http.Headers;
using FiremanDayOffShedule.DataContracts.DTO.PersonDTO;
using FiremanDayOffShedule.DataContracts.DTO;
using FiremanDayOffShedule.DataContracts.DTO.AuthDTO;


namespace FirmanDayOffShedule.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PersonController : ControllerBase
    {
        private readonly DBFirmanDayOffShedule _context;
        private readonly IMapper _mapper;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ConfigurationBuilder _configurationBuilder;
        private readonly string _auth0Identifier;
        private readonly string _auth0Audience;
        private readonly string _auth0ClientId;
        private readonly string _auth0ClientSecret;


        public PersonController(DBFirmanDayOffShedule context, IMapper mapper, IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _context = context;
            _mapper = mapper;
            _httpClientFactory = httpClientFactory;


            if(configuration == null)
            {
                throw new ArgumentNullException(nameof(configuration));
            }
            _auth0Identifier = configuration.GetValue<string>("Auth0Identifier");
            _auth0Audience = configuration.GetValue<string>("Auth0Audience");
            _auth0ClientId = configuration.GetValue<string>("Auth0ClientId");
            _auth0ClientSecret = configuration.GetValue<string>("AuthClientSecret");

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

        // GET: api/Person/Auth0Id
        [HttpGet("Auth0Id")]
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

        // POST: api/Person
        [HttpPost]
        public async Task<ActionResult<PersonCreateDTO>> CreatePerson(PersonCreateDTO personCreateDTO)
        {
            // Stap 1: Map de basisgegevens van de DTO naar de entiteit
            var person = _mapper.Map<Person>(personCreateDTO);

            // Stap 2: Haal de rolnaam op basis van de RoleId
            var roleName = await _context.Roles
                .Where(r => r.Id == personCreateDTO.RoleId)
                .Select(r => r.Name.ToLower())
                .FirstOrDefaultAsync();

            if (string.IsNullOrEmpty(roleName))
            {
                return BadRequest("Invalid RoleId. Role not found.");
            }

            // Stap 3: Maak een gebruiker aan in Auth0
            var auth0User = new
            {
                email = personCreateDTO.EmailAdress,
                password = personCreateDTO.Password,
                connection = "Username-Password-Authentication",
                given_name = personCreateDTO.FirstName,
                family_name = personCreateDTO.LastName,
                app_metadata = new
                {
                    role = roleName // Gebruik de rolnaam in plaats van RoleId
                }

            };

            var auth0Token = await GetAuth0TokenAsync(); // Haal het Auth0-token op

            using var client = new HttpClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", auth0Token);

            var response = await client.PostAsJsonAsync($"{_auth0Audience}users", auth0User);
            if (!response.IsSuccessStatusCode)
            {
                return BadRequest("Failed to create user in Auth0.");
            }

            var auth0Result = await response.Content.ReadFromJsonAsync<Auth0UserResponse>();

            if (auth0Result == null || string.IsNullOrEmpty(auth0Result.UserId))
            {
                return BadRequest("Failed to create user in Auth0 in DB.");
            }
            person.Auth0Id = auth0Result.UserId; // Sla het Auth0Id op in de database

            // Stap 4: Voeg de persoon toe aan de context en sla op
            _context.Persons.Add(person);
            await _context.SaveChangesAsync();

            // Stap 5: Map de opgeslagen entiteit terug naar de DTO
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

        // POST: api/Person/reset-password
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
                client_id = _auth0ClientId,
                email = request.Email,
                connection = "Username-Password-Authentication"
            };

            var response = await client.PostAsJsonAsync($"{_auth0Identifier}dbconnections/change_password", resetPayload);

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

            if (!string.IsNullOrEmpty(person.Auth0Id))
            {
                // Verwijder de gebruiker in Auth0
                var authController = new AuthController(_httpClientFactory);
                var auth0DeleteResult = await authController.DeleteAuth0User(person.Auth0Id);

                if (auth0DeleteResult is BadRequestObjectResult badRequest)
                {
                    return StatusCode(500, $"Auth0-gebruiker kon niet worden verwijderd: {badRequest.Value}");
                }
            }

            // Verwijder de persoon in de database
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

        // GET: api/Person/with-dayoffs
        [HttpGet("with-dayoffs")]
        public async Task<ActionResult<IEnumerable<PersonWithDayOffDTO>>> GetPersonsWithDayOffs(string? speciality,int teamId)
        {
            try
            {
                // Haal alle personen op en filter eventueel op specialiteit
                var query = _context.Persons
                    .Include(p => p.DayOffs) // Include de navigatie-eigenschap DayOffs
                    .Include(p => p.Speciality) // Include Speciality als dit een gerelateerde entiteit is
                    .Include(p => p.DayOffStart)
                    .Include (p=> p.Team)// Include DayOffStart als dit een gerelateerde entiteit is
                    .AsQueryable();

                if (!string.IsNullOrEmpty(speciality) )
                {
                    query = query.Where(p =>
                        p.Speciality != null &&
                        p.Speciality.Name == speciality &&
                        p.Team != null &&
                        p.Team.Id == teamId
                    );
                }

                    var persons = await query.ToListAsync();

                // Combineer data
                var result = persons.Select(person =>
                {
                    var dayOffBase = person.DayOffStart?.DayOffBase ?? 0; // Gebruik 0 als DayOffStart of DayOffBase null is

                    var dayOffs = person.DayOffs?.Select(d => d.Date.ToString("yyyy-MM-dd")).ToList() ?? new List<string>();

                    var dayOffsCount = dayOffs.Count;   

                    return new PersonWithDayOffDTO
                    {
                        Id = person.Id,
                        Name = $"{person.FirstName} {person.LastName}",
                        SpecialityName = person.Speciality?.Name ?? "Onbekend", // Gebruik "Onbekend" als Speciality null is
                        DayOffBase = dayOffBase,
                        DayOffCount = dayOffsCount, 
                        DayOffs = dayOffs
                    };
                });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Er is een fout opgetreden: {ex.Message}");
            }
        }


        private async Task<string> GetAuth0TokenAsync()
        {
            using var client = new HttpClient();
            var tokenRequest = new
            {
                client_id = _auth0ClientId,
                client_secret = _auth0ClientSecret,
                audience = _auth0Audience,
                grant_type = "client_credentials"
            };

            var response = await client.PostAsJsonAsync($"{_auth0Identifier}oauth/token", tokenRequest);
            response.EnsureSuccessStatusCode();

            var result = await response.Content.ReadFromJsonAsync<Auth0TokenResponse>();

            if(result == null || string.IsNullOrEmpty(result.AccessToken))
            {
                throw new Exception("Failed to get Accesstoken.");
            }   
            return result.AccessToken;
        }





    }
}
