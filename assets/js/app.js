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
	var chat = database.ref("/chat");

var player1 = {
	exist: false,
	name : "",
	win : 0,
	loss : 0,
	play : ""
}
var player2 = {
	exist: false,
	name : "",
	win : 0,
	loss : 0,
	play : ""
}

var p1win = 0;
var p2win = 0;
var p1loss = 0;
var p2loss = 0;
var p1Control = false;
var p2Control = false;
var p1HasPlay = false, p2HasPlay = false, p1HasName = false, p2HasName = false;

function hideP1Stuffs(){
	if(p2Control ){
		$(".p1-wait-for-p2-container").hide();
		$(".p1-wait-container").hide();
		$(".play1-container").hide();
	}
}
function hideP2Stuffs(){
	if(p1Control){
		$(".p2-wait-for-p1-container").hide();
		$(".p2-wait-container").hide();
		$(".play2-container").hide()	
	}
}

function initialization(){
	$(".msg-center").hide();
	$(".p1-wait-container").show();
	$(".p2-wait-container").show();
	$(".p1-wait-for-p2-container").hide();
	$(".p2-wait-for-p1-container").hide();
	$(".play1-container").hide();
	$(".play2-container").hide();
	checkForP1();
	checkForP2();
	if(!player1.exist && !player2.exist){
		chat.remove();
		$("#textAreaChat").empty();
	}
}


function checkForP1(){
	p1Ref.once("value", function(snapshot){
		console.log("in check p1 func");
		if(snapshot.hasChild("name")){
			if(p1Control){
				$(".register-container").hide();
			}
			console.log("found child with name");
			$(".lblP1Name").text(snapshot.val().name.trim());
			$("#lblP1Record").text("Win : " + snapshot.val().win + " | Loss : " + snapshot.val().loss);
			$(".p1-wait-container").hide();
			player1.exist = true;
			p1Control= false;
		}
	});
}

function checkForP2(){
	p2Ref.once("value", function(snapshot){
		console.log("in check p2 func");
		if(snapshot.hasChild("name")){
			console.log("found child with name");
			$(".lblP2Name").text(snapshot.val().name.trim());
			$("#lblP2Record").text("Win : " + snapshot.val().win + " | Loss : " + snapshot.val().loss);
			$(".p2-wait-container").hide();
			player2.exist = true;
			p2Control= false;
		}
	})
}

p1Ref.on("child_removed", function(snapshot){
	console.log("in child removed p1");
	if(!snapshot.hasChild("name")){
		player1.name = "";
		console.log(" name has been removed");
		$(".lblP1Name").text("");		
		$(".p1-wait-container").show();
	}else{
		console.log("still has child");
	}
})

p2Ref.on("child_removed", function(snapshot){
	if(!snapshot.hasChild("name")){
		player2.name = "";
		console.log("name has been removed");
		$(".lblP2Name").text("");
		$(".p2-wait-container").show();
	}else{
		console.log("still has child");		
	}
})

database.ref().on("child_changed", function(snapshot){
	
	if(snapshot.key == "player1"){
		console.log("player 1 has value change");
		$("#lblP1Record").text("Win : " + snapshot.val().win + " | Loss : " + snapshot.val().loss);
		if(snapshot.val().play != ""){
			player1.play = snapshot.val().play;
			console.log("set p1 has play to true");
			p1HasPlay = true;
		}else{
			console.log("set p1 has play to false");
			p1HasPlay = false;
		}
	}
	else if(snapshot.key == "player2"){
		console.log("player 2 has value change");
		$("#lblP2Record").text("Win : " + snapshot.val().win + " | Loss : " + snapshot.val().loss);
		if(snapshot.val().play != ""){
			player2.play = snapshot.val().play;
			console.log("set p2 has play to true");
			p2HasPlay = true;
		}else{
			console.log("set p2 has play to false");
			p2HasPlay = false;
		}
	}
	console.log("p1 has play and p2 has play " + p1HasPlay + " , " + p2HasPlay);
	if(p1HasPlay && p2HasPlay){
		console.log("both has play");
		playLogic();
		$(".p1-wait-for-p2-container").hide();
		$(".p2-wait-for-p1-container").hide();

	}else if(p1Control && p1HasPlay && !p2HasPlay){
		console.log("only p1 can see this");
		$(".p1-wait-for-p2-container").show();
		$(".play1-container").hide();
	}else if(p2Control && !p1HasPlay && p2HasPlay){
		console.log("only p2 can see this");
		$(".p2-wait-for-p1-container").show();
		$(".play2-container").hide();
	}
})

