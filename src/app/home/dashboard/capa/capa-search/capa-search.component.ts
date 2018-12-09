import { Component, OnInit, ViewEncapsulation, ViewContainerRef, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { CapaService } from '../../../../services/home/capa.service'
import { CreatenewclaimService } from '../../../../services/home/createnewclaim.service';
import { DashboardService } from '../../../../services/home/dashboard.service';
import { Constant } from '../../../../utill/constants/constant';
import { IMyDpOptions } from 'mydatepicker';
import { DatePipe } from '@angular/common';
import { CreatecapaService } from '../../../../services/home/createcapa.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { SharedService } from '../../../../services/home/shared.service';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import * as moment from 'moment';

@Component({
    selector: 'app-capa-search',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './capa-search.component.html',
    styleUrls: ['./capa-search.component.css'],
    providers: [DatePipe]
})
export class CapaSearchComponent implements OnInit {
    modalRef: BsModalRef;
    radioModel = 'Middle';
    public modelConfigPopup:any;

  	public today = new Date();
  	public SBUList:any;
    public CountryList:any;
    public CAPAStatus:any;
    public CAPAFor:any;
    public isLevelOne:any;
    public isLevelTwo:any;
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

    public searchExpandCollapseText = 'Advanced Search';
    public advanceSearch = false;
    public updownArrow = 'icon-arrow-down';
    public loading = true;
    public data = [];
    // Table Start
    public isrecordsAvailable: any;
    public rowsOnPage = 10;
    public sortOrder = "asc";
    public sortBy = "daysOpen";
    public filterQuery = "";
    // Table End
    public withoutClaim:boolean;
	public minorClaim:boolean;
	public baseURL;
	public createWithoutClaimModel = 0;
    public minorClaimModel = '';
    public CapaMinorCarList:any;
    // CAPASearchModel
    public capaSearchViewObject:any;

    public tempSearchFilters:any;

    public sortingColumns = {
        CAPAId: true,
        CustomerName: true,
        CAPAInitiatedOn: true,
        CAPAStatus: true,
        DefectCode: true,
        CAPAFor: true
    }
    public pagination = {
        maxPages: 5,
        totalItems: 0,
        currentPage: 1,
        itemsPerPage: 10
    }

  	constructor(
	  	private router: Router,
	  	private activatedRoute: ActivatedRoute,
        private capaService:CapaService,
        private createcapaService: CreatecapaService,
	  	private createnewclaimService:CreatenewclaimService,
	  	private dashboardService: DashboardService,
	  	private constant: Constant,
	  	private toastr: ToastsManager,
	  	private vcr: ViewContainerRef,
	  	private datePipe: DatePipe,
        private modalService: BsModalService,
        private authService: AuthService,
        private sharedService: SharedService
  	){
        this.sharedService.emitChange({current_page: 'SEARCH_PAGE'});
	  	this.toastr.setRootViewContainerRef(vcr);
	    this.baseURL = this.constant.baseURL;
        let auth:any = authService.getAccessLevels('CLMRESCAPA');
        this.isLevelOne = auth.isLevelOne ? auth.isLevelOne : false;
        this.isLevelTwo = auth.isLevelTwo ? auth.isLevelTwo : false;
        if(!this.isLevelOne && !this.isLevelTwo) {
          this.router.navigate(['/404']);
        }
  	}

	ngOnInit() {
		this.initVar();
        let fromDate = new Date(+new Date - 12096e5);
        console.log(this.constant.searchCapaObject);
        localStorage.setItem('capa-load-from', 'capa');
		 if (this.constant.searchCapaObject.searchSatus) {
            this.capaSearchViewObject = this.constant.searchCapaObject;
            this.pagination.currentPage = this.capaSearchViewObject.PageNum;
            this.pagination.itemsPerPage = this.capaSearchViewObject.PageSize;
            this.tempSearchFilters = Object.assign({}, this.capaSearchViewObject);
            this.onSearchClick(this.capaSearchViewObject);
        } else {
            this.capaSearchViewObject = {
                'SearchString': '',
                'CapaInitiatedFrm': moment().subtract(2, 'week').format('MM/DD/YYYY'),
                'CapaInitiatedTo': moment().format('MM/DD/YYYY'),
                'CAPAFor': '0',
                'CAPANumber': '',
                'Status': '0',
                'searchSatus': false,
                'CustomerName': '',
                'DefectCode': '',
                'convetedFromdate':'',
                'convetedTodate':'',
                'PageSize':10,
                'PageNum':1,
                'SortingColumn':"CAPAFor",
                'SortingOrder':"A"
            }
            this.applySearch(this.capaSearchViewObject);
        }
        this.modelConfigPopup = {class: 'd-flex align-self-center modal-sm', ignoreBackdropClick: true};
	}

	initVar(){
        this.CapaMinorCarList = [];
		this.withoutClaim = false;
		this.getAllDropdownData();
        this.getCountryListDropdownData();
	}
	createWithoutClaim(sbu){
		if(sbu){
			let params = {
				ComplaintNumber : 0,
				IsCAPAValidating : false,
				SBUId : parseInt(sbu)
			}
			this.createUtilityModule(params, data=>{
				if(data){
					this.router.navigate(['CAPA', data], { relativeTo: this.activatedRoute.parent });
				}
			})
			this.withoutClaim = false;
		}else{
			this.toastr.error('Please select SBU', 'Failed', {
            	showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
        	});
		}
		this.createWithoutClaimModel = 0;
		//sbu = '';
	}
 	getAllDropdownData(): void {
	    this.createnewclaimService.getListCreateNewDropDowndata('', response => {
		    	console.log(response)
		    	let dataArray = (response.Data)?response.Data :{};
		    	this.SBUList  = (dataArray.SBUList)?dataArray.SBUList:[]
                //this.CountryList  = (dataArray.Country)?dataArray.Country:[]
                let tempObject  = (dataArray.Status)?dataArray.Status:[]
                this.CAPAFor = (dataArray.CustomClaimCategory)?dataArray.CustomClaimCategory:[]
                this.CAPAStatus = tempObject.filter(elm =>{
                    console.log(elm)
                   return ((elm.ClaimSatatusId != 5) && (elm.ClaimSatatusId != 6)&& (elm.ClaimSatatusId != 7))
                });

		    if(response.ResponseCode==413 || response.ResponseCode==414){
		    } else {
	      	}
	    }, error => {

	    });
  	}

  getCountryListDropdownData(): void {
      this.createnewclaimService.getCountryList('', response => {
        let dataArray = (response.Data) ? response.Data : {};
        this.CountryList = (dataArray) ? dataArray : []
        if (response.ResponseCode == 413 || response.ResponseCode == 414) {
        } else {
        }
      }, error => {

      });
  }

	createForMinorClaim(car){
		if(car){
			let params = {
				ComplaintNumber:car,
				IsCAPAValidating:true,
				SBUId:0
			}
			this.createUtilityModule(params, data=>{
				if(data){
					this.router.navigate(['CAPA', data], { relativeTo: this.activatedRoute.parent });
				}
			})
			this.minorClaim = false;
		} else{
			this.toastr.error('Please enter CAR Number', 'Failed', {
            	showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
        	});
		}
		this.minorClaimModel = '';
	}

	/*Common function for CAPA creation -- Start*/
	createUtilityModule(params,callback){
		this.dashboardService.createCapa(params, response => {
			console.log(response)
			if(response.Data){
				callback(response.Data)
			}else{
				this.toastr.error(response.ResponseMessage, 'Failed', {
	            	showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
	        	});
	        	callback('')
			}
		}, error => {
		    this.toastr.error('Internal Server Error', 'Failed', {
		        showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
		    });
		    callback('')
		});
	}
	/*Common function for CAPA creation -- End*/

    onEdit(selectedItem): void {
        localStorage.setItem('capa-load-from', 'capa');
        this.router.navigate(['CAPA', selectedItem.CAPANumber], { relativeTo: this.activatedRoute.parent });
    }

    applySearch(_searchFilters) {
        this.tempSearchFilters = Object.assign({}, _searchFilters);
        this.tempSearchFilters.PageNum = 1;
        this.pagination.currentPage = 1;
        this.onSearchClick(this.tempSearchFilters);
    }

    onSearchClick(_searchFilters): void {
        if (this.initiateDateValidate(_searchFilters.CapaInitiatedFrm, _searchFilters.CapaInitiatedTo)) {
            return;
        }
        this.constant.searchCapaObject = JSON.parse(JSON.stringify(_searchFilters));
        this.loading = true;
        _searchFilters.CapaInitiatedFrm  =  moment(_searchFilters.CapaInitiatedFrm).format('MM/DD/YYYY');
        _searchFilters.CapaInitiatedTo = moment(_searchFilters.CapaInitiatedTo).format('MM/DD/YYYY');
        this.constant.searchCapaObject.searchSatus = true;

        this.capaService.searchCapa(_searchFilters, response => {
            this.loading = false;
            if (response.ResponseCode == 413 || response.ResponseCode == 414) {
                window.location.href = this.constant.loginURL;
            } else if (response.ResponseCode === 200) {
                 this.data = (response.Data && response.Data.SearchResult) ? response.Data.SearchResult : [];
                 this.isrecordsAvailable = this.data;
                 this.rowsOnPage = this.data.length;
                 this.pagination.totalItems = (response.Data && response.Data.TotalRows) ? response.Data.TotalRows : 0;
                 this.pagination.itemsPerPage = _searchFilters.PageSize;
            } else {
                // this.onErrorToastMessage(response);
                this.toastr.error(response.Data,response.ResponseMessage, {
                    showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
                });
            }
        }, error => {
            this.loading = false;
            this.onErrorToastMessage(error);
        });
    }

    onResetClick(): void {
        let fromDate = new Date(+new Date - 12096e5);
        this.capaSearchViewObject = {
            'SearchString': '',
            'CapaInitiatedFrm': moment().subtract(2, 'week').format('MM/DD/YYYY'),
            'CapaInitiatedTo': moment().format('MM/DD/YYYY'),
            'CAPAFor': '0',
            'CAPANumber': '',
            'Status': '0',
            'CustomerName': '',
            'DefectCode': '',
            'searchSatus': false,
            'convetedFromdate':'',
            'convetedTodate':'',
            'PageSize':this.tempSearchFilters.PageSize,
            'PageNum':this.tempSearchFilters.PageNum,
            'SortingColumn':"CAPAFor",
            'SortingOrder':"A"
        };
        this.constant.searchCapaObject.searchSatus = true;
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

    //dropdownlist
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

    initiateDateValidate(_fromDate, _toDate): boolean {
        if(moment(_toDate).diff(moment(_fromDate)) < 0) {
            this.onValidateToastMessage("Initiation To Date must be greater than or equal to Initiation From Date");
            return true;
        }
        return false;
    }
    /*stateChangesStatus(): boolean {
        if (this.capaSearchViewObject.CapaInitiatedFrm != '' && this.capaSearchViewObject.CapaInitiatedTo != '' && this.capaSearchViewObject.CapaInitiatedFrm != null && this.capaSearchViewObject.CapaInitiatedTo != null) {
            let fromDate = this.formatDate(this.capaSearchViewObject.CapaInitiatedFrm);
            let toDate = this.formatDate(this.capaSearchViewObject.CapaInitiatedTo);
            if (fromDate > toDate) {
                this.onValidateToastMessage("Initiation To Date must be greater than or equal to Initiation From Date");
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }*/
    onValidateToastMessage(message): void {
        this.loading = false;
        this.toastr.error(message, '', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime });
    }
    onErrorToastMessage(message): void {
        this.loading = false;
        this.toastr.error(message, 'Failure!', { showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime });
    }

    createCapaForMinorClaim(template: TemplateRef<any>){
        this.minorClaim = true;
        this.loading = true;
        this.capaService.getCapaForMinorClaimList(response => {
            this.loading = false;
            if (response.ResponseCode == 413 || response.ResponseCode == 414) {
                window.location.href = this.constant.loginURL;
            } else if (response.ResponseCode == 200) {
                this.CapaMinorCarList = response.Data;
                this.modalRef = this.modalService.show(template, {class: 'd-flex align-self-center modal-sm minor-claim-modal', ignoreBackdropClick: true});
            }
        }, error => {
            this.loading = false;
            this.onErrorToastMessage(error);
        });
    }
}
