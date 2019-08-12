import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskHttpService } from '../../services/task-http.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {

  tasks: Task[];
  update: Task;

  constructor(private http: TaskHttpService) { }

  ngOnInit() {
    this.getTasks();
  }

  getTasks(): void {
    this.http.get()
      .pipe(
        tap(tasks => this.tasks = tasks)
      ).subscribe();
  }

  renderAdd = (task: Task): void => {
    this.tasks.push(task);
  }

  renderUpdate = (task: Task): void => {
    const index = this.tasks.findIndex(t => t.id === task.id);
    this.tasks.splice(index, 1, task);
    this.update = null;
  }

  openUpdate(task: Task): void {
    this.update = task;
  }

  delete(id: number): void {
    this.http.delete(id)
    .pipe(
      tap(() => {
        const index = this.tasks.findIndex(t => t.id === id);
        this.tasks.splice(index, 1);
      })
    )
    .subscribe();
  }

}
