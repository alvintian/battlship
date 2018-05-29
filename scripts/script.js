//i couldn't utilize all of my time while coding this
//but it is night time now so i can comment more.

//i know global variables are bad. most of thoes variables are used at the end.
var leftBoard = document.getElementById('leftBoard');
var RightBoard = document.getElementById('rightBoard');

var playerLives = 17;
var pcLives = 17;
var leftGridsCopy = [...Array(100)].map((a, b) => b);
var targettedGrids = [];
var x = [];

//making cells 
function generateBlockId(x) {
  let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  let blocks = [];
  for (let i = 1; i <= 10; i++) {
    for (let j = 0; j < 10; j++) {
      blocks.push(letters[j] + i)
    }
  }
  return blocks[x];
}
//start screen
$('.enter_link').click(function() {
  $(this).parent('#splashscreen').fadeOut(500);
});
//this just set the map to be non clickable.
RightBoard.setAttribute('title', "regulate");



//making the map
function leftGrids() {
  for (let i = 0; i < 100; i++) {
    let row = document.createElement("div");
    row.setAttribute('class', 'leftCell');
    row.setAttribute('title', generateBlockId(i));
    //    row.innerHTML = blocks[i];
    row.setAttribute('ondrop', "drop(event,this)");
    row.setAttribute('ondragover', "allowDrop(event)");
    leftBoard.appendChild(row);
  }
}

function rightGrids() {
  for (let i = 0; i < 100; i++) {
    let row = document.createElement("div");
    row.setAttribute('class', 'rightCell');
    row.setAttribute('title', generateBlockId(i));
    row.setAttribute('id', generateBlockId(i));
    row.innerHTML = generateBlockId(i);
    rightBoard.appendChild(row);
  }
}
//can i drop my functions here so casually? 
leftGrids();
rightGrids();

