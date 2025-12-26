import { Component, ViewChild, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../utils/app.service';
import { ConstantData } from '../../utils/constant-data';
import { LoadDataService } from '../../utils/load-data.service';
import { LocalService } from '../../utils/local.service';
import { Router, ActivatedRoute } from '@angular/router';
import {
  ActionModel,
  RequestModel,
  StaffLoginModel,
} from '../../utils/interface';
import {
  Gender,
  DocType,
  Status,
  BloodGroup,
  PaymentMode,
  PaymentType,
  OpdType,
  // MaritalStatus,
} from '../../utils/enum';
import { request } from 'bwip-js';

@Component({
  selector: 'app-manage-opd',
  templateUrl: './manage-opd.component.html',
  styleUrls: ['./manage-opd.component.css'],
})
export class ManageOpdComponent implements OnInit {
  OpdPatient: any = {};
  ServiceDetail: any = {};
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
  PaymentModeList = this.loadDataService.GetEnumList(PaymentMode);
  PaymentTypeList = this.loadDataService.GetEnumList(PaymentType);
  OpdTypeList = this.loadDataService.GetEnumList(OpdType);
  BloodGroupList = this.loadDataService.GetEnumList(BloodGroup);
  userDetail: any = {};


  // GenderList = this.loadDataService.GetEnumList(Gender);
  // BloodGroupList = this.loadDataService.GetEnumList(BloodGroup);
  // MaritalStatusList = this.loadDataService.GetEnumList(MaritalStatus);
  // OpdTypeList = this.loadDataService.GetEnumList(DocType);
  // AllStatusList = Status;
  // AllGenderList = Gender;
  // AllMaritalStatusList = MaritalStatus;
  // AllBloodGroupList = BloodGroup;
  // AllOpdTypeList = DocType;

  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private loadDataService: LoadDataService,
    private localService: LocalService,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  redUrl: string = '';

  ngOnInit(): void {
    this.StaffLogin = this.localService.getEmployeeDetail();
    this.resetForm();
    this.route.queryParams.subscribe((params: any) => {
      this.OpdPatient.OpdId = params.id;
      this.redUrl = params.redUrl;

      // validate menu with clead URl ( wihtout query params)
      this.validiateMenu();

      if(this.OpdPatient.OpdId > 0){
        this.loadOpdDetailForEdit(this.OpdPatient.OpdId);
        return;
      }
    })
    this.validiateMenu();
    this.getPatientList();
    this.changeCategory();
    this.getservicecategoryList();
    this.getserviceSubcategoryList();
    this.ServiceDetail.Quantity = 1;
    this.ServiceDetail.Discount = 0;
    this.getServiceChargeList();
    this.OpdPatient.OpdDate = this.loadDataService.loadDateYMD(new Date());
    this.OpdPatient.OpdType = 1;  // or whatever key corresponds to "New"
  }
  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }
  // validiateMenu() {
  //   var obj: RequestModel = {
  //     request: this.localService
  //       .encrypt(
  //         JSON.stringify({
  //           Url: this.router.url,
  //           StaffLoginId: this.StaffLogin.StaffLoginId,
  //         })
  //       )
  //       .toString(),
  //   };

  //   this.dataLoading = true;

  //   this.service.validiateMenu(obj).subscribe(
  //     (response: any) => {
  //       this.action = this.loadDataService.validiateMenu(
  //         response,
  //         this.toastr,
  //         this.router
  //       );
  //       this.dataLoading = false;
  //       this.action.ResponseReceived = true;
  //     },
  //     (err) => {
  //       this.toastr.error('Error while validating menu');
  //       this.dataLoading = false;
  //     }
  //   );
  // }
validiateMenu() {
  const cleanUrl = this.router.url.split('?')[0]; // ✅ VERY IMPORTANT

  const obj: RequestModel = {
    request: this.localService.encrypt(
      JSON.stringify({
        Url: cleanUrl,
        StaffLoginId: this.StaffLogin.StaffLoginId,
      })
    ).toString(),
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
    () => {
      this.toastr.error('Error while validating menu');
      this.dataLoading = false;
    }
  );
}

  @ViewChild('formOpdPatient') formOpdPatient: NgForm;
  @ViewChild('formService') formService: NgForm;

// for editing the data of opd details
  // loadOpdDetailForEdit(patientId: number){
  //   const obj: RequestModel = {
  //   request: this.localService.encrypt(JSON.stringify(patientId)).toString(),
  // };
  //   this.dataLoading = true;
  //   this.service.getOpdDetailById(obj).subscribe(response: any) => {
  //     if ( response.Message === 'Success') {
  //       const patient = response.getOpdDetailById;
  //     };
  //     this.OpdPatient = response.PatientName;
  //     //Patient details
  //     this.OpdPatient.OpdDate = this.loadDataService.loadDateYMD(patient.OpdDate);
  //     this.OpdPatient.OpdId = patient.OpdId;
  //     this.OpdPatient.UHIDNO = patient.UHIDNO;
  //     this.OpdPatient.PatientName = patient.PatientName;
  //     this.OpdPatient.Age = patient.Age;
  //     this.OpdPatient.MobileNo = patient.MobileNo;
  //     this.OpdPatient.Address = patient.Address;
  //     this.OpdPatient.AadharNo = patient.AadharNo;
  //     this.OpdPatient.BloodGroup = patient.BloodGroup;
  //     this.OpdPatient.OpdType = patient.OpdType;

  //     //Service Details
  //     this.getservicecategoryList();
  //     this.getserviceSubcategoryList();
  //     this.getServiceChargeList();
  //   }

  // }
loadOpdDetailForEdit(opdId: number) {

  const obj: RequestModel = {
    request: this.localService.encrypt(JSON.stringify(opdId)).toString()
  };

  this.dataLoading = true;

  this.service.getOpdDetailById(obj).subscribe((res: any) => {

    if (res.Message !== ConstantData.SuccessMessage) {
      this.toastr.error(res.Message);
      this.dataLoading = false;
      return;
    }

    const opd = res.Opd;
    console.log(opd);
    

    /* ================= OPD + PATIENT ================= */
    this.OpdPatient = {
      OpdId: opd.OpdId,
      PatientId: opd.PatientId,
      PatientName: opd.PatientName,
      UHIDNo: opd.UHIDNo,
      MobileNo: opd.MobileNo,
      Age: opd.Age,
      Address: opd.Address,
      BloodGroup: opd.BloodGroup,
      OpdType: opd.OpdType,
      OpdDate: this.loadDataService.loadDateYMD(opd.OpdDate),
      LineTotal: opd.LineTotal,
      TotalDiscount: opd.TotalDiscount,
      GrandTotal: opd.GrandTotal,
      TotalPaidAmount: opd.TotalPaidAmount,
      TotalDuesAmount: opd.TotalDuesAmount,
      PaymentStatus: opd.PaymentStatus,
      BillStatus: opd.BillStatus,
      Remarks: opd.Remarks
    };

    /* ================= SERVICES ================= */
    this.ServiceDetailList = res.Services.map((s: any) => ({
      OpdDetailId: s.OpdDetailId,
      ServiceCategoryId: s.ServiceCategoryId,
      ServiceCategoryName: s.ServiceCategoryName,
      ServiceSubCategoryId: s.ServiceSubCategoryId,
      ServiceSubCategoryName: s.ServiceSubCategoryName,
      ServiceChargeAmount: s.ServiceChargeAmount,
      Quantity: s.Quantity,
      Discount: s.Discount,
      Total: s.Total
    }));

    /* ================= PAYMENTS ================= */
    this.PaymentDetailList = res.Payments.map((p: any) => ({
      PaymentId: p.PaymentId,
      Amount: p.Amount,
      PaymentMode: p.PaymentMode,
      PaymentType: p.PaymentType,
      PaymentDate: new Date(p.PaymentDate)
    }));

    /* ================= CALCULATE TOTALS ================= */
    this.calculateTotals();

    this.dataLoading = false;
  },
  err => {
    console.error(err);
    this.toastr.error('Error loading OPD');
    this.dataLoading = false;
  });
}


  resetOpdPatientForm() {
    this.OpdPatient = {};
    this.OpdPatient.JoinDate = new Date();
    this.OpdPatient.Status = 1;
    if (this.formOpdPatient) {
      this.formOpdPatient.control.markAsPristine();
      this.formOpdPatient.control.markAsUntouched();
    }
    this.isSubmitted = false;
  }
  AllPatientList: any[] = [];
  PatientList: any[] = [];

  getPatientList() {  
    var obj: RequestModel = {
      request: this.localService
        .encrypt(JSON.stringify({ Status: Status.Active }))
        .toString(),
    };
    this.dataLoading = true;
    this.service.getPatientList(obj).subscribe(
      (r1) => {
        let response = r1 as any;
        if (response.Message == ConstantData.SuccessMessage) {
          this.AllPatientList = response.PatientList;
          this.AllPatientList.map(
            (x1) =>
              (x1.SearchPatient = `${x1.PatientName} - ${x1.UHIDNo} - ${x1.MobileNo}`)
          );
          this.PatientList = this.AllPatientList;
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

  filterPatientList(value: any) {
    if (value) {
      const filterValue = value.toLowerCase();
      this.PatientList = this.AllPatientList.filter((option: any) =>
        option.SearchPatient.toLowerCase().includes(filterValue)
      );
    } else {
      this.PatientList = this.AllPatientList;
    }
    this.OpdPatient.PatientId = 0;
  }
  // clearPatient() {
  //   this.PatientList = this.AllPatientList;
  //   this.OpdPatient.PatientId = null;
  //   this.OpdPatient = {};
  // }
  clearPatient() {
    this.OpdPatient.PatientName = '';
    this.OpdPatient.PatientId = null;

    // Restore full list
    this.PatientList = this.AllPatientList.slice();
  }

  afterPatientSelected(event: any) {
    this.OpdPatient.PatientId = event.option.id;
    //this.CakeBooking.CustomerName = event.option.value;
    var Patient = this.PatientList.find(
      (x: any) => x.PatientId == this.OpdPatient.PatientId
    );
    this.OpdPatient.UHIDNo = Patient.UHIDNo;
    this.OpdPatient.MobileNo = Patient.MobileNo;
    this.OpdPatient.PatientNameauto = Patient.PatientName;
    this.OpdPatient.Age = Patient.Age;
    this.OpdPatient.Address = Patient.Address;
    this.OpdPatient.AadharNo = Patient.AadharNo;
    this.OpdPatient.BloodGroup = Patient.BloodGroup;
    console.log(this.OpdPatient.BloodGroup);
  }

  // service category selection
  afterServiceCategorySelected(event: any) { }
  clearServie() {
    this.PatientList = this.AllPatientList;
    this.OpdPatient.PatientId = null;
    this.OpdPatient = {};
  }

  filterServiceList(value: any) {
    if (value) {
      const filterValue = value.toLowerCase();
      this.PatientList = this.AllPatientList.filter((option: any) =>
        option.SearchPatient.toLowerCase().includes(filterValue)
      );
    } else {
      this.PatientList = this.AllPatientList;
    }
    this.OpdPatient.PatientId = 0;
  }

  serviceSubcategoryList: any[] = [];
  AllserviceSubcategoryList: any[] = [];
  servicecategoryList: any[] = [];

  changeCategory() {
    const selectedId = Number(this.ServiceDetail.ServiceCategoryId);
    this.serviceSubcategoryList = this.AllserviceSubcategoryList.filter(
      (x) => Number(x.ServiceCategoryId) === selectedId
    );
    this.ServiceDetail.ServiceSubCategoryId = null;
  }

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
  ServiceChargeList: any[] = [];
  getServiceChargeList() {
    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString(),
    };

    this.dataLoading = true;
    this.service.getServiceChargeList(obj).subscribe(
      (r1) => {
        const response = r1 as any;

        if (response.Message == ConstantData.SuccessMessage) {
          this.ServiceChargeList = response.serviceChargeList || [];
        } else {
          this.toastr.error(response.Message);
        }

        this.dataLoading = false;
      },
      (err) => {
        this.toastr.error('Error while fetching ServiceCharge records');
        this.dataLoading = false;
      }
    );
  }
  onServiceSubCategoryChange(selectedSubCategoryId: any) {
    const selectedCategory = this.servicecategoryList.find(
      (x) => x.ServiceCategoryId === this.ServiceDetail.ServiceCategoryId
    );

    const selectedSubCategory = this.serviceSubcategoryList.find(
      (x) => x.ServiceSubCategoryId === selectedSubCategoryId
    );

    const matchedCharge = this.ServiceChargeList.find(
      (charge) =>
        charge.ServiceCategoryName === selectedCategory?.ServiceCategoryName &&
        charge.ServiceSubCategoryName ===
        selectedSubCategory?.ServiceSubCategoryName
    );

    if (matchedCharge) {
      this.ServiceDetail.ServiceChargeAmount =
        matchedCharge.ServiceChargeAmount;
    } else {
      this.ServiceDetail.ServiceChargeAmount = 0;
    }

    // Set default values first time
    this.ServiceDetail.Quantity = 1;
    this.ServiceDetail.Discount = 0;

    // Calculate total immediately
    this.calculateTotal();
  }

  setPaymentTypeAutomatically() {
    const grandTotal = Number(this.OpdPatient.GrandTotal || 0);
    const paidAmount = Number(this.OpdPatient.TotalPaidAmount || 0);

    const fullPaid = this.PaymentTypeList.find(x => x.Value.toLowerCase() === "full paid")?.Key;
    const dues = this.PaymentTypeList.find(x => x.Value.toLowerCase() === "dues")?.Key;

    if (grandTotal === paidAmount) {
      this.Payment.PaymentType = fullPaid;
    } else {
      this.Payment.PaymentType = dues;
    }
  }


  // Recalculate total whenever needed
  calculateTotal() {
    const amount = Number(this.ServiceDetail.ServiceChargeAmount) || 0;
    const qty = Number(this.ServiceDetail.Quantity) || 0;
    const discount = Number(this.ServiceDetail.Discount) || 0;

    const gross = amount * qty;
    const total = gross - discount;

    this.ServiceDetail.Total = total >= 0 ? total : 0;
    this.setPaymentTypeAutomatically();
  }

  ServiceDetailList: any[] = [];
  PaymentDetailList: any[] = [];

  addServiceDetail() {
    if (!this.ServiceDetail.ServiceCategoryId || !this.ServiceDetail.ServiceSubCategoryId) {
      this.toastr.warning('Please select valid service');
      return;
    }

    const selectedCategory = this.servicecategoryList.find(
      (x) => x.ServiceCategoryId === this.ServiceDetail.ServiceCategoryId
    );
    const selectedSubCategory = this.serviceSubcategoryList.find(
      (x) => x.ServiceSubCategoryId === this.ServiceDetail.ServiceSubCategoryId
    );

    this.ServiceDetail.ServiceCategoryName = selectedCategory?.ServiceCategoryName || '';
    this.ServiceDetail.ServiceSubCategoryName = selectedSubCategory?.ServiceSubCategoryName || '';

    this.ServiceDetailList.push({ ...this.ServiceDetail });

    this.toastr.success('Service added successfully!');
    this.calculateTotals(); // ✅ Recalculate totals

    this.ServiceDetail = {
      ServiceCategoryId: null,
      ServiceCategoryName: '',
      ServiceSubCategoryId: null,
      ServiceSubCategoryName: '',
      ServiceChargeAmount: 0,
      Quantity: 1,
      Discount: 0,
      Total: 0,
    };
  }

  deleteServiceDetail(index: number) {
    if (confirm('Are you sure you want to delete this service record?')) {
      this.ServiceDetailList.splice(index, 1);
      this.toastr.info('Service deleted successfully');
      this.calculateTotals();
    }
  }

  totalAmount: number = 0;
  totalDiscount: number = 0;
  grandTotal: number = 0;
  totalQuantity: number = 0;

  // Recalculate totals
  calculateTotals() {
    // Calculate totals
    this.totalAmount = this.ServiceDetailList.reduce(
      (sum, item) => sum + Number(item.ServiceChargeAmount || 0),
      0
    );

    this.totalDiscount = this.ServiceDetailList.reduce(
      (sum, item) => sum + Number(item.Discount || 0),
      0
    );

    this.grandTotal = this.ServiceDetailList.reduce(
      (sum, item) => sum + Number(item.Total || 0),
      0
    );

    this.totalQuantity = this.ServiceDetailList.reduce(
      (sum, item) => sum + Number(item.Quantity || 0),
      0
    );

    // Assign totals to OPD object
    this.OpdPatient.LineTotal = this.totalAmount;
    this.OpdPatient.TotalDiscount = this.totalDiscount;
    this.OpdPatient.TotalQty = this.totalQuantity;
    this.OpdPatient.GrandTotal = this.grandTotal;

    // ---------------------------------------
    // DO NOT RESET PAID OR DUES HERE!
    // Just recalc dues based on existing payment list
    // ---------------------------------------

    const totalPaid = this.PaymentDetailList.reduce(
      (sum, item) => sum + Number(item.Amount || 0),
      0
    );

    this.OpdPatient.TotalPaidAmount = totalPaid;
    this.OpdPatient.TotalDuesAmount = this.grandTotal - totalPaid;

    if (this.OpdPatient.TotalDuesAmount < 0) {
      this.OpdPatient.TotalDuesAmount = 0;
    }

    // Auto-fill next Payment.Amount = remaining dues
    this.Payment.Amount = this.OpdPatient.TotalDuesAmount;
  }


  Payment: any = {
    Amount: 0,
    PaymentMode: '',
    PaymentType: '',
    PaymentDate: new Date()
  };



  AddPaymentDetailList() {
    // ✅ Basic validation
    if (!this.Payment.Amount || this.Payment.Amount <= 0) {
      this.toastr.warning('Please enter a valid Paid Amount');
      return;
    }
    if (!this.Payment.PaymentMode || !this.Payment.PaymentType) {
      this.toastr.warning('Please select Payment Mode and Type');
      return;
    }

    // ✅ Push payment record into the list
    this.PaymentDetailList.push({ ...this.Payment });

    // ✅ Update totals
    this.calculateTotalPaidAmount();

    // ✅ Toast message
    this.toastr.success('Payment added successfully!');

    // ✅ Reset payment form for next entry
    this.Payment = {
      Amount: 0,
      PaymentMode: '',
      PaymentType: '',
      PaymentDate: new Date(),
      Remarks: this.Payment.Remarks // keep remarks if needed
    };
    this.calculateTotals(); // ✅ Recalculate totals
    // this.autoUpdatePaymentValues();
  }
  calculateTotalPaidAmount() {
    // Calculate total paid amount
    this.OpdPatient.TotalPaidAmount = this.PaymentDetailList.reduce(
      (sum, item) => sum + Number(item.Amount || 0),
      0
    );

    // Update dues
    const grandTotal = Number(this.OpdPatient.GrandTotal || 0);
    this.OpdPatient.TotalDuesAmount = grandTotal - this.OpdPatient.TotalPaidAmount;

    // Prevent negative dues
    if (this.OpdPatient.TotalDuesAmount < 0) {
      this.OpdPatient.TotalDuesAmount = 0;
    }
  }



  getPaymentModeName(modeId: number): string {
    return this.PaymentModeList.find(x => x.Key === modeId)?.Value || '';
  }

  getPaymentTypeName(typeId: number): string {
    return this.PaymentTypeList.find(x => x.Key === typeId)?.Value || '';
  }
  GetOpdTypeList(OpdtypeId: number): string {
    return this.OpdTypeList.find(x => x.Key === OpdtypeId)?.Value || '';
  }

  deletePaymentDetail(index: number) {
    if (confirm('Are you sure you want to delete this payment record?')) {
      this.PaymentDetailList.splice(index, 1);
      this.toastr.info('Payment deleted successfully');
      this.calculateTotalPaidAmount(); // Recalculate totals after delete
    }
  }

  autoUpdatePaymentValues() {
    const grandTotal = Number(this.OpdPatient.GrandTotal || 0);

    // Amount already paid from list
    const paidFromList = this.PaymentDetailList.reduce(
      (sum, item) => sum + Number(item.Amount || 0),
      0
    );

    const currentPaid = Number(this.Payment.Amount || 0);

    // Remaining balance before typing
    const duesBeforeTyping = grandTotal - paidFromList;

    // ************ NEW RULE ************
    // If user enters more than required, auto-correct it
    if (currentPaid > duesBeforeTyping) {
      this.Payment.Amount = duesBeforeTyping;  // Auto set balance amount
    }

    // RE-CALCULATE after correction
    const correctedPaid = Number(this.Payment.Amount || 0);
    const liveTotalPaid = paidFromList + correctedPaid;

    // Update UI
    this.OpdPatient.TotalPaidAmount = liveTotalPaid;
    this.OpdPatient.TotalDuesAmount = grandTotal - liveTotalPaid;

    if (this.OpdPatient.TotalDuesAmount < 0) {
      this.OpdPatient.TotalDuesAmount = 0;
    }

    // Get PaymentType keys
    const fullPaidKey = this.PaymentTypeList.find(x => x.Value === "Full Paid")?.Key;
    const duesKey = this.PaymentTypeList.find(x => x.Value === "Dues")?.Key;

    // Decide payment type
    if (liveTotalPaid === grandTotal) {
      this.Payment.PaymentType = fullPaidKey;
    } else {
      this.Payment.PaymentType = duesKey;
    }
  }


  saveOpd() {
    this.isSubmitted = true;
    this.formOpdPatient.control.markAllAsTouched();
    if (this.formOpdPatient.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }

    this.OpdPatient.UpdatedBy = this.StaffLogin.StaffLoginId;
    this.OpdPatient.CreatedBy = this.StaffLogin.StaffLoginId;
    this.OpdPatient.OpdDate = this.loadDataService.loadDateTime(this.OpdPatient.OpdDate);
    var data = {
      GetOpd: this.OpdPatient,
      GetOpdDetail: this.ServiceDetailList,
      GetPayment: this.PaymentDetailList
    }
    console.log(data);
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(data)).toString()
    }
    this.dataLoading = true;
    this.service.saveOpd(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.OpdPatient.OpdId > 0) {
          this.toastr.success("Data Details Updated successfully")
        } else {
          this.toastr.success("OPD Details Submitted successfully")
        }
        this.resetForm()

        this.dataLoading = false;
      } else {
        this.toastr.error(response.Message)
        // this.CakeBooking.OrderDate = new Date(this.CakeBooking.OrderDate);
        this.dataLoading = false;
      }
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }
  resetForm() {
    this.OpdPatient = {
      OpdDate: this.loadDataService.loadDateYMD(new Date()),
      OpdType: 1
    };

    this.PaymentDetailList = [];
    this.ServiceDetailList = [];

    this.Payment = {
      Amount: 0,
      PaymentMode: "",
      PaymentType: "",
      PaymentDate: new Date(),
      Remarks: ""
    };

    this.ServiceDetail = {
      Quantity: 1,
      Discount: 0
    };
    // VERY IMPORTANT → Restore patient list
    this.PatientList = this.AllPatientList.slice();
  }

}



// resetForm() {
//   this.OpdPatient = {};
//   this.ServiceDetailList = [];
//   this.PaymentDetailList = [];
//   this.Payment = {};
//   this.ServiceDetail = {};
// };
