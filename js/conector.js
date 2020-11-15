$("document").ready(function(){
    $("#cor").css("color","yellow");
if(document.getElementById("email_address").value=="andre" && document.getElementById("password").value=="1" || sessionStorage.getItem("ver")=="true"){
        sessionStorage.getItem("ver")="true";
        alert(document.getElementById("email_address").value);
}
  if(sessionStorage.getItem("ver")=="true"){
    $( ".esconder" ).show();
    //sessionStorage.setItem("ver","true");
  }else{

    $( ".esconder" ).hide();
    sessionStorage.setItem("ver","false");
  }
});