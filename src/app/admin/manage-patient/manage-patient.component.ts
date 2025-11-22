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
  selector: 'app-manage-Patient',
  templateUrl: './manage-Patient.component.html',
  styleUrls: ['./manage-Patient.component.css']
})
export class ManagePatientComponent {

  dataLoading: boolean = false
  PatientList: any = []
  Patient: any = {}
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
  PatientTypeList = this.loadDataService.GetEnumList(DocType);
  AllStatusList = Status;
  AllGenderList = Gender;
  AllMaritalStatusList = MaritalStatus;
  AllBloodGroupList = BloodGroup;
  AllPatientTypeList = DocType;

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
    this.getPatientList();
  }
  resetForm() {
    this.Patient = {};
    this.Patient.JoinDate = new Date();
    this.Patient.Status = 1
    if (this.formPatient) {
      this.formPatient.control.markAsPristine();
      this.formPatient.control.markAsUntouched();
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

  @ViewChild('formPatient') formPatient: NgForm;

  savePatient() {
    this.isSubmitted = true;
    this.formPatient.control.markAllAsTouched();
    if (this.formPatient.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }

    this.Patient.JoinDate = this.loadDataService.loadDateTime(this.Patient.JoinDate);
    this.Patient.DateOfBirth = this.loadDataService.loadDateTime(this.Patient.DateOfBirth);
    this.Patient.UpdatedBy = this.StaffLogin.StaffLoginId;
    this.Patient.CreatedBy = this.StaffLogin.StaffLoginId;
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.Patient)).toString()
    }
    this.dataLoading = true;
    this.service.savePatient(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.Patient.PatientId > 0) {
          this.toastr.success("Patient detail updated successfully")

        } else {
          this.toastr.success("Patient added successfully")
        }
        $('#staticBackdrop').modal('hide')
        this.dataLoading = false;
        this.resetForm();
        this.getPatientList();
      } else {
        this.toastr.error(response.Message)
        this.dataLoading = false;
        this.Patient.JoinDate = new Date(this.Patient.JoinDate);
        if (this.Patient.DateOfBirth)
          this.Patient.DateOfBirth = new Date(this.Patient.DateOfBirth);
      }
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }
  getPatientList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ })).toString()
    }
    this.dataLoading = true
    this.service.getPatientList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.PatientList = response.PatientList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

    deletePatient(obj: any) {
    if (confirm("Are your sure you want to delete this recored")) {
      var request: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(obj)).toString()
      }
      this.dataLoading = true
      this.service.deletePatient(request).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getPatientList()
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



    editPatient(obj: any) {
    this.resetForm()
    this.Patient = obj;
    this.Patient.JoinDate = new Date(obj.JoinDate);
    if (this.Patient.DateOofBirth)
      this.Patient.DateOfBirth = new Date(obj.DateOfBirth);
  }





}
