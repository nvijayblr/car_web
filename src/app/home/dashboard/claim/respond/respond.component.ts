import { Component, OnInit, ViewEncapsulation, ViewContainerRef, TemplateRef, IterableDiffers } from '@angular/core';
import { IMyDpOptions } from 'mydatepicker';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from 'assets/js/plugins/angular-2-dropdown-multiselect/src';
import { CreatenewclaimService } from '../../../../services/home/createnewclaim.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Constant } from '../../../../utill/constants/constant';
import { SharedService } from '../../../../services/home/shared.service';
import $ from 'jquery';
import { DatePipe ,Location} from '@angular/common';
import * as moment from 'moment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { DashboardService } from '../../../../services/home/dashboard.service';

@Component({
  selector: 'app-respond',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './respond.component.html',
  styleUrls: ['./respond.component.scss'],
  providers: [DatePipe]
})
export class RespondComponent implements OnInit {
  public disableFlag: boolean = false;
  public complcount = 0;
  public manuCount = 0;
  public defectcount = 0;
  claimstatusheader: any;
  public capaButtonStatus:number=0;
  // public stat= 0;
  val: string;
  public statusedit = 'false';
  private claimStatusList = [];
  // public statusList = [];
  private SBUList = [];
  private dropdownDistributionChannel = [];
  format = { add: 'Add', remove: 'Remove', all: '', none: '', };
  defectTypes: any;
  manuProcess: any;
  compClassification: any;
  public masterCartonBarcodeFileUploadDetail = [];
  public complianceFileUploadDetail = [];
  public palletTicketFileUploadDetail = [];
  public uploaderDefectiveDetail = [];
  public validmail = true;
  public users = [];
  public complaintClassification = [];
  public complaintClassificationTarget = [];
  public manufacturingProcess = [];
  public manufacturingProcessTarget = [];
  public defectType = [];
  public defectTypeTarget = [];
  public complianceTableData = [];
  dropdownSection: any;
  private complaintCategoryList: any;
  private brandList: any;
  private modeOfComplaintList: any;
  getDistChannel(arg0: any, arg1: any): any {
    throw new Error("Method not implemented.");
  }

