  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAWrhk3vCKMhcc0is-SiIwKSggDXUBV1U0",
    authDomain: "rps-game-47c47.firebaseapp.com",
    databaseURL: "https://rps-game-47c47.firebaseio.com",
    projectId: "rps-game-47c47",
    storageBucket: "",
    messagingSenderId: "50256480370"
  };
  firebase.initializeApp(config);
  var database = firebase.database();
  var numPlayers = 0;

  function registerPlayer(playerName){
    if(numPlayers == 1){
      $(".lblP1Name").text(playerName);
      $(".wait-container").hide();
    }
  }

  $(".msg-center").hide();
  $("#cmdPlay").on("click", function(){
    if(numPlayers < 2){
      console.log($("#txtName").val());
      if($("#txtName").val().trim() == ""){
        console.log($("#txtName").text());
        $(".msg-center").show();
        $(".msg-center").text("Enter a name");
        $(".msg-center").addClass("bg-danger");
      }else{
          var user= $("#txtName").val().trim();
          var con = database.ref().push(user);
          con.onDisconnect().remove();
          numPlayers--;
          console.log("user added to firebase!");

      }
    }
  });


database.ref().on("value", function(snapshot){
  console.log(snapshot.val());
  numPlayers= snapshot.numChildren();
  console.log("Number of players: " + numPlayers);

})