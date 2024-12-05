using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace FiremanDayOffSchedule.BL.Interfaces
{
    public interface IJwtManager
    {
        string GenerateToken(IEnumerable<Claim> claims, TimeSpan expiration);
        ClaimsPrincipal ValidateToken(string token); // Controleert of het token geldig is
        IEnumerable<Claim> GetTokenClaims(string token); // Haalt claims op uit een token
    }

}
