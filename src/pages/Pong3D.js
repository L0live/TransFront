const createScene = function () {
    const scene = new BABYLON.Scene(engine);

    let width = 30;
    let height = 20;

    // Camera
    const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(30, 25, 20), scene);
    camera.setTarget(new BABYLON.Vector3(3, 0, 0));
    camera.attachControl(canvas, true);

    // Lumière
    new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    
    // Ajout d'un glow layer (neon)
    const gl = new BABYLON.GlowLayer("glow", scene);
    gl.intensity = 1; // plus c’est élevé, plus ça brille

    // Bords
    const boundMat = new BABYLON.StandardMaterial("boundMat", scene);
    boundMat.diffuseColor = new BABYLON.Color3(0, 0, 0);

    const boundUp = BABYLON.MeshBuilder.CreateBox("boundUp", { height: 0.5, width: width - 1, depth: 0.2 }, scene);
    boundUp.material = boundMat;
    boundUp.position.z = height / 2 * -1;
    boundUp.position.y = 0.5;

    const boundDown = BABYLON.MeshBuilder.CreateBox("boundDown", { height: 0.5, width: width - 1, depth: 0.2 }, scene);
    boundDown.material = boundMat;
    boundDown.position.z = height / 2;
    boundDown.position.y = 0.5;

    // Raquettes
    const paddleColor = new BABYLON.Color3(0.35, 0, 0.5);
    const paddleMat = new BABYLON.StandardMaterial("paddleMat", scene);
    paddleMat.diffuseColor = paddleColor;
    paddleMat.emissiveColor = paddleColor;

    const paddleLeft = BABYLON.MeshBuilder.CreateBox("paddleLeft", { height: 0.8, width: 0.3, depth: 4 }, scene);
    paddleLeft.material = paddleMat;
    paddleLeft.position.x = width / 2 * -1;
    paddleLeft.position.y = 0.5;

    const paddleRight = BABYLON.MeshBuilder.CreateBox("paddleRight", { height: 0.8, width: 0.3, depth: 4 }, scene);
    paddleRight.material = paddleMat;
    paddleRight.position.x = width / 2;
    paddleRight.position.y = 0.5;

    // Balle
    const ballColor = new BABYLON.Color3(0, 0.8, 0);
    const ball = BABYLON.MeshBuilder.CreateSphere("ball", { diameter: 1 }, scene);
    ball.material = new BABYLON.StandardMaterial("ballMat", scene);
    ball.material.diffuseColor = ballColor;
    ball.material.emissiveColor = ballColor;
    ball.position = new BABYLON.Vector3(0, 0.5, 0);

    function createParticule(emitter, color) {    
        const particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);

        // Texture
        particleSystem.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", scene);

        // Emetteur
        particleSystem.emitter = emitter;
        particleSystem.minEmitBox = new BABYLON.Vector3(0, 0, 0);
        particleSystem.maxEmitBox = new BABYLON.Vector3(0, 0, 0);

        // Couleur de la traînée
        particleSystem.color1 = color;

        // Taille, durée de vie et nombre des particules
        particleSystem.minSize = 2;
        particleSystem.maxSize = 2;
        particleSystem.minLifeTime = 0.1;
        particleSystem.maxLifeTime = 0.1;
        particleSystem.emitRate = 500; // Nombre de particules émises par seconde (fluide)

        // Lancement
        particleSystem.start();
    }

    createParticule(ball, ballColor);

    // Direction initiale
    let direction = new BABYLON.Vector3(0.12, 0, 0.1);

    // Animation simple
    scene.onBeforeRenderObservable.add(() => {
        ball.position.addInPlace(direction);

        // Rebond latéral
        if (Math.abs(ball.position.x) > (width - 1) / 2) direction.x *= -1;

        // Rebond vertical
        if (ball.position.z > (height - 1) / 2 || ball.position.z < (height - 1) / 2 * -1) direction.z *= -1;
    });

    return scene;
};