const gltf_loader = new THREE.GLTFLoader();
const fbx_loader = new THREE.FBXLoader();
var models = {
    house: null,
    player: null,
    screen: null,
    ray_panel: null,
    loadFinish : 0,
}
function modelsDataLoad(){
    gltf_loader.load( '/models/house.glb', function ( gltf ) {
        models.house = gltf;
        models.loadFinish += 1;
    },(xhr) => {
    }
    , function ( error ) {
        console.error( error );
    } );

    gltf_loader.load( '/models/screen.glb', function ( gltf ) {
        models.screen = gltf;
        models.loadFinish += 1;
    },(xhr) => {
    }
    , function ( error ) {
        console.error( error );
    } );

    gltf_loader.load( '/models/ray_panel.glb', function ( gltf ) {
        models.ray_panel = gltf;
        models.loadFinish += 1;
    },(xhr) => {
    }
    , function ( error ) {
        console.error( error );
    } );

    fbx_loader.load( '/models/player/player.fbx', function ( fbx ) {
        models.loadFinish += 1;
        fbx_loader.load('/models/player/idle.fbx', (anim) => {
            fbx.animations = anim.animations;
            models.loadFinish += 1;
            fbx_loader.load('/models/player/run.fbx', (anim) => {
                fbx.animations.push(anim.animations[1]);
                models.loadFinish += 1;
                fbx_loader.load('/models/player/jump.fbx', (anim) => {
                    fbx.animations.push(anim.animations[0]);
                    models.player = fbx;
                    models.loadFinish += 1;
                 },(xhr) => {

                 }, function ( error ) {
                     console.error( error );
                 });
             },(xhr) => {
             }, function ( error ) {
                 console.error( error );
             });
         },(xhr) => {
         }, function ( error ) {
             console.error( error );
         });
    },(xhr) => {}, function ( error ) {
        console.error( error );
    } );
}

var objectbuild = function(content) {
    switch (content.type){
        case 'house':
            var object = {};
            /*spiritRender*/
            object['Render'] = models.house.scene;
            scene.add( object['Render'] );
            models.house.scene.position.set(content.position[0], content.position[1], content.position[2]);
            models.house.scene.rotation.set(content.rotation[0], content.rotation[1], content.rotation[2]);
            /*Return*/
            game.add(object);
            return game.objectsindex - 1;
        case 'player':
            var object = {};
            /*spiritRender*/
            object['Render'] = THREE.SkeletonUtils.clone(models.player);
            object['Render'].animations = Object.assign([],models.player.animations);
            object['Render'].scale.multiplyScalar(0.002);    // 縮放模型大小
            object['Render'].traverse( function ( child ) {
                if ( child.isMesh ) {
                    const oldMat = child.material;

                    child.material = new THREE.MeshLambertMaterial( {
                       color: oldMat.color,
                       map: oldMat.map,
                       //etc
                    } );
                }
            } );
            scene.add( object['Render'] );
            object['Render'].position.set(content.position[0], content.position[1], content.position[2]);
            object['Render'].rotation.set(content.rotation[0], content.rotation[1], content.rotation[2]);

            object.mixer = new THREE.AnimationMixer(object['Render']);
            object.animations = {
                type : 0,
                idleAction : function(){
                    object.animations.type = 0;
                    object.mixer.clipAction(object['Render'].animations[0]).reset();
                    object.mixer.clipAction(object['Render'].animations[0]).fadeIn(0.1);
                    object.mixer.clipAction(object['Render'].animations[0]).play();
                    object.mixer.clipAction(object['Render'].animations[2]).fadeOut(0.1);
                    object.mixer.clipAction(object['Render'].animations[3]).fadeOut(0.1);
                },
                runAction : function(){
                    object.animations.type = 1;
                    object.mixer.clipAction(object['Render'].animations[0]).fadeOut(0.1);
                    object.mixer.clipAction(object['Render'].animations[2]).reset();
                    object.mixer.clipAction(object['Render'].animations[2]).fadeIn(0.1);
                    object.mixer.clipAction(object['Render'].animations[2]).play();
                    object.mixer.clipAction(object['Render'].animations[3]).fadeOut(0.1);
                },
                jumpAction : function(){
                    object.animations.type = 2;
                    object.mixer.clipAction(object['Render'].animations[0]).fadeOut(0.1);
                    object.mixer.clipAction(object['Render'].animations[2]).fadeOut(0.1);
                    object.mixer.clipAction(object['Render'].animations[3]).reset();
                    object.mixer.clipAction(object['Render'].animations[3]).fadeIn(0.1);
                    object.mixer.clipAction(object['Render'].animations[3]).play();
                }
            }
            /*Return*/
            game.add(object);
            return game.objectsindex - 1;
        case 'screen':
            var object = {};
            /*spiritRender*/
            object['Render'] = models.screen.scene;
            scene.add( object['Render'] );
            object['Render'].position.set(content.position[0], content.position[1], content.position[2]);
            object['Render'].rotation.set(content.rotation[0], content.rotation[1], content.rotation[2]);
            /*Return*/
            game.add(object);
            return game.objectsindex - 1;
        case 'ray_panel':
            var object = {};
            /*spiritRender*/
            object['Render'] = models.ray_panel.scene;
            scene.add( object['Render'] );
            object['Render'].position.set(content.position[0], content.position[1], content.position[2]);
            object['Render'].rotation.set(content.rotation[0], content.rotation[1], content.rotation[2]);

            /*光源*/
            let spotLight = new THREE.SpotLight(0xffffff,2,1,Math.PI * 0.15)
            spotLight.position.set(content.position[0] + 0.5, content.position[1] + 0.5, content.position[2] -0.1 )
            spotLight.castShadow = true
            scene.add(spotLight)

            object.y = content.position[1];
            /*animations*/
            object.animationUpdate = function(){
                this.Render.rotation.y += deltaTime;
                this.Render.position.y = this.y + Math.sin(clock.elapsedTime ) / 10;
            }
            /*Return*/
            game.add(object);
            return game.objectsindex - 1;
        default:
            console.log('build option is not supported');
    }
}
