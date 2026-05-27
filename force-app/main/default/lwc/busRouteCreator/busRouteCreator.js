import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import ROUTE_OBJECT from '@salesforce/schema/Bus_Route__c';
import START_LOCATION from '@salesforce/schema/Bus_Route__c.Start_Location__c';
import END_LOCATION from '@salesforce/schema/Bus_Route__c.End_Location__c';
import NAME from '@salesforce/schema/Bus_Route__c.Name';

// Import Apex function
import searchMatchingRoute from '@salesforce/apex/BusRouteController.searchMatchingRoute';
import BUS_ASSETS from '@salesforce/resourceUrl/busAssets';

export default class BusRouteCreator extends LightningElement {
    
    routeMapImage = `${BUS_ASSETS}/FloridaCities.jpg`;
    routeObject = ROUTE_OBJECT;
    
    // Pass the API name strings to the template
    nameFieldApiName = NAME.fieldApiName;
    
    fieldList = [
        START_LOCATION,
        END_LOCATION
    ];

    // Class property to share the calculated name between submit and success handlers
    computedRouteName = ''; 

    async handleSubmit(event) {
        event.preventDefault();
        const fields = event.detail.fields;

        const startLocation = fields[START_LOCATION.fieldApiName];
        const endLocation = fields[END_LOCATION.fieldApiName];
        const routePattern = /^[A-Za-z\s]+$/;

        // Validation check
        if (!routePattern.test(startLocation) || !routePattern.test(endLocation)) {
            this.showToast('Validation Error', 'Start and end locations must contain only alphabetic characters.', 'error');
            return;
        }

        try {
            // 1. Properly call the imported Apex function directly
            const matchingRoutes = await searchMatchingRoute({ 
                startLocation: startLocation, 
                endLocation: endLocation 
            });

            // Example validation logic: Prevent submission if route exists
            if (matchingRoutes && matchingRoutes.length > 0) {
                this.showToast('Duplicate Route', 'A route with these locations already exists.', 'error');
                return; 
            }

            // 2. Format and assign the Name field
            this.computedRouteName = `${startLocation} To ${endLocation}`;
            fields[NAME.fieldApiName] = this.computedRouteName;

            // 3. Submit the form manually
            this.template.querySelector('lightning-record-edit-form').submit(fields);

        } catch (error) {
            this.showToast('Error', 'An error occurred while validating the route.', 'error');
            console.error(error);
        }
    }

    handleRouteSuccess(event) {
        // Use the class property we set during submission
        this.showToast('Success', `Route "${this.computedRouteName}" created successfully.`, 'success');

        // Reset all input fields
        const inputFields = this.template.querySelectorAll('lightning-input-field');
        if (inputFields) {
            inputFields.forEach(field => field.reset());
        }
    }

    // Helper method to keep toast code DRY
    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}