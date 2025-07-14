// GameCanvas.tsx
import { useRef, useEffect } from "react";
// import { useGameInputs } from "./useGameInputs";

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
	const keys = useRef<Record<string, boolean>>({});

  useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			keys.current[e.code] = true;
		};

		const handleKeyUp = (e: KeyboardEvent) => {
			keys.current[e.code] = false;
		};

		const handleBlur = () => {
			keys.current = {};
		};

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		window.addEventListener("blur", handleBlur);

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.style.width = "100vw";
      canvas.style.height = "100vh";
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // const keys = useGameInputs();

    // Dimensions du jeu
    const width = canvas.width;
    const height = canvas.height;

    // Éléments du jeu
    type Ball = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    };
    type Paddle = {
      x: number;
      y: number;
      width: number;
      height: number;
      speed: number;
    };

    let ball: Ball = {
      x: width / 2,
      y: height / 2 + 8,
      vx: 0,
      vy: 0,
      radius: height / 43 / 2, // 21 spawning balls
    };
    let paddleLeft: Paddle = {
      x: ball.radius * 1.5,
      y: height / 2 - ball.radius * 6,
      width: ball.radius * 1.5,
      height: ball.radius * 12,
      speed: 0,
    };
    let paddleRight: Paddle = {
      x: width - ball.radius * 3,
      y: height / 2 - ball.radius * 6,
      width: ball.radius * 1.5,
      height: ball.radius * 12,
      speed: 0,
    };

    // balls spawn position
    let ballsSpawn: number[] = [];
    for (let i = ball.radius * 3; i < height; i += ball.radius * 4) {
      ballsSpawn.push(i);
    }

    // Score
    let LeftScore = 0;
    let RightScore = 0;

    function draw() {
      // fond noir
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);

      // middle font balls
      ctx.fillStyle = "grey";
      ctx.beginPath();
      for (let i of ballsSpawn) {
        ctx.arc(width / 2, i, ball.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = "white";
      // score
      ctx.font = `${ball.radius * 15}px 'Consolas'`;
      ctx.textAlign = "center";
      ctx.fillText(`${LeftScore}`, width / 4, ball.radius * 15);
      ctx.fillText(`${RightScore}`, (width * 3) / 4, ball.radius * 15);

      // balle
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();

      // raquettes
      ctx.fillRect(
        paddleLeft.x,
        paddleLeft.y,
        paddleLeft.width,
        paddleLeft.height
      );
      ctx.fillRect(
        paddleRight.x,
        paddleRight.y,
        paddleRight.width,
        paddleRight.height
      );
    }

    function collidePaddleVertical(paddle: Paddle): boolean {
      return (
        ball.y + ball.radius >= paddle.y &&
        ball.y - ball.radius <= paddle.y + paddle.height
      );
    }

    function collide() {
      // rebonds haut/bas
      if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= height)
        ball.vy *= -1;
      // rebonds paddle
      if (
        (ball.x - ball.radius <= paddleLeft.x + paddleLeft.width &&
          collidePaddleVertical(paddleLeft)) ||
        (ball.x + ball.radius >= paddleRight.x &&
          collidePaddleVertical(paddleRight))
      )
        ball.vx *= -1;
    }

    // fonction pour générer un entier aléatoire entre min et max
    function getRandomInt(min: number, max: number): number {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const speed = 20;

    // calcule les vecteurs de la balle
    function defineBallVectors() {
      let signX = Math.sign(ball.vx || Math.random() * 2 - 1); // si vx est 0, on choisit aléatoirement la direction

      // On tire un vy aléatoire entre -speed et speed, excluant [-1, 1]
      let vy: number;
      do {
        vy = (Math.random() * 2 - 1) * (speed / 1.5); // entre -speed et +speed
      } while (Math.abs(vy) < 1); // on évite les vy trop petits

      // vx est déduit de la vitesse constante
      ball.vx = Math.sqrt(speed * speed - vy * vy) * signX;
      ball.vy = vy;
    }

    function update() {
      ball.x += ball.vx;
      ball.y += ball.vy;

      // reset ball if out of bounds
      if (ball.x - ball.radius < 0 || ball.x + ball.radius > width) {
        if (ball.x - ball.radius < 0)
          RightScore++;
        else
          LeftScore++;
        ball.x = width / 2, ball.y = ballsSpawn[getRandomInt(0, ballsSpawn.length - 1)];
        defineBallVectors();
      }

      paddleLeft.speed = 0;
      if (keys.current["KeyW"]) paddleLeft.speed -= speed;
      if (keys.current["KeyS"]) paddleLeft.speed += speed;
      paddleLeft.y += paddleLeft.speed;

      // clamp paddleLeft to canvas bounds
      if (paddleLeft.y < 0) paddleLeft.y = 0;
      if (paddleLeft.y + paddleLeft.height > height)
        paddleLeft.y = height - paddleLeft.height;

      paddleRight.speed = 0;
      if (keys.current["ArrowUp"]) paddleRight.speed -= speed;
      if (keys.current["ArrowDown"]) paddleRight.speed += speed;
      paddleRight.y += paddleRight.speed;

      // clamp paddleRight to canvas bounds
      if (paddleRight.y < 0) paddleRight.y = 0;
      if (paddleRight.y + paddleRight.height > height)
        paddleRight.y = height - paddleRight.height;


      collide();
      draw();
      requestAnimationFrame(update);
    }

    defineBallVectors();
    update();
    return () => {
      window.removeEventListener("resize", resizeCanvas);
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
			window.removeEventListener("blur", handleBlur);
    };
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <canvas
        ref={canvasRef}
        className="block fixed top-0 left-0 w-full h-full"
      />
    </div>
  );
}
