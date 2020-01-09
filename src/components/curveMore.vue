<!-- 密度调整 -->

<template>
	<div class="alarm-info">
		<a-modal width="1080px" class="modelForm" centered :maskClosable="false" v-model="visible">
			<div style="margin-bottom: 20px;">
				<a-form class="filter_box" :form="formData" layout="inline">
					<a-form-item label="时间段查询：" style="float: left;">
						<a-range-picker v-decorator="['times']" style="text-align:left" :showTime="{ format: 'HH:mm:ss' }" format="YYYY-MM-DD HH:mm:ss" />
					</a-form-item>
					<a-form-item style="float: right;"><a-button @click="seek" type="primary">搜索</a-button></a-form-item>
				</a-form>
			</div>
			<div slot="title">
				<span style="font-size: 20px;font-weight: 600;">{{ title }}</span>
			</div>
			<div slot="footer"></div>

			<a-table :columns="columnsModel" :dataSource="dataModel" :pagination="pageOptions" :loading="loading">
				<template slot="two">
					{{ two }}
				</template>
				<template slot="three">
					{{ three }}
				</template>
			</a-table>
		</a-modal>
	</div>
</template>

<script>
export default {
	name: 'alarmInfo',

	props: ['ipa'],

	data() {
		return {
			visible: false,
			two: '',
			three: '',
			columnsModel: [
				{
					title: '记录时间',
					dataIndex: 'date',
					width: '35%',
					align: 'center',
					scopedSlots: { customRender: 'date' }
				},
				{
					dataIndex: 'oneData',
					width: '15%',
					align: 'center',
					scopedSlots: { customRender: 'oneData', title: 'two' }
				},
				{
					dataIndex: 'twoData',
					width: '50%',
					align: 'center',
					scopedSlots: { customRender: 'twoData', title: 'three' }
				}
			],
			dataModel: [],
			title: '',
			url: '',
loading:false,
			formData: this.$form.createForm(this),
			postData: {
				startDate: '',
				endDate: '',
				limit: 10,
				page: 1
			},
			pageOptions: {
				current: 1,
				defaultPageSize: 10,
				showQuickJumper: true,
				showSizeChanger: true,
				pageSizeOptions: ['10', '20', '50'],
				total: 0,
				onShowSizeChange: (current, size) => {
					this.postData.limit = size;
					this.postData.page = 1;
					this.pageOptions.current = 1;
					this.modelList();
				},
				onChange: (page, pageSize) => {
					// 跳页
					this.postData.page = page;
					this.pageOptions.current = page;
					this.modelList();
				}
			}
		};
	},
	computed: {
		aaa() {
			return this.ipa;
		}
	},
	created() {},
	mounted() {},
	methods: {
		seek() {
			this.postData.page = 1;
			this.pageOptions.current = 1;

			this.formData.validateFields((err, values) => {
				console.log(values);
				if (values.times && values.times.length > 0) {
					this.postData.startDate = this.$times.filtrateDate(values.times[0]._d);
					this.postData.endDate = this.$times.filtrateDate(values.times[1]._d);
				} else {
					this.postData.startDate = '';
					this.postData.endDate = '';
				}
				this.modelList();
			});
		},

		modelData(id) {

			if (id == 1) {
				this.title = '灰分变化记录';
				this.url = this.$api.ashEchartsWay;
				this.two = '瞬时灰分';
				this.three = '检测灰分';
			} else if (id == 2) {
				this.title = '密度变化记录';
				this.url = this.$api.densityEchartsWay;
				this.two = '设定密度';
				this.three = '当前密度';
			} else if (id == 3) {
				this.title = '阀门调整记录';
				this.url = this.$api.valveEchartsWay;
				this.two = '补水阀(%)';
				this.three = '分流阀(%)';
			}

			this.visible = true;

			this.dataModel = [];
			this.postData.page = 1;
			this.postData.limit = 10;
			this.pageOptions.current = 1;
			this.pageOptions.total = 0;
			this.modelList();
		},
		modelList() {
			    this.loading = true;
			//获取更多数据
			let url = this.url;
			this.$http
				.post(url, this.postData)
				.then(response => {
					for (let i = 0; i < response.result.list.length; i++) {
						response.result.list[i].key = i;
					}

					this.dataModel = response.result.list;
					this.pageOptions.total = response.result.size || 0;
					   this.loading = false;
				})
				.catch(error => {   this.loading = false;});
		}
	}
};
</script>

<style></style>
