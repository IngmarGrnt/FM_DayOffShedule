using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FiremanDayOffSchedule.BL.Interfaces
{
    public interface ICacheService
    {
        bool HasValue(int companyId, string key); // Controleert of de cache een waarde bevat
        object GetValue(int companyId, string key); // Haalt een waarde uit de cache
        void AddOrUpdate(int companyId, string key, object value, TimeSpan duration); // Voegt toe of update
        void Remove(int companyId, string key); // Verwijdert een waarde uit de cache
    }

}
