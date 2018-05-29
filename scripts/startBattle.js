//this just generate  the random enemy ship positioning
function makeEnemies() {
	let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
	let blocks = [];
	let rand = 0;
	let enemyship1 = document.createElement("p");
	enemyship1.setAttribute('class', 'enemyship1');
	enemyship1.setAttribute('id', 'enemyship1');
	enemyship1.style.width = "100px";
	let enemyship2 = document.createElement("p");
	enemyship2.setAttribute('class', 'enemyship2');
	enemyship2.setAttribute('id', 'enemyship2');
	enemyship2.style.width = "150px";
	let enemyship3 = document.createElement("p");
	enemyship3.setAttribute('class', 'enemyship3');
	enemyship3.setAttribute('id', 'enemyship3');
	enemyship3.style.width = "150px";
	let enemyship4 = document.createElement("p");
	enemyship4.setAttribute('class', 'enemyship4');
	enemyship4.setAttribute('id', 'enemyship4');
	enemyship4.style.width = "200px";
	let enemyship5 = document.createElement("p");
	enemyship5.setAttribute('class', 'enemyship5');
	enemyship5.setAttribute('id', 'enemyship5');
	enemyship5.style.width = "250px";
	enemyship1.style.height = "100px";
	enemyship2.style.height = "150px";
	enemyship3.style.height = "150px";
	enemyship4.style.height = "200px";
	enemyship5.style.height = "250px";
	document.querySelector(".menu").appendChild(enemyship1);
	document.querySelector(".menu").appendChild(enemyship2);
	document.querySelector(".menu").appendChild(enemyship3);
	document.querySelector(".menu").appendChild(enemyship4);
	document.querySelector(".menu").appendChild(enemyship5);
	
	for (let i = 1; i <= 10; i++) {
		for (let j = 0; j < 10; j++) {
			blocks.push(letters[j] + i)
		}
	}
	//i think my big if statement is a bad way (the manual way) to check for ship positioning, 
	//but again, it is tied to my previous functions. so if my first functions were coded poorly
	//i couldn't do much to change this.
	function horiShipGrid(rand, ship) {
		rand = blocks[Math.floor(Math.random() * blocks.length)];
		if ((ship.slice(-1) === "1" && letters.slice(-1).indexOf(rand[0]) >= 0) ||
			(ship.slice(-1) === "2" && letters.slice(-2).indexOf(rand[0]) >= 0) ||
			(ship.slice(-1) === "3" && letters.slice(-2).indexOf(rand[0]) >= 0) ||
			(ship.slice(-1) === "4" && letters.slice(-3).indexOf(rand[0]) >= 0) ||
			(ship.slice(-1) === "5" && letters.slice(-4).indexOf(rand[0]) >= 0)) {
			return horiShipGrid(0, ship);
		} else if (overLapCheck(document.querySelector("div.rightBoard #" + CSS.escape(rand)), ship)) {
			return horiShipGrid(0, ship);
		} else {
			console.log(rand, "hori");
			return rand;
		}
	}

	function vertShipGrid(rand, ship) {
		rand = blocks[Math.floor(Math.random() * blocks.length)];
		if ((rand.length === 3) ||
			(ship.slice(-1) === "2" && rand[1] > 8) ||
			(ship.slice(-1) === "3" && rand[1] > 8) ||
			(ship.slice(-1) === "4" && rand[1] > 7) ||
			(ship.slice(-1) === "5" && rand[1] > 6)) {
			return vertShipGrid(0, ship);
		} else if (overLapCheck(document.querySelector("div.rightBoard #" + CSS.escape(rand)), ship)) {
			return vertShipGrid(0, ship);
		} else {
			console.log(rand, "vert");
			return rand;
		}
	}

	function placeShips(rand, ship) {
		if (Math.random() > 0.5) {
			rand = horiShipGrid(rand, ship);
			placedShips(document.querySelector("div.rightBoard div[title=" + CSS.escape(rand) + "]"), ship);
		} else {
			document.getElementById(ship).setAttribute('class', ship + 'rotate');
			rand = vertShipGrid(rand, ship);
			placedShips(document.querySelector("div.rightBoard div[title=" + CSS.escape(rand) + "]"), ship);
		}
	}
	placeShips(rand, "enemyship1");
	placeShips(rand, "enemyship2");
	placeShips(rand, "enemyship3");
	placeShips(rand, "enemyship4");
	placeShips(rand, "enemyship5");
	document.querySelector(".Title").innerHTML = "BEGIN! Fire Away ==@";
	gameBegin(17, 17);

}

function freshGame() {
	while (RightBoard.hasChildNodes()) {
		RightBoard.removeChild(RightBoard.lastChild);
	}
	RightBoard.style.backgroundImage = "url('images/.images/image.full.jpg')";
	RightBoard.style.backgroundRepeat = "no-repeat";
	RightBoard.style.backgroundPosition = "50 % 50 %";
}

//originally i wanted to make this a recursion function. so whenever i click enemy grid. they would 
//hit me back and this will loop until one of our lives run out.
//but the click event listener (callback) seems to be independent of execution ordering and i just couldn't
//know how to make it work.
function gameBegin(playerLives, pcLives) {
	if (playerLives === 0) {
		alert("You lost :/");
		return;
	}
	if (pcLives === 0) {
		alert("You Win :D");
		return;
	}
	RightBoard.removeAttribute('title');
}


