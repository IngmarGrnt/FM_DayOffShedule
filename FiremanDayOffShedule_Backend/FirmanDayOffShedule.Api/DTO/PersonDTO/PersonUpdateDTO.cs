using FirmanDayOffShedule.Api.DTO.DayOffStartDTO;
using FirmanDayOffShedule.Api.DTO.Grade;
using FirmanDayOffShedule.Api.DTO.SpecialityDTO;
using FirmanDayOffShedule.Api.DTO.TeamDTO;

namespace FirmanDayOffShedule.Api.DTO
{
    public class PersonUpdateDTO
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailAdress { get; set; }
        public string PhoneNumber { get; set; }
        public int TeamId { get; set; }
        public int RoleId { get; set; }
        public int GradeId { get; set; }
        public int SpecialityId { get; set; }
        //public TeamUpdateDTO Team { get; set; }
        //public GradeReadDTO Grade { get; set; } 
        //public SpecialityUpdateDTO Speciality { get; set; }
        //public DayOffStartUpdateDTO DayOffStart { get; set; }

    }

}
