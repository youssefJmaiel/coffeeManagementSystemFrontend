import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { error } from 'console';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  onAddProduct = new EventEmitter();
  onEditProduct = new EventEmitter();
  productForm:any = FormGroup;
  dialogAction:any ="Add";
  action:any = "Add";
  responseMessage:any;
  categorys:any = [];
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any,
  private formbuilder:FormBuilder,
  private productService:ProductService,
  private ngxService:NgxUiLoaderService,
  private categoryService:CategoryService,
  public dialogRef: MatDialogRef<ProductComponent>,
  private snackbarService:SnackbarService) { }

  ngOnInit(): void {

    this.productForm = this.formbuilder.group({
      name : [null,[Validators.required,Validators.pattern(GlobalConstants.nameRegex)]],
      categoryId:[null,Validators.required],
      price:[null,Validators.required],
      description:[null,Validators.required],
      
    });
    if(this.dialogData.action === 'Edit'){
      this.dialogAction = "Edit";
      this.action = "Update";
      this.productForm.patchValue(this.dialogData.data);
    }

    this.getCategorys();
  }

  getCategorys(){
    this.categoryService.getCategories().subscribe((response:any)=>{
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

    var formData = this.productForm.value;                           
    var data = {
      name:formData.name,
      categoryId:formData.categoryId,
      price:formData.price,
      description:formData.description
    }


    this.productService.add(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onAddProduct.emit();
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


    var formData = this.productForm.value;
    var data = {
      id:this.dialogData.data.id,
      name:formData.name,
      categoryId:formData.categoryId,
      price:formData.price,
      description:formData.description 
    }
    this.productService.update(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onEditProduct.emit();
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