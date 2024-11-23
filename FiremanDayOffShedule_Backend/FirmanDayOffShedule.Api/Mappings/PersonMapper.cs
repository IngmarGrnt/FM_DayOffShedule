
using AutoMapper;
using FiremanDayOffShedule.Dal.Entities;
using FirmanDayOffShedule.Api.DTO;
using FirmanDayOffShedule.Api.DTO.DayOffStartDTO;
using FirmanDayOffShedule.Api.DTO.PersonDTO;


namespace FirmanDayOffShedule.Api.Mappings
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


            //DAYOFFSTART
            CreateMap<DayOffStart, DayOffStartCreateDTO>();
            CreateMap<DayOffStart, DayOffStartReadDTO>();
            CreateMap<DayOffStart, DayOffStartUpdateDTO>();
            CreateMap<DayOffStart, DayOffStartDeleteDTO>();

 

        }
    }
}
