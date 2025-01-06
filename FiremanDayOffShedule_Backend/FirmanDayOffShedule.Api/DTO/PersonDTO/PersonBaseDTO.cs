using FiremanDayOffShedule.Dal.Entities;
using FirmanDayOffShedule.Api.DTO.DayOffStartDTO;
using FirmanDayOffShedule.Api.DTO.Grade;
using FirmanDayOffShedule.Api.DTO.Role;
using FirmanDayOffShedule.Api.DTO.SpecialityDTO;
using FirmanDayOffShedule.Api.DTO.TeamDTO;


namespace FirmanDayOffShedule.Api.DTO
{
    public class PersonBaseDTO//PersonBaseDTO
    {
        public int Id { get; set; }
        public string Auth0Id { get; set; }  
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailAdress { get; set; }
        public string GradeName { get; set; }
        public string? TeamName { get; set; }
        public string? SpecialityName { get; set; }
        public int DayOffStartId { get; set; }    
        public int TeamId { get; set; }
        public int GradeId { get; set; }
        public int SpecialityId { get; set; }
        public string? RoleName { get; set; }   

    }

}
