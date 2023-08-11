import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json','Accept': 'application/json', })
};
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  url = environment.apiUrl;
  constructor(private httpClient:HttpClient) { }

  add(data:any){
    return this.httpClient.post(this.url+'/product/addProduct',data,httpOptions);
  }

  update(data:any){
    return this.httpClient.post(this.url+'/product/updateProduct',data,httpOptions);
  }

  getProducts(){
    return this.httpClient.get(this.url+'/product/getAllProducts'); 
  }

  updateStatus(data:any){
    return this.httpClient.post(this.url+'/product/updateStatus',data,httpOptions);
  }

  delete(id:number){
    return this.httpClient.post(this.url + `/product/deleteProduct/${id}`,httpOptions);
  }

  getProductByCategory(id:number){
    return this.httpClient.get(this.url + `/product/getByCategory/${id}`,httpOptions);
  }

  getById(id:number){
    return this.httpClient.get(this.url + `/product/getProductById/${id}`,httpOptions);
  }


}
