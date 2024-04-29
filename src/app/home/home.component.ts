import { Component, OnInit } from "@angular/core";

import { interval, noop, Observable, of, throwError, timer } from "rxjs";
import {
  catchError,
  delay,
  delayWhen,
  finalize,
  map,
  retryWhen,
  shareReplay,
  tap,
} from "rxjs/operators";

import { Store } from "../common/store.service";
import { createHttpObservable, createHttpObservable$ } from "../common/util";
import { Course } from "../model/course";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  beginnerCourses: Course[];
  advancedCourses: Course[];

  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor(private store: Store) {}

  ngOnInit() {
    const fetch$ = createHttpObservable('/api/courses');

    const courses$: Observable<Course[]> = fetch$
      .pipe(
        tap(() => console.log('fetch dispatched')),
        map((data) => Object.values(data['payload'])),
        shareReplay() // * Ensures observables derived from a single source observable will
                      // * not trigger successive invocations of the source observable if the
                      // * source observable has already begun emitting values
      );

    /**
     * ! Having too much logic in a subscribe block, or having nested subscribe
     * ! blocks is an RxJs anti-pattern. To implement Reactive Design, use multiple
     * ! discreet observable streams instead (see below).
     */

    /* courses$.subscribe(
      (data) => {
        console.log(data);
        this.beginnerCourses = data.filter((course) => course.category == 'BEGINNER');
        this.advancedCourses = data.filter((course) => course.category == 'ADVANCED');
        console.log('beginner', this.beginnerCourses);
        console.log('advanced', this.advancedCourses);
      },
      (error) => console.error(error),
      () => console.log('fetch complete')
    ); */

    /**
     * * A better solution:
     */
    this.beginnerCourses$ = courses$
      .pipe(
        map((courses) => courses
          .filter((course) => course.category == 'BEGINNER'))
      );
    
    this.advancedCourses$ = courses$
      .pipe(
        map((courses) => courses
          .filter((course) => course.category == 'ADVANCED'))
      );
  }
}
