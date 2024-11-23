using AutoMapper;
using FiremanDayOffShedule.Dal.Entities;
using FirmanDayOffShedule.Api.DTO.TeamDTO;

namespace FirmanDayOffShedule.Api.Mappings
{
    public class TeamMapper : Profile
    {
        public TeamMapper()
        {
            CreateMap<Team, TeamCreateDTO>();
            CreateMap<Team, TeamReadDTO>();
            CreateMap<Team, TeamUpdateDTO>();
            CreateMap<Team, TeamDeleteDTO>();
        }
    }
}
