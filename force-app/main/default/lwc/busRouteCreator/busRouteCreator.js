import { LightningElement, wire,track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';

// Import Apex function
import checkDuplicateRoute from '@salesforce/apex/BusRouteController.searchDuplicateRoute';

// Import the object and field schema
import ROUTE_OBJECT from '@salesforce/schema/Bus_Route__c';
import START_LOCATION_FIELD from '@salesforce/schema/Bus_Route__c.Start_Location__c';
import END_LOCATION_FIELD from '@salesforce/schema/Bus_Route__c.End_Location__c';
import BUS_ASSETS from '@salesforce/resourceUrl/busAssets';

export default class BusRouteCreator extends LightningElement {
    @track startLocation = '';
    @track endLocation = '';
    
    routeMapImage = `${BUS_ASSETS}/FloridaCities.jpg`;
    routeObject = ROUTE_OBJECT;
    
    // Pass the API name strings to the template
   // Standardized Central Florida Operational Hubs
    get cityOptions() {
        return [
            { label: 'Zephyrhills', value: 'Zephyrhills' },
            { label: 'Ybor City', value: 'Ybor City' },
            { label: 'Tampa (Downtown)', value: 'Tampa' },
            { label: 'New Tampa', value: 'New Tampa' },
            { label: 'Orlando', value: 'Orlando' },
            { label: 'Lakeland', value: 'Lakeland' },
            { label: 'Clearwater', value: 'Clearwater' },
            { label: 'Wuachula', value: 'Wuachula' },
            { label: 'Broopksville', value: 'Broopksville' },
            { label: 'Dade City', value: 'Dade City' },
            { label: 'Bushnell', value: 'Bushnell' },
            { label: 'Sanford', value: 'Sanford' },
            { label: 'Bartow', value: 'Bartow' },
            { label: 'Brandon', value: 'Brandon' },
            { label: 'Sarasota', value: 'Sarasota' },
            { label: 'St. Petersburg', value: 'St. Petersburg' },
            { label: 'Port Richey', value: 'Port Richey' },
            { label: 'Dunedin', value: 'Dunedin' },
            { label: 'Spring Hill', value: 'Spring Hill' },
            { label: 'Tarpon Springs', value: 'Tarpon Springs' },
            { label: 'Ocala', value: 'Ocala' }
        ];
    }

    // Combined change handler to process changes and fire the Apex check
    handleRouteChange(event) {
        const fieldName = event.target.name;
        if (fieldName === 'startLocation') {
            this.startLocation = event.target.value;
        } else if (fieldName === 'endLocation') {
            this.endLocation = event.target.value;
        }

        // Run duplicate check only when both fields have values
        if (this.startLocation && this.endLocation) {
            if (this.startLocation === this.endLocation) {
                this.showToast('Error', 'Start and End locations cannot be the same.', 'error');
                return;
            }

            checkDuplicateRoute({ startLoc: this.startLocation, endLoc: this.endLocation })
                .then(result => {
                    this.isDuplicate = result;
                })
                .catch(error => {
                    console.error('Error running duplicate check: ', error);
                });
        }
    }
    // Class property to share the calculated name between submit and success handlers
    computedRouteName = ''; 

    get routeNamePreview() {
        if (this.startLocation && this.endLocation) {
            return `${this.startLocation} To ${this.endLocation}`;
        }
        return '';
    }

    get isSaveDisabled() {
        return !(this.startLocation && this.endLocation);
    }

    handleSaveRoute(event) {
        //debugger; // Browser will be forced to stop here sine the framework  skips it during DevTools debug.
       event.preventDefault(); 
        
        const fields = {};
        fields['Start_Location__c'] = this.startLocation;
        fields['End_Location__c'] = this.endLocation;
        // Omit fields['Name'] if you configured Option 1 Formula fields! 
        // Otherwise keep it if Name is a regular text field.
        fields['Name'] = this.routeNamePreview; 

        const recordInput = { apiName: "Bus_Route__c", fields };
        createRecord(recordInput)
            .then(() => {
                this.showToast('Success', `Route "${this.routeNamePreview}" created successfully.`, 'success');
                this.startLocation = '';
                this.endLocation = '';
                this.isDuplicate = false;
            })
            .catch(error => {
                this.showToast('Error', `Failed to create route: ${error.body.message}`, 'error');
            });
    }

    // Helper method to keep toast code DRY
    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}