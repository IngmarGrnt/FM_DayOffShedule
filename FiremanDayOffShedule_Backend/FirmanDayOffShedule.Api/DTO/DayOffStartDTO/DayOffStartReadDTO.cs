namespace FirmanDayOffShedule.Api.DTO.DayOffStartDTO
{
    public class DayOffStartReadDTO
    {
        public int Id { get; set; }
        public int DayOffBase { get; set; }
        public int DaySeniority { get; set; }
        public int TakeoverDays { get; set; }
        public DateTime Year { get; set; }
    }
}
