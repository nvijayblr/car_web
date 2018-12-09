import { VOID_VALUE } from '@angular/animations/browser/src/render/transition_animation_engine';
import { Component, OnInit, ViewContainerRef, ViewEncapsulation, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DashboardService } from '../../../../services/home/dashboard.service';
import { Languageconstant } from '../../../../utill/constants/languageconstant';
import { Constant } from '../../../../utill/constants/constant';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { IMyDpOptions } from 'mydatepicker';

import { AsyncLocalStorage } from 'angular-async-local-storage';
import $ from 'jquery';
import { CreatenewclaimService } from '../../../../services/home/createnewclaim.service';
import { DatePipe } from '@angular/common';
import { LocationStrategy } from '@angular/common';

import { AuthService } from '../../../../services/auth/auth.service';
import { SharedService } from '../../../../services/home/shared.service';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TranslateService } from '@ngx-translate/core';

import * as moment from 'moment';
import * as FileSaver from 'file-saver';
import { ExternalToasterService } from '../../../../services/external-toaster/external_toaster.service';

@Component({
  selector: 'app-claim-home',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './claim-home.component.html',
  styleUrls: ['./claim-home.component.css'],
  providers: [DatePipe]
})
export class ClaimHomeComponent implements OnInit {

  modalRef: BsModalRef;
  radioModel = 'Middle';

  public today = new Date();

    public myDatePickerOptions: IMyDpOptions = {

        showTodayBtn: false,
        dateFormat: 'mm/dd/yyyy',
        firstDayOfWeek: 'mo',
        sunHighlight: true,
        inline: false,
        showClearDateBtn: false,
        alignSelectorRight: true,
        editableDateField: false,
        openSelectorOnInputClick: true,
        disableSince: {
            year: this.today.getFullYear(),
            month: this.today.getMonth() + 1,
            day: this.today.getDate() + 1
        }

    };

    public currentReferenceNo : any;
    // Table Start
    public filterQuery = "";
    public rowsOnPage = 10;
    public sortBy = "daysOpen";
    public sortOrder = "asc";
    public data = [];
    public capadetails = {};
    // Table End

    public isClaimLevelOne:any;
    public isClaimLevelTwo:any;
    public isCapaLevelOne:any;
    public isCapaLevelTwo:any;
    public loading = true;
    public searchExpandCollapseText = 'Advanced Search';
    public advanceSearch = false;
    public updownArrow = 'icon-arrow-down';
    public claimTypeList;
    public claimStatusList;
    public claimCategoryList;
    public isrecordsAvailable: any;
    public printPopUp = 'hide';
    public downloadPopUp = 'hide';
    public CARNumber;
    public SalesAdministrator;
    public country;
    public nameOfTheCustomer;
    public customerPhone;
    public customerEmail;
    public brand;
    public complaintCategory;
    public invoiceNumber;
    public numberOfPallets;
    public numberDefectedItems;
    public commercialCode;
    public unitCost;
    public quantity;
    public totalCost;
    public popupDate;
    public SalesAdministratorPhone;
    public customerNumber;
    public ContactPerson;
    public ModeOfcomplaints;
    public ProductDescription;
    public DeliveryDate;
    public DeliveryNote;
    public NumberofDeliveredItems;
    public DrawingNumberandRevLevel;
    public userData;
    public isQAManager = false;
    public noClaim;
    public viewClaim;
    public userdetails;
    public countryObject = {
        'Symbol': '',
    }
    public searchCalimObject:any;

    public tempSearchFilters:any;

