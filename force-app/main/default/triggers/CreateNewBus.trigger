trigger CreateNewBus on Bus__c (after insert) {
    // Pass the entire collection to keep the transactions completely bulk-safe
    BusSeatCreationService.createSeating(Trigger.new);
}