using AutoMapper;
using FiremanDayOffShedule.Dal.Entities;
using FiremanDayOffShedule.DataContracts.DTO.TeamDTO;

namespace FiremanDayOffShedule.Business.Mappings
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
