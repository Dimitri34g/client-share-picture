import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiUserService } from 'src/app/services/api-user.service';
import { ToastController } from '@ionic/angular';

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

  constructor(private apiUserService: ApiUserService,private router: Router,private toastController: ToastController) { }
  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000, // Toast affiché pour 3 secondes
      color: color
    });
    toast.present();
  };
  signUp() {
    const user = {id: this.id, name: this.name, email: this.email, password: this.password};
    this.apiUserService.addUser(user).subscribe({
      next: (response) => {
        console.log('Inscription réussie:', response);
        this.presentToast('Inscription réussie. Redirection...', 'success');
        setTimeout(() => this.router.navigate(['/login']), 3000); // Redirection après 3 secondes
        
      },
      error: (error) => {
        console.error("Erreur lors de l'inscription:", error);
        this.presentToast("Erreur lors de l'inscription. Veuillez réessayer.", 'danger');
        
        
      }
      
    });
    
  }
}
