using AutoMapper;
using FiremanDayOffShedule.Dal.Entities;
using FirmanDayOffShedule.Api.DTO.SpecialityDTO;

namespace FirmanDayOffShedule.Api.Mappings
{
    public class SpecialityMapper : Profile
    {
        public SpecialityMapper()
        {
            CreateMap<Speciality, SpecialityCreateDTO>();
            CreateMap<Speciality, SpecialityReadDTO>();
            CreateMap<Speciality, SpecialityUpdateDTO>();
            CreateMap<Speciality, SpecialityDeleteDTO>();
        }
    }
}
