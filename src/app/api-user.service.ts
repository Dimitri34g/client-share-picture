import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
export class User {
  id: string;
  name: string;
  email: string;
  password: string;
}
@Injectable({
  providedIn: 'root',
})
export class ApiUserService {
  URL: string = 'http://localhost:3000/User';
  httpHeader = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(private http: HttpClient) {}
  addUser(user: User): Observable<any> {
    return this.http
    .post<User>(`${this.URL}/`, user, this.httpHeader)
      .pipe(catchError(this.handleError<User>('Add User')));
  }
  getUser(id: any): Observable<User[]> {
    return this.http.get<User[]>(`${this.URL}/` + id).pipe(
      tap((_) => console.log(`User fetched: ${id}`)),
      catchError(this.handleError<User[]>(`Get user id=${id}`))
    );
  }
  getUserList(): Observable<User[]> {
    return this.http.get<User[]>(`${this.URL}/`).pipe(
      tap((User) => console.log('User fetched!')),
      catchError(this.handleError<User[]>('Get user', []))
    );
  }
  updateUser(id: any, user: User): Observable<any> {
    return this.http.put(`${URL}/` + id, user, this.httpHeader).pipe(
      tap((_) => console.log(`User updated: ${id}`)),
      catchError(this.handleError<User[]>('Update user'))
    );
  }
  deleteUser(id: any): Observable<User[]> {
    return this.http.delete<User[]>(`${URL}/` + id, this.httpHeader).pipe(
      tap((_) => console.log(`User deleted: ${id}`)),
      catchError(this.handleError<User[]>('Delete user'))
    );
  }
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.URL}/login`, {email, password}, this.httpHeader).pipe(
      tap((_) => console.log('User logged in')),
      catchError(this.handleError<any>('Login'))
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