import { Component, ViewChild, } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../utils/app.service';
import { ConstantData } from '../../utils/constant-data';
import { LoadDataService } from '../../utils/load-data.service';
import { LocalService } from '../../utils/local.service';
import { Gender, DocType, Status, BloodGroup, PaymentStatus,BillStatus } from '../../utils/enum';
import { ActionModel, RequestModel, StaffLoginModel } from '../../utils/interface';
import { Router } from '@angular/router';

declare var $: any
// import {
//   Gender,
//   DocType,
//   Status,
//   BloodGroup,
//   PaymentMode,
//   PaymentType,
//   OpdType,
//   // MaritalStatus,
// } from '../../utils/enum';

@Component({
  selector: 'app-manage-opd-list',
  templateUrl: './manage-opd-list.component.html',
  styleUrls: ['./manage-opd-list.component.css']
})
export class ManageOpdListComponent {
  OpdPatient: any = {};
  OpdList: any = [];
  OpdPaymentList: any = {};
  isSubmitted = false;
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  dataLoading: boolean = false;
  action: ActionModel = {} as ActionModel;
  StaffLogin: StaffLoginModel = {} as StaffLoginModel;
  // PaymentModeList = this.loadDataService.GetEnumList(PaymentMode);
  // PaymentTypeList = this.loadDataService.GetEnumList(PaymentType);
  // OpdTypeList = this.loadDataService.GetEnumList(OpdType);
  // BloodGroupList = this.loadDataService.GetEnumList(BloodGroup);
  userDetail: any = {};

    sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
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
    console.log("checking");
    this.getOpdList();
    // this.getPatientList();
  }
  resetForm() {
    this.OpdPatient = {};
    this.OpdPatient.Status = 1
    this.isSubmitted = false
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
        this.action.ResponseReceived = true;
      },
      (err) => {
        this.toastr.error('Error while validating menu');
        this.dataLoading = false;
      }
    );
  }

  getOpdList(){
    // if (this.filterModel.StartFrom) {
    //   this.filterModel.StartFrom = this.loadData.loadDateYMD(
    //     this.filterModel.StartFrom
    //   );
    // }
    // if (this.filterModel.EndFrom) {
    //   this.filterModel.EndFrom = this.loadData.loadDateYMD(
    //     this.filterModel.EndFrom
    //   );
    // }

    // if (this.staffLogin.RoleId != 5) {
    //   this.filterModel.HotelId = this.staffLogin.HotelId;
    // }

    const obj: RequestModel = {
      request: this.localService
        .encrypt(JSON.stringify({ }))
        .toString(),
    };
    this.dataLoading = true;
    this.service.getOpdList(obj).subscribe(
      (r1) => {
        let response = r1 as any;
        if (response.Message === ConstantData.SuccessMessage) {
          this.OpdList = response.OpdList;
          this.OpdPaymentList.TotalTaxableAmount = response.TotalTaxableAmount;
          this.OpdPaymentList.TotalGSTAmount = response.TotalGSTAmount;
          this.OpdPaymentList.TotalDiscountAmount = response.TotalDiscountAmount;
          this.OpdPaymentList.TotalAmount = response.TotalAmount;
          this.OpdPaymentList.TotalPaidAmount = response.TotalPaidAmount;
          this.OpdPaymentList.TotalDuesAmount = response.TotalDuesAmount;
        } else {
          this.toastr.error(response.Message);
        }
        console.log( this.OpdList);
        this.dataLoading = false;
      },
      (err) => {
        this.toastr.error('Error while fetching records');
        this.dataLoading = false;
      }
    );
  
  }
  PaymentStatusEnum = PaymentStatus;
  BillStatusEnum = BillStatus;

@ViewChild('OpdCancelForm') OpdCancelForm!: NgForm;

openCancelModal(item: any) {
  this.OpdPatient = {
    OpdId: item.OpdId,
    PatientName: item.PatientName,   // ✅ shows here
    OpdCancelDate :new Date(),
    BillStatus: 2   // Cancelled
  };
}

SaveCancelationOpd() {

  if (!this.OpdPatient.OpdId) {
    this.toastr.error('Invalid OPD selected');
    return;
  }

  if (!this.OpdPatient.CancelReason) {
    this.toastr.warning('Please enter cancellation reason');
    return;
  }

  if (!this.OpdPatient.OpdCancelDate) {
    this.toastr.warning('Please select cancellation date');
    return;
  }
   this.OpdCancelForm.control.markAllAsTouched();

  // Auto force cancelled
  this.OpdPatient.BillStatus = 2;

  const data = {
    OpdId: this.OpdPatient.OpdId,
    CancelReason: this.OpdPatient.CancelReason,
    OpdCancelDate: this.loadDataService.loadDateTime(
      this.OpdPatient.OpdCancelDate
    ),
    BillStatus: this.OpdPatient.BillStatus,
    UpdatedBy: this.StaffLogin.StaffLoginId
  };

  console.log('Cancel OPD payload:', data);

  const obj: RequestModel = {
    request: this.localService.encrypt(JSON.stringify(data)).toString()
  };

  this.dataLoading = true;

  this.service.cancelOpd(obj).subscribe(
    (res: any) => {
      if (res.Message === ConstantData.SuccessMessage) {
        this.toastr.success('OPD cancelled successfully');
        // this.resetForm();
        this.getOpdList(); // reload list
      } else {
        this.toastr.error(res.Message);
      }
      this.dataLoading = false;
    },
    (err) => {
      console.error(err);
      this.toastr.error('Error while cancelling OPD');
      this.dataLoading = false;
    }
  );
}


}
