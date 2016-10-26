init();
animate();

// Thanks to @cx20 for this sample code!
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
    scene.background = reflectionCube;

    camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 200 );
    camera.position.z = 300;
    camera.position.copy(new THREE.Vector3(0, 2, 3));

    var manager = new THREE.LoadingManager();
    manager.onProgress = function ( item, loaded, total ) {
        console.log( item, loaded, total );
    };

    var objLoader = new THREE.OBJLoader(manager);
    objLoader.load('models/Chest/chest.obj', function(object) {
        var mainMesh;
        object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                mainMesh = child;
            }
        });

        object.position.set(0, 0, 0);
        object.scale.set(4, 4, 4);

        var textureLoader = new THREE.TextureLoader();
        mainMesh.material = new THREE.MeshStandardMaterial({
            map: textureLoader.load('models/Chest/chest_albedo.png'),
            normalMap: textureLoader.load('models/Chest/chest_normal.png'),
            roughnessMap: textureLoader.load('models/Chest/chest_roughness.png'),
            metalnessMap: textureLoader.load('models/Chest/chest_metalness.png'),
            aoMap: textureLoader.load('models/Chest/chest_ao.png'),

            //roughness: 0,
            //metalness: 1,
            aoMapIntensity: 0.5,  // The ao map appears to quash the reflectionCube.
            envMap: reflectionCube
        });

        scene.add(object);
        window.mainObject = object;  // for debugging only
        window.mainMesh = mainMesh;  // for debugging only
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
