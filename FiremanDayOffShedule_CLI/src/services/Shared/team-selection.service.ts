import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamSelectionService {
  private selectedTeamIdSubject = new BehaviorSubject<number>(1); // Default team ID is 1
  private selectedYear: number | null = null;


  selectedTeamId$ = this.selectedTeamIdSubject.asObservable();

  setSelectedTeamId(teamId: number): void {
    this.selectedTeamIdSubject.next(teamId);
  }

  setSelectedYear(year: number): void {
    this.selectedYear = year;
  }
  
  getSelectedYear(): number | null {
    return this.selectedYear;
  }
}
