import { LightningElement } from 'lwc';
import { subscribe, unsubscribe, onError } from 'lightning/empApi';
export default class SalaryAccountPBE extends LightningElement {

    channelName = '/event/Salary_Account_PBE_Event__e';
    subscription = {};
    connectedCallback() {
        this.handleSubscribe();
        this.registerErrorListener
    }

    handleSubscribe() {
        const messageCallback = (response) => {
            console.log('New message received: ', JSON.stringify(response));
            // Handle the incoming event data as needed
        };
        
        subscribe(this.channelName, -1, messageCallback).then(response => {

            console.log('Successfully subscribed to: ', response.channel);
            this.subscription = response;
        }).catch(error => {
            console.error('Error subscribing to channel: ', error);
        });
    }

    disconnectedCallback() {
        unsubscribe(this.subscription, response => {
            console.log('Unsubscribed from channel: ', response);
        });
    }

    registerErrorListener() {
        onError(error => {
            console.error('Received error from server:', error);
        });
    }   
}