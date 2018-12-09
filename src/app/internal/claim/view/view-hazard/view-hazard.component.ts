import { Component,TemplateRef, OnInit ,AfterViewInit} from '@angular/core';
import { HazardsService } from '../../../services/hazard/hazards.service';
import { SharedService } from '../../../services/shared/shared.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-view-hazard',
  templateUrl: './view-hazard.component.html',
  styleUrls: ['./view-hazard.component.css']
})
export class ViewHazardComponent implements OnInit {
  time:any;
  modalRef: BsModalRef;
  users: any;
  public claimStatusList:any = [];
  public sendToEmailList:any = [];
  public estimatedPriority:any = [];
  public natureOfHazard:any = [];
  public hazardClaim:any;
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

  constructor(private hazardService: HazardsService,
    private sharedService: SharedService,
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    public translate: TranslateService,
    private authService: AuthService) {
      this.sharedService.emitChange({current_page: 'HAZARD_VIEW_PAGE'});
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

  initializeModel(){

   this.hazardClaim = {
     "InternalClaimTypeId":1,
     "ReferenceNo":null,
     "ObservedDate" : '',
     "EmployeeName":null,
     "EmployeeNo":null,
     "EmplyeeMinCo":null,
     "ClaimStatusId":null,
     "HazardDetail":{
        "Location": null,
        "HazardNatureId":null,
        "Description":null,
    },
     "CorrectiveAction":{
       "ActionRequested":null,
       "SendTo":null,
       "EstimatedPriority":null,
       "EmailTo":null,
       "CarClosedBy":'',
       "CarClosedDate":'',
       "Attachment":[],
     }

   }

   this.modelConfigPopup = {class: 'd-flex align-self-center modal-md', ignoreBackdropClick: true};
  }

  viewAttachmentList(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template,this.modelConfigPopup);
  }
  getDropdown(){

      this.hazardService.getHazardNature(data=>{
        this.natureOfHazard = (data)?data:[];
        this.hazardService.getEstimatedPriority(data=>{
          this.estimatedPriority = (data)?data:[];
          this.hazardService.getSendToEmail(data=>{
            this.sendToEmailList = (data)?data:[];
            this.hazardService.getInternalClaimStatus(data=>{
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

  }

  getClaimDetails(id){
    let resultSet:any;
    let tempObject:any = [];
    this.hazardService.getClaimDetails(id, data=>{
      this.hazardClaim = (data)?data:this.hazardClaim;

      for(var i=0;i<this.claimStatusList.length;i++){
        if(this.hazardClaim.ClaimStatusId==this.claimStatusList[i].Id){
          this.hazardClaim.claimstatus=this.claimStatusList[i].Name;
          break
        }
      }
      for(var i=0;i<this.natureOfHazard.length;i++){
        if(this.hazardClaim.HazardDetail.HazardNatureId==this.natureOfHazard[i].Id){
          this.hazardClaim.HazardDetail.HazardNatureId=this.natureOfHazard[i].Name;
          break;
        }
      }
      for(var i=0;i<this.estimatedPriority.length;i++){
        if(this.hazardClaim.CorrectiveAction.EstimatedPriority==this.estimatedPriority[i].Id){
          this.hazardClaim.CorrectiveAction.EstimatedPriority=this.estimatedPriority[i].Name;
          break;
        }
      }
      for(var i=0;i<this.sendToEmailList.length;i++){
        if(this.hazardClaim.CorrectiveAction.SendTo==this.sendToEmailList[i].Id){
          this.hazardClaim.CorrectiveAction.SendTo=this.sendToEmailList[i].Name;
          break;
        }
      }
      }, error=>{
 			this.sharedService.toasterMessage({message:this.translationLables.genMessage,type:'error',head:this.translationLables.error})
    })
  }
  attachmentclick(link){
    window.open(link);
  }
}
