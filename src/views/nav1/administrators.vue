<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUser">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="users" highlight-current-row v-loading="loading" style="width: 100%;">
				<el-table-column type="index" width="60">
				</el-table-column>
				<el-table-column prop="name" label="姓名" width="120" sortable>
				</el-table-column>
				<el-table-column prop="community" label="社团名称" min-width="120" sortable>
				</el-table-column>
				<el-table-column prop="tel" label="注册电话" min-width="120" sortable>
				</el-table-column>
                <el-table-column prop="username" label="注册账户" min-width="130" sortable>
				</el-table-column>
				<el-table-column label="操作" width="170">
				<template scope="scope">
					<el-button size="small" @click="handlePass(scope.$index, scope.row)" >查看流水</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)" :loading="refuseLoading">删除</el-button>
				</template>
			</el-table-column>
			</el-table>
		</template>

		<!--流水列表-->
		<el-dialog title="流水" v-model="FlowFormVisible" :close-on-click-modal="false">
			<el-table :data="flows" highlight-current-row v-loading="flowloading" style="width: 100%;">
				<el-table-column type="index" width="60">
				</el-table-column>
				<el-table-column prop="senderName" label="发送方" width="120" sortable>
				</el-table-column>
				<el-table-column prop="acceptName" label="接收方" min-width="120" sortable>
				</el-table-column>
				<el-table-column prop="scores" label="金额" min-width="120" sortable>
				</el-table-column>
                <el-table-column prop="time" label="时间" min-width="300" sortable>
				</el-table-column>
			</el-table>
		</el-dialog>



	</section>
</template>
<script>
	import { getAdminList,checkFlowing, deleteAdministrator } from '../../api/api';
	//import NProgress from 'nprogress'
	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				loading: false,
				users: [
				],
				flows:[],
				FlowFormVisible:false,
				flowloading:false,
				refuseloading:false,
			}
		},
		methods: {

			//获取用户列表
			getUser: function () {
				var user = sessionStorage.getItem('user');
				if (user) {
					user = JSON.parse(user);
					if(user.permission != "3")
						return;
				}
				let para = {
                    username: user.username,
					name:this.filters.name,
					access: 1
				};
				this.loading = true;
				//NProgress.start();
				getAdminList(para).then((res) => {
					this.users = res.data.UsersInformation;
					this.loading = false;
					//NProgress.done();
				});
            },
            //查看流水
            handlePass:function(index, row) {
					this.FlowFormVisible = true;
					this.flowloading = true;
					let para = { id:row.username,
								};
				checkFlowing(para).then((res) => {
					let todeals = res.data.toDeals;
					let senddeals = res.data.sendDeals;
					console.log(res.data.toDeals);
					for(var item = 0; item < todeals.length; item++){
						this.flows.push({senderName : todeals[item].from.name,
										acceptName : todeals[item].to.name,
										scores : todeals[item].score,
										time : c
										});
					}
				
					for(var item = 0; item < senddeals.length; item++){
						this.flows.push({senderName : senddeals[item].from.name,
										acceptName : senddeals[item].to.name,
										scores : senddeals[item].score,
										time : todeals[item].time ? (senddeals[item].time.year + '-' + senddeals[item].time.month + '-' + senddeals[item].time.day + ' ' + senddeals[item].time.hour + ':' + senddeals[item].time.minutes) : "时间被吃了"
										});
						console.log(item);
					}
					console.log("xixixiixixixi"+this.flows);
					this.flowloading = false;
				});
            },

            //删除用户
            handleDel: function (index, row) {
				this.refuseLoading = true;
				let para = { 
							username:row.username };
				deleteAdministrator(para).then((res) => {
					this.refuseLoading = false;
					this.$message({
						message: (res.data.code == "1") ? "删除成功" : "删除失败",
						type: (res.data.code == "1") ? "success" : "error"
					});
					this.getUser();
				});
            },
		},
	
		mounted() {
			this.getUser();
		}
	};

</script>

<style scoped>

</style>