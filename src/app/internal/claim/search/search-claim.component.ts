import { Component, OnInit, ViewContainerRef, TemplateRef, OnDestroy  } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { SharedService } from '../../services/shared/shared.service';
import { InternalService } from '../../services/internal/internal.service';
import { Constant } from '../../.././utill/constants/constant';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth/auth.service';

import * as moment from 'moment';
import * as FileSaver from 'file-saver';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {Router,ActivatedRoute} from '@angular/router'

@Component({
  selector: 'app-search-claim',
  templateUrl: './search-claim.component.html',
  styleUrls: ['./search-claim.component.css']
})
export class SearchClaimComponent implements OnInit,OnDestroy {
  modalRef: BsModalRef;
  radioModel = 'Middle';
  public moduleWeightage = {
    CLMCR: 0,
    CLMRESCAPA: 0,
    ICLMCR: 0,
    ICLMRESCAPA: 0
  }
  public currentReferenceNo: any;
  public searchFilters = {
		'GlobalSearch':"",
    'ClaimInitationFromDate': moment().subtract(2, 'week').format('MM/DD/YYYY'),
    'ClaimInitationToDate': moment().format('MM/DD/YYYY'),
		'ClaimType':"0",
		'ReferenceNo':"",
		'ClaimStatus':"0",
		'EmployeeName':"",
    'PageSize':10,
    'PageNum':1,
		'SortingColumn':'ClaimId',
		'SortingOrder':'A'
	}
  public tempSearchFilters:any;
  public currentSearchFilters: any;
  public sortingColumns = {
    ReferenceNo: true,
    Employeename: true,
    ClaimInitiationDate: true,
    ClaimStatus: true,
    DaysOpen: true,
    ClaimType: true
  }

  public advanceSearch = false;
  public searchExpandCollapseText = 'Advanced Search';
  public updownArrow = 'icon-arrow-down';
  public pagination = {
    maxPages: 5,
    totalItems: 0,
    currentPage: 1,
    itemsPerPage: 10
  }
  public claimLists = [];
  public claimDetails = {
    IncidentDetail: {},
    InjuryDetail: {}
  };

	public loading = false;
  public printDownloadPopUp = 'hide';
  public popupMode = 'PRINT';
  public printClaimDetails:any = {};
  public claimTypesList = [];
  public claimStatusList = [];
  public translationLables:any = {};

  public modelConfigPopup:any;
  constructor(
    private toastr: ToastsManager,
  	private sharedService: SharedService,
  	private internal: InternalService,
    private vcr: ViewContainerRef,
    private constant: Constant,
    private translate: TranslateService,
    private modalService: BsModalService,
    private authService: AuthService,
    private router:Router,
    private activatedRoute:ActivatedRoute
  ) {
    this.toastr.setRootViewContainerRef(vcr);
    this.sharedService.emitChange({current_page: 'SEARCH_PAGE'});
    this.tempSearchFilters = Object.assign({}, this.searchFilters);
    this.getSearchResults(this.searchFilters);
  }

  ngOnInit() {

    this.moduleWeightage.ICLMCR = this.authService.getTransactionWeightage('ICLMCR');
    this.moduleWeightage.ICLMRESCAPA = this.authService.getTransactionWeightage('ICLMRESCAPA');

    this.getClaimTypeList();
    this.getClaimStatusList();


    this.translate.get('searchPage.basicSearch').subscribe(value => {
      this.translationLables.basicSearch = value;
    });
    this.translate.get('searchPage.advancedSearch').subscribe(value => {
      this.translationLables.advancedSearch = value;
      this.searchExpandCollapseText = this.translationLables.advancedSearch;
    });
    this.translate.get('searchPage.toDateGreaterThanFrom').subscribe(value => {
      this.translationLables.toDateGreaterThanFrom = value;
    });
    this.translate.get('searchPage.printThisPage').subscribe(value => {
      this.translationLables.printThisPage = value;
    });

    this.modelConfigPopup = {class: 'modal-md', ignoreBackdropClick: true};
  }
  reloadSearchPage(){
    this.applySearch(this.currentSearchFilters);
  }

  getClaimTypeList(): void {
    this.internal.getClaimType(response => {
      this.claimTypesList = response;
    }, error => {
      this.claimTypesList = [];
    })
  }

  getClaimStatusList(): void {
    this.internal.getClaimStatus(response => {
      this.claimStatusList = response;
    }, error => {
      this.claimStatusList = [];
    })
  }

  onSearchExpandCollapse(): void {
    this.advanceSearch = !this.advanceSearch;
    if (this.advanceSearch) {
        this.searchExpandCollapseText = this.translationLables.basicSearch;
        this.updownArrow = 'icon-arrow-up';
    } else {
        this.searchExpandCollapseText = this.translationLables.advancedSearch;
        this.updownArrow = 'icon-arrow-down'
    }
  }

  applySearch(_searchFilters) {

    this.tempSearchFilters = Object.assign({}, _searchFilters);
    this.tempSearchFilters.PageNum = 1;
    this.pagination.currentPage = 1;
    this.getSearchResults(_searchFilters);
  }

  applyReset() {
    this.searchFilters = {
      'GlobalSearch':"",
      'ClaimInitationFromDate': moment().subtract(2, 'week').format('MM/DD/YYYY'),
      'ClaimInitationToDate': moment().format('MM/DD/YYYY'),
      'ClaimType':"0",
      'ReferenceNo':"",
      'ClaimStatus':"0",
      'EmployeeName':"",
      'PageSize': this.tempSearchFilters.PageSize,
      'PageNum': this.tempSearchFilters.PageNum,
      'SortingColumn':'ClaimId',
      'SortingOrder':'A'
    }
  }

