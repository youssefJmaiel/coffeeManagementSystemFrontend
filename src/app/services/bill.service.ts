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
export class BillService {
  url = environment.apiUrl;
  constructor(private httpClient:HttpClient) { }

  generateReport(data:any){
    return this.httpClient.post(this.url+'/bill/generateReport',data,httpOptions);
  }

  getPdf(data:any):Observable<Blob>{
    return this.httpClient.post(this.url+'/bill/getPdf',data,{
      responseType:'blob'
    });
  }
  getBills(){
    return this.httpClient.get(this.url+'/bill/getBills',httpOptions); 
  }

  delete(id:any){
    return this.httpClient.post(this.url + `/bill/deleteBill/${id}`,httpOptions);
  }


}
