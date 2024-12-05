using FiremanDayOffSchedule.BL.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FiremanDayOffSchedule.BL.Services
{
    public class AuthenticationService //: IAuthenticationService
    {
        //private readonly IUserRepository _userRepository;

        //public AuthenticationService(IUserRepository userRepository)
        //{
        //    _userRepository = userRepository;
        //}

        //public bool AuthenticateUser(string username, string password)
        //{
        //    var user = _userRepository.GetByUsername(username);
        //    return user != null && user.Password == HashPassword(password); // Controle met gehashte wachtwoorden
        //}

        //public IEnumerable<string> GetPermissions(int userId)
        //{
        //    return _userRepository.GetUserRoles(userId); // Ophalen van rollen uit de database
        //}

        //public User GetUserById(int userId)
        //{
        //    return _userRepository.GetById(userId); // Ophalen van gebruikersdetails
        //}

        //private string HashPassword(string password)
        //{
        //    // Hashing-logica, zoals SHA256 of BCrypt
        //    return ...;
        //}
    }

}