//this is my click event listener. looks very bloated and bad. in the end i couldn't figure out 
//how to properly utilize the recursion and listener together.
//also i don't know why but the 'setTimeout' doesn't seem to work :/
document.querySelector(".rightBoard").addEventListener('click', event => {
	event.stopPropagation();
	const element = event.target;
	if (element.title.indexOf("ship") < 0) {
		element.classList.add('rightCell--miss');
		document.querySelector(".Title").innerHTML = "@== Enemy Firing!";
		RightBoard.setAttribute('title', "regulate");

		//swith between random and guided enemy fire function for difficulty adjustment.
		setTimeout(guidedEnemyFire(leftGridsCopy), 2000);
		// setTimeout(gameBegin(playerLives, pcLives), 2000);
	} else if (element.title.indexOf("ship") >= 0) {
		element.classList.add('rightCell--hit');
		document.querySelector(".Title").innerHTML = "@== Enemy Firing!";
		pcLives--;
		console.log(pcLives, "pcLives");
		if (pcLives === 0) {
			alert("You Win :D, you reached the end of the game program");
			return;
		}
		// setTimeout(gameBegin(playerLives, pcLives), 2000);	
		setTimeout(guidedEnemyFire(leftGridsCopy), 2000);
	}
});


//so either this or guidedEnemyFire can be used to set PC difficulty. i didn't implement a button to
//swtich them.
function randomEnemyFire(leftGridsCopy) {
	let randomGrid = Math.floor(Math.random() * (leftGridsCopy.length));
	let element = leftBoard.childNodes[leftGridsCopy[randomGrid]];
	leftGridsCopy.splice(randomGrid, 1);
	if (element.title.indexOf("ship") < 0) {
		element.classList.add('leftCell--miss');
		document.querySelector(".Title").innerHTML = "@== Fire Away!";
		RightBoard.removeAttribute('title');
	} else if (element.title.indexOf("ship") >= 0) {
		element.classList.add('leftCell--hit');
		//		element.style.transform = "rotate(0deg)";
		document.querySelector(".Title").innerHTML = "@== Fire Away!";
		RightBoard.removeAttribute('title');
		playerLives--;
		console.log(playerLives, "playerLives");
		if (playerLives === 0) {
			alert("You lost :/, you reached the end of the game program");
			return;
		}
	}
	console.log(element.title, "enemy missile hit");
	return playerLives;
}

function guidedEnemyFire(leftGridsCopy) {
	let randomGrid = Math.floor(Math.random() * (leftGridsCopy.length));
	let element = {};
	let i = 0;
	if (targettedGrids.length > 0) {
		i = Math.floor(Math.random() * (targettedGrids.length));
		element = leftBoard.childNodes[targettedGrids[i]];
	} else {
		element = leftBoard.childNodes[leftGridsCopy[randomGrid]];
	}

	if (element.title.indexOf("ship") < 0) {
		element.classList.add('leftCell--miss');
		document.querySelector(".Title").innerHTML = "@== Fire Away!";
		RightBoard.removeAttribute('title');
		if (targettedGrids.length > 0) {
			targettedGrids.splice(i, 1);
			leftGridsCopy.splice(i, 1);
		} else {
			leftGridsCopy.splice(randomGrid, 1);
		}
	} else if (element.title.indexOf("ship") >= 0) {
		element.classList.add('leftCell--hit');
		let elementIndex = 0;
		for (let i = 0; i < leftBoard.childNodes.length; i++) {
			if (element === leftBoard.childNodes[i]) {
				elementIndex = i;
			}
		}
		if (targettedGrids.length > 0) {
			targettedGrids.splice(i, 1);
			leftGridsCopy.splice(i, 1);
		} else {
			leftGridsCopy.splice(randomGrid, 1);
		}
		if (typeof(element.nextSibling) !== "undefined" &&
			leftBoard.childNodes[elementIndex + 1].classList.value === "leftCell" &&
			element.title.charAt(0) !== 'J') {
			targettedGrids.push(elementIndex + 1);
		}
		if (typeof(element.previousSibling) !== "undefined" &&
			leftBoard.childNodes[elementIndex - 1].classList.value === "leftCell" &&
			element.title.charAt(0) !== 'A') {
			targettedGrids.push(elementIndex - 1);
		}
		if (typeof(leftBoard.childNodes[elementIndex - 10]) !== "undefined" &&
			leftBoard.childNodes[elementIndex - 10].classList.value === "leftCell") {
			targettedGrids.push(elementIndex - 10);
		}
		if (typeof(leftBoard.childNodes[elementIndex + 10]) !== "undefined" &&
			leftBoard.childNodes[elementIndex + 10].classList.value === "leftCell") {
			targettedGrids.push(elementIndex + 10);
		}
		document.querySelector(".Title").innerHTML = "@== Fire Away!";
		RightBoard.removeAttribute('title');
		playerLives--;
		console.log(playerLives, "playerLives");
		if (playerLives === 0) {
			alert("You lost :/, you reached the end of the game program");
			return;
		}
	}
	console.log(element.title, "enemy missile hit");
	return playerLives;
}


function gameRefresh() {
	location.reload();
}

//some left of rob's note 
// leftBoard.addEventListener('click', event => {
// 	const element = event.target;
// 	if (element.classList.contains('leftCell')) {
// 		if (element.classList.contains('leftCell--miss')) {
// 			element.classList.remove('leftCell--miss');
// 		} else {
// 			element.classList.add('leftCell--miss');
// 		}
// 		// } else if (element.tagName === 'IMG') {
// 		//   element.parentNode.classList.add('leftCell--hit');
// 	}
// });

//egg
window.onkeyup = function(e) {
	let key = e.keyCode ? e.keyCode : e.which;
	let z = true;
	x.push(key);
	let y = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
	if (JSON.stringify(x) == JSON.stringify(y)) {
		document.getElementById('myimage').style.visibility = "visible";

	}
}