import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { error } from 'console';
import { saveAs } from 'file-saver';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss']
})
export class ManageOrderComponent implements OnInit {

  displayedColumns:string[]= ['name','category','price','quantity','total','edit'];
  dataSource:any=[];
  manageOrderForm:any=FormGroup;
  categorys:any = [];
  products:any = [];
  price:any;
  totalAmount:number = 200;
  responseMessage:any;

  constructor(private productService:ProductService,
    private categoryService:CategoryService,
    private billService:BillService,
    private formbuilder:FormBuilder,
    private ngxService:NgxUiLoaderService,
    private snackBarservice:SnackbarService) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.getCategorys()
    this.manageOrderForm = this.formbuilder.group({
      name : [null,[Validators.required,Validators.pattern(GlobalConstants.nameRegex)]],
      email:[null,[Validators.required,Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber:[null,[Validators.required,Validators.pattern(GlobalConstants.ContactNumberRegex)]],
      paymentMethod:[null,Validators.required],
      quantity:[null,Validators.required],
      category:[null,Validators.required],
      product:[null,Validators.required],
      price:[null,Validators.required],
      total:[null,Validators.required],
      fileName:['xyzzzxy'],
      totalAmount:[this.totalAmount],
    })
  }


  getCategorys(){
    this.categoryService.getFilteredCategorys().subscribe((response:any)=>{
      this.ngxService.stop();
      this.categorys = response;
    },(error)=>{
      this.ngxService.stop();
      console.log(error);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }

      this.snackBarservice.openSnackBar(this.responseMessage,GlobalConstants.error);

    });

  }
  getProductsByCategory(values:any){
    this.productService.getProductByCategory(values.id).subscribe((response:any)=>{
      this.products = response;
      this.manageOrderForm.controls['price'].setValue('');
      this.manageOrderForm.controls['quantity'].setValue('');
      this.manageOrderForm.controls['total'].setValue(0);
    },(error)=>{
      console.log(error);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }

      this.snackBarservice.openSnackBar(this.responseMessage,GlobalConstants.error);

    });
  }

  getProductDetails(value:any){
    this.productService.getById(value.id).subscribe((reponse:any)=>{
      this.price = reponse.price;
      this.manageOrderForm.controls['price'].setValue(reponse.price);
      this.manageOrderForm.controls['quantity'].setValue('1');
      this.manageOrderForm.controls['total'].setValue(this.price * 1);

    },(error)=>{
      console.log(error);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }

      this.snackBarservice.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }

  setQuantity(value:any){
    var temp = this.manageOrderForm.controls['quantity'].value;
    if(temp>0){
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls['price'].value);

    }else if(temp != ''){
      this.manageOrderForm.controls['quantity'].setValue('1');
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls['price'].value);
    }
  }

  validateProductAdd(){
    if(this.manageOrderForm.controls['total'].value === 0 || this.manageOrderForm.controls['total'].value === null || this.manageOrderForm.controls['quantity'].value <= 0){
     return true;
    }else{
      return false;
    }
  }

  validateSubmit(){
    if(this.totalAmount === 0 || this.manageOrderForm.controls['name'].value === null || this.manageOrderForm.controls['email'].value === null || this.manageOrderForm.controls['contactNumber'].value === null || this.manageOrderForm.controls['paymentMethod'].value === null){
      return true;
    }else{
      return false;
    }
  }

  add(){
    var formData = this.manageOrderForm.value;
    var productName = this.dataSource.find((e:{ id: number})=> e.id === formData.product.id);
    if(productName === undefined){
      this.totalAmount = this.totalAmount + formData.total;
      this.dataSource.push({id:formData.product.id,name:formData.product.name,category:formData.category.name,quantity:formData.quantity,price:formData.price,total:formData.total});

      // [{\"id\":30,\"name\":\"Doppio Coffee\",\"category\":\"Coffee\",\"quantity\":\"1\",\"price\":120,\"total\":120}
      this.dataSource = [...this.dataSource];
      this.snackBarservice.openSnackBar(GlobalConstants.productAdded,"success");
    }else{
      this.snackBarservice.openSnackBar(GlobalConstants.productExistError,GlobalConstants.error);
    }
  }
  handleDeleteAction(value:any,element:any){
    this.totalAmount = this.totalAmount - element.total;
    this.dataSource.splice(value,1);
    this.dataSource = [...this.dataSource];
  }
  submitAction(){
    var formData = this.manageOrderForm.value;
    var data = {
      name:formData.name,
      email:formData.email,
      contactNumber:formData.contactNumber,
      paymentMethod:formData.paymentMethod,
      totalAmount:formData.totalAmount,
      productDetails:JSON.stringify(this.dataSource),
      fileName:formData.fileName
    }
    this.ngxService.start();
    this.billService.generateReport(data).subscribe((response:any)=>{
      console.log('response:',response);
      this.downloadFile(response?.uuid)
      this.manageOrderForm.reset();
      this.dataSource = [];
      this.totalAmount = 0;

    },(error)=>{
      this.ngxService.stop()
      console.log(error);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }

      this.snackBarservice.openSnackBar(this.responseMessage,GlobalConstants.error);
    });
  }

  downloadFile(fileName:string[]){
    var data = {
      uuid:fileName
    }
    this.billService.getPdf(data).subscribe((response:any)=>{
      saveAs(response,fileName +'.pdf');
      this.ngxService.stop();
    })
  }

}
