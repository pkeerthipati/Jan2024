import { LightningElement, api, track } from 'lwc';
import KpPortalcart from '@salesforce/label/c.KpPortalcart';
import KpPortalremove from '@salesforce/label/c.KpPortalremove';
import KpCourseCartMessage from '@salesforce/label/c.KPCourseCartMessage';
import KpCourseCartTM from '@salesforce/label/c.KpCourseCartTM';
import KpCourseCartCancel from '@salesforce/label/c.KpCourseCartCancel';
import createEnrol from '@salesforce/apex/StudentPortalCourseSeachPageCtrl.createEnrolment';
import communityBasePath from '@salesforce/community/basePath';

export default class StudentPortalCourseCartLwc extends LightningElement {
    label={
        KpPortalcart,
        KpPortalremove,
        KpCourseCartMessage,
        KpCourseCartTM,
        KpCourseCartCancel

        };
    @track showCart = false;
    @track salesToken = false;
    @track coursedata = [];
    @track isModelOpen = false;
    @track trainingManagerName;
    @track isLoading = false;
    @api
    get courseS() {
    
    }
    set courseS(value) {
        console.log('Inside cart',value);
        this.coursedata = value;
        if(this.coursedata.length > 0){
            this.showCart = true;
            setTimeout(() => {this.adjustTileOnPopUp(this.isModelOpen);}, 0.01); 
        }else{
            this.showCart = false;
        }
    }

    @api
    get issalest() {
    
    }
    set issalest(value) {
        console.log('Is Sales Token',value);
        this.salesToken = value;
        console.log('Inside Is sales token',this.coursedata);
    }

    @api
    get trainingmanager(){

    }
    set trainingmanager(value){
        console.log('Traning in cart',value);
        this.trainingManagerName = value;
    }

    @api
    get getCourseSelVal() {
    
    }
    set getCourseSelVal(value) {
        console.log('Inside cart show message',value);
        this.showCart = value;
    }
   
    renderedCallback(){
        console.log("render call back is called....", this.isModelOpen);
    }
    @api adjustCartTile(event){
        console.log("called whenever popup value is changed");
        this.isModelOpen = event.detail.isPopUpOpen;
        this.adjustTileOnPopUp(this.isModelOpen);
    }
    adjustTileOnPopUp(modelValue){
        let adjustCart = this.template.querySelector(".multiVal-container");
        if(adjustCart !== undefined && adjustCart !== null && adjustCart !== ""){
            if(modelValue){
                adjustCart.classList.add('active');
            } else{
                adjustCart.classList.remove('active');
            }
        }
    }
    @track isSalesToken = false;
    @track saleToken;
    @api
    setsearchkey(event){
        console.log('filter details in cart',event.detail.searchKey,event.detail.studyArea,event.detail.isVH);
        if(event.detail.searchKey.includes('KST-')){
            this.isSalesToken = true;
            this.saleToken = event.detail.searchKey;
        }else{
            this.isSalesToken = false;
        }
    }

    removeCourse(event){
        console.log('Inside remove select',event.target.dataset.id);
        let selCourseToRemove;
        this.coursedata.forEach(data =>  {
            if(event.target.dataset.id === data.courseId){
                selCourseToRemove = data.courseId;
            } 
        });
        this.coursedata = this.coursedata.filter(data =>  event.target.dataset.id !== data.courseId);
        if(this.coursedata.length == 0){
            this.showCart = false;
        }
        console.log('remove course',selCourseToRemove);
        const passEvent = new CustomEvent('removecourse' ,{
            detail: {
                removeCourseId: selCourseToRemove
            }
        });
        this.dispatchEvent(passEvent);
    }

    handleRemoveSelection(){
        this.coursedata = [];
        this.showCart = false;
        console.log('course data length',this.coursedata.length);
        const passEvent = new CustomEvent('removecart' ,{
            detail: {
                removeCourses: true
            }
        });
        this.dispatchEvent(passEvent);
    }
    handleSalesCancel(){
        
        this.coursedata = [];
        this.showCart = false;
        const passEvent = new CustomEvent('removesalestokencart' ,{
            detail: {
                removeSalesTCart: true
            }
        });
        this.dispatchEvent(passEvent);
    }
    handleEnroll(event){
        this.isLoading = true;
        console.log('Inside start enrol;==>',this.coursedata,event.target.dataset.id);
        let id = event.target.dataset.id;
        let courseIds = '';
        this.coursedata.forEach(data =>  {
            courseIds = courseIds + data.courseId + ';';
        });
        console.log('Inside start enrol',courseIds);
        
        createEnrol({courseIds:courseIds,isST:this.isSalesToken,saleToken:this.saleToken})
        .then((result) => {
            console.log('Enrolment Id',result);
            console.log('event.target.dataset.id',id);
            if(id === 'veenrol'){
                window.location.href = window.location.origin + communityBasePath + '/' + 'submitapplicationve?enrolId='+result;
            }
            console.log('event.target.dataset.id',id);
            if(id === 'stenrol'){
                
                window.location.href = window.location.origin + communityBasePath + '/' + 'submitapplicationst?enrolId='+result;
            }
        })
        .catch((error) => {
            console.log('error',error);
            this.isLoading = false;
        });
        
    }
    salesCartData = 
        { 
            salesToken : 'KST:1234',
            courses : [
                {
                    courseId: '1',
                    courseName: 'Master of Applied Finance'
                },
                {
                    courseId: '2',
                    courseName: 'Graduate Diploma in Finance planning'
                },
                {
                    courseId: '3',
                    courseName: 'Masters in Finance planning'
                }
            ],
            trainingManager : "XYZ" 
        };
}