    public sortingColumns = {
        ClaimNo: true,
        CustomerName: true,
        ClaimInitiationDate: true,
        ClaimStatus: true,
        ClaimLevel: true,
        InvoiceNo: true,
        DaysOpen: true,
        ClaimType: true
    }
    public pagination = {
        maxPages: 5,
        totalItems: 0,
        currentPage: 1,
        itemsPerPage: 10
    }
    public popupMode = 'PRINT';
    public printDownloadPopUp = 'hide';
    public printClaimDetails:any = {};
    public modelConfigPopup:any;
    public claimActionArray : any;
    public responsibleDepartmentList = [];
    public IC_reponsibleDept: string;
    public Replace_responsibleDept: string;
    private brandList = [];
    private complaintCategoryList = [];
    private modeOfComplaintList = [];
    constructor(
        private languageconstant: Languageconstant,
        private router: Router,
        private dashboardService: DashboardService,
        private toastr: ToastsManager,
        private datePipe: DatePipe,
        vcr: ViewContainerRef,
        private storage: AsyncLocalStorage,
        private constant: Constant,
        private activatedRoute: ActivatedRoute,
        private createnewclaimService: CreatenewclaimService,
        private location: LocationStrategy,
        private modalService: BsModalService,
        private authService: AuthService,
        private sharedService: SharedService,
        translate: TranslateService,
        private externalToasterService : ExternalToasterService
    ) {
        translate.setDefaultLang('en-US');
        translate.use('en-US');
        this.sharedService.emitChange({current_page: 'SEARCH_PAGE'});
        this.toastr.setRootViewContainerRef(vcr);
        // this.toastr.options.positionClass = "toast-bottom-full-width";

        let auth:any = authService.getAccessLevels('CLMCR');
        this.isClaimLevelOne = auth.isLevelOne ? auth.isLevelOne : false;
        this.isClaimLevelTwo = auth.isLevelTwo ? auth.isLevelTwo : false;

        auth = authService.getAccessLevels('CLMRESCAPA');
        this.isCapaLevelOne = auth.isLevelOne ? auth.isLevelOne : false;
        this.isCapaLevelTwo = auth.isLevelTwo ? auth.isLevelTwo : false;
        if(this.isClaimLevelOne || this.isClaimLevelTwo) {
          this.router.navigate(['/dashboard/claim']);
        } else if(this.isCapaLevelOne || this.isCapaLevelTwo) {
          this.router.navigate(['/dashboard/capa']);
        } else {
            this.router.navigate(['/404']);
        }
        this.modelConfigPopup = {class: 'modal-md', ignoreBackdropClick: true};
    }

    ngOnInit() {
        this.claimTypeList = [];
        if (localStorage.getItem("userData") == null) {
            const link = this.constant.loginURL;
            window.location.href = link;
        }
        localStorage.setItem('capa-load-from', 'claim');
        this.getAllDropdownData();
        let fromDate = new Date(+new Date - 12096e5);
        this.reloadSearchPage();
    }

    getAllDropdownData(): void {
        this.getClaimTypes();
        this.getClaimStatusList();
        this.getClaimCategory();
        this.getResponsibleDeptList(); // for print preview details
        this.getBrandList(); // for print preview details
        this.getComplaintCategory(); // for print preview details
        this.getModeOfComplaintList(); // for print preview details
        
    }

    onSearchExpandCollapse(): void {
        this.advanceSearch = !this.advanceSearch;
        if (this.advanceSearch) {
            this.searchExpandCollapseText = 'Basic Search';
            this.updownArrow = 'icon-arrow-up';
        } else {
            this.searchExpandCollapseText = 'Advanced Search';
            this.updownArrow = 'icon-arrow-down'
        }
    }

    applySearch(_searchFilters) {
        this.tempSearchFilters = Object.assign({}, _searchFilters);
        this.tempSearchFilters.PageNum = 1;
        this.pagination.currentPage = 1;
        this.onSearchClick(this.tempSearchFilters);
    }

