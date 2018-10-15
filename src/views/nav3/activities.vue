<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="activities" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="50">
			</el-table-column>
			<el-table-column prop="name" label="活动名称" width="150" sortable>
			</el-table-column>
			<el-table-column prop="description" label="描述" width="250"  sortable>
			</el-table-column>
			<el-table-column prop="date" label="日期" width="200" sortable>
			</el-table-column>
			<el-table-column prop="time" label="时间" width="200" sortable>
			</el-table-column>
			<el-table-column prop="place" label="地点" width="200" sortable>
			</el-table-column>
			<el-table-column prop="launchCommunity" label="发起社团" width="200" sortable>
			</el-table-column>
			<el-table-column label="操作" width="250" >
				<template scope="scope">
					<el-button size="small" @click="handleView(scope.$index, scope.row)">查看报名</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)" :loading="deleteLoading">删除</el-button>
				</template>
			</el-table-column> 	
		</el-table>

		<!--查看报名表-->
		<el-dialog title="活动报名表" v-model="FormVisible" :close-on-click-modal="false" style="width: 100%;">
			<el-table :data="signUpList" v-loading="SighLoading" ref="signUpList" style="width: 100%;">
				<el-table-column type="index" width="60">
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
			</el-table>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="活动名称">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="活动描述">
					<el-input type='textarea' v-model="addForm.description" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="活动地点">
					<el-input v-model="addForm.place" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="活动时间">
					<el-col :span="11">
						<el-date-picker type="date" placeholder="选择日期" v-model="addForm.date" style="width: 100%;"></el-date-picker>
					</el-col>
					<el-col class="line" :span="2">-</el-col>
					<el-col :span="11">
						<el-time-picker type="fixed-time" placeholder="选择时间" v-model="addForm.time" style="width: 100%;"></el-time-picker>
					</el-col>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
import {getActivitiesList,
		addActivity,
		deleteActivity,
		getSighList,
		} from '../../api/api';
import util from '../../common/js/util';
export default {
	data () {
		return {
			//拉取列表
			activities:[],
			listLoading:false,

			//活动报名表
			FormVisible:false,
			SighLoading:false,
			signUpList:[],

			//新增活动
			addLoading:false,
			addFormVisible:false,
			addForm:{
				name:'',
				description:'',
				place:'',
				data:'',
				time:'',
				launchCommunity:''
			},
			addFormRules:{
				name: [
				{ required: true, message: "请输入活动名称", trigger: "blur" }
				],
				description: [
				{ required: true, message: "请输入活动描述", trigger: "blur" }
				],
				data: [
				{ required: true, message: "请输入活动时间", trigger: "blur" }
				],
				place: [
				{ required: true, message: "请输入活动描述", trigger: "blur" }
				],
			},

			//删除活动
			deleteLoading:false,
		}
	},

	methods: {
		//性别显示转换
		formatSex: function (row, column) {
			return row.gender == "1" ? '男' : row.gender == "0" ? '女' : '未知';
		},

		//拉取活动列表
		getActivities() {
			var user = sessionStorage.getItem('user');
			if (user) {
					user = JSON.parse(user);
				} 
			let para = {
				permission: user.permission,
				community: user.community,
			}
			this.listLoading = true;
			getActivitiesList(para).then((res) => {
				this.activities = res.data.activities;
				this.listLoading = false;
			}).catch(() => {
				this.$message({
						message: "连接超时",
						type: "warning"
					});
			})
		},

		//添加活动表显示
		handleAdd: function() {
			this.addFormVisible = true;
			var user = sessionStorage.getItem('user');
			if (user) {
					user = JSON.parse(user);
				}
			this.addForm.launchCommunity = user.community;
		},

		//活动提交
		addSubmit: function() {
			this.$refs.addForm.validate(valid => {
				if (valid) {
					this.$confirm("确认提交吗？", "提示", {}).then(() => {
						this.addLoading = true;
						let para = Object.assign({}, this.addForm);
						 addActivity(para).then(res => {
							this.addLoading = false;

							this.$message({
								message: (res.data.code == "1"	) ? "提交成功" : "提交失败",
                				type: (res.data.code == "1"	) ? "success" : "error"
							});
							this.$refs["addForm"].resetFields();
							this.addFormVisible = false;
							this.getActivities();
						});
					})
				}
			})
		},

		//查看报名表
		handleView: function(index, row) {
			this.FormVisible = true;
			this.SighLoading = true;
			let para = {
				id: row._id,
			};
			getSighList(para).then((res) => {
				this.signUpList = res.data.signUpList;
				this.SighLoading = false;
			});
		},

		//删除活动
		handleDel: function(index, row) {
			let para = {
				id: row._id,
			};
			this.deleteLoading = true;
			deleteActivity(para).then((res) => {
				this.deleteLoading = false;
				this.$message({
						message: (res.data.code == "1"	) ? "提交成功" : "提交失败",
						type: (res.data.code == "1"	) ? "success" : "error"
					});
				this.getActivities();

			})
		},

	},
	mounted() {
		this.getActivities();
	}
}
</script>
