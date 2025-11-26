import { Component, ViewChild, } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../utils/app.service';
import { ConstantData } from '../../utils/constant-data';
import { LoadDataService } from '../../utils/load-data.service';
import { LocalService } from '../../utils/local.service';
import { Gender, DocType, Status, BloodGroup, MaritalStatus } from '../../utils/enum';
import { ActionModel, RequestModel, StaffLoginModel } from '../../utils/interface';
import { Router } from '@angular/router';

declare var $: any
@Component({
  selector: 'app-service-charge',
  templateUrl: './service-charge.component.html',
  styleUrls: ['./service-charge.component.css']
})
export class ServiceChargeComponent {

  dataLoading: boolean = false
  ServiceChargeList: any = []
  ServiceCharge: any = {}
  isSubmitted = false
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  action: ActionModel = {} as ActionModel;
  StaffLogin: StaffLoginModel = {} as StaffLoginModel;
  StatusList = this.loadDataService.GetEnumList(Status);
  AllStatusList = Status;
  AllGenderList = Gender;
  AllMaritalStatusList = MaritalStatus;
  AllBloodGroupList = BloodGroup;
  AllServiceChargeTypeList = DocType;

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  onTableDataChange(p: any) {
    this.p = p
  }


      constructor(
    private service: AppService,
    private toastr: ToastrService,
    private loadDataService: LoadDataService,
    private localService: LocalService,
    private router: Router
  ) { }

    resetForm() {
    this.ServiceCharge = {};
    this.ServiceCharge.CreatedOn = new Date();
    this.ServiceCharge.Status = 1
    if (this.ServiceCharge) {
      this.ServiceCharge.control.markAsPristine();
      this.ServiceCharge.control.markAsUntouched();
    }
    this.isSubmitted = false
  }
  validiateMenu() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Url: this.router.url,StaffLoginId:this.StaffLogin.StaffLoginId })).toString()
    }
    this.dataLoading = true
    this.service.validiateMenu(obj).subscribe((response: any) => {
      this.action = this.loadDataService.validiateMenu(response, this.toastr, this.router)
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }
}
