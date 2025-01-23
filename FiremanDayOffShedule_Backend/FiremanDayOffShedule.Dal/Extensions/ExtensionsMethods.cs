using FiremanDayOffShedule.Dal.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;

namespace FiremanDayOffShedule.Dal.Extensions
{
    public static class ExtensionsMethods
    {
        //Aparte tabellen voor dropdowns
        public static void PersonConfig(this ModelBuilder mb)
        {
            mb.Entity<Person>()
                .HasKey(p => p.Id);

            mb.Entity<Person>()
                .Property(p => p.FirstName)
                .IsRequired()
                .HasMaxLength(50);

            mb.Entity<Person>()
                .Property(p => p.LastName)
                .IsRequired()
                .HasMaxLength(50);

            mb.Entity<Person>()
                .Property(p => p.EmailAdress)
                .HasMaxLength(50)
                .IsRequired(false);

            mb.Entity<Person>()
                .Property(p => p.Auth0Id)
                .HasMaxLength(255)
                .IsRequired(false);

            //mb.Entity<Person>()
            //    .Property(p => p.PasswordHash)
            //    .HasMaxLength(255)
            //    .IsRequired(false);

            //mb.Entity<Person>()
            //    .Property(p => p.Salt)
            //    .HasMaxLength(50)
            //    .IsRequired(false);

            mb.Entity<Person>()
                .Property(p => p.PhoneNumber)
                .HasMaxLength(100)
                .IsRequired(false);

            // Foreign key for Team
            mb.Entity<Person>()
               .HasOne(p => p.Team)
               .WithMany(t => t.Persons) 
               .HasForeignKey(p => p.TeamId)
                .IsRequired(false);

            // Foreign key for Grade
            mb.Entity<Person>()
               .HasOne(p => p.Grade)
               .WithMany(t => t.Persons) 
               .HasForeignKey(p => p.GradeId)
               .IsRequired(false)
                .OnDelete(DeleteBehavior.Cascade);

            // Foreign key for Role
            mb.Entity<Person>()
               .HasOne(p => p.Role)
               .WithMany(t => t.Persons) 
               .HasForeignKey(p => p.RoleId)
                .IsRequired(false);

            // Foreign key for Speciality
            mb.Entity<Person>()
               .HasOne(p => p.Speciality)
               .WithMany(s => s.Persons) 
               .HasForeignKey(p => p.SpecialityId)
                .IsRequired(false);
            // Foreign key for DayOffStart
            mb.Entity<Person>()
               .HasOne(p => p.DayOffStart)
               .WithMany(d => d.Persons) 
               .HasForeignKey(p => p.DayOffStartId)
                .IsRequired(false);

            //Many - to - many relationship with DayOff
            mb.Entity<Person>()
                .HasMany(p => p.DayOffs)
                .WithMany(d => d.Persons)
                .UsingEntity<Dictionary<string, object>>(
                    "PersonDayOff",  // Join table name
                    j => j.HasOne<DayOff>().WithMany().HasForeignKey("DayOffId"),
                    j => j.HasOne<Person>().WithMany().HasForeignKey("PersonId")
                );

            mb.Entity<Person>()
            .Property(p => p.LastUpdate)
            .ValueGeneratedOnAddOrUpdate() 
            .HasDefaultValueSql("GETDATE()");
        }


        public static void GradeConfig(this ModelBuilder mb)
        {
            mb.Entity<Grade>()
                .HasKey(g => g.Id);

            mb.Entity<Grade>()
                .Property(g => g.Name)
                .HasConversion<string>()
                .HasMaxLength(50);

            mb.Entity<Grade>()
                .Property(t => t.LastUpdate)
                .ValueGeneratedOnAddOrUpdate()
                .HasDefaultValueSql("GETDATE()");

            mb.Entity<Grade>().HasData(
                new Grade { Id = 1, Name = "Brandweerman" },
                new Grade { Id = 2, Name = "Korporaal" },
                new Grade { Id = 3, Name = "Sergeant" },
                new Grade { Id = 4, Name = "Adjudant" },
                new Grade { Id = 5, Name = "Luitenant" },
                new Grade { Id = 6, Name = "Kapitein" },
                new Grade { Id = 7, Name = "Majoor" },
                new Grade { Id = 8, Name = "Kolonel" }
);

        }

