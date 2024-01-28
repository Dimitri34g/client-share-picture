import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular'; // Importez AlertController
import { ApiPhotoService } from './api-photo.service';


export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
  latitude?: number | null; 
  longitude?: number | null;
  name?: string;
}


@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public photos: UserPhoto[] = [];
  private PHOTO_STORAGE: string = 'photos';
  private platform: Platform;

  constructor(platform: Platform, private alertController: AlertController,private apiPhotoService: ApiPhotoService) {
    this.platform = platform;
  }


  public async addNewToGallery() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });
  
    const photoName = await this.promptForPhotoName(); // Demander le nom de la photo
    const savedImageFile = await this.savePicture(capturedPhoto, photoName); // Passer le nom à savePicture
  
    this.photos.unshift(savedImageFile);
    Preferences.set({ key: this.PHOTO_STORAGE, value: JSON.stringify(this.photos) });
  }

  private async promptForPhotoName(): Promise<string> {
    const alert = await this.alertController.create({
      header: 'Nom de la photo',
      inputs: [{ name: 'photoName', type: 'text', placeholder: 'Entrez un nom pour la photo' }],
      buttons: [
        { text: 'Annuler', role: 'cancel', handler: () => {} },
        { text: 'OK', handler: (data) => data.photoName }
      ]
    });
  
    await alert.present();
    const { data } = await alert.onDidDismiss();
    return data.values.photoName || 'Unnamed';
  }

  // Save picture to file on device
  private async savePicture(photo: Photo, name: string) {
    const base64Data = await this.readAsBase64(photo);
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });
  
    let coordinates: { latitude?: number, longitude?: number } = {}; // Récupération des coordonnées GPS comme avant
  
    const photoObject = {
      filepath: fileName,
      webviewPath: this.platform.is('hybrid') ? Capacitor.convertFileSrc(savedFile.uri) : photo.webPath,
      ...coordinates,
      name: name,
      date: new Date() // Ajoutez la date actuelle
    };
  
    this.apiPhotoService.addPhoto(photoObject).subscribe({
      next: (response) => console.log('Photo added successfully', response),
      error: (error) => console.error('Error adding photo', error)
    });
  
    return photoObject; // Renvoyez l'objet photo si nécessaire
  }
  
  
  private async readAsBase64(photo: Photo) {
    // "hybrid" will detect Cordova or Capacitor
    if (this.platform.is('hybrid')) {
      // Read the file into base64 format
      const file = await Filesystem.readFile({
        path: photo.path!
      });
  
      return file.data;
    }
    else {
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();
  
      return await this.convertBlobToBase64(blob) as string;
    }
  }
  
  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  public async loadSaved() {
    // Retrieve cached photo array data
    const { value } = await Preferences.get({ key: this.PHOTO_STORAGE });
    this.photos = (value ? JSON.parse(value) : []) as UserPhoto[];
  
    // Easiest way to detect when running on the web:
    // “when the platform is NOT hybrid, do this”
    if (!this.platform.is('hybrid')) {
      // Display the photo by reading into base64 format
      for (let photo of this.photos) {
        // Read each saved photo's data from the Filesystem
        const readFile = await Filesystem.readFile({
            path: photo.filepath,
            directory: Directory.Data
        });
  
        // Web platform only: Load the photo as base64 data
        photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      }
    }
  }
}



