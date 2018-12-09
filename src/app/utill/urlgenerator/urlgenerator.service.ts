import { Injectable } from '@angular/core';
import { Constant } from '../constants/constant';
import { ApicallService } from '../apicall/apicall.service';
import { AsyncLocalStorage } from 'angular-async-local-storage';
import { LocationStrategy } from '@angular/common';


@Injectable()
export class UrlgeneratorService {
    private baseURL = '';
    public userEmail;

    constructor(
        private constant: Constant,
        public apicallService: ApicallService,
        protected storage: AsyncLocalStorage,
        private location: LocationStrategy
    ) {


        this.baseURL = this.constant.baseURL;
        //    this.baseURL = 'http://10.15.0.33:8081/';     //ARC CAR STAGING Api
        // this.baseURL='http://testclaims.arc-intl.com/8080';

    }

    /**
     * @desc Get URL for Create new claim dropdown data API
     **/
    getListCreateNewDropDowndataURL() {
        return this.baseURL + 'api/lookup';
    }

    /**
     * @desc Get URL for country list dropdown data API
     **/
    getCountryListURL() {
        return this.baseURL + 'api/external/Country';
    }
    /**
     * @desc Get URL for Classification Of Complaint list dropdown data API
     **/
    getClassificationOfComplaintURL() {
        return this.baseURL + 'api/lookup/ComplaintClass';
    }
    /**
     * @desc Get URL for Manufacturing Process list dropdown data API
     **/
    getManufacturingProcessURL() {
        return this.baseURL + 'api/lookup/ManufactureProcess';
    }

    /**
     * @desc Get URL for Defect Type list dropdown data API
     **/
    getDefectTypeURL() {
        return this.baseURL + 'api/lookup/DefectTypes';
    }

    /**
     * @desc Get URL for Creane new claim API
     **/
    createExternalClaimURL() {
        return this.baseURL + 'api/external/CreateClaim';
    }

    /**
     * @desc Get URL for Search claim API
     **/
    getExternalSearchClaimURL() {
        return this.baseURL + 'api/external/searchClaim';
    }

    getExternalClaimPDFURL() {
        return this.baseURL + 'api/GetPDF';
    }

    getClaimTypeListURL() {
        return this.baseURL + 'api/internal/GetClaimTypes';
    }

    getClaimStatusListURL() {
        return this.baseURL + 'api/internal/InternalClaimStatus';
    }

    getInternalSearchClaimURL() {
        return this.baseURL + 'api/internal/searchClaim';
    }

    getInternalClaimPDFURL(id) {
        return this.baseURL + 'api/internal/AccidentDeclaration/GetClaimPDF?ReferenceNo=' + id;
    }

    getInternalAccidentClaimPrintPreviewURL() {
         return this.baseURL + 'api/internal/AccidentDeclaration/printPreview';
    }

    createCapaURL(val) {
        return this.baseURL + 'api/capa/createCAPA?ComplaintNumber=​' + val;
    }

    /**
     * @desc Get URL for Search claim API
     **/
    getExternalClaimDetailsURL(val) {
        return this.baseURL + 'api/external/ClaimDetails?CompliantNumber=' + val;
    }

    getcreateCapaURL() {
        return this.baseURL + 'api/capa/createCAPA' ;
    }

    /**
     * @desc Get URL for Search claim API
     **/
    getCreateRespondDetailsURL() {
        return this.baseURL + 'api/submitClaimResponse';
    }

    /**
     * @desc Get URL for Search claim API
     **/
    getRespondDetailsURL(val) {
        return this.baseURL + 'api/external/Validation/' + val;
    }

    /**
     * @desc Get URL for Search claim API
     **/
    getDeleteAttachmentURL() {
        return this.baseURL + 'api/DeleteFile';
    }
    deleteExternalAttachmentURL() {
        return this.baseURL + 'api/external/DeleteFile';
    }

    // Below URL not using in the application, added for just reffernce

    /**
     * @desc Get URL for login API
     **/
    getLoginUserAuthURL(creds) {
        return this.baseURL + 'oauth/token?grant_type=password&username=' + creds.username + '&password=' + creds.password;
    }

    getLoginUserURL(creds) {
        return this.baseURL + 'api/login';
    }

    getAccessLevelURL() {
        return this.baseURL + 'api/UserModuleTransactions';
    }

    getAllDomainURL() {
        return this.baseURL + 'api/GetAllDomains';
    }

    /**
     * @desc Get URL for forgot password
     **/
    getForgotPasswordURL() {
        return this.baseURL + 'api/forgotPassword';
    }

    /**
     * @desc Get URL for reset password
     **/
    getResetPasswordURL() {
        return this.baseURL + 'api/resetPassword';
    }

    /**
     * @desc Get URL for dashboard details
     **/
    getDashboardDetailsURL(userEmail) {
        return this.baseURL + 'api/getDashBoardDetails/' + userEmail;
    }


    /**
     * @desc Get URL for Create Admin User
     **/
    getListAdminUserURL() {
        return this.baseURL + 'api/getListAdminUser';
    }

    /**
     * @desc Get URL for Create Admin User
     **/
    getCreateAdminUserURL() {
        return this.baseURL + 'api/createAdminUser';
    }

