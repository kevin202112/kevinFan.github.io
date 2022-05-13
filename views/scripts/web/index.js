Vue.component('project-template', {
	template: `
	<div class="project-content">
		<h3>{{type}}</h3>
		<h2>{{title}}</h2>
		<img :src="img"></img>
		<p v-html="content">
		</p>
		<div v-html="btn"></div>
	</div>`,
  	props: ['type', 'title', 'content', 'img', 'btn']
});

var project = {
	empty:{
		title:"",
		content:"",
		img:"/img/transparent.png",
		btn:"<div></div>",
		type:""
	},
	articles:[
		{
			title:"個人網站",
			content:"基於Vue.JS與Three.js打造的網站<br>一款基於3D操控設計的沉浸式網站",
			img:"/img/web0.png",
			btn:"<a href='#'>你已在網站中</a>",
			type:"全端 網頁"
		},
		{
			title:"論壇網站",
			content:"基於Vue.JS與SocketIO打造的論壇網站",
			img:"/img/web1.png",
			btn:"<a href='https://coolweb.ray0725.repl.co/'>前往</a>",
			type:"全端 網頁"
		},
		{
			title:"即時多人2D網頁遊戲",
			content:"多人即時對戰類型的網頁遊戲<br>基於Canvas和SocketIO開發",
			img:"/img/web2.png",
			btn:"<a href='https://dreewar.ray0725.repl.co/'>前往</a>",
			type:"全端 網頁"
		},
		{
			title:"WEEDUBY",
			content:"替工作室的Vtuber開發的網頁小遊戲<br>基於Canvas和SocketIO開發",
			img:"/img/web3.png",
			btn:"<a v-html='https://weeduby.dreamcity.studio/'>前往</a>",
			type:"全端 網頁"
		},
		{
			title:"上架手遊 蘑法冒險",
			content:"以Unity開發的卷軸冒險遊戲<br>上架於Google Play",
			img:"/img/web4.png",
			btn:"<a href='https://play.google.com/store/apps/details?id=com.Ray.AdvantureMushgic'>前往</a>",
			type:"手機遊戲 Unity"
		},
		{
			title:"繪畫作品 月狼",
			content:"一批僅出現在月夜中的狼",
			img:"/img/web5.jpg",
			btn:"<a href='/img/web5.png'>前往</a>",
			type:"繪畫"
		}
	],
	get: function(index){
		if(index > this.articles.length-1){
			return this.empty;
		}else if(index < 0){
			return this.empty;
		}else{
			return this.articles[index];
		}
	},
	search: function(value){
		for(var i = 0; i < this.articles.length; i ++){
			if(this.articles[i].type.includes(value)){
				return i;
			}
			if(this.articles[i].title.includes(value)){
				return i;
			}
		}
		return 9999;
	}
}

var webVue = new Vue({
	el: '#web',
	data: {
		show:{
			active: false,
			loading: true,
			panel: 0
		},
		project:{
			left:project.get(0),
			right:project.get(1),
			anim:project.get(0),
			index: 0,
			searchIndex: 0,
			max: project.articles.length,
			flipanimation: ''
		},
        setting:{
            controlTeachPanel: true,
            FPSDisplay: true,
            maxFPS: 30,
            cameraDistance: 2.2,
            resolution: 1080
        }
	},
	methods: {
        settingDown: function(){
            var radio = this.setting.resolution / 1080;
            renderer.setPixelRatio( window.devicePixelRatio * radio);
        },
		flipNext: function(){
			if(this.project.index <= project.articles.length-1 && this.project.flipanimation == ''){
				this.project.index += 2;
				this.$set(this.project, 'left', project.get(this.project.index-2));
				this.$set(this.project, 'right', project.get(this.project.index+1));
				this.$set(this.project, 'anim', project.get(this.project.index-1));
				this.$set(this.project, 'flipanimation', "flipingnext");
				setTimeout(function(){
					webVue.$set(webVue.project, 'anim', project.get(webVue.project.index));
				},100);
				setTimeout(function(){
					webVue.$set(webVue.project, 'left', project.get(webVue.project.index));
				},200);
			}
		},
		flipBack: function(){
			if(this.project.index >= 2 && this.project.flipanimation == ''){
				this.project.index -= 2;
				this.$set(this.project, 'left', project.get(this.project.index));
				this.$set(this.project, 'right', project.get(this.project.index+3));
				this.$set(this.project, 'anim', project.get(this.project.index+2));
				this.$set(this.project, 'flipanimation', "flipingback");
				setTimeout(function(){
					webVue.$set(webVue.project, 'anim', project.get(webVue.project.index+1));
				},100);
				setTimeout(function(){
					webVue.$set(webVue.project, 'right', project.get(webVue.project.index+1));
				},200);
			}
		},
		flipTo: function(){
			//頁碼搜尋
            if(this.project.searchIndex == null || this.project.searchIndex == ''){
                this.project.index = 9999;
            }else if(!isNaN(this.project.searchIndex)){
                if(parseInt(this.project.searchIndex) > 0){
                    this.project.index = parseInt(this.project.searchIndex)-1;
                }else{
                    this.project.index = project.search(this.project.searchIndex);
                }
			}else{//關鍵字搜尋
				this.project.index = project.search(this.project.searchIndex);
			}

			if(this.project.flipanimation == ''){
				this.$set(this.project, 'left', project.get(this.project.index));
				this.$set(this.project, 'right', project.get(this.project.index+3));
				this.$set(this.project, 'anim', project.get(this.project.index+2));
				this.$set(this.project, 'flipanimation', "flipingback");
				setTimeout(function(){
					webVue.$set(webVue.project, 'anim', project.get(webVue.project.index+1));
				},100);
				setTimeout(function(){
					webVue.$set(webVue.project, 'right', project.get(webVue.project.index+1));
				},200);
			}
		}

	}
})

var fkeyVue = new Vue({
	el: '#fkey',
	data: {
		show:{
			f1active: true,
            f2active: false,
            f3active: false,
		}
	},
	methods: {

	}
})