database.ref().on("child_added",function(snapshot, prevChildKey){
	console.log("lbl p1 name is " + $(".lblP1Name").val() + " . ")

	if(snapshot.key == "player1"){
		console.log("Name: " + snapshot.val().name);
		console.log("Win: " + snapshot.val().win);
		console.log("Loss: " + snapshot.val().loss);
		console.log("Play: " + snapshot.val().play);
		$(".lblP1Name").text(snapshot.val().name.trim());
		$("#lblP1Record").text("Win : " + snapshot.val().win + " | Loss : " + snapshot.val().loss);
		$(".p1-wait-container").hide();
	}else if(snapshot.key == "player2"){
		console.log("Name: " + snapshot.val().name);
		console.log("Win: " + snapshot.val().win);
		console.log("Loss: " + snapshot.val().loss);
		console.log("Play: " + snapshot.val().play);
		$(".lblP2Name").text(snapshot.val().name.trim());
		$("#lblP2Record").text("Win : " + snapshot.val().win + " | Loss : " + snapshot.val().loss);
		$(".p2-wait-container").hide();
	}
});


initialization()
$("#cmdPlay").click(function(){
	initialization();
	if(player1.exist == false && player2.exist == false){
		//both players DNE
		// proceed by registering player1 in player1 ref
		p1Ref.set({
			name : $("#txtName").val(),
			win : 0,
			loss : 0,
			play : ""
		});
		player1.name = $("#txtName").val();
		p1Ref.on("child_added", function(snapshot){
			p1Ref.onDisconnect().remove();
			player1.exist = false;
		});
		p1Control = true;
	}else if(player1.exist == true && player2.exist == false){
		p2Ref.set({
			name : $("#txtName").val(),
			win : 0,
			loss : 0,
			play : ""
		});
		player2.name = $("#txtName").val();
		p2Ref.on("child_added", function(snapshot){
			p2Ref.onDisconnect().remove();
			player2.exist=false;
		});
		p2Control = true;		
		//player 1 EXIST
		// proceed by registering player 2 in player 2 ref
	}else if(player1.exist == false && player2.exist == true){
		//player 2 EXIST
		// proceed by register player 1 in player 1 ref
		p1Ref.set({
			name : $("#txtName").val(),
			win : 0,
			loss : 0,
			play: ""

		});
		player1.name = $("#txtName").val();
		p1Ref.on("child_added", function(snapshot){
			p1Ref.onDisconnect().remove();
			player1.exist=false;
		});
		p1Control = true;
		
	}else if(player1.exist == true && player2.exist == true){
		//both players EXIST
		// prompt error message "Players are playing!"
		$(".msg-center").html("Both players are playing, please wait for your turn!")
	}
	if(p1Control && !p2Control){
		$(".play1-container").show();
		$(".play2-container").hide();
	}else if(!p1Control && p2Control){
		$(".play2-container").show();
		$(".play1-container").hide();
	}
	$("#txtName").empty();
})

$(".btn-p1").click(function(){
	console.log($(this).attr("data-play"));
	player1.play = $(this).attr("data-play");
	p1Ref.set({
		name: player1.name.trim(),
		play: $(this).attr("data-play"),
		win : player1.win,
		loss : player1.loss
	});
	/*p2Ref.once("value", function(snapshot){
		if(snapshot.val().play){
			$(".play1-container").hide();
			$(".p1-wait-for-p2-container").show();
		}
		playLogic();
		$("#lblP1Record").text("Win: " + p1win + "   | Loss : " + p1loss);
		$("#lblP2Record").text("Win: " + p2win + "   | Loss : " + p2loss);
		$("#lblP1Record").text("Win: " + p1win + "   | Loss : " + p1loss);
		$("#lblP2Record").text("Win: " + p2win + "   | Loss : " + p2loss);
	});*/
})

