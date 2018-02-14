class EnemyType1 extends Person {
    constructor(ctx, width = 30, height = 30, color = 'red', x = 600, y = 300, speedV = 0, speedH = 5, radius = 200) {
        super();
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.color = color;
        this.angle = 0;
        this.moveAngle = 0;
        this.x = x;
        this.y = y;
        this.speedV = speedV;
        this.speedH = speedH;

        this.visionRadius = radius;
    }

    newPos() {
        var step = 3;
        var deltaX;
        var deltaY;

        if (this.heroInVision()) {
            deltaX = defineXStepSigh(this.x, step);
            deltaY = defineYStepSigh(this.y, step);
        } else {
            deltaX = this.speedH;
            deltaY = this.speedV;
        }

        this.x += deltaX;
        this.y += deltaY;

        if (this.x > FIELD_WIDTH) {
            this.x = 0;
        } else if (this.x < 0) {
            this.x = FIELD_WIDTH;
        }

        if (this.y > FIELD_HEIGHT) {
            this.y = 0;
        } else if (this.y < 0) {
            this.y = FIELD_HEIGHT;
        }
        return this;
    }

    xPlusDelta(x, delta) {
        if (x + delta < 0) {
            return 0;
        } else if (x + delta > FIELD_WIDTH) {
            return FIELD_WIDTH;
        }
        return x + delta;
    }


    yPlusDelta(y, delta) {
        if (y + delta < 0) {
            return 0;
        } else if (y + delta > FIELD_HEIGHT) {
            return FIELD_HEIGHT;
        }
        return y + delta;
    }

    update(ctx) {

        var centerX = this.x;
        var centerY = this.y;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
        ctx.restore();

        ctx.beginPath();
        ctx.arc(centerX, centerY, this.visionRadius, 0, 2 * Math.PI, false);
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#003300';
        ctx.stroke();
        return this;
    }

    heroInVision() {
        var deltaX = xPerson - this.x;
        var deltaY = yPerson - this.y;

        var distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
        return distance <= this.visionRadius;
    }

    getItemType() {
        return 'EnemyType1';
    }
}

function defineXStepSigh(x, step) {
    var diff = xPerson - x;
    var sign = diff === 0 ? 0 : (diff > 0 ? 1 : -1);

    return Math.abs(diff) < step ? sign : sign * step;
}

function defineYStepSigh(y, step) {
    var diff = yPerson - y;
    var sign = diff === 0 ? 0 : (diff > 0 ? 1 : -1);

    return Math.abs(diff) < step ? 0 : sign * step;
}
