using AutoMapper;
using FiremanDayOffShedule.Dal.Entities;
using FiremanDayOffShedule.DataContracts.DTO.Grade;


namespace FiremanDayOffShedule.Business.Mappings
{
    public class GradeMapper : Profile
    {
        public GradeMapper()
        {
            CreateMap<Grade, GradeReadDTO>();
        }
    }
}
