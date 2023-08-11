import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { SnackbarService } from '../services/snackbar.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../shared/global-constants';
import { error } from 'console';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  password = true;
  confirmPassword = true;
  signupForm:any = FormGroup;
  responseMessage:any;

  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(
    private formbuilder:FormBuilder,
    private router:Router,
    private userServices:UserService,
    private snackBarService:SnackbarService,
    public dialog:MatDialogRef<SignupComponent>,
    private ngxService:NgxUiLoaderService
    
    ) 
    { }

  ngOnInit(): void {

    this.signupForm = this.formbuilder.group({
      name : [null,[Validators.required,Validators.pattern(GlobalConstants.nameRegex)]],
      email : [null,[Validators.required,Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber : [null,[Validators.required,Validators.pattern(GlobalConstants.ContactNumberRegex)]],
      password:[null,Validators.required],
      confirmPassword:[null,Validators.required],
    })
  }

  validateSubmit(){
    if(this.signupForm.controls['password'].value != this.signupForm.controls['confirmPassword'].value){
      return true;
    }else{
      return false;
    }
  }

  handleSubmit(){
    this.ngxService.start();
    var formData = this.signupForm.value;
    var data = {
      name : formData.name,
      email : formData.email,
      password:formData.password,
      contactNumber:formData.contactNumber,
      
    }
    this.userServices.signup(data).subscribe((responce:any) =>{
      this.ngxService.stop();
      this.dialog.close();
      this.responseMessage = responce?.message;
      this.snackBarService.openSnackBar(this.responseMessage,"");
      this.router.navigate(['/']);
    },(error)=>{

      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackBarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }


  // onSubmit(): void {
  //   const { name, email, password,contactNumber } = this.signupForm;

  //   this.userServices.register(name, email, password,contactNumber).subscribe(
  //     data => {
  //       console.log(data);
  //       this.isSuccessful = true;
  //       this.isSignUpFailed = false;
  //     },
  //     err => {
  //       this.errorMessage = err.error.message;
  //       this.isSignUpFailed = true;
  //     }
  //   );
  // }


}
