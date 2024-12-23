import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { TeamSelectionService } from '../../services/Shared/team-selection.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TeamService } from '../../services/team.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  teamForm: FormGroup;
  teams: { id:number, name:string }[] = [];

  constructor(
    private teamSelectionService: TeamSelectionService,
    private fb: FormBuilder,
    private teamService: TeamService
  ) {
    this.teamForm = this.fb.group({
      teamId: [1] // Default team ID is 1
    });
    const selectYear: string []=[];
  }

  ngOnInit(): void {
    this.loadTeams();
    // Luister naar veranderingen in het formulier
    this.teamForm.valueChanges.subscribe(value => {
      this.onTeamChange();
    });
  }

  // Teams laden van de service
  loadTeams(): void {
    this.teamService.getTeams().subscribe((teams) => {
      this.teams = teams;
    });
  }

  onTeamChange(): void {
    const selectedTeamId = this.teamForm.value.teamId;
    this.teamSelectionService.setSelectedTeamId(selectedTeamId);
  }
}
