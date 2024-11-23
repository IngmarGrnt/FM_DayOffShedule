using AutoMapper;
using FiremanDayOffShedule.Dal.Entities;
using FirmanDayOffShedule.Api.DTO.Grade;

namespace FirmanDayOffShedule.Api.Mappings
{
    public class GradeMapper : Profile
    {
        public GradeMapper()
        {
            CreateMap<Grade, GradeReadDTO>();
        }
    }
}
