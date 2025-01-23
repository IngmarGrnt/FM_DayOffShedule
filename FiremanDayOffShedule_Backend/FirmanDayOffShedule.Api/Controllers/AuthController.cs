

using FiremanDayOffShedule.DataContracts.DTO.AuthDTO;
using FiremanDayOffShedule.DataContracts.DTO.PersonDTO;
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


        //POST: apio/Auth/login
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



        //POST: apio/Auth/CreateAuth0User
        [HttpPost("create-auth0-user")]
        public async Task<IActionResult> CreateAuth0User([FromBody] CreateAuth0PersonDto personDto)
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

        // DELETE: api/Auth/delete-auth0-user/{auth0Id}
        [HttpDelete("delete-auth0-user/{auth0Id}")]
        public async Task<IActionResult> DeleteAuth0User(string auth0Id)
        {
            if (string.IsNullOrEmpty(auth0Id))
            {
                return BadRequest("Auth0Id is verplicht.");
            }

            // Haal een token op van Auth0
            var token = await GetAuth0TokenAsync();

            // Stuur een DELETE-verzoek naar Auth0
            var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await client.DeleteAsync($"https://dev-h38sgv74fxg1ziwv.us.auth0.com/api/v2/users/{auth0Id}");

            if (!response.IsSuccessStatusCode)
            {
                var errorMessage = await response.Content.ReadAsStringAsync();
                return BadRequest($"Fout bij het verwijderen van de gebruiker in Auth0: {errorMessage}");
            }

            return NoContent(); // 204 No Content, omdat de gebruiker succesvol is verwijderd
        }


    }

}


