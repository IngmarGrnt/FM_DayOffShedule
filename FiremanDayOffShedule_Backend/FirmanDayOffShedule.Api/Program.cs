
using FiremanDayOffShedule.Business.Mappings;
using FiremanDayOffShedule.Dal.Context;
using FiremanDayOffShedule.DataContracts.DTO.AdminDTO;
using FirmanDayOffShedule.Api.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;

using Microsoft.OpenApi.Models;

using System.Text.Json.Serialization;


namespace FirmanDayOffShedule.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Voeg configuratiebestanden toe
            builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                                  .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
                                  .AddEnvironmentVariables();

            // Haal de juiste origins op afhankelijk van de omgeving
            var environment = builder.Environment.EnvironmentName;
            var allowedOriginsBaseUrl = builder.Configuration.GetSection($"AllowOrigins:{environment}").Get<string[]>();

            if (allowedOriginsBaseUrl == null || !allowedOriginsBaseUrl.Any())
            {
                throw new InvalidOperationException("No allowed origins configured.");
            }

            // Configureer CORS
            builder.Services.AddCors();
            builder.Services.AddDbContextOptions(builder.Configuration);
            //NLOG



            // Database context
            //builder.Services.AddDbContext<DBFirmanDayOffShedule>(options =>
            //    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            builder.Services.Configure<AdminSettingsDTO>(builder.Configuration.GetSection("AdminSettings"));


            builder.Services.AddHttpClient();

            // Controllers en JSON-opties
            builder.Services.AddControllers().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
            });


            builder.Services.AddSwaggerGen(options =>
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

                options.AddSecurityRequirement(new OpenApiSecurityRequirement{
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



            // Authentication met Auth0
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.Authority = "https://dev-h38sgv74fxg1ziwv.us.auth0.com/";
                options.Audience = "https://dev-h38sgv74fxg1ziwv.us.auth0.com/api/v2";
            });


            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            //// AutoMapper
            //builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            builder.Services.AddAutoMapper(cfg =>
            {
                cfg.AddProfile<PersonMapper>();
                cfg.AddProfile<GradeMapper>();
                cfg.AddProfile<DayOffStartMapper>();
                cfg.AddProfile<RoleMapper>();
                cfg.AddProfile<SpecialityMapper>();
                cfg.AddProfile<TeamMapper>();
            });

            var app = builder.Build();

            // Middleware configureren
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }


            app.UseHttpsRedirection();

            app.UseCors(builder =>
            {
                builder
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
                
            });
            app.UseStaticFiles();
            //app.UseCors("AllowAngularApp");
            

            // Auth Middleware
            app.UseAuthentication();
            app.UseAuthorization();

            // Configureer de endpoints
            app.MapControllers();

            app.Run();
        }
    }
}
