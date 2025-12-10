import { Component, ViewChild, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../utils/app.service';
import { ConstantData } from '../../utils/constant-data';
import { LoadDataService } from '../../utils/load-data.service';
import { LocalService } from '../../utils/local.service';
import { Router } from '@angular/router';
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
  // MaritalStatus,
} from '../../utils/enum';

@Component({
  selector: 'app-manage-opd',
  templateUrl: './manage-opd.component.html',
  styleUrls: ['./manage-opd.component.css'],
})
export class ManageOpdComponent implements OnInit {
  OpdPatient: any = {};
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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.StaffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getPatientList();
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

  @ViewChild('formOpdPatient') formOpdPatient: NgForm;

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
  AllPatientList: any []=[];
  PatientList: any []=[];

 getPatientList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Status: Status.Active })).toString()
    }
    this.dataLoading = true
    this.service.getPatientList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllPatientList = response.PatientList;
        this.AllPatientList.map(x1 => x1.SearchPatient = `${x1.PatientName} - ${x1.UHIDNo} - ${x1.MobileNo}`);
        this.PatientList = this.AllPatientList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }



   filterPatientList(value: any) {
    if (value) {
      const filterValue = value.toLowerCase();
      this.PatientList = this.AllPatientList.filter((option: any) => option.SearchPatient.toLowerCase().includes(filterValue));
    } else {
      this.PatientList = this.AllPatientList;
    }
    this.OpdPatient.PatientId = 0;
  }
  clearPatient() {
    this.PatientList = this.AllPatientList;
    this.OpdPatient.PatientId = null;
    this.OpdPatient = {};
  }

afterPatientSelected(event: any) {
    this.OpdPatient.PatientId = event.option.id;
    //this.CakeBooking.CustomerName = event.option.value;
    var Patient = this.PatientList.find((x: any) => x.PatientId == this.OpdPatient.PatientId);
    this.OpdPatient.UHIDNo = Patient.UHIDNo;
    this.OpdPatient.MobileNo = Patient.MobileNo;
    this.OpdPatient.PatientNameauto = Patient.PatientName;
    this.OpdPatient.Age = Patient.Age;
    this.OpdPatient.Address = Patient.Address;
  }








  // service category selection
afterServiceCategorySelected(event: any) {

}
  clearServie() {
    this.PatientList = this.AllPatientList;
    this.OpdPatient.PatientId = null;
    this.OpdPatient = {};
  }

     filterServiceList(value: any) {
    if (value) {
      const filterValue = value.toLowerCase();
      this.PatientList = this.AllPatientList.filter((option: any) => option.SearchPatient.toLowerCase().includes(filterValue));
    } else {
      this.PatientList = this.AllPatientList;
    }
    this.OpdPatient.PatientId = 0;
  }



}
