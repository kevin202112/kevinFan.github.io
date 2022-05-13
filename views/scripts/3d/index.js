const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
		60,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	)
const renderer = new THREE.WebGLRenderer({antialias: true});
const clock = new THREE.Clock()
var modelReady = false;
var deltaTime = 1 / 30;

var game = {
    objectsindex: 0,
    objects: {},
    add: function(object){
        this.objects[this.objectsindex] = object;
        this.objectsindex ++;
    }
};


var ambientLight1;
var directionalLight1;
var directionalLight2;
var directionalLight3;
var playerlight;

var jumpMaxHeight = 0.5;
var speed = 1;

var raycasterDown = new THREE.Raycaster(
  new THREE.Vector3(),
  new THREE.Vector3(0, -1, 0),
  0,
  0.1
);
var raycasterUp = new THREE.Raycaster(
  new THREE.Vector3(),
  new THREE.Vector3(0, 1, 0),
  0
);
var raycasterX = new THREE.Raycaster(
  new THREE.Vector3(),
  new THREE.Vector3(1, 0, 0),
  0,
  0.2
);
var raycasterSX = new THREE.Raycaster(
  new THREE.Vector3(),
  new THREE.Vector3(-1, 0, 0),
  0,
  0.2
);
var raycasterZ = new THREE.Raycaster(
  new THREE.Vector3(),
  new THREE.Vector3(0, 0, 1),
  0,
  0.2
);
var raycasterSZ = new THREE.Raycaster(
  new THREE.Vector3(),
  new THREE.Vector3(0, 0, -1),
  0,
  0.2
);
