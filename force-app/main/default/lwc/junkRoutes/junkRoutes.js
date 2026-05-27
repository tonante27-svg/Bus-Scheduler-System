import { LightningElement, track,wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import ROUTE_OBJECT from '@salesforce/schema/Bus_Route__c';
import START_LOCATION from '@salesforce/schema/Bus_Route__c.Start_Location__c';
import END_LOCATION from '@salesforce/schema/Bus_Route__c.End_Location__c';
import NAME from '@salesforce/schema/Bus_Route__c.Name';

// Import Apex function
import searchMatchingRoute from '@salesforce/apex/BusRouteController.searchDuplicateRoute';
import  getAllRoutes from '@salesforce/apex/BusRouteController.getAllRoutes';

export default class JunkRoutes extends LightningElement{
	
	routeObject = ROUTE_OBJECT;
	selectedRouteId = '';
   
    // Pass the API name strings to the template
    nameFieldApiName = NAME.fieldApiName;
    @track routeOptions = [];
    fieldList = [
        START_LOCATION,
        END_LOCATION
    ];

//2. expose the fields for your record-view-form
    startField = START_LOCATION.fieldApiName;
    endField = END_LOCATION.fieldApiName;


    @wire(getAllRoutes)
    wiredBuses({ error, data }) {
        if (data) {
            this.routeOptions = data.map(route => {
                return {
                    label: `${route.Name} )`,
                    value: route.Id
                };
            });
        } else if (error) {
            console.error('Error fetching buses:', error);
        }
    }
    handleRouteChange(event){
        this.selectedRouteId = event.detail.value;
        console.log('Selected Route Id:', this.selectedRouteId);
       
    }

}
