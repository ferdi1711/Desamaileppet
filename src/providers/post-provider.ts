import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PostProvider {
  //server: string = 'http://localhost/api1/'; // Jika kamu pakai XAMPP

  server: string = 'https://ferdi.si2022.com/'; // Jika kamu pakai XAMPP
  constructor(public http: HttpClient) {}

  postData(body: any, file: string): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });

    return this.http.post(this.server + file, JSON.stringify(body), { headers }).pipe(
      map((res: any) => res)
    );
  }
}
