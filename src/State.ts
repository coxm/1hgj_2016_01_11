// vim: noet sts=4 ts=4 sw=4
module jam {

const MAX_BIT: number = 16;
const MAX_HEALTH: number = 100;


export class State extends Phaser.State {
	goodBits: Phaser.Group = null;
	badBits: Phaser.Group = null;
	hand: Phaser.Sprite = null;
	health: number = MAX_HEALTH;

	preload(): void {
		// Avoid CORS errors when loading.
		this.game.load.crossOrigin = 'anonymous';
		// this.game.load.spritesheet('key', 'url', width, height);
	}

	create(): void {
		const game: Phaser.Game = this.game;
		game.stage.backgroundColor = settings.viewport.backgroundColour;

		this.hand = game.add.sprite(
			game.world.centerX,
			game.world.centerY,
			'hand'
		);

		game.physics.startSystem(Phaser.Physics.ARCADE);

		this.badBits = this.group('badbits');
		this.goodBits = this.group('goodbits');
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
	}

	render(): void {
	}

	onBadSlap(a: Phaser.Sprite, b: Phaser.Sprite): void {
		this.health -= 10;
	}

	onGoodSlap(a: Phaser.Sprite, b: Phaser.Sprite): void {
		this.health += 5;
	}

	spawnBits(): void {
		const isGood: boolean = jam.randBool(),
			bit = jam.randInt(0, MAX_BIT),
			x: number = jam.randInt(0, settings.viewport.width),
			y: number = jam.randInt(0, settings.viewport.height),
			group: Phaser.Group = isGood ? this.goodBits : this.badBits;

		const text = new CustomText(
			this.game,
			x, y,
			'0x' + bit.toString(2)
		);
		this.game.add.existing(text);
		group.add(text);
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
