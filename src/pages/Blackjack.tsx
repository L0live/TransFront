import React, { useEffect, useRef } from "react";
import { Engine, Scene,
  HemisphericLight,
  Vector3, Color3, GlowLayer,
  StandardMaterial, AssetsManager,
  ArcRotateCamera, MeshBuilder,
  ParticleSystem, Mesh,
  Texture, Color4
} from "@babylonjs/core";
import { AdvancedDynamicTexture,
  Button
} from "@babylonjs/gui";
import "@babylonjs/loaders/glTF"; // nécessaire pour le support GLTF/GLB

const BlackjackScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function createScene() {
      const engine = new Engine(canvas, true);
      const scene = new Scene(engine);
      scene.clearColor = new Color3(0.035, 0.02, 0.05).toColor4(); // Couleur de fond

      // Camera
      const camera = new ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2, 2, new Vector3(0, 1.5, 1), scene);
      camera.attachControl(canvas, true);

      // Lights
      const light1 = new HemisphericLight("light1", new Vector3(0, 2, -1), scene);
      light1.intensity = 0.1;
      const light2 = new HemisphericLight("light2", new Vector3(-3, 1, 1), scene);
      light2.intensity = 0.2;
      const light3 = new HemisphericLight("light3", new Vector3(3, 1, 1), scene);
      light3.intensity = 0.3;

      // Glow
      const glow = new GlowLayer("glow", scene);
      glow.intensity = 0.5; // Intensité de l'effet de glow

      // Places
      let placesTab: Mesh[] = [];
      const PlaceMat = new StandardMaterial("PlaceMat", scene);
      PlaceMat.diffuseColor = Color3.White();
      PlaceMat.emissiveColor = Color3.White();

      const Place1 = MeshBuilder.CreateSphere("Place1", { diameter: 0.03 }, scene);
      Place1.position = new Vector3(0.7, 1, 0.4);
      Place1.material = PlaceMat;
      placesTab.push(Place1);

      const Place2 = MeshBuilder.CreateSphere("Place2", { diameter: 0.03 }, scene);
      Place2.position = new Vector3(0.4, 1, 0.7);
      Place2.material = PlaceMat;
      placesTab.push(Place2);

      const Place3 = MeshBuilder.CreateSphere("Place3", { diameter: 0.03 }, scene);
      Place3.position = new Vector3(0, 1, 0.8);
      Place3.material = PlaceMat;
      placesTab.push(Place3);

      const Place4 = MeshBuilder.CreateSphere("Place4", { diameter: 0.03 }, scene);
      Place4.position = new Vector3(-0.4, 1, 0.7);
      Place4.material = PlaceMat;
      placesTab.push(Place4);

      const Place5 = MeshBuilder.CreateSphere("Place5", { diameter: 0.03 }, scene);
      Place5.position = new Vector3(-0.7, 1, 0.4);
      Place5.material = PlaceMat;
      placesTab.push(Place5);

      // urlTexture
      const urlTexture = "https://playground.babylonjs.com/textures/flare.png";

      // Particules pour le fond
      const fontParticulesColor = new Color4(0, 0, 0.8, 1); // Blue color
      const fontParticles = new ParticleSystem("fontParticles",5000, scene);
      fontParticles.particleTexture = new Texture(urlTexture, scene);
      fontParticles.emitter = new Vector3(0, 0, -10); // Position de l'émetteur
      fontParticles.minEmitBox = new Vector3(0, 0, 0);
      fontParticles.maxEmitBox = new Vector3(0, 0, 0);
      fontParticles.minEmitPower = 3;
      fontParticles.maxEmitPower = 5;
      fontParticles.direction1 = new Vector3(-0.5, 0, 1);
      fontParticles.direction2 = new Vector3(0.5, 1, 1);
      fontParticles.color1 = fontParticulesColor;
      fontParticles.addColorGradient(0, Color3.Black().toColor4());
      fontParticles.addColorGradient(0.1, fontParticulesColor, Color3.White().toColor4());
      fontParticles.addColorGradient(0.9, Color3.Black().toColor4());
      fontParticles.minSize = 0.02;
      fontParticles.maxSize = 0.02;
      fontParticles.minLifeTime = 10;
      fontParticles.maxLifeTime = 10;
      fontParticles.emitRate = 500;
      fontParticles.start();

      // Add Blackjack Table from a .glb file
      const assetsManager = new AssetsManager(scene);

      // const task = assetsManager.addContainerTask("loadGLB", "", "models/", "blackjack_table.glb");
      const task = assetsManager.addContainerTask("loadGLB", "", "models/", "floatingBlackjackTable.glb");

      // const matColor = new Color3(1, 95/255, 31/255); // Orange
      // const matColor = new Color3(0.5, 0.2, 0.5); // Purple color
      // wood color
      // const matColor = new Color3(119/255, 70/255, 52/255); // Wood color
      const matColor = new Color3(60/255, 35/255, 26/255); // Wood color / 2

      let armRest;
      let armRestParticulesTab: ParticleSystem[] = [];
      let dealersBand;

      task.onSuccess = (task) => {
        task.loadedContainer.addAllToScene();
        // Container elements: Table, ArmRest, DealersBand
        // const color1 = new Color3(0.5, 0.2, 0.5); // Purple color
        // const color1 = new Color3(0, 0, 0.2); // Blue color
        // const color1 = new Color3(119/255, 70/255, 52/255); // Wood color
        // const color1 = new Color3(60/255, 35/255, 26/255); // Wood color / 2
        // const color1 = new Color3(255/255, 95/255, 31/255); // Orange color
        // Principal material
        const material = new StandardMaterial("material", scene);
        material.diffuseColor = matColor;
        material.emissiveColor = matColor;

        // ArmRest
        armRest = task.loadedContainer.meshes.find(mesh => mesh.name === "ArmRest");
        if (armRest) {
          armRest.material = material;
          // Particules pour l'accoudoir
          // const center = new Vector3(0, 0.985, -0.05);
          // const radius = -1.2;
          // const startAngle = 1.98 * Math.PI;
          // const endAngle = 1.02 * Math.PI;
          // const count = 90;

          // const step = (endAngle - startAngle) / (count - 1);
          // // const armRestParticulesColor = new Color4(0, 0, 0.2, 1); // Blue color
          // const armRestParticulesColor = matColor.toColor4(1); // Orange color

          // for (let i = 0; i < count; i++) {
          //   const angle = startAngle + i * step;
          //   const x = center.x + radius * Math.cos(angle);
          //   const z = center.z + radius * Math.sin(angle);
          //   const armRestParticules = new ParticleSystem(`armRestParticles{${i}}`, 500, scene);
          //   armRestParticules.particleTexture = new Texture(urlTexture, scene);
          //   armRestParticules.emitter = new Vector3(x, center.y, z); // Position de l'émetteur
          //   armRestParticules.minEmitBox = new Vector3(0, 0, 0);
          //   armRestParticules.maxEmitBox = new Vector3(0, 0, 0);
          //   // armRestParticules.color1 = color.toColor4(1);
          //   // armRestParticules.minSize = 0.1;
          //   // armRestParticules.maxSize = 0.1;
          //   armRestParticules.addSizeGradient(0, 0.05 + (1 - Math.abs(x)) / 10);
          //   armRestParticules.addSizeGradient(0.9, 0.05 + (1 - Math.abs(x)) / 10);
          //   // armRestParticules.addSizeGradient(0, 0.15);
          //   // armRestParticules.addSizeGradient(0.9, 0.15);
          //   armRestParticules.addSizeGradient(1, 0);
          //   armRestParticules.addColorGradient(0, armRestParticulesColor);
          //   armRestParticules.addColorGradient(0.9, armRestParticulesColor);
          //   armRestParticules.addColorGradient(1, Color3.Black().toColor4());
          //   // armRestParticules.direction1 = new Vector3(0.1, 0.1, 1.2);
          //   // armRestParticules.direction2 = new Vector3(-0.1, -0.1, 0.8);
          //   armRestParticules.direction1 = new Vector3(0, 0, 1);
          //   armRestParticules.direction2 = new Vector3(0, 0, 1);
          //   armRestParticules.minLifeTime = 0.2;
          //   armRestParticules.maxLifeTime = (1 - Math.abs(x)) / 1.5;
          //   armRestParticules.emitRate = 100;
          //   armRestParticules.start();

          //   armRestParticulesTab.push(armRestParticules);
          // }
        } else
          console.warn("ArmRest mesh not found in the loaded GLB file.");
        // DealersBand
        dealersBand = task.loadedContainer.meshes.find(mesh => mesh.name === "DealersBand");
        if (dealersBand) {
          dealersBand.material = material;
        } else
        console.warn("DealersBand mesh not found in the loaded GLB file.");
      };

      task.onError = (task, message, exception) => {
          console.error("Erreur de chargement :", message, exception);
      };

      assetsManager.load();

      // Particules pour les reacteurs
      const ReactorLeftParticles = new ParticleSystem("ReactorLeftParticles", 500, scene);
      ReactorLeftParticles.particleTexture = new Texture(urlTexture, scene);
      ReactorLeftParticles.emitter = new Vector3(-1.15, 0.985, 0); // Position de l'émetteur
      ReactorLeftParticles.minEmitBox = new Vector3(0, 0, 0);
      ReactorLeftParticles.maxEmitBox = new Vector3(0, 0, 0);
      ReactorLeftParticles.direction1 = new Vector3(0.01, 0.01, 1);
      ReactorLeftParticles.direction2 = new Vector3(-0.01, -0.01, 1);
      ReactorLeftParticles.minLifeTime = 1;
      ReactorLeftParticles.maxLifeTime = 1;
      ReactorLeftParticles.emitRate = 100;
      ReactorLeftParticles.minEmitPower = 1.5;
      ReactorLeftParticles.maxEmitPower = 1.5;
      ReactorLeftParticles.minSize = 0.2;
      ReactorLeftParticles.maxSize = 0.2;
      ReactorLeftParticles.addColorGradient(0, new Color3(0, 0, 1).toColor4(1));
      ReactorLeftParticles.addColorGradient(0.9, Color3.Black().toColor4(1));
      ReactorLeftParticles.start();
      const ReactorRightParticles = new ParticleSystem("ReactorRightParticles", 500, scene);
      ReactorRightParticles.particleTexture = new Texture(urlTexture, scene);
      ReactorRightParticles.emitter = new Vector3(1.15, 0.985, 0); // Position de l'émetteur
      ReactorRightParticles.minEmitBox = new Vector3(0, 0, 0);
      ReactorRightParticles.maxEmitBox = new Vector3(0, 0, 0);
      ReactorRightParticles.direction1 = new Vector3(0.01, 0.01, 1);
      ReactorRightParticles.direction2 = new Vector3(-0.01, -0.01, 1);
      ReactorRightParticles.minLifeTime = 1;
      ReactorRightParticles.maxLifeTime = 1;
      ReactorRightParticles.emitRate = 100;
      ReactorRightParticles.minEmitPower = 1.5;
      ReactorRightParticles.maxEmitPower = 1.5;
      ReactorRightParticles.minSize = 0.2;
      ReactorRightParticles.maxSize = 0.2;
      ReactorRightParticles.addColorGradient(0, new Color3(0, 0, 1).toColor4(1));
      ReactorRightParticles.addColorGradient(0.9, Color3.Black().toColor4(1));
      ReactorRightParticles.start();

      return {
        engine,
        scene,
        camera,
        glow,
        placesTab,
        fontParticles,
        // matColor,
        // armRest, dealersBand,
        // armRestParticulesTab
        ReactorLeftParticles,
        ReactorRightParticles,
      }
    }

    // const { engine, scene, camera, glow, placesTab, fontParticles, matColor, armRest, dealersBand, armRestParticulesTab } = createScene();
    const { engine, scene, camera, glow, placesTab, fontParticles, ReactorLeftParticles, ReactorRightParticles } = createScene();

    let cinematicEndUp = false;
    let cinematicElapsedTime = 0;
    const cinematicDuration = 3000; // Durée de la cinématique en ms
    const initCameraBeta = camera.beta;
    const initCameraRadius = camera.radius;
    const initFontParticlesMinEmitPower = fontParticles.minEmitPower;
    const initFontParticlesMaxEmitPower = fontParticles.maxEmitPower;
    // const WoodColor = new Color3(119/255, 70/255, 52/255);
    // const initMatColor = matColor.clone();

    const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
    const buttonPlay = Button.CreateSimpleButton("playButton", "PLAY");
    buttonPlay.width = "150px";
    buttonPlay.height = "40px";
    buttonPlay.color = "white";
    buttonPlay.background = "black";
    buttonPlay.onPointerUpObservable.add(() => {
      buttonPlay.isVisible = false; // Hide the button
      ReactorLeftParticles.stop();
      ReactorRightParticles.stop();

    });
    advancedTexture.addControl(buttonPlay);

    scene.onBeforeRenderObservable.add(() => {
      const deltaTime = engine.getDeltaTime(); // en millisecondes

      // Cinematic
      if (buttonPlay.isVisible)
        return;
      if (!cinematicEndUp) {
        cinematicElapsedTime += deltaTime;
        const t = Math.min(cinematicElapsedTime / cinematicDuration, 1); // progression de 0 à 1
        // Camera
        camera.beta = initCameraBeta + t * -(Math.PI / 4); // Réduction de l'angle de la caméra
        camera.radius = initCameraRadius + t * -0.8; // Réduction de la distance de la caméra
        // Font particles
        fontParticles.minEmitPower = initFontParticlesMinEmitPower + t * -3;
        fontParticles.maxEmitPower = initFontParticlesMaxEmitPower + t * -3;
        // Glow
        glow.intensity = 0.5 + t * -0.3;
        // ArmRest and DealersBand Color
        // matColor.r = initMatColor.r + t * (WoodColor.r - initMatColor.r);
        // matColor.g = initMatColor.g + t * (WoodColor.g - initMatColor.g);
        // matColor.b = initMatColor.b + t * (WoodColor.b - initMatColor.b);
        if (cinematicElapsedTime >= cinematicDuration) {
          cinematicEndUp = true;
          // armRestParticulesTab.forEach(ps => {ps.stop();});
        }
        return;
      }
    });

    // Start rendering the scene
    engine.runRenderLoop(() => {
      scene.render();
    });

    return () => {
      engine.dispose();
      scene.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100vh" }} />;
}

export default BlackjackScene;
