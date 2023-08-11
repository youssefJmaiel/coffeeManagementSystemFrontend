import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json','Accept': 'application/json', })
};
@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  url = environment.apiUrl;


  constructor(private httpClient:HttpClient) { }


  add(data:any){
    return this.httpClient.post(this.url+'/category/add',data,httpOptions);
  }

  update(data:any){
    return this.httpClient.post(this.url+'/category/updateCategory',data,httpOptions);
  }

  getCategories(){
    return this.httpClient.get(this.url+'/category/getAllCategory');
  }


  getProduct(){
    return this.httpClient.get(this.url+'/product/getAllProducts'); 
  }

  getBills(){
    return this.httpClient.get(this.url+'/bill/getBills'); 
  }

  getFilteredCategorys(){
  return this.httpClient.get(this.url+"/category/getAllCategory?filterValue=true");
  }

}
