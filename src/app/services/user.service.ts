import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
  
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json','Accept': 'application/json', })
};
@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = environment.apiUrl;
 // url2='localhost:8080/user/signup'
 
  constructor(  private httpClient:HttpClient) { }



  signup(data:any):Observable<any>{
    return this.httpClient.post(this.url+'/user/signup',data,httpOptions);
  }

  // register(name: string, email: string, password: string,contactNumber:string): Observable<any> {
  //   return this.httpClient.post(this.url + '/user/signup', {
  //     name,
  //     email,
  //     password,
  //     contactNumber,
  //   }, httpOptions);
  // }

  forgotPassword(data:any):Observable<any>{
    return this.httpClient.post(this.url+'/user/forgotPassword',data,httpOptions);
  }

  login(data:any):Observable<any>{
    return this.httpClient.post(this.url+'/user/login',data,httpOptions);
  }

  checkToken(){
  return this.httpClient.get(this.url+"/user/checkToken");
  }

  changePassword(data:any):Observable<any>{
    return this.httpClient.post(this.url+'/user/changePassword',data,httpOptions);
  }


  getUsers(){
    return this.httpClient.get(this.url+"/user/get");
    }

  update(data:any){
    return this.httpClient.post(this.url+'/user/update',data,httpOptions);
  }

  add(data:any){
    return this.httpClient.post(this.url+'/user/addUser',data,httpOptions);
  }

  delete(id:number){
    return this.httpClient.post(this.url + `/user/deleteUser/${id}`,httpOptions);
  }


}


