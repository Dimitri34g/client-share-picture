import { Component } from '@angular/core';
import { ApiUserService } from 'src/app/api-user.service';


@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(private apiUserService: ApiUserService) {}

  login() {
    this.apiUserService.login(this.email, this.password).subscribe(
      response => {
        
        console.log('Connexion réussie:', response);
      },
      error => {
        
        console.error('Erreur de connexion:', error);
      }
    );
  }
}
