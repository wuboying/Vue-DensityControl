<!-- 设备状态 -->

<template>
	<div class="device-state">
		<div class="top">
			<ul>
				<li v-for="el in titleUl" :key="el.id" :class="[el.id == identification ? 'activeLi' : '']" @click="setCurrentStatus(el.id)">{{ el.name }}</li>
			</ul>
		</div>
		<div class="min">
			<div class="titleBar"><span>设备状态</span></div>
			<div class="equipment-details">
				<a-form id="stateFrom" :form="form" layout="horizontal">
					<a-form-item :required="false" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }" label="设定密度">
						<a-input
							style="width: 85px; float: left;"
							@pressEnter="carriageReturn(12, equipmentData.setDensity, equipmentData.setDensity)"
							:disabled="identification == 3 ? false : true"
							:class="[identification != 3 ? 'ipt-active' : '']"
							type="text"
							v-decorator="['desc', { initialValue: equipmentData.setDensity, rules: [{ required: true, message: '请输入设定密度' }, { validator: validatorCustom }] }]"
						/>
						<span>g/cm³</span>
					</a-form-item>
					<a-form-item :required="false" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" label=" 分流阀开度">
						<span>{{ equipmentData.spliteFlowUp }}</span>
						<span class="span">%</span>
						<span v-if="identification != 1" class="span">→</span>
						<a-input
							v-if="identification != 1"
							:disabled="identification == 2 ? false : true"
							@pressEnter="carriageReturn(56, equipmentData.spliteFlowUp, equipmentData.spliteFlowDown)"
							style="width: 85px; float: left;"
							type="text"
							:class="[identification != 2 ? 'ipt-active' : '']"
							v-decorator="['ddd', { initialValue: equipmentData.spliteFlowDown, rules: [{ required: true, message: '请输入分流阀开度' }, { validator: openingDegree }] }]"
						/>
						<span v-if="identification != 1">%</span>
					</a-form-item>
					<a-form-item :required="false" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" label=" 补水阀开度">
						<span>{{ equipmentData.makeUpUp }}</span>
						<span class="span">%</span>
						<span class="span" v-if="identification != 1">→</span>
						<a-input
							v-if="identification != 1"
							:disabled="identification == 2 ? false : true"
							style="width: 85px; float: left;"
							@pressEnter="carriageReturn(45, equipmentData.makeUpUp, equipmentData.makeUpDown)"
							type="text"
							:class="[identification != 2 ? 'ipt-active' : '']"
							v-decorator="['www', { initialValue: equipmentData.makeUpDown, rules: [{ required: true, message: '请输入补水阀开度' }, { validator: openingDegree }] }]"
						/>
						<span v-if="identification != 1">%</span>
					</a-form-item>
					<a-form-item :required="false" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" label=" 补水阀流量">
						<span>{{ equipmentData.flow }}</span>
						<span>m³/L</span>
					</a-form-item>
					<a-form-item :required="false" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" label=" 磁性物含量">
						<span>{{ equipmentData.magneticMateria }}</span>
						<span>g/L</span>
					</a-form-item>
					<a-form-item :required="false" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" label=" 煤泥含量">
						<span>{{ equipmentData.coalBlending }}</span>
						<span>%</span>
					</a-form-item>
					<a-form-item :required="false" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" label=" 合介桶液位">
						<span>{{ equipmentData.liquidLevelUp }}</span>
						<span class="span">M</span>
						<span class="span" style="margin-right: 6px;">/</span>
						<span>{{ equipmentData.liquidLevelDown }}</span>
						<span>%</span>
					</a-form-item>
					<a-form-item :required="false" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" label=" 重介旋流器压力">
						<span>{{ equipmentData.theHeavy }}</span>
						<span>kPa</span>
					</a-form-item>
					<a-form-item :required="false" :label-col="{ span: 8 }" :wrapper-col="{ span: 6 }" label="  化验灰分填报">
						<a-button @click="onClickOpen" type="primary" class="btn-tb">填报</a-button>
					</a-form-item>
					<a-form-item v-if="identification == 4" :required="false" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }" label="  密控模式">
						<a-button v-for="el in blickBtn" :key="el.id" :class="['sliding-btn', btnID == el.id ? 'btn-active' : '']" @click="setPattern(el.id)">
							{{ el.name }}
						</a-button>
					</a-form-item>
				</a-form>
			</div>
		</div>
		<a-modal centered okText="提交" cancelText="取消" :maskClosable="false" v-model="visible" @ok="handleOk">
			<div slot="title"><span style="font-size: 20px;font-weight: 600;">化验灰分填报</span></div>
			<a-form :form="formModel" layout="horizontal">
				<a-form-item label="采样时间:" :label-col="{ span: 7 }" :wrapper-col="{ span: 14 }">
					<a-date-picker
						:showTime="{ format: 'HH:mm:ss' }"
						format="YYYY-MM-DD HH:mm:ss"
						v-decorator="['incinerationTime', { rules: [{ required: true, message: '请选择时间' }] }]"
						placeholder="请选择时间"
						style="width: 100%;"
					/>
				</a-form-item>

				<a-form-item :label-col="{ span: 7 }" :wrapper-col="{ span: 14 }" label="化验灰分">
					<a-input type="text" placeholder="请输入化验灰分" v-decorator="['incinerationValue', { rules: [{ required: true, message: '请输入化验灰分' }] }]" />
				</a-form-item>
			</a-form>
		</a-modal>
	</div>
