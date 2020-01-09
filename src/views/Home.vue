<template>
	<div class="home">
		<div id="header">
			<img class="pm" src="../assets/img/leftLogo.png" alt="" />
			<div class="logo">
				<img src="../assets/img/rightLogo.png" alt="" />
				<span>管理员</span>
			</div>
		</div>
		<div id="content">
			<div class="left">
				<div class="top">
					<div class="titleBar">
						<span>密度调整</span>
						<p @click="densityMot"><a-icon type="ellipsis" /></p>
					</div>
					<div class="tableFormat"><density-adjustment ref="densityMot"></density-adjustment></div>
				</div>
				<div class="bottom">
					<div class="titleBar">
						<span>报警信息</span>
						<p @click="alarmMes"><a-icon type="ellipsis" /></p>
					</div>
					<div class="tableFormat"><alarm-info ref="alarmMes"></alarm-info></div>
				</div>
			</div>
			<div class="center">
				<div :class="el.classa" :key="index" v-for="(el,index) in bight">
					<echarts v-if="el.mun!=1" :data="escWay(el.data)" :mark="el.mark" :id="el.id" :unit="el.unit" :xFixe="el.xFixe"></echarts>
					<echarts-ash v-else :data="escWay(el.data)" :mark="el.mark" :id="el.id" :unit="el.unit" :xFixe="el.xFixe"> </echarts-ash>
					<div class="curve">
						<p class="dian" @click="curveMoreData(el.mun)"><a-icon type="ellipsis" /></p>
						<div class="right-data">
							<ul>
								<li class="up">
									<p>{{el.upP}}</p>
									<span class="up-one">{{escWay(el.upData)}}</span><span class="up-two">{{el.upUnit}}</span>
								</li>
								<li class="down">
									<p>{{el.downP}}</p>
									<span class="down-one">{{escWay(el.downData)}}</span><span class="down-two">{{el.downUnit}}</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
			<div class="right">
				<div class="top"><device-state></device-state></div>

				<div class="bottom">
					<div class="titleBar">
						<span>参数设置</span>
						<p @click="parameterWay"><a-icon type="ellipsis" /></p>
					</div>
					<div class="tableFormat"><parameter-setting ref="parameterSetting"></parameter-setting></div>
				</div>
			</div>
		</div>

		<curve-more ref="curveMore"></curve-more>
		<div id="footer"><p>天津美腾科技有限公司 Tianjin Meiteng Technology Co.,ltd</p></div>
	</div>
</template>

<script>
import alarmInfo from '../components/alarmInfo.vue';
import densityAdjustment from '../components/densityAdjustment.vue';
import parameterSetting from '../components/parameterSetting.vue';
import deviceState from '../components/deviceState.vue';
import echarts from '../components/echarts.vue';
import echartsAsh from '../components/echartsAsh.vue';
import curveMore from '../components/curveMore.vue';
import { myMixin } from '../components/mixins/myMixin.js';
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import {BIGHT } from '../assets/js/bight.js'
export default {
	components: { alarmInfo, densityAdjustment, parameterSetting, deviceState, echarts, curveMore ,echartsAsh},
	name: 'home',
	mixins: [myMixin],
	data() {
		return {
			ashData: '',
			densityData: '',
			valveData: '',
			title: '',
			url: '',
			two: '',
			three: '',
			ipa: '',
			bight:BIGHT
		};
	},
	created() {
		this.ashEcharts();
		this.densityEcharts();
		this.valveEcharts();
	},
	mounted() {
		setInterval(() => {
			this.ashEcharts();
			this.densityEcharts();
			this.valveEcharts();
		}, 1000 * 60);
		
	},
	computed: {
		...mapGetters(['getAshData', 'getDensityData', 'getValveData'])
	},

	methods: {
		escWay(value){//变量转义
			return this[value]
		},
		parameterWay(){
		this.$refs.parameterSetting.onToggle()
		},
		curveMoreData(id) {//曲线更多
			this.$refs.curveMore.modelData(id);
		},

		// ...mapActions(['setAshDataWeb','setDensityDataWeb','setvalveDataWeb']),
		densityMot() {
			//密度调整更多
			this.$refs.densityMot.modelData();
		},
		alarmMes() {
			//报警信息更多
			this.$refs.alarmMes.modelData();
		},
		ashEcharts() {
			//灰分
			let url = this.$api.ashEcharts;
			this.$http
				.post(url)
				.then(response => {
					this.funData(response);
					this.ashData = response;
					this.$store.dispatch('setAshDataWeb', response);
				})
				.catch(error => {});
		},
		densityEcharts() {
			//密度
			let url = this.$api.densityEcharts;
			this.$http
				.post(url)
				.then(response => {
					this.funData(response);
					this.densityData = response;
					this.$store.dispatch('setDensityDataWeb', response);
				})
				.catch(error => {});
		},
		valveEcharts() {
			//阀门
			let url = this.$api.valveEcharts;
			this.$http
				.post(url)
				.then(response => {
					this.funData(response);
					this.valveData = response;
					this.$store.dispatch('setvalveDataWeb', response);
				})
				.catch(error => {});
		},
		funData(response) {//重新组装曲线数据
			let attr = [];
			for (let i = 0; i < response.curve1.length; i++) {
				let arr = [];
				arr.push(String(response.curve1[i].time));
				// if(response.curve1[i]["v"]==0){
				// 	response.curve1[i]["v"]=''
				// }
				arr.push(response.curve1[i].v);
				attr.push(arr);
			}
			response.curve1 = attr;
			let attrs = [];
			for (let j = 0; j < response.curve2.length; j++) {
				let arrs = [];
				arrs.push(String(response.curve2[j].time));
				// if(response.curves2[j]["v"]==0){
				// 	response.curves2[j]["v"]=''
				// }
				arrs.push(response.curve2[j].v);
				attrs.push(arrs);
			}
			response.curve2 = attrs;
			return response;
		}
	}
};
</script>
<style lang="scss" scoped>
@import '../assets/css/conter.scss';
</style>
