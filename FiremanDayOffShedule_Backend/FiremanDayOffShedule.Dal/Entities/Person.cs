using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FiremanDayOffShedule.Dal.Entities
{
    public class Person: BaseEntity
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailAdress {  get; set; }
        public string PhoneNumber { get; set; }

        // Foreign keys
        public int? TeamId { get; set; }
        public int? SpecialityId { get; set; }
        public int? DayOffStartId { get; set; }
        public int? GradeId { get; set; }
        public int? RoleId { get; set; }
        //public int? DayOffStart { get; set; }

        // Navigation properties
        public Team Team { get; set; }
        public Grade Grade { get; set; }
        public Role Role { get; set; }
        public Speciality Speciality { get; set; }

        public DayOffStart DayOffStart { get; set; }

        // Login-specific fields
        public string PasswordHash { get; set; }
        public string Salt { get; set; }

        // Many-to-many relationship
        public ICollection<DayOff> DayOffs { get; set; }


    }
}
