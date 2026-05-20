/**
 * @description Service class responsible for creating and managing bus seat records.
 * This class generates a seating arrangement for buses with configurable rows and seats per row.
 */
public with sharing class BusSeatCreationService {
    private final Integer MAXROW = 10;
    private final Integer MAXSEATS = 4;
    
    /**
     * @description Creates a seating arrangement for a given bus by generating seat records
     * in a grid pattern with row numbers and seat letters (A, B, C, D).
     * @param busId The Id of the Bus__c record for which seats should be created
     */
    public void createSeating(Id busId){
        List<Bus__c> newBus = [SELECT Id,Name FROM Bus__c WHERE Id = :busId WITH USER_MODE];

        // Create the seating of 4 seats per row
        List<Bus_Seat__c> seats = new List<Bus_Seat__c>();

        for(Integer row= 0; row < MAXROW; row++){
            for(Integer col = 0; col < MAXSEATS; col++){
                String whichSeat;
                switch on col{
                    when 1{
                        whichSeat = 'A';
                    }
                    when 2{
                        whichSeat = 'B';
                    }
                    when 3{
                        whichSeat = 'C';
                    }
                    when else{
                        whichSeat = 'D';
                    }
                }

                seats.add( new Bus_Seat__c(Bus__c = newBus[0].Id, Name = newBus[0].Name+'-'+row+whichSeat, is_Booked__c = false, Row_Number__c=row, Seat_Letter__c = whichSeat ));

            }
        }
        //check for any failures during seat creation
        Database.SaveResult[] res = Database.insert(seats, false, AccessLevel.USER_MODE);
        for(Integer i = 0; i < res.size(); i++){
                if(res[i].isSuccess()){
                    System.debug('Seat created successfully: ' + seats[i].Name);
                } else {
                    System.debug('Failed to create seat: ' + seats[i].Name + ' Error: ' + res[i].getErrors()[0].getMessage());
                }
            }
    }
}