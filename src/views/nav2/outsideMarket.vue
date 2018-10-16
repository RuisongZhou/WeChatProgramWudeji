<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="商品名称"></el-input>
				</el-form-item>
				<el-form-item>  
					<el-button type="primary" v-on:click="getModel">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>


		<el-row> 
			<el-col :span="4" v-for="(o, index) in models" :key="o" :offset="index > 0 ? 0.5: 0">
				<div  @click="viewModel(o)" id="box">
					<el-card :body-style="{ padding: '0px' }">
						<img v-bind:src="o.picture[0]" alt="加载失败" class="image" >
						<div style="padding: 14px;">
							<span>{{o.name}}</span>
							<div class="bottom clearfix">
								<div class="price">价格：{{ o.price }}积分</div>
							</div>
						</div>
					</el-card>
				</div>	
			</el-col>
		</el-row>
	
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--详情界面-->
		<el-dialog title="详情" v-model="FormVisible" :close-on-click-modal="false">
			<el-container :model="VisibleForm" ref="VisibleForm">
				<el-aside width="200px;" height="200px">
					<el-carousel indicator-position="inside" height="100">
						<el-carousel-item v-for="item in VisibleForm.picture" :key="item">
							<div align="center"><img v-bind:src="item" class="imagedetails"></div>
						</el-carousel-item>
					</el-carousel>
				</el-aside>
				<el-container>
					<el-header><h2>{{VisibleForm.name}}</h2></el-header>
					<el-main>
						<h4>价格：{{VisibleForm.price}} 积分</h4>
						<h4>最高使用积分：{{VisibleForm.scoreUse}}</h4>
					</el-main>
					<el-footer>
						<div slot="footer" class="dialog-footer" scope="scope">
							<el-button @click.native="editVersion(VisibleForm)">修改</el-button>
							<el-button type="danger" @click.native="DelSubmit(VisibleForm)" :loading="editLoading">删除</el-button>
						</div>
					</el-footer>
				</el-container>
			</el-container>
		</el-dialog>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" ref="editForm">
				<el-form-item label="最高使用积分" prop="price">
					<el-col :span="6">
						<el-input   type="number" :min="0" :max="this.VisibleForm.price/10" v-model="editForm.scoreUse" auto-complete="off"></el-input>
					</el-col>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

	</section>
</template>

<script>
import util from "../../common/js/util";
import { getOutModelListPage, removeOutModel, editOutModel } from "../../api/api";

export default {
  data() {
    return {
      filters: {
        name: ""
      },
      models: [],
      total: 0,
      page: 1,
      listLoading: false,
      FormVisible: false,
      sels: [], //列表选中列
      VisibleForm: {
        name: "",
        price: 0,
        scoreUse: 0
      },
      editLoading: false,
      editFormVisible: false, //编辑界面是否显示
      //编辑界面数据
      editForm: {
        scoreUse: ""
      }
    };
  },
  methods: {
    //查看详情
    viewModel: function(model) {
      // `this` 在方法里指向当前 Vue 实例
      this.FormVisible = true;
      this.VisibleForm = Object.assign({}, model);
    },

    //获取商品列表
    getModel() {
      let para = {
        page: this.page,
        name: this.filters.name,
        shopKind: 0
      };
      var user = sessionStorage.getItem("user");
      user = JSON.parse(user);
      if (user.permission != "3") {
        return;
      }
      this.listLoading = true;
      //NProgress.start();
      getOutModelListPage(para)
        .then(res => {
          this.total = res.data.total;
          this.models = res.data.models;
          for (var i = 0; i < this.models.length; i++) {
            if (
              typeof this.models[i].picture == "string" &&
              this.models[i].picture.constructor == String
            )
              this.models[i].picture = this.models[i].picture.split(",");
          }
          //console.log(this.models);
          this.listLoading = false;
          //NProgress.done();
        })
        .catch(() => {
          this.$message({
            message: "连接超时",
            type: "warning"
          });
        });
    },

    //显示更改商品界面
    editVersion: function(VisibleForm) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, VisibleForm);
      this.editForm.goodId = VisibleForm._id;
    },

    //提交更改
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            //NProgress.start();

            let para = Object.assign({}, this.editForm);
            console.log(para);
            editOutModel(para).then(res => {
              this.editLoading = false;
              //NProgress.done();
              this.$message({
                message: res.data.code == "1" ? "操作成功" : "操作失败",
                type: res.data.code == "1" ? "success" : "error"
              });
              this.$refs["editForm"].resetFields();
              this.editFormVisible = false;
              this.getModel();
            });
          });
        }
      });
    },

    //删除
    DelSubmit: function(VisibleForm) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.editLoading = true;
          //NProgress.start();

          var user = sessionStorage.getItem("user");
          user = JSON.parse(user);
          var username = user.name;
          let para = {
            id: VisibleForm._id
          };
          removeOutModel(para).then(res => {
            this.editLoading = false;
            //NProgress.done();
            this.$message({
              message: res.data.code == "1" ? "操作成功" : "操作失败",
              type: res.data.code == "1" ? "success" : "error"
            });
            this.FormVisible = false;
            this.getModel();
          });
        })
        .catch(() => {});
    },

    selsChange: function(sels) {
      this.sels = sels;
    }
  },
  mounted() {
    this.getModel();
  }
};
</script>

<style scoped>
#box ul {
  display: flex;
  flex-wrap: wrap;
  max-height: 100%;
}
#box li {
  padding: 3px;
  list-style: none;
  margin-right: 15px;
  border: 1px solid #eee;
}
#box img {
  width: 200px;
  height: 150px;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

.price {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  height: 100%;
  display: block;
  margin: 0 auto;
}

.imagedetails {
  height: 100%;
  max-height: 300px;
  overflow: hidden;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
</style>