</template>

<script>
import util from '../utils/util.js';
const TITLE_UL = [
	{
		id: 1,
		name: '采集'
	},
	{
		id: 2,
		name: '手动'
	},
	{
		id: 3,
		name: '自动'
	},
	{
		id: 4,
		name: '智能'
	}
];
const BTN = [{ id: 0, name: '化验' }, { id: 1, name: '检测' }];
export default {
	name: 'alarmInfo',
	data() {
		return {
			online:'',//上限
			offline:'',//下限
			titleUl: TITLE_UL,
			blickBtn: BTN,
			identification: '', //当前状态id
			btnID: null, //当前密控模式
			form: this.$form.createForm(this),
			formModel: this.$form.createForm(this),
			equipmentData: {
				setDensity: '', //设定密度
				spliteFlowUp: '', //分流阀开度上
				spliteFlowDown: '', //分流阀开度下
				makeUpUp: '', //补水阀开度上
				makeUpDown: '', //补水阀开度下
				flow: '--', //补水阀流量
				magneticMateria: '', //磁性物含量
				coalBlending: '', // 配煤含量
				liquidLevelUp: '', //合介桶液位上
				liquidLevelDown: '', //合介桶液位下
				theHeavy: '' // 重介旋流器压力
			},
			visible: false // model显示隐藏
		};
	},
	created() {
		this.getCurrentStatus();
		this.ifData();
		this.getPattern();
		this.getSection()
	},
	mounted() {
		// setInterval(this.getPattern, 1000);
		setInterval(() => {
			this.getCurrentStatus();
			this.getStatusData();
			this.getSection();
			if (this.identification == 4) {
				this.getPattern();
			}
		}, 1000);
	},
	methods: {
		
		getSection() {
			//获取设定密度区间
			let url = this.$api.sectionValue;
			this.$http
				.get(url)
				.then(response => {
				this.online = response.密度上限
				this.offline = response.密度下限
				})
				.catch(error => {});
		},
		
		
		
		
		carriageReturn(ida, befor, after) {
			//回车
			// this.form.validateFields((err, values) => {
			// 	console.log(values);
			// });
			let url = this.$api.setFacility;
			this.$http
				.post(url, {
					runningMode: this.identification,
					desc: ida,
					beforValue: parseFloat(befor),
					afterValue: parseFloat(after)
				})
				.then(response => {
					if (response.code == 0) {
						this.$message.success('操作成功');
						return;
					}
					this.$message.error('操作失败');
				})
				.catch(error => {
					this.$message.error('操作失败');
				});
		},

		abc() {
			util.$emit('gain');
		},

		getCurrentStatus() {
			//获取当前状态id
			let url = this.$api.currentStatus;
			this.$http
				.get(url)
				.then(response => {
					if (response.code == 0) {
						if (response.result != this.identification) {
							this.form.resetFields(); // model重置
							this.identification = response.result;
							this.ifData();
						}
					}
				})
				.catch(error => {});
		},
		setCurrentStatus(id) {
						this.form.resetFields(); // model重置
			this.identification = id;
			let url = this.$api.setCurrentStatus;
			this.$http
				.get(url + id)
				.then(response => {
					if (response.code == 0) {
						this.ifData();
					}
				})
				.catch(error => {});
		},

		getStatusData() {
			//获取当前设备下的数据
			let url = this.$api.getStatusData;
			this.$http
				.post(url, {
					programRunningMode: this.identification
				})
				.then(response => {
					if (response.code == 0) {
						let deviceDatas = response.message.deviceDatas;
						for (let i = 0; i < deviceDatas.length; i++) {
							switch (deviceDatas[i].id) {
								case 17:
									this.equipmentData.liquidLevelUp = deviceDatas[i].value;
									break;
								case 56:
									this.equipmentData.spliteFlowUp = deviceDatas[i].value;
									break;
								case 45:
									this.equipmentData.makeUpUp = deviceDatas[i].value;
									break;
								case 2:
									this.equipmentData.theHeavy = deviceDatas[i].value;
									break;
								case 47:
									this.equipmentData.magneticMateria = deviceDatas[i].value;
									break;
								case 12:
									if (this.identification != 3) {
										this.equipmentData.setDensity = deviceDatas[i].value;
									}
									break;
								case 89:
									this.equipmentData.coalBlending = deviceDatas[i].value;
									break;
								case 98:
									this.equipmentData.liquidLevelDown = deviceDatas[i].value;
									break;
							}
						}

						if (this.identification != 2) {
							this.equipmentData.spliteFlowDown = response.message.deviceSetData.shutValve;
							this.equipmentData.makeUpDown = response.message.deviceSetData.supplementaryValve;
						}
					}
				})
				.catch(error => {});
		},

		ifData() {
			//计时器判断用数据
			let url = this.$api.getStatusData;
			this.$http
				.post(url, {
					programRunningMode: this.identification
				})
				.then(response => {
					if (response.code == 0) {
						let deviceDatas = response.message.deviceDatas;
						for (let i = 0; i < deviceDatas.length; i++) {
							switch (deviceDatas[i].id) {
								case 17:
									this.equipmentData.liquidLevelUp = deviceDatas[i].value;
									break;
								case 56:
									this.equipmentData.spliteFlowUp = deviceDatas[i].value;
									break;
								case 45:
									this.equipmentData.makeUpUp = deviceDatas[i].value;
									break;
								case 2:
									this.equipmentData.theHeavy = deviceDatas[i].value;
									break;
								case 47:
									this.equipmentData.magneticMateria = deviceDatas[i].value;
									break;
								case 12:
									this.equipmentData.setDensity = deviceDatas[i].value;
									break;
								case 89:
									this.equipmentData.coalBlending = deviceDatas[i].value;
									break;
								case 98:
									this.equipmentData.liquidLevelDown = deviceDatas[i].value;
									break;
							}
						}
						this.equipmentData.spliteFlowDown = response.message.deviceSetData.shutValve;
						this.equipmentData.makeUpDown = response.message.deviceSetData.supplementaryValve;
					}
				})
				.catch(error => {});
		},

		getPattern() {
			//获取当前密控模式
			let url = this.$api.getPattern;
			this.$http
				.get(url)
				.then(response => {
					this.btnID = response;
				})
				.catch(error => {});
		},
		setPattern(id) {
			if(this.btnID!=id){
			//发送密控模式
			let _this = this;
			_this.$confirm({
				title: '切换密控模式？',
				content: h => {
					if (id == 0) {
						return '确定要选择化验吗？';
					} else if (id == 1) {
						return '确定要选择检测吗？';
					}
				},
				centered: true,
				onOk() {
					let url = _this.$api.setPattern;
					_this.$http
						.get(url + id)
						.then(response => {
							if (response.code == 0) {
								_this.$message.success('修改模式成功');
								_this.btnID = id;
							}else {
								this.$message.error('修改模式失败');
							}
						})
						.catch(error => {});
				},
				onCancel() {},
				class: 'test'
			});
			}
		},
		onClickOpen() {
			//填报显示model
			this.formModel.resetFields(); // model重置
			this.visible = true;
		},
		handleOk() {
			//填报提交model
			this.formModel.validateFields((err, values) => {
				if (!err) {
					values.incinerationTime = this.$times.filtrateDate(values.incinerationTime._d);

					let url = this.$api.ashAllowed;
					this.$http
						.post(url, values)
						.then(response => {
							if (response.code == 0) {
								this.$message.success('填报灰分成功');
							} else {
								this.$message.error('填报灰分失败');
							}
							this.visible = false;
						})
						.catch(error => {
							this.$message.error('填报灰分失败');
						});
				}
			});
		},
		validatorCustom(rule, value, callback) {
			const form = this.form;
			let mUserId = /^[0-1]{1}([.][0-9]{1,3})?$/;
			if (value && !value.match(mUserId)) {
				return callback(new Error('整数最大为1,小数位3'));
			} else if(value&&Number(value) >Number(this.online)){
				return callback(new Error(`不能大于生产密度上限`));
			}else if(value&&Number(value) <Number(this.offline)){
				return callback(new Error(`不能小于生产密度下限`));
			}else{
				callback();
			}
		},
		openingDegree(rule, value, callback) {
			const form = this.form;
			let mUserId =/^(?:0|[1-9][0-9]?|100)$/;
			if (value && !value.match(mUserId)) {
				return callback(new Error('只能输入0-100整数'));
			} else{
				callback();
			}
		}
	}
};
</script>
<style lang="scss" scoped>
@import '../assets/css/deviceState.scss';
</style>