    onSearchClick(_searchFilters): void {
        if(this.initiateDateValidate(_searchFilters.claimInitatorFromdate, _searchFilters.claimInitatorTodate)) {
          return;
        }
        this.constant.searchObject = JSON.parse(JSON.stringify(_searchFilters));
        this.constant.searchObject.searchSatus = true;
        // this.constant.searchObjectStatus = 'true';
        this.loading = true;

        _searchFilters.claimInitatorFromdate  =  moment(_searchFilters.claimInitatorFromdate).format('MM/DD/YYYY');
        _searchFilters.claimInitatorTodate = moment(_searchFilters.claimInitatorTodate).format('MM/DD/YYYY');

        _searchFilters.CreatedBy = JSON.parse(localStorage.getItem("userData")).UserId;
        if (this.isQAManager) {
            _searchFilters.Role = 'QA';
        } else {
            _searchFilters.Role = 'I';
        }
        // api call
        this.dashboardService.searchClaim(_searchFilters, response => {
            this.loading = false;
            if (response.StatusCode === "SUCCESS") {
                this.data = (response.Data && response.Data.ResultList) ? response.Data.ResultList : [];
                this.isrecordsAvailable = this.data;
                this.rowsOnPage = this.data.length;
                this.pagination.totalItems = (response.Data && response.Data.TotalRows) ? response.Data.TotalRows : 0;
                this.pagination.itemsPerPage = _searchFilters.PageSize;
                
            } else {
                var NO_NETWORK_FOUND = this.externalToasterService.getMessageFromCode('NO_NETWORK_FOUND');
                this.toastr.error(response.Data, NO_NETWORK_FOUND, {
                    showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
                });
            }
        }, error => {
            this.loading = false;
            this.onErrorToastMessage(error);
        });
    }

    applySorting(_fieldName) {
        this.tempSearchFilters.SortingColumn = _fieldName;
        this.tempSearchFilters.SortingOrder = this.sortingColumns[_fieldName] ? 'A' : 'D';
        this.sortingColumns[_fieldName] = !this.sortingColumns[_fieldName];
        this.onSearchClick(this.tempSearchFilters);
    }

  paginationChanged(_event) {
    this.tempSearchFilters.PageNum = _event.page;
    this.tempSearchFilters.PageSize = _event.itemsPerPage;
    this.onSearchClick(this.tempSearchFilters);
  }
    onResetClick(): void {
        let fromDate = new Date(+new Date - 12096e5);
        this.searchCalimObject = {
            'custName': '',
            'claimInitatorFromdate': moment().subtract(2, 'week').format('MM/DD/YYYY'),
            'claimInitatorTodate': moment().format('MM/DD/YYYY'),
            'claimTypeSelectedValue': '0',
            'CARNo': '',
            'invoiceNum': '',
            'claimStatusSelectedValue': '0',
            'claimCategorySelectedValue': '0',
            'convetedFromdate': '',
            'convetedTodate': '',
            'searchSatus': false,
            'CreatedBy': JSON.parse(localStorage.getItem("userData")).UserId,
            'Role': '',
            'GlobalSerach':'',
            'LatestFiveClaims':"",
            'PageSize':10,
            'PageNum':1,
            'SortingColumn':"ClaimNo",
            'SortingOrder':"A",
            'Initiator':""
        };
        this.constant.searchObject.searchSatus = true;
    }

    initiateDateValidate(_fromDate, _toDate) {
        if(moment(_toDate).diff(moment(_fromDate)) < 0) {
            this.onValidateToastMessage("Initiation To Date must be greater than or equal to Initiation From Date");
            return true;
        }
        return false;
    }

