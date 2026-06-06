/**
 * @description Controller class for bus route operations
 */
public with sharing class BusRouteController {

    /**
     * @description Searches for bus routes matching the specified start and end locations
     * @param startLocation The starting location of the route
     * @param endLocation The ending location of the route
     * @return List<Bus_Route__c> List of matching bus routes
     */
    @AuraEnabled(cacheable=true)
    public static List<Bus_Route__c> searchDuplicateRoute(String startLocation, String endLocation) {
        return [SELECT Id, Name FROM Bus_Route__c WHERE Start_Location__c = :startLocation AND End_Location__c = :endLocation WITH USER_MODE LIMIT 1];
    }
    /**
     * @description Searches for all bus routes
     * @return List<Bus_Route__c> List of all bus routes
     */
    @AuraEnabled(cacheable=true)
    public static List<Bus_Route__c> getAllRoutes() {
        return [SELECT Id, Name,Start_Location__c,End_Location__c FROM Bus_Route__c WITH USER_MODE ORDER BY Name ASC LIMIT 100];
    }
}
