<template>
	<section>
		<!--工具条-->
		<template>
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-select v-model="value" placeholder="请选择">
				<el-option
					v-for="item in options"
					:key="item.value"
					:label="item.label"
					:value="item.value"
					@click.native="DelFeature">
				</el-option>
			</el-select>
			</el-col>
		</template>
		<p>此商品是内部商城的</p>
		<template>
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
		</template>
		<!--列表-->
		<!--
		 <div class="" id="box">
		<ul>
			<li v-for="v in models">
				<div @click="viewModel(v)">
					<img v-bind:src="v.src" alt="" >
					<h4>{{v.name}}</h4>
					<p>价格：{{v.price}}积分</p>
				</div>
			</li>
		</ul>
	</div> 
	-->
	
		<!--工具条-->
		<el-col :span="24" class="toolbar">
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
						<h4>商家：{{VisibleForm.nickName}}</h4>
						<h4>价格：{{VisibleForm.price}} 积分</h4>
						<h4>库存：{{VisibleForm.number}}</h4>
						<h4>描述：{{VisibleForm.content}}</h4>
						<h4>分类：{{dealFeature(VisibleForm.feature)}}</h4>
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
				<el-form-item label="商品名称" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="价格" prop="price">
					<el-col :span="6">
						<el-input   type="number" :min="0" :max="200" v-model="editForm.price" auto-complete="off"></el-input>
					</el-col>
				</el-form-item>
				<el-form-item label="库存" prop="total">
					<el-col :span="6">
						<el-input  type="number" :min="1" v-model="editForm.number" auto-complete="off"></el-input>
					</el-col>
				</el-form-item>
				<el-form-item label="描述" prop="content">
					<el-input  type="textarea" v-model="editForm.content" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="商品性质">
					<template>
						<el-select v-model="editForm.feature" placeholder="请选择">
							<el-option
								v-for="item in options"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
					</template>
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
//import NProgress from 'nprogress'
import { getModelListPage, removeModel, editModel } from "../../api/api";

export default {
  data() {
    return {
      filters: {
        name: ""
      },
			models: [],
			allmodels:[],
      total: 0,
      page: 1,
      listLoading: false,
      FormVisible: false,
      sels: [], //列表选中列
      VisibleForm: {},
      editLoading: false,
      editFormVisible: false, //编辑界面是否显示
      //编辑界面数据
      editForm: {
        goodId: "",
        name: "",
        price: 0,
        describe: "ChangeGood",
        content: "",
        poster: "",
        number: "",
        picture: [],
        shopKind: "0",
        nickName: "",
        feature: ""
      },
      options: [
        {
          value: "1",
          label: "服装"
        },
        {
          value: "2",
          label: "场地使用"
        },
        {
          value: "3",
          label: "道具租赁"
        },
        {
          value: "4",
          label: "摄影"
        },
        {
          value: "5",
          label: "后期"
        },
        {
          value: "6",
          label: "服装"
        }
			],
			value:'',
    };
  },
  methods: {
    //查看详情
    viewModel: function(model) {
      // `this` 在方法里指向当前 Vue 实例
      this.FormVisible = true;
      this.VisibleForm = Object.assign({}, model);
    },

    handleCurrentChange(val) {
      this.page = val;
      this.getModel();
		},
		DelFeature:function() {
			this.models = this.allmodels.filter(model => {
				if (this.value && model.feature.indexOf(this.value) == -1) return false;
				return true;
			})
		},
    //商品特征分类
    dealFeature: function(e) {
      switch (e) {
        case "1":
          return "服装";
        case "2":
          return "场地使用";
        case "3":
          return "道具租赁";
        case "4":
          return "摄影";
        case "5":
          return "后期";
        case "6":
          return "化妆";
      }
    },
    //获取商品列表
    getModel() {
      let para = {
        page: this.page,
        name: this.filters.name,
        shopKind: 0
      };
      this.listLoading = true;
      //NProgress.start();
      getModelListPage(para)
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
          this.allmodels = this.models;
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
            var user = sessionStorage.getItem("user");
            user = JSON.parse(user);
            var username = user.name;
            if (user.permission != "3" && username != this.editForm.nickName) {
              this.editLoading = false;
              //NProgress.done();
              this.$message({
                message: "你不是此商品的发布者",
                type: "warning"
              });
              return;
            }
            this.editForm.poster = user._id;
            this.editForm.nickName = user.name;
            this.editForm.describe = "ChangeGood";
            let para = Object.assign({}, this.editForm);
            console.log(para);
            editModel(para).then(res => {
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
          if (user.permission != "3" && username != this.editForm.nickName) {
            this.editLoading = false;
            //NProgress.done();
            this.$message({
              message: "你不是此商品的发布者",
              type: "warning"
            });
            return;
          }
          let para = {
            //goodId: VisibleForm._id,
            //id : user.id,
            //describe : "DeleteGood"
            id: VisibleForm._id
          };
          removeModel(para).then(res => {
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