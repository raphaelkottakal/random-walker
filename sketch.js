var stats,
gui,
scene,
renderer,
camera,
controls,
mrWalker,
walkersGeometry,
walkersMaterial,
sun,
bgLight,
wall,
allWalkers;

init();

// makeWall();

for (let i = -2; i <= 2; i++) {
  for (let j = -2; j <= 2; j++) {
    for (let k = -2; k <= 2; k++) {
      allWalkers.push(makeRandomWalker(10 * i, 10 * j, 10 * k));
    }
  }
}

animate();

function animate() {
  stats.begin();
  for (let i = 0; i < allWalkers.length; i++) {
    
    shakeWalker(allWalkers[i]);
  }
  // shakeLight();
  renderer.render( scene, camera );
  stats.end();
  requestAnimationFrame( animate );
};

function makeRandomWalker(x, y, z) {
  // walkersGeometry = new THREE.SphereBufferGeometry(1, 32, 32);
  walkersGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
  walkersMaterial = new THREE.MeshLambertMaterial({ color: 'hsl(' + Math.random() * 360 + ', 80%, 60%)' });

  mrWalker = new THREE.Mesh(walkersGeometry, walkersMaterial);

  mrWalker.castShadow = true;
  mrWalker.name = 'walker';

  // mrWalker.position.set(Math.random() * 2 - 10, Math.random() * 2 - 10, 0);
  // mrWalker.position.setX(Math.random() * 2 - 10, Math.random() * 2 - 10);
  mrWalker.position.setX(x);
  mrWalker.position.setY(y);
  mrWalker.position.setZ(z);

  scene.add(mrWalker);
  return mrWalker;
}

function makeWall() {
  var wallGeometry = new THREE.PlaneBufferGeometry(50, 50, 1);
  var wallMaterial = new THREE.MeshLambertMaterial({ color: 0x00ffff, wireframe: false });
  var wall = new THREE.Mesh(wallGeometry, wallMaterial);
  wall.name = 'wall';
  wall.receiveShadow = true;
  wall.translateZ(-3);
  scene.add(wall);
}

function init() {
  allWalkers = [];
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.z = 8;
  
  controls = new THREE.OrbitControls( camera );
  controls.minDistance = 2;
  controls.maxDistance = 30;
  controls.enablePan = false;
  
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild( renderer.domElement );
  window.addEventListener('resize', handelWindowResize);

  stats = new Stats();
  stats.showPanel(0);
  document.body.appendChild( stats.dom );

  lighting();

}

function lighting() {
  bgLight = new THREE.AmbientLight( 0xffffff, 0.2 );
  sun = new THREE.DirectionalLight( 0xffffff, 0.8 );
  
  // sun.castShadow = true;
  sun.shadow.mapSize.width = 512;
  sun.shadow.mapSize.height = 512;
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 500;
  
  sun.position.set(20, 10, 100);

  var helper = new THREE.DirectionalLightHelper( sun, 5 );

  // scene.add( helper );

  var spotLight = new THREE.SpotLight( 0xffffff );
  spotLight.position.set( 50, 10, 50 );

  spotLight.castShadow = true;

  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;

  spotLight.shadow.camera.near = 500;
  spotLight.shadow.camera.far = 4000;
  spotLight.shadow.camera.fov = 30;

  var spotLightHelper = new THREE.SpotLightHelper( spotLight );
  // scene.add( spotLightHelper );

  // scene.add( spotLight );
  scene.add(sun);

  scene.add(bgLight);
}

function shakeLight() {
  var slowFactor = 0.5;
  sun.translateX( (Math.random() * 2 - 1) * slowFactor );
  sun.translateY( (Math.random() * 2 - 1) * slowFactor );
  sun.translateZ( (Math.random() * 2 - 1) * slowFactor );
}

function shakeWalker(walker) {
  var slowFactor = 0.03;
  var slowAngleFactor = 0.03;
  walker.translateX( (Math.random() * 2 - 1) * slowFactor );
  walker.translateY( (Math.random() * 2 - 1) * slowFactor );
  walker.translateZ( (Math.random() * 2 - 1) * slowFactor );
  walker.rotateX( (Math.random() * 2 - 1) * slowAngleFactor );
  walker.rotateY( (Math.random() * 2 - 1) * slowAngleFactor );
  walker.rotateZ( (Math.random() * 2 - 1) * slowAngleFactor );
}

function handelWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}