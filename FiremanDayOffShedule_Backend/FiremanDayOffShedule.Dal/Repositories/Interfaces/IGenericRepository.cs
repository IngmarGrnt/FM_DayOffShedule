using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FiremanDayOffShedule.Dal.Repositories.Interfaces
{
    public interface IGenericRepository<Entity>
    {
        List<Entity> GetAll();
        Entity GetById(int id);
        int Add(Entity entity);
        void Update(Entity entity);
        void Delete(int id);
        void SaveChanges();
    }
}
