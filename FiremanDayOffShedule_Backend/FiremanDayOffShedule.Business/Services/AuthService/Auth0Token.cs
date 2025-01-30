using FiremanDayOffShedule.DataContracts.DTO.AuthDTO;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Json;


namespace FiremanDayOffShedule.Business.Services.AuthService
{
    public class Auth0Token
    {
        private readonly ConfigurationBuilder _configurationBuilder;
        private readonly string _auth0Identifier;
        private readonly string _auth0Audience;
        private readonly string _auth0ClientId;
        private readonly string _auth0ClientSecret;

        public Auth0Token(string auth0Identifier, string auth0Audience, string auth0ClientId, string auth0ClientSecret, IConfiguration configuration)
        {

           
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

            if (result == null || string.IsNullOrEmpty(result.AccessToken))
            {
                throw new Exception("Failed to get Accesstoken.");
            }
            return result.AccessToken;
        }
    }
}