    getCliamDetails(selectedItem, template: TemplateRef<any>): void {
        this.loading = true;
        // api call
        this.createnewclaimService.getClaimDetails(selectedItem, response => {
            this.loading = false;
            this.popupDate = response.Data.ClaimDetails.CreatedDate;
            this.SalesAdministratorPhone = response.Data.InitiatorDetails.InitiatorPhone;
            this.customerNumber = response.Data.CustomerDetails.CustomerNumber;
            this.ContactPerson = response.Data.CustomerDetails.ContactPerson;
            this.ModeOfcomplaints = this.setModeOfComplaintName(response.Data.CustomerDetails.ModeOfComplaintID); // ComplaintMode.ModeName;
            this.ProductDescription = response.Data.ProductDetails.ProductDescription;
            this.DeliveryDate = response.Data.ProductDetails.DeliveryDate;
            this.DeliveryNote = response.Data.ClaimDetails.Notes;
            this.NumberofDeliveredItems = response.Data.ProductDetails.NoOfDeliveredItems;
            this.DrawingNumberandRevLevel = response.Data.ProductDetails.DrawingNumberRev;

            this.CARNumber = response.Data.ComplaintNumber;
            this.SalesAdministrator = response.Data.InitiatorDetails.InitiatorName;
            this.country = response.Data.CustomerDetails.Country.CountryName;
            this.nameOfTheCustomer = response.Data.CustomerDetails.CustomerName;
            this.customerPhone = response.Data.CustomerDetails.CustomerPhone;
            this.customerEmail = response.Data.CustomerDetails.Email;
            this.brand = this.setBrandName(response.Data.ProductDetails.BrandID); // Brand.BrandName;
            this.complaintCategory = this.setComplaintCateegoryName(response.Data.ProductDetails.ComplaintCategoryID); // ComplaintCategory.ComplaintCatName;
            this.invoiceNumber = response.Data.ClaimDetails.InvoiceNumber;
            //this.numberOfPallets = ' ';
            this.numberDefectedItems = response.Data.ProductDetails.NoOfDefectedItems;
            //this.commercialCode = ' ';
            this.claimActionArray = {
                "ClaimCategoryID" : response.Data.ClaimDetails.ClaimCategoryID,
                "ActionRequested" : response.Data.ActionRequested,
                "ClaimTypeCode" : this.setClaimTypeCode(response.Data.ClaimDetails.ClaimTypeId) // ClaimType.TypeCode
            };
            if(response.Data.ActionRequested.IsIssueCredit)
            this.IC_reponsibleDept = this.getResponsibleDeptValue(response.Data.ActionRequested.ICResponsibleDepartmentId);
            else if(response.Data.ActionRequested.IsReplacement)
            this.Replace_responsibleDept = this.getResponsibleDeptValue(response.Data.ActionRequested.ReplacementResponsibleDepartmentId);

            this.unitCost = response.Data.ActionRequested.ICUnitCost;
            this.quantity = response.Data.ActionRequested.ICQuantity;
            this.totalCost = response.Data.ActionRequested.ICTotalCost;

            this.printDownloadPopUp = 'show';
            this.modalRef = this.modalService.show(template, {class: 'modal-lg', ignoreBackdropClick: true} );
            if(response.Data.CustomerDetails.Country){
                this.countryObject.Symbol = response.Data.CustomerDetails.Country.CurrencySymbol;
            }
        }, error => {
            this.loading = false;
        });
    }

    onEdit(selectedItem): void {
        // const link = ['dashboard/Createnewclaim'];
        this.setPreviousURL();
        this.router.navigate(['Viewclaim', selectedItem.ComplaintNumber], { relativeTo: this.activatedRoute.parent });
    }
    setPreviousURL(){
        this.sharedService.setPreviousURL(this.router.url);
      }
    

    onRespond(selectedItem): void {
        const link = ['Respond'];
        this.setPreviousURL();
        this.router.navigate(link);
        var status = 0;
        // if (selectedItem.Status == 'Closed') {
        //     status = 1;
        // }
        this.router.navigate(['Respond', selectedItem.ComplaintNumber, selectedItem.RespondButtonStatus], { relativeTo: this.activatedRoute.parent });
    }
    onInitiateCapa(details): void {
        // const link = ['dashboard/CAPA'];
        // this.router.navigate(link,'1');
        localStorage.setItem('capa-load-from', 'claim');
        if (details.CAPAButtonStatus === 1) {
            this.loading = true;
            // details.ComplaintNumber=JSON.parse(details.ComplaintNumber);
            // var someStr = details.ComplaintNumber;
            // var cmpno=someStr.replace(/['"]+/g, '');
            // api call
            let params = {
                ComplaintNumber:details.ComplaintNumber,
                IsCAPAValidating:false,
                SBUId:0 //no sbu
            }
            this.dashboardService.createCapa(params, response => {
                this.loading = false;
                this.setPreviousURL();
                this.router.navigate(['CAPA', response.Data], { relativeTo: this.activatedRoute.parent });

            // this.onSearchClick();

            }, error => {
                this.toastr.error('Internal Server Error', '', {
                    showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
                });
            });

        } else {
            this.setPreviousURL();
            this.router.navigate(['CAPA', details.CAPADetailsID], { relativeTo: this.activatedRoute.parent });
        }
    }

