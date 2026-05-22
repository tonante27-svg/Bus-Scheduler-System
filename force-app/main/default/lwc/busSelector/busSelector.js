import { LightningElement, wire,track } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import BUS_SELECTION_CHANNEL from '@salesforce/messageChannel/BusSelectionChannel__c';
import getActiveBuses from '@salesforce/apex/BusBooking.getActiveBuses';
// 1. Import the core static resource bundle
import BUS_ASSETS from '@salesforce/resourceUrl/busAssets';

export default class BusSelector extends LightningElement {
    shuttleBusImage = `${BUS_ASSETS}/shuttleBus.png`;
    selectedBusId = '';
    selectedBusFare = 0.00; // Default fare, could be dynamically set based on selection
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
                    value: bus.Id,
                    baseFare:bus.Base_Fare__c
                };
            });
        } else if (error) {
            console.error('Error fetching buses:', error);
        }
    }

    handleBusChange(event) {
        this.selectedBusId = event.detail.value;

        // 1. Find the specific bus object inside your tracked array matching the selected ID
        const matchedBus = this.busOptions.find(bus => bus.value === this.selectedBusId);
        
        // 2. Assign the baseFare property we mapped in the @wire method to your class variable
        this.selectedBusFare = matchedBus ? matchedBus.baseFare : 0.00;

        // 3. Broadcast the true selection and pricing over the channel payload!
        const payload = { 
            busId: this.selectedBusId, 
            busFare: this.selectedBusFare 
        };        
        publish(this.messageContext, BUS_SELECTION_CHANNEL, payload);
    }
}