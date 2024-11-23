using AutoMapper;
using FiremanDayOffShedule.Dal.Entities;
using FirmanDayOffShedule.Api.DTO.Role;

namespace FirmanDayOffShedule.Api.Mappings
{
    public class RoleMapper : Profile
    {
        public RoleMapper()
        {
            CreateMap<Role, RoleReadDTO>();
        }
    }
}
