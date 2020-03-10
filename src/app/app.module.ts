import { BrowserModule } from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { PlanFormComponent } from './plan-form/plan-form.component';
import {ShowPlanBottomSheet, ShowPlanComponent} from './show-plan/show-plan.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyPlansComponent } from './my-plans/my-plans.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {
  MatBottomSheetModule,
  MatCardModule,
  MatCheckboxModule,
  MatInputModule,
  MatListModule,
  MatSnackBarModule, MatTableModule
} from "@angular/material";
import {HttpClientModule} from "@angular/common/http";
import { PlanListComponent } from './plan-list/plan-list.component';
import { FavoritePlansComponent } from './favorite-plans/favorite-plans.component';
import {NgbModal, NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {BackButtonComponent} from "./BackButton";
import { LandingPageComponent } from './landing-page/landing-page.component';
import { PlanNavTableComponent } from './plan-nav-table/plan-nav-table.component';



const routes: Routes = [
  { path: 'home', component: LandingPageComponent},
  { path: 'edit-plan/:planId', component: PlanFormComponent},
  { path: 'new-plan', component: PlanFormComponent},
  { path: 'my-plans', component: MyPlansComponent},
  { path: 'fav-plans', component: FavoritePlansComponent},
  { path: 'plan/:planId', component: ShowPlanComponent},
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  declarations: [
    AppComponent,
    PlanFormComponent,
    ShowPlanComponent,
    MyPlansComponent,
    PlanListComponent,
    FavoritePlansComponent,
    ShowPlanBottomSheet,
    BackButtonComponent,
    LandingPageComponent,
    PlanNavTableComponent
  ],
  imports: [
    BrowserModule,HttpClientModule,BrowserAnimationsModule,
    NgbModule,
    MatInputModule,MatCardModule,MatListModule,MatCheckboxModule,MatSnackBarModule,MatBottomSheetModule,MatTableModule,
    FormsModule,ReactiveFormsModule,
    RouterModule.forRoot(routes, { enableTracing: true })
  ],
  entryComponents: [ShowPlanBottomSheet],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
