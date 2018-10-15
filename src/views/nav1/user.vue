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
				<el-table-column type="index" width="50">
				</el-table-column>
				<el-table-column prop="name" label="昵称" width="120" sortable>
				</el-table-column>
				<el-table-column prop="gender" label="性别" width="100" :formatter="formatSex" sortable>
				</el-table-column>
				<el-table-column prop="college" label="大学" min-width="100" sortable>
				</el-table-column>
				<el-table-column prop="community" label="社团" min-width="180" sortable>
				</el-table-column>
				<el-table-column prop="tel" label="注册电话" min-width="100" sortable>
				</el-table-column>
				<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handlePass(scope.$index, scope.row)" :loading="passLoading">通过</el-button>
					<el-button type="small" size="small" @click="handleDel(scope.$index, scope.row)" :loading="refuseLoading">拒绝</el-button>
				</template>
			</el-table-column>
			</el-table>
		</template>

	</section>
</template>
<script>
	import { getRegisterUserList, passRegisterUser, refuseRegisterUser } from '../../api/api';
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
				//community:"",
			}
		},
		methods: {

			formatSex: function (row, column) {
				return row.gender == "1" ? '男' : row.gender == "0" ? '女' : '未知';
			},
			//获取用户列表
			getUser: function () {
					var user = sessionStorage.getItem('user');
					if (user) {
						user = JSON.parse(user);
					}
				let para = {
					name: this.filters.name,
					community: user.community,
					access:0
				};
				this.loading = true;
				//NProgress.start();
				
				getRegisterUserList(para).then((res) => {
					this.users = res.data.UsersInformation;
					this.loading = false;
					//NProgress.done();
				}).catch(() => {
					this.$message({
							message: "连接超时",
							type: "warning"
						});
				});
			},
			//通过
			handlePass:function(index, row) {
				this.loading = true;
				let para = { id:row.id,
							access:1 };
				passRegisterUser(para).then((res) => {
					this.loading = false;
					this.$message({
						message: res.data.code == "1" ? "操作成功":"操作失败",
						type: (res.data.code == "1") ? "success" : "error"
					});

					this.getUser();
				});
				
			},

			//拒绝
			handleDel: function (index, row) {
				this.loading = true;
				let para = { id:row.id ,
							access: -1 };
				refuseRegisterUser(para).then((res) => {
					this.loading = false;

					this.$message({
						message: res.data.code == "1" ? "操作成功":"操作失败",
						type: (res.data.code == "1") ? "success" : "error"
					});

					this.getUser();
					
				});
			},
		},

		mounted() {
			this.getUser();
			var user = sessionStorage.getItem('user');
			if (user) {
				user = JSON.parse(user);
				this.community = user.community;
			}
		}		
	}

</script>

<style scoped>

</style>