
alert();
$("document").ready(function(){
    $("#cor").css("color","yellow");

  if(sessionStorage.getItem("senha")=="1"){
    $( ".esconder" ).show();
    sessionStorage.setItem("ver","true");
  }else{
    // if(document.getElementById("email_address").value=="andre" && document.getElementById("password").value=="1" || sessionStorage.getItem("ver")=="true"){
    //   sessionStorage.getItem("senha")="1";
    //   alert(document.getElementById("email_address").value);
    // }
    $( ".esconder" ).hide();
    sessionStorage.setItem("ver","false");
  }
});