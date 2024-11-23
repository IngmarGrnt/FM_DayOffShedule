using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FiremanDayOffShedule.Dal.Entities
{
    public class Speciality:BaseEntity
    {
        public string Name {  get; set; }

        // Many-to-many relationship
        public ICollection<Person> Persons { get; set; }
    }
}
