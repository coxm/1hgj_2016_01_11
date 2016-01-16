module jam {

export class CustomText extends Phaser.Text {
	rotateSpeed: number;

	constructor(game: Phaser.Game, x: number, y: number, text: string) {
		super(game, x, y, text, {
			font: '16px Courier New',
			fill: '#0f0',
			align: 'center'
		});

		this.anchor.set(0.5);
		this.rotateSpeed = 0.25;
	}
}

} // module jam
