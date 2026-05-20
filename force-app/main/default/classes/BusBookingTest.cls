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
        
        // Call the service to create seats
        BusSeatCreationService service = new BusSeatCreationService();
        service.createSeating(newBus[0].Id);
        Test.stopTest();
        
        // Verify seats were created (10 rows × 4 seats = 40 seats)
       
        List<Bus_Seat__c> selectedSeats = new List<Bus_Seat__c>();
        for(Bus_Seat__c someSeat : [SELECT Id, Name, Bus__c, Row_Number__c, Seat_Letter__c, Is_Booked__c
     					FROM Bus_Seat__c WHERE Bus__c =: newBus[0].Id]){
        	if(someSeat.Row_Number__c ==0 && someSeat.Seat_Letter__c == 'B' && Is_Booked__c == false){
        		Is_Booked__c = true;
        		selectedSeats.add(someSeat);
        		break;
        	}
        }
        if(!selectedSeats.isEmpty()){
        	Database.update(selectedSeats,false);
        	BusBooking.bookSeat(selectedSeat[0].Id);
        }
        
        System.assertEquals(40, createdSeats.size(), 'Should create 40 seats');
        System.assertEquals(false, createdSeats[0].Is_Booked__c, 'Seats should not be booked initially');
    }
}