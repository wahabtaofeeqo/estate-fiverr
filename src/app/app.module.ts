import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { FirstLayoutComponent } from './components/first-layout/first-layout.component';
import { SecondLayoutComponent } from './components/second-layout/second-layout.component';

@NgModule({
  declarations: [
    AppComponent,
    FirstLayoutComponent,
    SecondLayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
