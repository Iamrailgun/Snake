var canvas, ctx;
var csw, csh;
var cw = 20;
var cv, ch; 
var cells = new Array();
var SnakeBody = new Array();
var wall = new Array();
var snake;
var food;
var speed = 1000/30;
var sx, sy;
var score = 0;

function OnLoad(){
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	csw = canvas.width;
	csh = canvas.height;
	ch = Math.round(csw / cw);
	cv = Math.round(csh / cw);
	for (var i = 0; i < cv; i++) {
		for (var j = 0; j < ch; j++) {
			var pos = new Vector2(j * cw, i * cw);
			cells.push(pos);
			if (i == 0 || i == cv-1 ||
					j == 0 || j == ch-1) {
				wall.push(new Wall(pos, '#000'));
			}
		}
	}
	sx = Math.round(ch / 2);
	sy = Math.round(cv / 2);
	snake = new Snake(cells[index(sx, sy)]);
	// console.log(cells[index(sx, sy)].toCell().print());
	// console.log(SnakeBody[0].pos.toCell().print());
	snake.drawSnake();
	CreateNewFood();
	DrawWall();
}

function Vector2(x, y){
	this.x = x;
	this.y = y;
	this.addXY = function(x, y){
		this.x += x;
		this.y += y;
	}
	this.addV2 = function(v2in){
		this.x += v2in.x;
		this.y += v2in.y;
	}
	this.print = function(){
		return (this.x + ' ' + this.y);
	}
	this.zero = function(){
		return new Vector2(0, 0);
	}
	this.set = function(v2in){
		this.x = v2in.x;
		this.y = v2in.y;
	}
	this.toCell = function(){
		return new Vector2(this.x / cw, this.y / cw);
	}
}

function index(x, y){
	if (x > ch || y > cv || x < 0 || y < 0) {
		return -1;
	}
	return x + y * ch;
}

function Food(v2in){
	this.pos = v2in;
	this.drawFood = function(){
		DrawRect(this.pos.x, this.pos.y, cw, cw, '#090');
	}
}

function getRnd(min, max){
	return Math.floor(Math.random() * (max - min)) + min;;
}

var cnt;
function CreateNewFood(){
	var canPlace;
	do {
		canPlace = true;
		var x = getRnd(3, ch-5);
		var y = getRnd(3, cv-5);
		var pos = cells[index(x, y)] ;
		for (var i = 0; i < SnakeBody.length; i++) {
			if (v2Equals(pos, SnakeBody[i].pos)) {
				canPlace = false;
				break;
			}
		}
	}
	while (!canPlace);
	food = new Food(pos);
	food.drawFood();
}

function v2Equals(v2a, v2b){
	if (v2a.x == v2b.x & v2a.y == v2b.y) {
		return true;
	} else {
		return false;
	}
}

function DrawRect(x, y, w, h, color){
	ctx.fillStyle = color;
	ctx.fillRect(x, y, w, h);
}

function Snake(v2in){
	this.pos = v2in;
	this.add = function(v2in, c){SnakeBody.push(new Part(v2in, c));}
	this.add(this.pos, '#F00');
	for (var i = 0; i < 4; i++) {
		this.add(new Vector2(SnakeBody[i].pos.x - cw, this.pos.y), '#555');
	}
	this.addNewPart = function(){this.add(new Vector2().zero(), '#555');}
	this.move = function(){
		for(var i = SnakeBody.length - 1; i >= 1; i--) {
			SnakeBody[i].pos.set(SnakeBody[i-1].pos);
		}
	}
	this.moveUP = function(){this.move();SnakeBody[0].pos.addXY(0, -cw);}
	this.moveDown = function(){this.move();SnakeBody[0].pos.addXY(0, cw);}
	this.moveRite = function(){this.move();SnakeBody[0].pos.addXY(cw, 0);}
	this.moveLeft = function(){this.move();SnakeBody[0].pos.addXY(-cw, 0);}
	this.drawSnake = function(){
		for (var i = SnakeBody.length - 1; i >= 0; i--) {
			SnakeBody[i].drawPart();
		}
	}
}

