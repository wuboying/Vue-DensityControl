// 全局提示计时器获取
export const errorInfo = {
		data() {
			return {
		
			}
		},
	mounted() {
		this.setTime(); //页面开始计时器
	this.getErrorInfo()
	},
		methods: {
			
			setTime() {
				//设置定时器
			
				this.clearTimeSet = setInterval(() => {
			this.getErrorInfo()
				}, 1000*15);
			},
			
			
			
			
			getErrorInfo() { //获取错误信息
				let url = this.$api.getErrorInfo;
				this.$http
					.get(url)
					.then(response => {
						console.log(response)
						
						if(response!=null&&response!=''){
							console.log(123123123)
			 // clearInterval(this.clearTimeSet)
							
						}
						
						
					})
					.catch(error => {});
			},	
					
			errorCallback(id){//回调
				let url = this.$api.errorCallback;
								this.$http
									.get(url+id)
									.then(response => {
										console.log(response)
									})
									.catch(error => {});
			}		
					
		}


	}
