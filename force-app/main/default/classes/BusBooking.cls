public with sharing class BusBooking {
    @AuraEnabled
    public static void bookSeat(Id seatId){
        Bus_Seat__c seatToBook =[SELECT Id, Is_Booked__c FROM  Bus_Seat__c WHERE Id  =: seatId ];
        if(!seatToBook.Is_Booked__c){
            seatToBook.Is_Booked__c = true;
            update as user seatToBook;
        }else{
            throw new AuraHandledException('This seat has already been taken!');
        }
    }
}