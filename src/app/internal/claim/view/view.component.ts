import { Component,TemplateRef, OnInit ,AfterViewInit} from '@angular/core';
import { AccidentService } from '../../services/accident/accident.service';
import { SharedService } from '../../services/shared/shared.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit,AfterViewInit {
  time:any;
  modalRef: BsModalRef;
  users: any;
  public claimStatusList:any = [];
  public sendToEmailList:any = [];
  public locationOfInjury:any = [];
  public natureOfInjury:any = [];
  public typeOfEmployment:any = [];
  public accidentClaim:any;
  public referenceNo='';
  public activeTab = 'block-1';
  public translationLables:any = {
		error:'',
		genMessage:'',
		warning:'',
		missingFields:'',
		dateOfIncidentToaster:'',
		noChange:'',
		successMsg:'',
		success:'',
	}

  public moduleWeightage = {
    CLMCR: 0,
    CLMRESCAPA: 0,
    ICLMCR: 0,
    ICLMRESCAPA: 0
  }
  public modelConfigPopup:any;

  constructor(private accidentService: AccidentService,
    private sharedService: SharedService,
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    public translate: TranslateService,
    private authService: AuthService
  ) {
    this.sharedService.emitChange({current_page: 'VIEW_PAGE'});
    activatedRoute.url.subscribe((item) => {
			this.referenceNo = (item[item.length-1])?item[item.length-1].path:'create'
    });
    translate.setDefaultLang('en-US');
		translate.use(localStorage.getItem("lang") ? localStorage.getItem("lang") : 'en-US');
   }

  ngOnInit() {

    this.moduleWeightage.ICLMCR = this.authService.getTransactionWeightage('ICLMCR');
    this.moduleWeightage.ICLMRESCAPA = this.authService.getTransactionWeightage('ICLMRESCAPA');

    this.initializeModel();
    this.getDropdown();
  }

  ngAfterViewInit(){
    setTimeout(()=>{
      this.onAnchorClick(1);
    },500)
  }

  onAnchorClick(_id:any) {
      let headerNav:any = document.querySelector("#fixed-nav-header");
      let scrollablePage:any = document.querySelector("#scrollable-page");
      scrollablePage.style.paddingTop = (headerNav.offsetHeight) + "px";
      let top:any = 0;
      let block:any;
      for (let i=1; i<_id; i++) {
          block = document.querySelector("#block-"+i);
          top = top + block.offsetHeight;
      }
      this.activeTab = "block-"+_id;
        document.body.scrollTop = document.documentElement.scrollTop = top;
  }

  getDropdown(){
    this.accidentService.getTypeofEmployment(data=>{
      this.typeOfEmployment = (data)?data:[];
      this.accidentService.getInjuryNature(data=>{
        this.natureOfInjury = (data)?data:[];
        this.accidentService.getInjuryLocation(data=>{
          this.locationOfInjury = (data)?data:[];
          this.accidentService.getSendToEmail(data=>{
            this.sendToEmailList = (data)?data:[];
            this.accidentService.getInternalClaimStatus(data=>{
              this.claimStatusList = (data)?data:[];
              this.getClaimDetails(this.referenceNo);
            },error=>{
               this.sharedService.toasterMessage({message:this.translationLables.genMessage,type:'error',head:this.translationLables.error})
            })
          },error=>{
             this.sharedService.toasterMessage({message:this.translationLables.genMessage,type:'error',head:this.translationLables.error})
          })

        },error=>{
           this.sharedService.toasterMessage({message:this.translationLables.genMessage,type:'error',head:this.translationLables.error})
        })

      },error=>{
         this.sharedService.toasterMessage({message:this.translationLables.genMessage,type:'error',head:this.translationLables.error})
      })
    },error=>{
 			this.sharedService.toasterMessage({message:this.translationLables.genMessage,type:'error',head:this.translationLables.error})
    })
  }

  initializeModel(){
		this.accidentClaim = {
			"InternalClaimTypeId":1,
			"ReferenceNo":"",
			"EmployeeNo":"",
			"EmployeeName":"",
			"EmplyeeMinCo":"",
			"EmploymentTypeId":"",
			"IncidentDate" :"",
			"IncidentTime":"",
			"ClaimStatusId":0,
			"InjuryDetail":{
				"InjuryNatureId":"",
				"InjuryLocationId":"",
				"Ppe":"",
				"CarClosedBy":'',
				"CarClosedDate":"",
				"Attachment":[]
			},
			"IncidentDetail":{
				"SendToId":"",
				"ReportedBy":"",
				"Location":"",
				"Description":"",
				"ImmediateAction":"",
				"EmailTo":[]
			}
		}
    this.modelConfigPopup = {class: 'd-flex align-self-center modal-md', ignoreBackdropClick: true};
   }

   viewAttachmentList(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template,this.modelConfigPopup);
	}

  getClaimDetails(id){
    let resultSet:any;
    let tempObject:any = [];
    this.accidentService.getClaimDetails(id, data=>{
      this.accidentClaim = (data)?data:this.accidentClaim;


      for(var i=0;i<this.typeOfEmployment.length;i++){
        if(this.accidentClaim.EmploymentTypeId==this.typeOfEmployment[i].Id){
          this.accidentClaim.EmploymentTypeId=this.typeOfEmployment[i].Name;
          break;
        }
      }
      for(var i=0;i<this.typeOfEmployment.length;i++){
        if(this.accidentClaim.ClaimStatusId==this.claimStatusList[i].Id){
          this.accidentClaim.claimstatus=this.claimStatusList[i].Name;
          break
        }
      }
      for(var i=0;i<this.natureOfInjury.length;i++){
        if(this.accidentClaim.InjuryDetail.InjuryNatureId==this.natureOfInjury[i].Id){
          this.accidentClaim.InjuryDetail.InjuryNatureId=this.natureOfInjury[i].Name;
          break;
        }
      }
      for(var i=0;i<this.locationOfInjury.length;i++){
        if(this.accidentClaim.InjuryDetail.InjuryLocationId==this.locationOfInjury[i].Id){
          this.accidentClaim.InjuryDetail.InjuryLocationId=this.locationOfInjury[i].Name;
          break;
        }
      }
      for(var i=0;i<this.sendToEmailList.length;i++){
        if(this.accidentClaim.IncidentDetail.SendToId==this.sendToEmailList[i].Id){
          this.accidentClaim.IncidentDetail.SendToId=this.sendToEmailList[i].Name;
          break;
        }
      }
      tempObject = (this.accidentClaim.IncidentTime)?this.accidentClaim.IncidentTime.split(':'):null;
       if(tempObject){
         this.accidentClaim.IncidentTime = {
           hour:tempObject[0],
           minute:tempObject[1],
           second:0
         }
       }else{this.accidentClaim.IncidentTime = null}
      }, error=>{
 			this.sharedService.toasterMessage({message:this.translationLables.genMessage,type:'error',head:this.translationLables.error})
    })
  }
  attachmentclick(link){
    window.open(link);
  }

}
