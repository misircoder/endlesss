class BasePickup {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.clip = {x: x, y: y, w: 20, h: 20};
        this.color = '#AAAAAA';
        this.enabled = false;
        this.time = 5;
        this.maxtime = 5;
        this.init();
    }
    draw(ctx) {
        if (this.enabled) return;

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x + 10, HEIGHT - this.y - 10, 20, 0, 2*Math.PI);
        ctx.fill();
    }
    state(value) {
        this.enabled = value;
        if (value) this.enable();
        if (!value) this.disable();
    }
}

class RadiusPickup extends BasePickup {
    init() {
        this.color = '#FAA';
    }
    enable() {
        player.newr = 5;
        playerSpeed = PLAYER_SPEED*2;
    }
    disable() {
        player.newr = 10;
        playerSpeed = PLAYER_SPEED;
    }
}

class SpeedPickup extends BasePickup {
    init() {
        this.color = '#AAF';
    }
    enable() {
        speedbooster += 5;
        no_coll ++;
    }
    disable() {
        speedbooster -= 5;
        setTimeout(function() { if (gameover == 0) no_coll --; }, 1000);
    }
}

class LuckPickup extends BasePickup {
    init() {
        this.color = '#AFA';
        this.maxtime = 10;
        this.time = 10;
    }
    enable() {
        no_coll ++;
    }
    disable() {
        no_coll --;
    }
}


const PICKUPS = [RadiusPickup, SpeedPickup, LuckPickup];
