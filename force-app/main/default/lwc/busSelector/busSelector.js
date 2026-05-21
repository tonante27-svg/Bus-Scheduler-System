import { LightningElement, wire,track } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import BUS_SELECTION_CHANNEL from '@salesforce/messageChannel/BusSelectionChannel__c';
import getActiveBuses from '@salesforce/apex/BusBooking.getActiveBuses';

export default class BusSelector extends LightningElement {
    selectedBusId = '';
    @track busOptions = [];

    @wire(MessageContext)
    messageContext;

    // Fetch the buses to populate our dropdown options array
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

    handleBusChange(event) {
        this.selectedBusId = event.detail.value;

        // Broadcast the selection to the radio channel!
        const payload = { busId: this.selectedBusId };
        publish(this.messageContext, BUS_SELECTION_CHANNEL, payload);
    }
}