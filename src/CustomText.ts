module jam {

export class CustomText extends Phaser.Text {
	rotateSpeed: number;

	constructor(game: Phaser.Game, x: number, y: number, bit: number) {
		super(game, x, y, '0b' + bit.toString(2), {
			font: '16px Courier New',
			fill: bit % 3 === 0 ? '#0f0' : '#f00',
			align: 'center'
		});

		this.anchor.set(0.5);
		this.rotateSpeed = 0.25;
	}
}

} // module jam
