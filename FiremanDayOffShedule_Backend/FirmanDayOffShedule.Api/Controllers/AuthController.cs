using AutoMapper;
using FiremanDayOffShedule.Dal.Context;
using FirmanDayOffShedule.Api.DTO.LoginDTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace FirmanDayOffShedule.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly DBFirmanDayOffShedule _context;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;

        public AuthController(DBFirmanDayOffShedule context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto loginDto)
        {
            // Zoek gebruiker op basis van e-mailadres
            var user = _context.Persons.SingleOrDefault(u => u.EmailAdress == loginDto.Email);
            if (user == null) return Unauthorized("User not found");

            // Verifieer wachtwoord
            var hashedPassword = PasswordHelper.HashPassword(loginDto.Password, user.Salt);
            if (hashedPassword != user.PasswordHash) return Unauthorized("Invalid password");

            // Genereer JWT-token
            var token = GenerateJwtToken(user.EmailAdress);
            return Ok(new { token });
        }

        private string GenerateJwtToken(string username)
        {
            //var jwtKey = _configuration["Jwt:Key"];
            //var jwtIssuer = _configuration["Jwt:Issuer"];
            //var jwtAudience = _configuration["Jwt:Audience"];
            var jwtKey = "your-very-secure-key-which-is-long-enough";
            var jwtIssuer = "https://localhost:7130";
            var jwtAudience = "https://localhost:7130";

            // Controleer of de configuratiewaarden correct zijn ingesteld
            if (string.IsNullOrEmpty(jwtKey))
            {
                throw new InvalidOperationException("JWT key is missing or not configured.");
            }
            if (string.IsNullOrEmpty(jwtIssuer))
            {
                throw new InvalidOperationException("JWT issuer is missing or not configured.");
            }
            if (string.IsNullOrEmpty(jwtAudience))
            {
                throw new InvalidOperationException("JWT audience is missing or not configured.");
            }
            if (string.IsNullOrEmpty(username))
            {
                throw new ArgumentNullException(nameof(username), "Username cannot be null or empty.");
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: new[] { new Claim(ClaimTypes.Name, username) },
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }



}
