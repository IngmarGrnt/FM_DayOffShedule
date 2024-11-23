using FiremanDayOffShedule.Dal.Context;
using FiremanDayOffShedule.Dal.Entities;
using FiremanDayOffShedule.Dal.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FiremanDayOffShedule.Dal.Repositories
{
    public class GenericRepository<Entity> : IGenericRepository<Entity>
        where Entity : BaseEntity
    {

        internal readonly DBFirmanDayOffShedule _dbcontext;
        internal readonly DbSet<Entity> _dbSet;

        public GenericRepository(DBFirmanDayOffShedule context)
        {
            _dbcontext = context;
            _dbSet = _dbcontext.Set<Entity>();
        }

        public virtual List<Entity> GetAll()
        {
            try
            {
                return _dbSet.ToList();
            }
            catch (DbException ex)
            {
                throw new Exception(ex.Message + $"Error retrieving the data from the database for GetAll.");
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message + $"Error retrieving the data from the database for GetAll.");
            }
        }

        public virtual Entity GetById(int id)
        {
            try
            {
                return _dbSet.FirstOrDefault(db => db.Id == id);
            }
            catch (DbException ex)
            {
                throw new Exception(ex.Message + "Error retrieving the data from the database for GetById.");
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message + "Error retrieving the data from the database for GetById.");
            }
        }

        public virtual int Add(Entity entity)
        {
            _dbSet.Add(entity);
            SaveChanges();
            return entity.Id;
        }

        public virtual void Update(Entity entity)
        {
            _dbSet.Update(entity);
            SaveChanges();
        }

        public virtual void Delete(int id)
        {
            try
            {
                _dbSet.Where(x => x.Id == id).ExecuteDelete();
            }
            catch (DbException ex)
            {

                throw new Exception(ex.Message + "Error deleting the data from the database.");
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message + "Error deleting the data from the database.");
            }

        }

        public void SaveChanges()
        {
            try
            {
                _dbcontext.SaveChanges();
            }
            catch (DbException ex)
            {

                throw new Exception(ex.Message + "Database error when saving data.");
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message + "Database error when saving data.");
            }


        }
    }
}
