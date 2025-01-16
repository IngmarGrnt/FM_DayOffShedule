using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FiremanDayOffShedule.DataContracts.DTO.PersonDTO
{
    public class PersonWithDayOffDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? SpecialityName { get; set; }
        public int DayOffBase { get; set; }
        public int DayOffCount { get; set; }    
        public List<string> DayOffs { get; set; } = new();
    }

}
