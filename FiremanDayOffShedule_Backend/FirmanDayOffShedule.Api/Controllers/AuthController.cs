using AutoMapper;
using FiremanDayOffShedule.Dal.Context;
using FiremanDayOffShedule.Dal.Entities;
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

        public AuthController(DBFirmanDayOffShedule context, IMapper mapper,IConfiguration configuration)
        {
            _context = context;
            _mapper = mapper;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto loginDto)
        {
            try
            {
                // Zoek gebruiker op basis van e-mailadres
                var person = _context.Persons
                    .Include(u => u.Role)
                    .SingleOrDefault(u => u.EmailAdress == loginDto.Email);
                if (person == null) return Unauthorized("User not found");

                // Verifieer wachtwoord
                var hashedPassword = PasswordHelper.HashPassword(loginDto.Password, person.Salt);
                if (hashedPassword != person.PasswordHash) return Unauthorized("Invalid password");

                // Genereer JWT-token
                var token = GenerateJwtToken(person.EmailAdress, person.Role.Name, person.Id);
                return Ok(new { token, userId = person.Id });
            }
            catch (Exception ex) { 
            
            
            throw new Exception(ex.ToString()); 
            }
          

        }

        private string GenerateJwtToken(string username,string role,int userId)
        {
            try
            {
                var jwtKey = _configuration["Jwt:Key"];
                var jwtIssuer = _configuration["Jwt:Issuer"];
                var jwtAudience = _configuration["Jwt:Audience"];


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


                var claims = new[]
                {
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Role, role),
                new Claim("userId", userId.ToString())
             };


                var token = new JwtSecurityToken(
                    issuer: jwtIssuer,
                    audience: jwtAudience,
                    claims: claims,
                    expires: DateTime.Now.AddMinutes(30),
                    signingCredentials: creds);

                return new JwtSecurityTokenHandler().WriteToken(token);

            }
            catch (Exception ex) {

                throw new Exception(ex.ToString());

            }


        }

    }



}
