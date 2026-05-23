import { LightningElement,track,wire } from 'lwc';
import BUS_OBJECT from '@salesforce/schema/Bus__c';
import getActiveBuses from '@salesforce/apex/BusBooking.getActiveBuses';
// Bus Fileds neeing to be updated.
import FARE_FIELD from '@salesforce/schema/Bus__c.Base_Fare__c';
import SVCDATE_FIELD from '@salesforce/schema/Bus__c.Last_Service_Date__c';
import STATUS_FIELD from '@salesforce/schema/Bus__c.Status__c';
import TYPE_FIELD from '@salesforce/schema/Bus__c.Type__c';
import VIN_FIELD from '@salesforce/schema/Bus__c.Vehicle_ID_Number__c';
//Assets and Toast Messages 
import BUS_ASSETS from '@salesforce/resourceUrl/busAssets';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class BusMaintenance extends LightningElement {
    selectedBusId = '';
    @track busOptions = [];
    objectName = BUS_OBJECT.objectApiName;
    futureBusImage =  `${BUS_ASSETS}/futureBus.jpg`;
     // 1. Your dynamic array list for the form loop
    fieldList = [VIN_FIELD, TYPE_FIELD, STATUS_FIELD, SVCDATE_FIELD, FARE_FIELD];

    //2. expose the fields for your record-view-form
        fareField = FARE_FIELD.fieldApiName;
        svcDateField = SVCDATE_FIELD.fieldApiName;
        statusField = STATUS_FIELD.fieldApiName;
        typeField = TYPE_FIELD.fieldApiName;
        vinField = VIN_FIELD.fieldApiName;
        
     // 3. Fetch the buses to populate our dropdown options array
    @wire(getActiveBuses)
    wiredBuses({ error, data }) {
        if (data) {
            this.busOptions = data.map(bus => {
                return {
                    label: `${bus.Name} (${bus.Vehicle_ID_Number__c})`,
                    value: bus.Id
                };
            });
        } else if (error) {
            console.error('Error fetching buses:', error);
        }
    }

   clearFields() {
        console.log('clearFields method called');
        // Query all input fields directly from the template DOM
        const inputFields = this.template.querySelectorAll('lightning-input-field');
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }
    }
    handleBusChange(event){
        this.selectedBusId = event.detail.value;
    }

    handleSuccess(event) {
        // Grab the vehicle number using the property you just created!
    const vehicleNumber = event.detail.fields[this.vinField].value;
       this.dispatchEvent(new ShowToastEvent({
            title: 'Success',
            message: `Bus record ${vehicleNumber} updated successfully!`,
            variant: 'success'
        }));
       
        this.clearFields();
        this.selectedBusId = ''; // Completely resets the combobox dropdown state!
    }
}




