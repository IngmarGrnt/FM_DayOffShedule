


using FiremanDayOffShedule.Business.DTO.DayOffStartDTO;
using FiremanDayOffShedule.DataContracts.DTO.Grade;
using FiremanDayOffShedule.DataContracts.DTO.Role;
using FiremanDayOffShedule.DataContracts.DTO.SpecialityDTO;
using FiremanDayOffShedule.DataContracts.DTO.TeamDTO;

namespace FiremanDayOffShedule.DataContracts.DTO.PersonDTO
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
        public string Auth0Id { get; set; }  
        public RoleReadDTO Role { get; set; }
        public GradeReadDTO Grade { get; set; }
        public TeamReadDTO Team { get; set; }
        public SpecialityReadDTO Speciality { get; set; }
        public DayOffStartReadDTO DayOffStart { get; set; }

    }

}
