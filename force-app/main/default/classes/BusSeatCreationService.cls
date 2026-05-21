/**
 * @description Service class responsible for creating and managing bus seat records.
 * This class generates a seating arrangement for buses with configurable rows and seats per row.
 */
public with sharing class BusSeatCreationService {
    private static final Integer MAX_ROWS = 10;
    private static final Integer MAX_SEATS_PER_ROW = 4;
    private static final List<String> SEAT_LETTERS = new List<String>{'A', 'B', 'C', 'D'};
    
    /**
     * @description Bulk-safely creates a seating arrangement for an incoming list of buses
     * @param newBuses The List of Bus__c records from Trigger.new
     */
    public static void createSeating(List<Bus__c> newBuses) {
        List<Bus_Seat__c> seatsToInsert = new List<Bus_Seat__c>();

        // Loop through every bus being inserted simultaneously
        for (Bus__c bus : newBuses) {
            seatsToInsert.addAll(generateSeatsForBus(bus));
        }
        
        // Execute a single bulk DML statement outside the master loops
        insertSeatsWithErrorHandling(seatsToInsert);
    }
    
    /**
     * @description Generates all seat records for a single bus
     * @param bus The Bus__c record to generate seats for
     * @return List<Bus_Seat__c> The list of seats generated for this bus
     */
    private static List<Bus_Seat__c> generateSeatsForBus(Bus__c bus) {
        List<Bus_Seat__c> busSeats = new List<Bus_Seat__c>();
        
        for (Integer row = 0; row < MAX_ROWS; row++) {
            for (Integer col = 0; col < MAX_SEATS_PER_ROW; col++) {
                String seatLetter = SEAT_LETTERS[col];
                
                busSeats.add(new Bus_Seat__c(
                    Bus__c = bus.Id, 
                    Name = bus.Name + '-' + row + seatLetter, 
                    is_Booked__c = false, 
                    Row_Number__c = row, 
                    Seat_Letter__c = seatLetter
                ));
            }
        }
        
        return busSeats;
    }
    
    /**
     * @description Inserts seats with error handling and logging
     * @param seatsToInsert The list of Bus_Seat__c records to insert
     */
    private static void insertSeatsWithErrorHandling(List<Bus_Seat__c> seatsToInsert) {
        if (seatsToInsert.isEmpty()) {
            return;
        }
        
        Database.SaveResult[] results = Database.insert(seatsToInsert, false, AccessLevel.USER_MODE);
        
        for (Integer i = 0; i < results.size(); i++) {
            if (!results[i].isSuccess()) {
                System.debug('Failed to create seat: ' + seatsToInsert[i].Name + 
                             ' Error: ' + results[i].getErrors()[0].getMessage());
            }
        }
    }
}
