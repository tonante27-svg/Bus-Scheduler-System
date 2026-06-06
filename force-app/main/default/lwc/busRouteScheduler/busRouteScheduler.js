import { LightningElement, track, wire } from 'lwc';
import BRS_OBJECT from '@salesforce/schema/Bus_Route_Schedule__c';
import getActiveBuses from '@salesforce/apex/BusBooking.getActiveBuses';
import ROUTE_LOOKUP from '@salesforce/schema/Bus_Route_Schedule__c.Route__c';
import STATUS from '@salesforce/schema/Bus_Route_Schedule__c.Status__c';
import TIME_CHOICE from '@salesforce/schema/Bus_Route_Schedule__c.Time_Choice__c';
import DEPARTURE_DATE from '@salesforce/schema/Bus_Route_Schedule__c.Departure_Date__c';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getallRoutes from '@salesforce/apex/BusRouteController.getAllRoutes';
export default class BusRouteScheduler extends LightningElement {
    @track selectedBusId = '';
    @track selectedRouteId = '';
    @track routeTime = '';
    status = '';
    @track selectedDate = '';
    @track busOptions = [];
    objectName = BRS_OBJECT.objectApiName;
    
      @track routeOptions = [];

    // Array of clean text strings for your template's loop
    
    //departureDateField = DEPARTURE_DATE.fieldApiName;
   get statusOptions(){
       return [
           { label: 'Not Started', value: 'Not Started' },
           { label: 'Scheduled Delayed', value: 'Scheduled Delayed'},
           { label: 'In-Route', value: 'In-Route' },
           { label: 'Completed', value: 'Completed' }
       ];
   }
    get timeOptions() {
        return [
            { label: '9:00 AM', value: '9:00 AM' },
            { label: '11:00 AM', value: '11:00 AM'},
            { label: '1:00 PM', value: '1:00 PM' },
            { label: '3:00 PM', value: '3:00 PM' },
            { label: '5:00 PM', value: '5:00 PM' }
           
        ];
    } 

    @wire(getActiveBuses)
    wiredBuses({ error, data }) {
        if (data) {
            this.busOptions = data.map(bus => {
                return {
                    label: `${bus.Name} (${bus.Vehicle_ID_Number__c || 'No VIN'})`,
                    value: bus.Id
                };
            });
        } else if (error) {
            console.error('Error fetching buses:', error);
        }
    } 

    @wire(getallRoutes)
    wiredRoutes({ error, data }) {
        if (data) {
            this.routeOptions = data.map(route => {
                return {
                    label: `${route.Start_Location__c} to ${route.End_Location__c}`,
                    value: route.Id
                };
            });
        } else if (error) {
            console.error('Error fetching routes:', error);
        }
    }

    get todayDate() {
        return new Date().toISOString().split('T')[0];
    }

    clearFields() {
        this.routeTime = '';
        this.status = '';
        this.selectedRouteId = '';
        this.selectedBusId = '';
        this.selectedDate = '';
    }

    handleBusChange(event){
        this.selectedBusId = event.detail.value;
        console.log('Selected Bus Id Updated To:', this.selectedBusId);
    }
     handleRouteChange(event){
        this.selectedRouteId = event.detail.value;
        console.log('Selected Route Id Updated To:', this.selectedRouteId);
    }
    handleRouteTimeChange(event){
        this.routeTime = event.detail.value;
        console.log('Selected Route Time Updated To:', this.routeTime);
    }

    handleStatusChange(event){
        this.status = event.detail.value;
        console.log('Selected Status Updated To:', this.status);
    }

    handleDepartureDateChange(event) {
        this.selectedDate = event.target.value;
    }

    handleSaveSchedule(event) {
        debugger; // Browser will be forced to stop here sine the framework  skips it during DevTools debug.
        console.log('Save button clicked');
        event.preventDefault(); 
        
        const fields = {};
        fields['Time_Choice__c'] = this.routeTime;
        fields['Status__c'] = this.status;
        fields['Route__c'] = this.selectedRouteId; 
        fields['Bus__c'] = this.selectedBusId;
        fields['Departure_Date__c'] = this.selectedDate; // Assuming you have a date field in your form
        const recordInput = { apiName: "Bus_Route_Schedule__c", fields };
        console.log('Before createRecord');
        createRecord(recordInput)
            .then((record) => {
                console.log('Successfully created record ID:', record.id);
                // Fire the announcement banner
                this.showToast('Success', 'Bus Route Schedule created successfully!', 'success');
                
                // Wipe the dashboard fields clean for the next entry
                this.clearFields();
            })
            .catch(error => {
                console.error('Full Server Error Object:', JSON.stringify(error));
    
                let message = 'Unknown error';
                
                // Extract deep validation or picklist errors from Salesforce UI API
                if (error.body && error.body.message) {
                    message = error.body.message;
                }
                
                // Check for field-specific errors deep in the output object
                if (error.body && error.body.output && error.body.output.fieldErrors) {
                    const fieldErrors = error.body.output.fieldErrors;
                    const firstField = Object.keys(fieldErrors)[0];
                    if (firstField && fieldErrors[firstField].length > 0) {
                        message = `Field [${firstField}]: ${fieldErrors[firstField][0].message}`;
                    }
                } else if (error.body && error.body.output && error.body.output.errors && error.body.output.errors.length > 0) {
                    message = error.body.output.errors[0].message;
                }
                this.showToast('Error', `Failed to create route: ${message}`, 'error');
            });
            console.log('After createRecord');
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

     // Helper method to keep toast code DRY
    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}