function Part(v2in, c){
	this.pos = v2in;
	this.c = c;
	this.update = function(v2in){this.pos = v2in;}
	this.drawPart = function(){
		DrawRect(this.pos.x, this.pos.y, cw, cw, this.c);
	}
}

function Wall(v2in, c){
	this.pos = v2in;
	this.c = c;
	this.draw = function(){
		DrawRect(this.pos.x, this.pos.y, cw, cw, this.c);
	}
}

function DrawWall(){
	for (var i = 0; i < wall.length; i++) {
		wall[i].draw();
	}
}

function findPath(){
	var head = SnakeBody[0].pos;
	var canGaRight = true;
	var canGaLeft = true;
	var canGaUp = true;
	var canGaDown = true;
	var checkBlocks = 2;
	for (var i = head.toCell().x; i < head.toCell().x + checkBlocks; i++) {
		for (var j = 1; j < SnakeBody.length; j++) {
			if (v2Equals(cells[index(i, head.toCell().y)], SnakeBody[j].pos)) {
				canGaRight = false;
			} 
		}
	}
	for (var i = head.toCell().x; i > head.toCell().x - checkBlocks; i--) {
		for (var j = 1; j < SnakeBody.length; j++) {
			if (v2Equals(cells[index(i, head.toCell().y)], SnakeBody[j].pos)) {
				canGaLeft = false;
			} 
		}
	}
	for (var i = head.toCell().y; i < head.toCell().y + checkBlocks; i++) {
		for (var j = 1; j < SnakeBody.length; j++) {
			if (v2Equals(cells[index(head.toCell().x, i)], SnakeBody[j].pos)) {
				canGaDown = false;
			} 
		}
	}
	for (var i = head.toCell().x; i > head.toCell().x - checkBlocks; i--) {
		for (var j = 1; j < SnakeBody.length; j++) {
			if (v2Equals(cells[index(head.toCell().x, i)], SnakeBody[j].pos)) {
				canGaUp = false;
			} 
		}
	}
	if (food.pos.x > head.x && canGaRight) {
		KC = 39;
	} 
	if ( food.pos.x < head.x && canGaLeft) {
		KC = 37;
	}
	if ( food.pos.y > head.y && canGaDown) {
		KC = 40;
	} 
	if ( food.pos.y < head.y && canGaUp) {
		KC = 38;
	}
}

var KC = 39;
var play = false;
function Update(){
	if (play) {
		DrawRect(0, 0, csw, csh, '#FFF');
		snake.drawSnake();
		food.drawFood();
		DrawWall();
		if (v2Equals(food.pos, SnakeBody[0].pos)) {
			CreateNewFood();
			snake.addNewPart();
			score++;
		}
		for (var i = 1; i < SnakeBody.length; i++) {
			if (v2Equals(SnakeBody[0].pos, SnakeBody[i].pos)) {
				GameOver();
			}
		}
		for (var i = 0; i < wall.length; i++) {
			if (v2Equals(SnakeBody[0].pos, wall[i].pos)) {
				GameOver();
			}
		}
		findPath();
		document.onkeydown = function(e) {KC = e.keyCode;};
	  switch (KC) {
		  case 37:
		      snake.moveLeft();
		      break;
		  case 38:
		      snake.moveUP();
		      break;
		  case 39:
		      snake.moveRite();
		      break;
		  case 40:
		      snake.moveDown();
		      break;
	  }
	}
}

function GameOver(){
	play = false;
	KC = 39;
	DrawRect(0, 0, csw, csh, '#FFF');
	SnakeBody = new Array();
	snake = new Snake(new Vector2(sx * cw, sy * cw));
	snake.drawSnake();
	CreateNewFood();
	DrawWall();
	alert('GAME OVER Счет ' + score);
	score = 0;
}

function Play(){
	play = true;
}

setInterval(()=>{Update()}, speed);