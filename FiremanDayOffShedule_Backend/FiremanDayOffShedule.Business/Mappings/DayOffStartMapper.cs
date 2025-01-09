using AutoMapper;
using FiremanDayOffShedule.Business.DTO.DayOffStartDTO;
using FiremanDayOffShedule.Dal.Entities;


namespace FiremanDayOffShedule.Business.Mappings
{
    public class DayOffStartMapper : Profile
    {
        public DayOffStartMapper() 
        {
            CreateMap<DayOffStart,DayOffStartReadDTO>();

        }
    }
}
