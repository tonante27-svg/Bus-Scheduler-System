import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

// Apex Service
import generateSeats from '@salesforce/apex/BusSeatCreationService.createSeating';

// Schema Imports (Fixed to __c)
import BUS_OBJECT from '@salesforce/schema/Bus__c';
import LAST_SERVICE_DATE from '@salesforce/schema/Bus__c.Last_Service_Date__c';
import STATUS from '@salesforce/schema/Bus__c.Status__c';
import TOTAL_CAPACITY from '@salesforce/schema/Bus__c.Total_Capacity__c';
import TYPE from '@salesforce/schema/Bus__c.Type__c';
import VEHICLE_ID_NUMBER from '@salesforce/schema/Bus__c.Vehicle_ID_Number__c';

export default class BusCreator extends LightningElement {
    // 1. Your dynamic array list for the form loop
    fieldList = [VEHICLE_ID_NUMBER, TYPE, STATUS, TOTAL_CAPACITY, LAST_SERVICE_DATE];

    // 2. Your individual string properties for granular tracking
    lastServiceDateField = LAST_SERVICE_DATE.fieldApiName;
    statusField = STATUS.fieldApiName;
    totalCapacityField = TOTAL_CAPACITY.fieldApiName;
    typeField = TYPE.fieldApiName;
    vehicleIdNumberField = VEHICLE_ID_NUMBER.fieldApiName;  
    busObject = BUS_OBJECT;

    // 3. Handle the form success
    handleBusSuccess(event) {
        const newBusId = event.detail.id;
        
        // Grab the vehicle number using the property you just created!
        const vehicleNumber = event.detail.fields[this.vehicleIdNumberField].value;

        // Call your bulkified service (passing an object array to match your List<Bus__c> parameter)
        generateSeats({ buses: [{ Id: newBusId }] })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success!',
                        message: `Vehicle ${vehicleNumber} created and 40 seats initialized.`,
                        variant: 'success'
                    })
                );
                
                // Reset the form fields for the next entry
                const inputFields = this.template.querySelectorAll('lightning-input-field');
                if (inputFields) {
                    inputFields.forEach(field => field.reset());
                }
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error generating virtual seating layout',
                        message: error.body ? error.body.message : 'Unknown error.',
                        variant: 'error'
                    })
                );
            });
    }
}