        public static void RoleConfig(this ModelBuilder mb)
        {
            mb.Entity<Role>()
                .HasKey(r => r.Id);

            mb.Entity<Role>()
                .Property(r => r.Name)
                .HasConversion<string>()
                .HasMaxLength(50);

            mb.Entity<Role>()
                .Property(t => t.LastUpdate)
                .ValueGeneratedOnAddOrUpdate()
                .HasDefaultValueSql("GETDATE()");

            mb.Entity<Role>().HasData(
            new Role { Id = 1, Name = "Admin" },
            new Role { Id = 2, Name = "Editor" },
            new Role { Id = 3, Name = "Autor" }
            );

        }

        public static void SpecialityConfig(this ModelBuilder mb)
        {
            mb.Entity<Speciality>()
                .HasKey(s => s.Id);

            mb.Entity<Speciality>()
                .Property(s => s.Name)
                .HasConversion<string>()
                .HasMaxLength(50);

            mb.Entity<Speciality>()
                .Property(s => s.LastUpdate)
                .ValueGeneratedOnAddOrUpdate()
                .HasDefaultValueSql("GETDATE()");

            mb.Entity<Speciality>().HasData(
            new Speciality { Id = 1, Name = "IGS" },
            new Speciality { Id = 2, Name = "Red-Team" },
            new Speciality { Id = 3, Name = "Chauffeur" },
            new Speciality { Id = 4, Name = "RVD" },
            new Speciality { Id = 5, Name = "Dispatching" }

            );
        }

        public static void DayOffStartConfig(this ModelBuilder mb)
        {
            mb.Entity<DayOffStart>()
                .HasKey(dof => dof.Id);

            mb.Entity<DayOffStart>()
                .Property(dof => dof.DayOffBase)
                .HasConversion<int>();



            mb.Entity<DayOffStart>()
                .Property(dof => dof.DaySeniority)
                .HasConversion<int>();


            mb.Entity<DayOffStart>()
                .Property(dof => dof.TakeoverDays)
                .HasConversion<int>();


            mb.Entity<DayOffStart>()
                .Property(dof => dof.Year)
                .HasConversion<DateTime>();

            mb.Entity<DayOffStart>()
                .Property(dof => dof.LastUpdate)
                .ValueGeneratedOnAddOrUpdate()
                .HasDefaultValueSql("GETDATE()");

            mb.Entity<DayOffStart>().HasData(
           new DayOffStart { Id = 1, DayOffBase = 44, TakeoverDays = 1, DaySeniority = 0 },
           new DayOffStart { Id = 2, DayOffBase = 44, TakeoverDays = 0, DaySeniority = 1 },
           new DayOffStart { Id = 3, DayOffBase = 44, TakeoverDays = 2, DaySeniority = 0 }
            );
        }


        public static void TeamConfig(this ModelBuilder mb)
        {
            mb.Entity<Team>()
                .HasKey(t => t.Id);

            mb.Entity<Team>()
                .Property(t => t.Name)
                .HasConversion<string>()
                .HasMaxLength(50);

            mb.Entity<Team>()
                .Property(t => t.StartDate)
                .HasConversion<DateTime>();


            mb.Entity<Team>()
                .Property(t => t.LastUpdate)
                .ValueGeneratedOnAddOrUpdate()
                .HasDefaultValueSql("GETDATE()");

            mb.Entity<Team>().HasData(
            new Team { Id = 1, Name = "Ploeg 1" },
            new Team { Id = 2, Name = "Ploeg 2" },
            new Team { Id = 3, Name = "Ploeg 3" },
            new Team { Id = 4, Name = "Ploeg 4" },
            new Team { Id = 5, Name = "Ploeg 0" }
        );
        }

        public static void DayOffConfig(this ModelBuilder mb)
        {
            mb.Entity<DayOff>()
         .HasKey(d => d.Id);

            mb.Entity<DayOff>()
                .Property(d => d.Date)
                .IsRequired();

            mb.Entity<DayOff>()
                .Property(d => d.Approved)
                .IsRequired();

            // Many-to-many relationship between DayOff and Person
            mb.Entity<DayOff>()
                .HasMany(d => d.Persons)
                .WithMany(p => p.DayOffs)
                .UsingEntity<Dictionary<string, object>>(
                    "PersonDayOff",  // Join table name
                    j => j.HasOne<Person>().WithMany().HasForeignKey("PersonId"),
                    j => j.HasOne<DayOff>().WithMany().HasForeignKey("DayOffId")
                );

        }
    }
}
