import { LightningElement,wire,track, api } from 'lwc';
//import getCourses from '@salesforce/apex/StudentPortalCourseSeachPageCtrl.getCourses';
//import appliedFinanceImage from '@salesforce/resourceUrl/AppliedFinance';
//import financePlanningImage from '@salesforce/resourceUrl/FinancePlanning';
import getLoginURL from '@salesforce/apex/StudentPortalCourseSeachPageCtrl.getLoginURL';
import strUserId from '@salesforce/user/Id';
import userName from '@salesforce/schema/User.FirstName';
import {getRecord} from 'lightning/uiRecordApi';
import KpCoursepage from '@salesforce/label/c.KpCoursepage';
import KpCoursepageWelcome from '@salesforce/label/c.KpCoursepageWelcome';
import KpPrtalCourseSelect from '@salesforce/label/c.KpPrtalCourseSelect';

export default class StudentPortalCoursePageLwc extends LightningElement {
    label={
        KpCoursepage,
        KpCoursepageWelcome,
        KpPrtalCourseSelect
        };
    
    @track usrName;
    @api userSelectCourse={};
    //finImage = financePlanningImage;
    //appImage = appliedFinanceImage;
    UserId = strUserId;
    baseUrl;
    @track imageUrl;
    @track selCou = [];
    @wire(getRecord, {
        recordId: strUserId,
        fields: [userName]
    }) wireuser({
        error,
        data
    }) {
        if (error) {
           this.error = error ; 
        } else if (data) {
            console.log('data',data);
            this.usrName =data.fields.FirstName.value;        
        }
    }

    connectedCallback(){
        this.getBaseUrl();   
        console.log('this baseURL',this.baseUrl);
        //this.imageUrl = this.baseUrl+'/sfc/servlet.shepherd/version/download/0689D000001EPw2QAG';
        this.imageUrl = this.baseUrl+'/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId=0689D000001EPw2QAG&operationContext=CHATTER&contentId=0699D000001IJEMQA4';
        console.log('Image URL'+this.imageUrl); 
        // getCourses({ searchKey : '',usrId: strUserId})
        //     .then((result) => {
                
        //          console.log('result==>',result);
        //     })
        //     .catch((error) => {
        //         console.log('error',error);
        //     });

    }

    getBaseUrl(){
        //this.baseUrl = 'https://'+location.host+'/';
        getLoginURL()
        .then(result => {
            this.baseUrl = result;
            window.console.log('Base URL in method',this.baseUrl);
        })
        .catch(error => {
            console.error('Error: \n ', error);
        });
        
    }

    @track getCSelVal;
    @track isSalesToken = false;
    @track trainingM;
    @track showC;
    passDataToCart(event){ console.log("event called in parent", event.detail.showMsg, event.detail.selCourses);
        console.log('In Parent Manger',event.detail.trainingM);    
        this.getCSelVal = event.detail.showMsg;
        this.selCou = event.detail.selCourses;
        this.isSalesToken = event.detail.isSToken;
        this.trainingM = event.detail.trainingM;
    }

    passKeytoTile(event){
        console.log("event called in parent for search", event.detail.searchKey);
        this.template.querySelector('c-student-portal-course-tiles-lwc').searchcourses(event);
        this.template.querySelector('c-student-portal-course-cart-lwc').setsearchkey(event);
    }

    passFiltertoTile(event){
        console.log("event called in parent for search filter", event.detail);
        this.template.querySelector('c-student-portal-course-tiles-lwc').searchcourses(event);
    }

    passCIdToTile(event){
        console.log("event called in parent for remove course", event.detail.removeCourseId);
        this.template.querySelector('c-student-portal-course-tiles-lwc').removeCourse(event);
    }

    removeCourseCart(event){
        console.log("event called in parent for remove Cart", event.detail.removeCourses);
        this.template.querySelector('c-student-portal-course-tiles-lwc').removeCart(event);
    }
    removeSalesTokenCourseCart(event){
        this.template.querySelector('c-student-portal-course-tiles-lwc').removeSalesTokenCart(event);
    }
    passPopUpValToTile(event){
        console.log("event called in parent for popup", event.detail.isPopUpOpen);
        this.template.querySelector('c-student-portal-course-tiles-lwc').adjustTile(event);
        this.template.querySelector('c-student-portal-course-cart-lwc').adjustCartTile(event);
    }
}