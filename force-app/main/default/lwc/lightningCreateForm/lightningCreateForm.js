import { LightningElement,api } from 'lwc';
import LEAD_OBJECT from '@salesforce/schema/Lead';
import NAME_FIELD from '@salesforce/schema/Lead.Name';
import PHONE_FIELD from '@salesforce/schema/Lead.Phone';
import COMPANY_FIELD from '@salesforce/schema/Lead.Company';

export default class LightningCreateForm extends LightningElement {
    @api recordId;
    objectName = LEAD_OBJECT.objectApiName;
    fieldList = [NAME_FIELD, PHONE_FIELD,COMPANY_FIELD];

    //expose the fields for your record-view-form
        nameField = NAME_FIELD.fieldApiName;
        phoneField = PHONE_FIELD.fieldApiName;
        companyField = COMPANY_FIELD.fieldApiName;
        
    successHandler(event){
        console.log('onsuccess event fired');
        console.log(event.detail.id);
    }

    clearFields(){
        console.log('clearFields method called');
        this.template.querySelectorAll('lightning-record-edit-form').querySelectorAll('lightning-input-field').forEach(field => {
            field.reset();
        });
        
    }
    handleSubmit(event){
        event.preventDefault();
        
       let name =  this.template.querySelector([name - 'name']) 
       if(name.includes('-*&^%')){
            name.setCustomValidity('Name cannot contain special characters');
       } else{
            name.setCustomValidity('');
            this.template.querySelector('lightning-record-edit-form').submit();
       }
    }
}