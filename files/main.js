var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

const WIDTH = 500;
const HEIGHT = 500;
const ARROW_LEFT = 37;
const ARROW_RIGHT = 39;
const SPACE_KEY = 32;
const PLAYER_SPEED = 300;
const BG_SPEED = 100;
const MAX_W = 200;
const PICKUPS = [RadiusPickup, SpeedPickup];

var ltime = Date.now();
var dt = 0;
var keys = {};

var player = {};
var playerSpeed = PLAYER_SPEED;
var speed = BG_SPEED;
var platforms = [];
var pickups = [];
var gameover = 0;
var score = 0;
var highscore = 0;
var newpickupwait = 3;
var speedbooster = 1;
var menu = 1;

function reset(ls = true)
{
	playerSpeed = PLAYER_SPEED;
	speed = BG_SPEED;
	gameover = 0;
	highscore = Math.max(highscore, score);
	player = { x: WIDTH/2, y: 50, r: 10, newr: 10 };
	score = 0;
	pickups = [];
	newpickupwait = 3;
	speedbooster = 1;
	
	if (ls) localStorage.setItem('hs', highscore);
	
	var w;
	for (var i=0; i<10; i++)
	{
		w = rand_int(50, MAX_W);
		platforms[i] = {
			x: rand_int(0, WIDTH-w),
			y: i*70 + 200,
			w: w,
			h: 20
		};
	}
}

function start()
{
	highscore = localStorage.getItem('hs') || 0;
	reset(false);
}

function update()
{
	if (gameover || menu)
	{
		if (keys[SPACE_KEY])
		{
			if (menu)
			{
				menu = 0;
				document.getElementById('music').play();
			}
			reset();
		}
		if (gameover)
		{
			return;
		}
	}

	if (score > 100)
	{
		newpickupwait -= dt;

		if (newpickupwait <= 0)
		{
			newpickupwait = 15;
			pickups[pickups.length] = new PICKUPS[rand_int(0, PICKUPS.length-1)](rand_int(50, WIDTH-50), HEIGHT + 5);
		}

		for (var i=0; i<pickups.length; i++)
		{
			pickups[i].y = pickups[i].clip.y = pickups[i].y - speed*speedbooster*dt;

			if (RectCircleColliding(player, pickups[i].clip) && !pickups[i].enabled)
			{
				pickups[i].state(true);
			}
			if (pickups[i].enabled)
			{
				pickups[i].time -= dt;
			}
			if (pickups[i].enabled && pickups[i].time <= 0)
			{
				pickups[i].state(false);
			}
		}
	}
	
	for (var i=0; i<platforms.length; i++)
	{
		platforms[i].y -= speed*speedbooster*dt;
		
		if (platforms[i].y < -10) {
			var w = rand_int(50, MAX_W);
			platforms[i].y += 710;
			platforms[i].x = rand_int(0, WIDTH-w);
			platforms[i].w = w;
		}
		
		if (!menu)
		{
			score += dt*speedbooster;
			speed += dt*0.01;
		}
		
		if (RectCircleColliding(player, platforms[i]) && speedbooster == 1 && !menu)
		{
			speed = playerSpeed = 0;
			gameover = 1;
		}
	}
	
	if (!menu)
	{
		player.x = Math.min(WIDTH - player.r, Math.max(player.r, player.x + h_input() * dt * playerSpeed));
		player.r = player.r + dt*(player.newr - player.r);
	}
}

function draw_game()
{
	ctx.fillStyle = 'black';
	
	if (!menu) {
		ctx.beginPath();
		ctx.arc(player.x, HEIGHT - player.y + player.r/2, player.r, 0, 2*Math.PI);
		ctx.fill();
	}
	
	platforms.forEach(function(r) {
		ctx.fillRect(r.x, HEIGHT-r.y-r.h/2, r.w, r.h);
	});
	var epi = 0;
	pickups.forEach(function(p) {
		p.draw(ctx);
		if (p.enabled)
		{
			ctx.fillStyle = p.color;
			ctx.fillRect(10, 40 + 20*epi, 70*(p.time/5), 10);
			epi++;
		}
	});
}

function draw()
{
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, WIDTH, HEIGHT);
	
	draw_game();

	ctx.fillStyle = 'gray';
	ctx.font = "10px Arial";
	ctx.textAlign = 'start';
	ctx.fillText((dt == 0 ? 0 : Math.round(1/dt)) + ' FPS', 10, 20);
	
	if (!menu)
	{
		ctx.textAlign = 'end';
		ctx.fillText('HI: ' + Math.round(highscore), WIDTH-10, 20);
		ctx.textAlign = 'center';
		ctx.font = '25px monospace';
		ctx.fillText(Math.round(score), WIDTH/2, 60);
	}

	if (gameover)
	{
		ctx.fillStyle = 'rgba(255,255,255,0.9)';
		ctx.fillRect(0,0,WIDTH,HEIGHT);
		ctx.fillStyle = 'black';
		ctx.textAlign = 'center';
		ctx.font = '50px monospace';
		ctx.fillText('GAME OVER', WIDTH/2, 250);
		ctx.fillStyle = '#222';
		ctx.font = '10px monospace';
		ctx.fillText('PRESS "SPACE" TO RESTART GAME', WIDTH/2, 300);
	}

	if (menu)
	{
		ctx.fillStyle = 'rgba(255,255,255,0.9)';
		ctx.fillRect(0,0,WIDTH,HEIGHT);
		ctx.fillStyle = 'black';
		ctx.textAlign = 'center';
		ctx.font = '50px monospace';
		ctx.fillText('ENDLESS', WIDTH/2, 250);
		ctx.fillStyle = '#222';
		ctx.font = '10px monospace';
		ctx.fillText('PRESS "SPACE" TO START GAME', WIDTH/2, 300);
	}
}

function loop()
{
	dt = (Date.now() - ltime) / 1000;
	ltime = Date.now();
	
	update();
	draw();
	
	requestAnimationFrame(loop);
}

function init()
{
	document.onkeydown = function(e) { keys[e.keyCode] = true; };
	document.onkeyup = function(e) { keys[e.keyCode] = false; };
}

init();
start();
loop();

/////////////////////////////////////////////////
/////////////////////////////////////////////////

function rand_int(mn, mx)
{
	return mn + Math.round(Math.random() * (mx-mn));
}

function h_input()
{
	return keys[ARROW_LEFT] && keys[ARROW_RIGHT] ? 0 : (keys[ARROW_LEFT] ? -1 : keys[ARROW_RIGHT] ? 1 : 0);
}

function RectCircleColliding(circle,rect){
	var distX = Math.abs(circle.x - rect.x-rect.w/2);
	var distY = Math.abs(circle.y - rect.y-rect.h/2);
	
	if (distX > (rect.w/2 + circle.r)) { return false; }
	if (distY > (rect.h/2 + circle.r)) { return false; }
	
	if (distX <= (rect.w/2)) { return true; } 
	if (distY <= (rect.h/2)) { return true; }
	
	var dx=distX-rect.w/2;
	var dy=distY-rect.h/2;
	return (dx*dx+dy*dy<=(circle.r*circle.r));
}