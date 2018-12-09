import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map'

import { Constant } from '../../utill/constants/constant';
import { UrlgeneratorService } from '../../utill/urlgenerator/urlgenerator.service';
import { ApicallService } from '../../utill/apicall/apicall.service';
// import { DatePipe } from '@angular/common';

@Injectable()

export class CreatenewclaimService {

    public CreateNewClaimRequestBody = {};
    constructor(
        private http: Http,
        // private datePipe: DatePipe,
        private urlgeneratorService: UrlgeneratorService,
        private apicallService: ApicallService
    ) { }

    getListCreateNewDropDowndata(data, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getListCreateNewDropDowndataURL();
        this.apicallService.doGetAPIAction(apiUrl, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }

    getCountryList(data, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getCountryListURL();
        this.apicallService.doGetAPIAction(apiUrl, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }

    getClassificationOfComplaint(data, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getClassificationOfComplaintURL();
        this.apicallService.doGetAPIAction(apiUrl, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    
    getManufacturingProcess(data, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getManufacturingProcessURL();
        this.apicallService.doGetAPIAction(apiUrl, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    
    getDefectType(data, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getDefectTypeURL();
        this.apicallService.doGetAPIAction(apiUrl, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }

    getClaimDetails(value, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getExternalClaimDetailsURL(value);
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

    createRespondDetails(createResponseObject, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getCreateRespondDetailsURL();
        const requestBody = {
            "ComplaintNumber": createResponseObject.complaintNumber,
            "ClaimResponse": {
                "ClaimResID": createResponseObject.ClaimResID,
                "ClaimStatusID": createResponseObject.custClaimStatuselectedValue,
                "ClaimResActionFlag": "",
                "ManuProcessFlag": createResponseObject.custManufacturingProcess,
                "DefectTypeFlag": createResponseObject.custDefectType,
                "AcceptedFlag": createResponseObject.custClaimAccepted,
                "QAManager": createResponseObject.custQAManager,
                "QAReceiveDate": createResponseObject.custQAReceivingDate,
                "QAReviewDate": createResponseObject.custDateofReview,
                "QAAnalysisDesc": createResponseObject.qaClaimAnalysis,
                "ContainmentDesc": createResponseObject.containmentAction,
                // "ClaimStatus": createResponseObject.custClaimStatuselectedValue,
                "IssueCreditFlag": createResponseObject.custIssueCreditStatusResponse,
                "IssueCreditUnitCost": createResponseObject.custPUnitCostFirstResponse,
                "IssueCreditAdditionalCost": createResponseObject.additionalCostFirstResponse,
                "IssueCreditTotalCost": createResponseObject.custTotalCostFisrtResponse,
                "IssueCreditQuantity": createResponseObject.custQuantityFisrtResponse,
                "ReturnAuthFlag": createResponseObject.custReturnAutorizationStatusResponse,
                "RANumber": createResponseObject.custRAnoResponse,
                "ReturnAuthUnitCost":createResponseObject.custPUnitCostFirstResponseRA,
                "ReturnAuthQuantity":createResponseObject.custQuantityFisrtResponseRA,
                "ReturnAuthTotalCost":createResponseObject.custTotalCostFisrtResponseRA,
                "ReplaceFlag": createResponseObject.custReplacementStatusResponse,
                "ReplaceQuantity": createResponseObject.custQuantitySecondResponse,
                "ReplaceUnitCost": createResponseObject.custPUnitCostSecondResponse,
                "ReplaceTotalCost": createResponseObject.custTotalCostSecondResponse,
                "RemarksFlag": createResponseObject.custOtherStatusResponse,
                "Remarks": createResponseObject.custSectionOthersDescriptionResponse,
                "ClaimRespManufactureProcess": createResponseObject.claimRespManufactureProcess,
                "ClaimRespComplaints": createResponseObject.claimRespComplaints,
                "ClaimRespDefectTypes": createResponseObject.claimRespDefectTypes,
                'CAPAFlag':createResponseObject.custSelectCapa,
                'sendEmailsTo':createResponseObject.resSentEmailTo,
                // 'ContainmentDesc':createResponseObject.resSentEmailTo,
                // 'QAAnalysisDesc':createResponseObject.resSentEmailTo,

               
            }
        }

        this.apicallService.doPostAPIAction(apiUrl, requestBody, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }

    // formatDate(dateString): any {
    //     let dd = '';
    //     if (dateString) {
    //       if (dateString.date !== undefined) {
    //         dd = this.datePipe.transform(new Date(dateString.date.year, dateString.date.month - 1, dateString.date.day), 'yyyy-MM-dd');
    //       }
    //     }
    //     return dd;
    //   }

    createNewExternalClaim(createNewClaimObjects, successCallback, errorCallback) {
       /* if (typeof(createNewClaimObjects[4].ClosedDate) === 'object') {
            if (Object.keys(createNewClaimObjects[4].ClosedDate).length === 0) {
                createNewClaimObjects[4].ClosedDate = '';
            }
        }
        if (typeof(createNewClaimObjects[4].custDeliveryDate) === 'object') {
            if (Object.keys(createNewClaimObjects[4].custDeliveryDate).length == 0) {
                createNewClaimObjects[4].custDeliveryDate = '';
            }
        }
        if (typeof(createNewClaimObjects[3].custDefectivePicturesOfSampleReceivedDate) === 'object') {
            if (Object.keys(createNewClaimObjects[3].custDefectivePicturesOfSampleReceivedDate).length == 0) {
                createNewClaimObjects[3].custDefectivePicturesOfSampleReceivedDate = '';
            }
        }
        if (typeof(createNewClaimObjects[4].custDefectivePicturesOfSampleReceivedDate) === 'object') {
            if (Object.keys(createNewClaimObjects[4].custDefectivePicturesOfSampleReceivedDate).length == 0) {
                createNewClaimObjects[4].custDefectivePicturesOfSampleReceivedDate = '';
            }
        }*/

        const apiUrl = this.urlgeneratorService.createExternalClaimURL();
        if (createNewClaimObjects[3].custDefectiveSampleReceivedStatus === 'true') {
            createNewClaimObjects[3].custDefectivePicturesOfSampleReceivedDate = '';
        }
        this.CreateNewClaimRequestBody = {
            'CreatedBy': JSON.parse(localStorage.getItem("userData")).UserId,
            'ClaimAction': createNewClaimObjects[0].typeofSubmit,
            'ComplaintNumber': createNewClaimObjects[0].custComplaintNo,
            // 'InitiatorEmail': createNewClaimObjects[0].InitiatorEmail,
            'InitiatorDetails': {
                'InitiatorName': createNewClaimObjects[0].custInitiator,
                'InitiatorPhone': createNewClaimObjects[0].custInitiatorPhone,
                'Extension': createNewClaimObjects[0].custExtn
            },

            'CustomerDetails': {
                'CustomerName': createNewClaimObjects[1].custNameOfCustomer,
                'CustomerNumber': createNewClaimObjects[1].custCustomerNo,
                'CountryID': createNewClaimObjects[1].custCountry,
                'ContactPerson': createNewClaimObjects[1].custContactPerson,
                'FinalCustomerName': createNewClaimObjects[1].custNameOfFinalCust,
                'CustomerPhone': createNewClaimObjects[1].custCustomerPhone,
                'Extn': createNewClaimObjects[1].custExtn,
                'Email': createNewClaimObjects[1].custEmail,
                'DistributionChannelID': createNewClaimObjects[1].custDistributionChannelSelectedValue,
                'ModeOfComplaintID': createNewClaimObjects[1].custModeOFComplaintSelectedValue,
            },

            'ProductDetails': {
                'BrandID': createNewClaimObjects[2].custBrandSelectedValue,
                'SKUNumber': createNewClaimObjects[2].custSKUNo,
                'ProductDescription': createNewClaimObjects[2].custProductDescription,
                'ManufacturedBy': createNewClaimObjects[2].custManufacturedBy,
                'DeliveryNumber': createNewClaimObjects[2].custDeliveryNo,
                'NoOfDeliveredItems': createNewClaimObjects[2].custNoOfDeliveredItems,
                'NoOfDefectedItems': createNewClaimObjects[2].custNoOfDefectedItems,
                'DeliveryDate': createNewClaimObjects[4].custDeliveryDate, // createNewClaimObjects[2].custDeliveryDate,
                'ComplaintCategoryID': createNewClaimObjects[2].custComplaintCategorySelectedValue,
                'DrawingNumberRev': createNewClaimObjects[2].custDrawingNumberRev,
                'InternalSKU': createNewClaimObjects[2].internalSKUNo
            },

            'ActionRequested': {
                'IsIssueCredit': createNewClaimObjects[3].custIssueCreditStatus,
                'IsRA': createNewClaimObjects[3].custReturnAutorizationStatus,
                'IsReplacement': createNewClaimObjects[3].custReplacementStatus,
                'IsRemarks': createNewClaimObjects[3].custOtherStatus,
                'RANumber': createNewClaimObjects[3].custRAno,
                'ReturnAuthUnitCost': createNewClaimObjects[3].custPUnitCostFirstRAno,
                'ReturnAuthQuantity':createNewClaimObjects[3].custQuantityFisrtRAno,
                'ReturnAuthTotalCost':isNaN(createNewClaimObjects[3].custTotalCostFisrtRAno)?0:createNewClaimObjects[3].custTotalCostFisrtRAno,
                'ICUnitCost': createNewClaimObjects[3].custPUnitCostFirst,
                'IssueCreditAdditionalCost': createNewClaimObjects[3].additionalCostFirst,
                'ICQuantity': createNewClaimObjects[3].custQuantityFisrt,
                'ICTotalCost': isNaN(createNewClaimObjects[3].custTotalCostFisrt)?0:createNewClaimObjects[3].custTotalCostFisrt,
                'ReplacementUnitCost': createNewClaimObjects[3].custPUnitCostSecond,
                'ReplacementQuantity': createNewClaimObjects[3].custQuantitySecond,
                'ReplacementTotalCost': isNaN(createNewClaimObjects[3].custTotalCostSecond)?0:createNewClaimObjects[3].custTotalCostSecond,
                'Remarks': createNewClaimObjects[3].custSectionOthersDescription,
                'IsCommertialAction': createNewClaimObjects[3].custActionStatus,
                'ComplaintStage': createNewClaimObjects[3].custComplaintStage,
                'ComplaintDesc': createNewClaimObjects[3].custComplaintDescri,
                'IsDefSamplesReceived': createNewClaimObjects[3].custDefectiveSampleReceivedStatus,
                'IsPicDefSamplesReceived': createNewClaimObjects[3].custDefectivePicturesOfSampleReceivedStatus,
                // 'ExpectedDateToReceiveSamples': createNewClaimObjects[4].custDefectivePicturesOfSampleReceivedDate,
                'ExpDateRcvSamples': createNewClaimObjects[4].custDefectivePicturesOfSampleReceivedDate,
                // 'IsCAPAInitiated':createNewClaimObjects[3].custSelectCapa,
                'CAPAFlag':createNewClaimObjects[3].CAPAFlag,
                'ICResponsibleDepartmentId': createNewClaimObjects[3].IC_ResponsibleDepartmentId,
                'ReplacementResponsibleDepartmentId': createNewClaimObjects[3].Replmnt_ResponsibleDepartmentId,
                'TotalClaims':createNewClaimObjects[3].TotalClaims,
                'TotalAmount':createNewClaimObjects[3].TotalAmount,
            },

            'ClaimDetails': {
                'CreatedDate': createNewClaimObjects[4].CreatedDate, // createNewClaimObjects[0].CreatedDate,
                'ClosedDate': createNewClaimObjects[4].ClosedDate, // createNewClaimObjects[0].ClosedDate,
                'InvoiceNumber': createNewClaimObjects[0].custInvoiceNo,
                'SBUId': createNewClaimObjects[0].custSBUSelectedValue,
                'IsMajorClaim': createNewClaimObjects[3].custSelectClaimType,
                'ClaimTypeId': createNewClaimObjects[0].custClaimTypeSelectedValue,
                'ClaimStatusID': createNewClaimObjects[0].claimStatusID, // need to discuss
                'Notes': createNewClaimObjects[3].custNotes,
                'Feedback': createNewClaimObjects[3].custFeedbackImprovement,
                'sendEmailsTo': createNewClaimObjects[3].custSentEmailTo.toString(),
                'InvoiceValue': createNewClaimObjects[0].custInvoiceValue,
                'InvoiceCurrency': createNewClaimObjects[0].currency,
                'PONumber':createNewClaimObjects[0].PONo,
                
            }
        }
        // console.log(this.CreateNewClaimRequestBody,'this.CreateNewClaimRequestBody')
        this.apicallService.doPostAPIAction(apiUrl, this.CreateNewClaimRequestBody, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    editExternalClaim(createNewClaimObjects, successCallback, errorCallback) {
        /* if (typeof(createNewClaimObjects[4].ClosedDate) === 'object') {
             if (Object.keys(createNewClaimObjects[4].ClosedDate).length === 0) {
                 createNewClaimObjects[4].ClosedDate = '';
             }
         }
         if (typeof(createNewClaimObjects[4].custDeliveryDate) === 'object') {
             if (Object.keys(createNewClaimObjects[4].custDeliveryDate).length == 0) {
                 createNewClaimObjects[4].custDeliveryDate = '';
             }
         }
         if (typeof(createNewClaimObjects[3].custDefectivePicturesOfSampleReceivedDate) === 'object') {
             if (Object.keys(createNewClaimObjects[3].custDefectivePicturesOfSampleReceivedDate).length == 0) {
                 createNewClaimObjects[3].custDefectivePicturesOfSampleReceivedDate = '';
             }
         }
         if (typeof(createNewClaimObjects[4].custDefectivePicturesOfSampleReceivedDate) === 'object') {
             if (Object.keys(createNewClaimObjects[4].custDefectivePicturesOfSampleReceivedDate).length == 0) {
                 createNewClaimObjects[4].custDefectivePicturesOfSampleReceivedDate = '';
             }
         }*/
 
         const apiUrl = this.urlgeneratorService.editExternalClaimURL();
         if (createNewClaimObjects[3].custDefectiveSampleReceivedStatus === 'true') {
             createNewClaimObjects[3].custDefectivePicturesOfSampleReceivedDate = '';
         }
         this.CreateNewClaimRequestBody = {
             'CreatedBy': JSON.parse(localStorage.getItem("userData")).UserId,
             'ClaimAction': createNewClaimObjects[0].typeofSubmit,
             'ComplaintNumber': createNewClaimObjects[0].custComplaintNo,
             // 'InitiatorEmail': createNewClaimObjects[0].InitiatorEmail,
             'InitiatorDetails': {
                 'InitiatorName': createNewClaimObjects[0].custInitiator,
                 'InitiatorPhone': createNewClaimObjects[0].custInitiatorPhone,
                 'Extension': createNewClaimObjects[0].custExtn
             },
 
             'CustomerDetails': {
                 'CustomerName': createNewClaimObjects[1].custNameOfCustomer,
                 'CustomerNumber': createNewClaimObjects[1].custCustomerNo,
                 'CountryID': createNewClaimObjects[1].custCountry,
                 'ContactPerson': createNewClaimObjects[1].custContactPerson,
                 'FinalCustomerName': createNewClaimObjects[1].custNameOfFinalCust,
                 'CustomerPhone': createNewClaimObjects[1].custCustomerPhone,
                 'Extn': createNewClaimObjects[1].custExtn,
                 'Email': createNewClaimObjects[1].custEmail,
                 'DistributionChannelID': createNewClaimObjects[1].custDistributionChannelSelectedValue,
                 'ModeOfComplaintID': createNewClaimObjects[1].custModeOFComplaintSelectedValue,
             },
 
             'ProductDetails': {
                 'BrandID': createNewClaimObjects[2].custBrandSelectedValue,
                 'SKUNumber': createNewClaimObjects[2].custSKUNo,
                 'ProductDescription': createNewClaimObjects[2].custProductDescription,
                 'ManufacturedBy': createNewClaimObjects[2].custManufacturedBy,
                 'DeliveryNumber': createNewClaimObjects[2].custDeliveryNo,
                 'NoOfDeliveredItems': createNewClaimObjects[2].custNoOfDeliveredItems,
                 'NoOfDefectedItems': createNewClaimObjects[2].custNoOfDefectedItems,
                 'DeliveryDate': createNewClaimObjects[4].custDeliveryDate, // createNewClaimObjects[2].custDeliveryDate,
                 'ComplaintCategoryID': createNewClaimObjects[2].custComplaintCategorySelectedValue,
                 'DrawingNumberRev': createNewClaimObjects[2].custDrawingNumberRev,
                 'InternalSKU': createNewClaimObjects[2].internalSKUNo
             },
 
             'ActionRequested': {
                 'IsIssueCredit': createNewClaimObjects[3].custIssueCreditStatus,
                 'IsRA': createNewClaimObjects[3].custReturnAutorizationStatus,
                 'IsReplacement': createNewClaimObjects[3].custReplacementStatus,
                 'IsRemarks': createNewClaimObjects[3].custOtherStatus,
                 'RANumber': createNewClaimObjects[3].custRAno,
                 'ReturnAuthUnitCost': createNewClaimObjects[3].custPUnitCostFirstRAno,
                 'ReturnAuthQuantity':createNewClaimObjects[3].custQuantityFisrtRAno,
                 'ReturnAuthTotalCost':isNaN(createNewClaimObjects[3].custTotalCostFisrtRAno)?0:createNewClaimObjects[3].custTotalCostFisrtRAno,
                 'ICUnitCost': createNewClaimObjects[3].custPUnitCostFirst,
                 'IssueCreditAdditionalCost': createNewClaimObjects[3].additionalCostFirst,
                 'ICQuantity': createNewClaimObjects[3].custQuantityFisrt,
                 'ICTotalCost': isNaN(createNewClaimObjects[3].custTotalCostFisrt)?0:createNewClaimObjects[3].custTotalCostFisrt,
                 'ReplacementUnitCost': createNewClaimObjects[3].custPUnitCostSecond,
                 'ReplacementQuantity': createNewClaimObjects[3].custQuantitySecond,
                 'ReplacementTotalCost': isNaN(createNewClaimObjects[3].custTotalCostSecond)?0:createNewClaimObjects[3].custTotalCostSecond,
                 'Remarks': createNewClaimObjects[3].custSectionOthersDescription,
                 'IsCommertialAction': createNewClaimObjects[3].custActionStatus,
                 'ComplaintStage': createNewClaimObjects[3].custComplaintStage,
                 'ComplaintDesc': createNewClaimObjects[3].custComplaintDescri,
                 'IsDefSamplesReceived': createNewClaimObjects[3].custDefectiveSampleReceivedStatus,
                 'IsPicDefSamplesReceived': createNewClaimObjects[3].custDefectivePicturesOfSampleReceivedStatus,
                 // 'ExpectedDateToReceiveSamples': createNewClaimObjects[4].custDefectivePicturesOfSampleReceivedDate,
                 'ExpDateRcvSamples': createNewClaimObjects[4].custDefectivePicturesOfSampleReceivedDate,
                 // 'IsCAPAInitiated':createNewClaimObjects[3].custSelectCapa,
                 'CAPAFlag':createNewClaimObjects[3].CAPAFlag,
                 'ICResponsibleDepartmentId': createNewClaimObjects[3].IC_ResponsibleDepartmentId,
                 'ReplacementResponsibleDepartmentId': createNewClaimObjects[3].Replmnt_ResponsibleDepartmentId,
                 'TotalClaims':createNewClaimObjects[3].TotalClaims,
                 'TotalAmount':createNewClaimObjects[3].TotalAmount,
             },
 
             'ClaimDetails': {
                 'CreatedDate': createNewClaimObjects[4].CreatedDate, // createNewClaimObjects[0].CreatedDate,
                 'ClosedDate': createNewClaimObjects[4].ClosedDate, // createNewClaimObjects[0].ClosedDate,
                 'InvoiceNumber': createNewClaimObjects[0].custInvoiceNo,
                 'SBUId': createNewClaimObjects[0].custSBUSelectedValue,
                 'IsMajorClaim': createNewClaimObjects[3].custSelectClaimType,
                 'ClaimTypeId': createNewClaimObjects[0].custClaimTypeSelectedValue,
                 'ClaimStatusID': createNewClaimObjects[0].claimStatusID, // need to discuss
                 'Notes': createNewClaimObjects[3].custNotes,
                 'Feedback': createNewClaimObjects[3].custFeedbackImprovement,
                 'sendEmailsTo': createNewClaimObjects[3].custSentEmailTo.toString(),
                 'InvoiceValue': createNewClaimObjects[0].custInvoiceValue,
                 'InvoiceCurrency': createNewClaimObjects[0].currency,
                 'PONumber':createNewClaimObjects[0].PONo,
                 
             }
         }
         // console.log(this.CreateNewClaimRequestBody,'this.CreateNewClaimRequestBody')
         this.apicallService.doPostAPIAction(apiUrl, this.CreateNewClaimRequestBody, response => {
             successCallback(JSON.parse(response._body))
         }, error => {
             errorCallback(error)
         });
     }
 

    deleteAttachment(requestBody, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getDeleteAttachmentURL();
        this.apicallService.doPostAPIAction(apiUrl, requestBody, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }

    getAttachmentsCompliance(value, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getComplianceAttachment(value);
        this.apicallService.doGetAPIAction(apiUrl, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }

    getInvoiceSearchResullt(requestBody, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getInvoiceSearch();
        this.apicallService.doPostAPIAction(apiUrl, requestBody, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }

    getDistributionChannel(args,success,error){
        let api = this.urlgeneratorService.getSBUbasedDistrChannelURL(args);
        this.apicallService.doGetAPIAction(api, response => {
            success(JSON.parse(response._body))
        }, error => {
            error(error)
        });
    }

    getEmailList(successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getEmailList();
        this.apicallService.doGetAPIAction(apiUrl, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    getResponsibleDeptList(data, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getResponsibleDeptListURL();
        this.apicallService.doGetAPIAction(apiUrl, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    getClaimTypes(data, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getClaimTypesURL();
        this.apicallService.doGetAPIAction(apiUrl, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    getSBUs(data, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getExternalSBUsURL();
        this.apicallService.doGetAPIAction(apiUrl, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    getBrandList(data, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getExternalBrandListURL();
        this.apicallService.doGetAPIAction(apiUrl, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    getComplaintCategory(data, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getExternalComplaintCategoryURL();
        this.apicallService.doGetAPIAction(apiUrl, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    getModeOfComplaintList(data, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getExternalModeOfComplaintListURL();
        this.apicallService.doGetAPIAction(apiUrl, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    getExternalClaimStatus(data, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getExternalClaimStatusURL();
        this.apicallService.doGetAPIAction(apiUrl, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    getExternalClaimCategory(data, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getExternalClaimCategoryURL();
        this.apicallService.doGetAPIAction(apiUrl, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
    deleteExternalAttachment(requestBody, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.deleteExternalAttachmentURL();
        this.apicallService.doPostAPIAction(apiUrl, requestBody, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
}
