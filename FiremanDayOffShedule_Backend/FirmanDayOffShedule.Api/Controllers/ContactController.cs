using Microsoft.AspNetCore.Mvc;
using MailKit.Net.Smtp;
using MimeKit;
namespace FirmanDayOffShedule.Api.Controllers
{
    [Route("api/contact")]
    [ApiController]
    public class ContactController : ControllerBase
    {
        private readonly IConfiguration _config;

        public ContactController(IConfiguration config)
        {
            _config = config;
        }




        [HttpPost]
        public async Task<IActionResult> SendEmail([FromBody] ContactRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.Name) || string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Message))
            {
                return BadRequest("Alle velden zijn verplicht.");
            }

            try
            {
                var emailMessage = new MimeMessage();
                emailMessage.From.Add(new MailboxAddress("Contactformulier_GIDCO.BE", _config["Smtp:Username"]));
                emailMessage.To.Add(new MailboxAddress("Admin", "info@gidco.be")); // Verander naar de gewenste ontvanger
                emailMessage.Subject = "Nieuw contactbericht van " + request.Name;
                emailMessage.Body = new TextPart("plain")
                {
                    Text = $"Naam: {request.Name}\nEmail: {request.Email}\n\nBericht:\n{request.Message}"
                };

                using (var client = new SmtpClient())
                {
                    await client.ConnectAsync(_config["Smtp:Server"], int.Parse(_config["Smtp:Port"]), true);
                    await client.AuthenticateAsync(_config["Smtp:Username"], _config["Smtp:Password"]);
                    await client.SendAsync(emailMessage);
                    await client.DisconnectAsync(true);
                }

                return Ok(new { message = "E-mail verzonden!" });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, $"Fout bij het verzenden van e-mail: {ex.Message}");
            }


        }
    }



    public class ContactRequest
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Message { get; set; }
    }
}
