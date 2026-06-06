import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent' ;
export default class RecordPickerDemo extends LightningElement {
    @api selectedPassengerId = '';
    @api selectedRiderId = '';
    displayInfo = {
        additionalFields: ['Email']
    };

    matchingInfo = {
        primaryField: { fieldPath: 'Name' }
    };

    // The handler that captures the ID from the component event
    handlePassengerChange(event) {
        this.selectedPassengerId = event.detail.recordId;
        
        console.log('Successfully grabbed Contact ID:', this.selectedPassengerId);
        
        if (this.selectedPassengerId) {
            // Do something with the ID (like passing it to your Ticket process or flow)
             this.showToast('Success', 'Passenger selected.', 'success');
        } else {
            console.log('The Passenger record was empty.');
            this.showToast('Error',  'Search Failed.', 'error');
        }
    }

    handleRiderChange(event) {
        this.selectedRiderId = event.detail.recordId;
        
        console.log('Successfully grabbed Contact ID:', this.selectedRiderId);
        
        if (this.selectedRiderId) {
            // Compare the two IDs and show an error if they are the same
            if(this.selectedPassengerId === this.selectedRiderId){
                this.showToast('Error', 'Both records are the same.', 'error');
                this.selectedRiderId = '';
            }
        } else {
            console.log('The Rider record was empty.');
            //this.showToast('Error', 'Search Failed.', 'error');
        }
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(event);
    }

    
   
}
