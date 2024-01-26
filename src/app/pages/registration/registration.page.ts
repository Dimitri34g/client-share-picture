import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiUserService } from 'src/app/api-user.service';


@Component({
  selector: 'app-registration',
  templateUrl: 'registration.page.html',
  styleUrls: ['registration.page.scss'],
})
export class RegistrationPage {
  id: string;
  name: string = '';
  email: string = '';
  password: string = '';

  constructor(private apiUserService: ApiUserService,private router: Router) { }

  signUp() {
    const user = {id: this.id, name: this.name, email: this.email, password: this.password};
    this.apiUserService.addUser(user).subscribe(
      response => {
        
        console.log('Inscription réussie:', response);
      },
      error => {
        
        console.error("Erreur lors de l'inscription:", error);
        this.router.navigate(['/login']);
      }
    );
  }
}
