import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map'

import { Constant } from '../../utill/constants/constant';
import { UrlgeneratorService } from '../../utill/urlgenerator/urlgenerator.service';
import { ApicallService } from '../../utill/apicall/apicall.service';

@Injectable()

export class CreatecapaService {
    public capaObject = [];
    public PermanentCorrectiveObject = [];
    public CustomerResponsesObject = [];
    public DocumentStandardisationObject = [];
    public HorizontalDeploymentObject = [];
    public AnswerObject = [];
    public CreateCapaRequestBody = {};
    constructor(
        private http: Http,
        private urlgeneratorService: UrlgeneratorService,
        private apicallService: ApicallService
    ) { }

    getDepartmentListDropDowndata(data, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getDepartmentListURL();
        this.apicallService.doGetAPIAction(apiUrl, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    getBrandListDropDowndata(data, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getExternalBrandListURL();
        this.apicallService.doGetAPIAction(apiUrl, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    getRespondDetails(value, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getRespondDetailsURL(value);
        this.apicallService.doGetAPIAction(apiUrl, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    getCapaDetails(creds, successCallback, errorCallback) {

        setTimeout(() => {
            const apiUrl = this.urlgeneratorService.getcapaDetails(creds);
            this.apicallService.doGetAPIAction(apiUrl, response => {
                successCallback(JSON.parse(response._body))
            }, error => {
                errorCallback(error)
            });
        }, 1000);
    }

    createNewCapa(createNewCapaObjects, Action, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.submitCapaURL();
        this.capaObject = [];
        this.PermanentCorrectiveObject = [];
        this.CustomerResponsesObject = [];
        this.DocumentStandardisationObject = [];
        this.HorizontalDeploymentObject = [];
        for (var i = 0; i < createNewCapaObjects.correctionAction.length; i++) {
            var CorrectionList = {
                "CorrectionActionName": createNewCapaObjects.correctionAction[i].CorrectionActionName,
                "CorrectionActionFunction": createNewCapaObjects.correctionAction[i].CorrectionActionFunction,
                "CorrectionActionResponse": createNewCapaObjects.correctionAction[i].CorrectionActionResponse,
                "Status":createNewCapaObjects.correctionAction[i].Status,
                "TargetDate": createNewCapaObjects.correctionAction[i].TargetDate
            }
            if (CorrectionList.CorrectionActionName !== '' || CorrectionList.CorrectionActionFunction !== '' || CorrectionList.CorrectionActionResponse !== '' || CorrectionList.TargetDate !== '') {
                this.capaObject.push(CorrectionList);
            }
        };

        for (var j = 0; j < createNewCapaObjects.PermanentCorrectiveAction.length; j++) {
            var PermanentCorrectiveActionsList = {
                "CorrectionActionName": createNewCapaObjects.PermanentCorrectiveAction[j].CorrectionActionName,
                "Status": createNewCapaObjects.PermanentCorrectiveAction[j].Status,
                "CorrectionActionFunction": createNewCapaObjects.PermanentCorrectiveAction[j].CorrectionActionFunction,
                "CorrectionActionResponse": createNewCapaObjects.PermanentCorrectiveAction[j].CorrectionActionResponse,
                "TargetDate": createNewCapaObjects.PermanentCorrectiveAction[j].TargetDate
            }
            if (PermanentCorrectiveActionsList.CorrectionActionName !== '' || PermanentCorrectiveActionsList.CorrectionActionFunction !== '' || PermanentCorrectiveActionsList.CorrectionActionResponse !== '' || PermanentCorrectiveActionsList.TargetDate !== '') {
                this.PermanentCorrectiveObject.push(PermanentCorrectiveActionsList);

            }
        };
        for (var k = 0; k < createNewCapaObjects.CustomerResponse.length; k++) {
            var CustomerResponsesList = {
                "CustomerResponseCause": createNewCapaObjects.CustomerResponse[k].CustomerResponseCause,
                "CustomerResponseAction": createNewCapaObjects.CustomerResponse[k].CustomerResponseAction
            }
            if (CustomerResponsesList.CustomerResponseCause !== '' || CustomerResponsesList.CustomerResponseAction !== '') {
                this.CustomerResponsesObject.push(CustomerResponsesList);
            }

        };
        for (var l = 0; l < createNewCapaObjects.DocumentStandardisation.length; l++) {
            var DocumentStandardisationList = {
                "DocumentStandardisationAction": createNewCapaObjects.DocumentStandardisation[l].DocumentStandardisationAction,
                "Status": createNewCapaObjects.DocumentStandardisation[l].Status,
                "DocumentStandardisationFunction": createNewCapaObjects.DocumentStandardisation[l].DocumentStandardisationFunction,
                "DocumentStandardisationResponse": createNewCapaObjects.DocumentStandardisation[l].DocumentStandardisationResponse,
                "TargetDate": createNewCapaObjects.DocumentStandardisation[l].TargetDate
            }
            if (DocumentStandardisationList.DocumentStandardisationAction !== '' || DocumentStandardisationList.DocumentStandardisationFunction !== '' || DocumentStandardisationList.DocumentStandardisationResponse !== '' || DocumentStandardisationList.TargetDate !== '') {
                this.DocumentStandardisationObject.push(DocumentStandardisationList);
            }
        };
        for (var j = 0; j < createNewCapaObjects.HorizontalDeployment.length; j++) {
            var HorizontalDeploymentList = {
                "HorizontalDeploymentAction": createNewCapaObjects.HorizontalDeployment[j].HorizontalDeploymentAction,
                "Status": createNewCapaObjects.HorizontalDeployment[j].Status,
                "HorizontalDeploymentFunction": createNewCapaObjects.HorizontalDeployment[j].HorizontalDeploymentFunction,
                "HorizontalDeploymentResponse": createNewCapaObjects.HorizontalDeployment[j].HorizontalDeploymentResponse,
                "TargetDate": createNewCapaObjects.HorizontalDeployment[j].TargetDate
            }
            if (HorizontalDeploymentList.HorizontalDeploymentAction !== '' || HorizontalDeploymentList.HorizontalDeploymentFunction !== '' || HorizontalDeploymentList.HorizontalDeploymentResponse !== '' || HorizontalDeploymentList.TargetDate !== '') {
                this.HorizontalDeploymentObject.push(HorizontalDeploymentList);
            }
        };
        this.CreateCapaRequestBody = {
            "CAPADetailsID": createNewCapaObjects.CAPADetailsID,
            "RCANumber": createNewCapaObjects.RcaNo,
            "IRNumber": createNewCapaObjects.IrNo,
            "ClaimModel": {
                "ComplaintNumber": createNewCapaObjects.carNo,
                "ClaimDetailsModel": {
                    "ComplaintDesc": createNewCapaObjects.complaintDescription,
                    "CommercialCode": createNewCapaObjects.commercialCode
                },
                "CustomerDetails": {
                    "CustEmail": createNewCapaObjects.email
                },
                
                "ProductDetails": {
                    "ProductDesc": createNewCapaObjects.productDescription,
                    "DrawingRevNumber": createNewCapaObjects.drawingNo
                }
            },
            "NoClaimExtraModel" :
                {
                    "CustomerName": createNewCapaObjects.customerName,
                    "Country" : createNewCapaObjects.country,
                    "Email" : createNewCapaObjects.email,
                    "ComplaintDescription" : createNewCapaObjects.complaintDescription,
                    "BrandId": createNewCapaObjects.brand,
                    "ProductionDescription" : createNewCapaObjects.productDescription,
                    "DeleveredItems" : createNewCapaObjects.deliveredItemsNo,
                    "DefectedItems" : createNewCapaObjects.defectedItemsNo,
                    "DrawingNumber" : createNewCapaObjects.drawingNo,    
                    "PrimaryInvestigation" : createNewCapaObjects.primaryInvestigation,
                    "ComplaintFlag" : createNewCapaObjects.complaintValid
                },
            "CreateDate": createNewCapaObjects.DateSelected,
            "FinanceApprovalFlag": createNewCapaObjects.financeAccepted,
            "LeaderApprovalFlag": createNewCapaObjects.leaderApproval,
            "Status": {
                "StatusName": Action
            },
            "PrimaryInvestigation": {
                "CompensationDetails": createNewCapaObjects.compensationDetails,
                "InspectionRef": createNewCapaObjects.inspectionRef,
                "DefectCode": createNewCapaObjects.defectCode,
                "Department": {
                    "DepartmentID": createNewCapaObjects.concernedDepartment,
                },
                "ResolutionLead": createNewCapaObjects.resolutionLead
            },
            "CorrectionActions": this.capaObject,
            "CauseAnalysis": {
                "CauseAnalysisTypes": {
                    "CauseAnalysisTypeID": (createNewCapaObjects.value)?1:2,
                    "CauseAnalysisTypeName": null,
                },
                "FishBoneAttachments": [],
                "FiveWhy":createNewCapaObjects.FiveWhy
            },
            "PermanentCorrectiveActions": this.PermanentCorrectiveObject,
            "CustomerResponses": this.CustomerResponsesObject,
            "DocumentStandardisations": this.DocumentStandardisationObject,
            "HorizontalDeployments": this.HorizontalDeploymentObject,
            "ActionVerification": {
                "ActionVerificationName": createNewCapaObjects.verificationAction,
                "VerifiedBy": createNewCapaObjects.verifiedBy,
                "CloseOutdate": createNewCapaObjects.closeDate

            },
            "SendEmailsTo": createNewCapaObjects.SendEmailsToString
        }
        // console.log(this.CreateCapaRequestBody,'this.CreateCapaRequestBody')
        this.apicallService.doPostAPIAction(apiUrl, this.CreateCapaRequestBody, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    getAnalysisQuestions(data, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getanalysisQuestionsURL();
        this.apicallService.doGetAPIAction(apiUrl, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }

    PostAnalysisAnswers(questions, CAPADetailsID, problemStatement, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.postAnalysisAnswers();
        for (var i = 0; i < questions.length; i++) {
            console.log(questions[i].answersOccuranceFailure);
            var answerList = {
                "AnalysisQueAnswer": (((questions[i].answersOccuranceFailure === '' || questions[i].answersOccuranceFailure === undefined) && (questions[i].answersDetectionFailure === '' || questions[i].answersDetectionFailure === undefined)) ? '' : questions[i].answersOccuranceFailure ? questions[i].answersOccuranceFailure : questions[i].answersDetectionFailure),
                "AnalysisQuestionID": questions[i].AnalysisQuestionID,
            }
            this.AnswerObject.push(answerList);
        };

        this.CreateCapaRequestBody = {
            "CapaDetailsID": CAPADetailsID,
            "CauseStatement": problemStatement,
            "AnalysisAnswer": this.AnswerObject
        }
        this.apicallService.doPostAPIAction(apiUrl, this.CreateCapaRequestBody, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }

    getAnalysisAnswers(creds, successCallback, errorCallback) {
        setTimeout(() => {
            const apiUrl = this.urlgeneratorService.getanalysisAnswersURL(creds);
            this.apicallService.doGetAPIAction(apiUrl, response => {
                successCallback(JSON.parse(response._body))
            }, error => {
                errorCallback(error)
            });
        }, 1000);
    }

    getActionStatus( successCallback, errorCallback) {
        setTimeout(() => {
            const apiUrl = this.urlgeneratorService.getCapaActionStatus();
            this.apicallService.doGetAPIAction(apiUrl, response => {
                successCallback(JSON.parse(response._body))
            }, error => {
                errorCallback(error)
            });
        }, 1000);
    }

}
