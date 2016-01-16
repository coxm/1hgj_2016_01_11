// vim: noet sts=4 ts=4 sw=4
module jam {


const DEG_TO_RAD: number = Math.PI / 180;


/**
 * Inclusive range function.
 *
 * @example
 * rangeIncl(3, 6) // [3, 4, 5, 6]
 */
export function rangeIncl(minIncl: number, maxIncl: number): number[] {
	var a: number[] = new Array(maxIncl - minIncl + 1),
		i: number = minIncl;
	for (; i <= maxIncl; ++i) {
		a[i] = i;
	}
	return a;
}


/** Get a random integer in a range. */
export function randInt(min: number, max: number): number {
	return (Math.random() * (max -min) + min)|0;
}


/** Calculate the L2-distance between two points. */
export function l2Distance(
	a: {x: number; y: number;},
	b: {x: number; y: number;}
)
  : number
{
	return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}


/** Set the velocity of a sprite, in its current direction. */
export function moveInDirection(sprite: Phaser.Sprite, speed: number): void {
	var angle: number = DEG_TO_RAD * (sprite.angle - 90);
	sprite.body.velocity.x = speed * Math.cos(angle);
	sprite.body.velocity.y = speed * Math.sin(angle);
}


/** Update sprite velocity/angle for top-down rotating movement. */
export function updateAngularMovement(
	sprite: Phaser.Sprite,
	cursors: Phaser.CursorKeys,
	speed: number,
	angularVelocity: number
)
	: void
{
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


/** Move a sprite (up/down/left/right movement) according to cursor keys. */
export function updateUDLRMovement(
	sprite: Phaser.Sprite,
	cursors: Phaser.CursorKeys,
	upDownSpeed: number,
	leftRightSpeed: number = upDownSpeed
)
	: void
{
	var velocity: Phaser.Point = sprite.body.velocity;
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

} // module jam
