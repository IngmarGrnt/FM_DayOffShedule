

namespace FiremanDayOffShedule.DataContracts.DTO.PersonDTO
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
