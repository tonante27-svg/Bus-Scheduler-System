// Schema Imports (Fixed to __c)
import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import ROUTE_OBJECT from '@salesforce/schema/Bus_Route__c';
import START_LOCATION from '@salesforce/schema/Bus_Route__c.Start_Location__c';
import END_LOCATION from '@salesforce/schema/Bus_Route__c.End_Location__c';
import NAME from '@salesforce/schema/Bus_Route__c.Name';

import BUS_ASSETS from '@salesforce/resourceUrl/busAssets';

export default class BusRouteCreator extends LightningElement {

    
    routeMapImage = `${BUS_ASSETS}/FloridaCities.jpg`;

    routeObject = ROUTE_OBJECT;

    fieldList = [
        START_LOCATION,
        END_LOCATION,
        NAME
    ];

    nameField = NAME.fieldApiName;

    handleSubmit(event) {

        event.preventDefault();

        const fields = event.detail.fields;

        const routeName = fields[this.nameField];

        const routePattern = /^[A-Za-z\s]+$/;

        if (!routePattern.test(routeName)) {

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Validation Error',
                    message:
                        'Route name must contain only alphabetic characters.',
                    variant: 'error'
                })
            );

            return;
        }

        this.template
            .querySelector('lightning-record-edit-form')
            .submit(fields);
    }

    handleRouteSuccess(event) {

        const routeName =
            event.detail.fields.Name.value;

        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: `Route ${routeName} created.`,
                variant: 'success'
            })
        );

        const inputFields =
            this.template.querySelectorAll(
                'lightning-input-field'
            );

        if (inputFields) {
            inputFields.forEach(field => field.reset());
        }
    }
}