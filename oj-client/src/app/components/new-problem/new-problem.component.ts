import { Component, OnInit, Inject } from '@angular/core';
import { Problem } from 'app/data-structure/problem';

const DEFAULT_PROBLEM: Problem = Object.freeze({
  id: 0,
  name: '',
  desc: '',
  difficulty: 'easy'
});

@Component({
  selector: 'app-new-problem',
  templateUrl: './new-problem.component.html',
  styleUrls: ['./new-problem.component.css']
})
export class NewProblemComponent implements OnInit {
  // initialize new problem, set a default value
  newProblem: Problem = Object.assign({}, DEFAULT_PROBLEM);
  difficulties: string[] = ['easy', 'medium', 'hard', 'super'];
  constructor(@Inject('data') private data) { }

  ngOnInit() {
  }

  addProblem() {
    this.data.addProblem(this.newProblem)
      .catch(error => console.log(error.body));
    // after adding a new problem, reset new problem to default value
    this.newProblem = Object.assign({}, DEFAULT_PROBLEM);
  }

}
