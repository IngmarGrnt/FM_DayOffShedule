using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Text;
using System.Threading.Tasks;

namespace FiremanDayOffShedule.Dal.Entities
{
    public class DayOff:BaseEntity
    {
      

        public DateTime Date { get; set; }
        public bool Approved {  get; set; }

        // Many-to-many relationship
        public ICollection<Person> Persons { get; set; }
    }
}
