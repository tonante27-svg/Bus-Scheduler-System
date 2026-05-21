public with sharing class BusBooking {
    /**
     * @description Books a bus seat by setting its Is_Booked__c flag to true
     * @param seatId The Id of the Bus_Seat__c record to book
     * @throws AuraHandledException if the seat is already booked
     */
    @AuraEnabled
    public static void bookSeat(Id seatId){
        Bus_Seat__c seatToBook =[SELECT Id, Is_Booked__c FROM  Bus_Seat__c WHERE Id  =: seatId WITH USER_MODE];
        if(!seatToBook.Is_Booked__c){
            seatToBook.Is_Booked__c = true;
            update as user seatToBook;
        }else{
            throw new AuraHandledException('This seat has already been taken!');
        }
    }
    /**
     * @description Retrieves all bus seats for a given bus
     * @param busId The Id of the Bus__c record to get seats for
     * @return List<Bus_Seat__c> List of bus seats with their booking status
     */
    @AuraEnabled(cacheable=true)
    public static List<Bus_Seat__c> getBusSeats(Id busId){
        List<Bus_Seat__c> seatsToBook =[SELECT Id,Row_Number__c, Seat_Letter__c, Is_Booked__c,Class_Type__c, Name FROM  Bus_Seat__c WHERE Bus__c =: busId WITH USER_MODE ORDER BY Row_Number__c ASC, Seat_Letter__c ASC];
      return seatsToBook;
        
    }

    @AuraEnabled(cacheable=true)
    public static List<Bus__c> getActiveBuses() {
        return [
            SELECT Id, Name, Vehicle_ID_Number__c 
            FROM Bus__c 
            WHERE Status__c = 'Active' 
            WITH USER_MODE 
            ORDER BY Name ASC
        ];
    }
}