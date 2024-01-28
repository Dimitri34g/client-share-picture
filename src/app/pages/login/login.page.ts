import { Component } from '@angular/core';
import { ApiUserService } from 'src/app/services/api-user.service';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(private apiUserService: ApiUserService, private storage: Storage,private router: Router,private toastController: ToastController) {
    this.storage.create();
  }
  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000, // Toast affiché pour 3 secondes
      color: color
    });
    toast.present();
  };
  login() {
    this.apiUserService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Connexion réussie:', response);
        this.storeUserData(response);
        this.presentToast('Connexion réussie. Redirection...', 'success');
        setTimeout(() => this.router.navigate(['/tabs']), 3000); // Redirection après 3 secondes

      },
      error: (error) => {
        console.error('Erreur de connexion:', error);
        this.presentToast("Erreur lors de la connexion. Veuillez réessayer.", 'danger');
      },
      complete: () => {
        console.log('Processus de connexion terminé');
      }
    });
    
  }
  private storeUserData(response: any) {
    const { token, _id } = response;
    this.storage.set('token', token);
    this.storage.set('_id', _id);
  }
}
