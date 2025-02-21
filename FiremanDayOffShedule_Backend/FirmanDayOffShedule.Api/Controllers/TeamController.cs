﻿using AutoMapper;
using AutoMapper.QueryableExtensions;
using FiremanDayOffShedule.Dal.Context;
using FiremanDayOffShedule.Dal.Entities;
using FiremanDayOffShedule.DataContracts.DTO.TeamDTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FirmanDayOffShedule.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TeamController : ControllerBase
    {
        private readonly DBFirmanDayOffShedule _context;
        private readonly IMapper _mapper;

        public TeamController(DBFirmanDayOffShedule context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Team
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TeamReadDTO>>> GetTeams()
        {
            var TeamDTOs = await _context.Teams
            .ProjectTo<TeamReadDTO>(_mapper.ConfigurationProvider)
            .ToListAsync();

            return Ok(TeamDTOs);

        }
        // GET: api/Team/id
        [HttpGet("{id}")]
        public async Task<ActionResult<Team>> GetTeam(int id)
        {
            var teamDTO = await _context.Teams
            .Where(t => t.Id == id)
            .ProjectTo<TeamReadDTO>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync();

            if (teamDTO == null)
            {
                return NotFound();
            }

            return Ok(teamDTO);

        }


        //[HttpGet("workdays/{id}/{year}")]
        //public async Task<ActionResult<object>> GetWorkDaysForYear(int id, int year)
        //{
        //    try
        //    {
        //        var team = await _context.Teams.FirstOrDefaultAsync(t => t.Id == id);
        //        if (team == null)
        //        {
        //            return NotFound();
        //        }

        //        var startDate = team.StartDate;
        //        var shifts = new List<object>();

        //        DateTime currentYearStart = new DateTime(year, 1, 1);
        //        DateTime currentYearEnd = new DateTime(year, 12, 31);
        //        DateTime currentDate = startDate;

        //        int shiftNumber = 1;

        //        while (currentDate <= currentYearEnd)
        //        {
        //            // Alleen toevoegen als de huidige datum binnen het opgegeven jaar valt
        //            if (currentDate.Year == year)
        //            {
        //                // Voeg dagdienst toe
        //                shifts.Add(new
        //                {
        //                    date = currentDate,
        //                    shiftType = "day",
        //                    shiftNumber = shiftNumber,
        //                    month = currentDate.ToString("MMM")
        //                });
        //                shiftNumber++;
        //            }

        //            // Bereken nachtdienst
        //            DateTime nightShiftDate = currentDate.AddDays(1);
        //            if (nightShiftDate.Year == year)
        //            {
        //                shifts.Add(new
        //                {
        //                    date = nightShiftDate,
        //                    shiftType = "night",
        //                    shiftNumber = shiftNumber,
        //                    month = nightShiftDate.ToString("MMM")
        //                });
        //                shiftNumber++;
        //            }

        //            // Controleer of maand is veranderd voor de volgende dagdienst
        //            int previousMonth = currentDate.Month;
        //            currentDate = currentDate.AddDays(4); // Volgende dagdienst
        //            if (currentDate.Month != previousMonth)
        //            {
        //                shiftNumber = 1; // Reset het dienstnummer bij maandwijziging
        //            }
        //        }

        //        // Sorteer de diensten op datum
        //        shifts = shifts.OrderBy(s => ((DateTime)s.GetType().GetProperty("date").GetValue(s))).ToList();

        //        var result = new { shifts };
        //        return Ok(result);
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new Exception(ex.Message, ex);
        //    }
        //}

        [HttpGet("workdays/{id}/{year}")]
        public async Task<ActionResult<object>> GetWorkDaysForYear(int id, int year)
        {
            try
            {
                var team = await _context.Teams.FirstOrDefaultAsync(t => t.Id == id);
                if (team == null)
                {
                    return NotFound();
                }

                var startDate = team.StartDate;
                var shifts = new List<object>();

                DateTime currentYearStart = new DateTime(year, 1, 1);
                DateTime currentYearEnd = new DateTime(year, 12, 31);
                DateTime currentDate = startDate;

                int shiftNumber = 1;
                int previousMonth = currentDate.Month;

                while (currentDate <= currentYearEnd)
                {
                    // Controleer maandwijziging na dagdienst
                    if (currentDate.Year == year)
                    {
                        if (currentDate.Month != previousMonth)
                        {
                            shiftNumber = 1; // Reset shiftNumber bij maandwijziging
                            previousMonth = currentDate.Month;
                        }

                        // Voeg dagdienst toe
                        shifts.Add(new
                        {
                            date = currentDate,
                            shiftType = "day",
                            shiftNumber = shiftNumber,
                            month = currentDate.ToString("MMM")
                        });
                        shiftNumber++;
                    }

                    // Bereken nachtdienst en controleer maandwijziging
                    DateTime nightShiftDate = currentDate.AddDays(1);
                    if (nightShiftDate.Year == year)
                    {
                        if (nightShiftDate.Month != previousMonth)
                        {
                            shiftNumber = 1; // Reset shiftNumber bij maandwijziging
                            previousMonth = nightShiftDate.Month;
                        }

                        // Voeg nachtdienst toe
                        shifts.Add(new
                        {
                            date = nightShiftDate,
                            shiftType = "night",
                            shiftNumber = shiftNumber,
                            month = nightShiftDate.ToString("MMM")
                        });
                        shiftNumber++;
                    }

                    // Volgende dagdienst
                    currentDate = currentDate.AddDays(4);
                }

                // Sorteer de diensten op datum
                shifts = shifts.OrderBy(s => ((DateTime)s.GetType().GetProperty("date").GetValue(s))).ToList();

                var result = new { shifts };
                return Ok(result);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message, ex);
            }
        }

    }
}
   
    
