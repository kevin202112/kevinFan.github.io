function playerInit(){  //玩家初始化
	game.objects[1].velocity = [0,0,0];
}

function playerUpdate() {  //玩家行為及物理處理
	var player = game.objects[1];
	const rotationSpeed = 20;
	player.velocity[0] = 0;
	player.velocity[2] = 0;
	player.rotation = 0.5;
	/*移動*/
	if(input.moveForward === true) {
		player.velocity[0] -= speed;
		player.velocity[2] -= speed;
		player.rotation = Math.PI * 1.25;
	}
	if(input.moveBackward === true){
		player.velocity[0] += speed;
		player.velocity[2] += speed;
		if(player.rotation != 0){
			player.rotation = (Math.PI * 0.25 + player.rotation)/2;
		}else{
			player.rotation = Math.PI * 0.25;
		}
	}
	if(input.moveLeft === true){
		player.velocity[0] -= speed;
		player.velocity[2] += speed;
		if(input.moveBackward === true){
			player.rotation = Math.PI * 0;
		}else if(input.moveForward === true){
			player.rotation = Math.PI * 1.5;
		}else{
			player.rotation = Math.PI * 1.75;
		}
	}
	if(input.moveRight === true){
		player.velocity[0] += speed;
		player.velocity[2] -= speed;
		if(input.moveBackward === true){
			player.rotation = Math.PI * 0.5;
		}else if(input.moveForward === true){
			player.rotation = Math.PI * 1;
		}else{
			player.rotation = Math.PI * 0.75;
		}
	}

	/*物理運算*/
	player.velocity[1] -= 4.9 * deltaTime;

    //碰撞處理
	raycasterX.ray.origin.copy(player.Render.position);
	raycasterX.ray.origin.y += jumpMaxHeight;
	intersections = raycasterX.intersectObjects(game.objects[0].Render.children, true);
	if (intersections.length > 0) {
		player.velocity[0] = Math.min(0, player.velocity[0])
	}
	raycasterSX.ray.origin.copy(player.Render.position);
	raycasterSX.ray.origin.y += jumpMaxHeight;
	intersections = raycasterSX.intersectObjects(game.objects[0].Render.children, true);
	if (intersections.length > 0) {
		player.velocity[0] = Math.max(0, player.velocity[0])
	}
	raycasterZ.ray.origin.copy(player.Render.position);
	raycasterZ.ray.origin.y += jumpMaxHeight;
	intersections = raycasterZ.intersectObjects(game.objects[0].Render.children, true);
	if (intersections.length > 0) {
		player.velocity[2] = Math.min(0, player.velocity[2])
	}
	raycasterSZ.ray.origin.copy(player.Render.position);
	raycasterSZ.ray.origin.y += jumpMaxHeight;
	intersections = raycasterSZ.intersectObjects(game.objects[0].Render.children, true);
	if (intersections.length > 0) {
		player.velocity[2] = Math.max(0, player.velocity[2])
	}
	raycasterDown.ray.origin.copy(player.Render.position);
	raycasterDown.ray.origin.y += 0.1;

	var intersections = raycasterDown.intersectObjects(game.objects[0].Render.children, true);
	var onObject = intersections.length > 0
	if (onObject === true) {
	    player.velocity[1] = Math.max(0, player.velocity[1])
	    input.canJump = true;
	}else{
		input.canJump = false;
	}

	raycasterUp.ray.origin.copy(player.Render.position);
	raycasterUp.ray.origin.y += 0.1;
	intersections = raycasterUp.intersectObjects(game.objects[0].Render.children, true);
	onObject = intersections.length > 0
	if (onObject === true) {
		player.velocity[1] = 10;
	}else{
		if(player.velocity[1] > 8){
			player.velocity[1] = 0;
		}
	}

	if(player.Render.position.y < -2){
		player.Render.position.x = 0.767;
		player.Render.position.y = 0.048;
		player.Render.position.z = -1.249;
		player.velocity = [0,1,2];
	}

	/*數值載入*/
	player.Render.rotation.y += (player.rotation - player.Render.rotation.y) * deltaTime * rotationSpeed;

	player.Render.position.x += player.velocity[0] * deltaTime;
	player.Render.position.y += player.velocity[1] * deltaTime;
	player.Render.position.z += player.velocity[2] * deltaTime;
	/*動畫*/
	if(input.moveForward === false && input.moveLeft === false && input.moveBackward === false && input.moveRight === false){
		if(player.animations.type != 0){
			player.animations.idleAction();
		}
	}else{
		if(input.canJump == false){
			if(player.animations.type != 2){
				player.animations.jumpAction();
			}
		}else{
			if(player.animations.type != 1){
				player.animations.runAction();
			}
		}
	}
	/*相機*/
	camera.position.copy(player.Render.position);
	var cameraDistance = parseFloat(webVue.setting.cameraDistance);
	camera.position.x += cameraDistance;
	camera.position.y += cameraDistance;
	camera.position.z += cameraDistance;
	camera.lookAt(player.Render.position);
}  //玩家

