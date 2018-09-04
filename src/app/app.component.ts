import { Component, OnInit } from '@angular/core';
import { MatCard } from "@angular/material";
import { CarService } from './services/car.service';
import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable, of } from 'rxjs';
import {catchError, finalize} from "rxjs/operators";
import { Car } from "./model/car";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'datatable';
  dataSource: LessonsDataSource;
  displayedColumns = ["id", "model", "year"];
  constructor( private carService: CarService ){

  }

  ngOnInit(){
    this.dataSource = new LessonsDataSource(this.carService);
    this.dataSource.loadCars(1);
  }
}

export class LessonsDataSource implements DataSource<Car> {

    private carsSubject = new BehaviorSubject<Car[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private carService: CarService) {}

    connect(collectionViewer: CollectionViewer): Observable<Car[]> {
        return this.carsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.carsSubject.complete();
        this.loadingSubject.complete();
    }

    loadCars(courseId: number, filter = '',
                sortDirection = 'asc', pageIndex = 0, pageSize = 3) {

        this.loadingSubject.next(true);

        this.carService.findCars(courseId, filter, sortDirection,
            pageIndex, pageSize).pipe(
              catchError(() => of([])),
              finalize(() => this.loadingSubject.next(false))
        )
        .subscribe(cars => {
          console.log(cars);
          this.carsSubject.next(cars);
        });
    }
}
