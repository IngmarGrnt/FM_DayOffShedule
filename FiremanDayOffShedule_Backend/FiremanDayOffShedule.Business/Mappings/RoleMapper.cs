using AutoMapper;
using FiremanDayOffShedule.Dal.Entities;
using FiremanDayOffShedule.DataContracts.DTO.Role;


namespace FiremanDayOffShedule.Business.Mappings
{
    public class RoleMapper : Profile
    {
        public RoleMapper()
        {
            CreateMap<Role, RoleReadDTO>();
        }
    }
}
