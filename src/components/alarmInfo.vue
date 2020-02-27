<!-- 报警信息 -->

<template>
	<div class="alarm-info"><a-table size="middle" id="table_size" :columns="columns" :dataSource="data" :pagination="false">
	
	<template slot="alarmType" slot-scope="text, record">
			<span class="tinctorial" :class="[text== 1 ? 'activeColor1': text == 2? 'activeColor2' :text == 3? 'activeColor3': '']"></span>	
	</template>
	<template slot="alarmDesc" slot-scope="text, record"><span  style="display: inline-block;text-overflow: ellipsis;overflow: hidden !important;white-space: nowrap;width:100px;" :title="text">{{text}}</span></template>
	</a-table>
	
	<a-modal v-if="visible" width="1000px" class="modelForm"  centered :maskClosable="false" v-model="visible" @cancel="alarmTypedata">
		<div style="margin-bottom: 20px;">
			
		
		<a-form class="filter_box" :form="formData" layout="inline">
			<a-form-item label="报警级别：" style="float: left;">
			  <a-select v-decorator="['alarmType', {initialValue:''}]" placeholder="请选择">
			    <a-select-option value="">全选</a-select-option>
				<a-select-option :value="el.alarmStatus" :key="el.alarmStatus" v-for="el in pullDownList">{{el.alarmLevel}}</a-select-option>
			  </a-select>
			</a-form-item>
			<a-form-item label="报警状态：" style="float: left;">
			  <a-select v-decorator="['alarmState', {initialValue:'1'}]" placeholder="请选择">
			    <a-select-option value="1">报警</a-select-option>
				<a-select-option value="0">消警</a-select-option>
			  </a-select>
			</a-form-item>
			
			<a-form-item label="时间段查询：" style="float: left;">
			  <a-range-picker
			  v-decorator="['times']"
			    style="text-align:left"
			    :showTime="{ format: 'HH:mm:ss' }"
			    format="YYYY-MM-DD HH:mm:ss"
			  />
			</a-form-item>
			<a-form-item  style="float: right;">
			  <a-button @click="seek" type="primary" >搜索</a-button>
			</a-form-item>
			</a-form>
		</div>			
		<div slot="title"><span style="font-size: 20px;font-weight: 600;">密度调整记录</span></div>
		<div slot="footer" ></div>
	
		<a-table :columns="columnsModel" :dataSource="dataModel" :pagination="pageOptions" >
			
			<template slot="alarmType" slot-scope="text, record">
					<span class="tinctorial" :class="[text== 1 ? 'activeColor1': text == 2? 'activeColor2' :text == 3? 'activeColor3': '']"></span>	
			</template>
			
			<template slot="alarmStatus" slot-scope="text, record">
					<span>{{text==0?'消警':'报警'}}</span>	
			</template>
		</a-table>
	</a-modal>
	
	</div>
</template>

