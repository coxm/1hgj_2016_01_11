// vim: noet sts=4 ts=4 sw=4
var jam;
(function (jam) {
    var DEG_TO_RAD = Math.PI / 180;
    /**
     * Inclusive range function.
     *
     * @example
     * rangeIncl(3, 6) // [3, 4, 5, 6]
     */
    function rangeIncl(minIncl, maxIncl) {
        var a = new Array(maxIncl - minIncl + 1), i = minIncl, j = 0;
        for (; i <= maxIncl; ++i, ++j) {
            a[j] = i;
        }
        return a;
    }
    jam.rangeIncl = rangeIncl;
    /** Get a random integer in a range. */
    function randInt(min, max) {
        return (Math.random() * (max - min) + min) | 0;
    }
    jam.randInt = randInt;
    /** Get a random boolean. */
    function randBool() {
        return Math.random() >= 0.5;
    }
    jam.randBool = randBool;
    /** Calculate the L2-distance between two points. */
    function l2Distance(a, b) {
        return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
    }
    jam.l2Distance = l2Distance;
    /** Set the velocity of a sprite, in its current direction. */
    function moveInDirection(sprite, speed) {
        var angle = DEG_TO_RAD * (sprite.angle - 90);
        sprite.body.velocity.x = speed * Math.cos(angle);
        sprite.body.velocity.y = speed * Math.sin(angle);
    }
    jam.moveInDirection = moveInDirection;
    /** Update sprite velocity/angle for top-down rotating movement. */
    function updateAngularMovement(sprite, cursors, speed, angularVelocity) {
        if (cursors.left.isDown) {
            sprite.angle -= angularVelocity;
        }
        else if (cursors.right.isDown) {
            sprite.angle += angularVelocity;
        }
        if (cursors.up.isDown) {
            moveInDirection(sprite, -speed);
        }
        else if (cursors.down.isDown) {
            moveInDirection(sprite, speed);
        }
        else {
            sprite.body.velocity.setTo(0, 0);
        }
    }
    jam.updateAngularMovement = updateAngularMovement;
    /** Move a sprite (up/down/left/right movement) according to cursor keys. */
    function updateUDLRMovement(sprite, cursors, upDownSpeed, leftRightSpeed) {
        if (leftRightSpeed === void 0) { leftRightSpeed = upDownSpeed; }
        var velocity = sprite.body.velocity;
        if (cursors.left.isDown) {
            velocity.x = -leftRightSpeed;
        }
        else if (cursors.right.isDown) {
            velocity.x = leftRightSpeed;
        }
        else {
            velocity.x = 0;
        }
        if (cursors.up.isDown) {
            velocity.y = -upDownSpeed;
        }
        else if (cursors.down.isDown) {
            velocity.y = upDownSpeed;
        }
        else {
            velocity.y = 0;
        }
    }
    jam.updateUDLRMovement = updateUDLRMovement;
})(jam || (jam = {})); // module jam
// vim: noet sts=4 ts=4 sw=4
var jam;
(function (jam) {
    jam.settings = {
        debug: true,
        viewport: {
            backgroundColour: '#666',
            width: 800,
            height: 600
        },
        button: {
            timeout: 150,
            deathRadius: 120
        },
        player: {
            moveSpeed: 300
        },
        enemies: {
            max: 20,
            timeout: 240,
            minTimeout: 10,
            killDecrease: 20,
            createDecrease: 5,
            xSpeed: 30,
            ySpeed: 30,
            killRadius: 30
        }
    };
})(jam || (jam = {})); // module jam
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var jam;
(function (jam) {
    var CustomText = (function (_super) {
        __extends(CustomText, _super);
        function CustomText(game, x, y, bit) {
            _super.call(this, game, x, y, '0b' + bit.toString(2), {
                font: '16px Courier New',
                fill: bit % 3 === 0 ? '#0f0' : '#f00',
                align: 'center'
            });
            this.anchor.set(0.5);
            this.rotateSpeed = 0.25;
        }
        return CustomText;
    })(Phaser.Text);
    jam.CustomText = CustomText;
})(jam || (jam = {})); // module jam
// vim: noet sts=4 ts=4 sw=4
var jam;
(function (jam) {
    var MAX_BIT = 16;
    var MAX_HEALTH = 100;
    var SLAP_ANIM = 'slap';
    var NONE_ANIM = 'none';
    var SPAWN_WAIT = 350;
    var HEALTH_DECREMENT = 1;
    var BIT_SPEED = 50;
    var State = (function (_super) {
        __extends(State, _super);
        function State() {
            _super.apply(this, arguments);
            this.lastSpawnTime = 0;
            this.goodBits = null;
            this.badBits = null;
            this.hand = null;
            this.health = MAX_HEALTH;
            this.healthText = null;
        }
        State.prototype.preload = function () {
            // Avoid CORS errors when loading.
            this.game.load.crossOrigin = 'anonymous';
            this.game.load.spritesheet('hand', 'img/slap.png', 64, 64, 60);
        };
        State.prototype.create = function () {
            var game = this.game;
            game.stage.backgroundColor = jam.settings.viewport.backgroundColour;
            game.physics.startSystem(Phaser.Physics.ARCADE);
            this.hand = game.add.sprite(game.world.centerX, game.world.centerY, 'hand');
            this.hand.animations.add(NONE_ANIM, [0], 60, false);
            var SLAP_RANGE = jam.rangeIncl(1, 59);
            window.SLAP_RANGE = SLAP_RANGE;
            console.log('slap range', SLAP_RANGE);
            this.hand.animations.add(SLAP_ANIM, jam.rangeIncl(1, 59), 60);
            this.hand.animations.play(NONE_ANIM, 30, false);
            this.game.physics.enable(this.hand);
            this.badBits = this.group('badbits');
            this.goodBits = this.group('goodbits');
            var style = { font: "65px Arial", fill: "#ff0044", align: "center" };
            this.healthText = this.game.add.text(game.world.centerX - 300, 0, 'Health: ' + this.health, style);
        };
        State.prototype.update = function () {
            this.game.physics.arcade.collide(this.hand, this.badBits, this.onBadSlap, null, this);
            this.game.physics.arcade.collide(this.hand, this.goodBits, this.onGoodSlap, null, this);
            if (jam.game.input.mousePointer.isDown) {
                this.hand.animations.play(SLAP_ANIM);
                jam.game.physics.arcade.moveToPointer(this.hand, 400);
            }
            else {
                this.hand.body.velocity.set(0.0, 0.0);
                this.hand.animations.play(NONE_ANIM);
            }
            var now = Date.now();
            if (now - this.lastSpawnTime > SPAWN_WAIT) {
                this.spawnBits();
                this.lastSpawnTime = now;
                this.health -= HEALTH_DECREMENT;
            }
            this.healthText.text = 'Health: ' + this.health;
            if (this.health < 0) {
                this.healthText.text = 'You failure';
            }
        };
        State.prototype.render = function () {
        };
        State.prototype.onBadSlap = function (a, b) {
            if (!this.game.input.mousePointer.isDown) {
                return;
            }
            console.log('onBadSlap');
            this.health -= 10;
            this.propelBits(a, b);
        };
        State.prototype.onGoodSlap = function (a, b) {
            if (!this.game.input.mousePointer.isDown) {
                return;
            }
            console.log('onGoodSlap');
            this.health += 5;
            this.propelBits(a, b);
        };
        State.prototype.propelBits = function (a, b) {
            var bits = a === this.hand ? b : a;
            var vx = Math.random() * BIT_SPEED * 10;
            var vy = Math.random() * BIT_SPEED * 10;
            console.log('v', vx, vy);
            bits.body.velocity.set(vx, vy);
        };
        State.prototype.spawnBits = function () {
            var bit = jam.randInt(0, MAX_BIT), x = jam.randInt(0, jam.settings.viewport.width), y = jam.randInt(0, jam.settings.viewport.height), isGood = (bit % 3) === 0, group = isGood ? this.goodBits : this.badBits;
            var text = new jam.CustomText(this.game, x, y, bit);
            this.game.add.existing(text);
            group.add(text);
            this.game.physics.enable(text);
            text.body.velocity.set(Math.random() * BIT_SPEED, Math.random() * BIT_SPEED);
        };
        State.prototype.group = function (name) {
            return this.game.add.group(this.game.world, // Parent: usually game.world.
            name, // Group name.
            false, // Add to stage? (Usually, no; this parents to camera.)
            true, // Enable body? (Usually, yes.)
            Phaser.Physics.ARCADE // Body type.
            );
        };
        return State;
    })(Phaser.State);
    jam.State = State;
})(jam || (jam = {})); // module jam
// vim: noet sts=4 ts=4 sw=4
var jam;
(function (jam) {
    jam.state = new jam.State();
    jam.game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', // Insert into body.
    jam.state);
})(jam || (jam = {})); // module jam
