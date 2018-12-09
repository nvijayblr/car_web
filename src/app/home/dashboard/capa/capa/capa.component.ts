import { Component, OnInit, ViewEncapsulation, ViewContainerRef, AfterViewInit, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { IMyDpOptions } from 'mydatepicker';
import { DialogComponent } from '../../../../common/dialog/dialog.component';
import { Languageconstant } from '../../../../utill/constants/languageconstant';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router, ActivatedRoute, Params } from '@angular/router';
import $ from 'jquery';
import { DatePipe } from '@angular/common';
import { Constant } from '../../../../utill/constants/constant';
import { FileUploader } from 'ng2-file-upload';
import { CreatecapaService } from '../../../../services/home/createcapa.service';
import { CreatenewclaimService } from '../../../../services/home/createnewclaim.service';
import { LocationStrategy,Location } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { AuthService } from '../../../../services/auth/auth.service';
import { SharedService } from '../../../../services/home/shared.service';

import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';

import * as moment from 'moment';

@Component({
  selector: 'app-capa',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './capa.component.html',
  styleUrls: ['./capa.component.scss'],
  providers: [DatePipe]
})
export class CapaComponent implements OnInit, AfterViewInit {
  uploadAttachmentId: any;
  files: any;
  public isLevelOne:any;
  public isClaimLevelOne:any;
  public isClaimLevelTwo:any;
  public fyeFlag:any = true;;
  public fyeLength:any = 0;;
  public actionStatus:boolean;
  public capaActionStatus:any;
  public isLevelTwo:any;
  public CountryList: any;
  public addContainment = 'false';
  public addCause = 'false';
  public addCorrection = 'false';
  public addStandardization = 'false';
  public addHorizontalDeployment = 'false';
  public submitClick = false;
  public fieldnumber = 0;
  public departments;
  public brandList;
  public questions:any;
  public fiveWhyObject:any;
  public answers;
  public custPalletTicket = '';
  public fishboneSelected = 'false';
  public whySelected = 0;
  public value: 'true';
  public capadetails: {};
  public uploaderCAPASampleAttach: FileUploader = new FileUploader({ url: '' });
  public URL = '';
  public CAPAFileUploadDetail = [];
  public uploadFileName = '';
  public uploadFilePath = '';
  public currentClaimId = '';
  public currentCAPAId = '';
  public loading = true;
  public currentstatus = '';
  public causeId = 1;
  public placeholderShow:boolean;
  public today = new Date();
  public CapaProcessType;
  public users=[];
  public validmail = true;
	public activeTab = 'block-1';
  public minDate: Date;
  public responseButtonStatus:number=0;
  public claimButtonStatus:number=0;
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
    disableUntil: {
      year: this.today.getFullYear(),
      month: this.today.getMonth() + 1,
      day: this.today.getDate() - 1
    }
  };

  public capaCreateObject = {
    SendEmailsToString: '',
    SendEmailsTo: [],
    DateSelected: '',
    carNo: '',
    RcaNo: '',
    IrNo: '',
    customerName: '',
    country: 1,
    email: '',
    brand: '',
    productDescription: '',
    commercialCode: '',
    deliveredItemsNo: '',
    defectedItemsNo: '',
    drawingNo: '',
    complaintDescription: '',
    primaryInvestigation: '',
    complaintValid: 'true',
    inspectionRef: '',
    concernedDepartment: '',
    compensationDetails: '',
    defectCode: '',
    resolutionLead: '',
    action: [],
    function: '',
    response: '',
    actionDate: '',
    cause: '',
    causeAction: '',
    value: null,
    fileAttachedFishbone: '',
    correctiveAction: '',
    correctiveFunction: '',
    correctiveResponse: '',
    correctiveDate: '',
    standardizationdocwithNoRevision: '',
    standardizationFunction: '',
    standardizationResponse: '',
    standardizationDate: '',
    horizontalAction: '',
    horizontalFunction: '',
    horizontalResponse: '',
    horizontalDate: '',
    financeAccepted: 'true',
    leaderApproval: 'true',
    verificationAction: '',
    verifiedBy: '',
    correctionAction: [],
    CustomerResponse: [],
    PermanentCorrectiveAction: [],
    DocumentStandardisation: [],
    HorizontalDeployment: [],
    CAPADetailsID: '',
    answersDetectionFailure: [],
    answersOccuranceFailure: [],
    problemStatement: '',
    problemStatementnotEditted: '',
    closeDate: '',
    FiveWhy:[]
  }
  Arr = Array; //Array type captured in a variable
  num: number = 0;
  causecount: number = 0;
  correctioncount: number = 0;
  standardizationcount: number = 0;
  horizontalDeploymentcount: number = 0;
  public modalRef: BsModalRef;
  constructor(
    private createcapaService: CreatecapaService,
    private createnewclaimService: CreatenewclaimService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastsManager,
    private vcr: ViewContainerRef,
    public constant: Constant,
    public authService: AuthService,
    private changeRef: ChangeDetectorRef,
    private sharedService: SharedService,
    private modalService: BsModalService,
    private location: Location
  ) {
    this.sharedService.emitChange({current_page: 'CAPA_PAGE'});
    this.toastr.setRootViewContainerRef(vcr);
    let auth:any = authService.getAccessLevels('CLMCR');
    this.isClaimLevelOne = auth.isLevelOne ? auth.isLevelOne : false;
    this.isClaimLevelTwo = auth.isLevelTwo ? auth.isLevelTwo : false;
    console.log(" Inside CapaComponent ClaimLevelOne:" +this.isClaimLevelOne +" ClaimLevel Two: "+ this.isClaimLevelTwo);
    auth = authService.getAccessLevels('CLMRESCAPA');
    this.isLevelOne = auth.isLevelOne ? auth.isLevelOne : false;
    this.isLevelTwo = auth.isLevelTwo ? auth.isLevelTwo : false;
    if(!this.isLevelOne && !this.isLevelTwo) {
      this.router.navigate(['/404']);
    }
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
  }

  ngOnInit() {
    this.capaActionStatus = [];
    this.loading = true;
    this.actionStatus = false;
    this.placeholderShow = false
    if (localStorage.getItem("userData") == null) {
      const link = this.constant.loginURL;
      window.location.href = link;
    }
    this.getDepartmentDropdownData();
    this.getBrandList();
    this.getAllDropdownData();
    this.getCountryListDropdownData();
    this.getActionStatus();
    this.getAnalysisQuestions();
    //this.getMailList();
    this.currentCAPAId = (this.router.url.split('/') [4]);
    this.getAnswers(this.currentCAPAId);
    window.scrollTo(0, 0);
    this.fiveWhyObject = [];
    this.capaCreateObject = {
      SendEmailsToString: '',
      SendEmailsTo: [],
      DateSelected: '',
      carNo: '',
      RcaNo: '',
      IrNo: '',
      customerName: '',
      country: 1,
      email: '',
      brand: '',
      productDescription: '',
      commercialCode: '',
      deliveredItemsNo: '',
      defectedItemsNo: '',
      drawingNo: '',
      complaintDescription: '',
      primaryInvestigation: '',
      complaintValid: 'true',
      inspectionRef: '',
      concernedDepartment: '',
      compensationDetails: '',
      defectCode: '',
      resolutionLead: '',
      action: [],
      function: '',
      response: '',
      actionDate: '',
      cause: '',
      causeAction: '',
      value: null,
      fileAttachedFishbone: '',
      correctiveAction: '',
      correctiveFunction: '',
      correctiveResponse: '',
      correctiveDate: '',
      standardizationdocwithNoRevision: '',
      standardizationFunction: '',
      standardizationResponse: '',
      standardizationDate: '',
      horizontalAction: '',
      horizontalFunction: '',
      horizontalResponse: '',
      horizontalDate: '',
      financeAccepted: 'true',
      leaderApproval: 'true',
      verificationAction: '',
      verifiedBy: '',
      correctionAction: [],
      CustomerResponse: [],
      PermanentCorrectiveAction: [],
      DocumentStandardisation: [],
      HorizontalDeployment: [],
      answersDetectionFailure: [],
      answersOccuranceFailure: [],
      problemStatement: '',
      CAPADetailsID: '',
      problemStatementnotEditted: '',
      closeDate: '',
      FiveWhy:[]
    }
    this.getcapa((this.router.url.split('/') [4]));
    const date = new Date();
    this.capaCreateObject.closeDate ='';
    //  {
    //   date: {
    //     year: date.getFullYear(),
    //     month: date.getMonth() + 1,
    //     day: date.getDate()
    //   }
    // }
  }
  ngAfterViewInit() {
    this.onAnchorClick(1, true);
  }
  onSuccessToastMessage(msg): void {
    this.loading = false;
    this.toastr.clearAllToasts();
    this.toastr.success(msg, 'Success!', {
      showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
    });
  }
  onErrorToastMessage(error): void {
    this.loading = false;
    this.toastr.clearAllToasts();
    this.toastr.error('No network found.Please check your internet connection.', 'Failure!', {
      showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
    });
  }
  onWhyClick(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, {class: 'd-flex align-self-center modal-lg', ignoreBackdropClick:true});
    this.createFiveWhyObject(this.capaCreateObject.FiveWhy)
  }
  onWhyCancel(): void {
    this.modalRef.hide();
    this.fyeLength = 0;
    this.createFiveWhyObject(this.capaCreateObject.FiveWhy)
  }

  createFiveWhyObject(dataArray){
    this.fiveWhyObject = [];
    let self = this;
    let FiveWhyArray  = (dataArray)?dataArray:[]
    if(FiveWhyArray.length == 0 ){
      this.addNewFiveWhy();
      return;
    }
    FiveWhyArray.forEach((item)=>{
      let tempObject  = {
        "Answer":{},
        "exAnswer":{},
        "ProblemStatement": "",
        "IsDisabled": false,
        "CauseAnalysisID": 0,
        "Name": ""
      }
      let Answer = (item.Answer)?item.Answer:[];
      tempObject.ProblemStatement = item.ProblemStatement;
      tempObject.CauseAnalysisID  = item.CauseAnalysisID;
      tempObject.Name = item.Name;
      tempObject.IsDisabled = item.IsDisabled;
      tempObject.exAnswer = Answer;
      if(Answer.length){
        let tempAns = "{";
        Answer.forEach((ans)=>{
          tempAns = tempAns + '"'+ans.AnalysisQuestionID+'":"'+ans.AnalysisQueAnswer+'",';
        })
        tempAns = tempAns.slice(0, -1)+'}';
        tempObject.Answer =JSON.parse(tempAns);
      }
      this.fiveWhyObject.push(tempObject)
    })
  }
  notifyMe(event){
    console.log(event)
  }

  addNewFiveWhy(){
    let exstFiveWhyLength =(this.capaCreateObject.FiveWhy)?this.capaCreateObject.FiveWhy.length:0;
    let FiveWhyObjLength =this.fiveWhyObject.length;
    this.fyeFlag = false;
    this.fyeLength = exstFiveWhyLength;
    if(exstFiveWhyLength == FiveWhyObjLength){
      let user = ''
       let tempObject  = {
            "Answer":{},
            "exAnswer":[],
            "ProblemStatement": "",
            "IsDisabled": false,
            "CauseAnalysisID": 0,
            "Name": 'Untitled'
          }
        this.fiveWhyObject.push(tempObject)
    }
    var self = this;
    //Due to plugin drawback, Re bind five why element
    setTimeout(function(){self.fyeFlag = true;}, 0);//
  }

  onWhySubmit(): void {
    let exstFiveWhy =(this.capaCreateObject.FiveWhy)?this.capaCreateObject.FiveWhy:[];
    let fiveWhyArray = [];
    let gen_user = JSON.parse(localStorage.getItem('userData')).UserName;
    gen_user = gen_user+'_'+Date.now()
    this.fiveWhyObject.forEach((item)=>{
      let tempObject = item.Answer;
      let tempArray =[]
      for(let inx in tempObject){
        let exAnsId =  item.exAnswer.filter((element)=>{
          return element.AnalysisQuestionID ==inx
        })
       let AnalysisAnswerID = (exAnsId.length)?exAnsId[0].AnalysisAnswerID:0
        tempArray.push({
          "AnalysisAnswerID": AnalysisAnswerID,
          "AnalysisQueAnswer": tempObject[inx],
          "AnalysisQuestionID": inx
        })
      }
      fiveWhyArray.push({
        Answer:tempArray,
        CauseAnalysisID:item.CauseAnalysisID,
        Name:(item.Name != 'Untitled')?item.Name:gen_user,
        ProblemStatement:item.ProblemStatement
      })
    })
    this.modalRef.hide();
    this.capaCreateObject.FiveWhy = fiveWhyArray;
  }

  onAddContainmentClick(): void {
    this.addContainment = 'true';
    var newAddContainment = {
      'CorrectionActionName': '',
      'CorrectionActionFunction': '',
      'CorrectionActionResponse': '',
      'TargetDate': '',
      'Status': '0'
    }
    this.capaCreateObject.correctionAction.push(newAddContainment);
  }
  onAddCauseClick(): void {
    this.addCause = 'true';
    var newAddCause = {
      'CustomerResponseCause': '',
      'CustomerResponseAction': '',
    }
    this.capaCreateObject.CustomerResponse.push(newAddCause);
  }
  onAddCorrectionClick(): void {
    this.addCorrection = 'true';
    this.correctioncount = this.correctioncount + 1;
    var newAddCorrectiveAction = {
      'CorrectionActionName': '',
            'CorrectionActionFunction': '',
            'CorrectionActionResponse': '',
            'TargetDate': '',
            'Status': '0'
      // 'DocumentStandardisationAction': '',
      // 'DocumentStandardisationFunction': '',
      // 'DocumentStandardisationResponse': '',
      // 'TargetDate': '',
      // 'Status': '0'
    }
    this.capaCreateObject.PermanentCorrectiveAction.push(newAddCorrectiveAction);
  }
  onAddStandardizationClick(): void {
    this.addStandardization = 'true';
    var newAddStandardization = {
      'DocumentStandardisationAction': '',
      'DocumentStandardisationFunction': '',
      'DocumentStandardisationResponse': '',
      'TargetDate': '',
      'Status': '0'
    }
    this.capaCreateObject.DocumentStandardisation.push(newAddStandardization);
  }
  onAddHorizontalClick(): void {
    this.addHorizontalDeployment = 'true';
    var newAddHorizontalDeploy = {
      'HorizontalDeploymentAction': '',
      'HorizontalDeploymentFunction': '',
      'HorizontalDeploymentResponse': '',
      'TargetDate': '',
      'Status': '0'
    }
    this.capaCreateObject.HorizontalDeployment.push(newAddHorizontalDeploy);
  }

  itemWasToggled(event) {
    event.preventDefault();

  }

  getDepartmentDropdownData(): void {
    this.createcapaService.getDepartmentListDropDowndata('', response => {
      if (response.ResponseCode == 413 || response.ResponseCode == 414) {
        window.location.href = this.constant.loginURL;
      } else if (response.ResponseCode === 200) {
        this.departments = response.Data;
      } else {
      }
    }, error => {

    });
  }

  getBrandList(): void {
    this.createcapaService.getBrandListDropDowndata('', response => {
      if (response.StatusCode === "SUCCESS") {
        this.brandList = response.Data;
      } else {
      }
    }, error => {

    });
  }
 
  getAllDropdownData(): void {
    this.createnewclaimService.getListCreateNewDropDowndata('', response => {
      let dataArray = (response.Data) ? response.Data : {};
      this.CountryList = (dataArray.Country) ? dataArray.Country : []
      if (response.ResponseCode == 413 || response.ResponseCode == 414) {
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

  getMailList() {
		this.createnewclaimService.getEmailList(data => {
			this.users = (this.users == [] ? ((data) ? data : []) : this.users.concat(data));
      this.loading = false;
		}, error => {
      this.loading = false;
			// this.sharedService.toasterMessage({
			// 	message:this.translationLables.genMessage,
			// 	type:'error',
			// 	title:this.translationLables.error
			// })
		})
	}

  goSearchview(): void {
    /*if(localStorage.getItem('capa-load-from') == 'claim') {
      this.router.navigate(['dashboard/claim']);
    } else {
      this.router.navigate(['dashboard/capa']);
    }*/
    let url=this.sharedService.getPreviousURL();
    if (url ==null){
      if(localStorage.getItem('capa-load-from') == 'capa')
      {
        this.router.navigate(['dashboard/capa']);
      }
      else{
        this.router.navigate(['landing']);
      }

    }


    else
      this.router.navigate([url]);
    //this.location.back();
  /*  if(window.history.length > 2){
      window.history.back();
    }else{
     this.router.navigate(['dashboard/capa']);
    }*/
  }

  onResetClick(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, {class: 'd-flex align-self-center modal-md', ignoreBackdropClick:true});
  }

  onResetYes(): void {
    this.uploaderCAPASampleAttach.queue = [];
    this.CAPAFileUploadDetail = [];
    this.uploadFileName = '';
    this.uploadFilePath = '';
    this.addContainment = 'false';
    this.addCause = 'false';
    this.addCorrection = 'false';
    this.addStandardization = 'false';
    this.addHorizontalDeployment = 'false';
    this.submitClick = false;
    this.ngOnInit();
  }

  datePickerFormat(dateString): any {
    let dd = {};
    if (dateString) {
      let newDate = new Date(dateString);
      dd = { date: { year: newDate.getFullYear(), month: newDate.getMonth() + 1, day: newDate.getDate() } };
    }
    return dd;
  }
  getcapa(capaID): void {
    // api call
    this.loading = true;
    this.createcapaService.getCapaDetails(capaID, response => {
      //this.apiCallStatus = false;
      if (response.ResponseCode == 413 || response.ResponseCode == 414) {
        window.location.href = this.constant.loginURL;
      } else if (response.ResponseCode === 200 && response.Data) {
        this.claimButtonStatus=response.Data.ClaimButtonStatus!=null?response.Data.ClaimButtonStatus:0;
        this.responseButtonStatus=response.Data.ResponseButtonStatus!=null?response.Data.ResponseButtonStatus:0;
        this.capadetails = response.Data;
        this.currentClaimId = response.Data.ClaimModel.ClaimID;
        this.uploadfilesAction();
        let CauseAnalysis = response.Data.CauseAnalysis;
        if (CauseAnalysis != null && CauseAnalysis.FishBoneAttachments.length != 0) {
          this.uploadFileName = CauseAnalysis.FishBoneAttachments[0].FileName;
          this.uploadFilePath = CauseAnalysis.FishBoneAttachments[0].FilePath;
          this.uploadAttachmentId = CauseAnalysis.FishBoneAttachments[0].FishBoneAttachmentID;
        }else{
          this.uploadFileName = '';
          this.uploadFilePath = '';
          this.uploadAttachmentId ='';
        }
        let FiveWhy = (CauseAnalysis && CauseAnalysis.FiveWhy)?CauseAnalysis.FiveWhy:[];
        this.createFiveWhyObject(FiveWhy)
        this.capaCreateObject.FiveWhy = FiveWhy;
        this.capaCreateObject.carNo = response.Data.ClaimModel.ComplaintNumber;
        this.capaCreateObject.DateSelected  =   moment(response.Data.CreateDate).format('MM/DD/YYYY');
        this.capaCreateObject.RcaNo = response.Data.RCANumber;
        var temp={};
        this.capaCreateObject.SendEmailsTo = response.Data.SendEmailsTo?response.Data.SendEmailsTo.split(','):[];

        // this.accidentClaim.IncidentDetail.EmailTo = (this.accidentClaim.IncidentDetail.EmailTo)?this.accidentClaim.IncidentDetail.EmailTo.split(','):[];
		 	for(var i=0;i<this.capaCreateObject.SendEmailsTo.length;i++){
        var temp={};
				temp["Address"] = this.capaCreateObject.SendEmailsTo[i];
				temp["Id"] = 2;
				temp["Name"] = ''
				//this.validateEmail(temp["Address"]);
				this.users.push(temp);
       }
       this.getMailList();
      // this.capaCreateObject.SendEmailsTo = response.Data.SendEmailsTo?response.Data.SendEmailsTo.split(','):[];

        this.capaCreateObject.IrNo = response.Data.IRNumber;
        this.capaCreateObject.customerName = response.Data.ClaimModel.CustomerDetails.CustName;
        this.capaCreateObject.country =( response.Data.ClaimModel.CustomerDetails.Country.CountryID)? response.Data.ClaimModel.CustomerDetails.Country.CountryID:this.capaCreateObject.country;
        this.capaCreateObject.email = response.Data.ClaimModel.CustomerDetails.CustEmail;
        this.capaCreateObject.brand = response.Data.ClaimModel.ProductDetails.Brand.BrandID;
        this.capaCreateObject.productDescription = response.Data.ClaimModel.ProductDetails.ProductDesc;
        this.capaCreateObject.commercialCode = response.Data.ClaimModel.ClaimDetailsModel.CommercialCode;
        this.capaCreateObject.deliveredItemsNo = response.Data.ClaimModel.ProductDetails.TotalCount;
        this.capaCreateObject.defectedItemsNo = response.Data.ClaimModel.ProductDetails.DefectiveCount;
        this.capaCreateObject.drawingNo = response.Data.ClaimModel.ProductDetails.DrawingRevNumber;
        this.capaCreateObject.complaintDescription = response.Data.ClaimModel.ClaimDetailsModel.ComplaintDesc;
        this.capaCreateObject.primaryInvestigation = response.Data.PrimaryInvestigation ? response.Data.PrimaryInvestigation.PrimaryInvestigationDesc : '';
        this.capaCreateObject.complaintValid = response.Data.PrimaryInvestigation ? response.Data.PrimaryInvestigation.ComplaintFlag: false;
        this.capaCreateObject.compensationDetails = response.Data.PrimaryInvestigation ? response.Data.PrimaryInvestigation.CompensationDetails : '';
        this.capaCreateObject.inspectionRef = response.Data.PrimaryInvestigation ? response.Data.PrimaryInvestigation.InspectionRef : '';
        this.capaCreateObject.defectCode = response.Data.PrimaryInvestigation ? response.Data.PrimaryInvestigation.DefectCode : '';
        this.capaCreateObject.concernedDepartment = response.Data.PrimaryInvestigation ? (response.Data.PrimaryInvestigation.Department ? (response.Data.PrimaryInvestigation.Department.DepartmentID ? response.Data.PrimaryInvestigation.Department.DepartmentID : '0') : "0") : "0";
        this.capaCreateObject.resolutionLead = response.Data.PrimaryInvestigation ? response.Data.PrimaryInvestigation.ResolutionLead : '';
        this.capaCreateObject.CAPADetailsID = response.Data.CAPADetailsID;
        this.capaCreateObject.problemStatement = response.Data.CauseAnalysis ? response.Data.CauseAnalysis.CauseAnalysisStatement : '';
        this.capaCreateObject.problemStatementnotEditted = response.Data.CauseAnalysis ? response.Data.CauseAnalysis.CauseAnalysisStatement : '';


        if (response.Data.CustomerResponses.length > 0) {
          this.addCause = 'true';
          this.capaCreateObject.CustomerResponse = response.Data.CustomerResponses;
        } else {
          this.addCause = 'true';
          var newAddCause = {
            'CustomerResponseCause': '',
            'CustomerResponseAction': '',
          }
          this.capaCreateObject.CustomerResponse.push(newAddCause);
        }
        // CorrectionActionResponse

        /*CorrectionActions*/
        this.capaCreateObject.correctionAction = [];
        if (response.Data.CorrectionActions.length > 0) {
          this.addContainment = 'true';
          this.capaCreateObject.correctionAction = response.Data.CorrectionActions;
          for (var j = 0; j < response.Data.CorrectionActions.length; j++) {
            if(response.Data.CorrectionActions[j].TargetDate) {
              this.capaCreateObject.correctionAction[j].TargetDate =  moment(response.Data.CorrectionActions[j].TargetDate).format('MM/DD/YYYY');
            }
          }
        } else {
          this.addContainment = 'true';
          var addline = {
            CorrectionActionName: '',
            CorrectionActionFunction: '',
            CorrectionActionResponse: '',
            TargetDate: '',
            Status: '0'
          }
          this.capaCreateObject.correctionAction.push(addline);
        }

        /*PermanentCorrectiveActions*/
        this.capaCreateObject.PermanentCorrectiveAction = [];
        if (response.Data.PermanentCorrectiveActions.length > 0) {
          this.addCorrection = 'true';
          this.capaCreateObject.PermanentCorrectiveAction = response.Data.PermanentCorrectiveActions;
          for (var j = 0; j < response.Data.PermanentCorrectiveActions.length; j++) {
            if(response.Data.PermanentCorrectiveActions[j].TargetDate) {
              this.capaCreateObject.PermanentCorrectiveAction[j].TargetDate = moment(response.Data.PermanentCorrectiveActions[j].TargetDate).format('MM/DD/YYYY');
            }
          }
        } else {
          this.addCorrection = 'true';
          this.correctioncount = this.correctioncount + 1;
          var newAddCorrectiveAction = {
            'CorrectionActionName': '',
            'CorrectionActionFunction': '',
            'CorrectionActionResponse': '',
            'TargetDate': '',
            'Status': '0'
          }
            this.capaCreateObject.PermanentCorrectiveAction.push(newAddCorrectiveAction);
        }

        /*DocumentStandardisations*/
        this.capaCreateObject.DocumentStandardisation = [];
        if (response.Data.DocumentStandardisations.length > 0) {
          this.addStandardization = 'true';
          this.capaCreateObject.DocumentStandardisation = response.Data.DocumentStandardisations;
          for (var j = 0; j < response.Data.DocumentStandardisations.length; j++) {
            if(response.Data.DocumentStandardisations[j].TargetDate) {
              this.capaCreateObject.DocumentStandardisation[j].TargetDate = moment(response.Data.DocumentStandardisations[j].TargetDate).format('MM/DD/YYYY');
            }
          }
        } else {
          this.addStandardization = 'true';
          var newAddStandardization = {
            'DocumentStandardisationAction': '',
            'DocumentStandardisationFunction': '',
            'DocumentStandardisationResponse': '',
            'TargetDate': '',
            'Status': '0'
          }
          this.capaCreateObject.DocumentStandardisation.push(newAddStandardization);
        }

        /*HorizontalDeployments*/
        this.capaCreateObject.HorizontalDeployment = [];
        if (response.Data.HorizontalDeployments.length > 0) {
          this.addHorizontalDeployment = 'true';
          this.capaCreateObject.HorizontalDeployment = response.Data.HorizontalDeployments;
          for (var j = 0; j < response.Data.HorizontalDeployments.length; j++) {
            if(response.Data.HorizontalDeployments[j].TargetDate) {
              this.capaCreateObject.HorizontalDeployment[j].TargetDate = moment(response.Data.HorizontalDeployments[j].TargetDate).format('MM/DD/YYYY');
            }
          }
        } else {
          this.addHorizontalDeployment = 'true';
          var newAddHorizontalDeploy = {
            'HorizontalDeploymentAction': '',
            'HorizontalDeploymentFunction': '',
            'HorizontalDeploymentResponse': '',
            'TargetDate': '',
            'Status': '0'
          }
          this.capaCreateObject.HorizontalDeployment.push(newAddHorizontalDeploy);
        }


        this.capaCreateObject.financeAccepted = response.Data.FinanceApprovalFlag.toString();
        this.capaCreateObject.leaderApproval = response.Data.LeaderApprovalFlag.toString();
        this.capaCreateObject.verificationAction = response.Data.ActionVerification ? response.Data.ActionVerification.ActionVerificationName : '';
        this.capaCreateObject.verifiedBy = response.Data.ActionVerification ? response.Data.ActionVerification.VerifiedBy : '';
        const date = new Date();
        this.capaCreateObject.closeDate = (response.Data.ActionVerification) ? moment(response.Data.ActionVerification.CloseOutdate).format('MM/DD/YYYY') : moment(this.today).format('MM/DD/YYYY')
        this.currentstatus = response.Data.Status.StatusID;
        if(response.Data.Status.StatusID != 4) {
          this.placeholderShow = true;
        }
        this.causeId = response.Data.CauseAnalysis ? response.Data.CauseAnalysis.CauseAnalysisTypes.CauseAnalysisTypeID : 1;
        if (this.causeId == 2) {
          this.capaCreateObject.value = false;
        } else {
          this.capaCreateObject.value = true;
        }
      }
    }, error => {
      this.loading = false;
      this.onErrorToastMessage(error);
    });
  }

  saveCAPAClick(Draft): void {
    this.CapaProcessType = Draft;
    this.submitClick = false;
    if (!this.capaCreateObject.value && this.uploaderCAPASampleAttach.queue.length) {
      this.callUploadFile();
    }  else {
      this.createNewCapa(Draft);
    }
  }
  setPreviousURL(){
    this.sharedService.setPreviousURL(this.router.url);
  }

  viewClaim(){
    this.setPreviousURL();
    this.router.navigate(['Viewclaim',this.capaCreateObject.carNo], { relativeTo: this.activatedRoute.parent });

  }

  createOrViewValidation(){
    console.log("Inside validation" );
    this.setPreviousURL();
    this.router.navigate(['Respond',this.capaCreateObject.carNo,1], { relativeTo: this.activatedRoute.parent });

  }
  closeCAPAClick(Closed, template: TemplateRef<any>): void {
    let delivered:any = parseInt(this.capaCreateObject.deliveredItemsNo);
    let defected:any = parseInt(this.capaCreateObject.defectedItemsNo);
    this.submitClick = true;
    this.actionStatus = false;

    for(let item of this.capaCreateObject.correctionAction){
      if((item.CorrectionActionName || item.CorrectionActionFunction || item.CorrectionActionResponse || item.TargetDate) && (item.Status != '2')){
       this.toastr.warning('Please close all actions before closing CAPA', 'Warning', {
        showCloseButton: true, toastLife: this.constant.toastTime
      })
      return
      }
    }

    for(let item of this.capaCreateObject.PermanentCorrectiveAction){
      if((item.CorrectionActionFunction || item.CorrectionActionName || item.TargetDate || item.CorrectionActionResponse) && (item.Status != '2')){
       this.toastr.warning('Please close all actions before closing CAPA', 'Warning', {
        showCloseButton: true, toastLife: this.constant.toastTime
      })
      return
      }
    }

    for(let item of this.capaCreateObject.DocumentStandardisation){
      if((item.DocumentStandardisationFunction || item.DocumentStandardisationAction || item.TargetDate || item.DocumentStandardisationResponse) && (item.Status != '2')){
       this.toastr.warning('Please close all actions before closing CAPA', 'Warning', {
        showCloseButton: true, toastLife: this.constant.toastTime
      })
      return
      }
    }

    for(let item of this.capaCreateObject.HorizontalDeployment){
      if((item.HorizontalDeploymentFunction || item.HorizontalDeploymentAction || item.TargetDate || item.HorizontalDeploymentResponse) && (item.Status != '2')){
       this.toastr.warning('Please close all actions before closing CAPA', 'Warning', {
        showCloseButton: true, toastLife: this.constant.toastTime
      })
      return
      }
    }

    if (delivered < defected) {
      this.toastr.warning(' No.of defective items should be less than No.of delivered items', 'Warning', {
        showCloseButton: true, toastLife: this.constant.toastTime
      })
      return;
    }

    if (!this.capaCreateObject.verificationAction) {
      this.toastr.warning('Please enter all mandatory fields or valid data', 'Warning', {
        showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
      });
      return;
    }

    if (!this.capaCreateObject.verifiedBy) {
      this.toastr.warning('Please enter all mandatory fields or valid data', 'Warning', {
        showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
      });
      return;
    }
    if(!this.validateEmail(this.capaCreateObject.SendEmailsTo)) {
      this.toastr.clearAllToasts();
      this.toastr.warning("Please enter valid email Ids", 'Warning', {
        showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
      });
      return;
    }

    this.capaCreateObject.SendEmailsTo = (this.capaCreateObject.SendEmailsTo)?(this.capaCreateObject.SendEmailsTo):[]
    if ((this.capaCreateObject.verificationAction != '') && (this.capaCreateObject.verifiedBy != '') && (this.capaCreateObject.closeDate) && !this.actionStatus) {
      this.modalRef = this.modalService.show(template, {class: 'd-flex align-self-center modal-sm'});
    }
  }

  onResetYescapa(Closed): void {
    this.CapaProcessType = Closed;
    if (!this.capaCreateObject.value && this.uploaderCAPASampleAttach.queue.length) {
      this.callUploadFile();
    }
    this.createNewCapa(Closed);
  }

  uploadfilesAction() {
    let claimId_Temp = (this.currentCAPAId)?this.currentCAPAId:'';
    this.URL = this.constant.baseURL + 'api/UpFile?claimId=' +claimId_Temp+ '&key=fishboneKey';
    this.uploaderCAPASampleAttach = new FileUploader({ url: '' });
    this.uploaderCAPASampleAttach.onAfterAddingFile = (fileItem) => {
      if (this.uploaderCAPASampleAttach.queue.length <= 1) {
        let isExist = false;
        for (let i = 0; i < this.CAPAFileUploadDetail.length; i++) {
          if (this.CAPAFileUploadDetail[i].name === fileItem.file.name) {
            isExist = true;
            this.uploaderCAPASampleAttach.queue.length = this.uploaderCAPASampleAttach.queue.length - 1;
          }
        }
        if (!isExist) {
          this.CAPAFileUploadDetail.push(fileItem.file);
        }
        fileItem.withCredentials = false;
        this.uploadFileName = fileItem.file.name;
        this.uploadFilePath = '';
      } else {
        this.CAPAFileUploadDetail = [];
        this.CAPAFileUploadDetail.push(fileItem.file);
        fileItem.withCredentials = false;
        this.uploadFileName = fileItem.file.name;
        this.uploadFilePath = '';
      }
    };
    this.uploaderCAPASampleAttach.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
       this.createNewCapa(this.CapaProcessType);
    };
  }

  callUploadFile(): void {
    if (this.uploaderCAPASampleAttach.queue.length == 0) {
      this.uploaderCAPASampleAttach.uploadAll();
    }
    for (let index = 0; index < this.uploaderCAPASampleAttach.queue.length; index++) {
      const element = this.uploaderCAPASampleAttach.queue[index];
      if (element.url !== undefined) {
        let claimId_Temp = (this.currentCAPAId)?this.currentCAPAId:'';
        element.url = this.constant.baseURL + 'api/UpFile?claimId=' + claimId_Temp + '&key=fishboneKey';
      }
    }
    if (this.uploaderCAPASampleAttach.queue.length > 0) {
      this.uploaderCAPASampleAttach.uploadAll();
    }
  }

  createNewCapa(Action): void {
    var self = this;
    let isValid = true;
    if (isValid) {
      self.loading = true;
      self.capaCreateObject.SendEmailsToString = self.capaCreateObject.SendEmailsTo.join();
      for (var j = 0; j < this.capaCreateObject.correctionAction.length; j++) {
        if(this.capaCreateObject.correctionAction[j].TargetDate) {
          this.capaCreateObject.correctionAction[j].TargetDate =  moment(this.capaCreateObject.correctionAction[j].TargetDate).format('YYYY-MM-DD');
        }
      }
      for (var j = 0; j < this.capaCreateObject.HorizontalDeployment.length; j++) {
        if(this.capaCreateObject.HorizontalDeployment[j].TargetDate) {
          this.capaCreateObject.HorizontalDeployment[j].TargetDate = moment(this.capaCreateObject.HorizontalDeployment[j].TargetDate).format('YYYY-MM-DD');
        }
      }
      for (var j = 0; j < this.capaCreateObject.DocumentStandardisation.length; j++) {
        if(this.capaCreateObject.DocumentStandardisation[j].TargetDate) {
          this.capaCreateObject.DocumentStandardisation[j].TargetDate = moment(this.capaCreateObject.DocumentStandardisation[j].TargetDate).format('YYYY-MM-DD');
        }
      }
      for (var j = 0; j < this.capaCreateObject.PermanentCorrectiveAction.length; j++) {
        if(this.capaCreateObject.PermanentCorrectiveAction[j].TargetDate) {
          this.capaCreateObject.PermanentCorrectiveAction[j].TargetDate = moment(this.capaCreateObject.PermanentCorrectiveAction[j].TargetDate).format('YYYY-MM-DD');
        }
      }
      this.capaCreateObject.closeDate = moment(this.capaCreateObject.closeDate).format('YYYY-MM-DD');
      self.createcapaService.createNewCapa(self.capaCreateObject, Action, response => {
        if (response.ResponseCode == 413 || response.ResponseCode == 414) {
          window.location.href = self.constant.loginURL;
        } else if (response.ResponseCode === 200) {
          self.onSuccessToastMessage(response.ResponseMessage);
          self.getcapa((self.router.url.split('/') [4]));
          self.loading = false;
        }
      }, error => {
        self.loading = false;
        self.onErrorToastMessage(error);
      });
    }
  }

  validateEmail(_emailsList) {
    this.validmail = true;
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(_emailsList.length!==0) {
      for(let i=0; i<_emailsList.length; i++) {
        if(!regex.test(_emailsList[i])) {
          this.validmail = false;
          return;
        }
      }
    }
    return this.validmail;
	}

  getAnalysisQuestions(): void {
    this.questions = [];
    this.createcapaService.getAnalysisQuestions('', response => {
      if (response.ResponseCode == 413 || response.ResponseCode == 414) {
        window.location.href = this.constant.loginURL;
      } else if (response.ResponseCode === 200) {
        this.questions  = (response.Data)?response.Data:[];
      } else {
      }
    }, error => {
      this.onErrorToastMessage(error);
    });
  }

  getAnswers(capaID): void {
    // api call
    this.createcapaService.getAnalysisAnswers(capaID, response => {
      if (response.ResponseCode == 413 || response.ResponseCode == 414) {
        window.location.href = this.constant.loginURL;
      } else if (response.ResponseCode === 200) {
        this.answers = response.Data;
        if (this.answers) {
          for (var i = 0; i < this.answers.length; i++) {
            for (var j = 0; j < this.questions.length; j++) {
              if (this.questions[j].AnalysisQuestionModelID === 1) {
                if (this.answers[i].AnalysisQuestionID === this.questions[j].AnalysisQuestionID) {
                  this.questions[j].answersOccuranceFailure = this.answers[i].AnalysisQueAnswer;
                }
              }
              if (this.questions[j].AnalysisQuestionModelID === 2) {
                if (this.answers[i].AnalysisQuestionID === this.questions[j].AnalysisQuestionID) {
                  this.questions[j].answersDetectionFailure = this.answers[i].AnalysisQueAnswer;
                }
              }
            }
          }
        }
      }
    }, error => {
      this.onErrorToastMessage(error);
    });
  }

  editCapaClick(): void {
    this.currentstatus = '3';
  }

  addCustomEmail = (term) => ({Address: term, name: term});

  closeCorrection(index): void {
    this.currentstatus = this.currentstatus.toString();
    if (this.currentstatus !== '4') {
      this.capaCreateObject.correctionAction.splice(index, 1);
    }
  }

  closePermanentCorrection(index): void {
    this.currentstatus = this.currentstatus.toString();
    if (this.currentstatus !== '4') {
      this.capaCreateObject.PermanentCorrectiveAction.splice(index, 1);
    }
  }

  closeStandardization(index): void {
    this.currentstatus = this.currentstatus.toString();
    if (this.currentstatus !== '4') {
      this.capaCreateObject.DocumentStandardisation.splice(index, 1);
    }
  }

  closeCauseandAction(index): void {
    this.currentstatus = this.currentstatus.toString();
    if (this.currentstatus !== '4') {
      this.capaCreateObject.CustomerResponse.splice(index, 1);
    }
  }

  closeHorizotaldeploy(index): void {
    this.currentstatus = this.currentstatus.toString();
    if (this.currentstatus !== '4') {
      this.capaCreateObject.HorizontalDeployment.splice(index, 1);
    }
  }

  onDeleteFile(fileattached): void {
    fileattached.queue.splice(0, 1);
    this.uploadFileName = '';
    if (this.uploadAttachmentId) {
      const reqBody = {
        'AttachmentID': this.uploadAttachmentId,
        'Key': 'fishboneKey'
      }
      this.callDeleteAttchamnet(reqBody);
    }
  }

  callDeleteAttchamnet(reqBody): void {
    this.loading = true;
    this.createnewclaimService.deleteAttachment(reqBody, response => {
      this.loading = false;
      if (response.ResponseCode == 413 || response.ResponseCode == 414) {
        window.location.href = this.constant.loginURL;
      }
    }, error => {
      this.loading = false;
    });
  }

  getActionStatus(): void {
    this.createcapaService.getActionStatus(response => {
      let dataArray = (response.Data) ? response.Data : [];
      this.capaActionStatus = (dataArray) ? dataArray : []
      if (response.ResponseCode == 413 || response.ResponseCode == 414) {
      } else {
      }
    }, error => {

    });
  }

  onAnchorClick(_id:any, initLoaded?) {
      let headerNav:any = document.querySelector("#fixed-nav-header");
      let footerNav:any = document.querySelector(".footer-fixed");
      let scrollablePage:any = document.querySelector("#scrollable-page");
      let lastBlock:any = document.querySelector(".block.last");
      let pageHeight:any = $(window).height();
      
      scrollablePage.style.paddingTop = (headerNav.offsetHeight) + "px";
      let top:any = 0;
      let block:any;
      for (let i=1; i<_id; i++) {
          block = document.querySelector("#block-"+i);
          top = top + block.offsetHeight;
      }
      this.activeTab = "block-"+_id;
        document.body.scrollTop = document.documentElement.scrollTop = top;

      /*Activate navigation when scroll the page*/
      function onScroll(event) {
        var scrollPos = document.documentElement.scrollTop + headerNav.offsetHeight + 10;
        $('#tabHeader a').each(function () {
            var currLink = $(this);
            if(currLink.attr("data-target")) {
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

      if(initLoaded) {
        let footerHeight = footerNav ? footerNav.offsetHeight : 50;
        lastBlock.style.minHeight = (pageHeight - (headerNav.offsetHeight + footerHeight) - 10) + 'px';
        document.removeEventListener('scroll', onScroll);
        document.addEventListener('scroll', onScroll);
      }
    }

}
