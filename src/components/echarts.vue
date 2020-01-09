<!-- echarts组件 -->

<template>
	<div ref="st" :style="{ width: '955px', height: '293px', float:'left' }"><!-- {{data}} --></div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	name: 'echarts',
	props: ['unit', 'data', 'mark', 'xFixe'],
	// computed: {
	//  ...mapGetters(['getAshData','getDensityData','getValveData']),
	//  data () {
	//   let arr = []
	//   if(this.mark == 'echarts1'){
	// 	  arr = this.getAshData
	//   }else if(this.mark == 'echarts2'){
	// 	  arr = this.getDensityData
	//   }else if(this.mark == 'echarts3'){
	// 	  arr = this.getValveData
	//   }
	//   return arr
	//  }
	// },
	mounted() {
		this.$nextTick(() => {
			var ref = this.$refs.st;
			this.drawLine(ref.id, this.data, this.unit, this.xFixe);
		});
	},
	watch: {
		data: {
			handler(newValue, oldValue) {
				var ref = this.$refs.st;
				this.drawLine(ref.id, newValue, this.unit, this.xFixe);
			},
			deep: true
		}
	},

	methods: {
		drawLine(ID, data, unit, xFixe) {
			let myChart = this.$echarts.init(document.getElementById(ID));
			var option = {
				title: [
					{
						top: '1%',
						left: '3%',
						y: 'top',
						text: data.tagName,
						// textAlign: 'center',
						textStyle: {
							color: '#262626',
							fontSize: 18
						},
						subtext: unit,
						subtextStyle: {
							color: '#808080',
							fontSize: 14
						}
					}
				],

				tooltip: {
					trigger: 'axis',
					triggerOn: 'mousemove',
					position: function(point, params, dom, rect, size) {
						//其中point为当前鼠标的位置，size中有两个属性：viewSize和contentSize，分别为外层div和tooltip提示框的大小
						var x = point[0]; //
						var y = point[1];
						var viewWidth = size.viewSize[0];
						var viewHeight = size.viewSize[1];
						var boxWidth = size.contentSize[0];
						var boxHeight = size.contentSize[1];
						var posX = 0; //x坐标位置
						var posY = 0; //y坐标位置

						if (x < boxWidth) {
							//左边放不开
							posX = 5;
						} else {
							//左边放的下
							posX = x - boxWidth;
						}

						if (y < boxHeight) {
							//上边放不开
							posY = 5;
						} else {
							//上边放得下
							posY = y - boxHeight;
						}
						return [posX, posY];
					}
				},

				legend: {
					icon: 'circle',
					itemHeight: 8,
					itemWidth: 8, // 设置宽度
					top: '8%',
					right: '3%',
					itemGap: 20,
					data: [
						{
							name: data.smallName1,
							textStyle: {
								color: '#808080',
								fontSize: 12
							}
						},
						{
							name: data.smallName2,
							textStyle: {
								color: '#808080',
								fontSize: 12
							}
						}
					]
				},

				grid: {
					left: '6%',
					right: '6%',
					bottom: '10%',
					top: '25%',
					containLabel: false
				},
				xAxis: {
					type: 'category',
					boundaryGap: false,
					axisTick: {
						//向上
						inside: true
					},
					axisLine: {
						lineStyle: {
							color: '#808080', // 颜色
							width: 0.5 // 粗细
						},
						onZero: false
					},
					axisLabel: {
						textStyle: {
							color: '#808080', // 颜色
							fontSize: 14
						},
						interval: 9,
						rotate: 0
					},
					data: data.dateList
				},
				yAxis: {
					max: data.maxValue,
					min: data.minValue,
					// interval: interval,
					splitNumber: 6,
					boundaryGap: [0, 0], // 数值起始和结束两端空白策略
					type: 'value',
					axisLine: {
						lineStyle: {
							color: '#8a8b8c', // 颜色
							width: 0.5 // 粗细
						}
					},
					axisLabel: {
						formatter: function(value, index) {
							return value.toFixed(xFixe);
						},
						textStyle: {
							fontSize: 14,
							color: '#808080'
						},
						interval: 0
					},
					splitLine: {
						show: false
					}
				},
				series: [
					{
						name: data.smallName1,
						symbolSize: 5, //拐点大小
						symbol: 'none',
						//smooth: true, //曲线
						type: 'line',
						showAllSymbol: true,
						itemStyle: {
							normal: {
								color: '#17D071',
								lineStyle: {
									color: '#17D071',

									width: 2
								}
							}
						},
						areaStyle: {
							normal: {
								color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
									{
										offset: 0,
										color: 'rgba(23, 208, 113, 0.5)'
									},
									{
										offset: 1,
										color: 'rgba(23, 208, 113, 0)'
									}
								])
							}
						},
						data: data.curve1
					},

					{
						name: data.smallName2,
						symbolSize: 5, //拐点大小
						//smooth: true, //曲线
						type: 'line',
						symbol: 'none', //显示拐点样式
						showAllSymbol: true,
						itemStyle: {
							normal: {
								color: '#2C9AE6',
								lineStyle: {
									color: '#2C9AE6',
									width: 2
								}
							}
						},
						areaStyle: {
							normal: {
								color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
									{
										offset: 0,
										color: 'rgba(44, 154, 230, 0.5)'
									},
									{
										offset: 1,
										color: 'rgba(44, 154, 230, 0)'
									}
								])
							}
						},
						data: data.curve2
					}
				]
			};
			// myChart.clear();
			if (option && typeof option === 'object') {
				myChart.setOption(option, true);
			}
		}
	}
};
</script>
<style></style>
