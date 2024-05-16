import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  concat,
  fromEvent,
  interval,
  noop,
  observable,
  Observable,
  of,
  timer,
  merge,
  Subject,
  BehaviorSubject,
  AsyncSubject,
  ReplaySubject
} from 'rxjs';
import { concatMap, delayWhen, filter, map, take, timeout } from 'rxjs/operators';

import { createHttpObservable, createHttpObservable$ } from '../common/util';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  ngOnInit() {
    /* callback based streams */
    /* document.addEventListener('click', (e) => {
        console.log(e)
    });

    let tick = 0;
    setInterval(() => {
        console.log(tick);
        tick++;
    }, 1000);

    setTimeout(() => {
        console.log('...timeout');
    }, 3000 ); */

    /* RxJs streams */
    /* const interval$ = interval(1000);

    const timer$ = timer(3000, 1750);

    const event$ = fromEvent(document, 'click');

    const intervalSub = interval$
        .subscribe(
            (interval) => console.log('stream 1 value:', interval),
            (error) => console.error(error),
            () => console.log('stream 1 complete')
    );

    const timerSub = timer$
        .subscribe(
            (timer) => console.log('stream 2 value:', timer),
            (error) => console.error(error),
            () => console.log('stream 2 complete')
    );

    const eventSub = event$
        .subscribe(
            (click) => console.log('stream 3 value:', click),
            (error) => console.error(error),
            () => console.log('stream 3 complete')
    );

    setTimeout(() => intervalSub.unsubscribe(), 9000);
    setTimeout(() => timerSub.unsubscribe(), 12000); */

    /* deprecated */
    /* const fetch$ = Observable.create((observer) => {
        fetch(('/api/courses'))
            .then((response) => {
                return response.json;
            })
            .then((body) => {
                observer.next(body);
                observer.complete();
            })
            .catch((error) => {
                observer.error(error);
            });
    }); */

    const fetch$ = createHttpObservable$('/api/courses');

    const fetchSub = fetch$.subscribe(console.log);

    setTimeout(() => fetchSub.unsubscribe(), 0)

    /* fetch$.subscribe(
      (data) => console.log(data),
      (error) => console.error(error), // or noop if no error is possible
      () => console.log('fetch complete')
    ); */

    /* const source0$ = of('\n\noutput tag');
    const source1$ = of(1, 2, 3);
    const source2$ = of(4, 5, 6);
    const source3$ = of('a', 'b', 'c');

    const result$ = concat(source0$, source1$, source2$, source3$);
  
    result$
      .subscribe((output) => console.log(output));

    // * passing a reference to a function instead of invoking it
    // * ...in this instance, the console.log function

    result$
      .subscribe(console.log);

    // * observables must complete for concat() to emit
    // * subsequent observables passed in the output stream
    const sourceInf$ = interval(500);

    const foreverTimer$ = concat(sourceInf$, source1$);

    foreverTimer$
      .subscribe(console.log); */
    
    const interval1$ = interval(1000);

    const interval2$ = interval1$.pipe(map((val) => val * 10));

    const result$ = merge(interval1$, interval2$);

    const subscription = result$
      .subscribe(console.log);

      setTimeout(() => subscription.unsubscribe(), 5000);
  }
}

