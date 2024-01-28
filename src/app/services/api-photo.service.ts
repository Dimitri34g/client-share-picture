import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface Photo {
  
  filepath: string;
  webviewPath?: string;
  latitude?: number | null;
  longitude?: number | null;
  name?: string;
  date?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ApiPhotoService {
  URL: string = 'http://localhost:3000/Photo'; 
  httpHeader = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  addPhoto(photo: Photo): Observable<any> {
    return this.http
      .post<Photo>(`${this.URL}/`, photo, this.httpHeader)
      .pipe(catchError(this.handleError<Photo>('Add Photo')));
  }

  getPhoto(id: any): Observable<Photo> {
    return this.http.get<Photo>(`${this.URL}/` + id).pipe(
      tap((_) => console.log(`Photo fetched: ${id}`)),
      catchError(this.handleError<Photo>(`Get photo id=${id}`))
    );
  }

  getPhotoList(): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${this.URL}/`).pipe(
      tap((_) => console.log('Photos fetched!')),
      catchError(this.handleError<Photo[]>('Get photos', []))
    );
  }

  updatePhoto(id: any, photo: Photo): Observable<any> {
    return this.http.put(`${this.URL}/` + id, photo, this.httpHeader).pipe(
      tap((_) => console.log(`Photo updated: ${id}`)),
      catchError(this.handleError<Photo[]>('Update photo'))
    );
  }

  deletePhoto(id: any): Observable<Photo> {
    return this.http.delete<Photo>(`${this.URL}/` + id, this.httpHeader).pipe(
      tap((_) => console.log(`Photo deleted: ${id}`)),
      catchError(this.handleError<Photo>('Delete photo'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
