import { LightningElement, track, wire } from 'lwc';
import studyArea from '@salesforce/schema/Course__c.Study_Area__c';
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';
import KpCourseSearch from '@salesforce/label/c.KpCourseSearch';
import KpCourseSearchback from '@salesforce/label/c.KpCourseSearchback';
import KpCourseSearchclear from '@salesforce/label/c.KpCourseSearchclear';
import KpCourseSearchStudy from '@salesforce/label/c.KpCourseSearchStudy';
import KpCourseSearchtype from '@salesforce/label/c.KpCourseSearchtype';
import KpCourseSearchEdu from '@salesforce/label/c.KpCourseSearchEdu';
import KpCourseVocational from '@salesforce/label/c.KpCourseVocational';
import KpCourseresult from '@salesforce/label/c.KpCourseresult';
import KpCourseSearchSale from '@salesforce/label/c.KpCourseSearchSale';
import InformationIcon from '@salesforce/resourceUrl/InformationIcon';

export default class StudentPortalCourseSearchLwc extends LightningElement {
    label={
        KpCourseSearch,
        KpCourseSearchback,
        KpCourseSearchclear,
        KpCourseSearchStudy,
        KpCourseSearchtype,
        KpCourseSearchEdu,
        KpCourseVocational,
        KpCourseresult,
        KpCourseSearchSale
        };
    @track openModal = false;
    @track studyareaValues;
    @track searchkey = '';
    @track studyareavalueselected ={};
    @track educationvalueSelected = {};
    @track isEducationValue;
    @track infoIcon = InformationIcon;
    searchKeyword(event){
        console.log('Inside search key pressed',this.searchkey,event.target.value);
        this.searchkey = event.target.value;
        if(event.keyCode === 13){
            console.log('Inside calling search',this.searchkey);
            
            this.searchResults();
        }
        
    }

    @wire(getPicklistValues, { recordTypeId: '012D00000003H09', fieldApiName: studyArea })
    studyAreaPicklistValues({error, data}){
        console.log('data',data);
        if(data){
            this.studyareaValues = data.values;
            console.log('Study Area values',this.studyareaValues,data.values);
            data.values.forEach(item => {
                console.log('Inside data value',item.label);
                let keyVal = item.label;
                this.studyareavalueselected[keyVal] = false;
            });
            console.log('Study Area selected array',JSON.stringify(this.studyareavalueselected));

        }else if(error){
        	console.log(error);
        }
    };

    connectedCallback(){
        console.log('Inside Search callback');       
    }
    renderedCallback(){
        if(this.openModal){
            console.log("render callback is called");
            this.loopCheckBox();
        }
    }
    searchResults(){
        console.log('Search Keyword Results',this.searchkey);
        console.log('JS Updated');
        this.prepareFilters();
        const passEvent = new CustomEvent('searchcourse' ,{
            detail: {
                searchKey: this.searchkey,
                studyArea: this.studyA,
                isVH: this.isHEVE
            }
        });
        this.dispatchEvent(passEvent);
    }
    openPopUp(){ 
        if(!this.openModal){
            this.openModal = true;
            console.log('Inside popup');
            let hideHamburgerBox = this.template.querySelector("[data-id='hamburgerBox']");
            hideHamburgerBox.classList.add('slds-hide');
            let adjustSearchBox = this.template.querySelector('.search-box');
            adjustSearchBox.classList.add('active');
            let informationBox = this.template.querySelector('.tooltiptext');
            informationBox.classList.add('active');
        } else{
            this.openModal = false;
        }
        this.passEventToTile(this.openModal);
    }
    loopCheckBox(){
        let inputB = this.template.querySelectorAll('.studyareacheckbox');
            inputB.forEach(item => {
                console.log('Inside open popup 1==>',item.name,item.checked);
                item.checked = this.studyareavalueselected[item.name];
                console.log('Inside open popup==>',item.name,item.checked);
            });
        console.log("this.educationvalueSelected...in loopcheckbox", JSON.stringify(this.educationvalueSelected));
        let inputC = this.template.querySelectorAll('.educheckbox');
            inputC.forEach(item => {
                console.log('Checkbox Education==>',item.name,item.checked);
                    item.checked = this.educationvalueSelected[item.name];
        });
    }
    handleBack(){
        this.openModal = false;
        let hideHamburgerBox = this.template.querySelector("[data-id='hamburgerBox']");
        hideHamburgerBox.classList.remove('slds-hide');
        hideHamburgerBox.classList.add('slds-show');
        let adjustSearchBox = this.template.querySelector('.search-box');
        adjustSearchBox.classList.remove('active');
        let informationBox = this.template.querySelector('.tooltiptext');
        informationBox.classList.remove('active');
        this.passEventToTile(this.openModal);
    }
    passEventToTile(modelValue){
        const passEvent = new CustomEvent('popupopen' ,{
            detail: {
                isPopUpOpen:  modelValue
            }
        });
        this.dispatchEvent(passEvent);
    }
    
    toggleHV(event){
        let hEdu = this.template.querySelector('[data-id="highEducation"]');
        let vEdu = this.template.querySelector('[data-id="vocEducation"]');

        console.log('Toglle event',event.target.dataset.id,hEdu.checked,vEdu.checked);
        if(event.target.dataset.id === 'highEducation' && vEdu.checked){
            vEdu.checked = false;
        }
        if(event.target.dataset.id === 'vocEducation' && hEdu.checked){
            hEdu.checked = false;
        }
    }
    handleClearAll(){
        let clearStudyArea = this.template.querySelectorAll('.studyareacheckbox');
        clearStudyArea.forEach(item => {
            if(item.checked){
                item.checked=false;
            }
        });

        let clearEduArea = this.template.querySelectorAll('.educheckbox');
        clearEduArea.forEach(item => {
            if(item.checked){
                item.checked = false;
            }
        });
        this.handleFilter();
    }

    studyA = '';
    isHEVE = '';

    prepareFilters(){
        if(this.openModal){
            this.studyA = '';
            this.isHEVE = '';
        }
        let inputB = this.template.querySelectorAll('.studyareacheckbox');
        inputB.forEach(item => {
            console.log('Checkbox Study area==>',item.name,item.checked);
            
            if(item.checked){
                this.studyA = this.studyA + item.name + ';' ;
            }
        });

        let inputC = this.template.querySelectorAll('.educheckbox');
        inputC.forEach(item => {
            
            console.log('Checkbox Education==>',item.name,item.checked);
            if(item.checked){
                this.isHEVE = item.name;
            }
        });

        
        console.log('Study Area',this.studyA);
        console.log('isHEVE',this.isHEVE);
    }

    setFilters(){
        let inputB = this.template.querySelectorAll('.studyareacheckbox');
        inputB.forEach(item => {
            console.log('Checkbox Study area==>',item.name,item.checked);
            this.studyareavalueselected[item.name] = item.checked;
            console.log('Study Area selected array in set filter',JSON.stringify(this.studyareavalueselected));
        });
        let inputC = this.template.querySelectorAll('.educheckbox');
        this.educationvalueSelected = {};
        inputC.forEach(item => {
            console.log('Checkbox Education==>',item.name,item.checked);
            if(item.checked){
                this.educationvalueSelected[item.name] = item.checked;
            }
        });
    }

    handleFilter(){
        console.log("handle filter:",  this.isHEVE);
        this.prepareFilters();
        this.setFilters();
        const passEvent = new CustomEvent('searchcoursefilter' ,{
            detail: {
                searchKey: this.searchkey,
                studyArea: this.studyA,
                isVH: this.isHEVE
            }
        });
        this.dispatchEvent(passEvent);
    }

    
}