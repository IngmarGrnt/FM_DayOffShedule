
using AutoMapper;
using FiremanDayOffShedule.Dal.Entities;
using FiremanDayOffShedule.DataContracts.DTO;
using FiremanDayOffShedule.DataContracts.DTO.PersonDTO;

namespace FiremanDayOffShedule.Business.Mappings
{
    public class PersonMapper:Profile
    {
        public PersonMapper() 
        {
            //PERSON
            CreateMap<Person, PersonCreateDTO>().ReverseMap();
            CreateMap<PersonCreateDTO, Person>();
            CreateMap<Person, PersonBaseDTO>();
            CreateMap<Person, PersonDetailDTO>();
            CreateMap<Person, PersonUpdateDTO>();
            CreateMap<Person, PersonDeleteDTO>();

            // Map van PersonUpdateDTO naar Person
            CreateMap<PersonUpdateDTO, Person>()
             .ForMember(dest => dest.Team, opt => opt.Ignore()) 
             .ForMember(dest => dest.Grade, opt => opt.Ignore())
             .ForMember(dest => dest.Speciality, opt => opt.Ignore())
             .ForMember(dest => dest.DayOffStart, opt => opt.Ignore());

        }
    }
}