function load() {  //模型載入
	modelsDataLoad();
	loading();
}

function loading() {  //確認模型是否載入完成
	if(models.loadFinish == 7){
		setTimeout(webShow, 1000);
		function webShow() {
			webVue.$set(webVue.show, 'active', true);
			webVue.$set(webVue.show, 'loading', false);
		}
		init();
	}else{
		setTimeout(loading, 100);
	}
}

function init() {  //場景配置及一切設置
	rendererLoad();
	skyLoad();
	modelLoad();
	playerInit();
    lightLoad();
	modelReady = true;
	animate();
	pysicsUpdate();
	socketInit();
	multUpdate();
}

function skyLoad(){  //天空設置
  const loader = new THREE.CubeTextureLoader();
  const texture = loader.load([
    'img/sky2.jpg',
    'img/sky1.jpg',
    'img/sky5.jpg',
    'img/sky6.jpg',
    'img/sky3.jpg',
    'img/sky4.jpg',
  ]);
  scene.background = texture;
}

function rendererLoad(){  //畫面設置
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = 2;
	var pixelRatioOffset = ismobile?((window.screen.height* window.screen.width)/(window.innerHeight*window.innerWidth)):1;
    renderer.setPixelRatio(window.devicePixelRatio * pixelRatioOffset);
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
}

function modelLoad() {  //模型設置
	objectbuild({
		type: 'house',
		position: [0,0,0],
		rotation: [0,0,0]
	});
	objectbuild({
		type: 'player',
		position: [0.767,0.048,-1.249],
		rotation: [0,0,0]
	});
	objectbuild({
		type: 'screen',
		position: [1.2,0.43,-0.8],
		rotation: [0,3.9,0]
	});
	objectbuild({
		type: 'ray_panel',
		position: [1.2,1.43,-0.8],
		rotation: [0,3.9,0]
	});
	game.objects[1].animations.idleAction();
}

function lightLoad(){  //燈光設置
	// 設置環境光 AmbientLight
	ambientLight1 = new THREE.AmbientLight(0x666666, 0.6)
	scene.add(ambientLight1)
	// 設置平行光 DirectionalLight
	directionalLight1 = new THREE.DirectionalLight(0x35227A, 0.2)
	directionalLight1.position.set(10, 10, -10)
	directionalLight1.castShadow = true
	scene.add(directionalLight1)
	// 設置平行光 DirectionalLight
	directionalLight2 = new THREE.DirectionalLight(0xF04000, 0.2)
	directionalLight2.position.set(0, 10, 10)
	directionalLight2.castShadow = true
	scene.add(directionalLight2)
	//設置玩家光
	playerlight = new THREE.PointLight(0xffffff, 0.6, 2);
	playerlight.position.copy( game.objects[1].Render.position );
	playerlight.castShadow = true;
	scene.add(playerlight);
}

window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize(){
	var pixelRatioOffset = ismobile?((window.screen.height* window.screen.width)/(window.innerHeight*window.innerWidth)):1;
    renderer.setPixelRatio(window.devicePixelRatio * pixelRatioOffset);
    renderer.setSize( window.innerWidth, window.innerHeight );
	camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

function animate() {
	setTimeout(animate, 1000 / webVue.setting.maxFPS);
	if (modelReady){
		var delta = clock.getDelta();
		game.objects[1].mixer.update(delta) //主玩家
		for (let [id ,player] of Object.entries(players)) {
			game.objects[player.modelId].mixer.update(delta) //主玩家
		}
	}
	game.objects[3].animationUpdate();
    renderer.render( scene, camera );
};

function pysicsUpdate() {
	setTimeout(pysicsUpdate, 33);
	playerUpdate();
	fkeyDisplay();
	playerlight.position.copy( game.objects[1].Render.position );
	playerlight.position.y += 1;
}

function multUpdate() {
	setTimeout(multUpdate, 50);
	try {
		updatePlayer();
	} catch (e) {
	}
	mineDataSend();
}

load();
