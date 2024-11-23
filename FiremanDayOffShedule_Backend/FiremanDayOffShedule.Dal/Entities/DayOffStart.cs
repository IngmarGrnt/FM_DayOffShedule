using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FiremanDayOffShedule.Dal.Entities
{
    public class DayOffStart:BaseEntity
    {
        public int DayOffBase {  get; set; } 
        public int DaySeniority {  get; set; }
        public int TakeoverDays { get; set; }  
        public DateTime Year { get; set;}

        // Many-to-many relationship
        public ICollection<Person> Persons { get; set; }
    }
}
