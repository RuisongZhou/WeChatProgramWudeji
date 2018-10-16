<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				<el-tag>积分数量：{{this.userscore}}</el-tag>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%; ">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="70">
			</el-table-column>
			<el-table-column prop="name" label="昵称" width="150" sortable>
			</el-table-column>
			<el-table-column prop="gender" label="性别" width="100" :formatter="formatSex" sortable>
			</el-table-column>
			<el-table-column prop="college" label="大学" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="community" label="社团" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="tel" label="注册电话" min-width="150" sortable>
			</el-table-column>
			<el-table-column prop="scores" label="积分" min-width="100" sortable>
			</el-table-column>
			<el-table-column label="操作"  width="250" >
				<template scope="scope">
					<el-button size="small" @click="handleCheck(scope.$index, scope.row)">查看流水</el-button>
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">分配积分</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--分配界面-->
		<el-dialog title="分配积分" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" ref="editForm">
				<el-form-item label="增加积分">	
					<el-input-number v-model="addScores.score" :min="0" :max="this.userscore > 100 ? 100 : userscore"></el-input-number>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit(addScores)" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--流水列表-->
		<el-dialog title="流水" v-model="FlowFormVisible" :close-on-click-modal="false">
			<el-table :data="flows" highlight-current-row v-loading="flowloading" style="width: 100%;">
				<el-table-column type="index" width="50">
				</el-table-column>
				<el-table-column prop="senderName" label="买方" width="120" sortable>
				</el-table-column>
				<el-table-column prop="acceptName" label="卖方" min-width="120" sortable>
				</el-table-column>
                <el-table-column prop="time" label="时间" min-width="130" sortable>
				</el-table-column>
				<el-table-column prop="model" label="购买物品" min-width="130" sortable>
				</el-table-column>
				<el-table-column prop="modelnumber" label="购买数量" min-width="130" sortable>
				</el-table-column>
				<el-table-column prop="modelprice" label="物品单价（积分）" min-width="130" sortable>
				</el-table-column>
			</el-table>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getUserListPage, removeUser, batchRemoveUser, editUser , userCheckFlowing} from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,

				//编辑界面数据
				username:"",
				userPermission:"",
				editForm: {
					sender:"",
					to:"",
					senderPermission:"",
					acceptPermission:"",
					score:0
				},
				addScores: {
					score:0
				},
				//流水列表
				flows:[],
				FlowFormVisible:false,
				flowloading:false,
				userscore:0,
			}
		},
		methods: {
			//性别显示转换
			formatSex: function (row, column) {
				return row.gender == "1" ? '男' : row.gender == "0" ? '女' : '未知';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			//获取用户列表
			getUsers() {
				var user = sessionStorage.getItem('user');
				if (user) {
						user = JSON.parse(user);
						this.scores = user.scores;
					}
				let para = {
					page: this.page,
					name: this.filters.name,
					community: user.community,
					access: 1,
				};
				this.listLoading = true;
				//NProgress.start();
				getUserListPage(para).then((res) => {
					this.total = res.data.total;
					this.users = res.data.UsersInformation;
					this.listLoading = false;
					//NProgress.done();
				}).catch(() => {
					this.$message({
							message: "连接超时",
							type: "warning"
						});
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id };
					removeUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
							this.$message({
								message: res.data.description,
								type: (res.data.code == "1"	) ? "success" : "error"
							});
						this.getUsers();
					});
				}).catch(() => {

				});
			},
			
			//显示分配积分界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm.to = row.permission == "2" ? row.username : row.id;
				this.editForm.score = 0;
				this.editForm.sender = this.username;
				this.editForm.acceptPermission = row.access;
				this.editForm.senderPermission = this.userPermission;
				//console.log(this.editForm);

			},

			//显示流水列表
			handleCheck:function(index, row) {
					this.FlowFormVisible = true;
					this.flowloading = true;
					let para = { id:row.id,
								name:row.name };
				userCheckFlowing(para).then((res) => {
					//this.flows = res.data.deals;
					let buyDeals = res.data.buyDeals;
					let getDeals = res.data.getDeals;
					var user = sessionStorage.getItem('user');
					if (user) {
							user = JSON.parse(user);
						}
					for(var item = 0; item < buyDeals.length; item++){
						this.flows.push({senderName : buyDeals[item].buyerName,
										acceptName : buyDeals[item].model.posterName,

										time : buyDeals[item].orderTime ? (buyDeals[item].orderTime.year + '-' + buyDeals[item].orderTime.month + 
										'-' + buyDeals[item].orderTime.day + ' ' + buyDeals[item].orderTime.hour + ':' + buyDeals[item].orderTime.minutes) : "时间被吃了",
										
										model: buyDeals[item].model.modelName,
										modelnumber: buyDeals[item].buyNumber,
										modelprice:buyDeals[item].model.price,
										});
					}
				
					for(var item = 0; item < getDeals.length; item++){
						this.flows.push({senderName :getDeals[item].model.posterName,
										acceptName : getDeals[item].buyerName,
										
										time : getDeals[item].orderTime ? (getDeals[item].orderTime.year + '-' + getDeals[item].orderTime.month + 
										'-' + getDeals[item].orderTime.day + ' ' + getDeals[item].orderTime.hour + ':' + getDeals[item].orderTime.minutes) : "时间被吃了",
										
										model: getDeals[item].model.modelName,
										modelnumber: getDeals[item].buyNumber,
										modelprice: getDeals[item].model.price,
										});

					}
					this.flowloading = false;
				});
			},

			//编辑积分
			editSubmit: function (addScores) {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
							this.editLoading = true;
							//NProgress.start();
							let para = this.editForm;
							para.score = addScores.score;
							console.log(para);
							editUser(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
									this.$message({
									message: res.data.description,
									type: (res.data.code == "1"	) ? "success" : "error"
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUsers();
							});
					}
				});
			},

			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
							this.$message({
								message: res.data.description,
								type: (res.data.code == "1"	) ? "success" : "error"
							});
						this.getUsers();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getUsers();
			var user = sessionStorage.getItem('user');
			if (user) {
				user = JSON.parse(user);
				this.username = user.username;
				this.userPermission = user.permission;
				this.userscore = user.scores ? user.scores : 0;
			}
		}
	}

</script>

<style scoped>

</style>