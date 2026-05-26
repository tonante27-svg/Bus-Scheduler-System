import { LightningElement, track, wire } from 'lwc';
import BRS_OBJECT from '@salesforce/schema/Bus_Route_Schedule__c';
import getActiveBuses from '@salesforce/apex/BusBooking.getActiveBuses';
import ROUTE_LOOKUP from '@salesforce/schema/Bus_Route_Schedule__c.Route__c';
import STATUS from '@salesforce/schema/Bus_Route_Schedule__c.Status__c';
import TIME_CHOICE from '@salesforce/schema/Bus_Route_Schedule__c.Departure_Date__c';
import DEPARTURE_DATE from '@salesforce/schema/Bus_Route_Schedule__c.Time_Choice__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class BusRouteScheduler extends LightningElement {
    selectedBusId = '';
    @track busOptions = [];
    objectName = BRS_OBJECT.objectApiName;

    // Array of clean text strings for your template's loop
    fieldList = [
        STATUS.fieldApiName, 
        TIME_CHOICE.fieldApiName, 
        DEPARTURE_DATE.fieldApiName, 
        ROUTE_LOOKUP.fieldApiName
    ]; 
    
    departureDateField = DEPARTURE_DATE.fieldApiName;
    statusField = STATUS.fieldApiName;
    timeChoiceField = TIME_CHOICE.fieldApiName;
    
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
        const inputFields = this.template.querySelectorAll('lightning-input-field');
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }
    }

    handleBusChange(event){
        this.selectedBusId = event.detail.value;
        console.log('Selected Bus Id Updated To:', this.selectedBusId);
    }

    handleSuccess(event) {
        this.dispatchEvent(new ShowToastEvent({
            title: 'Success',
            message: `Bus Route Scheduler record was created successfully!`,
            variant: 'success'
        }));
        
        this.clearFields();
        this.selectedBusId = ''; // Resets the dashboard back to the default state!
    }
}