
<!-- 参数设置 -->
<template>
	<div class="parameter-setting">
		<a-form id="fourFrom" :form="form" layout="horizontal">
			<a-form-item :required="false" :label-col="{ span: 14 }" :wrapper-col="{ span: 10 }" :label="el.configDesc" v-for="(el, index) in fourData" :key="index">
				<a-input
					type="text"
					@pressEnter="carriageReturn(el.configName)"
					v-decorator="[
						`${el.configName}`,
						{
							initialValue: `${el.configValue}`,
							rules: [{ required: true, whitespace: true, message: `请输入` }, { validator: validatorCustom }]
						}
					]"
				/>
			</a-form-item>
		</a-form>
		
		<a-modal width="1080px" class="set-form"  okText="保存"  centered :maskClosable="false" v-model="visible" @ok="handleOk">
			<div slot="title"><span style="font-size: 20px;font-weight: 600;">参数设置</span></div>
			<div style="width: 100%;height: 545px;overflow: auto;">
			<a-form id="allFrom" :form="formData" layout="inline">
				<div  :key="index" v-for="(all,index) in allData">
					<p class="set-way-title">{{index==0?'控制参数设置':index==1?'计算参数设置':index==2?'时间参数设置':''}}</p>
					<div class="set-way-div">
						<a-form-item style="width: 31%;" v-for="(el,index) in all" :required="false" :label-col="{ span: 16 }" :wrapper-col="{ span: 8 }" :label="el.configDesc"  :key="index">
							<a-input
								type="text"
								style="width: 105px;"
								v-decorator="[
									`${el.configName}`,
									{
										initialValue: `${el.configValue}`,
										rules: [{ required: true, whitespace: true, message: `请输入` }, { validator: validatorList }]
									}
								]"
							/>
						</a-form-item>
					</div>
				</div>
				
				
				
			</a-form>	
				
			</div>
		</a-modal>
	</div>
</template>

