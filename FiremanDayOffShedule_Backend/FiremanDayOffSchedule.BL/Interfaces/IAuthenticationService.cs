using FiremanDayOffShedule.Dal.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FiremanDayOffSchedule.BL.Interfaces
{
    public interface IAuthenticationService
    {
        bool AuthenticateUser(string username, string password);
        IEnumerable<string> GetPermissions(int userId); // Haalt rollen/rechten van de gebruiker op
        Person GetUserById(int userId); // Geeft details van een gebruiker terug
    }

}