    /**
     * @desc Get URL for Create Admin User
     **/
    getUpdateAdminUserURL() {
        return this.baseURL + 'api/updateAdminUser';
    }

    /**
     * @desc Get URL for Delete Admin User
     **/
    getDeleteAdminUserURL() {
        return this.baseURL + 'api/deleteAdminUser';
    }
    getDepartmentListURL() {
        return this.baseURL + 'api/lookup/departments';
    }
    getExternalBrandListURL() {
        return this.baseURL + 'api/external/BrandList';
    }
    getcapaDetails(capaID) {
        return this.baseURL + 'api/capa/getCAPADetails/' + capaID;
    }
    submitCapaURL() {
        return this.baseURL + 'api/capa/submitCAPA';
    }
    getanalysisQuestionsURL() {
        return this.baseURL + 'api/why/getAnalysisQuestions';
    }
    postAnalysisAnswers() {
        return this.baseURL + 'api/why/postAnalysisQuestions';
    }
    getanalysisAnswersURL(capaID) {
        return this.baseURL + 'api/why/getAnswersList/' + capaID;
    }
    getComplianceAttachment(val) {
        return this.baseURL + 'api/getComplainceAttachment/' + val;
    }
    getInvoiceSearch() {
        return this.baseURL + 'api/invoice/searchInvoice';
    }
    getSearchCAPA() {
        return this.baseURL + 'api/capa/searchCAPA';
    }
    getSBUbasedDistrChannelURL(args) {
        return this.baseURL + 'api/external/DistributionChannelList/' + args;
    }
    getCapaActionStatus() {
        return this.baseURL + 'api/lookup/CAPAActionStatus';
    }
    getCapaForMinorClaimListURL() {
        return this.baseURL + 'api/capa/MinorClaimsForCAPA';
    }

    // Internal claim
    getTypeofEmployment() {
        return this.baseURL + 'api/internal/EmployementType';
    }
    getInjuryLocation() {
        return this.baseURL + 'api/internal/InjuryLocation';
    }
    getInjuryNature() {
        return this.baseURL + 'api/internal/InjuryNature';
    }
    getSendToEmail() {
        return this.baseURL + 'api/internal/SendTo';
    }
    getInternalClaimStatus() {
        return this.baseURL + 'api/internal/InternalClaimStatus';
    }
    accidentClaimCreate() {
        return this.baseURL + 'api/internal/createAccidentDeclaration';
    }
    accidentClaimGet(id) {
        return this.baseURL + 'api/internal/GetClaim?ReferenceNo='+id;
    }
    accidentClaimUpdate() {
        return this.baseURL + 'api/internal/editAccidentDeclaration';
    }
    getLanguageList() {
        return this.baseURL +'api/home/Languages';
    }
    UploadAccidentFile(id) {
        return this.baseURL +'api/internal/UploadAccidentFile?ReferenceNo='+id;
    }
    deleteAccidentAttachment() {
        return this.baseURL +'api/internal/DeleteAccidentFile';
    }

    getEmailList(){
        return this.baseURL + 'api/common/EmailList';
    }

    getResponsibleDeptListURL() {
        return this.baseURL + 'api/external/GetResponsibleDepartmentList';
    }

    deleteExternalClaimURL() {
        return this.baseURL + 'api/external/DeleteClaim';
    }
    
    deleteInternalClaimURL(){
        return this.baseURL + 'api/internal/DeleteClaim';
    }

    getClaimTypesURL(){
        return this.baseURL + 'api/external/ClaimTypes';
    }

    getExternalSBUsURL(){
        return this.baseURL + 'api/external/SBUList';
    }

    getExternalComplaintCategoryURL(){
        return this.baseURL + 'api/external/ComplaintCategory';
    }

    getExternalModeOfComplaintListURL(){
        return this.baseURL + 'api/external/ModeOfComplaintList';
    }

    getExternalClaimStatusURL(){
        return this.baseURL + 'api/external/ClaimStatus';
    }

    getExternalClaimCategoryURL(){
        return this.baseURL + 'api/external/ClaimCategory';
    }
    getHazardNature(){
        return this.baseURL + 'api/internal/GetHazardNature';
    }

    getEstimatedPriority(){
        return this.baseURL + 'api/internal/GetEstimatedPriority';
    }
 
    // createHazardClaim() {
    //     return this.baseURL + 'api/internal/createAccidentDeclaration';
    // }
    getHazardClaim(id) {
        return this.baseURL + 'api/internal/HazardIdentification/'+id;
    }
    hazardClaimUpdate() {
        return this.baseURL + 'api/internal/EditHazardIdentification';
    }
    hazardClaimCreate() {
        return this.baseURL + 'api/internal/CreateHazardIdentification';
    }

    uploadHazardFile(id) {
        return this.baseURL +'api/internal/UploadHazardFile?ReferenceNo='+id;
    }
    getHazardClaimPDFURL(id) {
        return this.baseURL + 'api/internal/Hazard/GetClaimPDF/'+id
    }
    editExternalClaimURL(){
        return this.baseURL + 'api/external/EditClaim';
    }

    deleteHazardAttachment() {
        return this.baseURL +'api/internal/DeleteHazardFile';
    }

    getInternalHazardClaimPrintPreviewURL() {
        return this.baseURL + 'api/internal/HazardIdentification/printPreview';
   }

}
