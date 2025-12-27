import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../utils/app.service';
import { ConstantData } from '../../utils/constant-data';
import { LoadDataService } from '../../utils/load-data.service';
import { LocalService } from '../../utils/local.service';
import {Status} from '../../utils/enum';
import {
  ActionModel,
  RequestModel,
  StaffLoginModel,
} from '../../utils/interface';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-manage-servicecharge',
  templateUrl: './manage-servicecharge.component.html',
  styleUrls: ['./manage-servicecharge.component.css'],
})
export class ManageServicechargeComponent {
  dataLoading: boolean = false;
  serviceChargeList: any = [];
  servicecategoryList: any[] = [];
  serviceSubcategoryList: any[] = [];
  servicecharge: any = {};
  isSubmitted = false;
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
    this.p = p;
  }
  @ViewChild('formservicecharge') formservicecharge: NgForm;

  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private loadDataService: LoadDataService,
    private localService: LocalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.StaffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getservicecategoryList();
    this.getserviceSubcategoryList();
    this.getServiceChargeList();
  }
  resetForm() {
    this.servicecharge = {};
    this.servicecharge.JoinDate = new Date();
    this.servicecharge.Status = 1;
    if (this.formservicecharge) {
      this.formservicecharge.control.markAsPristine();
      this.formservicecharge.control.markAsUntouched();
    }
    this.isSubmitted = false;
  }
  validiateMenu() {
    var obj: RequestModel = {
      request: this.localService
        .encrypt(
          JSON.stringify({
            Url: this.router.url,
            StaffLoginId: this.StaffLogin.StaffLoginId,
          })
        )
        .toString(),
    };
    this.dataLoading = true;
    this.service.validiateMenu(obj).subscribe(
      (response: any) => {
        this.action = this.loadDataService.validiateMenu(
          response,
          this.toastr,
          this.router
        );
        this.dataLoading = false;
      },
      (err) => {
        this.toastr.error('Error while fetching records');
        this.dataLoading = false;
      }
    );
  }

  AllserviceSubcategoryList: any[] = [];

  getservicecategoryList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString(),
    };
    this.dataLoading = true;
    this.service.getservicecategoryList(obj).subscribe(
      (r1) => {
        let response = r1 as any;

        if (response.Message == ConstantData.SuccessMessage) {
          this.servicecategoryList = response.serviceCategoryList || [];
        } else {
          this.toastr.error(response.Message);
        }
        this.dataLoading = false;
      },
      (err) => {
        this.toastr.error('Error while fetching records');
        this.dataLoading = false;
      }
    );
  }
  getserviceSubcategoryList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString(),
    };
    this.dataLoading = true;
    this.service.getserviceSubcategoryList(obj).subscribe(
      (r1) => {
        let response = r1 as any;
        if (response.Message == ConstantData.SuccessMessage) {
          this.AllserviceSubcategoryList = response.serviceSubcategoryList;
          console.log(this.AllserviceSubcategoryList);
        } else {
          this.toastr.error(response.Message);
        }
        this.dataLoading = false;
      },
      (err) => {
        this.toastr.error('Error while fetching records');
        this.dataLoading = false;
      }
    );
  }

  changeCategory() {
    const selectedId = Number(this.servicecharge.ServiceCategoryId);
    this.serviceSubcategoryList = this.AllserviceSubcategoryList.filter(
      (x) => Number(x.ServiceCategoryId) === selectedId
    );
    this.servicecharge.ServiceSubCategoryId = null;
  }

  saveservicecharge() {
    this.isSubmitted = true;
    this.formservicecharge.control.markAllAsTouched();
    if (this.formservicecharge.invalid) {
      this.toastr.error('Fill all the required fields !!');
      return;
    }

    this.servicecharge.UpdatedBy = this.StaffLogin.StaffLoginId;
    this.servicecharge.CreatedBy = this.StaffLogin.StaffLoginId;
    var obj: RequestModel = {
      request: this.localService
        .encrypt(JSON.stringify(this.servicecharge))
        .toString(),
    };
    this.dataLoading = true;
    this.service.saveservicecharge(obj).subscribe(
      (r1) => {
        let response = r1 as any;
        if (response.Message == ConstantData.SuccessMessage) {
          if (this.servicecharge.servicechargeId > 0) {
            this.toastr.success(
              'Service Sub-category detail updated successfully'
            );
          } else {
            this.toastr.success('Service Sub-category added successfully');
          }
          $('#staticBackdrop').modal('hide');
          this.dataLoading = false;
          this.resetForm();
          this.getServiceChargeList();
        } else {
          this.toastr.error(response.Message);
          this.dataLoading = false;
          this.servicecharge.JoinDate = new Date(this.servicecharge.JoinDate);
          if (this.servicecharge.DateOfBirth)
            this.servicecharge.DateOfBirth = new Date(
              this.servicecharge.DateOfBirth
            );
        }
      },
      (err) => {
        this.toastr.error('Error occured while submitting data');
        this.dataLoading = false;
      }
    );
  }
 
    getServiceChargeList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ })).toString()
    }
    this.dataLoading = true
    this.service.getServiceChargeList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.serviceChargeList = response.serviceChargeList || [];
          console.log('vvv', this.serviceChargeList);

      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  deleteservicecharge(obj: any) {
    if (confirm('Are your sure you want to delete this recored')) {
      var request: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(obj)).toString(),
      };
      this.dataLoading = true;
      this.service.getServiceChargeList(request).subscribe(
        (r1) => {
          let response = r1 as any;
          if (response.Message == ConstantData.SuccessMessage) {
            this.toastr.success('Record Deleted successfully');
            this.getServiceChargeList();
          } else {
            this.toastr.error(response.Message);
            this.dataLoading = false;
          }
        },
        (err) => {
          this.toastr.error('Error occured while deleteing the recored');
          this.dataLoading = false;
        }
      );
    }
  }

  editservicecharge(obj: any) {
    this.resetForm();
    this.servicecharge = obj;
  }














  
}


