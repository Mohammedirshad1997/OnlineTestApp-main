import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../service/question.service';
import {interval} from 'rxjs'

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  public name : string='';
  public questionList : any = [];
  public currentQuestion:number = 0;
  public points : number = 0;
  counter = 60;
  correctAnswer:number = 0;
  inCorrectAnswer:number = 0;
  interval$ : any;
  isQuizCompleted : boolean = false;

  constructor(private questionService : QuestionService) {
    
   }

  ngOnInit(): void {
    this.name = localStorage.getItem("name")!;
    this.getAllQuestions();
    this.startCounter();
  }

  getAllQuestions(){
    this.questionService.getQuestionJson().subscribe(res=>{
      this.questionList = res.questions
    })
  }

  nextQuestion(){
    this.currentQuestion++;
  }

  prevQuestion(){
    this.currentQuestion--;
  }

  answer(currentQno:number,option:any){
    
    if(currentQno === this.questionList.length){
      this.isQuizCompleted = true;
      this.stopCounter();
    }

    if(option.correct){
      this.points += 1;
      this.correctAnswer++;
      this.currentQuestion++;
    }
    else{
      this.points -= 1;
      this.inCorrectAnswer++;
      this.currentQuestion++;
    }
  }

  startCounter(){
    this.interval$ = interval(1000)
    .subscribe(val=>{
      this.counter--;
      if(this.counter===0){
        this.currentQuestion++;
        this.counter=60;
        this.points -= 1;
      }
    });
    setTimeout(() =>{
      this.interval$.unsubscribe()
    },6000000)
  }

  stopCounter(){
    this.interval$.unsubscribe();
    this.counter = 60;
    this.startCounter();
  }

  resetCounter(){
    this.stopCounter();
    this.counter = 60;
    this.startCounter();
  }

  resetQuiz(){
    this.resetCounter();
    this.getAllQuestions();
    this.points = 0;
    this.counter = 60;
    this.currentQuestion = 0;
  }

}
