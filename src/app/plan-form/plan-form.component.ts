import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Practice} from "../plan/practice";
import {PlanService} from "../plan/plan.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {switchMap} from "rxjs/operators";
import {handleError} from "../helpers";
import {Plan} from "../plan/plan";
import {KeycloakService} from "keycloak-angular";

@Component({
  selector: 'app-new-plan-form',
  templateUrl: './plan-form.component.html',
  styleUrls: ['./plan-form.component.css']
})
export class PlanFormComponent implements OnInit {
  userName = ""
  form = this.getEmptyForm()
  modelId: string

  constructor(
    private formBuilder: FormBuilder,
    private planService: PlanService,
    private route: ActivatedRoute,
    private router: Router,
    protected keycloakAngular: KeycloakService
  ) { }

  ngOnInit() {
    let userProfilePromise = this.keycloakAngular.loadUserProfile();
    userProfilePromise.then(profile => this.userName = profile.username)
    this.route.paramMap.subscribe(params => {
      this.modelId = params.get('planId') || null
      if (this.isInEditMode()) {
        this.initWithPlanId(this.modelId)
      }
    });
  }

  private isInEditMode() {
    return this.modelId !== null
  }

  private initWithPlanId(planId: string) {
    this.planService.getPlan(planId).subscribe(
      plan => {
        this.form = this.formBuilder.group({
          title: this.formBuilder.control(plan.title),
          practices: this.asFormArray(plan.practices)
        })
      },
      err => {
        if(err.error.error === "NO_PLAN_FOUND") {
          this.router.navigateByUrl("/new-plan")
        }
        handleError(err);
        
      }
    )
  }

  private asFormArray(practices: Practice[]):FormArray {
    let result = this.formBuilder.array([])
    for(let practice of practices){
      result.push(this.formBuilder.group({
        name: this.formBuilder.control(practice.name),
        quantity: this.formBuilder.control(practice.quantity)
      }))
    }
    return result
  }

  getPracticesFormArray () {
    return this.form.get('practices') as FormArray
  }

  private getPractices(): Practice[] {
    let practiceFormArray = this.getPracticesFormArray()
    let practices = []
    for (let i=0; i < practiceFormArray.length; i++) {
      let formGroup = practiceFormArray.at(i)
      practices.push(new Practice(formGroup.get('name').value, formGroup.get('quantity').value))
    }
    return practices
  }

  private getEmptyForm() : FormGroup{
    return this.formBuilder.group({
      title: this.formBuilder.control(''),
      practices: this.formBuilder.array([
        this.formBuilder.group({
          name: this.formBuilder.control(''),
          quantity: this.formBuilder.control('')
        })
      ])
    });
  }

  onSubmit() {
    let practices = this.getPractices()
    let plan = new Plan("",this.form.get('title').value, this.userName, practices)
    if (this.isInEditMode()) {
      this.planService.updatePlan(plan, this.modelId).subscribe(
        plan => console.log('success'),
        error1 => handleError(error1)
      )
    } else {
      this.planService.savePlan(plan).subscribe(
        plan => console.log('success'),
        error1 => handleError(error1)
      )
    }
    this.router.navigate(['/my-plans'])
  }


  addPracticeControls() {
    let control = this.form.get('practices') as FormArray
    control.push(
      this.formBuilder.group({
        name: this.formBuilder.control(''),
        quantity: this.formBuilder.control('')
      })
    )
  }

  addPracticeControlAfter(index: number) {
    let control = this.form.get('practices') as FormArray
    control.insert(index +1 , this.newPracticeControl())
  }

  removePracticeControls(index: number) {
    let control = this.form.get('practices') as FormArray
    control.removeAt(index);
  }


  private newPracticeControl(): AbstractControl {
    return this.formBuilder.group({
      name: this.formBuilder.control(''),
      quantity: this.formBuilder.control('')
    })
  }
}
