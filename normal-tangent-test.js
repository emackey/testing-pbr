init();
animate();

function init() {
    width = window.innerWidth;
    height = window.innerHeight;

    scene = new THREE.Scene();

    var ambient = new THREE.AmbientLight( 0x101030 );
    scene.add( ambient );

    var directionalLight = new THREE.DirectionalLight(0xffeedd);
    directionalLight.position.set(0.5, 0.8, 1);
    scene.add(directionalLight);

    var fillLight = new THREE.DirectionalLight(0xddeeff);
    fillLight.position.set(-0.5, 0.2, -1);
    scene.add(fillLight);

    // Creative Commons license, downloaded from http://www.humus.name/index.php?page=Textures
    var envPath = "envmaps/Yokohama/";
    var urls = [
        envPath + 'posx.jpg',
        envPath + 'negx.jpg',
        envPath + 'posy.jpg',
        envPath + 'negy.jpg',
        envPath + 'posz.jpg',
        envPath + 'negz.jpg'
    ];

    var reflectionCube = new THREE.CubeTextureLoader().load(urls);
    reflectionCube.format = THREE.RGBFormat;

    // This line displays the reflectionCube as the scene's background.
    //scene.background = reflectionCube;
    scene.background = new THREE.Color( 0.2, 0.2, 0.2 );

    camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 200 );
    camera.position.copy(new THREE.Vector3(0, 1.5, 0));

    var manager = new THREE.LoadingManager();
    manager.onProgress = function ( item, loaded, total ) {
        console.log( item, loaded, total );
    };

    var objLoader = new THREE.OBJLoader(manager);
    objLoader.load('models/NormalTangentTest/NormalTangentTestPlatform.obj', function (object) {
        var mainMesh;
        object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                mainMesh = child;
            }
        });

        var textureLoader = new THREE.TextureLoader();
        mainMesh.material = new THREE.MeshStandardMaterial({
            map: textureLoader.load('models/NormalTangentTest/NormalTangentTest_BaseColor.png'),
            normalMap: textureLoader.load('models/NormalTangentTest/NormalTangentTest_Normal.png'),
            roughnessMap: textureLoader.load('models/NormalTangentTest/NormalTangentTest_Roughness.png'),
            metalnessMap: textureLoader.load('models/NormalTangentTest/NormalTangentTest_Metallic.png'),
            aoMap: textureLoader.load('models/NormalTangentTest/NormalTangentTest_Occlusion.png'),

            //roughness: 0,
            //metalness: 1,
            aoMapIntensity: 0.5,  // The ao map appears to quash the reflectionCube.
            envMap: reflectionCube
        });

        object.position.set(0, -0.125, 0);
        scene.add(object);
        window.mainObject = object;  // debugging
        window.mainMesh = mainMesh;  // debugging
    });

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor( 0xaaaaaa );

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.userPan = false;
    controls.userPanSpeed = 0.0;
    controls.maxDistance = 5000.0;
    controls.maxPolarAngle = Math.PI * 0.895;
    controls.autoRotate = false;
    controls.autoRotateSpeed = -10.0;

    renderer.setSize( width, height );
    document.body.appendChild( renderer.domElement );
}

function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
    controls.update();
}
