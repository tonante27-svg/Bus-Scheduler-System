@IsTest
private class BusBookingTest {
    
    @IsTest
    private static void testBusCreation() {
        // Create test Bus record
        List<Bus__c> newBus = new List<Bus__c>();
        newBus.add(new Bus__c(
            Status__c = 'Active',
            Type__c = 'Standard Coach',
            Vehicle_ID_Number__c = 'BS01777'
        ));
        
        Test.startTest();
        insert newBus;
        List<Bus__c> insertedBuses = new List<Bus__c>();
        insertedBuses.add(newBus[0]);
        // Call the service to create seats
        BusSeatCreationService.createSeating(insertedBuses);
        Test.stopTest();
        
        // 1. Verify ALL 40 seats were created in the database
        List<Bus_Seat__c> databaseSeats = [SELECT Id FROM Bus_Seat__c WHERE Bus__c = :newBus[0].Id];
        System.assertEquals(40, databaseSeats.size(), 'Should create 40 seats total');
       
        // 2. Isolate a single seat using your zero-indexing logic
        List<Bus_Seat__c> selectedSeats = new List<Bus_Seat__c>();
        for(Bus_Seat__c someSeat : [SELECT Id, Name, Bus__c, Row_Number__c, Seat_Letter__c, Is_Booked__c
                        FROM Bus_Seat__c WHERE Bus__c = :newBus[0].Id]){
            
            // FIXED: Added 'someSeat.' right before Is_Booked__c
            if(someSeat.Row_Number__c == 0 && someSeat.Seat_Letter__c == 'B' && someSeat.Is_Booked__c == false){
                selectedSeats.add(someSeat);
                break;
            }
        }
     // No further code needed here
        // 3. Verify the initial state of the pulled seat and test the booking method
        if(!selectedSeats.isEmpty()){
            System.assertEquals(false, selectedSeats[0].Is_Booked__c, 'Seats should not be booked initially');
            
            // Execute your actual target method
            BusBooking.bookSeat(selectedSeats[0].Id);
            
            // Re-query to verify the update stuck
            Bus_Seat__c verifiedSeat = [SELECT Is_Booked__c FROM Bus_Seat__c WHERE Id = :selectedSeats[0].Id];
            System.assertEquals(true, verifiedSeat.Is_Booked__c, 'Seat should be marked as booked after calling bookSeat');
        } else {
            System.assert(false, 'Test setup failed: Row 0, Seat B was not found.');
        }
    }
}