<!-- 密度调整 -->

<template>
	<div class="alarm-info">
		<a-table size="middle" id="table_size" :columns="columns" :dataSource="data" :pagination="false">
			<template slot="operationalBasis" slot-scope="text, record">
				<span style="display: inline-block;text-overflow: ellipsis;overflow: hidden !important;white-space: nowrap;width:100px;" :title="text">{{ text }}</span>
			</template>
		</a-table>

		<a-modal width="1080px" class="modelForm" v-if='visible' centered :maskClosable="false" v-model="visible" @cancel="modelTypedata">
			<div style="margin-bottom: 20px;">
				
			
			<a-form class="filter_box" :form="formData" layout="inline">
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

			<a-table :columns="columnsModel" :dataSource="dataModel" :pagination="pageOptions"></a-table>
		</a-modal>
	</div>
</template>

<script>
	import util from '../utils/util.js';
const columns = [
	{
		title: '建议时间',
		dataIndex: 'adjustTimeStr',
		width: 90,
		align: 'center',
		scopedSlots: { customRender: 'adjustTimeStr' }
	},
	{
		title: '建议操作',
		dataIndex: 'stepAdjustPlus',
		width: 90,
		align: 'center',
		scopedSlots: { customRender: 'stepAdjustPlus' }
	},
	{
		title: '操作依据',
		dataIndex: 'operationalBasis',
		width: 100,
		align: 'center',
		scopedSlots: { customRender: 'operationalBasis' }
	}
];

const columnsModel = [
	{
		title: '建议时间',
		dataIndex: 'adjustTimeStr',
		width: '35%',
		align: 'center',
		scopedSlots: { customRender: 'adjustTimeStr' }
	},
	{
		title: '建议操作',
		dataIndex: 'stepAdjustPlus',
		width: '15%',
		align: 'center',
		scopedSlots: { customRender: 'stepAdjustPlus' }
	},
	{
		title: '操作依据',
		dataIndex: 'operationalBasis',
		width: '50%',
		align: 'center',
		scopedSlots: { customRender: 'operationalBasis' }
	}
];

export default {
	name: 'alarmInfo',
	data() {
		return {
			visible: false,
			columns,
			columnsModel,
			data: [],
			dataModel: [],
			formData: this.$form.createForm(this),
			postData: {
				startDate:'',
				endDate: '',
				limit: 10,
				page: 1,
			},
			pageOptions: {
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
		this.densityAdjustment();
	},
	mounted() {
		var that = this;
		setInterval(that.densityAdjustment, 1000 * 30);
			util.$on('gain', () => {			
				that.densityAdjustment();
			});
	},
	methods: {
		
		seek(){
		    this.postData.page = 1
			this.pageOptions.current=1
			
			this.formData.validateFields((err, values) => {
		
				  if(values.times&&values.times.length>0){
				this.postData.startDate=this.$times.filtrateDate(values.times[0]._d)
				this.postData.endDate=this.$times.filtrateDate(values.times[1]._d)
					  
				  }else{
					this.postData.startDate=''
					this.postData.endDate=''
				  }
				this.modelData()  
			  
			})
			
		},
		
		densityAdjustment() {
			let url = this.$api.densityAdjustment;
			this.$http
				.get(url)
				.then(response => {
				
					if (response.code == 0) {
						for (let i = 0; i < response.result.length; i++) {
							response.result[i].key = i;
						}
						this.data = response.result;
					}
				})
				.catch(error => {});
		},
		modelData() {
			this.visible=true
			//获取更多数据
			let url = this.$api.densityAdjustmentWay;
			this.$http
				.post(url, this.postData)
				.then(response => {
					for(let i=0;i<response.result.densityControlRecordVo.length;i++){
						response.result.densityControlRecordVo[i].key=i
					}
					
					this.dataModel=response.result.densityControlRecordVo;
					this.pageOptions.total=response.result.size||0
				})
				.catch(error => {});
		},
		modelTypedata(){
			this.postData.startDate=''
			this.postData.endDate=''
			this.postData.limit=10
			this.postData.page=1
			this.pageOptions.current=1
			this.dataModel=[]
			this.formData.resetFields(); // model重置
			}
	}
};
</script>

<style></style>
