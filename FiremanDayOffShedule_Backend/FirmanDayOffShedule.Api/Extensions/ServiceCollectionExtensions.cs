using FiremanDayOffShedule.Dal.Context;
using Microsoft.EntityFrameworkCore;

namespace FirmanDayOffShedule.Api.Extensions
{
    public static class ServiceCollectionExtensions
    {

        public static IServiceCollection AddDbContextOptions(this IServiceCollection services, ConfigurationManager configuration)
        {
            services.AddDbContext<DBFirmanDayOffShedule>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));
            return services;


        }
    }
}