<script>
export default {
	name: 'parameterSetting',
	data() {
		return {
			fourData: [], //四条数据
			form: this.$form.createForm(this),
			visible: false,
			formData:this.$form.createForm(this),
			allData:[]
		};
	},
	created() {
		this.parameterSetting();
	},
	methods: {//更多按钮触发
		onToggle(){
			this.formData.resetFields(); // model重置
			this.visible=true;
			this.setWayAll()
		},
		
		setWayAll(){//获取到更多全部数据
			let url = this.$api.parameterSettingWay;
			this.$http
				.get(url)
				.then(response => {
					this.allData=response
				})
				.catch(error => {});
			},
		
		handleOk (e) {
		  // model确定
		  e.preventDefault()
		  this.formData.validateFields((err, values) => {
		    if (!err) {
				console.log(123)
		   let attr=[];
		   
		   for(let val in values ){
			   let obj=new Object();
			   obj.configName=val
			   obj.configValue=values[val]
			   attr.push(obj)
		   }
			  this.setParameter(attr,2)
		   
		   
		    }
		  })
		},
		
		
		
		parameterSetting() {
			//界面四条数据
			let url = this.$api.parameterSetting;
			this.$http
				.get(url)
				.then(response => {
					this.getFourData(response.message);
				})
				.catch(error => {});
		},
		getFourData(data) {
			//页面四条数据
			this.fourData = [];
			for (let i = 0; i < 4; i++) {
				this.fourData.push(data[i]);
			}
		},
		getSplit(data) {//							rules: [{ required: true, whitespace: true, message: `请输入${getSplit(el.configDesc)}` }, { validator: validatorCustom }]
			//message错误提示信息

			var index = data.indexOf('(');
			var result = data.substring(0, index);
			if (result[0] == '*') {
				result = result.substring(1, result.length);
			}
			return result;
		},
		carriageReturn(name) {
			//回车取某条数据
			this.form.validateFields((err, values) => {
				if (err && err[name]) {
				} else {
					// 组成数据
					let attr = [];
					let objData = new Object();
					objData.configName = name;
					objData.configValue = values[name];
					attr.push(objData);
					// 回调
					this.setParameter(attr,1);
				}
			});
		},

		setParameter(data,key) {
			//回车参数
			let url = this.$api.setParameterValue;
			this.$http
				.post(url, data)
				.then(response => {
					if (response.code == 0) {
						if(key==2){
							this.visible=false
						}
						
						this.parameterSetting();
						this.$message.success('修改参数成功');
					} else {
						this.$message.error('修改参数失败');
					}
				})
				.catch(error => {
					this.$message.error('修改参数失败');
				});
		},

		validatorCustom(rule, value, callback) {
			//页面四条信息验证
			const form = this.form;
			if (rule.field == 'cleanedCoalAshLower') {
				//下
				let mUserId = /^[7-9]\.[0-9]{1,3}$|^[7-9]{1}$|^10{1}$|^10\.[0-9]{1,3}$|^11{1}$|^11\.[0]{1,3}$/;
				if (value && !value.match(mUserId)) {
					return callback(new Error('7-11小数位3'));
				} else if (value && value >= form.getFieldValue('cleanedCoalAshUpper')) {
					callback(new Error('大于等于上限'));
					return;
				} else {
					callback();
				}
			} else if (rule.field == 'cleanedCoalAshUpper') {
				//上

let mUserId =/^[7-9]\.[0-9]{1,3}$|^[7-9]{1}$|^10{1}$|^10\.[0-9]{1,3}$|^11{1}$|^11\.[0]{1,3}$/;
 				if (value && !value.match(mUserId)) {
 					return callback(new Error('7-11小数位3'));
 				} else if (value && value <= form.getFieldValue('cleanedCoalAshLower')) {
					callback(new Error('小于等于下限'));
					return;
				} else {
					callback();
				}
			} else if (rule.field == 'lowerProductionDensity') {
				//下
let mUserId = /^[1-9]{1,2}$|^[1-9]{1,2}[\.]{1}[0-9]{1,2}$/;
					if (value && !value.match(mUserId)) {
						return callback(new Error('大于1小数2'));
					}else if (value && value >= form.getFieldValue('upperProductionDensity')) {
					callback(new Error('大于等于上限'));
					return;
				} else {
					callback();
				}
			} else if (rule.field == 'upperProductionDensity') {
				//上
				let mUserId = /^[1-9]{1,2}$|^[1-9]{1,2}[\.]{1}[0-9]{1,2}$/;
					if (value && !value.match(mUserId)) {
						return callback(new Error('大于1小数2'));
					}else if (value && value <= form.getFieldValue('lowerProductionDensity')) {
					callback(new Error('小于等于下限'));
					return;
				} else {
					callback();
				}
			}
		},
		validatorList(rule, value, callback) {//全部数据正则表达式验证
			const form = this.formData;
			if(rule.field == 'maximumOpeningOfShuntValve'){//分流阀最大开度//////第一个
				let mUserId = /^(?:0|[1-9][0-9]?|100)$/;
					if (value && !value.match(mUserId)) {
						return callback(new Error('0-100整数'));
					} else {
				callback();
						
					}
				
				
			}else if(rule.field == 'maximumOpeningOfRefillValve'){//补水阀最大开度
				let mUserId = /^(?:0|[1-9][0-9]?|100)$/;
					if (value && !value.match(mUserId)) {
						return callback(new Error('0-100整数'));
					} else {
				callback();
						
					}
			}else if(rule.field == 'minimumValveOpening'){//分流阀最小开度
				let mUserId = /^(?:0|[1-9][0-9]?|100)$/;
					if (value && !value.match(mUserId)) {
						return callback(new Error('0-100整数'));
					} else {
				callback();
						
					}
			}else if(rule.field == 'minimumOpeningOfRefillValve'){//补水阀最小开度
				let mUserId = /^(?:0|[1-9][0-9]?|100)$/;
					if (value && !value.match(mUserId)) {
						return callback(new Error('0-100整数'));
					} else {
				callback();
						
					}
			}else if(rule.field == 'cleanedCoalAshLower'){//精煤灰分下限
				let mUserId = /^[7-9]\.[0-9]{1,3}$|^[7-9]{1}$|^10{1}$|^10\.[0-9]{1,3}$|^11{1}$|^11\.[0]{1,3}$/;
					if (value && !value.match(mUserId)) {
						return callback(new Error('7-11小数3'));
					} else {
				callback();
						
					}
			}else if(rule.field == 'regulationCoefficientOfShuntValve'){//分流阀调节系数
				let mUserId = /^(?:0|[1-9][0-9]?|100)$/;
					if (value && !value.match(mUserId)) {
						return callback(new Error('0-100整数'));
					} else {
				callback();
						
					}
			}else if(rule.field == 'cleanedCoalAshUpper'){//精煤灰分上限
				let mUserId = /^[7-9]\.[0-9]{1,3}$|^[7-9]{1}$|^10{1}$|^10\.[0-9]{1,3}$|^11{1}$|^11\.[0]{1,3}$/;
					if (value && !value.match(mUserId)) {
						return callback(new Error('7-11小数3'));
					} else {
				callback();
						
					}
			}else if(rule.field == 'adjustmentCoefficientOfWaterLevelOfRefillValve'){//补水阀液位调整系数
				let mUserId = /^(?:0|[1-9][0-9]?|100)$/;
					if (value && !value.match(mUserId)) {
						return callback(new Error('0-100整数'));
					} else {
				callback();
						
					}
			}else if(rule.field == 'diversionValveDensityAdjustmentCoefficient'){//分流阀密度调整系数
				let mUserId = /^(?:0|[1-9][0-9]?|100)$/;
					if (value && !value.match(mUserId)) {
						return callback(new Error('0-100整数'));
					} else {
				callback();
						
					}
			}else if(rule.field == 'supAdviseLoopCnt'){//补水阀密度调节周期
				let mUserId = /^\+?[0-9]\d*$/;
					if (value && !value.match(mUserId)) {
						return callback(new Error('正整数'));
					} else {
				callback();
						
					}
			}else if(rule.field == 'adjustmentCoefficientOfFillingValve'){//补水阀密度调节系数
				let mUserId = /^(?:0|[1-9][0-9]?|100)$/;
					if (value && !value.match(mUserId)) {
						return callback(new Error('0-100整数'));
					} else {
				callback();
						
					}
			}else if(rule.field == 'upperProductionDensity'){//生产密度上限
				let mUserId = /^[1-9]{1,2}$|^[1-9]{1,2}[\.]{1}[0-9]{1,2}$/;
					if (value && !value.match(mUserId)) {
						return callback(new Error('大于1小数2'));
					} else {
				callback();
						
					}
			}else if(rule.field == 'lowerProductionDensity'){//生产密度下限
				let mUserId = /^[1-9]{1,2}$|^[1-9]{1,2}[\.]{1}[0-9]{1,2}$/;
					if (value && !value.match(mUserId)) {
						return callback(new Error('大于1小数2'));
					} else {
				callback();
						
					}
			}else if(rule.field == 'mediumBarrelHigh'){//合介桶高度/////第二个
				let mUserId = /^\d+(\.(?!.*0$)\d{1,2})?$/;
					if (value && !value.match(mUserId)) {
						return callback(new Error('整数小数2'));
					}else{
						callback();
					}
			}else if(rule.field == 'ashCalInterval'){//灰分元计算间隔
				let mUserId = /^\+?[1-9]\d*$/;
					if (value && !value.match(mUserId)) {
						return callback(new Error('大于1整数'));
					}else{
						callback();
					}
			}else if(rule.field == 'machineCycle'){//计算周期
				let mUserId = /^(?:[0-2]?\d{1,3}|3000)$/;
					if (value && !value.match(mUserId)) {
						return callback(new Error('0-3000整数'));
					}else{
						callback();
					}
			}else if(rule.field == 'superHighLevel'){//合介桶超高液位
				let mUserId = /^(?:0|[1-9][0-9]?|100)$/;
					if (value && !value.match(mUserId)) {
						return callback(new Error('0-100整数'));
					} else {
				callback();
						
					}
			}else if(rule.field == 'lowLevel'){//合介桶低液位
				let mUserId = /^(?:0|[1-9][0-9]?|100)$/;
					if (value && !value.match(mUserId)) {
						return callback(new Error('0-100整数'));
					} else {
				callback();
						
					}
			}else if(rule.field == 'superLowLevel'){//合介桶超低液位
				let mUserId = /^(?:0|[1-9][0-9]?|100)$/;
					if (value && !value.match(mUserId)) {
						return callback(new Error('0-100整数'));
					} else {
				callback();
						
					}
			}else if(rule.field == 'peatQuantityRegulationCoefficient'){//泥煤量调节系数
				let mUserId = /^(?:0|[1-9][0-9]?|100)$/;
					if (value && !value.match(mUserId)) {
						return callback(new Error('0-100整数'));
					} else {
				callback();
						
					}
			}else if(rule.field == 'densityError'){//密度误差值
				let mUserId = /^0\.[0-9]{1,3}$|^1{1}$|^1\.[0]{1,3}$/;
					if (value && !value.match(mUserId)) {
						return callback(new Error('0-1小数3'));
					} else {
				callback();
						
					}
			}else if(rule.field == 'highLevel'){//合介桶高液位
				let mUserId = /^(?:0|[1-9][0-9]?|100)$/;
					if (value && !value.match(mUserId)) {
						return callback(new Error('0-100整数'));
					} else {
				callback();
						
					}
			}else if(rule.field == 'slurryDensity'){//煤泥密度
				let mUserId = /^1\.[0-9]{1,3}$|^1{1}$|^2{1}$|^2\.[0]{1,3}$/;
					if (value && !value.match(mUserId)) {
						return callback(new Error('1-2小数3'));
					} else {
				callback();
						
					}
			}else if(rule.field == 'supStepComValue'){//补水阀大小步判断值
				let mUserId = /^0\.[0-9]{1,3}$|^0{1}$|^1{1}$|^1\.[0]{1,3}$/;
					if (value && !value.match(mUserId)) {
						return callback(new Error('0-1小数3'));
					} else {
				callback();
						
					}
			}else if(rule.field == 'densityObservationPeriod'){//密度观察周期
				let mUserId = /^\+?[0-9]\d*$/;
					if (value && !value.match(mUserId)) {
						return callback(new Error('正整数'));
					} else {
				callback();
						
					}
			}else if(rule.field == 'magnetitePowderDensity'){//磁铁矿粉密度
				let mUserId = /^[1-9]\.[0-9]{1,3}$|^[1-9]{1}$|^10{1}$|^10\.[0]{1,3}$/;
					if (value && !value.match(mUserId)) {
						return callback(new Error('1-10小数3'));
					} else {
				callback();
						
					}
			}else if(rule.field == 'peatLevelSetHigh'){//泥煤量设定高位
				let mUserId = /^(?:0|[1-9][0-9]?|100)$/;
					if (value && !value.match(mUserId)) {
						return callback(new Error('0-100整数'));
					} else {
				callback();
						
					}
			}else if(rule.field == 'peatLevelSetSuperLow'){//泥煤量设定超低位
				let mUserId = /^(?:0|[1-9][0-9]?|100)$/;
					if (value && !value.match(mUserId)) {
						return callback(new Error('0-100整数'));
					} else {
				callback();
						
					}
			}else if(rule.field == 'peatLevelSetLow'){//泥煤量设定低位
				let mUserId = /^(?:0|[1-9][0-9]?|100)$/;
					if (value && !value.match(mUserId)) {
						return callback(new Error('0-100整数'));
					} else {
				callback();
						
					}
			}else if(rule.field == 'peatLevelSetSuperHigh'){//泥煤量设定超高位
				let mUserId = /^(?:0|[1-9][0-9]?|100)$/;
					if (value && !value.match(mUserId)) {
						return callback(new Error('0-100整数'));
					} else {
				callback();
						
					}
			}else if(rule.field == 'ashUpper'){//灰分边界上限///第三个
				let mUserId = /^[1-9]{1,2}$|^[1-9]{1,2}[\.]{1}[0-9]{1,2}$/;
					if (value && !value.match(mUserId)) {
						return callback(new Error('大于1小数2'));
					} else {
				callback();
						
					}
			}else if(rule.field == 'ashLower'){//灰分边界下限
				let mUserId = /^[1-9]{1,2}$|^[1-9]{1,2}[\.]{1}[0-9]{1,2}$/;
					if (value && !value.match(mUserId)) {
						return callback(new Error('大于1小数2'));
					} else {
				callback();
						
					}
			}else if(rule.field == 'blockStatus'){//滑动模块状态
			
			let mUserId = /^(?:0|[1]?|1)$/ ;
				if (value && !value.match(mUserId)) {
					return callback(new Error('0或1'));
				}else{
					callback();
				}
				
			}else if(rule.field == 'ashContentExceedsBid'){//灰分超标时间
				let mUserId = /^\+?[1-9]\d*$/;
					if (value && !value.match(mUserId)) {
						return callback(new Error('大于1整数'));
					}else{
						callback();
					}
			}else if(rule.field == 'productionPhase'){//生产周期
				let mUserId = /^\d+(\.(?!.*0$)\d{1,2})?$/;
					if (value && !value.match(mUserId)) {
						return callback(new Error('整数小数2'));
					}else{
						callback();
					}
			}else if(rule.field == 'dertaRou'){//Δρ
				let mUserId = /^\d+(\.(?!.*0$)\d{1,2})?$/;
					if (value && !value.match(mUserId)) {
						return callback(new Error('整数小数2'));
					}else{
						callback();
					}
			}else if(rule.field == 'safetyDensityTime'){//安全密度等待时间
				let mUserId = /^\+?[1-9]\d*$/;
					if (value && !value.match(mUserId)) {
						return callback(new Error('大于1整数'));
					}else{
						callback();
					}
			}else if(rule.field == 'effectiveAshTime'){//烧灰生效时间
				let mUserId = /^\+?[1-9]\d*$/;
					if (value && !value.match(mUserId)) {
						return callback(new Error('大于1整数'));
					}else{
						callback();
					}
			}else if(rule.field == 'stepAdjustFactor'){//步长调整系数
				let mUserId = /^0\.[0-9]{1,3}$|^0{1}$|^1{1}$|^1\.[0]{1,3}$/;
					if (value && !value.match(mUserId)) {
						return callback(new Error('0-1小数3'));
					} else {
				callback();
						
					}
			}else if(rule.field == 'safetyDensity'){//安全密度
				let mUserId = /^[1-9]{1,2}$|^[1-9]{1,2}[\.]{1}[0-9]{1,2}$/;
					if (value && !value.match(mUserId)) {
						return callback(new Error('大于1小数2'));
					} else {
				callback();
						
					}
			}else if(rule.field == 'densityCycle'){//密度调节灰分计算周期
				let mUserId = /^\d+(\.(?!.*0$)\d{1,2})?$/;
					if (value && !value.match(mUserId)) {
						return callback(new Error('整数小数2'));
					}else{
						callback();
					}
			}else if(rule.field == 'densityStartCycle'){//密度调节启动计算周期
				let mUserId = /^\d+(\.(?!.*0$)\d{1,2})?$/;
					if (value && !value.match(mUserId)) {
						return callback(new Error('整数小数2'));
					}else{
						callback();
					}
			}else if(rule.field == 'EffectivelyTime'){//填报灰分有效时长
				let mUserId = /^\+?[1-9]\d*$/;
					if (value && !value.match(mUserId)) {
						return callback(new Error('大于1整数'));
					}else{
						callback();
					}
			}else{
				callback();
			} 
			
		}
	}
};
</script>

<style lang="scss" scoped>
	.set-way-div{
		    width: 100%;
		    height: auto;
		    overflow: hidden;
		    border: 1px solid #ccc;
		    box-sizing: border-box;
		    border-radius: 5px;
		    padding: 10px 5px;

	}
	.set-way-title{
		width: 100%;
		    font-size: 17px;
		    // line-height: 25px;
		    margin: 10px 0 !important;
		    text-indent: 40px;
		    color: #000;
		    font-weight: 600;
		}
</style>
