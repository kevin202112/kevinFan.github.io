
var input = {
    moveForward : false,
	moveLeft : false,
	moveBackward : false,
	moveRight : false,
	canJump : false
};

var ismobile = false;
const onKeyDown = function(event) {
  switch (event.keyCode) {
    case 38: // up
    case 87: // w
      input.moveForward = true
      break
    case 37: // left
    case 65: // a
      input.moveLeft = true
      break
    case 40: // down
    case 83: // s
      input.moveBackward = true
      break
    case 39: // right
    case 68: // d
      input.moveRight = true
      break
    case 32: // space
	  if (input.canJump === true) game.objects[1].velocity[1] += 2 // 跳躍高度
	  input.canJump = false
	  break
	case 70: // f
  	  activate();
	  break
  }
}
const onKeyUp = function(event) {
  switch (event.keyCode) {
    case 38: // up
    case 87: // w
      input.moveForward = false
      break
    case 37: // left
    case 65: // a
      input.moveLeft = false
      break
    case 40: // down
    case 83: // s
      input.moveBackward = false
      break
    case 39: // right
    case 68: // d
      input.moveRight = false
      break
  }
}
document.addEventListener('keydown', onKeyDown, false)
document.addEventListener('keyup', onKeyUp, false)


var Joy;
function joyStickControl() {
    if(Joy.GetX() > 30){
        input.moveRight = true;
        input.moveLeft = false;
    }else if(Joy.GetX() < -30){
        input.moveRight = false;
        input.moveLeft = true;
    }else{
        input.moveLeft = false;
        input.moveRight = false;
    }

    if(Joy.GetY() > 30){
        input.moveForward = true
        input.moveBackward = false
    }else if(Joy.GetY() < -30){
        input.moveForward = false
        input.moveBackward = true
    }else{
        input.moveForward = false
        input.moveBackward = false
    }

    setTimeout(joyStickControl, 50);
}

function detectmob() {
 if( navigator.userAgent.match(/Android/i)
 || navigator.userAgent.match(/webOS/i)
 || navigator.userAgent.match(/iPhone/i)
 || navigator.userAgent.match(/iPad/i)
 || navigator.userAgent.match(/iPod/i)
 || navigator.userAgent.match(/BlackBerry/i)
 || navigator.userAgent.match(/Windows Phone/i)
 ){
     document.getElementById('joystick').innerHTML = "<div id='joyDiv'></div>";
     Joy = new JoyStick('joyDiv')
     joyStickControl();
     ismobile = true;
  }
}

detectmob();

function fkeyDisplay(){
	var position = game.objects[1].Render.position;
    var distance;
    /*f1*/
    distance = getDistance3D(position.x, position.y, position.z, 0.767, 0.048, -1.249);
    if(distance < 0.8){
        fkeyVue.$set(fkeyVue.show, 'f1active', true);
        return;
    }else{
        fkeyVue.$set(fkeyVue.show, 'f1active', false);
    }
    /*f2*/
    distance = getDistance3D(position.x, position.y, position.z, -1.566, 0.0433, 0.0176);
    if(distance < 0.8){
        fkeyVue.$set(fkeyVue.show, 'f2active', true);
        return;
    }else{
        fkeyVue.$set(fkeyVue.show, 'f2active', false);
    }
    /*f3*/
    distance = getDistance3D(position.x, position.y, position.z, 3.433, -1.252, -0.916);
    if(distance < 0.8){
        fkeyVue.$set(fkeyVue.show, 'f3active', true);
        return;
    }else{
        fkeyVue.$set(fkeyVue.show, 'f3active', false);
    }
}

function activate(){
	var position = game.objects[1].Render.position;
    var distance;
    /*開啟主葉面*/
    distance = getDistance3D(position.x, position.y, position.z, 0.767, 0.048, -1.249);
    if(distance < 0.8){
        webVue.$set(webVue.show, 'active', true);
        webVue.$set(webVue.show, 'active', true);
        webVue.$set(webVue.show, 'panel', 0);
    }

    /*開啟作品集*/
    distance = getDistance3D(position.x, position.y, position.z, -1.566, 0.0433, 0.0176);
    if(distance < 0.8){
        webVue.$set(webVue.show, 'active', true);
        webVue.$set(webVue.show, 'panel', 1);
    }

    /*開啟聯絡資訊*/
    distance = getDistance3D(position.x, position.y, position.z, 3.433, -1.252, -0.916);
    if(distance < 0.8){
        webVue.$set(webVue.show, 'active', true);
        webVue.$set(webVue.show, 'panel', 2);
    }
}
