var canvas, ctx;
var csw, csh;
var cw = 25;
var cv, ch; 
var cells = new Array();
var SnakeBody = new Array();
var wall = new Array();
var snake;
var food;
var speed = 1;

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
	var x = Math.round(ch / 2);
	var y = Math.round(cv / 2);
	snake = new Snake(cells[index(x, y)]);
	snake.draw();
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
}

function index(x, y){
	if (x > ch || y > cv || x < 0 || y < 0) {
		return -1;
	}
	return x + y * ch;
}

function Food(v2in){
	this.pos = v2in;
	this.draw = function(){
		ctx.fillStyle = '#090';
		ctx.fillRect(this.pos.x, this.pos.y, cw, cw);
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
		var x = getRnd(1, ch-1);
		var y = getRnd(1, cv-1);
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
	food.draw();
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
	this.draw = function(){
		for (var i = SnakeBody.length - 1; i >= 0; i--) {
			SnakeBody[i].draw();
		}
	}
}

function Part(v2in, c){
	this.pos = v2in;
	this.c = c;
	this.update = function(v2in){this.pos = v2in;}
	this.draw = function(){
		ctx.fillStyle = this.c;
		ctx.fillRect(this.pos.x, this.pos.y, cw, cw);
	}
}

function Wall(v2in, c){
	this.pos = v2in;
	this.c = c;
	this.draw = function(){
		ctx.fillStyle = this.c;
		ctx.fillRect(this.pos.x, this.pos.y, cw, cw);
	}
}

function DrawWall(){
	for (var i = 0; i < wall.length; i++) {
		wall[i].draw();
	}
}

var KC = 39;
var play = false;
function Update(){
	if (play) {
		DrawRect(0, 0, csw, csh, '#FFF');
		snake.draw();
		food.draw();
		DrawWall();
		if (v2Equals(food.pos, SnakeBody[0].pos)) {
			CreateNewFood();
			snake.addNewPart();
		}
		for (var i = 1; i < SnakeBody.length; i++) {
			if (v2Equals(SnakeBody[0].pos, SnakeBody[i].pos)) {
				// play = false;
				GameOver();
			}
		}
		for (var i = 0; i < wall.length; i++) {
			if (v2Equals(SnakeBody[0].pos, wall[i].pos)) {
				// play = false;
				GameOver();
			}
		}
		if (food.pos.x > SnakeBody[0].pos.x) {
			KC = 39;
		} 
		if (food.pos.x < SnakeBody[0].pos.x) {
			KC = 37;
		}
		if (food.pos.y > SnakeBody[0].pos.y) {
			KC = 40;
		} 
		if (food.pos.y < SnakeBody[0].pos.y) {
			KC = 38;
		}

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
	
}

function Play(){
	play = true;
}

setInterval(()=>{Update()}, speed);