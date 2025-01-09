

namespace FiremanDayOffShedule.DataContracts.DTO
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
    }

}
