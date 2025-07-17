import React, { useEffect, useRef } from "react";
import { Engine, Scene,
  FreeCamera, HemisphericLight,
  Vector3, Color3, Color4, GlowLayer,
  StandardMaterial, MeshBuilder,
  ParticleSystem, Texture
} from "@babylonjs/core";

const BabylonScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new Engine(canvasRef.current, true);
    const scene = new Scene(engine);

    const width = 30;
    const height = 20;

    // Camera
    const camera = new FreeCamera("camera1", new Vector3(0, 25, 0), scene);
    camera.setTarget(new Vector3(0, 0, 0));
    camera.attachControl(canvasRef.current, true);

    // Lumière
    new HemisphericLight("light", new Vector3(0, 1, 0), scene);

    // Glow layer
    const gl = new GlowLayer("glow", scene);
    gl.intensity = 1;

    // Bords
    const boundMat = new StandardMaterial("boundMat", scene);
    boundMat.diffuseColor = new Color3(0, 0, 0);

    const boundUp = MeshBuilder.CreateBox("boundUp", {
      height: 0.5, width: width - 1, depth: 0.2
    }, scene);
    boundUp.material = boundMat;
    boundUp.position.set(0, 0.5, -height / 2);

    const boundDown = MeshBuilder.CreateBox("boundDown", {
      height: 0.5, width: width - 1, depth: 0.2
    }, scene);
    boundDown.material = boundMat;
    boundDown.position.set(0, 0.5, height / 2);

    // Raquettes
    const paddleColor = new Color3(0.35, 0, 0.5);
    const paddleMat = new StandardMaterial("paddleMat", scene);
    paddleMat.diffuseColor = paddleColor;
    paddleMat.emissiveColor = paddleColor;

    const paddleLeft = MeshBuilder.CreateBox("paddleLeft", {
      height: 0.8, width: 0.3, depth: 4
    }, scene);
    paddleLeft.material = paddleMat;
    paddleLeft.position.set(-width / 2, 0.5, 0);

    const paddleRight = MeshBuilder.CreateBox("paddleRight", {
      height: 0.8, width: 0.3, depth: 4
    }, scene);
    paddleRight.material = paddleMat;
    paddleRight.position.set(width / 2, 0.5, 0);

    // Balle
    const ballColor = new Color3(0, 0.8, 0);
    const ball = MeshBuilder.CreateSphere("ball", { diameter: 1 }, scene);
    const ballMat = new StandardMaterial("ballMat", scene);
    ballMat.diffuseColor = ballColor;
    ballMat.emissiveColor = ballColor;
    ball.material = ballMat;
    ball.position.set(0, 0.5, 0);

    const createParticle = (emitter: any, color: Color4) => {
      const ps = new ParticleSystem("particles", 2000, scene);
      ps.particleTexture = new Texture("https://playground.babylonjs.com/textures/flare.png", scene);
      ps.emitter = emitter;
      ps.minEmitBox = new Vector3(0, 0, 0);
      ps.maxEmitBox = new Vector3(0, 0, 0);
      ps.color1 = color;
      ps.minSize = 2;
      ps.maxSize = 2;
      ps.minLifeTime = 0.1;
      ps.maxLifeTime = 0.1;
      ps.emitRate = 500;
      ps.start();
    };

    createParticle(ball, ballColor.toColor4(1));

    // Mouvement
    let direction = new Vector3(0.12, 0, 0.1);

    scene.onBeforeRenderObservable.add(() => {
      ball.position.addInPlace(direction);

      if (Math.abs(ball.position.x) > (width - 1) / 2) direction.x *= -1;
      if (ball.position.z > (height - 1) / 2 || ball.position.z < -((height - 1) / 2)) direction.z *= -1;
    });

    engine.runRenderLoop(() => {
      scene.render();
    });

    const resize = () => engine.resize();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      engine.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100vh" }} />;
};

export default BabylonScene;