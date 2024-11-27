import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { PersonService } from '../../../services/person.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MaterialModule, MatCardModule, MatButtonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  personService = inject(PersonService);
  route: ActivatedRoute = inject(ActivatedRoute);
  personData: any = null;
  authService = inject(AuthService);
  ngOnInit(): void {
    this.loadProfileData();
  }

   // Laad de profielgegevens van de persoon
   private loadProfileData(): void {
    let personId = this.authService.getUserId();
    console.log(personId)
    if (personId !== null && !isNaN(personId)) {
      this.personService.getPersonById(personId).then((personDetails) => {
        this.personData = personDetails;
      });
    }
  }
}