    /**
     * @desc function for showing success toast message
     **/
    onSuccessToastMessage(message): void {
        this.loading = false;
        var SUCCESS = this.externalToasterService.getMessageFromCode('SUCCESS');
        this.toastr.success(message, SUCCESS, { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime });
    }

    /**
     * @desc function for showing error toast message
     **/
    onErrorToastMessage(message): void {
        this.loading = false;
        var FAILURE = this.externalToasterService.getMessageFromCode('FAILURE');
        this.toastr.error(message, FAILURE, { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime });
    }
    onValidateToastMessage(message): void {
        this.loading = false;
        this.toastr.error(message, '', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime });
    }



    showDownloadPrintPreview(_claim, _popupMode, template: TemplateRef<any>) {
        this.popupMode = _popupMode;
        this.printClaimDetails = _claim;
        this.getCliamDetails(_claim.ComplaintNumber, template);
    }

    printClaim(printSectionId) {
      const innerContents = document.getElementById(printSectionId).innerHTML;
      const innerContentsModified = innerContents.replace('<div class="print complaint-response">', '<div class="print complaint-response print-pdf sheet padding-15mm">');
      const popupWinindow = window.open('', '_blank', 'width=600, height=500, ' +
          + ' scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
      popupWinindow.document.open();
      popupWinindow.document.write('<html><link rel="stylesheet" media="screen, print" href="assets/modern/css/print.css"><style>@page { size: letter }</style> <body class="letter">' + innerContentsModified + '</body><script type="text/javascript">window.onload = function(){window.print();}</script></html>');
      popupWinindow.document.close();
    }

    downloadClaimPDF(_referenceNo) {
        this.loading = true;
        this.dashboardService.getClaimPDF(_referenceNo, response => {
          var blob = new Blob([response], {type: 'application/pdf'});
          FileSaver.saveAs(blob, _referenceNo + '_' + moment().format('x') +'.pdf');
          this.loading = false;
        }, error => {
          this.loading = false;
        })
    }

    gotoCreateANewCalim(_claimType): void {
        this.constant.complaintNum = '';
        this.constant.claimtype = _claimType;
        this.setPreviousURL();
        this.router.navigate(['Createnewclaim', _claimType], { relativeTo: this.activatedRoute.parent });
    }

    getResponsibleDeptList(): void {
        this.createnewclaimService.getResponsibleDeptList('', response => {
            let dataArray = (response.Data) ? response.Data : [];
            this.responsibleDepartmentList = (dataArray) ? dataArray : [];

        }, error => { });
    }

    getResponsibleDeptValue(id){
        var name = "";
        if(this.responsibleDepartmentList && this.responsibleDepartmentList.length > 0){
            this.responsibleDepartmentList.forEach(element => {
                if(element.Id == id)
                name = element.Name;
            });
        }
        return name;
    }

    deleteClaimClicked(_referenceNo,template?: TemplateRef<any>){
        this.currentReferenceNo = _referenceNo;
        this.modalRef = this.modalService.show(template, {class: 'd-flex align-self-center modal-md', ignoreBackdropClick: true} );
    }

    confirmDeleteClaim() {
        this.loading = true;
        this.dashboardService.deleteExternalClaim(this.currentReferenceNo, response => {
            this.onSuccessToastMessage(JSON.parse(response._body).Message);
            this.modalRef.hide();
            this.reloadSearchPage();
            this.loading = false;
        }, error => {
            this.loading = false;
        })
    }

    reloadSearchPage(){
        if (this.constant.searchObject.searchSatus) {
            this.searchCalimObject = this.constant.searchObject;
            this.pagination.currentPage = this.searchCalimObject.PageNum;
            this.pagination.itemsPerPage = this.searchCalimObject.PageSize;
            this.tempSearchFilters = Object.assign({}, this.searchCalimObject);
            this.onSearchClick(this.searchCalimObject);
        } else {
            this.searchCalimObject = {
                'custName': '',
                'claimInitatorFromdate': moment().subtract(2, 'week').format('MM/DD/YYYY'),
                'claimInitatorTodate': moment().format('MM/DD/YYYY'),
                'claimTypeSelectedValue': '0',
                'CARNo': '',
                'invoiceNum': '',
                'claimStatusSelectedValue': '0',
                'claimCategorySelectedValue': '0',
                'searchSatus': false,
                'CreatedBy': JSON.parse(localStorage.getItem("userData")).UserId,
                'Role': '',
                'GlobalSerach':'',
                'LatestFiveClaims':"",
                'PageSize':10,
                'PageNum':1,
                'SortingColumn':"ClaimNo",
                'SortingOrder':"A",
                'Initiator':""
            };
            this.applySearch(this.searchCalimObject);
            this.sharedService.resetPreviousURL();
        }
    }
    getClaimCategory(): void {
        this.createnewclaimService.getExternalClaimCategory('', response => {
          if (response.StatusCode == "SUCCESS") {
            this.claimCategoryList = (response.Data) ? response.Data : [];
          }  
        }, error => { 
    
        });
    }
    getClaimStatusList(): void {
        this.createnewclaimService.getExternalClaimStatus('', response => {
          if (response.StatusCode == "SUCCESS") { 
            this.claimStatusList = (response.Data) ? response.Data : [];
          }
        }, error => { 
    
        });
    }
    getClaimTypes(): void {
        this.createnewclaimService.getClaimTypes('', response => {
          if (response.StatusCode == "SUCCESS") { 
            this.claimTypeList = (response.Data) ? response.Data : [];
            }
         
        }, error => { 
    
        });
    }
    getBrandList(): void {
        this.createnewclaimService.getBrandList('', response => {
            if (response.StatusCode == "SUCCESS") {
                this.brandList = (response.Data) ? response.Data : [];
            }
        }, error => {

        });
    }
    setBrandName(brand_id) {
        var brandName = '';
        if (this.brandList && this.brandList.length > 0) {
            this.brandList.forEach(element => {
                if (element.BrandID == brand_id)
                    brandName = element.BrandName;
            });
            return brandName;
        }
    }

    getComplaintCategory(): void {
        this.createnewclaimService.getComplaintCategory('', response => {
            if (response.StatusCode == "SUCCESS") {
                this.complaintCategoryList = (response.Data) ? response.Data : [];
            }
        }, error => {

        });
    }
    setComplaintCateegoryName(category_id) {
        var comp_cat_Name = '';
        if (this.complaintCategoryList && this.complaintCategoryList.length > 0) {
            this.complaintCategoryList.forEach(element => {
                if (element.ComplaintCategoryID == category_id)
                comp_cat_Name = element.ComplaintCategory;
            });
            return comp_cat_Name;
        }
    }

    getModeOfComplaintList(): void {
        this.createnewclaimService.getModeOfComplaintList('', response => {
            if (response.StatusCode == "SUCCESS") {
                this.modeOfComplaintList = (response.Data) ? response.Data : [];
            }
        }, error => {

        });
    }
    setModeOfComplaintName(category_id) {
        var mode_of_com_Name = '';
        if (this.modeOfComplaintList && this.modeOfComplaintList.length > 0) {
            this.modeOfComplaintList.forEach(element => {
                if (element.ModeofComplaintID == category_id)
                mode_of_com_Name = element.ModeofComplaint;
            });
            return mode_of_com_Name;
        }
    }
    setClaimTypeCode(claim_id) {
        var type_code = '';
        if (this.claimTypeList && this.claimTypeList.length > 0) {
            this.claimTypeList.forEach(element => {
                if (element.SectionID == claim_id)
                type_code = element.TypeCode;
            });
            return type_code;
        }
    }


}
