var players = {};

function newPlayer(playerdata){
	var socketid = playerdata.socketid;
	players[socketid] = playerdata;
	players[socketid].removeTime = 0;
	players[socketid].modelId = objectbuild({
		type: 'player',
		position: [0.767,0.048,-1.249],
		rotation: [0,0,0]
	});
	game.objects[players[socketid].modelId].animations.idleAction();
}

function recivePlayerData(playerdata){
	var socketid = playerdata.socketid;
	if(mySocketId == "") return;
	if(socketid != mySocketId){
		if(!players[socketid]){
			 newPlayer(playerdata);
		}else{
			players[socketid].position = playerdata.position;
			players[socketid].rotation = playerdata.rotation;
			players[socketid].animation = playerdata.animation;

			players[socketid].socketid = playerdata.socketid;
			players[socketid].removetime = 0;
		}
	}
}

function updatePlayer(){
	for (let [id ,player] of Object.entries(players)) {
		/*位置更新*/
		game.objects[player.modelId].Render.position.x = player.position.x;
		game.objects[player.modelId].Render.position.y = player.position.y;
		game.objects[player.modelId].Render.position.z = player.position.z;
		game.objects[player.modelId].Render.rotation.y = player.rotation;
		/*動畫更新*/
		if(game.objects[player.modelId].animations.type != player.animation){
			switch (player.animation) {
				case 0:
					game.objects[player.modelId].animations.idleAction();
					break;
				case 1:
					game.objects[player.modelId].animations.runAction();
					break;
				case 2:
					game.objects[player.modelId].animations.jumpAction();
					break;
				default:
			}
		}
		/*自動消滅*/
		player.removetime += 1;
		if(player.removetime > 150){
			scene.remove( game.objects[player.modelId].Render );
			delete players[id];
		}
	}
}

function mineDataSend(){
	socket.emit("playerDataReceived",{
		position:{
			x: game.objects[1].Render.position.x,
			y: game.objects[1].Render.position.y,
			z: game.objects[1].Render.position.z,
		},
		rotation: game.objects[1].Render.rotation.y,
		animation: game.objects[1].animations.type
	});
}
