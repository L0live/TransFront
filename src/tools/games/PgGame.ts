// import Path from "./PgPath";
import Victor from "victor";

export default class PgGame {

  width = 30;
  height = 20;

  keys: { [key: string]: boolean };

  sceneFunctions: any;
  againstAI: boolean;

  leftScore = 0;
  rightScore = 0;

  started: boolean = false;

  speed = 0.2;
  currentSpeed = this.speed;

  collided: boolean = false;

  ball = {
    position: new Victor(15, 10),
    direction: new Victor(0, 0),
    radius: 0.25
  };

  paddleLeft = {
    position: new Victor(0.3, 8.5),
    speedInertia: 0,
    width: 0.3,
    height: 3
  };

  paddleRight = {
    position: new Victor(29.25, 8.5),
    speedInertia: 0,
    width: 0.3,
    height: 3
  };

  frontAddedObjects: { [obj: string]: {
    position: Victor,
    width: number,
    height: number
  }} = {};

  constructor(keys: { [key: string]: boolean }, sceneFunctions: any, frontAddedObjects: any = {}, againstAI: boolean = false) {
    this.keys = keys;
    this.sceneFunctions = sceneFunctions;
    this.frontAddedObjects = frontAddedObjects; // tqt
    this.againstAI = againstAI;

    this.initBallDirection();
  }

  private delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  async start() {
    this.started = true;
    while (this.started) {
      this.sceneFunctions.update({
        ball: this.ball.position,
        paddleLeft: this.paddleLeft.position,
        paddleRight: this.paddleRight.position
      }, this.currentSpeed,{
        left: this.leftScore,
        right: this.rightScore
      }, this.collided ? this.ball.direction : undefined);
      this.gameLoop();
      await this.delay(1000 / 60); // / 60
    }
    this.sceneFunctions.showResult(this.leftScore, this.rightScore);
    this.reset();
  }

  private gameLoop() {

    this.handleMovement();

    // Move ball
    this.ball.position.add(this.ball.direction.clone().multiplyScalar(this.currentSpeed));

    this.collided = false;
    // increase speed if collision with paddle, decrease if with frontAddedObjects
    if (this.handleCollision(this.paddleLeft)) {
      this.currentSpeed += Math.abs(this.paddleLeft.speedInertia) / 10;
    } else if (this.handleCollision(this.paddleRight)) {
      this.currentSpeed += Math.abs(this.paddleRight.speedInertia) / 10;
    } else {
      for (const objKey in this.frontAddedObjects) {
        if (this.handleCollision(this.frontAddedObjects[objKey])) {
          this.currentSpeed -= this.speed;
          break;
        }
      }
    }
    // if (this.currentSpeed < this.speed)
      this.currentSpeed = this.speed;

    // reset this.ball (at winner's paddle) if out of bounds
    if (this.ball.position.x < -this.width / 2 || this.ball.position.x > this.width * 1.5) {
      if (this.ball.position.x < 0) {
        this.rightScore++;
        this.ball.position.x = this.width - this.paddleRight.width - this.ball.radius * 3;
        this.ball.position.y = this.paddleRight.position.y + this.paddleRight.height / 2;
      } else {
        this.leftScore++;
        this.ball.position.x = this.ball.radius * 3 + this.paddleLeft.width;
        this.ball.position.y = this.paddleLeft.position.y + this.paddleLeft.height / 2;
      }
      if (this.leftScore == 10 || this.rightScore == 10)
        this.started = false;
      this.initBallDirection();
      this.currentSpeed = this.speed;
    }
  }

  private initBallDirection() {
    const signX = Math.sign(this.ball.direction.x || Math.random() * 2 - 1); // si vx est 0, on choisit aléatoirement la direction
    const signAngle = Math.sign(Math.random() * 2 - 1);

    this.ball.direction.y = 0;
    this.ball.direction.x = signX;
    this.ball.direction.rotateDeg((Math.random() * 40 + 10) * signAngle);
  }

