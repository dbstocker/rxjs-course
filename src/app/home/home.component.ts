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

  fallbackCourse: Course[] = [
    {
      id: 0,
      description: "RxJs In Practice Course",
      iconUrl: 'https://s3-us-west-1.amazonaws.com/angular-university/course-images/rxjs-in-practice-course.png',
      courseListIcon: 'https://angular-academy.s3.amazonaws.com/main-logo/main-page-logo-small-hat.png',
      longDescription: "Understand the RxJs Observable pattern, learn the RxJs Operators via practical examples",
      category: 'BEGINNER',
      lessonsCount: 10
    }
  ];

  constructor(private store: Store) {}

  ngOnInit() {
    const fetch$ = createHttpObservable('/api/courses');

    const courses$: Observable<Course[]> = fetch$
      .pipe(
        tap(() => console.log('fetch dispatched')),
        // * catchError()
        // * since this flow uses a combination operator - shareReplay() -
        // * we can simplify error handling and only throw errors once
        // * by moving the catchError() operator higher than shareReplay()
        // * in chain of operators
        catchError((error) => {
          console.log('an error occurred:', error);
          return throwError(error);
        }),
        map((data) => Object.values(data['payload'])),
        // * shareReplay()
        // * Ensures observables derived from a single source observable will
        // * not trigger successive invocations of the source observable if the
        // * source observable has already begun emitting values
        shareReplay(),
        // * catchError()
        // * catches error and provides for emitting a value from an
        // * alternative observable
        // catchError((error) => of(this.fallbackCourse))
        // * catchError()
        // * in this usage, the alternative observable is provided by the
        // * throwError() utility, allowing for logging the error message,
        // * which is built in the utils.ts fetch utility, to the console
        /* catchError((error) => {
          console.log('an error occurred:', error);
          return throwError(error);
        }), */
        // * retryWhen()
        // * re-tries the observable when there are errors and when we 
        // * set conditions around those errors, for example, by specifying
        // * a number of times to retry, or a period of time after which to
        // * retry
        retryWhen((errors) => errors.pipe(
          delayWhen(() => timer(2000))
        )),
        // * finalize()
        // * emit a value when the observable completes, whether or not
        // * it was successful
        finalize(() => {
          console.log('the courses$ observable was finalized with finalize()');
        })
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
