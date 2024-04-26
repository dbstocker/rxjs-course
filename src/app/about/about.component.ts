import {Component, OnInit, ViewEncapsulation} from '@angular/core';
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
import {delayWhen, filter, map, take, timeout} from 'rxjs/operators';
import {createHttpObservable} from '../common/util';


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

        const fetch$ = new Observable((observer) => {
                fetch('/api/courses')
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
            });
    
        fetch$.subscribe(
            (data) => console.log(data),
            (error) => console.error(error), // or noop if no error is possible
            () => console.log('fetch complete')
        );
    }
}
