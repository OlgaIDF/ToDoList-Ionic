import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Component } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { IonRouterOutlet } from '@ionic/angular';
import { AddPage } from '../add/add.page';
import { OrderPipe } from 'ngx-order-pipe';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public goals = [];
  public tasks = [];
  public taskPercentage: number;

  constructor(
    public afDB: AngularFireDatabase,
    public modalController: ModalController,
    public alertController: AlertController,
    private routerOutlet: IonRouterOutlet,
    private orderPipe: OrderPipe

  ) {
    this.getGoals();
    this.getTasks();
  }



  doReorder(ev: any) {
    ev.detail.complete();
    const draggedItem = this.goals.splice(ev.detail.from, 1)[0];
    this.goals.splice(ev.detail.to, 0, draggedItem);
    let count = 0;
    this.goals.forEach((element) => {
      this.afDB.object('Goals/' + element.key + '/order').set(count);
      console.log(element.text + ' -> ' + count);
      count++;
    });
  }



  async openAddPage() {
    const modal = await this.modalController.create({
      component: AddPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });
    return await modal.present();
  }

  getGoals() {
    this.afDB.list('Goals/')
      .snapshotChanges(['child_added', 'child_removed'])
      .subscribe(goals => {
        this.goals = [];
        goals.forEach(goal => {
          this.goals.push({
            key: goal.key,
            order: goal.payload.exportVal().order,
            text: goal.payload.exportVal().text,
            color: goal.payload.exportVal().color
          });
          this.goals = this.orderPipe.transform(this.goals, 'order');
        });
      });
  }

  getTasks() {
    this.afDB.list('Tasks/')
      .snapshotChanges(['child_added', 'child_changed', 'child_removed'])
      .subscribe(tasks => {
        this.tasks = [];
        tasks.forEach(task => {
          this.tasks.push({
            key: task.key,
            text: task.payload.exportVal().text,
            date: task.payload.exportVal().date,
            checked: task.payload.exportVal().checked,
            categorie: task.payload.exportVal().categorie,
            color: task.payload.exportVal().color
          });
        });
        this.calculPercentage(); // -< exécuter la fonction
      });
  }
  taskClicked(task: any) {
    this.afDB.list('Tasks/' + task.key).set('checked', task.checked);
    this.calculPercentage();
  }

  calculPercentage() {
    let count = 0;
    let checkedTask = 0;
    this.tasks.forEach(task => {
      if (task.checked == true) { checkedTask++ }
      count++;
    });
    console.log('count: ', count, ', checkedTask: ', checkedTask);
    this.taskPercentage = Math.floor((checkedTask / count) * 100);
  }
  deleteGoal(goal: any) {
    this.afDB.list('Goals/' + goal.key).remove();
  }

  async editGoal(goal: any) {
    const alert = await this.alertController.create({
      header: 'Modifer un objectif',
      inputs: [
        {
          name: 'goal',
          type: 'text',
          value: goal.text,
          placeholder: 'Votre objectif'

        },
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
            this.getGoals();
          }
        }, {
          text: 'Modifier',
          handler: data => {
            console.log('Objectif: ' + data.goal);
            this.afDB.object('Goals/' + goal.key +
              '/text').set(data.goal);
            this.getGoals();
          }
        }
      ]
    });
    await alert.present();
  }
}
