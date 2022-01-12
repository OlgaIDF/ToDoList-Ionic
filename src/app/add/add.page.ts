import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})

export class AddPage implements OnInit {
  categories = [];
  countGoal: number;

  goal = {
    text: '',
    color: 'primary'
  };

  segmentValue = 'goal';
  task = {
    text: '',
    categorie: '',
    color: ''
    };
    

  constructor(
    public modalController: ModalController,
    public afDB: AngularFireDatabase
  ) { }

  ngOnInit() {
    this.getGoals();
  }

  addGoal() {
    console.log(this.goal.color);
    this.afDB.list('Goals/').push({
    text: this.goal.text,
    color: this.goal.color,
    order: this.countGoal
    });
    this.closeModal();
    }
  closeModal() {
    this.modalController.dismiss();
  }

  getGoals() {
    this.afDB.list('Goals/').snapshotChanges(['child_added'])
    .subscribe(goals => {
    this.countGoal = 0;
    goals.forEach(goal => {
    this.countGoal++;
    this.categories.push({
    text: goal.payload.exportVal().text,
    color: goal.payload.exportVal().color
    });
    });
    this.task.categorie = this.categories[0].text; // <- à ajouter
    this.task.color = this.categories[0].color; // <- à ajouter
    });
    }
    changeColor() {
      this.categories.forEach((cat) => {
      if(cat.text == this.task.categorie) {
      console.log('Couleur: ' + cat.color);
      this.task.color = cat.color;
      }
      });
      }

      addTask() {
        this.afDB.list('Tasks/').push({
        text: this.task.text,
        categorie: this.task.categorie,
        checked: false,
        date: new Date().getHours() + ':' + new Date().getMinutes(),
        color: this.task.color
        });
        this.closeModal();
        }
      
}
