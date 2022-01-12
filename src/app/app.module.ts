import { AddPageModule } from './add/add.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { OrderModule } from 'ngx-order-pipe';


const firebaseConfig = {
  apiKey: "AIzaSyCVOgMrqf6woU6YTK5d8mcfzmltcgE_FSQ",
  authDomain: "wunderlist-91372.firebaseapp.com",
  databaseURL: "https://wunderlist-91372-default-rtdb.firebaseio.com",
  projectId: "wunderlist-91372",
  storageBucket: "wunderlist-91372.appspot.com",
  messagingSenderId: "363078422476",
  appId: "1:363078422476:web:6f5ea54c8b0ab343961769"
};

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    OrderModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule { }
