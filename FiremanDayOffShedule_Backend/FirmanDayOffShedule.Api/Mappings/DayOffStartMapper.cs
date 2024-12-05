using AutoMapper;
using FiremanDayOffShedule.Dal.Entities;
using FirmanDayOffShedule.Api.DTO.DayOffStartDTO;
using FirmanDayOffShedule.Api.DTO.Grade;

namespace FirmanDayOffShedule.Api.Mappings
{
    public class DayOffStartMapper : Profile
    {
        public DayOffStartMapper() 
        {
            CreateMap<DayOffStart,DayOffStartReadDTO>();

        }
    }
}
