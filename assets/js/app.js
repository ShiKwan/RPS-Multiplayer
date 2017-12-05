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
  var p1Ref = database.ref("/player1");
  var p2Ref = database.ref("/player2");
  var p1Exist = false;
  var p2Exist = false;

  function registerPlayer(playerName){
    console.log("register player: p1 -> " + p1Exist + ", p2 -> " + p2Exist);
    if((p1Exist == false && p2Exist == false) || (p1Exist == false && p2Exist == true)){
      console.log("added player 1");
      var conn = p1Ref.push(true);
      p1Ref.set({
        name: playerName
      });
      conn.onDisconnect().remove();
      p1Exist = true;
    }else if(p1Exist == true && p2Exist == false){
      console.log("added player 2");
      var conn = p2Ref.push(true);
      p2Ref.set({
        name: playerName
      });
      conn.onDisconnect().remove();
      p2Exist = true;
    }
  }

  $(".msg-center").hide();
  $("#cmdPlay").on("click", function(){
      console.log($("#txtName").val());
      if($("#txtName").val().trim() == ""){
        console.log($("#txtName").text());
        $(".msg-center").show();
        $(".msg-center").text("Enter a name");
        $(".msg-center").addClass("bg-danger");
      }else{
          var user= $("#txtName").val().trim();
          registerPlayer(user);
          console.log("user added to firebase!");
      }
  });


p1Ref.on("value", function(snapshot){
  console.log(snapshot.val());
  numPlayers= snapshot.numChildren();
  console.log("Number of players: " + numPlayers);

  if(snapshot.numChildren() == 0){
    p1Exist = false;
  }else{
    p1Exist = true;
  }
  
  
})

p2Ref.on("value", function(snapshot){
  console.log(snapshot.val());
  numPlayers= snapshot.numChildren();
  console.log("Number of players: " + numPlayers);

  if(snapshot.numChildren() == 0){
    p2Exist = false;
  }else{
    p2Exist = true;
  }
  
  
})