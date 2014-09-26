// ==UserScript==
// @name        Asana tasks helper
// @namespace   test
// @description test
// @include     https://app.asana.com/*
// @version     1
// @grand       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// ==/UserScript==


window.setInterval(function(){

    if ($("#project_notes").length>0)
    {
      if ($("#scify-hours").length==0)
            $(getTemplate()).insertAfter("#project_notes .loading-boundary");     
     
        $("#scify-hours").find(".total").text(getTotalHours());    
      getHoursPerName();
    }
 
},2000);
   var persons =[];
function getHoursPerName(){
   var hours=0;

 
    $("#grid").find("tr").each(function(i,row){
       var taskName =$(row).find("textarea").val();
      try
        {
          if (taskName.indexOf("|")>0)
          {
            var taskhours =parseFloat(taskName.substring(0,taskName.indexOf("|")).replace("h",""));
            if (taskhours>0)
              {
                 hours +=taskhours;
                 var profilePhoto = $(row).find(".profile-photo");
                  if (profilePhoto.length>0) //assigned
                  {
                    var img =profilePhoto.css("backgroundImage");
                    var index = $.inArray(img, persons);
                    if (index==-1)
                      {
                        persons.push(img);
                        console.log(profilePhoto.html());
                       $("#scify-hours").find("table").append("<tr><td class='photo'><div style='width:21px;height:21px;background:"+ img+"'></div></td><td></td></tr>");
                       
                      }
                  }
                
              }     
          } 
        }
        catch(err){       
         }     
      });
  return hours;
};
function getTotalHours(){
   var hours=0;
       $("#grid").find("tr").each(function(i,row){
       var taskName =$(row).find("textarea").val();     
      try
        {
          if (taskName.indexOf("|")>0)
          {
            var taskhours =parseFloat(taskName.substring(0,taskName.indexOf("|")).replace("h",""));
            if (taskhours>0)
              hours +=taskhours;
          } 
        }
        catch(err){       
         }     
      });
  return hours;
}

function getTemplate(){
  return "<div id='scify-hours'>Total hours: <span class='total'></span>"
              +"<table>"
              + "<tr><td>Name</td><td>Remaining</td></tr>"
              +"</table>"
          "</div>";
}
