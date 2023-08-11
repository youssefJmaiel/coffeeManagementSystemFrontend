import { Component, EventEmitter, Inject, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  onEmitStatusChange = new EventEmitter();
  details:any={};

  constructor(@Inject(MAT_DIALOG_DATA) public dialoData:any) { }

  ngOnInit(): void {
    if(this.dialoData && this.dialoData.confirmation){
      this.details = this.dialoData;
    }
  }

  handleChangeAction(){
    this.onEmitStatusChange.emit();
  }

}
