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
  selector: 'app-manage-service-subcategory',
  templateUrl: './manage-service-subcategory.component.html',
  styleUrls: ['./manage-service-subcategory.component.css']
})
export class ManageServiceSubcategoryComponent {

  dataLoading: boolean = false
  serviceSubcategoryList: any = []
  servicecategoryList: any = []
  serviceSubcategory: any = {}
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
  GenderList = this.loadDataService.GetEnumList(Gender);
  BloodGroupList = this.loadDataService.GetEnumList(BloodGroup);
  MaritalStatusList = this.loadDataService.GetEnumList(MaritalStatus);
  serviceSubcategoryTypeList = this.loadDataService.GetEnumList(DocType);
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
  }
  resetForm() {
    this.serviceSubcategory = {};
    this.serviceSubcategory.JoinDate = new Date();
    this.serviceSubcategory.Status = 1
    if (this.formserviceSubcategory) {
      this.formserviceSubcategory.control.markAsPristine();
      this.formserviceSubcategory.control.markAsUntouched();
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

  @ViewChild('formserviceSubcategory') formserviceSubcategory: NgForm;

  saveserviceSubcategory() {
    this.isSubmitted = true;
    this.formserviceSubcategory.control.markAllAsTouched();
    if (this.formserviceSubcategory.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }

    this.serviceSubcategory.JoinDate = this.loadDataService.loadDateTime(this.serviceSubcategory.JoinDate);
    this.serviceSubcategory.DateOfBirth = this.loadDataService.loadDateTime(this.serviceSubcategory.DateOfBirth);
    this.serviceSubcategory.UpdatedBy = this.StaffLogin.StaffLoginId;
    this.serviceSubcategory.CreatedBy = this.StaffLogin.StaffLoginId;
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.serviceSubcategory)).toString()
    }
    this.dataLoading = true;
    this.service.saveserviceSubcategory(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.serviceSubcategory.serviceSubcategoryId > 0) {
          this.toastr.success("Service Sub-category detail updated successfully")

        } else {
          this.toastr.success("Service Sub-category added successfully")
        }
        $('#staticBackdrop').modal('hide')
        this.dataLoading = false;
        this.resetForm();
        this.getserviceSubcategoryList();
      } else {
        this.toastr.error(response.Message)
        this.dataLoading = false;
        this.serviceSubcategory.JoinDate = new Date(this.serviceSubcategory.JoinDate);
        if (this.serviceSubcategory.DateOfBirth)
          this.serviceSubcategory.DateOfBirth = new Date(this.serviceSubcategory.DateOfBirth);
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


    deleteserviceSubcategory(obj: any) 
    {
      if (confirm("Are your sure you want to delete this recored")) {
        var request: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(obj)).toString()
      }
      this.dataLoading = true
      this.service.deleteserviceSubcategory(request).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getserviceSubcategoryList()
        } else {
          this.toastr.error(response.Message)
          this.dataLoading = false
        }
      }, (err => {
        this.toastr.error("Error occured while deleteing the recored")
        this.dataLoading = false
        }))
      }
    }


    editserviceSubcategory(obj: any) {
    this.resetForm()
    this.serviceSubcategory = obj;
  }


}