  getSearchResults(_searchFilters) {
    this.currentSearchFilters = _searchFilters;
    if(this.initiateDateValidate(_searchFilters.ClaimInitationFromDate, _searchFilters.ClaimInitationToDate)) {
      return;
    }
  	this.loading = true;
    this.claimLists = [];
    _searchFilters.PageSize = this.searchFilters.PageSize;
    if(_searchFilters.ClaimInitationFromDate) {
      _searchFilters.ClaimInitationFromDate  =  moment(_searchFilters.ClaimInitationFromDate).format('MM/DD/YYYY');
    }
    if(_searchFilters.ClaimInitationToDate) {
      _searchFilters.ClaimInitationToDate = moment(_searchFilters.ClaimInitationToDate).format('MM/DD/YYYY');
    }
  	this.internal.searchClaim(_searchFilters, response => {
      this.claimLists = response.ClaimDetails ? response.ClaimDetails : [];
      this.pagination.totalItems = response.TotalRows;
      this.pagination.itemsPerPage = this.searchFilters.PageSize;
      this.loading = false;
  	}, error => {
      
      this.loading = false;
  	})
  }

  paginationChanged(_event) {
    this.tempSearchFilters.PageNum = _event.page;
    this.tempSearchFilters.PageSize = _event.itemsPerPage;
    this.getSearchResults(this.tempSearchFilters);
  }

  applySorting(_fieldName) {
    this.tempSearchFilters.SortingColumn = _fieldName;
    this.tempSearchFilters.SortingOrder = this.sortingColumns[_fieldName] ? 'A' : 'D';
    this.sortingColumns[_fieldName] = !this.sortingColumns[_fieldName];
    this.getSearchResults(this.tempSearchFilters);
  }

  showDownloadPrintPreview(_claim, _popupMode, template: TemplateRef<any>,) {
    this.loading = true;
    this.popupMode = _popupMode;
    this.printClaimDetails = _claim;
    this.internal.getClaimDetails(_claim.ClaimTypeId,_claim.ReferenceNo, response => {
      this.loading = false;
      this.printDownloadPopUp = 'show';
      this.modalRef = this.modalService.show(template, this.modelConfigPopup);
      this.claimDetails = response;
    }, error => {
      
      this.loading = false;
    })
  }

  printClaim(printSectionId) {
      const innerContents = document.getElementById(printSectionId).innerHTML;
      const innerContentsModified = innerContents.replace('<button class="button">'+this.translationLables.printThisPage+'</button>', '');
      const popupWinindow = window.open('', '_blank', 'width=600, height=500, ' +
          + ' scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
      popupWinindow.document.open();
      popupWinindow.document.write('<html> <link rel="stylesheet" media="screen, print" href="assets/modern/css/styles.css"> <link rel="stylesheet" media="screen, print" href="assets/css/print/print_claim.css"> <body>' + innerContentsModified + '</body><script type="text/javascript">window.onload = function(){window.print();}</script></html>');
      popupWinindow.document.close();
  }

  downloadClaimPDF(_claimTypeId,_referenceNo) {
    this.loading = true;
      this.internal.getClaimPDF(_claimTypeId,_referenceNo, response => {
        var blob = new Blob([response], {type: 'application/pdf'});
        FileSaver.saveAs(blob, _referenceNo + '_' + moment().format('x') +'.pdf');
        this.loading = false;
      }, error => {
        
        this.loading = false;
      })


  }

  initiateDateValidate(_fromDate, _toDate) {
    if(moment(_toDate).diff(moment(_fromDate)) < 0) {
        this.onValidateToastMessage(this.translationLables.toDateGreaterThanFrom);
        return true;
    }
    return false;
  }
  onEdit(selectedItem): void {
    if(selectedItem.ClaimTypeId==1){
      this.router.navigate(['view','accident', selectedItem.ReferenceNo], { relativeTo: this.activatedRoute.parent });
    }
    else{
      this.router.navigate(['hazardview', selectedItem.ReferenceNo], { relativeTo: this.activatedRoute.parent });
    }
   
}
  onErrorToastMessage(message): void {
      this.loading = false;
      this.toastr.error(message, 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime });
  }

  onValidateToastMessage(message): void {
      this.loading = false;
      this.toastr.error(message, '', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime });
  }

  onSuccessToastMessage(message): void {
    this.loading = false;
    this.toastr.success(message, 'Success!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime });
  }

  deleteClaimClicked(_referenceNo, template?: TemplateRef<any>) {
    this.currentReferenceNo = _referenceNo;
    this.modalRef = this.modalService.show(template, { class: 'd-flex align-self-center modal-md', ignoreBackdropClick: true });
  }

  confirmDeleteClaim() {
    this.loading = true;
    this.internal.deleteInternalClaim(this.currentReferenceNo, response => {
      this.onSuccessToastMessage(JSON.parse(response._body).Message);
      this.modalRef.hide();
      this.reloadSearchPage();
      this.loading = false;
    }, error => {
      this.modalRef.hide();
      this.loading = false;
    })
  }
  createNewInternalClaim(id:number){     // this.setPreviousURL();
     if(id==1){
      this.router.navigate(['accident', 'create'], { relativeTo: this.activatedRoute.parent });
     }
     else{
      this.router.navigate(['hazard', 'create'], { relativeTo: this.activatedRoute.parent });
     }
     
  }
  ngOnDestroy(){
    if(this.modalRef) {
      this.modalRef.hide();
    }

  }

}
