import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CarService {

  constructor(private http:HttpClient ) { }

  findCars(carId:number, filter = '', sortOrder = 'asc', pageNumber = 0, pageSize = 3){
    return this.http.get('http://rentals-api.webtraining.fun/api/vehicles', {
      params: new HttpParams()
        .set('carId', carId.toString())
        .set('filter', filter)
        .set('sortOrder', sortOrder)
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString())
    }).pipe(
          map(res => res["payload"])
    );
  }
}
