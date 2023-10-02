import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { error } from 'console';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { UserComponent } from '../dialog/user/user.component';
import { Router } from '@angular/router';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent implements OnInit {
  dispalyedColumns:string[]= ['name','email','contactNumber','status'];
  dataSource:any;
  responseMessage:any;
  name:string | undefined;
  email:any;
  contactNumber:any;
  isSelected:any;
  firstName:string='';
 
  constructor(private userService:UserService,
    private ngxService:NgxUiLoaderService,
    private snackBarservice:SnackbarService,
    private router:Router,
    private dialog:MatDialog) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  
    
  

  }

  searchCooptCriteriaBuilderFirstName(firstName:any) {

    this.userService.searchByName(firstName).subscribe((response) => {
      // this.dataSource = response;
      this.dataSource = response.content;
      console.log(this.dataSource);
      console.log(response);
    });

  }


  // searchCooptCriteriaBuilderFirstName2(firstName) {

  //   this.cooptationService.searchByName(firstName).subscribe((response) => {

  //     this.cooptations = cooptations._embedded.cooptationDtoList.filter(element => !element.isArchived);
  //     console.log(cooptations);

  //   });

  // }

  searchByNameCriteria(){
    this.userService.searchByName(this.name).subscribe((response:any)=>{
      this.name=response;
    });
  }

  searchByemailCriteria(){
    this.userService.searchByName(this.email).subscribe((response:any)=>{
      this.name=response;
    });
  }

  searchBycontactNumber(){
 
    this.userService.searchByName(this.contactNumber).subscribe((response:any)=>{
      this.name=response;
    });
  }


  tableData(){
    this.userService.getUsers().subscribe((response:any)=>{
      this.ngxService.stop();
      this.dataSource = new MatTableDataSource(response);
    },(error)=>{
      console.log(error);
      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackBarservice.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }
  applyFilter(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleDeleteAction(values:any){

    const dialogConfig=new MatDialogConfig();
    dialogConfig.data = {
     message : 'delete' +values.name+ 'user',
     confirmation:true
    };
    const dialogRef = this.dialog.open(ConfirmationComponent,dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response)=>{
      this.ngxService.start();
      this.deleteProduct(values.id);
      dialogRef.close();
    });
    
  }

  deleteProduct(id:any){
    this.userService.delete(id).subscribe((response:any)=>{
      this.ngxService.stop();
      this.tableData();
      this.responseMessage=response?.message;
      this.snackBarservice.openSnackBar(this.responseMessage,"success");
    },(error)=>{
      this.ngxService.stop();
      console.log(error.error?.message);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackBarservice.openSnackBar(this.responseMessage,GlobalConstants.error);
    })

  }

  onChange(status:any,id:any){
    this.ngxService.start();
    var data = {
      status: status.toString(),
      id:id
    }
    this.userService.update(data).subscribe((response:any)=>{
      this.ngxService.stop();
      this.responseMessage = response?.message;
      this.snackBarservice.openSnackBar(this.responseMessage,"success");
    },(error:any)=>{
      console.log(error);
      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackBarservice.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }

  handleAddAction(){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.data = {
      action : 'Add'
    };
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(UserComponent,dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddUser.subscribe((response)=>{
      this.tableData();
    });

  }

  handleEditAction(values:any){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.data = {
      action : 'Edit',
      data:values
    };
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(UserComponent,dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEditUser.subscribe((response)=>{
      this.tableData();
    });
  }

}
