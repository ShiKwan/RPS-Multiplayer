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
}

initialization()

p1Ref.on("value",function(snapshot){
	console.log("printing p1 ref");
	console.log(snapshot.val());
	if(snapshot.val()){
		player1.exist = true;
		player1.name = snapshot.val().name.trim();
		$(".p1-wait-container").hide();
		$(".lblP1Name").text(snapshot.val().name.trim());
		if(snapshot.val().play !==""){
			player1.play = snapshot.val().play;
		}
	}else{
		player1.exist=false;
		$(".p1-wait-container").show();
		$(".play1-container").hide();
	}
	
},function(error){
	console.log("error: " + error.code);
})

p2Ref.on("value",function(snapshot){
	console.log("printing p2 ref");
	console.log(snapshot.val());
	if(snapshot.val()){
		player2.exist = true;
		player2.name = snapshot.val().name;
		$(".p2-wait-container").hide();
		$(".lblP2Name").text(snapshot.val().name.trim());
		if(snapshot.val().play !==""){
			player2.play = snapshot.val().play;
		}
	}else{
		player2.exist=false;
		$(".p2-wait-container").show();
		$(".play2-container").hide();
	}
},function(error){
	console.log("error: " + error.code);
})

p1Ref.on("child_added", function(snapshot){
	player1.exist=false;	
	if(snapshot.val().name !== "" || snapshot.val().name){
		player1.name = snapshot.val().name;
		$(".lblP1Name").text(player1.name);
	}
	if(snapshot.val().play !== ""){
		player1.play = snapshot.val().play;
	}
});

p2Ref.on("child_added", function(snapshot){
	
	player2.exist=false;
	if(snapshot.val().name !== "" || snapshot.val().name){
		player2.name = snapshot.val().name;
		$(".lblP2Name").text(player2.name);
	}
	if(snapshot.val().play !== ""){
		player2.play = snapshot.val().play;
	}
});

$("#cmdPlay").click(function(){
	if(player1.exist == false && player2.exist == false){
		//both players DNE
		// proceed by registering player1 in player1 ref
		p1Ref.set({
			name : $("#txtName").val()
		});
		player1.name = $("#txtName").val();
		p1Ref.on("child_added", function(snapshot){
			p1Ref.onDisconnect().remove();
			player1.exist=false;
			if(snapshot.val().play !== ""){
				player1.play = snapshot.val().play;
			}
		});
		p1Control = true;
		hideP2Stuffs();
		$(".player2-container").hide();
	}else if(player1.exist == true && player2.exist == false){
		p2Ref.set({
			name : $("#txtName").val()
		});
		player2.name = $("#txtName").val();
		p2Ref.on("child_added", function(snapshot){
			p2Ref.onDisconnect().remove();
			player2.exist=false;
			if(snapshot.val().play !== ""){
				player2.play = snapshot.val().play;
			}
		});
		p2Control = true;
		hideP1Stuffs();
		$(".player1-container").hide();

		
		//player 1 EXIST
		// proceed by registering player 2 in player 2 ref
	}else if(player1.exist == false && player2.exist == true){
		//player 2 EXIST
		// proceed by register player 1 in player 1 ref
		p1Ref.set({
			name : $("#txtName").val()
		});
		player1.name = $("#txtName").val();
		p1Ref.on("child_added", function(snapshot){
			p1Ref.onDisconnect().remove();
			player1.exist=false;
			if(snapshot.val().play !== ""){
				player1.play = snapshot.val().play;
			}
		});
		p1Control = true;
		hideP2Stuffs();
		$(".player2-container").hide();
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
})

$(".btn-p1").click(function(){
	console.log($(this).attr("data-play"));
	player1.play = $(this).attr("data-play");
	p1Ref.set({
		name: player1.name.trim(),
		play: $(this).attr("data-play")
	});
	p2Ref.once("value", function(snapshot){
		if(snapshot.val().play){
			$(".play1-container").hide();
			$(".p1-wait-for-p2-container").show();
		}
		playLogic();
	});
})

$(".btn-p2").click(function(){
	console.log($(this).attr("data-play"));
	player2.play = $(this).attr("data-play");
	p2Ref.set({
		name: player2.name.trim(),
		play: $(this).attr("data-play")
	});
	p1Ref.once("value", function(snapshot){
		if(snapshot.val().play){
			$(".play2-container").hide();
			$(".p2-wait-for-p1-container").show();
		}
		playLogic();
	});
})

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
			$("#lblP1Record").text("Win: " + p1win + "   | Loss : " + p1loss);
			$("#lblP2Record").text("Win: " + p2win + "   | Loss : " + p2loss);

		}else if((player2.play == "Rock" && player1.play == "Scissors") || (player2.play =="Scissors" && player1.play =="Paper") || (player2.play =="Paper" && player1.play == "Rock")){
			console.log("player 2 win!");
			p1loss++;
			p2win++;
			$(".msg-center").text("player 2 win!");
			$("#lblP1Record").text("Win: " + p1win + "   | Loss : " + p1loss);
			$("#lblP2Record").text("Win: " + p2win + "   | Loss : " + p2loss);
		}else if((player1.play == "Rock" && player2.play == "Rock") || (player1.play == "Scissors" && player2.play == "Scissors") ||(player1.play == "Paper" && player2.play == "Paper")){
			console.log("ties!");
			$(".msg-center").text("ties");
			p1win = p1win;
			p1loss = p1loss;
			p2win = p2win;
			p2loss = p2loss;
			$("#lblP1Record").text("Win: " + p1win + "   | Loss : " + p1loss);
			$("#lblP2Record").text("Win: " + p2win + "   | Loss : " + p2loss);
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
		loss : p1loss
	});
	player1.win = p1win;
	player1.loss = p1loss;
	player1.play = "";
	p2Ref.set({
		name : player2.name,
		win : p2win,
		loss : p2loss
	})
	player2.win = p2win;
	player2.loss = p2loss;
	player2.play = "";

}