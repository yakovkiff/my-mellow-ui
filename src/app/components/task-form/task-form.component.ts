import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { Task } from '../../models/task.model';
import { TaskHttpService } from '../../services/task-http.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit, OnDestroy {

  @Input() task?: Task;

  @Output() created = new EventEmitter<Task>();
  @Output() updated = new EventEmitter<Task>();

  destroy$ = new Subject<boolean>();
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: TaskHttpService
  ) {
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit() {
    this.initializeForm();
  }

  submit(): void {
    console.log('submit');
    const formValue = this.form.value as Task;
    console.log(formValue);

    if (!this.task) {
      formValue.taskFlowId = 1;
      this.http.create(formValue)
      .pipe(
        tap(task => {
          this.form.reset();
          this.created.emit(task);
        }),
        takeUntil(this.destroy$)
      ).subscribe();
    } else {
      console.log(this.form.value);
      this.http.update(this.form.value)
      .pipe(
        tap(task => {
          this.form.reset();
          this.updated.emit(task);
        }),
        takeUntil(this.destroy$)
      ).subscribe();
    }
  }

  private initializeForm(): void {
    console.log(this.task);
    this.form = this.formBuilder.group({
      id: this.task ? this.task.id : '',
      taskFlowId: this.task ? this.task.taskFlowId : '',
      name: [this.task ? this.task.name : '', [Validators.required, Validators.maxLength(50)]]
    });
  }

}
