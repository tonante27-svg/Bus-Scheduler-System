import { LightningElement,wire } from 'lwc';
import {subscribe, MessageContext,unsubscribe} from 'lightning/messageService';
import BUS_SELECTION_CHANNEL from '@salesforce/messageChannel/BusSelectionChannel__c';
export default class BusTicket extends LightningElement {
    selectBusId;
    subscription = null;   
    totalPrice;    
    baseFare = 0;
    
    @wire(MessageContext)
        messageContext;
    
       connectedCallback() {
        this.subscribeToMessageChannel();
        
    }
    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(this.messageContext, BUS_SELECTION_CHANNEL, (message) => {
            if(message.busId != undefined){
                this.selectBusId = message.busId;
                this.baseFare = message.busFare; // Capture the fare sent from the selector
            }   
            // Capture Seat Details when a button is clicked in the chart component
            if (message.seatId !== undefined) {
                this.selectedSeatId = message.seatId;
                this.seatingClass = message.seatingClass; 
            }

            // Recalculate if the minimal ticket data requirements are met
            if (this.selectBusId && this.selectedSeatId) {
                this.calculateTotal(); 
            }
         });      
        }
    }

     disconnectedCallback() {
        this.unsubscribeToMessageChannel();
    }
     unsubscribeToMessageChannel() {
        // Unsubscribe from the message channel
        unsubscribe(this.subscription);
        
        // Clear the reference
        this.subscription = null;
    }

    // Example breakdown of your formula inside the future ticket component
    calculateTotal() {
        const TAX_RATE = 0.08; // Illinois 8% Sales Tax
        
        // Determine premium upcharge based on the class sent by the seating chart
        const premiumUpcharge = this.seatingClass === 'Premium' ? 15.00 : 0.00;
        
        // Formula: (Base Fare + Premium Upcharge) * Tax
        const subtotal = this.baseFare + premiumUpcharge;
        const taxAmount = subtotal * TAX_RATE;
        
        this.totalPrice = subtotal + taxAmount;
    }   
 }