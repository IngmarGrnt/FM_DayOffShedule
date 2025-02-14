using FiremanDayOffShedule.Business.Mappings;
using FiremanDayOffShedule.Dal.Context;
using FiremanDayOffShedule.DataContracts.DTO.AdminDTO;
using FirmanDayOffShedule.Api.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Text.Json.Serialization;
using NLog;
using NLog.Web;


namespace FirmanDayOffShedule.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var logger = NLogBuilder.ConfigureNLog("nlog.config").GetCurrentClassLogger();
            logger.Info("Application is starting...");
            try
            {
                var builder = WebApplication.CreateBuilder(args);

                //builder.Configuration.AddJsonFile("appsettings.json");
                builder.Configuration.AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true);


                //builder.Services.AddCors();
                builder.Services.AddCors(options =>
                {
                    options.AddPolicy("AllowAll",
                        policy =>
                        {
                            policy.AllowAnyOrigin()
                                  .AllowAnyMethod()
                                  .AllowAnyHeader();
                        });
                });

                builder.Services.AddDbContextOptions(builder.Configuration);
                builder.Services.AddAdminSettings(builder.Configuration);
                builder.Services.AddHttpClient();
                builder.Services.AddCustomJsonOptions();
                builder.Services.AddSwaggerConfiguration();
                builder.Services.AddJwtAuthentication(builder.Configuration);
                builder.Services.AddEndpointsApiExplorer();
                //builder.Services.AddSwaggerGen();
                builder.Services.AddAutoMapperConfiguration();

                var app = builder.Build();
                app.UseCors("AllowAll");

                // Middleware configureren
                if (app.Environment.IsDevelopment())
                {
                    app.UseSwagger();
                    app.UseSwaggerUI();
                    app.UseDeveloperExceptionPage();
                }
                else
                {
                    app.UseExceptionHandler(appBuilder =>
                    {
                        appBuilder.Run(async context =>
                        {
                            context.Response.StatusCode = 500;
                            await context.Response.WriteAsync("An unexpected error occurred.");
                        });
                    });
                }


                app.UseHttpsRedirection();

                app.UseStaticFiles();

                app.UseRouting();
                app.UseAuthentication();
                app.UseAuthorization();


                app.MapControllers();

                logger.Info("Application is running...");
                app.Run();
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Application stopped due to an exception.");
                throw;
            }
            finally
            {
                LogManager.Shutdown(); // Zorgt ervoor dat alle logs correct worden weggeschreven
            }



            //// Voeg configuratiebestanden toe
            //builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
            //                      .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
            //                      .AddEnvironmentVariables();

            //// Haal de juiste origins op afhankelijk van de omgeving
            //var environment = builder.Environment.EnvironmentName;
            //var allowedOriginsBaseUrl = builder.Configuration.GetSection($"AllowOrigins:{environment}").Get<string[]>();

            //if (allowedOriginsBaseUrl == null || !allowedOriginsBaseUrl.Any())
            //{
            //    throw new InvalidOperationException("No allowed origins configured.");
            //}
        }
    }
}
