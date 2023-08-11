import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  onAddUser = new EventEmitter();
  onEditUser = new EventEmitter();
  userForm:any = FormGroup;
  dialogAction:any ="Add";
  action:any = "Add";
  responseMessage:any;
  categorys:any = [];
  hide = true;
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any,
  private formbuilder:FormBuilder,
  private userService:UserService,
  private ngxService:NgxUiLoaderService,
  private categoryService:CategoryService,
  public dialogRef: MatDialogRef<UserComponent>,
  private snackbarService:SnackbarService) { }

  ngOnInit(): void {

    this.userForm = this.formbuilder.group({
      name : [null,[Validators.required,Validators.pattern(GlobalConstants.nameRegex)]],
      email:[null,[Validators.required,Validators.pattern(GlobalConstants.emailRegex)]],
      password:[null,Validators.required],
      contactNumber:[null,[Validators.required,Validators.pattern(GlobalConstants.ContactNumberRegex)]],
      
    });
    if(this.dialogData.action === 'Edit'){
      this.dialogAction = "Edit";
      this.action = "Update";
      this.userForm.patchValue(this.dialogData.data);
    }

    this.getUsers();
  }

  getUsers(){
    this.userService.getUsers().subscribe((response:any)=>{
      this.categorys = response;

    },error=>{
      console.log(error);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    });
  }

  handleSubmit(){
    if(this.dialogAction === "Edit"){
      this.edit();
    }
    else{
      this.add();

    }
  }




  add(){

    var formData = this.userForm.value;                           
    var data = {
      name:formData.name,
      email:formData.email,
      password:formData.password,
      contactNumber:formData.contactNumber
    }


    this.userService.add(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onAddUser.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage,"success");
    },(error)=>{
      this.dialogRef.close();
      console.log(error);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    });


  }

  edit(){


    var formData = this.userForm.value;
    var data = {
      id:this.dialogData.data.id,
      name:formData.name,
      categoryId:formData.categoryId,
      price:formData.price,
      description:formData.description 
    }
    this.userService.update(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onEditUser.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage,"success");
    },(error)=>{
      this.dialogRef.close();
      console.log(error);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    });

  }

}