$(".btn-p2").click(function(){
	console.log($(this).attr("data-play"));
	player2.play = $(this).attr("data-play");
	p2Ref.set({
		name: player2.name.trim(),
		play: $(this).attr("data-play"),
		win : player2.win,
		loss : player2.loss
	});
	/*p1Ref.once("value", function(snapshot){
		if(snapshot.val().play){
			$(".play2-container").hide();
			$(".p2-wait-for-p1-container").show();
		}
		playLogic();
		$("#lblP1Record").text("Win: " + p1win + "   | Loss : " + p1loss);
		$("#lblP2Record").text("Win: " + p2win + "   | Loss : " + p2loss);
		$("#lblP1Record").text("Win: " + p1win + "   | Loss : " + p1loss);
		$("#lblP2Record").text("Win: " + p2win + "   | Loss : " + p2loss);
	});*/
})

function chatty(){
	var message;
	if(p1Control){
		console.log("here");
		message = player1.name + " : " + $("#txtChat").val();
		chat.push({
			"chat" : message,
		});
	}else if(p2Control){
		message = player2.name + " : " + $("#txtChat").val();
		chat.push({
			"chat" : message,
		})
	}else{

	}
	$("#txtChat").empty();
}

$("#btnChat").click(function(){
	event.preventDefault();
	chatty();
});

chat.on("child_added", function(snapshot){
	console.log("message");
	console.log(snapshot.val().chat);
	$("#textAreaChat").append(snapshot.val().chat);
	$("#textAreaChat").append("\r\n");
});

function showHands(){
	if(player1.name.trim() !== "" && player2.name.trim() !==""){
		$(".play1-container").show();
		$(".play2-container").show();
	}
}

function playLogic(){
	if(player1.play && player2.play){
		console.log("here");
		console.log("p1 play : " + player1.play + ", p2 play : " + player2.play )
		if((player1.play == "Rock" && player2.play == "Scissors") || (player1.play =="Scissors" && player2.play =="Paper") || (player1.play =="Paper" && player2.play == "Rock")){
			console.log("player 1 win!");
			$(".msg-center").text("player 1 win!");
			p1win++;
			p2loss++;
		}else if((player2.play == "Rock" && player1.play == "Scissors") || (player2.play =="Scissors" && player1.play =="Paper") || (player2.play =="Paper" && player1.play == "Rock")){
			console.log("player 2 win!");
			p1loss++;
			p2win++;
			$(".msg-center").text("player 2 win!");
		}else if((player1.play == "Rock" && player2.play == "Rock") || (player1.play == "Scissors" && player2.play == "Scissors") ||(player1.play == "Paper" && player2.play == "Paper")){
			console.log("ties!");
			$(".msg-center").text("ties");
			p1win = p1win;
			p1loss = p1loss;
			p2win = p2win;
			p2loss = p2loss;
			
		}
		setScore();
		$(".msg-center").show();
		setTimeout(function(){
			$(".msg-center").hide();
			if(p1Control && !p2Control){
				$(".play1-container").show();
				$(".p1-wait-for-p2-container").hide();
				$(".p1-wait-container").hide();
			}else if(!p1Control && p2Control){
				$(".play2-container").show();
				$(".p2-wait-for-p1-container").hide();
				$(".p2-wait-container").hide();
			}
		},5000);
	}	
}

function setScore(){
	p1Ref.set({
		name : player1.name,
		win : p1win,
		loss : p1loss,
		play : ""
	});
	player1.win = p1win;
	player1.loss = p1loss;
	player1.play = "";
	p2Ref.set({
		name : player2.name,
		win : p2win,
		loss : p2loss,
		play : ""
	})
	player2.win = p2win;
	player2.loss = p2loss;
	player2.play = "";

}