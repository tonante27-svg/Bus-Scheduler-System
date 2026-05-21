@IsTest
private class BusSeatCreationServiceTest {
    
    @IsTest
    private static void testBusCreation() {
        // Create test Bus record
        List<Bus__c> newBuses = new List<Bus__c>();
        newBuses.add(new Bus__c(
            Status__c = 'Active',
            Type__c = 'Standard Coach',
            Vehicle_ID_Number__c = 'BS01777'
        ));
        
        Test.startTest();
        insert newBuses;
        
        // Call the service to create seats
       // BusSeatCreationService service = new BusSeatCreationService();
        BusSeatCreationService.createSeating(newBuses);
        Test.stopTest();
        
        // Verify seats were created (10 rows × 4 seats = 40 seats)
        List<Bus_Seat__c> createdSeats = [
            SELECT Id, Name, Bus__c, Row_Number__c, Seat_Letter__c, Is_Booked__c
            FROM Bus_Seat__c
            WHERE Bus__c = :newBuses[0].Id
        ];
        
        System.assertEquals(40, createdSeats.size(), 'Should create 40 seats');
        System.assertEquals(false, createdSeats[0].Is_Booked__c, 'Seats should not be booked initially');
    }
}