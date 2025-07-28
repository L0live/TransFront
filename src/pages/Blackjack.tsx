import React, { useEffect, useRef } from "react";
import { Engine, Scene,
  HemisphericLight,
  Vector3, Color3, GlowLayer,
  StandardMaterial, AssetsManager,
  ArcRotateCamera, MeshBuilder,
  ParticleSystem,
  Texture
} from "@babylonjs/core";
import "@babylonjs/loaders/glTF"; // nécessaire pour le support GLTF/GLB

const BlackjackScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new Engine(canvas, true);
    const scene = new Scene(engine);
    scene.clearColor = new Color3(0.035, 0.02, 0.05).toColor4(); // Couleur de fond

    // Camera
    const camera = new ArcRotateCamera("camera", Math.PI / 2, Math.PI / 4, 2, new Vector3(0, 1, 0.5), scene);
    camera.attachControl(canvas, true);

    // Lights
    const light1 = new HemisphericLight("light1", new Vector3(0, 2, -1), scene);
    light1.intensity = 0.1;
    const light2 = new HemisphericLight("light2", new Vector3(-3, 1, 1), scene);
    light2.intensity = 0.2;
    const light3 = new HemisphericLight("light3", new Vector3(3, 1, 1), scene);
    light3.intensity = 0.3;

    // Glow
    const gl = new GlowLayer("glow", scene);
    gl.intensity = 0.4; // Intensité de l'effet de glow

    // Places
    const PlaceMat = new StandardMaterial("PlaceMat", scene);
    PlaceMat.diffuseColor = Color3.White();
    PlaceMat.emissiveColor = Color3.White();

    const Place1 = MeshBuilder.CreateSphere("Place1", { diameter: 0.005 }, scene);
    Place1.position = new Vector3(0.7, 1, 0.4);
    Place1.material = PlaceMat;

    const Place2 = MeshBuilder.CreateSphere("Place2", { diameter: 0.005 }, scene);
    Place2.position = new Vector3(0.4, 1, 0.7);
    Place2.material = PlaceMat;

    const Place3 = MeshBuilder.CreateSphere("Place3", { diameter: 0.005 }, scene);
    Place3.position = new Vector3(0, 1, 0.8);
    Place3.material = PlaceMat;

    const Place4 = MeshBuilder.CreateSphere("Place4", { diameter: 0.005 }, scene);
    Place4.position = new Vector3(-0.4, 1, 0.7);
    Place4.material = PlaceMat;

    const Place5 = MeshBuilder.CreateSphere("Place5", { diameter: 0.005 }, scene);
    Place5.position = new Vector3(-0.7, 1, 0.4);
    Place5.material = PlaceMat;

    // urlTexture
    const urlTexture = "https://playground.babylonjs.com/textures/flare.png";

    // Particules pour le fond
    const fontParticles = new ParticleSystem("fontParticles",5000, scene);
    fontParticles.particleTexture = new Texture(urlTexture, scene);
    fontParticles.emitter = new Vector3(0, 0, -10); // Position de l'émetteur
    fontParticles.minEmitBox = new Vector3(0, 0, 0);
    fontParticles.maxEmitBox = new Vector3(0, 0, 0);
    fontParticles.minEmitPower = 1;
    fontParticles.maxEmitPower = 3;
    fontParticles.direction1 = new Vector3(-0.5, 0, 1);
    fontParticles.direction2 = new Vector3(0.5, 0.08, 1);
    fontParticles.color1 = new Color3(0.35, 0, 0.5).toColor4(1);
    fontParticles.minSize = 0.02;
    fontParticles.maxSize = 0.02;
    fontParticles.minLifeTime = 10;
    fontParticles.maxLifeTime = 10;
    fontParticles.emitRate = 100;
    fontParticles.start();

    // Add Blackjack Table from a .glb file
    const assetsManager = new AssetsManager(scene);

    // const task = assetsManager.addContainerTask("loadGLB", "", "models/", "blackjack_table.glb");
    const task = assetsManager.addContainerTask("loadGLB", "", "models/", "floatingBlackjackTable.glb");

    task.onSuccess = (task) => {
        task.loadedContainer.addAllToScene();
        // Container elements: Table, ArmRest, DealersBand
        const color1 = new Color3(0.1, 0.4, 0.1); // Greenish color
        const color2 = new Color3(0.5, 0.2, 0.5); // Purple color
        // Table
        const table = task.loadedContainer.meshes.find(mesh => mesh.name === "Table");
        if (table) {
          //change table color
          // const tableMaterial = new StandardMaterial("tableMaterial", scene);
          // tableMaterial.diffuseColor = color1;
          // tableMaterial.emissiveColor = color1;
          // table.material = tableMaterial;
        } else
        console.warn("Table mesh not found in the loaded GLB file.");
        // ArmRest
        const armRest = task.loadedContainer.meshes.find(mesh => mesh.name === "ArmRest");
        if (armRest) {
          // change arm rest color
          const armRestMaterial = new StandardMaterial("armRestMaterial", scene);
          armRestMaterial.diffuseColor = color2;
          armRestMaterial.emissiveColor = color2;
          armRest.material = armRestMaterial;
          // Particules pour l'accoudoir
          // const armRestParticules = new ParticleSystem("armRestParticles", 500, scene);
          // armRestParticules.particleTexture = new Texture(urlTexture, scene);
          // armRestParticules.emitter = new Vector3(0, 0.985, 1.1); // Position de l'émetteur
          // armRestParticules.minEmitBox = new Vector3(0, 0, 0);
          // armRestParticules.maxEmitBox = new Vector3(0, 0, 0);
          // armRestParticules.color1 = color2.toColor4(1);
          // armRestParticules.direction1 = new Vector3(0, 0, 1);
          // armRestParticules.direction2 = new Vector3(0, 0, 1);
          // armRestParticules.minLifeTime = 0.5;
          // armRestParticules.maxLifeTime = 0.5;
          // armRestParticules.emitRate = 100;
          // armRestParticules.addSizeGradient(0, 0.2);
          // armRestParticules.addSizeGradient(1, 0);
          // armRestParticules.start();
        } else
        console.warn("ArmRest mesh not found in the loaded GLB file.");
        // DealersBand
        const dealersBand = task.loadedContainer.meshes.find(mesh => mesh.name === "DealersBand");
        if (dealersBand) {
          // change dealers band color (purple)
          const dealersBandMaterial = new StandardMaterial("dealersBandMaterial", scene);
          dealersBandMaterial.diffuseColor = color2;
          dealersBandMaterial.emissiveColor = color2;
          dealersBand.material = dealersBandMaterial;
        } else
        console.warn("DealersBand mesh not found in the loaded GLB file.");
    };

    task.onError = (task, message, exception) => {
        console.error("Erreur de chargement :", message, exception);
    };

    assetsManager.load();

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
