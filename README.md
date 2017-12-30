# RPS-Multiplayer


Variable:
P1_Occupied
P2_Occupied



Planning:


Browser Scenario:
	First load:
		- Check for player 1 
			- if exist, 
				- pull name from user and change the label.
				- hide p1 waiting screen
				- show score
			- else, 
				- show p1 waiting screen
				- hide score


	Player 1/ Player 2 takes a spot
		- P1.ref(child_added), has child("name")
			- pull name from user and change the label.
			- hide p1 waiting screen			
			- show p1 score

		- P2.ref(child_added), has child("name")
			- pull name from user and change the label.
			- hide p2 waiting screen			
			- show p2 score