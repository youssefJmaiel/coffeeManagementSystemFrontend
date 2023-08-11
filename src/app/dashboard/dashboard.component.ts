import { Component, AfterViewInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';
import { error } from 'console';
import { GlobalConstants } from '../shared/global-constants';
import { CategoryService } from '../services/category.service';
@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {

	responseMessage:any;
	data:any;
	bill:any;
	category:any;
	product:any;

	ngAfterViewInit() { }

	constructor(private dashboardService:DashboardService,
		private ngxService : NgxUiLoaderService,
		private snackbarService : SnackbarService,
		private categoryService : CategoryService
		) {
			this.ngxService.start();
			this.dashboardData();

			this.categoryService.getCategories().subscribe((response:any)=>{
				this.category=response;
				console.log(response);
			})

			this.categoryService.getProduct().subscribe((response:any)=>{
				this.product=response;
				console.log(response);
			})

			this.categoryService.getBills().subscribe((response:any)=>{
				this.bill=response;
				console.log(response);
			})
	}

	dashboardData(){
		this.dashboardService.getDetails().subscribe((response:any)=>{
			this.ngxService.stop();
			this.data = response;
			console.log("data:",this.data);
		},(error:any)=>{
			this.ngxService.stop();
			console.log(error);
			if(error.error?.message){
				this.responseMessage = error.error?.message;
			  }else {
				this.responseMessage = GlobalConstants.genericError;
			  }
			  this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);

		})

	}

}
