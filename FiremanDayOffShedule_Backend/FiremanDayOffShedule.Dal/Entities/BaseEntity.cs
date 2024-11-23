using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FiremanDayOffShedule.Dal.Entities
{
    public class BaseEntity
    {
        public int Id { get; set; }
        public DateTime LastUpdate { get; set; }
    }
}
