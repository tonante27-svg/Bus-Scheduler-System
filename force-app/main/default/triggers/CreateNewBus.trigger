Trigger CreateNewBus on Bus__c  ( after insert){
	
	Bus__c newBus = Trigger.new;
	BusSeatCreationService.createSeating(newBus.Id);
  
}