  private handleCollision(obj: { position: Victor, width: number, height: number }): boolean {
    const ballPreviousPos = this.ball.position.clone().subtract(this.ball.direction.clone().multiplyScalar(this.currentSpeed));
    const stepRatio = this.currentSpeed / (this.speed * 0.1);
    const stepDirection = this.ball.direction.clone().multiplyScalar(this.speed * 0.1);
    const ballVerticesTotal = 16; // 2^4
    const ballStepVerticesDegree = 360 / ballVerticesTotal;

    for (let step = 1; step <= stepRatio; step++) {
      const stepPos = ballPreviousPos.add(stepDirection.clone().multiplyScalar(step));
      // check 16 vertices of the ball's bounding box
      let ballCollisionOffset = new Victor(0, 0);
      for (let i = 0; i < ballVerticesTotal; i++) {
        const angle = ballStepVerticesDegree * i;
        const offset = new Victor(Math.cos(angle), Math.sin(angle)).multiplyScalar(this.ball.radius);
        const vertex = stepPos.clone().add(offset);
        if (vertex.x > obj.position.x && vertex.x < obj.position.x + obj.width &&
          vertex.y > obj.position.y && vertex.y < obj.position.y + obj.height)
          ballCollisionOffset.add(offset);
      }
      if (ballCollisionOffset.x == 0 && ballCollisionOffset.y == 0)
        continue;

      this.collided = true;

      console.log("Collision ballPos: ", this.ball.position, "stepPos: ", stepPos, "stepDir: ", stepDirection);
      this.ball.position = stepPos.subtract(stepDirection);
      step--;
      console.log("Direction before collision: ", stepDirection);

      if (Math.abs(ballCollisionOffset.x) > Math.abs(ballCollisionOffset.y)) {
        this.ball.direction.x *= -1;
        stepDirection.x *= -1;
      } else {
        this.ball.direction.y *= -1;
        stepDirection.y *= -1;
      }
      console.log("Direction after collision: ", stepDirection);
      console.log("ballPosition after collision: ", this.ball.position);
      this.ball.position.add(stepDirection.clone().multiplyScalar(stepRatio - step));
      console.log("ballPosition after moving remaining steps: ", this.ball.position);

      return true;
    }
    return false;
  }

  private handleMovement() {
    if (this.keys["KeyZ"] || this.keys["KeyW"]) {
      this.paddleLeft.position.y += this.currentSpeed;
      if (this.paddleLeft.speedInertia > 0)
        this.paddleLeft.speedInertia = 0;
      this.paddleLeft.speedInertia++;
    }
    if (this.keys["KeyS"]) {
      this.paddleLeft.position.y -= this.currentSpeed;
      if (this.paddleLeft.speedInertia < 0)
        this.paddleLeft.speedInertia = 0;
      this.paddleLeft.speedInertia--;
    }

    if (this.againstAI) {
      // simple IA
      if (this.ball.direction.x > 0 &&
        this.ball.position.x < this.paddleRight.position.x) {
        if (this.ball.position.y < this.paddleRight.position.y + this.paddleRight.height / 2)
          this.keys["ArrowUp"] = true;
        else
          this.keys["ArrowUp"] = false;
        if (this.ball.position.y > this.paddleRight.position.y + this.paddleRight.height / 2)
          this.keys["ArrowDown"] = true;
        else
          this.keys["ArrowDown"] = false;
      } else {
        this.keys["ArrowUp"] = false;
        this.keys["ArrowDown"] = false;
      }
    }

    if (this.keys["ArrowUp"]) {
      this.paddleRight.position.y -= this.currentSpeed;
      if (this.paddleRight.speedInertia > 0)
        this.paddleRight.speedInertia = 0;
      this.paddleRight.speedInertia--;
    }
    if (this.keys["ArrowDown"]) {
      this.paddleRight.position.y += this.currentSpeed;
      if (this.paddleRight.speedInertia < 0)
        this.paddleRight.speedInertia = 0;
      this.paddleRight.speedInertia++;
    }
  }

  private reset() {
    this.leftScore = 0;
    this.rightScore = 0;
    this.paddleLeft.position.y = 8.5;
    this.paddleRight.position.y = 8.5;
    this.ball.position.x = 15;
    this.ball.position.y = 10;
    this.initBallDirection();
    this.currentSpeed = this.speed;
  }
}