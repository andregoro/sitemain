$("document").ready(function(){
    $("#cor").css("color","yellow");

     // alert(document.getElementById("email_address").value);

      $( ".esconder" ).hide();

          $("#bot").click(function() {

                if(document.getElementById("email_address").value=="andre" && document.getElementById("password").value=="a"){
                  sessionStorage.setItem("ver","true");
                  // $( ".esconder" ).show();
                  // $( ".login" ).hide();
                  //window.location.href="/index.html";
                  $("#form").attr("action","./index.html");
                }
          });
    });

function num() {
alert("erro")
}