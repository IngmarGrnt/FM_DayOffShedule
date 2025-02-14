using FiremanDayOffShedule.Business.Mappings;
using FiremanDayOffShedule.Dal.Context;
using FiremanDayOffShedule.DataContracts.DTO.AdminDTO;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Text.Json.Serialization;

namespace FirmanDayOffShedule.Api.Extensions
{
    public static class ServiceCollectionExtensions
    {
        // Methode voor DbContext
        public static IServiceCollection AddDbContextOptions(this IServiceCollection services, ConfigurationManager configuration)
        {
            services.AddDbContext<DBFirmanDayOffShedule>(options =>  
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));
            return services;

        }

        // Methode voor AdminSettingsDTO
        public static IServiceCollection AddAdminSettings(this IServiceCollection services, ConfigurationManager configuration)
        {
            services.Configure<AdminSettingsDTO>(configuration.GetSection("AdminSettings"));
            return services;
        }

        // Methode voor JSON-instellingen
        public static IServiceCollection AddCustomJsonOptions(this IServiceCollection services)
        {
            services.AddControllers().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
            });

            return services;
        }

        // Methode voor Swagger-configuratie
        public static IServiceCollection AddSwaggerConfiguration(this IServiceCollection services)
        {
            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Firman Day Off Schedule API",
                    Version = "v1"
                });

                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Voer je Bearer-token in het formaat: Bearer {token}"
                });

                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] {}
                    }
                });
            });

            return services;
        }


        //Methode voor JWT-authenticatie**
        public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, ConfigurationManager configuration)
        {
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.Authority = configuration["Jwt:Authority"];
                options.Audience = configuration["Jwt:Audience"];
            });

            return services;
        }

        // Methode voor AutoMapper-configuratie
        public static IServiceCollection AddAutoMapperConfiguration(this IServiceCollection services)
        {
            services.AddAutoMapper(cfg =>
            {
                cfg.AddProfile<PersonMapper>();
                cfg.AddProfile<GradeMapper>();
                cfg.AddProfile<DayOffStartMapper>();
                cfg.AddProfile<RoleMapper>();
                cfg.AddProfile<SpecialityMapper>();
                cfg.AddProfile<TeamMapper>();
            });

            return services;
        }
    }
}
