// 灰分提示计时器获取
export const huifenInfo = {
		data() {
			return {
		
			}
		},
	mounted() {
		this.huifenTime(); //页面开始计时器
	this.getHuifenInfo()
	},
		methods: {
			
			huifenTime() {
				//设置定时器
			
				this.stopTimeSet = setInterval(() => {
			this.getHuifenInfo()
				}, 1000*60);
			},
			
			
			
			
			getHuifenInfo() { //获取错误信息
				let url = this.$api.getHuifenInfo;
				this.$http
					.get(url)
					.then(response => {
						console.log(response)
						if(response!=null&&response!=''){
			 clearInterval(this.stopTimeSet)
							
						}
						
						
					})
					.catch(error => {});
			},	
					
			huifenCallback(id){//回调
				let url = this.$api.huifenCallback;
								this.$http
									.get(url+id)
									.then(response => {
										console.log(response)
									})
									.catch(error => {});
			}		
					
		}


	}
