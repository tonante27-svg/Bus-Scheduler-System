@IsTest
private class BusRouteControllerTest {
    @IsTest
    private static void testSearchDuplicateRoute() {
        // Create test data
        Bus_Route__c route1 = new Bus_Route__c(Name = 'Route 1', Start_Location__c = 'Location A', End_Location__c = 'Location B');
        Bus_Route__c route2 = new Bus_Route__c(Name = 'Route 2', Start_Location__c = 'Location A', End_Location__c = 'Location C');
        insert new List<Bus_Route__c>{route1, route2};
        
        // Test method with matching route
         List<Bus_Route__c> matchingRoutes = new List<Bus_Route__c>();
         Test.startTest();
         matchingRoutes = BusRouteController.searchDuplicateRoute('Location A', 'Location B');
            Test.stopTest();
        //List<Bus_Route__c> matchingRoutes = BusRouteController.searchDuplicateRoute('Location A', 'Location B');
        System.assertEquals(1, matchingRoutes.size(), 'Should find exactly one matching route');
        System.assertEquals('Route 1', matchingRoutes[0].Name, 'The matching route should be Route 1');
        
        // Test method with no matching route
        matchingRoutes = BusRouteController.searchDuplicateRoute('Location A', 'Location D');
        System.assertEquals(0, matchingRoutes.size(), 'Should find no routes when end location does not match');
    }
}