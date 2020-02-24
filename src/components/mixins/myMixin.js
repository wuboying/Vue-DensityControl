// 6条数据计时器获取--
export const myMixin = {
		data() {
			return {
				shuntRightData: '', //分流
				moisturizingRightData: '', //补水
				instantRightData: '', //瞬时
				detectionRightData: '', //检测
				setRightData: '', //设定
				atRightData: '', //当前
			}
		},
		mounted() {
			setInterval(() => {
				this.shuntRight()
				this.moisturizingRight()
				this.densityRight()
				this.ashRight()
			}, 1000);
		},
		methods: {
			ashRight() { //灰分
				let url = this.$api.ashRight;
				this.$http
					.get(url)
					.then(response => {
						if(response.ash=="0.0"){
							response.ash="--"
						}
						if(response.jcAsh=="0.0"){
							response.jcAsh="--"
						}
						this.instantRightData = response.ash //瞬时
						this.detectionRightData = response.jcAsh //检测
					})
					.catch(error => {});
			},
			densityRight() { //密度
				let url = this.$api.densityRight;
				this.$http
					.get(url)
					.then(response => {
						if (response.current_Density == -100) {
							response.current_Density = "未检测"
							}
							if (response.set_Density == -100) {
								response.set_Density = "未检测"
								}
						this.setRightData = response.current_Density //设定
						this.atRightData = response.set_Density //当前
					})
					.catch(error => {});
			},
			moisturizingRight() { //补水
				let url = this.$api.moisturizingRight;
				this.$http
					.get(url)
					.then(response => {
						if (response == -100) {
							response = "未检测"
							}
						this.moisturizingRightData = response
					})
					.catch(error => {});
			},
			shuntRight() { //分流
				let url = this.$api.shuntRight;
				this.$http
					.get(url)
					.then(response => {
						if (response == -100) {
							response = "未检测"
							}
						this.shuntRightData = response
					})
					.catch(error => {});
			},
		}


	}
