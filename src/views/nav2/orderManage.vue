<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.ordernum" placeholder="订单编号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getModels">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="models" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%; ">
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="orderNumber" label="商品订单号" width="190" sortable>
			</el-table-column>
            <el-table-column prop="buyerName" label="购买用户" width="130" sortable>
			</el-table-column>
			<el-table-column prop="model.modelName" label="商品名称" width="130" sortable>
			</el-table-column>
			<el-table-column prop="model.price" label="商品价格" min-width="120" sortable>
			</el-table-column>
			<el-table-column prop="ordertime" label="下单时间" min-width="160" sortable>
			</el-table-column>
			<!-- <el-table-column prop="buyNumber" label="购买数量" min-width="120" sortable>
			</el-table-column> -->
			<el-table-column prop="reMarks" label="备注" min-width="150" sortable>
			</el-table-column>
            <el-table-column prop="status" label="订单状态" min-width="120" :formatter="formatStatus" sortable>
			</el-table-column>
			<el-table-column label="操作"  width="120" >
				<template scope="scope">
					<el-button size="small" @click="handleReview(scope.$index, scope.row)">核销</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>


	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getConfirmModelListPage,  confirmModel, batchConfirmModel } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				models: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.getModels();
			},

			formatStatus(row, status) {
				return row.status == "1" ? "已核销"　: row.status == "0" ?　"未核销" : "未知";
			},
			//获取核销列表
			getModels() {
				var user = sessionStorage.getItem('user');
				user = JSON.parse(user);
				let para = {
					page: this.page,
					orderNumber: this.filters.ordernum ? this.filters.ordernum : "",
					community: user.community,
					page: 1
				};
				this.listLoading = true;
				//NProgress.start();
				getConfirmModelListPage(para).then((res) => {
					//this.total = res.data.total;
					this.models = res.data.models;
					this.total = res.data.total;
					this.models.forEach((e) => {
						e.ordertime = e.orderTime ? (e.orderTime.year + '-' + e.orderTime.month + '-' + e.orderTime.day + ' ' + e.orderTime.hour + ':' + e.orderTime.minutes) : "时间被吃了"
					})
					this.listLoading = false;
					//NProgress.done();
				}).catch(() => {
					this.$message({
							message: "连接超时",
							type: "warning"
						});
				});
			},
	        
			//核销
			handleReview: function (index, row) {			
					this.$confirm('确认核销该记录吗?', '提示', {
					type: 'warning'
				    }).then(() =>  {
                            this.editLoading = true;
                            let para = {orderNumber: row.orderNumber };
							confirmModel(para).then((res) => {
                                this.editLoading = false;
								//NProgress.done();
							this.$message({
								message: (res.data.code == "1") ? "核销成功" : "核销失败,此订单不存在",
								type: (res.data.code == "1"	) ? "success" : "error"
							});

							this.getModels();
							});
					}).catch(() => {
							this.$message({
								message:"请求超时",
								type: "error"
							});

                    });
			},

			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量核销
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchConfirmModel(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: (res.data.code == "1") ? "核销成功" : "核销失败,此订单不存在",
							type: (res.data.code == "1"	) ? "success" : "error"
						});
						this.getModels();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getModels();
		}
	}

</script>

<style scoped>

</style>