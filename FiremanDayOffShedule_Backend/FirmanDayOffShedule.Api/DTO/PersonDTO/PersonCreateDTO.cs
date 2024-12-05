
using FirmanDayOffShedule.Api.DTO.DayOffStartDTO;
using FirmanDayOffShedule.Api.DTO.Grade;
using FirmanDayOffShedule.Api.DTO.Role;
using FirmanDayOffShedule.Api.DTO.SpecialityDTO;
using FirmanDayOffShedule.Api.DTO.TeamDTO;

namespace FirmanDayOffShedule.Api.DTO.PersonDTO
{
    public class PersonCreateDTO
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailAdress { get; set; }
        public string PhoneNumber { get; set; }

        // Foreign key ids
        public int? TeamId { get; set; } 
        public int? GradeId { get; set; }
        public int? RoleId { get; set; }
        public int SpecialityId { get; set; }
        public int? DayOffStartId { get; set; }

        // Nieuwe property voor wachtwoord
        public string Password { get; set; }
    }
}
