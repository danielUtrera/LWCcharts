public with sharing class ChartsController {
	@AuraEnabled(cacheable=true)
    public static String dashboardQuery(String query,String objectQueried){
        List<String> objects=new List<String>();
        objects.add(objectQueried);
        List<Schema.DescribeSObjectResult> describe=Schema.describeSObjects(objects);
        List<Object> res=new List<Object>();
        if(describe.size()>0){
            if(describe[0].isQueryable()){
                try{
                    res=Database.query(query);
                }catch(Exception e){
                    System.debug('PaypalDashboard:QueryException');
                    System.debug(e);
                }
            }
        }
        
        return JSON.serialize(res);
    }
}