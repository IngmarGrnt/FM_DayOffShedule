using FiremanDayOffShedule.Dal.Entities;
using FirmanDayOffShedule.Api.DTO.DayOffStartDTO;
using FirmanDayOffShedule.Api.DTO.Grade;
using FirmanDayOffShedule.Api.DTO.Role;
using FirmanDayOffShedule.Api.DTO.SpecialityDTO;
using FirmanDayOffShedule.Api.DTO.TeamDTO;


namespace FirmanDayOffShedule.Api.DTO
{
    public class PersonDetailDTO
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailAdress { get; set; }
        public string PhoneNumber { get; set; }
        public string GradeName { get; set; }
        public string RoleName { get; set; }
        public string TeamName { get; set; }
        public string SpecialityName { get; set; }

        public RoleReadDTO Role { get; set; }
        public GradeReadDTO Grade { get; set; }
        public TeamReadDTO Team { get; set; }
        public SpecialityReadDTO Speciality { get; set; }
        public DayOffStartReadDTO DayOffStart { get; set; }

    }

}
