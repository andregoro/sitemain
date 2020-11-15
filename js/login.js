$("document").ready(function(){
    $("#cor").css("color","yellow");

  if(sessionStorage.getItem("ver")=="true"){
    $( ".esconder" ).show();
//    sessionStorage.setItem("ver","true");
  }else{

    $( ".esconder" ).hide();
    sessionStorage.setItem("ver","false");
  }
$("#sair").click(function() {
  sessionStorage.getItem("senha")="0";
});
});