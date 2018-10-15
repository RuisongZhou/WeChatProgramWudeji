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
				<el-table-column prop="name" label="姓名" width="120" sortable>
				</el-table-column>
				<el-table-column prop="community" label="社团名称" min-width="120" sortable>
				</el-table-column>
				<el-table-column prop="college" label="大学名称" min-width="180" sortable>
				</el-table-column>
				<el-table-column prop="tel" label="注册电话" min-width="120" sortable>
				</el-table-column>
                <el-table-column prop="username" label="注册账户" min-width="130" sortable>
				</el-table-column>
				<el-table-column prop="IDcard" label="身份证号" min-width="130" sortable>
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
import {
  getAdminList,
  passRegisterAdministrator,
  refuseRegisterAdministrator
} from "../../api/api";
//import NProgress from 'nprogress'
export default {
  data() {
    return {
      filters: {
        name: ""
      },
      loading: false,
      users: [],
      refuseLoading: false,
      passLoading: false
    };
  },
  methods: {
    //获取用户列表
    getUser: function() {
      var user = sessionStorage.getItem("user");
      if (user) {
        user = JSON.parse(user);
        if (user.permission != "3") return;
      }
      let para = {
        name: this.filters.name,
        username: user.username,
        access: 0 //register
      };
      this.loading = true;
      //NProgress.start();
      getAdminList(para)
        .then(res => {
          this.users = res.data.UsersInformation;
          this.loading = false;
          //NProgress.done();
        })
        .catch(() => {
          this.$message({
            message: "连接超时",
            type: "warning"
          });
        });
    },
    //通过
    handlePass: function(index, row) {
      this.passLoading = true;
      let para = {
        username: row.username,
        access: 1
      };
      passRegisterAdministrator(para).then(res => {
        this.passLoading = false;
        this.$message({
          message: res.data.code == "1" ? "操作成功" : "操作失败",
          type: res.data.code == "1" ? "success" : "error"
        });
        this.getUser();
      });
    },

    //拒绝
    handleDel: function(index, row) {
      this.refuseLoading = true;
      let para = {
        id: row.id,
        username: row.username,
        access: -1
      };
      refuseRegisterAdministrator(para).then(res => {
        this.refuseLoading = false;
        this.$message({
          message: res.data.code == "1" ? "操作成功" : "操作失败",
          type: res.data.code == "1" ? "success" : "error"
        });
        this.getUser();
      });
    }
  },

  mounted() {
    this.getUser();
  }
};
</script>

<style scoped>
</style>