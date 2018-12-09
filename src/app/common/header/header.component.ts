import { Component, OnInit, TemplateRef} from '@angular/core';
import { Router,RouterLink } from '@angular/router';
import { Constant } from '../../utill/constants/constant';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public username = '';
  public logoutPopup= 'hide';
  modalRef: BsModalRef;
  public modelConfigConfirm: any ;

  constructor(
    private constant: Constant,
    private router: Router,
    private modalService: BsModalService
    ) {
  }

  ngOnInit() {
    if(!localStorage.getItem('userData')) {
      this.router.navigate(['/login']);
      return;
    }
  	this.username = this.constant.userAuth.FullName;
  	var userData:any = JSON.parse(localStorage.getItem('userData'));
  	this.username = this.username ? this.username : userData.UserName ? userData.UserName : '';
    this.modelConfigConfirm = {class: 'd-flex align-self-center modal-sm', ignoreBackdropClick: true};
  }

  openModal(template: TemplateRef<any>) {
     this.modalRef = this.modalService.show(template, this.modelConfigConfirm);
   }

   confirm(): void {
    localStorage.removeItem("userData");
    localStorage.removeItem("responseData");
    localStorage.removeItem("claimData");
    window.location.href = this.constant.loginURL;
    this.modalRef.hide();
  }

  decline(): void {
    this.modalRef.hide();
  }
}
