

using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Text.Json.Serialization;

namespace FirmanDayOffShedule.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class AuthController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public AuthController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest("Gebruikersnaam en wachtwoord zijn verplicht.");
            }

            var client = _httpClientFactory.CreateClient();

            var authPayload = new
            {
                grant_type = "password",
                client_id = "oRibFlp2kGnnOmxNd9HWqUni6ymhCWbX",
                client_secret = "9qkdpTg1PD41p9iBr8ld1ubxX9n-0BAn9RU8e2CsB0OgCWq7US7Xqi89KWB_-gVp", 
                username = request.Username,
                password = request.Password,
                audience = "https://dev-h38sgv74fxg1ziwv.us.auth0.com/api/v2/",
                scope = "openid profile email"
            };

            var response = await client.PostAsJsonAsync("https://dev-h38sgv74fxg1ziwv.us.auth0.com/oauth/token", authPayload);

            if (!response.IsSuccessStatusCode)
            {
                var errorMessage = await response.Content.ReadAsStringAsync();
                return BadRequest($"Fout bij inloggen: {errorMessage}");
            }

            var tokenResponse = await response.Content.ReadFromJsonAsync<TokenResponse>();
            return Ok(tokenResponse);
        }
        public class LoginRequest
        {
            public string Username { get; set; }
            public string Password { get; set; }
        }

        public class TokenResponse
        {
            [JsonPropertyName("access_token")]
            public string AccessToken { get; set; }

            [JsonPropertyName("id_token")]
            public string IdToken { get; set; }

            [JsonPropertyName("expires_in")]
            public int ExpiresIn { get; set; }

            [JsonPropertyName("token_type")]
            public string TokenType { get; set; }
        }


        [HttpPost("create-auth0-user")]
        public async Task<IActionResult> CreateAuth0User([FromBody] CreatePersonDto personDto)
        {
            // 1. Haal een token op van Auth0
            var token = await GetAuth0TokenAsync();

            // 2. Maak een Auth0-gebruiker aan
            var auth0User = new
            {
                email = personDto.Email,
                password = personDto.Password,
                connection = "Username-Password-Authentication",
                given_name = personDto.FirstName,
                family_name = personDto.LastName
            };

            var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await client.PostAsJsonAsync("https://dev-h38sgv74fxg1ziwv.us.auth0.com/api/v2/users", auth0User);

            if (!response.IsSuccessStatusCode)
            {
                return BadRequest("Fout bij het aanmaken van de gebruiker in Auth0");
            }

            var result = await response.Content.ReadFromJsonAsync<Auth0UserResponse>();
            var auth0Id = result.UserId; // Auth0-ID

            // 3. Sla de gebruiker op in de database (incl. Auth0Id)
            // (Hier voeg je je logica toe om een gebruiker in de database op te slaan)

            return Ok(new { Auth0Id = auth0Id });
        }

        private async Task<string> GetAuth0TokenAsync()
        {
            var client = _httpClientFactory.CreateClient();

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

        public class Auth0TokenResponse
        {
            [JsonPropertyName("access_token")]
            public string AccessToken { get; set; }
        }

        public class Auth0UserResponse
        {
            [JsonPropertyName("user_id")]
            public string UserId { get; set; }
        }
    }

    public class CreatePersonDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }


    //    [HttpGet("userinfo/{userId}")]
    //    [Authorize]
    //    public IActionResult GetUserInfo(string userId)
    //    {
    //        // Debug: Log claims
    //        foreach (var claim in User.Claims)
    //        {
    //            Console.WriteLine($"{claim.Type}: {claim.Value}");
    //        }

    //        var loggedInUserId = User.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;

    //        if (loggedInUserId == null)
    //        {
    //            return Unauthorized("Gebruiker is niet geauthenticeerd.");
    //        }

    //        if (!string.Equals(loggedInUserId, userId, StringComparison.OrdinalIgnoreCase))
    //        {
    //            return Forbid("Je hebt geen toegang tot deze gebruiker.");
    //        }

    //        return Ok(new { UserId = loggedInUserId });
    //    }




    //    [HttpPost("login")]
    //    public IActionResult Login([FromBody] LoginRequest request)
    //    {
    //        // Dit endpoint wordt normaliter gebruikt als je een eigen authenticatiesysteem hebt.
    //        // Voor Auth0 gebeurt de login direct via de frontend.
    //        return BadRequest("Login wordt beheerd via Auth0.");
    //    }
    //}

    //// DTO voor login (indien nodig)
    //public class LoginRequest
    //{
    //    public string Username { get; set; }
    //    public string Password { get; set; }
    //}
}




    //public class AuthController : ControllerBase
    //{
    //    private readonly DBFirmanDayOffShedule _context;
    //    private readonly IMapper _mapper;
    //    private readonly IConfiguration _configuration;

    //    public AuthController(DBFirmanDayOffShedule context, IMapper mapper,IConfiguration configuration)
    //    {
    //        _context = context;
    //        _mapper = mapper;
    //        _configuration = configuration;
    //    }

    //    [HttpPost("login")]
    //    public IActionResult Login([FromBody] LoginDto loginDto)
    //    {
    //        try
    //        {
    //            // Zoek gebruiker op basis van e-mailadres
    //            var person = _context.Persons
    //                .Include(u => u.Role)
    //                .SingleOrDefault(u => u.EmailAdress == loginDto.Email);
    //            if (person == null) return Unauthorized("User not found");

    //            // Verifieer wachtwoord
    //            var hashedPassword = PasswordHelper.HashPassword(loginDto.Password, person.Salt);
    //            if (hashedPassword != person.PasswordHash) return Unauthorized("Invalid password");

    //            // Genereer JWT-token
    //            var token = GenerateJwtToken(person.EmailAdress, person.Role.Name, person.Id);
    //            return Ok(new { token, userId = person.Id });
    //        }
    //        catch (Exception ex) { 


    //        throw new Exception(ex.ToString()); 
    //        }


    //    }

    //    private string GenerateJwtToken(string username,string role,int userId)
    //    {
    //        try
    //        {
    //            var jwtKey = _configuration["Jwt:Key"];
    //            var jwtIssuer = _configuration["Jwt:Issuer"];
    //            var jwtAudience = _configuration["Jwt:Audience"];


    //            if (string.IsNullOrEmpty(jwtKey))
    //            {
    //                throw new InvalidOperationException("JWT key is missing or not configured.");
    //            }
    //            if (string.IsNullOrEmpty(jwtIssuer))
    //            {
    //                throw new InvalidOperationException("JWT issuer is missing or not configured.");
    //            }
    //            if (string.IsNullOrEmpty(jwtAudience))
    //            {
    //                throw new InvalidOperationException("JWT audience is missing or not configured.");
    //            }
    //            if (string.IsNullOrEmpty(username))
    //            {
    //                throw new ArgumentNullException(nameof(username), "Username cannot be null or empty.");
    //            }

    //            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
    //            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);


    //            var claims = new[]
    //            {
    //            new Claim(ClaimTypes.Name, username),
    //            new Claim(ClaimTypes.Role, role),
    //            new Claim("userId", userId.ToString())
    //         };


    //            var token = new JwtSecurityToken(
    //                issuer: jwtIssuer,
    //                audience: jwtAudience,
    //                claims: claims,
    //                expires: DateTime.Now.AddMinutes(30),
    //                signingCredentials: creds);

    //            return new JwtSecurityTokenHandler().WriteToken(token);

    //        }
    //        catch (Exception ex) {

    //            throw new Exception(ex.ToString());

    //        }


    //    }

    //}




