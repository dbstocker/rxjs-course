import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Course } from "../model/course";
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll, shareReplay,
  throttle,
  throttleTime
} from 'rxjs/operators';
import { merge, fromEvent, Observable, concat, interval } from 'rxjs';
import { Lesson } from '../model/lesson';
import { createHttpObservable } from '../common/util';
import { Store } from '../common/store.service';

@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {
  course$: Observable<Course>
  lessons$: Observable<Lesson[]>
  courseId: string;

  @ViewChild('searchInput', { static: true }) input: ElementRef;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.courseId = this.route.snapshot.params['id'];

    this.course$ = createHttpObservable(`/api/courses/${this.courseId}`);

  }

  ngAfterViewInit() {
    // * separate observables for initial load and typeahead search, combined
    // * using the concat() operator
    // const searchLessons$ = fromEvent<KeyboardEvent>(this.input.nativeElement, 'keyup')
    //   .pipe(
    //     map((event: KeyboardEvent) => (event.target as HTMLInputElement).value),
    //     distinctUntilChanged(),
    //     switchMap((search) => this.loadLessons(search))
    //   );

    // const initialLessons$ = this.loadLessons();

    // this.lessons$ = concat(initialLessons$, searchLessons$)

    // * less and less complicated code by introducing the startWith() operator
    // * and providing the event / search argument with an initial value of ''
    this.lessons$ = fromEvent<KeyboardEvent>(this.input.nativeElement, 'keyup')
    .pipe(
      map((event: KeyboardEvent) => (event.target as HTMLInputElement).value),
      startWith(''),
      distinctUntilChanged(),
      switchMap((search) => this.loadLessons(search))
    );

    // * debounceTime() vs throttle()
    // * debounceTime will start the timer over after each event, and will
    // * only emit a value when the time specified has elapsed between events
    // * throttle will emit a value whenever specified by the logic given to it,
    // * for example, after specific intervals of time
    // * throttleTime() is equivalent to using throttle() and passing an
    // * interval()
    fromEvent<KeyboardEvent>(this.input.nativeElement, 'keyup')
      .pipe(
        map((event: KeyboardEvent) => (event.target as HTMLInputElement).value),
        startWith(''),
        // debounceTime(400)
        // throttle(() => interval(400))
        throttleTime(400)
      ).subscribe(console.log);
  }

  // loadLessons(search = ''): Observable<Lesson[]> { // * provide an initial value to the 
                                                      // * argument for the concat() use case
  loadLessons(search): Observable<Lesson[]> { // * no need for default argument value in
                                              // * the single observable use case
    return createHttpObservable(`/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
    .pipe(
      map((res) => res['payload'])
    );
  }
}











