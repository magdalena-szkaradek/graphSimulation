import { Injectable } from '@angular/core';
import { Http, Response} from '@angular/http';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  constructor(private http: Http) { }

  getInitialGraph(): Observable<string>{
    return this.http.get('http://localhost:8090/graph').pipe(map((res:any) => res._body));  
  }

  removeNode(id: number): Observable<string> {
    return this.http.delete(`http://localhost:8090/graph/removeNode/${id}`).pipe(mergeMap(() => this.getInitialGraph()));  
  }

  saveGraph(id: number): Observable<string> {
    return this.http.delete(`http://localhost:8090/graph/saveGraph`).pipe(mergeMap(() => this.getInitialGraph()));  
  }
}