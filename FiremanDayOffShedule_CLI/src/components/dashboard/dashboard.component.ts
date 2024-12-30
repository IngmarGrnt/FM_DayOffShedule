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
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  teamForm: FormGroup;
  teams: { id: number; name: string }[] = [];
  years: number[] = []; // Lijst met jaren (huidig jaar + 10 jaar)

  constructor(
    private teamSelectionService: TeamSelectionService,
    private fb: FormBuilder,
    private teamService: TeamService
  ) {
    // Formulier initialiseren
    this.teamForm = this.fb.group({
      teamId: [1], // Default team ID
      year: [new Date().getFullYear()+1], // Default jaar is het huidige jaar
    });
  }

  ngOnInit(): void {
    this.generateYears(); // Genereer de jaren
    this.loadTeams();
    // Luister naar veranderingen in het formulier
    this.teamForm.valueChanges.subscribe(() => {
      this.onFormChange();
    });
  }

  // Teams laden van de service
  loadTeams(): void {
    this.teamService.getTeams().subscribe((teams) => {
      this.teams = teams;
    });
  }

  // Genereer een lijst van het huidige jaar tot +10 jaar
  generateYears(): void {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 11 }, (_, i) => currentYear + i);
  }

  onFormChange(): void {
    const selectedTeamId = this.teamForm.value.teamId;
    const selectedYear = this.teamForm.value.year;
    // Sla teamId en jaar op in de gedeelde service
    this.teamSelectionService.setSelectedTeamId(selectedTeamId);
    this.teamSelectionService.setSelectedYear(selectedYear);
  }
}
