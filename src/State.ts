// vim: noet sts=4 ts=4 sw=4
module jam {

const MAX_BIT: number = 16;
const MAX_HEALTH: number = 100;

const SLAP_ANIM: string = 'slap';
const NONE_ANIM: string = 'none';

const SPAWN_WAIT: number = 350;

const HEALTH_DECREMENT: number = 1;

const BIT_SPEED: number = 50;


export class State extends Phaser.State {
	lastSpawnTime: number = 0;
	goodBits: Phaser.Group = null;
	badBits: Phaser.Group = null;
	hand: Phaser.Sprite = null;
	health: number = MAX_HEALTH;
	healthText: Phaser.Text = null;

	preload(): void {
		// Avoid CORS errors when loading.
		this.game.load.crossOrigin = 'anonymous';
		this.game.load.spritesheet('hand', 'img/slap.png', 64, 64, 60);
	}

	create(): void {
		const game: Phaser.Game = this.game;
		game.stage.backgroundColor = settings.viewport.backgroundColour;

		game.physics.startSystem(Phaser.Physics.ARCADE);

		this.hand = game.add.sprite(
			game.world.centerX,
			game.world.centerY,
			'hand'
		);

		this.hand.animations.add(NONE_ANIM, [0], 60, false);
		const SLAP_RANGE = jam.rangeIncl(1, 59);
		(<any> window).SLAP_RANGE = SLAP_RANGE;
		console.log('slap range', SLAP_RANGE);
		this.hand.animations.add(SLAP_ANIM, jam.rangeIncl(1, 59), 60);
		this.hand.animations.play(NONE_ANIM, 30, false);
		this.game.physics.enable(this.hand);

		this.badBits = this.group('badbits');
		this.goodBits = this.group('goodbits');

		var style = { font: "65px Arial", fill: "#ff0044", align: "center" };
		this.healthText = this.game.add.text(
				game.world.centerX - 300, 0, 'Health: ' + this.health, style);
	}

	update(): void {
		this.game.physics.arcade.collide(
			this.hand,
			this.badBits,
			this.onBadSlap,
			null,
			this
		);

		this.game.physics.arcade.collide(
			this.hand,
			this.goodBits,
			this.onGoodSlap,
			null,
			this
		);

		if (game.input.mousePointer.isDown) {
			this.hand.animations.play(SLAP_ANIM);
			game.physics.arcade.moveToPointer(this.hand, 400);
		}
		else {
			this.hand.body.velocity.set(0.0, 0.0);
			this.hand.animations.play(NONE_ANIM);
		}

		const now: number = Date.now();
		if (now - this.lastSpawnTime > SPAWN_WAIT) {
			this.spawnBits();
			this.lastSpawnTime = now;
			this.health -= HEALTH_DECREMENT;
		}

		this.healthText.text = 'Health: ' + this.health;
		if (this.health < 0) {
			this.healthText.text = 'You failure';
		}
	}

	render(): void {
	}

	onBadSlap(a: Phaser.Sprite, b: Phaser.Sprite): void {
		if (!this.game.input.mousePointer.isDown) {
			return;
		}
		console.log('onBadSlap');
		this.health -= 10;
		this.propelBits(a, b);
	}

	onGoodSlap(a: Phaser.Sprite, b: Phaser.Sprite): void {
		if (!this.game.input.mousePointer.isDown) {
			return;
		}
		console.log('onGoodSlap');
		this.health += 5;
		this.propelBits(a, b);
	}

	propelBits(a: Phaser.Sprite, b: Phaser.Sprite): void {
		const bits: Phaser.Sprite = a === this.hand ? b : a;
		const vx: number = Math.random() * BIT_SPEED * 10;
		const vy: number = Math.random() * BIT_SPEED * 10;
		console.log('v', vx, vy);
		bits.body.velocity.set(vx, vy);
	}


	spawnBits(): void {
		const bit = jam.randInt(0, MAX_BIT),
			x: number = jam.randInt(0, settings.viewport.width),
			y: number = jam.randInt(0, settings.viewport.height),
			isGood: boolean = (bit % 3) === 0,
			group: Phaser.Group = isGood ? this.goodBits : this.badBits;

		const text = new CustomText(
			this.game,
			x, y,
			bit
		);
		this.game.add.existing(text);
		group.add(text);
		this.game.physics.enable(text);
		(<any> text).body.velocity.set(
			Math.random() * BIT_SPEED,
			Math.random() * BIT_SPEED
		);
	}

	protected group(name: string): Phaser.Group {
		return this.game.add.group(
			this.game.world, // Parent: usually game.world.
			name, // Group name.
			false, // Add to stage? (Usually, no; this parents to camera.)
			true, // Enable body? (Usually, yes.)
			Phaser.Physics.ARCADE // Body type.
		);
	}
}

} // module jam
