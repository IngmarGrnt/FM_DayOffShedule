namespace FiremanDayOffShedule.DataContracts.DTO.DayOffStartDTO
{
    public class DayOffStartUpdateDTO
    {
        public int DayOffBase { get; set; }
        public int DaySeniority { get; set; }
        public int TakeoverDays { get; set; }
        public DateTime Year { get; set; }
    }
}
