import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Course } from "../model/course";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import * as moment from 'moment';
import { fromEvent, noop } from 'rxjs';
import { concatMap, distinctUntilChanged, exhaustMap, filter, mergeMap, tap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';
import { Store } from '../common/store.service';

@Component({
  selector: 'course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrls: ['./course-dialog.component.css']
})
export class CourseDialogComponent implements AfterViewInit {

  form: FormGroup;

  course: Course;

  @ViewChild('saveButton', { static: true, read: ElementRef }) saveButton: ElementRef;

  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course: Course,
    private store: Store) {

    this.course = course;

    this.form = fb.group({
      description: [course.description, Validators.required],
      category: [course.category, Validators.required],
      releasedAt: [moment(), Validators.required],
      longDescription: [course.longDescription, Validators.required]
    });

  }

  ngOnInit() {
    /**
     * ! RxJs anti-pattern
     * ! - nested subscription blocks
     * ! - changes are sent to API as soon as they are emitted
     * ! - no guarantee that the emitted changes are the last valid changes
     */
    /* this.form.valueChanges
      .pipe((
        filter(() => this.form.valid)
      ))
      .subscribe((changes) => {
        const saveCourse$ = fromPromise(fetch(`/api/courses/${this.course.id}`, {
          method: 'PUT',
          body: JSON.stringify(changes),
          headers: {
            'content-type': 'application/aqg'
          }
        }));

        saveCourse$.subscribe();
      }); */

    this.form.valueChanges
      .pipe((
        filter(() => this.form.valid),
        /**
         * * elegantly waits for stream to complete emitting before
         * * sending changes to API using concatMap. use whenever
         * * the order of emitted values is important and needs to
         * * be preserved.
         */
        // concatMap((changes) => this.saveCourse(changes))
        /**
         * * fires all emitted observable values in parallel, not
         * * waiting for the previous values' emissions to complete.
         * * use when order of emitted values doesn't matter
         */
        mergeMap((changes) => this.saveCourse(changes))
      ))
      .subscribe();
  }

  saveCourse(changes) {
    return fromPromise(fetch(`/api/courses/${this.course.id}`, {
      method: 'PUT',
      body: JSON.stringify(changes),
      headers: {
        'content-type': 'application/json'
      }
    }));
  }

  ngAfterViewInit() {
    fromEvent(this.saveButton.nativeElement, 'click')
      .pipe(
        /**
         * * when the first value is emitted, ignore subsequent
         * * values until the current observable is complete by
         * * using exhaustMap
         */
        exhaustMap(() => this.saveCourse(this.form.value))
      )
      .subscribe();
  }

  save() {
    // console.log('save()');
    // this.store.saveCourse(this.course.id, this.form.value)
    //   .subscribe(
    //     () => this.close(),
    //     err => console.log("Error saving course", err)
    //   );
  }

  close() {
    this.dialogRef.close();
  }
}