<script>
const columns = [
	{
		title: '报警时间',
		dataIndex: 'dateStr',
		width:90,
		align:'center',
		scopedSlots: { customRender: 'dateStr' }
	},
	{
		title: '报警等级',
		dataIndex: 'alarmType',
		width:90,
		align:'center',
		scopedSlots: { customRender: 'alarmType' }
	},
	{
		title: '报警名称',
		dataIndex: 'alarmDesc',
		width:100,
		align:'center',
		scopedSlots: { customRender: 'alarmDesc' }
	}
];
const columnsModel = [
	{
		title: '报警级别',
		dataIndex: 'alarmType',
		width: '10%',
		align: 'center',
		scopedSlots: { customRender: 'alarmType' }
	},
	{
		title: '报警时间',
		dataIndex: 'alarmBeginTime',
		width: '20%',
		align: 'center',
		scopedSlots: { customRender: 'alarmBeginTime' }
	},
	{
		title: '报警状态',
		dataIndex: 'alarmStatus',
		width: '10%',
		align: 'center',
		scopedSlots: { customRender: 'alarmStatus' }
	},
	{
		title: '报警名称',
		dataIndex: 'alarmDesc',
		width: '35%',
		align: 'center',
		scopedSlots: { customRender: 'alarmDesc' }
	},
	{
		title: '报警详情',
		dataIndex: 'alarmDetails',
		width: '25%',
		align: 'center',
		scopedSlots: { customRender: 'alarmDetails' }
	}
];
export default {
	name: 'alarmInfo',
	data() {
		return {
			columns,//表头
			columnsModel,//model表头
			data: [],//table
			dataModel: [],//model-table
			visible:false,//model状态
			pullDownList:[],//下拉列表
			formData: this.$form.createForm(this),
			postData: {//分页发送
				alarmStartTime:'',
				alarmEndTime: '',
				limit: 10,
				page: 1,
				alarmType:'',
				alarmState:'1'
			},
			pageOptions: {//分页
			  current: 1,
			  defaultPageSize: 10,
			  showQuickJumper: true,
			  showSizeChanger: true,
			  pageSizeOptions: ['10', '20', '50'],
			  total: 0,
			  onShowSizeChange: (current, size) => {
			    this.postData.limit = size
			    this.postData.page = 1
				this.pageOptions.current=1
				this.modelData()
			  },
			  onChange: (page, pageSize) => {
			    // 跳页
			    this.postData.page = page
				this.pageOptions.current=page
				this.modelData()
			  }
			}
		};
	},
	created() {
		this.homeAlarmInfo()
		this.alarmPullDown()
	},
	mounted() {
		this.homeAlarmTime()
		    // setInterval(this.homeAlarmInfo, 5000);
	
	},
	beforeDestroy() {
		//页面关闭时清除定时器
		clearInterval(this.homeAlarmSet);
	},
	
	
	
	methods:{
	homeAlarmTime() {
		//设置定时器
	 
		this.homeAlarmSet = setInterval(() => {
			this.homeAlarmInfo();
		}, 5000);
	},
		
		homeAlarmInfo(){
			let url = this.$api.homePageAlarmInfo;
			this.$http.get(url)		
			.then(response => {
				console.log(response)
				for(let i=0;i<response.length;i++){
					response[i].key=i
				}
				this.data=response
				})
				.catch(error => {
				});
		},
		
		seek(){
		    this.postData.page = 1
			this.pageOptions.current=1
			
			this.formData.validateFields((err, values) => {
		
				  if(values.times&&values.times.length>0){
				this.postData.alarmStartTime=this.$times.filtrateDate(values.times[0]._d)
				this.postData.alarmEndTime=this.$times.filtrateDate(values.times[1]._d)
					  
				  }else{
					this.postData.alarmStartTime=''
					this.postData.alarmEndTime=''
				  }
				  this.postData.alarmType=values.alarmType
				  this.postData.alarmState=values.alarmState
				  
				this.modelData()  
			  
			})
			
		},
		
		modelData() {
			this.visible=true
			//获取更多数据
			let url = this.$api.alarmInformationWay;
			this.$http
				.post(url, this.postData)
				.then(response => {
					for(let i=0;i<response.message.alarmInfoList.length;i++){
						response.message.alarmInfoList[i].key=i
					}
					
					this.dataModel=response.message.alarmInfoList;
					this.pageOptions.total=response.message.totalCount||0
				})
				.catch(error => {});
		},
		alarmPullDown(){//下拉列表
			let url = this.$api.alarmPullDown;
			this.$http.get(url)		
			.then(response => {
				this.pullDownList=response
				})
				.catch(error => {
				});
		},
		alarmTypedata(){
			this.postData.alarmStartTime=''
			this.postData.alarmEndTime=''
			this.postData.limit=10
			this.postData.page=1
			this.postData.alarmType=''
			this.postData.alarmState='1'
			this.pageOptions.current=1
			this.dataModel=[]
			this.formData.resetFields(); // model重置
			}
	}
};
</script>

<style></style>