  // dropdownSBU: any;
  public myDatePickerOptions: IMyDpOptions = {
    showTodayBtn: false,
    dateFormat: 'mm/dd/yyyy',
    firstDayOfWeek: 'mo',
    sunHighlight: true,
    inline: false,
    showClearDateBtn: false,
    alignSelectorRight: true,
    editableDateField: false,
    openSelectorOnInputClick: true
  };
  claimstatus: any;
  public modalRef: BsModalRef;
  public closedStatusId: number;
  public compliantNumber = '';
  public complaintNumber;
  public capadisplayId = 0;
  public CAPAButtonDisplayStatus = 0;
  public reviewedButtonStatus: boolean;
  public saveDraftStatus = true;
  public apiCallStatus = true;
  public responseFlag = false;
  public responseCloseConfirmWindow: string;
  public responseDropDownStatus: any;
  public loading = true;
  public showDeleteIcon = false;
  public custClaimTypeValue = '';
  public claimTypeList = [];
  public selectedClaimTypeName;
  public editableStatusBaisc = false;
  public responsedisplayId = 0;
  // public claimStatusResponse;
  private countryList = [];
  public countryObject = {
    'Type': '',
    'Symbol': '',
    'Threshold': '',
    'ContactFormat': '',
    'RegexString': []
  }
  mDropDownText: IMultiSelectTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Unselect all',
    checked: '- Selected',
    checkedPlural: '- Selected',
    searchPlaceholder: 'Find',
    searchEmptyResult: 'Nothing found...',
    searchNoRenderText: 'Type in search box to see results...',
    defaultTitle: 'Select',
    allSelected: 'All selected',
  };
  mDropDownSettings: IMultiSelectSettings = {
    dynamicTitleMaxItems: 1,
  };
  public createResponseObject: any = {
    'manfProcess': 'true',
    'compliantClass': 'true',
    'defectType': 'true',
    'custSelectCapa': 'true',
    'resSentEmailTo': [],
    'rDropDownStatus': '',
    'claimStatus': '',
    'complaintNumber': '',
    'ClaimResID': 0,
    'custQAReceivingDate': '',
    'custDateofReview': '',
    'custClaimStatuselectedValue': '6',
    'custQAManager': '',
    'custQAClaimAnalysis': '',
    'custContainmentActions': '',
    'custClaimAccepted': 'false',
    'custManufacturingProcess': 'false',
    'custDefectType': 'false',
    'custIssueCreditStatusResponse': 'false',
    'custPUnitCostFirstResponse': 0,
    'additionalCostFirstResponse': '',
    'custQuantityFisrtResponse': '',
    'custTotalCostFisrtResponse': 0,
    'custSectionFisrtLblResponse': '', // Accounts Payable
    'custReturnAutorizationStatusResponse': 'false',
    'custRAnoResponse': '',
    'custPUnitCostFirstResponseRA': 0,
    'custQuantityFisrtResponseRA': '',
    'custTotalCostFisrtResponseRA': 0,
    'custReplacementStatusResponse': 'false',
    'custPUnitCostSecondResponse': '',
    'custQuantitySecondResponse': '',
    'custTotalCostSecondResponse': 0,
    'custSectionSecondLblResponse': '', // Accounts Payable
    'custOtherStatusResponse': 'false',
    'custSectionOthersDescriptionResponse': '',
    'claimRespComplaints': [],
    'claimRespManufactureProcess': [],
    'claimRespDefectTypes': [],
    'containmentAction': '',
    'qaClaimAnalysis': ''
  };
  public createNewClaimObject = {
    'custComplaintNo': '',
    'InitiatorEmail': '',
    'custInvoiceNo': '',
    'custSBUSelectedValue': '0',
    'custClaimTypeSelectedValue': '',
    'custInitiator': '',
    'custInitiatorPhone': '',
    'custExtn': '',
    'CreatedDate': '',
    'ClosedDate': '',
    'typeofSubmit': '',
    'claimStatusID': '',
    'currency': '',
    'custInvoiceValue': '',
    'PONo': '',
    'SBUname': ""
  };
  public createNewClaimObjectCustomerDetails = {
    'custNameOfCustomer': '',
    'custCustomerNo': '',
    'custCountry': '',
    'custDistributionChannelSelectedValue': '0',
    'custContactPerson': '',
    'custNameOfFinalCust': '',
    'custCustomerPhone': '',
    'custExtn': '',
    'custEmail': '',
    'custModeOFComplaintSelectedValue': '0',
    'modeOfComplaintName':"",
    'distributionChannelName': ""
  };
  public createNewClaimObjectClaimDetails: any = {
    // 'custSelectCapa': 'true',
    'custComplaintStage': '',
    'custComplaintDescri': '',
    'custDefectiveSampleReceivedStatus': 'false',
    'custDefectivePicturesOfSampleReceivedStatus': 'false',
    'custDefectivePicturesOfSampleReceivedDate': '',
    'custSelectClaimType': false,
    'custActionStatus': false,
    'custIssueCreditStatus': false,
    'custReturnAutorizationStatus': false,
    'custReplacementStatus': false,
    'custOtherStatus': false,
    'custRAno': '',
    'custPUnitCostFirstRAno': '',
    'custQuantityFisrtRAno': '',
    'custTotalCostFisrtRAno': 0,
    'custPUnitCostFirst': '',
    'additionalCostFirst': '',
    'custQuantityFisrt': '',
    'custTotalCostFisrt': 0,
    'custSectionFisrtLbl': '', // Accounts Payable
    'custSectionFisrt': '0',
    'custPUnitCostSecond': '',
    'custQuantitySecond': '',
    'custTotalCostSecond': 0,
    'custSectionSecondLbl': '', // Accounts Payable
    'custSectionSecond': '0',
    'custPUnitCostOthers': '',
    'custQuantityOthers': 0,
    'custTotalCostOthers': 0,
    'custSectionOthersLbl': '',
    'custSectionOthers': '0',
    'custSectionOthersDescription': '',
    'custNotes': '',
    'custFeedbackImprovement': '',
    'palletTicketAttachments': '',
    'ClaimAttachments': '',
    'masterCartonBarcodeAttachments': '',
    'invoiceSelection': '',
    'custSentEmailTo': '',
    'CAPAFlag': false,
    'TotalClaims': null,
    'TotalAmount': null
  };
  public createNewClaimObjectProductDetails: any = {
    'custBrandSelectedValue': '',
    'custSKUNo': '',
    'custProductDescription': '',
    'custManufacturedBy': '',
    'custDeliveryNo': '',
    'custNoOfDeliveredItems': 0,
    'custNoOfDefectedItems': 0,
    'custDeliveryDate': '',
    'custComplaintCategorySelectedValue': '0',
    'custDrawingNumberRev': '',
    'custPalletTicket': '',
    'custcompliance': '',
    'custMasterCartonBarcode': '',
    'internalSKUNo': '',
    'complaintCategoryName':"",
    'brandName':""
  };
  public activeTab = 'block-1';
  public disableClaim = true;
  public iterableDifferCC:any;
  public iterableDifferMP:any;
  public iterableDifferDT:any;
  public firstIteration:number=0;
  public CAPAButtonStatus:number=0;
  public claimButtonStatus:number=0;
  public isClaimLevelOne:any;
  public isClaimLevelTwo:any;
  public isCapaLevelOne:any;
  public isCapaLevelTwo:any;
  public responsibleDepartmentList = [];
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private createnewclaimService: CreatenewclaimService,
    private toastr: ToastsManager,
    private vcr: ViewContainerRef,
    public constant: Constant,
    private datePipe: DatePipe,
    private modalService: BsModalService,
    private sharedService: SharedService,
    private _iterableDiffers: IterableDiffers,
    private location:Location,
    private authService: AuthService,
    private dashboardService: DashboardService
  ) {
    this.sharedService.emitChange({ current_page: 'RESPOND_PAGE' });
    this.toastr.setRootViewContainerRef(vcr);
    this.iterableDifferCC = this._iterableDiffers.find([]).create(null);
    this.iterableDifferMP = this._iterableDiffers.find([]).create(null);
    this.iterableDifferDT = this._iterableDiffers.find([]).create(null);
    
    let auth:any = authService.getAccessLevels('CLMCR');
    this.isClaimLevelOne = auth.isLevelOne ? auth.isLevelOne : false;
    this.isClaimLevelTwo = auth.isLevelTwo ? auth.isLevelTwo : false;

    auth = authService.getAccessLevels('CLMRESCAPA');
    this.isCapaLevelOne = auth.isLevelOne ? auth.isLevelOne : false;
    this.isCapaLevelTwo = auth.isLevelTwo ? auth.isLevelTwo : false;
  }

  ngDoCheck() {
    let ccTargetChanges = this.iterableDifferCC.diff(this.complaintClassificationTarget);
    let mpTargetChanges = this.iterableDifferMP.diff(this.manufacturingProcessTarget);
    let dtTargetChanges = this.iterableDifferDT.diff(this.defectTypeTarget);
    if (ccTargetChanges || mpTargetChanges || dtTargetChanges) {
      this.stateChangesStatusResponse();
      this.firstIteration = this.firstIteration + 1;
    }
    
  }

  ngOnInit() {

    this.val = (this.router.url.split('/')[4]);
    this.getAllDropdownData();
    var today = new Date();
    this.createResponseObject.custDateofReview = moment(today).format('MM/DD/YYYY');
    
  }
  getClaimDetails(val): void {
    this.loading = true;
    // api call
    this.createnewclaimService.getClaimDetails(val, response => {
      this.loading = false;
      // if (response.ResponseCode === 200) {
        if (response.Data !== null) {
        this.showDeleteIcon = false;
        // this.stat=response.Data.ClaimDetails.Status.StatusID;

        this.dataBindinViewMode(response.Data);
        
          //this.complaintNumber=response.Data.ComplaintNumber;
          if (response.Data.ClaimDetails !== undefined) {
            this.claimTypeChange(response.Data.ClaimDetails.ClaimTypeId)
          }
        }
      // }
       else {
        this.toastr.error('Internal Server Error', 'Failure', {
          showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
        });
      }
    }, error => {
      this.toastr.error('Internal Server Error', 'Failure', {
        showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
      });
    });
  }

 setPreviousURL(){
    this.sharedService.setPreviousURL(this.router.url);
  }

  viewClaim(){
    this.setPreviousURL();
    this.router.navigate(['Viewclaim', this.val], { relativeTo: this.activatedRoute.parent });
  }
  createOrViewCAPA(){
    //localStorage.setItem('capa-load-from', 'claim');
    if(this.capadisplayId==0){
        this.loading = true;
        let params = {
            ComplaintNumber:this.createNewClaimObject.custComplaintNo,
            IsCAPAValidating:false,
            SBUId:0 //no sbu
        }
        this.dashboardService.createCapa(params, response => {
            this.loading = false;
            this.setPreviousURL();
            this.router.navigate(['CAPA', response.Data], { relativeTo: this.activatedRoute.parent });

        }, error => {
            this.toastr.error('Internal Server Error', '', {
                showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
            });
        });

    } else {
      this.setPreviousURL();
      this.router.navigate(['CAPA',  this.capadisplayId], { relativeTo: this.activatedRoute.parent });
    }

  }
  addCustomEmail = (term) => ({ Address: term, name: term });

  validateEmail(_emailsList) {
    this.validmail = true;
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (_emailsList.length !== 0) {
      for (let i = 0; i < _emailsList.length; i++) {
        if (!regex.test(_emailsList[i])) {
          this.validmail = false;
          return;
        }
      }
    }

    return this.validmail;
  }

  Input() {

  }
  output() {

  }
  goSearchview(): void {

    let url=this.sharedService.getPreviousURL();
    if (url ==null)
      this.router.navigate(['landing']);
    else
      this.router.navigate([url]);
    //this.location.back();
   // this.router.navigate(['dashboard'])
  }
  datePickerFormat(dateString): any {
    let dd = {};
    if (dateString) {
      let newDate = new Date(dateString);
      dd = { date: { year: newDate.getFullYear(), month: newDate.getMonth() + 1, day: newDate.getDate() } };
    }
    return dd;
  }
  formatDate(dateString): any {
    let dd = '';
    if (dateString) {
      if (dateString.date !== undefined) {
        dd = this.datePipe.transform(new Date(dateString.date.year, dateString.date.month - 1, dateString.date.day), 'yyyy-MM-dd');
      } else {
        dd = dateString;
      }
    }
    return dd;
  }
  getRespondViewDetails(val): void {
    // this.getClassificationofComplaint();
    // this.getManufacturingProcess();
    // this.getDefectType();
    this.loading = true;
    // api call
    this.createnewclaimService.getRespondDetails(val, response => {
      this.loading = false;
      if (response.StatusCode === "SUCCESS") {
        this.capadisplayId=response.Data.CAPAID==null?0:response.Data.CAPAID;
        this.capaButtonStatus=response.Data.CAPAButtonStatus!=null?response.Data.CAPAButtonStatus:0;
        this.claimButtonStatus=response.Data.ClaimButtonStatus!=null?response.Data.ClaimButtonStatus:0;
        this.createResponseObject.resSentEmailTo=response.Data.sendEmailsTo?response.Data.sendEmailsTo.split(','):[];
        for(var i=0;i<this.createResponseObject.resSentEmailTo.length;i++){
          var temp={};
          temp["Address"] = this.createResponseObject.resSentEmailTo[i];
          temp["Id"] = 2;
          temp["Name"] = ''
          //this.validateemail(temp["Address"]);
          this.users.push(temp);
        }

        this.getMailList();
        this.showDeleteIcon = false;
        this.dataBindinRespondViewMode(response.Data, val);
        if (response.Data !== null) {
          if (response.Data.ClaimDetails !== undefined) {
            this.claimTypeChange(response.Data.ClaimDetails.ClaimTypeId)
          }
        }
      } else {
        this.toastr.error('Internal Server Error', 'Failure', {
          showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
        });
      }
    }, error => {
      this.toastr.error('Internal Server Error', 'Failure', {
        showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
      });
    });
  }
  // getCountryListDropdownData(): void {
  //   this.loading = true;
  //   this.createnewclaimService.getCountryList('', response => {
  //     let dataArray = (response.Data) ? response.Data : {};
  //     this.countryList = (dataArray) ? dataArray : [];
  //     this.populateCurrency();
  //   }, error => {
  //     this.loading = false;
  //   });
  // }

  getClassificationofComplaint(): void {
    // this.loading = true
    this.complaintClassification = [];
    this.createnewclaimService.getClassificationOfComplaint('', response => {
      let dataArray = (response.Data) ? response.Data : [];
      this.getManufacturingProcess();

      this.compClassification = JSON.parse(JSON.stringify(dataArray));
      for (let item of dataArray) {
        if (this.complaintClassification.indexOf(item.Name) == -1) {
          this.complaintClassification.push(item.Name);
        }
      }
      // this.loading = false;
    }, error => {
      // this.loading = false;
    });
  }

  getManufacturingProcess(): void {
    // this.loading = true
    this.manufacturingProcess = [];
    this.createnewclaimService.getManufacturingProcess('', response => {
      let dataArray = (response.Data) ? response.Data : [];
      this.getDefectType();

      this.manuProcess = JSON.parse(JSON.stringify(dataArray));
      for (let item of dataArray) {
        if (this.manufacturingProcess.indexOf(item.Name) == -1) {
          this.manufacturingProcess.push(item.Name);
        }
      }
      // this.loading = false;
    }, error => {
      // this.loading = false;
    });
  }

  getDefectType(): void {
    // this.loading = true;
    this.defectType = [];
    this.createnewclaimService.getDefectType('', response => {
      let dataArray = (response.Data) ? response.Data : [];
      this.getClaimDetails(this.val);
      this.getRespondViewDetails(this.val);

      this.defectTypes = JSON.parse(JSON.stringify(dataArray));
      for (let item of dataArray) {
        if (this.defectType.indexOf(item.Name) == -1) {
          this.defectType.push(item.Name);
        }
      }
      // this.loading = false;
    }, error => {
      // this.loading = false;
    });
  }



  getAllDropdownData(): void {
    this.loading = true;
    // this.getClaimStatusList(); // new
    // this.getClaimTypes(); // new
    this.getSBUList(); // new
    // this.getBrandList(); // new
    // this.getComplaintCategory(); // new
    // this.getModeOfComplaintList(); // new
    // this.getResponsibleDeptList(); // new
    // this.getCountryList(); // new
    this.getMailList(); // new
    // this.getResponsibleDeptList(); // new

    
    // this.getClassificationofComplaint();
    // this.getManufacturingProcess();
    // this.getDefectType();
    // setTimeout(() => {
      // this.getClaimDetails(this.val);
      // this.getRespondViewDetails(this.val);
    // }, 500)  
    
  }

  getMailList() {
    this.createnewclaimService.getEmailList(data => {
      this.users = (this.users == [] ? ((data) ? data : []) : this.users.concat(data));
      // this.loading = false;
    }, error => {
      // this.loading = false;

    })
  }
  populateCurrency() {
    let self = this;
    var tempArray = (this.countryList) ? this.countryList : []
    let ctryID: any = self.createNewClaimObjectCustomerDetails.custCountry;
    self.createNewClaimObjectCustomerDetails.custCountry = (ctryID != '') ? ctryID : tempArray[0].CountryID;
    let tempObject = tempArray.find(row => {
      return (row.CountryID == self.createNewClaimObjectCustomerDetails.custCountry)
    });
    if (tempObject) {
      let temp = tempObject.RegexString.split(','), inputMask: any = [];
      temp.map(function (val, i) {
        if (val == '/\\d/' || val == /\\d/) {
          inputMask[i] = /\d/;
        } else {
          inputMask[i] = val;
        }
      });
      this.countryObject = {
        'Symbol': tempObject.CurrencySymbol,
        'Type': tempObject.Currency,
        'Threshold': tempObject.Threshold,
        'ContactFormat': tempObject.ContactFormat,
        'RegexString': inputMask
      }
    }
    // this.loading = false;
  }

  dataBindinRespondViewMode(data, val): void {
    this.complcount = data.ClaimRespComplaints.length;
    this.manuCount = data.ClaimRespManufactureProcess.length;
    this.defectcount = data.ClaimRespDefectTypes.length;
    this.reviewedButtonStatus = !data.ReviewedBtnStatus;
    this.saveDraftStatus = !data.SaveBtnStatus;
    this.disableFlag = (data.CompliantNumber != null && data.ClaimStatusID == 4) ? true : false;
    this.claimStatusList.filter((item) => {
      if (Number(item.ClaimSatatusId) == Number(data.ClaimStatusID)) {

        this.claimstatusheader = item.ClaimSatus;
      }
    })

    this.claimstatus = this.setClaimStatusName(data.ClaimStatusID); //data.ClaimStatusID;
    
    if (data.ClaimStatusID == 7) {
      this.statusedit = 'true';
      if(this.claimStatusList){
        
        this.claimStatusList = this.claimStatusList.filter((element) => {
        if (element.ClaimSatatusId == 4 || element.ClaimSatatusId == 7) 
          return  true
          else 
          return false          
       
      })
      }
    }    

    var compBind = [];
    for (var i = 0; i < data.ClaimRespComplaints.length; i++) {
      for (var j = 0; j < this.compClassification.length; j++) {
        if (data.ClaimRespComplaints[i] == this.compClassification[j].Id) {
          compBind.push(this.compClassification[j].Name);
        }
      }
    }

    var manuProcessLists = [];
    if (data.ClaimRespManufactureProcess && data.ClaimRespManufactureProcess.length) {
      for (var i = 0; i < data.ClaimRespManufactureProcess.length; i++) {
        for (var j = 0; j < this.manuProcess.length; j++) {
          if (data.ClaimRespManufactureProcess[i] == this.manuProcess[j].Id) {
            manuProcessLists.push(this.manuProcess[j].Name);
          }
        }
      }
    }

    var defectLists = [];
    for (var i = 0; i < data.ClaimRespDefectTypes.length; i++) {
      for (var j = 0; j < this.defectTypes.length; j++) {
        if (data.ClaimRespDefectTypes[i] == this.defectTypes[j].Id) {
          defectLists.push(this.defectTypes[j].Name);
        }
      }
    }

    if (data.CompliantNumber != null) {
      this.createResponseObject = {
        'custSelectCapa': data.CAPAFlag ? (data.CAPAFlag).toString() : 'false',
        'resSentEmailTo': (data.sendEmailsTo) ? data.sendEmailsTo.split(',') : [],
        'claimStatus': data.ClaimStatusID ? data.ClaimStatusID : '',
        'complaintNumber': this.val,
        'rDropDownStatus': data.rDropDownStatus ? data.rDropDownStatus : '',
        'ClaimResID': data.ClaimResID ? data.ClaimResID : '',
        'custQAReceivingDate': moment(data.QAReceiveDate).format('MM/DD/YYYY'),
        'custDateofReview': moment(data.QAReviewDate).format('MM/DD/YYYY'),
        'custClaimStatuselectedValue': data.ClaimStatusID,
        'custQAManager': data.QAManager,
        'custQAClaimAnalysis': data.QAAnalysisDesc,
        'custContainmentActions': data.ContainmentDesc,
        'custClaimAccepted': 'false',
        'custManufacturingProcess': 'false',
        'custDefectType': 'false',
        'custIssueCreditStatusResponse': 'false',
        'custPUnitCostFirstResponse': data.IssueCreditUnitCost,
        'additionalCostFirstResponse': data.IssueCreditAdditionalCost,
        'custQuantityFisrtResponse': data.IssueCreditQuantity,
        'custTotalCostFisrtResponse': data.IssueCreditTotalCost,
        'custSectionFisrtLblResponse': (this.responsibleDepartmentList && this.responsibleDepartmentList.length > 0) ? this.responsibleDepartmentList[0].Name : '', // Accounts Payable
        'custReturnAutorizationStatusResponse': 'false',
        'custRAnoResponse': data.RANumber,
        'custPUnitCostFirstResponseRA': data.ReturnAuthUnitCost,
        'custQuantityFisrtResponseRA': data.ReturnAuthQuantity,
        'custTotalCostFisrtResponseRA': data.ReturnAuthTotalCost,
        'custReplacementStatusResponse': 'false',
        'custPUnitCostSecondResponse': data.ReplaceUnitCost,
        'custQuantitySecondResponse': data.ReplaceQuantity,
        'custTotalCostSecondResponse': data.ReplaceTotalCost,
        'custSectionSecondLblResponse': (this.responsibleDepartmentList && this.responsibleDepartmentList.length > 0) ? this.responsibleDepartmentList[0].Name : '', // Accounts Payable
        'custOtherStatusResponse': 'false',
        'custSectionOthersDescriptionResponse': data.Remarks,
        'claimRespComplaints': compBind,
        'claimRespManufactureProcess': manuProcessLists,
        'claimRespDefectTypes': defectLists,
        'containmentAction': data.ContainmentDesc,
        'qaClaimAnalysis': data.QAAnalysisDesc
      };
      this.complaintClassificationTarget = compBind;
      if (this.complaintClassificationTarget.length > 0) {
        this.createResponseObject.compliantClass = 'true';
      } else {
        this.createResponseObject.compliantClass = 'false';
      }
      this.manufacturingProcessTarget = manuProcessLists;
      if (this.manufacturingProcessTarget.length > 0) {
        this.createResponseObject.manfProcess = 'true';
      } else {
        this.createResponseObject.manfProcess = 'false';
      }
      this.defectTypeTarget = defectLists;
      if (this.defectTypeTarget.length > 0) {
        this.createResponseObject.defectType = 'true';
      } else {
        this.createResponseObject.defectType = 'false';
      }
      this.responseDropDownStatus = String(data.rDropDownStatus);
      if (this.createResponseObject.custClaimStatuselectedValue == '3') {
        this.createResponseObject.custClaimStatuselectedValue = '6';
      }
      if (this.createResponseObject.custQAManager == '') {
        this.createResponseObject.custQAManager = JSON.parse(localStorage.getItem("userData")).FullName;//1706
      }
      if (data.ManuProcessFlag == 'Y') {
        this.createResponseObject.custManufacturingProcess = 'true';
      }
      if (data.DefectTypeFlag == 'Y') {
        this.createResponseObject.custDefectType = 'true';
      }
      if (data.AcceptedFlag == 'Y') {
        this.createResponseObject.custClaimAccepted = 'true';
      }
      if (data.IssueCreditFlag == 'Y') {
        this.createResponseObject.custIssueCreditStatusResponse = 'true';
      }
      if (data.ReturnAuthFlag == 'Y') {
        this.createResponseObject.custReturnAutorizationStatusResponse = 'true';
      }
      if (data.ReplaceFlag == 'Y') {
        this.createResponseObject.custReplacementStatusResponse = 'true';
      }
      if (data.RemarksFlag == 'Y') {
        this.createResponseObject.custOtherStatusResponse = 'true';
      }
    } else {
      this.createResponseObject.complaintNumber = val;
      this.createResponseObject.custQAReceivingDate = moment(data.QAReceiveDate).format('MM/DD/YYYY');
      this.createResponseObject.custQAManager = JSON.parse(localStorage.getItem("userData")).FullName;//1706
    }
    
  }
  dataBindinViewMode(data): void {
    // this.loading = true;
    const date = new Date();
    // if(data.ClaimDetails.Status.StatusID==7){
    //   this.statusedit='true';
    // }
    this.claimstatusheader = this.setClaimStatusName(data.ClaimDetails.ClaimStatusID); // data.ClaimDetails.Status.StatusName;
    if (data.ClaimAttachments != null && data.ClaimAttachments.length > 0) {
      if (data.ClaimAttachments.length > 0) {
        this.uploaderDefectiveDetail = [];
        for (let i = 0; i < data.ClaimAttachments.length; i++) {
          this.uploaderDefectiveDetail.push({ 'name': data.ClaimAttachments[i].FileName, 'path': data.ClaimAttachments[i].FilePath, 'AttachmentID': data.ClaimAttachments[i].AttachmentID })
        }
      }
    }

    if (data.PalletTicketAttachments != null && data.PalletTicketAttachments.length > 0) {
      if (data.PalletTicketAttachments.length > 0) {
        this.palletTicketFileUploadDetail = [];
        for (let i = 0; i < data.PalletTicketAttachments.length; i++) {
          this.palletTicketFileUploadDetail.push({ 'name': data.PalletTicketAttachments[i].FileName, 'path': data.PalletTicketAttachments[i].FilePath, 'AttachmentID': data.PalletTicketAttachments[i].AttachmentID })
        }
      }
    }

    if (data.MasterCartonBarcodeAttachments != null && data.MasterCartonBarcodeAttachments.length > 0) {
      if (data.MasterCartonBarcodeAttachments.length > 0) {
        this.masterCartonBarcodeFileUploadDetail = [];
        for (let i = 0; i < data.MasterCartonBarcodeAttachments.length; i++) {
          this.masterCartonBarcodeFileUploadDetail.push({ 'name': data.MasterCartonBarcodeAttachments[i].FileName, 'path': data.MasterCartonBarcodeAttachments[i].FilePath, 'AttachmentID': data.MasterCartonBarcodeAttachments[i].AttachmentID })
        }
      }
    }
    if (data.ComplainceClaimAttachment != null) {
      this.complianceFileUploadDetail = [];
      this.complianceFileUploadDetail.push({ 'name': data.ComplainceClaimAttachment.FileName, 'path': data.ComplainceClaimAttachment.FilePath, 'AttachmentID': data.ComplainceClaimAttachment.AttachmentID })
    }

    this.createNewClaimObject = {
      'custComplaintNo': data.ComplaintNumber,
      'custInvoiceNo': data.ClaimDetails.InvoiceNumber,
      'custSBUSelectedValue': data.ClaimDetails.SBUId,
      'custClaimTypeSelectedValue': data.ClaimDetails.ClaimTypeId,
      'custInitiator': data.InitiatorDetails.InitiatorName, //1706
      'custInitiatorPhone': data.InitiatorDetails.InitiatorPhone,
      'custExtn': data.InitiatorDetails.Extension,
      'CreatedDate': (data.ClaimDetails.CreatedDate) ? moment(data.ClaimDetails.CreatedDate).format('MM/DD/YYYY') : '',
      'ClosedDate': (data.ClaimDetails.ClosedDate) ? moment(data.ClaimDetails.ClosedDate).format('MM/DD/YYYY') : null,
      'typeofSubmit': '',
      'claimStatusID': '',
      'InitiatorEmail': '',
      'currency': data.ClaimDetails.InvoiceCurrency,
      'custInvoiceValue': data.ClaimDetails.InvoiceValue,
      'PONo': data.ClaimDetails.PONumber,
      'SBUname': this.setSBUName(data.ClaimDetails.SBUId)
    };

    this.custClaimTypeValue = this.setClaimType(data.ClaimDetails.ClaimTypeId); //data.ClaimDetails.ClaimType.TypeName;
    this.createNewClaimObjectCustomerDetails = {
      'custNameOfCustomer': data.CustomerDetails.CustomerName,
      'custCustomerNo': data.CustomerDetails.CustomerNumber,
      'custCountry': data.CustomerDetails.Country.CountryName, 
      'custDistributionChannelSelectedValue': data.CustomerDetails.DistributionChannelID, 
      'custContactPerson': data.CustomerDetails.ContactPerson,
      'custNameOfFinalCust': data.CustomerDetails.FinalCustomerName,
      'custCustomerPhone': data.CustomerDetails.CustomerPhone,
      'custExtn': data.CustomerDetails.Extn,
      'custEmail': data.CustomerDetails.Email,
      'custModeOFComplaintSelectedValue': data.CustomerDetails.ModeOfComplaintID, // data.CustomerDetails.ComplaintMode.ModeName // New change
      'modeOfComplaintName' : this.setModeOfComplaintName(data.CustomerDetails.ModeOfComplaintID),
      'distributionChannelName' : this.setDistributionChannelName(data.CustomerDetails.DistributionChannelID)
    };
    // this.populateCurrency()
    if (data.ProductDetails.DeliveryDate == null) {
      data.ProductDetails.DeliveryDate = '';
    }
    this.createNewClaimObjectProductDetails = {
      'custBrandSelectedValue': data.ProductDetails.BrandID, // data.ProductDetails.Brand.BrandName,
      'custSKUNo': data.ProductDetails.SKUNumber,
      'custProductDescription': data.ProductDetails.ProductDescription,
      'custManufacturedBy': data.ProductDetails.ManufacturedBy,
      'custDeliveryNo': data.ProductDetails.DeliveryNumber,
      'custNoOfDeliveredItems': data.ProductDetails.NoOfDeliveredItems,
      'custNoOfDefectedItems': data.ProductDetails.NoOfDefectedItems,
      'custDeliveryDate': (data.ProductDetails.DeliveryDate) ? moment(data.ProductDetails.DeliveryDate).format('MM/DD/YYYY') : '',
      'custComplaintCategorySelectedValue': data.ProductDetails.ComplaintCategoryID, //ComplaintCategory.ComplaintCatName, // new change
      'custDrawingNumberRev': data.ProductDetails.DrawingNumberRev,
      'custPalletTicket': data.ProductDetails.PalletteTicketID,
      'custcompliance': data.ProductDetails.ComplianceTicketID,
      'custMasterCartonBarcode': data.ProductDetails.MasterCartonBarcodeID,
      'internalSKUNo': data.ProductDetails.InternalSKU,
      'complaintCategoryName': this.setComplaintCategoryName(data.ProductDetails.ComplaintCategoryID),
      'brandName':this.setBrandName(data.ProductDetails.BrandID)
    };

    this.createNewClaimObjectClaimDetails = {
      'custComplaintStage': data.ActionRequested.ComplaintStage,
      'custComplaintDescri': data.ActionRequested.ComplaintDesc,
      'custDefectiveSampleReceivedStatus': data.ActionRequested.IsDefSamplesReceived,
      'custDefectivePicturesOfSampleReceivedStatus': data.ActionRequested.IsPicDefSamplesReceived,

      'custDefectivePicturesOfSampleReceivedDate': (data.ActionRequested.ExpDateRcvSamples) ? moment(data.ActionRequested.ExpDateRcvSamples).format('MM/DD/YYYY') : '',
      'custSelectClaimType': (data.ClaimDetails.IsMajorClaim), 
      'custActionStatus': (data.ActionRequested.IsCommertialAction),
      'custIssueCreditStatus': (data.ActionRequested.IsIssueCredit),
      'custReturnAutorizationStatus': (data.ActionRequested.IsRA),
      'custReplacementStatus': (data.ActionRequested.IsReplacement),
      'custOtherStatus': (data.ActionRequested.IsRemarks),
      'custRAno': data.ActionRequested.RANumber,
      'custPUnitCostFirstRAno': data.ActionRequested.ReturnAuthUnitCost,
      'custQuantityFisrtRAno': data.ActionRequested.ReturnAuthQuantity,
      'custTotalCostFisrtRAno': data.ActionRequested.ReturnAuthTotalCost,
      'custPUnitCostFirst': data.ActionRequested.ICUnitCost,
      'additionalCostFirst': data.ActionRequested.IssueCreditAdditionalCost,
      'custQuantityFisrt': data.ActionRequested.ICQuantity,
      'custTotalCostFisrt': data.ActionRequested.ICTotalCost,
      'custSectionFisrtLbl':  '', // Accounts Payable
      'custSectionFisrt': '0',
      'custPUnitCostSecond': data.ActionRequested.ReplacementUnitCost,
      'custQuantitySecond': data.ActionRequested.ReplacementQuantity,
      'CAPAFlag': data.ActionRequested.CAPAFlag,
      'custTotalCostSecond': data.ActionRequested.ReplacementTotalCost,
      'custSectionSecondLbl':  '', // Accounts Payable
      'custSectionSecond': '0',
      'custPUnitCostOthers': '',
      'custQuantityOthers': 0,
      'custTotalCostOthers': 0,
      'custSectionOthersLbl': '',
      'custSectionOthers': '0',
      'custNotes': data.ClaimDetails.Notes,
      'custFeedbackImprovement': data.ClaimDetails.Feedback,
      'custSentEmailTo': (data.ClaimDetails.sendEmailsTo) ? data.ClaimDetails.sendEmailsTo : '',
      'custSectionOthersDescription': data.ActionRequested.Remarks,
      'palletTicketAttachments': data.ClaimDetails.PalletTicketAttachments,
      'ClaimAttachments': data.ClaimDetails.ClaimAttachments,
      'masterCartonBarcodeAttachments': data.ClaimDetails.MasterCartonBarcodeAttachments,
      'invoiceSelection': '',
      'TotalClaims': (data.ActionRequested) ? data.ActionRequested.TotalClaims : '',
      'TotalAmount': (data.ActionRequested) ? data.ActionRequested.TotalAmount : '',
    };
    this.createNewClaimObjectClaimDetails.custSectionFisrtLbl = this.getResponsibleDeptValue(data.ActionRequested.ICResponsibleDepartmentId);
    this.createNewClaimObjectClaimDetails.custSectionSecondLbl = this.getResponsibleDeptValue(data.ActionRequested.ReplacementResponsibleDepartmentId);


    this.createNewClaimObject.claimStatusID = data.ClaimDetails.ClaimStatusID;
    if (this.createResponseObject.custPUnitCostFirstResponse == 0) {
      this.createResponseObject.custPUnitCostFirstResponse = (this.createNewClaimObjectClaimDetails.custPUnitCostFirst) ? this.createNewClaimObjectClaimDetails.custPUnitCostFirst : 0;
    }
    if (this.createResponseObject.custQuantityFisrtResponse == '') {
      this.createResponseObject.custQuantityFisrtResponse = this.createNewClaimObjectClaimDetails.custQuantityFisrt;
    }
    if (this.createResponseObject.custTotalCostFisrtResponse == 0) {
      this.createResponseObject.custTotalCostFisrtResponse = this.createNewClaimObjectClaimDetails.custTotalCostFisrt;
    }
    if (this.createResponseObject.custPUnitCostSecondResponse == '') {
      this.createResponseObject.custPUnitCostSecondResponse = this.createNewClaimObjectClaimDetails.custPUnitCostSecond;
    }
    if (this.createResponseObject.custQuantitySecondResponse == '') {
      this.createResponseObject.custQuantitySecondResponse = this.createNewClaimObjectClaimDetails.custQuantitySecond;
    }

    if (this.createResponseObject.custPUnitCostFirstResponseRA == 0) {
      this.createResponseObject.custPUnitCostFirstResponseRA = (this.createNewClaimObjectClaimDetails.custPUnitCostFirstRAno) ? this.createNewClaimObjectClaimDetails.custPUnitCostFirstRAno : 0;
    }
    if (this.createResponseObject.custQuantityFisrtResponseRA === '') {
      this.createResponseObject.custQuantityFisrtResponseRA = this.createNewClaimObjectClaimDetails.custQuantityFisrtRAno;
    }
    if (this.createResponseObject.additionalCostFirstResponse == '') {
      this.createResponseObject.additionalCostFirstResponse = this.createNewClaimObjectClaimDetails.additionalCostFirst;
    }
    if (!this.createResponseObject.custRAnoResponse) {
      this.createResponseObject.custRAnoResponse = this.createNewClaimObjectClaimDetails.custRAno;
    }
    if (!this.createResponseObject.custSectionOthersDescriptionResponse) {
      this.createResponseObject.custSectionOthersDescriptionResponse = this.createNewClaimObjectClaimDetails.custSectionOthersDescription;
    }
    this.valuechangeIssueCredtResponse(undefined);
    this.valuechangeReplacementResponse(undefined);
    this.valuechangeIssueCredtResponseRA(undefined);
    // this.loading = false;
  }

  claimTypeChange(selectedValue): void {
    this.valuechangeReplacement("");
    this.valuechangeIssueCredt("");
    if (this.claimTypeList !== undefined) {
      this.apiCallStatus = true;
      for (let i = 0; i < this.claimTypeList.length; i++) {
        if (this.claimTypeList[i].SectionID === Number(selectedValue)) {
          this.selectedClaimTypeName = this.claimTypeList[i].Section;
          if (this.selectedClaimTypeName === 'Internal') {
            this.createNewClaimObjectClaimDetails.custActionStatus = false;
            $('#actionRequested').attr('disabled', true);
            $('#noActionNeeded').attr('disabled', true);
          } else {
            $('#actionRequested').attr('disabled', false);
            $('#noActionNeeded').attr('disabled', false);
          }
        }
      }
    }
  }

  responseFormChange(flag) {
    if (flag && this.createResponseObject.custClaimStatuselectedValue == '7') {
      this.reviewedButtonStatus = false;
    }
  }

  stateChangesStatus(): void {
    this.apiCallStatus = true;
    this.reviewedButtonStatus = false;
  }

  updateStatusChange(status, models) {
    if (this.closedStatusId == status) {
      this.responseCloseConfirmWindows(models);
    }
  }

  rClaimAcceptedChange(status) {
    this.createResponseObject.custIssueCreditStatusResponse = status;
    this.createResponseObject.custReturnAutorizationStatusResponse = status;
    this.createResponseObject.custReplacementStatusResponse = status;
    this.createResponseObject.custOtherStatusResponse = status;
  }

  onIssueCreditSelectResponse(value): void {
    if (value === 'false') {
      this.createResponseObject.custPUnitCostFirstResponse = 0;
      this.createResponseObject.additionalCostFirstResponse = '0';
      this.createResponseObject.custQuantityFisrtResponse = '0';
      this.createResponseObject.custTotalCostFisrtResponse = 0;
    } else {
      this.createResponseObject.custPUnitCostFirstResponse = this.createNewClaimObjectClaimDetails.custPUnitCostFirst;
      this.createResponseObject.additionalCostFirstResponse = this.createNewClaimObjectClaimDetails.additionalCostFirst;
      this.createResponseObject.custQuantityFisrtResponse = this.createNewClaimObjectClaimDetails.custQuantityFisrt;
      this.createResponseObject.custTotalCostFisrtResponse = this.createNewClaimObjectClaimDetails.custTotalCostFisrt;
    }
  }

  valuechangeIssueCredt(e): void {
    this.apiCallStatus = true;
    const total: any = (Number(this.createNewClaimObjectClaimDetails.custPUnitCostFirst) * Number(this.createNewClaimObjectClaimDetails.custQuantityFisrt)) + Number(this.createNewClaimObjectClaimDetails.additionalCostFirst)
    if (this.custClaimTypeValue !== 'Compliance') {
      this.createNewClaimObjectClaimDetails.custTotalCostFisrt = total.toFixed(4);
    }

  }

  valuechangeIssueCredtResponse(e): void {
    if (this.createNewClaimObject.custClaimTypeSelectedValue != '2') {
      const total: any = (Number(this.createResponseObject.custPUnitCostFirstResponse) * Number(this.createResponseObject.custQuantityFisrtResponse)) + Number(this.createResponseObject.additionalCostFirstResponse)
      this.createResponseObject.custTotalCostFisrtResponse = total.toFixed(4);
    }
  }

  onReurnAuthSelectResponse(value): void {
    if (value === 'false') {
      this.createResponseObject.custRAnoResponse = '';
      this.createResponseObject.custPUnitCostFirstResponseRA = 0;
      this.createResponseObject.custQuantityFisrtResponseRA = '0';
      this.createResponseObject.custTotalCostFisrtResponseRA = 0;
    } else {
      this.createResponseObject.custRAnoResponse = this.createNewClaimObjectClaimDetails.custRAno;
      this.createResponseObject.custPUnitCostFirstResponseRA = this.createNewClaimObjectClaimDetails.custPUnitCostFirstRAno;
      this.createResponseObject.custQuantityFisrtResponseRA = this.createNewClaimObjectClaimDetails.custQuantityFisrtRAno;
      this.createResponseObject.custTotalCostFisrtResponseRA = this.createNewClaimObjectClaimDetails.custTotalCostFisrtRAno;
    }
  }

  valuechangeIssueCredtResponseRA(e): void {
    const total: any = Number(this.createResponseObject.custPUnitCostFirstResponseRA) * Number(this.createResponseObject.custQuantityFisrtResponseRA)
    this.createResponseObject.custTotalCostFisrtResponseRA = total.toFixed(4);
  }

  onReplacementSelectResponse(value): void {
    if (value === 'false') {
      this.createResponseObject.custPUnitCostSecondResponse = '';
      this.createResponseObject.custQuantitySecondResponse = '';
      this.createResponseObject.custTotalCostSecondResponse = 0;
    }
    this.createResponseObject.custReplacementStatusResponse = value;
  }

  valuechangeReplacement(e): void {
    this.apiCallStatus = true;
    const total: any = Number(this.createNewClaimObjectClaimDetails.custPUnitCostSecond) * Number(this.createNewClaimObjectClaimDetails.custQuantitySecond)
    this.createNewClaimObjectClaimDetails.custTotalCostSecond = total.toFixed(4);
  }

  valuechangeReplacementResponse(e): void {
    const total: any = Number(this.createResponseObject.custPUnitCostSecondResponse) * Number(this.createResponseObject.custQuantitySecondResponse)
    this.createResponseObject.custTotalCostSecondResponse = total.toFixed(4);
  }

  onOtherStatusSelectResponse(value): void {
    if (value == 'false') {
      this.createResponseObject.custSectionOthersDescriptionResponse = '';
    }
    this.createResponseObject.custOtherStatusResponse = value;
  }

  stateChangesStatusResponse(): void {
    if (this.firstIteration > 0) {
      if (this.complaintClassificationTarget.length !== this.complcount) {
        this.reviewedButtonStatus = false;
      }
      if (this.defectTypeTarget.length !== this.defectcount) {
        this.reviewedButtonStatus = false;
      }
      if (this.manufacturingProcessTarget.length !== this.manuCount) {
        this.reviewedButtonStatus = false;
      }
      this.reviewedButtonStatus = false;
    }
  }
  unitCostValidation(price): boolean {
    var regex = /^(?:\d*\.\d{1,4}|\d+)$/;
    return regex.test(price);
  }

  onSuccessToastMessage(msg): void {
    this.loading = false;
    this.toastr.clearAllToasts();
    this.toastr.success(msg, 'Success!', {
      showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
    });
  }

  onRespondCancel(): void {
    this.router.navigate(['dashboard']);
  }

  onRespondSave(type, resForm): void {

    var dateValidation = true;
    var today = new Date();
    this.toastr.clearAllToasts();
    this.responseCloseConfirmWindow = ''
    if (this.createResponseObject.custQAReceivingDate != "") {

      if (typeof this.createResponseObject.custQAReceivingDate != 'object') {
        var custDateofReview = new Date(this.formatDate(this.createResponseObject.custDateofReview)).getTime();
        var custQAReceivingDate = new Date(this.createResponseObject.custQAReceivingDate).getTime();
      } else {
        var custDateofReview = new Date(this.formatDate(this.createResponseObject.custDateofReview)).getTime();
        var custQAReceivingDate = new Date(this.formatDate(this.createResponseObject.custQAReceivingDate)).getTime();
      }

      if ((custDateofReview < custQAReceivingDate) && (type == 'reviewed' || type == 'closed')) {
        dateValidation = false;
        this.toastr.warning('Date of Review should be after the QA Receiving Date', 'Failed', {
          showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
        });

        this.createResponseObject.claimStatus = (type == 'reviewed') ? 7 : 4;
        return
      }

      let tempDate = new Date(custDateofReview);
      if ((new Date(tempDate.toDateString()) > new Date(today.toDateString())) && (type == 'reviewed' || type == 'closed')) {
        dateValidation = false;
        this.toastr.warning("Date of Review should be before today's Date", 'Failed', {
          showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
        });
        this.createResponseObject.claimStatus = (type == 'reviewed') ? 7 : 4;
        return
      }
    }
    if (dateValidation) {
      if (type == 'reviewed' || type == 'closed' || type == 'save') {
        var createResponseObject = this.createResponseObject; if (typeof this.createResponseObject.custQAReceivingDate !== 'object') {
          var custDateofReview = new Date(this.formatDate(this.createResponseObject.custDateofReview)).getTime();
          var custQAReceivingDate = new Date((this.createResponseObject.custQAReceivingDate)).getTime();
        } else {
          var custDateofReview = new Date(this.formatDate(this.createResponseObject.custDateofReview)).getTime();
          var custQAReceivingDate = new Date(this.formatDate(this.createResponseObject.custQAReceivingDate)).getTime();
        }

        if (this.createResponseObject.compliantClass == 'true') {
          this.createResponseObject.claimRespComplaints = [];
          for (var i = 0; i < this.complaintClassificationTarget.length; i++) {
            for (var j = 0; j < this.compClassification.length; j++) {
              if (this.complaintClassificationTarget[i] == this.compClassification[j].Name &&
                this.createResponseObject.claimRespComplaints.indexOf(this.compClassification[j].Id) == -1) {
                this.createResponseObject.claimRespComplaints.push(this.compClassification[j].Id);
              }
            }
          }
        } else {
          this.createResponseObject.claimRespComplaints = [];
          this.complaintClassificationTarget = [];
        }

        if (this.createResponseObject.manfProcess == 'true') {
          this.createResponseObject.claimRespManufactureProcess = [];
          for (var i = 0; i < this.manufacturingProcessTarget.length; i++) {
            for (var j = 0; j < this.manuProcess.length; j++) {
              if (this.manufacturingProcessTarget[i] == this.manuProcess[j].Name &&
                this.createResponseObject.claimRespManufactureProcess.indexOf(this.manuProcess[j].Id) == -1) {
                this.createResponseObject.claimRespManufactureProcess.push(this.manuProcess[j].Id);
              }
            }
          }
        } else {
          this.createResponseObject.claimRespManufactureProcess = [];
          this.manufacturingProcessTarget = [];
        }

        if (this.createResponseObject.defectType == 'true') {
          this.createResponseObject.claimRespDefectTypes = [];
          for (var i = 0; i < this.defectTypeTarget.length; i++) {
            for (var j = 0; j < this.defectTypes.length; j++) {
              if (
                this.defectTypeTarget[i] == this.defectTypes[j].Name &&
                this.createResponseObject.claimRespDefectTypes.indexOf(this.defectTypes[j].Id) == -1
              ) {
                this.createResponseObject.claimRespDefectTypes.push(this.defectTypes[j].Id);
              }
            }
          }
        } else {
          this.createResponseObject.claimRespDefectTypes = [];
          this.defectTypeTarget = [];
        }

        // this.createResponseObject.claimRespComplaints=this.complaintClassificationTarget;
        if (this.complaintClassificationTarget.length == 0 && (type == 'reviewed' || type == 'closed')) {
          this.toastr.warning('Please select a Classification of Complaint.', 'Failed', {
            showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
          });
          this.createResponseObject.claimStatus = (type != 'reviewed') ? 7 : 4;
          return
        }

        if (this.createResponseObject.custClaimAccepted == 'true' &&
          this.createResponseObject.custIssueCreditStatusResponse != 'true' &&
          this.createResponseObject.custReturnAutorizationStatusResponse != 'true' &&
          this.createResponseObject.custReplacementStatusResponse != 'true' &&
          this.createResponseObject.custOtherStatusResponse != 'true' &&
          (type == 'reviewed' || type == 'closed')
        ) {

          this.toastr.warning('Please select a Claim Accepted value.', 'Failed', {
            showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
          });
          this.createResponseObject.claimStatus = (type != 'reviewed') ? 7 : 4;
          return
        }

        if ((parseInt(this.createResponseObject.custQuantityFisrtResponse) > this.createNewClaimObjectProductDetails.custNoOfDefectedItems) && (type == 'reviewed' || type == 'closed')) {

          this.toastr.warning("Issue Credit - Quantity should be less than No. of defective items", 'Failed', {
            showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
          });
          this.createResponseObject.claimStatus = (type != 'reviewed') ? 7 : 4;
          return
        }

        if ((parseInt(this.createResponseObject.custQuantityFisrtResponseRA) > this.createNewClaimObjectProductDetails.custNoOfDefectedItems) && (type == 'reviewed' || type == 'closed')) {
          this.toastr.warning("Return Authorization - Quantity should be less than No. of defective items", 'Failed', {
            showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
          });
          this.createResponseObject.claimStatus = (type != 'reviewed') ? 7 : 4;
          return
        }

        if ((this.createResponseObject.custQuantitySecondResponse > this.createNewClaimObjectProductDetails.custNoOfDefectedItems) && (type == 'reviewed' || type == 'closed')) {
          this.toastr.warning("Replacement - Quantity should be less than No. of defective items", 'Failed', {
            showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
          });
          this.createResponseObject.claimStatus = (type != 'reviewed') ? 7 : 4;
          return
        }

        /*if(this.createResponseObject.resSentEmailTo && this.createResponseObject.resSentEmailTo.length && !this.validmail && (type =='reviewed' || type =='closed')){
            this.toastr.error("Please enter valid email Ids", 'Failure', {
            showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
          });
          return
        }*/

        if (!this.validateEmail(this.createResponseObject.resSentEmailTo) && (type == 'reviewed' || type == 'closed')) {
          this.toastr.clearAllToasts();
          this.toastr.warning("Please enter valid email Ids", 'Failed', {
            showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
          });
          this.createResponseObject.claimStatus = (type != 'reviewed') ? 7 : 4;
          return
        }


        if (this.createResponseObject.custPUnitCostFirstResponse && !this.unitCostValidation(this.createResponseObject.custPUnitCostFirstResponse)) {
          this.toastr.warning('Unit cost is invalid in Issue Credit', 'Failed', {
            showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
          });
          this.createResponseObject.claimStatus = (type != 'reviewed') ? 7 : 4;
          return
        }

        if (this.createResponseObject.additionalCostFirstResponse && !this.unitCostValidation(this.createResponseObject.additionalCostFirstResponse)) {
          this.toastr.warning('Additional cost is invalid in Issue Credit', 'Failed', {
            showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
          });
          this.createResponseObject.claimStatus = (type != 'reviewed') ? 7 : 4;
          return
        }

        if (this.createResponseObject.custPUnitCostSecondResponse && !this.unitCostValidation(this.createResponseObject.custPUnitCostSecondResponse)) {
          this.toastr.warning('Unit cost is invalid in Replacement', 'Failed', {
            showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
          });
          this.createResponseObject.claimStatus = (type != 'reviewed') ? 7 : 4;
          return
        }

        if (this.createResponseObject.custPUnitCostFirstResponseRA && !this.unitCostValidation(this.createResponseObject.custPUnitCostFirstResponseRA)) {
          this.toastr.warning('Unit cost is invalid in Return Authorization', 'Failed', {
            showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
          });
          this.createResponseObject.claimStatus = (type != 'reviewed') ? 7 : 4;
          return
        }

        this.loading = true;
        this.responseDropDownStatus = (type == 'reviewed' || type == 'closed') ? '1' : '0';
        this.disableFlag = (type == 'closed') ? true : false
        this.createResponseObject.resSentEmailTo = (this.createResponseObject.resSentEmailTo) ? (this.createResponseObject.resSentEmailTo).toString() : [];
        createResponseObject.custQAReceivingDate = this.formatDate(createResponseObject.custQAReceivingDate);
        if (type == 'reviewed')
          createResponseObject.custDateofReview = moment(today).format('MM/DD/YYYY');
        else
          createResponseObject.custDateofReview = this.formatDate(createResponseObject.custDateofReview);

        this.createResponseObject.custClaimStatuselectedValue = (type == 'reviewed') ? '7' : this.createResponseObject.custClaimStatuselectedValue;
        this.createResponseObject.custClaimStatuselectedValue = (type == 'closed') ? '4' : this.createResponseObject.custClaimStatuselectedValue;
        this.createResponseObject.custClaimStatuselectedValue = (type == 'save') ? '6' : this.createResponseObject.custClaimStatuselectedValue;
        //  this.createResponseObject.qaClaimAnalysis=
        // response service call
        // this.loading = true;
        this.createnewclaimService.createRespondDetails(createResponseObject, response => {
          this.loading = false;
          if (response.ResponseCode == 413 || response.ResponseCode == 414) {
            window.location.href = this.constant.loginURL;
            // this.loading = false;
          } else if (response.ResponseCode === 200) {
            //window.location.reload();
            this.editableStatusBaisc = true;
            if (type == "closed") {
              this.createNewClaimObject.ClosedDate = moment(new Date()).format('MM/DD/YYYY')
            } else {
              this.createNewClaimObject.ClosedDate = null;
            }
            if (type == "reviewed") {
              this.reviewedButtonStatus = true;
              this.saveDraftStatus = false;
              this.createResponseObject.claimStatus = 7;
            }
            this.createResponseObject.resSentEmailTo = (this.createResponseObject.resSentEmailTo).split(',')
            this.onSuccessToastMessage(response.Data.ResponseMessage);
            this.getRespondViewDetails(this.val);
            
            // window.location.reload();
          } else {
            this.toastr.warning(response.ResponseMessage, 'Failed', {
              showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
            });
            this.disableFlag = false;
          }
        }, error => {
          this.loading = false;
        });
      } else {
        this.responseFlag = true;
      }
    }
  }

  onCancelClick() {
    this.router.navigate(['dashboard'])
  }

  ngAfterViewInit() {
    this.onAnchorClick(1, true);
  }

  onAnchorClick(_id: any, initLoaded?) {
    let headerNav: any = document.querySelector("#fixed-nav-header");
    let footerNav: any = document.querySelector(".footer-fixed");
    let scrollablePage: any = document.querySelector("#scrollable-page");
    let lastBlock: any = document.querySelector(".block.last");
    let pageHeight: any = $(window).height();
    scrollablePage.style.paddingTop = (headerNav.offsetHeight) + "px";
    let top: any = 0;
    let block: any;
    for (let i = 1; i < _id; i++) {
      block = document.querySelector("#block-" + i);
      top = top + block.offsetHeight;
    }
    this.activeTab = "block-" + _id;
    document.body.scrollTop = document.documentElement.scrollTop = top;

    /*Activate navigation when scroll the page*/
    function onScroll(event) {
      var scrollPos = document.documentElement.scrollTop + headerNav.offsetHeight + 10;
      $('#tabHeader a').each(function () {
        var currLink = $(this);
        if (currLink.attr("data-target")) {
          var refElement = $(currLink.attr("data-target"));
          if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
            $('#tabHeader a').removeClass("active");
            currLink.addClass("active");
          } else {
            currLink.removeClass("active");
          }
        }
      });
    }

    if (initLoaded) {
      let footerHeight = footerNav ? footerNav.offsetHeight : 50;
      lastBlock.style.minHeight = (pageHeight - (headerNav.offsetHeight + footerHeight) - 10) + 'px';
      document.removeEventListener('scroll', onScroll);
      document.addEventListener('scroll', onScroll);
    }
  }

  showPalletUploadModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'd-flex align-self-center modal-md', ignoreBackdropClick: true });
  }

  complianceFilePopUpView(uploadTemplate: TemplateRef<any>, uploadViewTemplate: TemplateRef<any>): void {
    this.loading = true;
    // api call
    this.createnewclaimService.getAttachmentsCompliance(this.createNewClaimObject.custComplaintNo, response => {
      this.loading = false;
      if (response.ResponseCode == 413 || response.ResponseCode == 414) {
        window.location.href = this.constant.loginURL;
      } else if (response.ResponseCode === 200) {
        if (response.Data.length) {
          this.modalRef = this.modalService.show(uploadViewTemplate, { class: 'd-flex align-self-center modal-xl', ignoreBackdropClick: true });
          this.complianceTableData = response.Data;
        } else {
          this.modalRef = this.modalService.show(uploadTemplate, { class: 'd-flex align-self-center modal-lg', ignoreBackdropClick: true });
        }
      } else {
        this.toastr.error(response.ResponseMessage, 'Failed', {
          showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
        });
      }
    }, error => {

    });
  }

  showComplianceUploadPopUp(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'd-flex align-self-center modal-md', ignoreBackdropClick: true });
  }

  showfileUploaderDefectivPopUp(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'd-flex align-self-center modal-md', ignoreBackdropClick: true });
  }

  showFileMasterCartonUploadModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'd-flex align-self-center modal-md', ignoreBackdropClick: true });
  }
  responseCloseConfirmWindows(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'd-flex align-self-center modal-sm', ignoreBackdropClick: true });
  }
  // responseCloseConfirmWindowModal
  openfile(sURL): void {
    if (sURL !== undefined) {
      window.open(sURL);
    }
  }

  getResponsibleDeptList(): void {
    this.createnewclaimService.getResponsibleDeptList('', response => {
      let dataArray = (response.Data) ? response.Data : [];
      this.responsibleDepartmentList = (dataArray) ? dataArray : [];
      this.getCountryList();
      if(this.responsibleDepartmentList && this.responsibleDepartmentList.length > 0)
      this.setResponsibleDeptField();
    }, error => { });
  }

  setResponsibleDeptField(){ // set the field value as the first value from the array
    this.createResponseObject.custSectionFisrtLblResponse = this.responsibleDepartmentList[0].Name;
    this.createResponseObject.custSectionSecondLblResponse = this.responsibleDepartmentList[0].Name;
    this.createNewClaimObjectClaimDetails.custSectionFisrtLbl = this.responsibleDepartmentList[0].Name;
    this.createNewClaimObjectClaimDetails.custSectionSecondLbl = this.responsibleDepartmentList[0].Name;
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
setClaimStatusName(status_id) {
  var statusName = '';
  if (this.claimStatusList && this.claimStatusList.length > 0) {
    this.claimStatusList.forEach(element => {
      if (element.ClaimSatatusId == status_id)
        statusName = element.ClaimSatus;
    });
    return statusName;
  }
}
getClaimStatusList(): void {
  this.createnewclaimService.getExternalClaimStatus('', response => {
    if (response.StatusCode == "SUCCESS") { 
      this.claimStatusList = (response.Data) ? response.Data : [];
      this.getClaimTypes();
    }
    this.claimStatusList.forEach(element => {
      if (element.ClaimSatus == "Closed")
        this.closedStatusId = element.ClaimSatatusId;
    });
  }, error => { 

  });
}
getSBUList(): void {
  this.createnewclaimService.getSBUs('', response => {
    if (response.StatusCode == "SUCCESS") {
      this.SBUList = (response.Data) ? response.Data : [];
      this.createNewClaimObject.custSBUSelectedValue = (this.SBUList.length ==1 )?this.SBUList[0].EntityID: '0';
      this.getDistributionChannels(this.createNewClaimObject.custSBUSelectedValue,'0');
    }
   
  }, error => { 

  });
}
setBrandName(brand_id){
  var brandName = '';
  if (this.brandList && this.brandList.length > 0) {
    this.brandList.forEach(element => {
      if (element.BrandID == brand_id)
      brandName = element.BrandName;
    });
    return brandName;
  }
}
setDistributionChannelName(channel_id){
  var channelName = '';
  if (this.dropdownDistributionChannel && this.dropdownDistributionChannel.length > 0) {
    this.dropdownDistributionChannel.forEach(element => {
      if (element.DistributionChannelID == channel_id)
      channelName = element.DistributionChannel;
    });
    return channelName;
  }
}
setModeOfComplaintName(complaint_id){
  var modeOfCompName = '';
  if (this.modeOfComplaintList && this.modeOfComplaintList.length > 0) {
    this.modeOfComplaintList.forEach(element => {
      if (element.ModeofComplaintID == complaint_id)
      modeOfCompName = element.ModeofComplaint;
    });
    return modeOfCompName;
  }
}
setComplaintCategoryName(category_id){
  var categoryName = '';
  if (this.complaintCategoryList && this.complaintCategoryList.length > 0) {
    this.complaintCategoryList.forEach(element => {
      if (element.ComplaintCategoryID == category_id)
      categoryName = element.ComplaintCategory;
    });
    return categoryName;
  }
}
setSBUName(sbu_id){
  var sbuName = '';
  if (this.SBUList && this.SBUList.length > 0) {
    this.SBUList.forEach(element => {
      if (element.SBUId == sbu_id)
      sbuName = element.SBUName;
    });
    return sbuName;
  }
}

getDistributionChannels(sbu_id, value) {
  // if (sbu_id) {
    this.dropdownDistributionChannel = [];
    this.createnewclaimService.getDistributionChannel(sbu_id, response => {
      if (response.StatusCode == "SUCCESS") {
        this.dropdownDistributionChannel = (response.Data) ? response.Data : [];
        this.createNewClaimObjectCustomerDetails.custDistributionChannelSelectedValue =
          (this.dropdownDistributionChannel.length == 1) ? this.dropdownDistributionChannel[0].DistributionChannelID : value;
        //  this.createNewClaimObjectCustomerDetails.distributionChannelName = this.setDistributionChannelName(this.createNewClaimObjectCustomerDetails.custDistributionChannelSelectedValue);
        this.getClaimStatusList();
      }

    }, error => {

    })
  // }
}
getClaimTypes(): void {
  this.createnewclaimService.getClaimTypes('', response => {
    if (response.StatusCode == "SUCCESS") { 
      // this.dropdownSection = (response.Data) ? response.Data : []; 
      this.claimTypeList = (response.Data) ? response.Data : [];
      this.getBrandList();
      // if(this.claimtypeselected){
      //   let self = this;
      //   let dropdownSectionList:any = this.dropdownSection.filter(item=>{
      //     return(self.claimtypeselected == item.SectionID)
      //   });
      //   if(dropdownSectionList.length == 0){
      //     this.toastr.error('Unauthorized access.', 'Failed!', {
      //       showCloseButton: true, maxShown: 1
      //     });
      //     setTimeout(()=>{
      //       this.router.navigate(['/login']);
      //     }, 2000)
      //     return;
      //   }
      // }
    }
   
  }, error => { 

  });
}



getBrandList(): void {
  this.createnewclaimService.getBrandList('', response => {
    if (response.StatusCode == "SUCCESS") {
      this.brandList = (response.Data) ? response.Data : [];
      this.getComplaintCategory();
    }  
  }, error => { 

  });
}

getComplaintCategory(): void {
  this.createnewclaimService.getComplaintCategory('', response => {
    if (response.StatusCode == "SUCCESS") { 
      this.complaintCategoryList = (response.Data) ? response.Data : [];
      this.getModeOfComplaintList(); 
    }
  }, error => { 

  });
}

getModeOfComplaintList(): void {
  this.createnewclaimService.getModeOfComplaintList('', response => {
    if (response.StatusCode == "SUCCESS") { 
      this.modeOfComplaintList = (response.Data) ? response.Data : [];
      this.getResponsibleDeptList();
    }
  }, error => { 

  });
}
getCountryList(): void {
  this.createnewclaimService.getCountryList('', response => {
    let dataArray = (response.Data) ? response.Data : {};
    this.countryList = (dataArray) ? dataArray : [];
    this.populateCurrency();
    this.getClassificationofComplaint();
    
  }, error => {

  });
}
setClaimType(claim_type_id){
  var claim_type = '';
  if (this.claimTypeList && this.claimTypeList.length > 0) {
    this.claimTypeList.forEach(element => {
      if (element.SectionID == claim_type_id)
      claim_type = element.Section;
    });
    return claim_type;
  }
}



}
