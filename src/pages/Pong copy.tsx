// GameCanvas.tsx
import { useRef, useEffect } from "react";

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    
    // Dimensions du jeu
    const width = canvas.width;
    const height = canvas.height;

    // Éléments du jeu
    let ball = { x: width / 2, y: height / 2, vx: 3, vy: 0.1, radius: 8 };
    type Paddle = {
      x: number,
      y: number,
      width: number,
      height: number,
    };
    let paddleLeft: Paddle = { x: 10, y: height / 2 - 30, width: 10, height: 60 };
    let paddleRight: Paddle = { x: width - 20, y: height / 2 - 30, width: 10, height: 60 };

    function draw() {
      // fond noir
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);

      // balle blanche
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();

      // raquettes
      ctx.fillRect(paddleLeft.x, paddleLeft.y, paddleLeft.width, paddleLeft.height);
      ctx.fillRect(paddleRight.x, paddleRight.y, paddleRight.width, paddleRight.height);
    }

    function collidePaddleVertical(paddle: Paddle) {
      return (
        ((ball.y + ball.radius) >= paddle.y)
        || (ball.y - ball.radius) <= paddle.y + paddle.height);
    }

    function collide() {
      // rebonds haut/bas
      if (ball.y <= 0 || ball.y >= height)
        ball.vy *= -1;
      // rebonds paddle
      if ((ball.x - ball.radius) <= (paddleLeft.x + paddleLeft.width) || (ball.x + ball.radius) >= paddleRight.x)
        ball.vx *= -1;
      if (((ball.x - ball.radius) <= (paddleLeft.x + paddleLeft.width) && collidePaddleVertical(paddleLeft))
        || ((ball.x + ball.radius) >= paddleRight.x) && collidePaddleVertical(paddleRight))
        ball.vx = ball.vx;
    }

    function update() {
      ball.x += ball.vx;
      ball.y += ball.vy;

      collide();
      draw();
      requestAnimationFrame(update);
    }

    update();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <canvas ref={canvasRef} className="w-screen h-screen block" />
    </div>
  );
}
