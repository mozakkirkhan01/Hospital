import { Component } from '@angular/core';
import { ViewChild, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../utils/app.service';
import { ConstantData } from '../../utils/constant-data';
import { LoadDataService } from '../../utils/load-data.service';
import { LocalService } from '../../utils/local.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-opd-list',
  templateUrl: './manage-opd-list.component.html',
  styleUrls: ['./manage-opd-list.component.css']
})
export class ManageOpdListComponent {

}
