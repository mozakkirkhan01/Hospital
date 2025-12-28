import { Component, ViewChild, } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../utils/app.service';
import { ConstantData } from '../../utils/constant-data';
import { LoadDataService } from '../../utils/load-data.service';
import { LocalService } from '../../utils/local.service';
import { Status } from '../../utils/enum';
import { ActionModel, RequestModel, StaffLoginModel } from '../../utils/interface';
import { Router } from '@angular/router';

declare var $: any
@Component({
  selector: 'app-manage-servicecategory',
  templateUrl: './manage-servicecategory.component.html',
  styleUrls: ['./manage-servicecategory.component.css']
})
export class ManageServicecategoryComponent {

  dataLoading: boolean = false
  servicecategoryList: any = []
  servicecategory: any = {}
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
  }
  resetForm() {
    this.servicecategory = {};
    this.servicecategory.Status = 1
    if (this.formservicecategory) {
      this.formservicecategory.control.markAsPristine();
      this.formservicecategory.control.markAsUntouched();
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

    @ViewChild('formservicecategory') formservicecategory: NgForm;
    saveServiceCategory() {
      this.isSubmitted = true;
      this.formservicecategory.control.markAllAsTouched();
      if (this.formservicecategory.invalid) {
        this.toastr.error("Fill all the required fields !!")
        return
      }
  
      var obj: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(this.servicecategory)).toString()
      }
      this.dataLoading = true;
      this.service.saveServiceCategory(obj).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          if (this.servicecategory.servicecategoryId > 0) {
            this.toastr.success("Service Category detail updated successfully")
  
          } else {
            this.toastr.success("servicecategory added successfully")
          }
          $('#staticBackdrop').modal('hide')
          this.resetForm();
          this.dataLoading = false;
          this.getservicecategoryList();
        } else {
          this.toastr.error(response.Message)
          this.dataLoading = false;
        }
      }, (err => {
        this.toastr.error("Error occured while submitting data")
        this.dataLoading = false;
      }))
    
    }
// getservicecategoryList() {
//   const obj: RequestModel = {
//     request: this.localService.encrypt(JSON.stringify({})).toString()
//   };
//   this.dataLoading = true;

//   this.service.getservicecategoryList(obj).subscribe(
//     (response: any) => {
//       console.log('📡 Full API Response:', response);
//       if (response.Message === ConstantData.SuccessMessage) {
//         this.servicecategoryList = response.serviceCategoryList || [];
//         console.log('✅ Data Bound:', this.servicecategoryList);
//       } else {
//         this.toastr.error(response.Message);
//       }
//       this.dataLoading = false;
//     },
//     (err) => {
//       console.error('❌ API Error:', err);
//       this.toastr.error("Error while fetching records");
//       this.dataLoading = false;
//     }
//   );
// }

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

    deleteservicecategory(obj: any) {
    if (confirm("Are your sure you want to delete this recored")) {
      var request: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(obj)).toString()
      }
      this.dataLoading = true
      this.service.deleteservicecategory(request).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getservicecategoryList()
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



    editservicecategory(obj: any) {
    this.resetForm()
    this.servicecategory = obj;
    this.servicecategory.JoinDate = new Date(obj.JoinDate);
    if (this.servicecategory.DateOofBirth)
      this.servicecategory.DateOfBirth = new Date(obj.DateOfBirth);
  }

}
