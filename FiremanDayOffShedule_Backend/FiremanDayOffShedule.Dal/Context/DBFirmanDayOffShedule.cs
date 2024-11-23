using FiremanDayOffShedule.Dal.Entities;
using FiremanDayOffShedule.Dal.Extensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace FiremanDayOffShedule.Dal.Context
{
    public class DBFirmanDayOffShedule:DbContext
    {
        public DBFirmanDayOffShedule():base(){}
        public DBFirmanDayOffShedule(DbContextOptions options) : base(options) { }

        public DbSet<DayOff> DayOffs { get; set; }
        public DbSet<Person> Persons { get; set; }  
        public DbSet<Speciality> Specialities { get; set; } 
        public DbSet<Team> Teams { get; set; }  
        public DbSet<DayOffStart> DayOffstarts { get; set; }
        public DbSet<Grade> Grades { get; set; }
        public DbSet<Role> Roles { get; set; }  

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Data Source=.\\SQLEXPRESS;Initial Catalog=FireManDayOffShedule;Integrated Security=True; Trusted_Connection=True; TrustServerCertificate=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.PersonConfig();
            modelBuilder.SpecialityConfig();
            modelBuilder.DayOffConfig();
            modelBuilder.DayOffStartConfig();
            modelBuilder.TeamConfig();
            modelBuilder.RoleConfig();
            modelBuilder.GradeConfig();

        }

    }
}