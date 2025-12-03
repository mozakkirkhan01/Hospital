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

declare var $: any;

@Component({
  selector: 'app-manage-servicecharge',
  templateUrl: './manage-servicecharge.component.html',
  styleUrls: ['./manage-servicecharge.component.css']
})
export class ManageServicechargeComponent {

  dataLoading: boolean = false
  servicechargeList: any = []
  servicecategoryList: any = []
  serviceSubcategoryList: any = []
  // servicechargeList: any = []
  servicecharge: any = {}
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

  ngOnInit(): void {
    this.StaffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getservicecategoryList();
    this.getserviceSubcategoryList();   
    // this.getservicechargeList();
  }
  resetForm() {
    this.servicecharge = {};
    this.servicecharge.JoinDate = new Date();
    this.servicecharge.Status = 1
    if (this.formservicecharge) {
      this.formservicecharge.control.markAsPristine();
      this.formservicecharge.control.markAsUntouched();
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

  changeCategory() {
this.servicecategoryList = this.serviceSubcategoryList.filter((x: any) => 
  x.ServiceChargeId == this.servicecharge.ServiceChargeId
);

}
  @ViewChild('formservicecharge') formservicecharge: NgForm;
    saveservicecharge() {
      this.isSubmitted = true;
      this.formservicecharge.control.markAllAsTouched();
      if (this.formservicecharge.invalid) {
        this.toastr.error("Fill all the required fields !!")
        return
      }
  
      this.servicecharge.JoinDate = this.loadDataService.loadDateTime(this.servicecharge.JoinDate);
      this.servicecharge.DateOfBirth = this.loadDataService.loadDateTime(this.servicecharge.DateOfBirth);
      this.servicecharge.UpdatedBy = this.StaffLogin.StaffLoginId;
      this.servicecharge.CreatedBy = this.StaffLogin.StaffLoginId;
      var obj: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(this.servicecharge)).toString()
      }
      this.dataLoading = true;
      this.service.saveservicecharge(obj).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          if (this.servicecharge.servicechargeId > 0) {
            this.toastr.success("Service Sub-category detail updated successfully")
  
          } else {
            this.toastr.success("Service Sub-category added successfully")
          }
          $('#staticBackdrop').modal('hide')
          this.dataLoading = false;
          this.resetForm();
          // this.getservicechargeList();
        } else {
          this.toastr.error(response.Message)
          this.dataLoading = false;
          this.servicecharge.JoinDate = new Date(this.servicecharge.JoinDate);
          if (this.servicecharge.DateOfBirth)
            this.servicecharge.DateOfBirth = new Date(this.servicecharge.DateOfBirth);
        }
      }, (err => {
        this.toastr.error("Error occured while submitting data")
        this.dataLoading = false;
      }))
    }


    getservicecategoryList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ })).toString()
    }
    this.dataLoading = true
    this.service.getservicecategoryList(obj).subscribe(r1 => {
      let response = r1 as any
      
      if (response.Message == ConstantData.SuccessMessage) {
        
       this.servicecategoryList = response.serviceCategoryList || [];
        console.log(this.servicecategoryList);
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

    getserviceSubcategoryList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ })).toString()
    }
    this.dataLoading = true
    this.service.getserviceSubcategoryList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.serviceSubcategoryList = response.serviceSubcategoryList || [];
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }


}
