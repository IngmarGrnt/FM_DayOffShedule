using AutoMapper;
using FiremanDayOffShedule.Dal.Entities;
using FiremanDayOffShedule.DataContracts;
using FiremanDayOffShedule.DataContracts.DTO.SpecialityDTO;


namespace FiremanDayOffShedule.Business.Mappings
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
