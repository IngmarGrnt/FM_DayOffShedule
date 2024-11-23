import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamSelectionService {
  private selectedTeamIdSubject = new BehaviorSubject<number>(1); // Default team ID is 1
  selectedTeamId$ = this.selectedTeamIdSubject.asObservable();

  setSelectedTeamId(teamId: number): void {
    this.selectedTeamIdSubject.next(teamId);
  }
}
