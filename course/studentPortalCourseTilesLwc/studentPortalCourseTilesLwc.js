import { LightningElement,track,api,wire } from 'lwc';
import getCourses from '@salesforce/apex/StudentPortalCourseSeachPageCtrl.getCourses';
import getTrainingManager from '@salesforce/apex/StudentPortalCourseSeachPageCtrl.fetchTrainingManager';
import strUserId from '@salesforce/user/Id';
import MasterFinancial from '@salesforce/resourceUrl/MasterFinancial';
import communityBasePath from '@salesforce/community/basePath';
import { CurrentPageReference } from 'lightning/navigation';
import KpCourseTilefee from '@salesforce/label/c.KpCourseTilefee';
import KpCourseTileEnroll from '@salesforce/label/c.KpCourseTileEnroll';
import KpCourseTileLearn from '@salesforce/label/c.KpCourseTileLearn';
import KpCourseTileload from '@salesforce/label/c.KpCourseTileload';
import KpCourseTileValue from '@salesforce/label/c.KpCourseTileValue';

export default class StudentPortalCourseTilesLwc extends LightningElement {
    label={
        KpCourseTilefee,
        KpCourseTileEnroll,
        KpCourseTileLearn,
        KpCourseTileload,
        KpCourseTileValue
        };
    @track masterFin = MasterFinancial;
    @track selectBtnLabel = "Select";
    @track isHigherEdu = false;
    @track dataArr =[];
    @api isCourseSelected;
    @api noOfCourse;
    @track imageUrl;
    @track indexCourse = 6;
    @track courseData = [];
    @track selcourseData = [];
    @track results = [];
    @track resultslen;
    @track isModelOpen = false;
    @track noSearchVal;
    @track isSalesToken = false;
    @track isLoading = false;
    expId = null;
    coursecode = null;
    @wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
        console.log('currentPage Ref'+currentPageReference.state);
       if (currentPageReference) {
          this.urlStateParameters = currentPageReference.state;
          this.setParametersBasedOnUrl();
       }
    }

    setParametersBasedOnUrl() {
        console.log('url state Ref'+this.urlStateParameters.expId,this.urlStateParameters.coursecode);
        this.expId = this.urlStateParameters.expId || null;
        this.coursecode = this.urlStateParameters.coursecode || null;
     }
    
        connectedCallback() {
            this.isLoading = true;
            this.getResultData();
            this.imageUrl = '/sfc/servlet.shepherd/version/download/0689D000001EPw2QAG';
            this.isLoading = false;
        }   

        getResultData(){
            let srchKey = '';
            if(this.coursecode != null){
                srchKey = this.coursecode;
            }
            getCourses({ searchKey : srchKey,usrId: strUserId})
            .then((result) => {
                 //this.results = result;
                 this.results = result.sort(
                    (rec1, rec2) => rec1.sequenceNumber.localeCompare(rec2.sequenceNumber)
                   );
                 this.resultslen = result.length;
                 console.log('result',result);
                 console.log('updated result',this.results);
                 this.results.map(data => {
                    if(data.courseType === "Higher Education"){
                        data.isHigherEdu = true;
                    }
                    else{
                        data.isHigherEdu = false;
                    }

                    if(!data.courseImage){
                        data.courseImage = '';
                    }else{
                       data.courseImage = '/sfc/servlet.shepherd/version/download/' + data.courseImage;
                    }
                    
                    if(!data.courseLearnMore){
                        data.courseLearnMore = '';
                    }else{
                        console.log('loaded url',data.courseLearnMore);
                    }
                });
                // console.log('result after==>',result);
                this.loadMoredata(this.indexCourse);
            })
            .catch((error) => {
                console.log('error',error);
            });
        }
        
        backgroundImageUrl() {
            let valuePass='';
            console.log('In background image',this.results.length,this.courseData.length);
            this.results.forEach(item => {
                console.log("item:", JSON.stringify(item), item.courseId);
                    const backgroundDiv = this.template.querySelector('[data-item = "'+item.courseId+'"]');
                    console.log("backgroundDiv...", backgroundDiv);
                    //valuePass = '/sfc/servlet.shepherd/version/download/'+item.courseImage;
                    valuePass = item.courseImage;
                    console.log("valuePass..", valuePass);
                    // backgroundDiv.style.backgroundImage = `url("${valuePass}")`;       
                    backgroundDiv.style.backgroundImage = `linear-gradient(to bottom, rgba(33, 33, 33, 0.4), rgba(33, 33, 33, 0.4)), url("${valuePass}")`;        
            });
            // console.log('valuePass', valuePass);
            // return `background-image: url("${valuePass}")`;
            //const imageUrl = '/sfc/servlet.shepherd/version/download/0689D000001EUWlQAO';  
        }
       
        loadMoredata(indexVal){
            console.log('In Load more data',this.results.length,this.courseData.length);
            this.results.forEach(data => {
                if(this.courseData.length < indexVal){
                    this.courseData.push(data); 
                }
            });
            if(this.resultslen <= 6){
                this.template.querySelector('[data-id ="loadBtnId"]').classList.add('slds-hide');
            }
            setTimeout(() => {this.adjustTileOnPopUp(this.isModelOpen);}, 1);  
            setTimeout(() => {this.backgroundImageUrl();}, 1);    
        }  
        handleLoad(){
            console.log('In handle load',this.results.length,this.courseData.length);
            let arrayLen = this.courseData.length + 6;
            for(let i=this.courseData.length; i<arrayLen && i<this.results.length; i++){
                 this.courseData.push(this.results[i]);
            }
            if(this.courseData.length === this.results.length){
             this.template.querySelector('[data-id ="loadBtnId"]').classList.add('slds-hide');
            }
            setTimeout(() => {this.adjustTileOnPopUp(this.isModelOpen);}, 1); 
            setTimeout(() => {this.backgroundImageUrl();}, 1);                  
         }
         handleLearnMore(event){
            window.open(event.target.dataset.item, '_blank')
         }
        handleSelect(event){

            // if(event.target.innerText === "Select"){
            //     event.target.innerText = "Selected";
            //     this.results.forEach(data =>  {
            //         if(event.target.dataset.id === data.courseId){
            //             this.dataArr.push(data);
            //         } 
            //     });
            //     this.checkCourseSelected(this.dataArr);
            // }
            // else if(event.target.innerText === "Selected"){
            //     event.target.innerText = "Select";
            //     this.dataArr = this.dataArr.filter(data =>  event.target.dataset.id !== data.courseId);
            //     this.checkCourseSelected(this.dataArr);
            // }

            this.results.forEach(data =>  {
                if(event.target.dataset.id === data.courseId){
                    let courseAdded = false;
                    this.dataArr.forEach(item => {
                        if(item.courseId === data.courseId){
                            courseAdded = true;
                        }
                    });
                    if(!courseAdded){
                        this.dataArr.push(data);
                    }
                    
                } 
            });
            this.checkCourseSelected(this.dataArr);
            window.scrollTo(100,300);
        }
        handleEnroll(event){
            event.preventDefault();
            console.log('Enrol for Course ID',event.target.dataset.id,communityBasePath);
            console.log('Redirect URL'+window.location.origin + communityBasePath + '/' + 'submitapplication?courseId='+event.target.dataset.id);
            window.location.href = window.location.origin + communityBasePath + '/' + 'submitapplication?courseId='+event.target.dataset.id;
        }
        checkCourseSelected(data){ 
            const passEvent = new CustomEvent('coursesel' ,{
                detail: {
                    showMsg: true,
                    selCourses: JSON.parse(JSON.stringify(data)),
                    isSToken: this.isSalesToken,
                    trainingM: this.trainingManager
                }
            });
            this.dispatchEvent(passEvent);
        }
        @api
        removeCourse(event){
            this.dataArr = this.dataArr.filter(data =>  event.detail.removeCourseId !== data.courseId);
            //this.template.querySelector('[data-id = "'+event.detail.removeCourseId+'"]').innerText = 'Select';
        }
        @api
        removeCart(event){
            // this.dataArr.forEach(data =>  {
            //     this.template.querySelector('[data-id = "'+data.courseId+'"]').innerText = 'Select';
            // });
            this.dataArr = [];
        }
        @api
        removeSalesTokenCart(event){
            this.isSalesToken = false;
            this.dataArr = [];
            this.checkCourseSelected(this.dataArr);
            setTimeout(() => { this.getResultData();}, 0.1);
            
        }

        @track trainingManager;
        @api
        searchcourses(event){
            console.log('filter details in tiles',event.detail.searchKey,event.detail.studyArea,event.detail.isVH);
            getCourses({ searchKey : event.detail.searchKey,usrId: strUserId,studyArea: event.detail.studyArea,isHEVE: event.detail.isVH})
            .then((result) => {
                if(event.detail.searchKey.includes('KST-')){
                    this.isSalesToken = true;
                    console.log('Results length in sales token',result.length);
                    getTrainingManager({searchKey:event.detail.searchKey})
                    .then((res) => {
                        console.log('Training Manger Name',res);
                        this.trainingManager = res;
                            this.dataArr = [];
                        result.forEach(data =>  {
                            this.dataArr.push(data);
                        });
                        this.checkCourseSelected(this.dataArr);
                    })
                    .catch((err) => {
                        console.log('error',err);
                    });
                    
                }else{
                    this.isSalesToken = false;
                    //this.dataArr = [];
                    //this.checkCourseSelected(this.dataArr);
                    //this.results = result;
                    this.results = result.sort(
                        (rec1, rec2) => rec1.sequenceNumber.localeCompare(rec2.sequenceNumber)
                       );
                    console.log('Results length',result.length,JSON.parse(JSON.stringify(this.results)));
                    
                    this.courseData = [];
                    
                    this.resultslen = result.length;
                    this.results.map(data => {
                        if(data.courseType === "Higher Education"){
                            data.isHigherEdu = true;
                        }
                        else{
                            data.isHigherEdu = false;
                        }

                        if(!data.courseImage){
                            data.courseImage = '';
                        }else{
                        data.courseImage = '/sfc/servlet.shepherd/version/download/' + data.courseImage;
                        //data.courseImage= `url(${'/sfc/servlet.shepherd/version/download/' + data.courseImage})` ;
                        console.log('loaded images',data.courseImage);
                        }
                        
                        if(!data.courseLearnMore){
                            data.courseLearnMore = '';
                        }else{
                            console.log('loaded url',data.courseLearnMore);
                        }

                        
                    });
                    setTimeout(() => { this.displayResults();}, 0.1);
                }
                 
            })
            .catch((error) => {
                console.log('error',error);
            });
        }
        renderedCallback(){
            // setTimeout(() => {this.backgroundImageUrl();}, 2);  
            //this.backgroundImageUrl();
        }
        displayResults(){
            this.template.querySelector('[data-id ="loadBtnId"]').classList.remove('slds-hide');
            this.indexCourse = 6;
            this.loadMoredata(this.indexCourse);

            if(this.resultslen == 0){
                this.template.querySelector(".searchText").classList.remove('searchValue');
            }else{
                this.template.querySelector(".searchText").classList.add('searchValue');
            }
        }
        @api
        adjustTile(event){
           console.log("event.detail.isPopUpOpen", event.detail.isPopUpOpen);
           this.isModelOpen = event.detail.isPopUpOpen;
           this.adjustTileOnPopUp(this.isModelOpen);
        }
        adjustTileOnPopUp(popUpValue){
           const tileWrapper= this.template.querySelector('[data-id ="tile-wrapper"]');
           const tileCard= this.template.querySelectorAll('.card-container');
           const loadButton = this.template.querySelector('[data-id = "loadBtnId"');
           if(this.template.querySelector('[data-id = "noSearch"]') !== undefined &&
           this.template.querySelector('[data-id = "noSearch"]') !== null && 
           this.template.querySelector('[data-id = "noSearch"]') !== ""){
                this.noSearchVal = this.template.querySelector('[data-id = "noSearch"]');
           }
           
           if(popUpValue){
                if(!tileWrapper.classList.contains('active')){
                    tileWrapper.classList.add('active');
                }  
                if(this.noSearchVal !==undefined && this.noSearchVal !== null){
                    this.noSearchVal.classList.add('active');
                }             
                tileCard.forEach(item => { 
                    item.classList.add('active');
                });
                loadButton.classList.add('active');
           } else{ 
                tileWrapper.classList.remove('active');
                tileCard.forEach(item => {
                    item.classList.remove('active');
                });
                loadButton.classList.remove('active');
                if(this.noSearchVal !==undefined && this.noSearchVal !== null){
                    this.noSearchVal.classList.remove('active');
                } 
           }
        }

}