//i think it would be better if i put all the drag and drop functions inside an independent script.
function allowDrop(ev) {
  ev.preventDefault();
  let data = ev.dataTransfer.getData("text");
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

//ships are rotatable, but only within the place they were set.
let ships = $("[draggable=true]");
let counter = 1;
for (let i = 0; i < ships.length; i++) {
  ships[i].addEventListener("click", function(e) {
    if (e.target.parentNode.className === "menu") {
      counter++;
      if (counter % 2 === 0) {
        document.getElementById(e.target.id).setAttribute('class', e.target.id + 'rotate');
        document.getElementById(e.target.id).style.transform = "rotate(90deg)";
      } else {
        document.getElementById(e.target.id).setAttribute('class', e.target.id.replace('rotate', ""));
        document.getElementById(e.target.id).style.transform = "rotate(0deg)";
      }
    }
  });
}
//checkingfor ship overlap. i used 'getBoundingClientRect()'to get the ships coordinates
//i wonder if there are any other ways to code the ship placements. i couldn't figure it out.
function overLapCheck(grid, data) {
  let shipXCoordinate = grid.getBoundingClientRect().x + document.getElementById(data).getBoundingClientRect().width;
  let shipYCoordinate = grid.getBoundingClientRect().y + document.getElementById(data).getBoundingClientRect().height;
  let allShipXcoord = [];
  let allShipYcoord = [];
  for (let i = 0; i < document.getElementById('leftBoard').childNodes.length; i++) {
    if (grid.parentNode.childNodes[i].title.indexOf("ship") >= 0) {
      allShipXcoord.push(grid.parentNode.childNodes[i].getBoundingClientRect().x);
      allShipYcoord.push(grid.parentNode.childNodes[i].getBoundingClientRect().y);
    }
  }
  for (let i = 0; i < allShipXcoord.length; i++) {
    if ((grid.getBoundingClientRect().x < allShipXcoord[i] + 25) && (allShipXcoord[i] + 25 < shipXCoordinate) &&
      (grid.getBoundingClientRect().y < allShipYcoord[i] + 25) && (allShipYcoord[i] + 25 < shipYCoordinate)) {
      // console.log("x:", grid.getBoundingClientRect().x, allShipXcoord[i] + 25, shipXCoordinate,
      //   "y: ", grid.getBoundingClientRect().y, allShipYcoord[i] + 25, shipYCoordinate);
      return true;
    }
  }
}
//i wrote this function pretty early on. instead of matching ships with divs(cells) based on the coordinates
// i just hard coded the objects. now i regret this because later on i need to use this function again for enemy
//spawns.
function placedShips(grid, data) {
  let shipName = document.getElementById(data).className;
  let shipIndex = [...grid.parentNode.children].indexOf(grid);
  let gridsArray = grid.parentNode.childNodes;

  grid.setAttribute('title', grid.title + data);
  if (shipName.indexOf("ship1") >= 0 && shipName.indexOf("rotate") < 0) {
    grid.nextSibling.setAttribute('title', grid.nextSibling.title + data);
  }
  if (shipName.indexOf("ship1rotate") >= 0) {
    gridsArray[shipIndex + 10].setAttribute('title', gridsArray[shipIndex + 10].title + data);
  }
  if ((shipName.indexOf("ship2") >= 0 && shipName.indexOf("rotate") < 0) || (shipName.indexOf("ship3") >= 0 && shipName.indexOf("rotate") < 0)) {
    grid.nextSibling.setAttribute('title', grid.nextSibling.title + data);
    grid.nextSibling.nextSibling.setAttribute('title', grid.nextSibling.nextSibling.title + data);
  }
  if (shipName.indexOf("ship2rotate") >= 0 || shipName.indexOf("ship3rotate") >= 0) {
    gridsArray[shipIndex + 10].setAttribute('title', gridsArray[shipIndex + 10].title + data);
    gridsArray[shipIndex + 20].setAttribute('title', gridsArray[shipIndex + 20].title + data);
  }
  if (shipName.indexOf("ship4") >= 0 && shipName.indexOf("rotate") < 0) {
    grid.nextSibling.setAttribute('title', grid.nextSibling.title + data);
    grid.nextSibling.nextSibling.setAttribute('title', grid.nextSibling.nextSibling.title + data);
    grid.nextSibling.nextSibling.nextSibling.setAttribute('title', grid.nextSibling.nextSibling.nextSibling.title + data);
  }
  if (shipName.indexOf("ship4rotate") >= 0) {
    gridsArray[shipIndex + 10].setAttribute('title', gridsArray[shipIndex + 10].title + data);
    gridsArray[shipIndex + 20].setAttribute('title', gridsArray[shipIndex + 20].title + data);
    gridsArray[shipIndex + 30].setAttribute('title', gridsArray[shipIndex + 30].title + data);
  }
  if (shipName.indexOf("ship5") >= 0 && shipName.indexOf("rotate") < 0) {
    grid.nextSibling.setAttribute('title', grid.nextSibling.title + data);
    grid.nextSibling.nextSibling.setAttribute('title', grid.nextSibling.nextSibling.title + data);
    grid.nextSibling.nextSibling.nextSibling.setAttribute('title', grid.nextSibling.nextSibling.nextSibling.title + data);
    grid.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute('title', grid.nextSibling.nextSibling.nextSibling.nextSibling.title + data);
  }
  if (shipName.indexOf("ship5rotate") >= 0) {
    gridsArray[shipIndex + 10].setAttribute('title', gridsArray[shipIndex + 10].title + data);
    gridsArray[shipIndex + 20].setAttribute('title', gridsArray[shipIndex + 20].title + data);
    gridsArray[shipIndex + 30].setAttribute('title', gridsArray[shipIndex + 30].title + data);
    gridsArray[shipIndex + 40].setAttribute('title', gridsArray[shipIndex + 40].title + data);
  }
}
//my on drop function. i think in there some for loops are repeated. i can prob shorten this, but i will also need to
//change my other functions with it.
function drop(ev, el) {
  ev.preventDefault();
  let data = ev.dataTransfer.getData("text");
  let leftGrid = document.getElementById('leftBoard').childNodes;
  let shipXCoordinate = ev.target.getBoundingClientRect().x + document.getElementById(data).getBoundingClientRect().width;
  let shipYCoordinate = ev.target.getBoundingClientRect().y + document.getElementById(data).getBoundingClientRect().height;

  if (ev.target.className === "menu") {
    ev.target.appendChild(document.getElementById(data), ev.target);
    for (let i = 0; i < leftGrid.length; i++) {
      if (leftGrid[i].title.includes(data)) {
        leftGrid[i].title = leftGrid[i].title.replace(data, "");
      }
    }
  } else if (ev.target.parentNode.className === "leftBoard") {
    let helperVar = [];
    for (let i = 0; i < leftGrid.length; i++) {
      if (leftGrid[i].title.includes(data)) {
        helperVar.push(i);
        leftGrid[i].title = leftGrid[i].title.replace(data, "");
      }
    }
    if (overLapCheck(ev.target, data)) {
      if (helperVar.length > 0 && leftGrid[helperVar[0]].title.indexOf("battleship") < 0) {
        for (let i = 0; i < helperVar.length; i++) {
          leftGrid[helperVar[i]].title = leftGrid[helperVar[i]].title.concat(data);
        }
      }
      alert("ships overlap!");
      return;
    }
    //checking for placing ships out of bounds.
    if (shipXCoordinate - 59 > 500 || shipYCoordinate - document.getElementById('leftBoard').getBoundingClientRect().y - 1 > 500) {
      if (helperVar.length > 0 && leftGrid[helperVar[0]].title.indexOf("battleship") < 0) {
        for (let i = 0; i < helperVar.length; i++) {
          leftGrid[helperVar[i]].title = leftGrid[helperVar[i]].title.concat(data);
        }
      }
      alert("out of bounds on " + shipXCoordinate + " and " + (shipYCoordinate));
    } else {
      ev.target.appendChild(document.getElementById(data), ev.target);
      placedShips(ev.target, data);
    }
  }
}

//when player is ready press the button.
function gameReady() {
  document.getElementById('beginGame').style.visibility = "hidden";
  let leftGrids = document.getElementById('leftBoard').childNodes;
  let lives = 0;
  for (let i = 0; i < leftGrids.length; i++) {
    if (leftGrids[i].title.indexOf("battleship") >= 0) {
      lives++;
    }
  }
  if (lives < 17) {
    alert("you haven't placed all your ships.");
  } else {
    makeEnemies();
  }
}