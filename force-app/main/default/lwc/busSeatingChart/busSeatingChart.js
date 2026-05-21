import { LightningElement, api,wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'; 
import { refreshApex } from '@salesforce/apex'; // 1. Import refreshApex
import getBusSeats from '@salesforce/apex/BusBooking.getBusSeats'; // (Assuming this is your retrieval method name)
import bookSeat from '@salesforce/apex/BusBooking.bookSeat';

export default class BusSeatingChart extends LightningElement {
    @api busId;
    seats;
    error;
    wiredSeatsResult; // 2. Track the provisioned object container

    // 3. Wire your retrieval method and store the whole result
    @wire(getBusSeats, { busId: '$busId' })
    wiredSeats(result) {
        this.wiredSeatsResult = result;
        const { data, error } = result;
        if (data) {
            this.seats = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.seats = undefined;
        }
    }

    handleSeatClick(event) {
        const seatId = event.target.dataset.seatid;
        
        bookSeat({ seatId })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Seat booked successfully',
                        variant: 'success'
                    })
                );
                // Refresh the seating chart to reflect the updated booking status
                this.refreshSeatingChart();
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error booking seat',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    } // <--- This closing brace was missing!

    refreshSeatingChart() {
       return  refreshApex(this.wiredSeatsResults);// We will hook this up to refreshApex shortly!
    }
}