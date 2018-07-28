class BasePickup {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.clip = {x: x, y: y, w: 20, h: 20};
        this.color = '#AAAAAA';
        this.enabled = false;
        this.time = 5;
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
    }
    disable() {
        speedbooster -= 5;
    }
}