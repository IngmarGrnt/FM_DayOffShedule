
using FiremanDayOffShedule.Business.Mappings;
using FiremanDayOffShedule.Dal.Context;
using Microsoft.AspNetCore.Authentication.JwtBearer;
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

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigin", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                });
            });


            // Database context
            builder.Services.AddDbContext<DBFirmanDayOffShedule>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            // Configuratiebestanden
            builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                                  .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
                                  .AddEnvironmentVariables();

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

                // Configureer OAuth2/OpenID voor Auth0
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


            // Authentication met Auth0
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.Authority = "https://dev-h38sgv74fxg1ziwv.us.auth0.com/";
                options.Audience = "https://dev-h38sgv74fxg1ziwv.us.auth0.com/api/v2";
                //options.Audience = "https://localhost:7130/api/";
                //options.Authority = "https://dev-h38sgv74fxg1ziwv.us.auth0.com/";
                //options.Audience = "https://localhost:7130/api/";
            });



            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
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
            app.UseCors("AllowSpecificOrigin");

            // Auth Middleware
            app.UseAuthentication();
            app.UseAuthorization();

            // Configureer de endpoints
            app.MapControllers();

            app.Run();
        }
    }
}
