import { Component, ViewChild, } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../utils/app.service';
import { ConstantData } from '../../utils/constant-data';
import { LoadDataService } from '../../utils/load-data.service';
import { LocalService } from '../../utils/local.service';
import { Gender, DocType, Status } from '../../utils/enum';
import { ActionModel, RequestModel, StaffLoginModel } from '../../utils/interface';
import { Router } from '@angular/router';

declare var $: any
@Component({
  selector: 'app-manage-doctor',
  templateUrl: './manage-doctor.component.html',
  styleUrls: ['./manage-doctor.component.css']
})
export class ManageDoctorComponent {
editDoctor(_t74: any) {
throw new Error('Method not implemented.');
}
  dataLoading: boolean = false
  DoctorList: any = []
  Doctor: any = {}
  isSubmitted = false
  DepartmentList: any = []
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
  DoctorTypeList = this.loadDataService.GetEnumList(DocType);
  AllStatusList = Status;
  AllGenderList = Gender;
  AllDoctorTypeList = DocType;

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
    this.getDoctorList();
  }
  resetForm() {
    this.Doctor = {};
    this.Doctor.JoinDate = new Date();
    this.Doctor.Status = 1
    if (this.formDoctor) {
      this.formDoctor.control.markAsPristine();
      this.formDoctor.control.markAsUntouched();
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

  @ViewChild('formDoctor') formDoctor: NgForm;
  saveDoctor() {
    this.isSubmitted = true;
    this.formDoctor.control.markAllAsTouched();
    if (this.formDoctor.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }

    this.Doctor.JoinDate = this.loadDataService.loadDateTime(this.Doctor.JoinDate);
    this.Doctor.DOB = this.loadDataService.loadDateTime(this.Doctor.DOB);
    this.Doctor.UpdatedBy = this.StaffLogin.StaffLoginId;
    this.Doctor.CreatedBy = this.StaffLogin.StaffLoginId;
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.Doctor)).toString()
    }
    this.dataLoading = true;
    this.service.saveDoctor(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.Doctor.DoctorId > 0) {
          this.toastr.success("Doctor detail updated successfully")

        } else {
          this.toastr.success("Doctor added successfully")
        }
        $('#staticBackdrop').modal('hide')
        this.resetForm()
        // this.DoctorList()
      } else {
        this.toastr.error(response.Message)
        this.dataLoading = false;
        this.Doctor.JoinDate = new Date(this.Doctor.JoinDate);
        if (this.Doctor.DOB)
          this.Doctor.DOB = new Date(this.Doctor.DOB);
      }
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }
  getDoctorList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ })).toString()
    }
    this.dataLoading = true
    this.service.getDoctorList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.DoctorList = response.DoctorList;
        console.log(this.DoctorList)
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

    deleteDoctor(obj: any) {
    if (confirm("Are your sure you want to delete this recored")) {
      var request: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(obj)).toString()
      }
      this.dataLoading = true
      this.service.deleteDoctor(request).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getDoctorList()
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

  editDepartment(obj: any) {
    this.resetForm()
    this.Doctor = obj
  }






}
