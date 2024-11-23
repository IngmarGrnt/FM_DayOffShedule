using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FiremanDayOffShedule.Dal.Entities
{
    public class Role:BaseEntity
    {
        public string Name {  get; set; }

        public ICollection<Person> Persons { get; set; }
    }
}
