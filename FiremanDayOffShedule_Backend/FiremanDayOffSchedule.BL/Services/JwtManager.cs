using FiremanDayOffSchedule.BL.Interfaces;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace FiremanDayOffSchedule.BL.Services
{
    public class JwtManager : IJwtManager
    {
        private readonly string _secretKey;

        public JwtManager(string secretKey)
        {
            _secretKey = secretKey;
        }

        public string GenerateToken(IEnumerable<Claim> claims, TimeSpan expiration)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.Add(expiration),
                SigningCredentials = credentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public ClaimsPrincipal ValidateToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey)),
                ValidateIssuer = false,
                ValidateAudience = false
            };

            return tokenHandler.ValidateToken(token, validationParameters, out _);
        }

        public IEnumerable<Claim> GetTokenClaims(string token)
        {
            var principal = ValidateToken(token);
            return principal?.Claims ?? Enumerable.Empty<Claim>();
        }
    }

}
