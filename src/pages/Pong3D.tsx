import React, { useEffect, useRef } from "react";
import { Engine, Scene,
  FreeCamera, HemisphericLight,
  Vector3, Color3, GlowLayer,
  StandardMaterial, MeshBuilder,
  ParticleSystem, Texture
} from "@babylonjs/core";
import Victor from "victor";
import Path from "./usePath";

const BabylonScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const keys = useRef<Record<string, boolean>>({});

  useEffect(() => {
    if (!canvasRef.current) return;
    
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

    // Dimensions du terrain
    const width = 30;
    const height = 20;

    // Vitesse globale
    const speed = 0.015;

    // Score
    let LeftScore = 0;
    let RightScore = 0;

    // Éléments du jeu
    type Ball = {
      position: Victor;
      speed: Victor;
      radius: number;
    };
    type Paddle = {
      position: Victor;
      width: number;
      height: number;
	    speed: number;
    };

    // calcule les vecteurs de la balle
    function defineBallVectors(ball: Ball) {
      const signX = Math.sign(ball.speed.x || Math.random() * 2 - 1); // si vx est 0, on choisit aléatoirement la direction
      const signAngle = Math.sign(Math.random() * 2 - 1);

      ball.speed.y = 0;
      ball.speed.x = speed * signX;
      ball.speed.rotateDeg((Math.random() * 40 + 10) * signAngle);
    }

    // Initialisation de la balle et des raquettes
    function initializeGameElements() {
      // Init ball
      const ballRadius = height / 43 / 2; // 21 spawning balls
      const ball: Ball = {
        radius: ballRadius,
        position: new Victor(width / 2, height / 2 + ballRadius),
        speed: new Victor(0, 0),
      };
      defineBallVectors(ball);

      // Init paddles
      const paddleLeft: Paddle = {
        position: new Victor(ball.radius * 1.5, height / 2 - ball.radius * 6),
        width: ball.radius * 1.5,
        height: ball.radius * 12,
        speed: 0,
      };
      const paddleRight: Paddle = {
        position: new Victor(width - ball.radius * 3, height / 2 - ball.radius * 6),
        width: ball.radius * 1.5,
        height: ball.radius * 12,
        speed: 0,
      };

      // balls spawn positions
      let ballSpawn: number[] = [];
      for (let i = ball.radius * 3; i < height; i += ball.radius * 4) {
        ballSpawn.push(i);
      }

      return { ball, paddleLeft, paddleRight, ballSpawn };
    }

    // Déplace les éléments du jeu et gère les collisions
    function move(deltaTime: number) {

      // Reverse the keys to work good
      paddleRight.speed = 0;
      if (keys.current["KeyW"]) paddleRight.speed -= speed;
      if (keys.current["KeyS"]) paddleRight.speed += speed;

      paddleLeft.speed = 0;
      if (keys.current["ArrowUp"]) paddleLeft.speed -= speed;
      if (keys.current["ArrowDown"]) paddleLeft.speed += speed;


      const paddleLeftPath = new Path(
        paddleLeft.position.clone(),
        new Victor(0, paddleLeft.speed),
        deltaTime
      );
      const paddleRightPath = new Path(
        paddleRight.position.clone(),
        new Victor(0, paddleRight.speed),
        deltaTime
      );

      function paddleCollision(
        path: Path,
        paddleHeight: number,
        terrainUpperBound: number,
        terrainLowerBound: number
      ): Path {
        // moving up (negative y)
        if (
          path.speed.y < 0 &&
          path.speed.y * path.deltaTime < terrainUpperBound - path.position.y
        )
          return new Path(new Victor(path.position.x, terrainUpperBound));
        // moving down (positive y)
        else if (
          path.speed.y > 0 &&
          path.speed.y * path.deltaTime >
            terrainLowerBound - (path.position.y + paddleHeight)
        )
          return new Path(
            new Victor(path.position.x, terrainLowerBound - paddleHeight)
          );
        // no collision
        else
          return new Path(
            new Victor(
              path.position.x,
              path.position.y + path.speed.y * path.deltaTime
            )
          );
      }

      function ballCollision(
        path: Path,
        ballRadius: number,
        terrainUpperBound: number,
        terrainLowerBound: number,
        paddleLeft: Paddle,
        paddleRight: Paddle
      ): Path {
        const trajectory = path.speed.clone().multiplyScalar(path.deltaTime);
        const validTrajectoryPortions: { [key: string]: number } = {};

        // Find all the possible collisions

        // Terrain
        const distUpperBound = terrainUpperBound - (path.position.y - ballRadius);
        const distLowerBound = terrainLowerBound - (path.position.y + ballRadius);
        const portionUpperBound = distUpperBound / trajectory.y;
        const portionLowerBound = distLowerBound / trajectory.y;
        if (path.speed.y < 0 && portionUpperBound >= 0 && portionUpperBound <= 1)
          validTrajectoryPortions["terrainUpperBound"] = portionUpperBound;
        else if (
          path.speed.y > 0 &&
          portionLowerBound >= 0 &&
          portionLowerBound <= 1
        )
          validTrajectoryPortions["terrainLowerBound"] = portionLowerBound;

        // Paddles
        const distLeftPaddle =
          paddleLeft.position.x +
          paddleLeft.width -
          (path.position.x - ballRadius);
        const distRightPaddle =
          paddleRight.position.x - (path.position.x + ballRadius);
        const portionLeftPaddle = distLeftPaddle / trajectory.x;
        const portionRightPaddle = distRightPaddle / trajectory.x;
        if (
          path.speed.x < 0 &&
          portionLeftPaddle >= 0 &&
          portionLeftPaddle <= 1
        ) {
          // vertical bounds
          const yCollision = path.position.y + trajectory.y * portionLeftPaddle;
          if (
            yCollision >= paddleLeft.position.y &&
            yCollision <= paddleLeft.position.y + paddleLeft.height
          )
            validTrajectoryPortions["paddleLeft"] = portionLeftPaddle;
        } else if (
          path.speed.x > 0 &&
          portionRightPaddle >= 0 &&
          portionRightPaddle <= 1
        ) {
          // vertical bounds
          const yCollision = path.position.y + trajectory.y * portionRightPaddle;
          if (
            yCollision >= paddleRight.position.y &&
            yCollision <= paddleRight.position.y + paddleRight.height
          )
            validTrajectoryPortions["paddleRight"] = portionRightPaddle;
        }

        // Find the smalles delta
        let collisionKey: string | null = null;
        let minimumPortion = 1;

        for (const key in validTrajectoryPortions) {
          if (validTrajectoryPortions[key] < minimumPortion) {
            minimumPortion = validTrajectoryPortions[key];
            collisionKey = key;
          }
        }

        if (collisionKey === null) return new Path(path).move();

        // if (collisionMagnitude === 0) return new Path(path.position.clone()); //! POTENTIALLY WRONG
        if (minimumPortion === 0) {
          const newPath = new Path(path);
          newPath.deltaTime = 0;
          return newPath;
        } //! POTENTIALLY WRONG

        const newPath = new Path(path).move(
          validTrajectoryPortions[collisionKey]
        );
        if (newPath.deltaTime < 1e-6) {
          newPath.deltaTime = 0;
        }
        switch (collisionKey) {
          case "terrainUpperBound":
          case "terrainLowerBound":
            // newPath.speed.invertY();
            newPath.speed.y = -newPath.speed.y;
            break;
          case "paddleLeft":
          case "paddleRight":
            // newPath.speed.invertX();
            newPath.speed.x = -newPath.speed.x;
            break;
          default:
        }
        return newPath;
      }

      paddleLeftPath.extend(paddleCollision, paddleLeft.height, 0, height);
      paddleLeft.position.copy(paddleLeftPath.last().position);
      paddleRightPath.extend(paddleCollision, paddleRight.height, 0, height);
      paddleRight.position.copy(paddleRightPath.last().position);

      const ballPath = new Path(
        ball.position.clone(),
        ball.speed.clone(),
        deltaTime
      );
      ballPath.extend(
        ballCollision,
        ball.radius,
        0,
        height,
        paddleLeft,
        paddleRight
      );
      ball.position.copy(ballPath.last().position);
      ball.speed.copy(ballPath.last().speed);
    }

    // Création de la scène Babylon.js
    function createScene() {
      // Initialisation de la scène
      const engine = new Engine(canvasRef.current, true);
      const scene = new Scene(engine);
      scene.clearColor = new Color3(0, 0, 0).toColor4(); // Couleur de fond

      // Camera
      const camera = new FreeCamera("camera1", new Vector3(0, 25, 0), scene);
      camera.setTarget(new Vector3(0, 0, 0));
      // const camera = new FreeCamera("camera1", new Vector3(0, 20, 15), scene);
      // camera.setTarget(new Vector3(0, 0, 2));
      // camera.attachControl(canvasRef.current, true); // Bouger la cam

      // Lumière
      new HemisphericLight("light", new Vector3(0, 1, 0), scene);

      // Glow layer
      const gl = new GlowLayer("glow", scene);
      gl.intensity = 2;

      // Bords
      const boundMat = new StandardMaterial("boundMat", scene);
      boundMat.diffuseColor = new Color3(0, 0, 0);

      const boundUp = MeshBuilder.CreateBox("boundUp", {
        height: 0.2, width: width - 2, depth: 0.2
      }, scene);
      boundUp.material = boundMat;
      boundUp.position.set(0, 0.5, -height / 2);

      const boundDown = MeshBuilder.CreateBox("boundDown", {
        height: 0.2, width: width - 2, depth: 0.2
      }, scene);
      boundDown.material = boundMat;
      boundDown.position.set(0, 0.5, height / 2);

      // Raquettes
      const paddleColor = new Color3(0.35, 0, 0.5);
      const paddleMat = new StandardMaterial("paddleMat", scene);
      paddleMat.diffuseColor = paddleColor;
      paddleMat.emissiveColor = paddleColor;

      const paddleLeft3D = MeshBuilder.CreateBox("paddleLeft3D", {
        height: paddleLeft.width, width: 0.3, depth: paddleLeft.height
      }, scene);
      paddleLeft3D.material = paddleMat;
      paddleLeft3D.position.set(-width / 2, 0.5, 0);

      const paddleRight3D = MeshBuilder.CreateBox("paddleRight3D", {
        height: paddleRight.width, width: 0.3, depth: paddleRight.height
      }, scene);
      paddleRight3D.material = paddleMat;
      paddleRight3D.position.set(width / 2, 0.5, 0);

      // Balle
      const ballColor = new Color3(0, 0.8, 0);
      const ball3D = MeshBuilder.CreateSphere("ball3D", { diameter: ball.radius * 2 }, scene);
      const ballMat = new StandardMaterial("ballMat", scene);
      ballMat.diffuseColor = ballColor;
      ballMat.emissiveColor = ballColor;
      ball3D.material = ballMat;
      ball3D.position.set(0, 0.5, 0);

      // urlTexture
      const urlTexture = "https://playground.babylonjs.com/textures/flare.png";

      // Particules pour la balle
      const ballParticules = new ParticleSystem("ballParticles", 500, scene);
      ballParticules.particleTexture = new Texture(urlTexture, scene);
      ballParticules.emitter = ball3D;
      ballParticules.minEmitBox = new Vector3(0, 0, 0);
      ballParticules.maxEmitBox = new Vector3(0, 0, 0);
      ballParticules.color1 = ballColor.toColor4(1);
      ballParticules.minLifeTime = speed * 10;
      ballParticules.maxLifeTime = speed * 10;
      ballParticules.emitRate = 500;
      ballParticules.addSizeGradient(0, ball.radius * 4);
      ballParticules.addSizeGradient(1, ball.radius * 2);
      ballParticules.start();

      // Particules pour les collisions
      const collisionParticles = new ParticleSystem("collisionParticles", 1000, scene);
      collisionParticles.particleTexture = new Texture(urlTexture, scene);
      collisionParticles.emitter = ball3D;
      collisionParticles.minEmitBox = new Vector3(0, 0, 0);
      collisionParticles.maxEmitBox = new Vector3(0, 0, 0);
      collisionParticles.minEmitPower = speed * 200;
      collisionParticles.maxEmitPower = speed * 500;
      collisionParticles.color1 = ballColor.toColor4(1);
      collisionParticles.colorDead = ballColor.toColor4(0);
      collisionParticles.minSize = 0.1;
      collisionParticles.maxSize = 0.1;
      collisionParticles.minLifeTime = speed * 100;
      collisionParticles.maxLifeTime = speed * 200;
      collisionParticles.manualEmitCount = 0;
      collisionParticles.disposeOnStop = false;
      collisionParticles.start();

      return {
        engine,
        scene,
        ball3D,
        paddleLeft3D,
        paddleRight3D,
        collisionParticles
      };
    }

    const { ball, paddleLeft, paddleRight, ballSpawn } = initializeGameElements();

    const { engine, scene, ball3D, paddleLeft3D, paddleRight3D, collisionParticles } = createScene();

    function triggerCollisionEffect(direction1: Vector3) {
      collisionParticles.direction1 = new Vector3(-1, 1, -1);
      collisionParticles.direction2 = new Vector3(1, -1, 1);
      collisionParticles.direction1.addInPlace(direction1.clone());
      collisionParticles.direction2.addInPlace(direction1.clone());
      collisionParticles.manualEmitCount = 300; // nombre de particules par collision
      collisionParticles.start();
    }

    scene.onBeforeRenderObservable.add(() => {
      const deltaTime = engine.getDeltaTime(); // en millisecondes

      // Update positions with collisions
      const tmpBallSpeed = ball.speed.clone();
      move(deltaTime);

      // Trigger collision effect if ball speed changed
      if (Math.sign(tmpBallSpeed.x) != Math.sign(ball.speed.x) || Math.sign(tmpBallSpeed.y) != Math.sign(ball.speed.y))
        triggerCollisionEffect(new Vector3(tmpBallSpeed.x * 100, 0, tmpBallSpeed.y * 100));

      // reset ball if out of bounds || In Back-Side ?
      if (ball.position.x - ball.radius < 0 || ball.position.x + ball.radius > width) {
        if (ball.position.x - ball.radius < 0)
          RightScore++;
        else
          LeftScore++;
        ball.position.x = width / 2, ball.position.y = ballSpawn[Math.floor(Math.random() * (ballSpawn.length))];
        defineBallVectors(ball);
      }

      // Offset posiions to match the 3D scene
      ball3D.position = new Vector3(-width / 2, 0.5, -height / 2);
      paddleLeft3D.position = new Vector3(-width / 2 + paddleLeft.width / 2, 0.5, -height / 2 + paddleLeft.height / 2);
      paddleRight3D.position = new Vector3(-width / 2 + paddleRight.width / 2, 0.5, -height / 2 + paddleRight.height / 2);

      // Update positions
      ball3D.position.addInPlace(new Vector3(ball.position.x, 0, ball.position.y));
      paddleLeft3D.position.addInPlace(new Vector3(paddleLeft.position.x, 0, paddleLeft.position.y));
      paddleRight3D.position.addInPlace(new Vector3(paddleRight.position.x, 0, paddleRight.position.y));
    });

    engine.runRenderLoop(() => {
      scene.render();
    });

    const resize = () => engine.resize();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
      engine.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100vh" }} />;
};

export default BabylonScene;