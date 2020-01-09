
<!-- 参数设置 -->
<template>
	<div class="parameter-setting">
		<a-form id="fourFrom" :form="form" layout="horizontal">
			<a-form-item :required="false" :label-col="{ span: 12 }" :wrapper-col="{ span: 12 }" :label="el.configDesc" v-for="(el, index) in fourData" :key="index">
				<a-input
					type="text"
					@pressEnter="carriageReturn(el.configName)"
					v-decorator="[
						`${el.configName}`,
						{
							initialValue: `${el.configValue}`,
							rules: [{ required: true, whitespace: true, message: `请输入${getSplit(el.configDesc)}` }, { validator: validatorCustom }]
						}
					]"
				/>
			</a-form-item>
		</a-form>
		
		<a-modal width="1080px" class="set-form"  okText="保存"  centered :maskClosable="false" v-model="visible" @ok="handleOk">
			<div slot="title"><span style="font-size: 20px;font-weight: 600;">参数设置</span></div>
			<div style="width: 100%;height: 545px;overflow: auto;">
			<a-form id="fourFrom" :form="formData" layout="inline">
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
										rules: [{ required: true, whitespace: true, message: `请输入${getSplit(el.configDesc)}` }]
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
		getSplit(data) {
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
				if (value && value >= form.getFieldValue('cleanedCoalAshUpper')) {
					callback(new Error('不能大于等于精煤灰分上限'));
					return;
				} else {
					callback();
				}
			} else if (rule.field == 'cleanedCoalAshUpper') {
				//上

				if (value && value <= form.getFieldValue('cleanedCoalAshLower')) {
					callback(new Error('不能小于等于精煤灰分下限'));
					return;
				} else {
					callback();
				}
			} else if (rule.field == 'lowerProductionDensity') {
				//下

				if (value && value >= form.getFieldValue('upperProductionDensity')) {
					callback(new Error('不能大于等于生产密度上限'));
					return;
				} else {
					callback();
				}
			} else if (rule.field == 'upperProductionDensity') {
				//上
				if (value && value <= form.getFieldValue('lowerProductionDensity')) {
					callback(new Error('不能小于等于生产密度下限'));
					return;
				} else {
					callback();
				}
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
		    line-height: 25px;
		    margin: 10px 0 !important;
		    text-indent: 40px;
		    color: #000;
		    font-weight: 600;
		}
</style>
