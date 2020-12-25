import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FirstLayoutComponent } from './components';
import { SecondLayoutComponent } from './components';

const routes: Routes = [
	{ path: 'one', component: FirstLayoutComponent },
	{ path: 'two', component: SecondLayoutComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
