import { Component, Input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonDetails } from '../../../interfaces/person.model';
import { RouterModule, Router } from '@angular/router';
import { PersonService } from '../../../services/person.service';
import { MaterialModule } from '../../../material.module';
import { TeamService } from '../../../services/team.service';
@Component({
  selector: 'app-personDetails',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: `./person.component.html`,
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {
  getTeamPriority(): string[] {
    return ['Ploeg1', 'Ploeg2', 'Ploeg3', 'Ploeg4', 'Ploeg0'];
  }

  getGradePriority(): string[] {
    return ['Brandweerman', 'Korporaal', 'Sergeant', 'Adjudant', 'Luitenant','Kapitein','Majoor','Kolonel'];
  }

  // Helper function to sort an array based on a priority list
private getSortedArray(items: string[], priorityList: string[]): string[] {
  return Array.from(new Set(items)).sort((a, b) => {
    const indexA = priorityList.indexOf(a);
    const indexB = priorityList.indexOf(b);
    if (indexA === -1 && indexB === -1) {
      return a.localeCompare(b);
    } else if (indexA === -1) {
      return 1;
    } else if (indexB === -1) {
      return -1;
    } else {
      return indexA - indexB;
    }
  });
}

getSortedTeams(teams: string[]): string[] {
  const teamPriority = this.getTeamPriority();
  return this.getSortedArray(teams, teamPriority);
}

getSortedGrades(grades: string[]): string[] {
  const gradePriority = this.getGradePriority();
  return this.getSortedArray(grades, gradePriority);
}
  @Input() personDetails!: PersonDetails;
  personDetailsList: PersonDetails[] = [];
  filteredPersonDetailsList: PersonDetails[] = [];
  personService: PersonService = inject(PersonService);
  teamService: TeamService = inject(TeamService);

  selectedTeam: string = 'Alle ploegen';
  selectedGrade: string = 'Alle graden';
  selectedSpeciality: string = 'Alle specialiteiten';
  uniqueTeams: string[] = [];
  uniqueGrades: string[] = [];
  uniqueSpecialitys: string[] = [];

  displayedColumns: string[] = ['firstName', 'lastName', 'emailAdress', 'teamName', 'gradeName','specialityName', 'details'];

  ngOnInit(): void {
    this.personService.getAllPersons().then((personDetailsList: PersonDetails[]) => {
      console.log(personDetailsList); 
      this.personDetailsList = personDetailsList;
      this.filteredPersonDetailsList = personDetailsList;
      const sortedTeams = this.getSortedTeams(personDetailsList.map(person => person.teamName));
      this.uniqueTeams = ['Alle ploegen', ...sortedTeams];
      const sortedGrades = this.getSortedGrades(personDetailsList.map(person => person.gradeName));
      this.uniqueGrades = ['Alle graden', ...sortedGrades];
      const sortedSpecialitys = this.getSortedGrades(personDetailsList.map(person => person.specialityName));
      this.uniqueSpecialitys = ['Alle specialiteiten', ...sortedSpecialitys];
    }).catch(error => {
      console.error('Fout bij fetching person details', error);
    });
  }

  applyFilters() {
    this.teamService.getTeams().subscribe(teams => {
      const getTeamIdByName = (name: string) => {
        const team = teams.find(team => team.name === name);
        return team ? team.id : null;
      };

      const getGradeIdByName = (name: string) => {
        const grade = this.personDetailsList.find(person => person.gradeName === name);
        return grade ? grade.gradeId : null;
      };

      const getSpecialityIdByName = (name: string) => {
        const speciality = this.personDetailsList.find(person => person.specialityName === name);
        return speciality ? speciality.specialityId : null;
      };

      const filters: any = {};
      if (this.selectedTeam !== 'Alle ploegen') {
        filters.teamId = String(getTeamIdByName(this.selectedTeam));
      }
      if (this.selectedGrade !== 'Alle graden') {
        filters.gradeId = String(getGradeIdByName(this.selectedGrade));
      }
      if (this.selectedSpeciality !== 'Alle specialiteiten') {
        filters.specialityId = String(getSpecialityIdByName(this.selectedSpeciality));
      }

      console.log('Filters verstuurd naar API:', filters);

      this.personService.searchPersons(filters).subscribe(
        (response: any) => {
          const filteredPersonDetailsList = response.$values;

          if (!Array.isArray(filteredPersonDetailsList)) {
            console.error('Verwachte array, maar kreeg:', filteredPersonDetailsList);
            return;
          }

          this.filteredPersonDetailsList = filteredPersonDetailsList;
          console.log('Filters toegepast:', filters);
          console.log('Gefilterde person details:', filteredPersonDetailsList);

          // Prioriteit geven aan bepaalde ploegen in de dropdowns
          const teamPriority = this.getTeamPriority();
          const gradePriority = this.getGradePriority();
          this.filteredPersonDetailsList.sort((a, b) => {
            const teamIndexA = teamPriority.indexOf(a.teamId.toString());
            const teamIndexB = teamPriority.indexOf(b.teamId.toString());
            const gradeIndexA = gradePriority.indexOf(a.gradeId.toString());
            const gradeIndexB = gradePriority.indexOf(b.gradeId.toString());

            if (teamIndexA !== teamIndexB) {
              return teamIndexA - teamIndexB;
            } else {
              return gradeIndexA - gradeIndexB;
            }
          });
        },
        error => {
          console.error('Fout bij het filteren van person details', error);
        }
      );
    });
  }
}