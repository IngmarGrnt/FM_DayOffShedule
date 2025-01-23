using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FiremanDayOffShedule.DataContracts.DTO.AdminDTO
{
    public class AdminSettingsDTO
    {
        public int DayOffTeamYear { get; set; }
        public int DayOffBig { get; set; }
        public int DayOffMedium { get; set; }
        public int DayOffSmall { get; set; }
        public int DayOffExtraSmall { get; set; }
        public int TeamMultitude { get; set; }
        public DateTime UserSetOff {  get; set; }   
    }
}
