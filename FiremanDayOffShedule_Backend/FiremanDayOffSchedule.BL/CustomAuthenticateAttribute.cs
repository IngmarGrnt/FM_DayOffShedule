using FiremanDayOffSchedule.BL.Interfaces;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http.Filters;

public class CustomAuthenticateAttribute //: ActionFilterAttribute, IAuthenticationFilter
{
    //public IAuthenticationService AuthenticationService { get; set; }
    //public ICacheService CacheService { get; set; }
    //public IJwtManager JwtManager { get; set; }

    //public Task AuthenticateAsync(HttpAuthenticationContext context, CancellationToken cancellationToken)
    //{
    //    var authorizationHeader = context.Request.Headers.Authorization;

    //    if (authorizationHeader != null && authorizationHeader.Scheme == "Bearer")
    //    {
    //        var jwtToken = authorizationHeader.Parameter;

    //        if (!string.IsNullOrEmpty(jwtToken))
    //        {
    //            try
    //            {
    //                var token = JwtManager.GetToken(jwtToken);

    //                if (token != null)
    //                {
    //                    var identity = CreateCustomIdentity(token.Claims);
    //                    var principal = new ClaimsPrincipal(identity);
    //                    context.Principal = principal;
    //                }
    //            }
    //            catch
    //            {
    //                // Token is ongeldig of parsing is mislukt
    //            }
    //        }
    //    }

    //    if (context.Principal == null)
    //    {
    //        context.ErrorResult = new AuthenticationFailureResult("Unauthorized", context.Request);
    //    }

    //    return Task.FromResult(0);
    //}

    //public Task ChallengeAsync(HttpAuthenticationChallengeContext context, CancellationToken cancellationToken)
    //{
    //    // Voeg uitdaging toe aan de respons indien nodig
    //    return Task.FromResult(0);
    //}

    //private CustomIdentity CreateCustomIdentity(IEnumerable<Claim> claims)
    //{
    //    var userId = int.Parse(claims.FirstOrDefault(c => c.Type == ClaimTypes.Sid)?.Value ?? "0");
    //    var companyId = int.Parse(claims.FirstOrDefault(c => c.Type == "company")?.Value ?? "0");

    //    var roles = GetRoles(companyId, userId);

    //    return new CustomIdentity(
    //        userId,
    //        companyId,
    //        int.TryParse(claims.FirstOrDefault(c => c.Type == "office")?.Value, out int officeId) ? officeId : (int?)null,
    //        claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value ?? string.Empty,
    //        claims.FirstOrDefault(c => c.Type == "language")?.Value ?? string.Empty,
    //        bool.TryParse(claims.FirstOrDefault(c => c.Type == "member")?.Value, out bool isMember) && isMember,
    //        roles);
    //}

    //private IEnumerable<string> GetRoles(int companyId, int userId)
    //{
    //    var cacheKey = $"roles_{userId}";

    //    if (!CacheService.HasValue(companyId, cacheKey))
    //    {
    //        var roles = AuthenticationService.GetPermissions(userId);
    //        CacheService.AddOrUpdate(companyId, cacheKey, roles, TimeSpan.FromDays(1));
    //    }

    //    return CacheService.GetValue(companyId, cacheKey) as IEnumerable<string> ?? Enumerable.Empty<string>();
    }
}
