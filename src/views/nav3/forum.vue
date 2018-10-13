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
		<el-table :data="users" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="name" label="版块名" width="300" sortable>
			</el-table-column>
			<el-table-column prop="description" label="描述" width="400"  sortable>
			</el-table-column>
			<el-table-column prop="time" label="时间" width="300" sortable>
			</el-table-column>
			<el-table-column  label="图片" width="200" sortable>
				<img src ='row.picture'  width="200" height="200">
			</el-table-column>
			<el-table-column label="操作" width="300">
				<template scope="scope">
					<el-button size="small" @click="handleView(scope.$index, scope.row)">查看板块</el-button>
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑板块</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column> 	
		</el-table>

		<!--查看帖子界面-->
		<el-dialog title="详情" v-model="blogsFormVisible" :close-on-click-modal="false">
			<el-table :data="BlogList" v-loading="blogsLoading" ref="BlogList" style="width: 100%;">
				<el-table-column type="index" width="60">
				</el-table-column>
				<el-table-column prop="theme" label="帖子主题" width="200" sortable>
				</el-table-column>
				<el-table-column prop="poster.nickName" label="发布者" width="200" sortable>
				</el-table-column>
				<el-table-column prop="posttime" label="时间" width="200" sortable>
				</el-table-column>
					<el-table-column label="操作" width="200">
					<template scope="scope">
						<el-button type="danger" size="small" @click="handleDelBlog(scope.$index, scope.row)" :loading="deleteLoading">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-dialog>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="版块名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="板块描述">
					<el-input type='textarea' v-model="editForm.description" auto-complete="off"></el-input>
				</el-form-item>		
				<!---添加图片及上传-->
				<el-form-item label="板块头像(可选)">
					<el-upload 
					class="upload-demo" 
					accept="image/jpeg,image/gif,image/png"
					:before-upload="onBeforeUpload"
					action="https://upload-z2.qiniup.com" 
					:auto-upload="true" 
					:data="addform"
					:on-success="handleSuccess"
					ref="upload" 
					:on-change='changeUpload'
					:file-list="files">
						<el-button size="small" type="primary">点击上传</el-button>
						<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
					</el-upload>
				</el-form-item>
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
					<el-form-item label="版块名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="板块描述">
					<el-input type='textarea' v-model="addForm.description" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="是否为系统板块">
						<el-radio-group v-model="addForm.isSystem">
							<el-radio label="是"></el-radio>
							<el-radio label="否"></el-radio>
				</el-radio-group>
				</el-form-item>		
				
				<!---添加图片及上传-->
				<el-form-item label="板块头像(可选)">
					<el-upload 
					class="upload-demo" 
					accept="image/jpeg,image/gif,image/png"
					:before-upload="onBeforeUpload"
					action="https://upload-z2.qiniup.com" 
					:auto-upload="true" 
					:data="addform"
					:on-success="handleSuccess"
					ref="upload" 
					:on-change='changeUpload'
					:file-list="files">
						<el-button size="small" type="primary">点击上传</el-button>
						<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
					</el-upload>
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
import util from "../../common/js/util";
//import NProgress from 'nprogress'
import {
  getBoardList,
  removeBoard,
  editBoard,
  addBoard,
  getQiniuUploadToken,
  removeBlog,
  getBlogList
} from "../../api/api";

export default {
  data() {
    return {
      users: [],
      srcOfImage:"",	
      listLoading: false,

      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        name: [{ required: true, message: "请输入板块名" }]
      },
      //编辑界面数据
      editForm: {
        id: "",
				name: "",
				description:"",
				//time:"",
				imagesrc:""
	  },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [
          { required: true, message: "请输入板块名", trigger: "blur" },
          { min: 1, trigger: "blur" }
        ],
        description: [{ required: true, message: "请输入板块描述", trigger: "blur" }],
      },
      //新增界面数据
      addForm: {
        id: "",
			name: "",
			description:"",
			//time:"",
			imagesrc:"",
			isSystem: 0,
		},
	  //帖子界面是否显示
	  blogsFormVisible:false,
	  blogsLoading:false,
	  BlogList:[],
	  deleteLoading:false,
    };

		//板块id
		boardId: "";
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val;
      this.getBoards();
    },
    //获取板块列表
    getBoards: function() {
		var user = sessionStorage.getItem('user');
		user = JSON.parse(user);
       	let para = {
      };
      this.listLoading = true;
      //NProgress.start();
      getBoardList(para).then(res => {
        this.users = res.data.Boards;
				this.users.forEach((e) => {
						e.time = e.time ? (e.time.year + '-' + e.time.month + '-' + e.time.day + ' ' + e.time.hour + ':' + e.time.minutes) : "时间被吃了"
					})
        this.listLoading = false;
        //NProgress.done();
      });
    },
    //删除
    handleDel: function(index, row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = Object.assign({}, row);
          removeBoard({ id: para._id }).then(res => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
							message: (res.data.code == "1"	) ? "操作成功" : "操作失败",
								type: (res.data.code == "1"	) ? "success" : "error"
					});
            this.getBoards();
          });
        })
        .catch(() => {});
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
			this.editForm.id = row._id;
    },
    //显示新增界面
    handleAdd: function() {
      this.addFormVisible = true;
     this.$refs["addForm"].resetFields();
	},
	
	//显示帖子页面 
	handleView: function(index, row) {
		this.blogsFormVisible = true;
		this.blogsLoading = true;
		let para = {
			board:row._id,
			describe :'getPostBlogs'
		};
		this.boardId = row._id;
		getBlogList(para).then((res) => {
			this.BlogList = res.data.PostBlogs;
			this.BlogList.forEach((e) => {
						e.posttime = e.time ? (e.time.year + '-' + e.time.month + '-' + e.time.day + ' ' + e.time.hour + ':' + e.time.minutes) : "时间被吃了"
					})
			this.blogsLoading = false;
			//console.log(this.BlogList);
		})
	},
    //编辑
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
			//NProgress.start();
						this.editForm.imagesrc = this.srcOfImage ? this.srcOfImage : "";
            let para = Object.assign({}, this.editForm);
						console.log(para);
            editBoard(para).then(res => {
              this.editLoading = false;
              //NProgress.done();
              this.$message({
								message: (res.data.code == "1"	) ? "操作成功" : "操作失败",
								type: (res.data.code == "1"	) ? "success" : "error"
						});
              this.$refs["editForm"].resetFields();
              this.editFormVisible = false;
              this.getBoards();
            });
          });
        }
      });
    },
    //新增
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
						//NProgress.start();
						this.addForm.imagesrc = this.srcOfImage;
						this.addForm.isSystem = this.addForm.isSystem == '是'?"1" : "0";
						let para = Object.assign({}, this.addForm);

            addBoard(para).then(res => {
              this.addLoading = false;
              //NProgress.done();
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$refs["addForm"].resetFields();
              this.addFormVisible = false;
              this.getBoards();
            });
          });
        }
      });
    },
	
	 onBeforeUpload(file) {
      const isIMAGE = file.type === "image/jpeg" || "image/gif" || "image/png";
      const isLt1M = file.size / 1024 / 1024 / 2 < 1;

      if (!isIMAGE) {
        this.$message.error("上传文件只能是图片格式!"); 
        return;
      }
      if (!isLt1M) {
        this.$message.error("上传文件大小不能超过500KB!"); 
        return;
      }

      if (isIMAGE && isLt1M) {
        let param = {
          fileName: file.name
        };
        getQiniuUploadToken(param)
          .then(res => {
            if (res.data.code === "1") {
              this.addform = {
                key: res.data.result.fileName,
                token: res.data.result.uploadToken
              };
            } else {
              this.$message.error("上传图片失败");
            }
          })
          .catch(() => {
            this.$message.error("上传图片失败");
          });
      }
    },
    changeUpload: function(file, fileList) {
      //预览图片
      this.fileList = fileList;
      this.$nextTick(() => {
        let upload_list_li = document.getElementsByClassName(
          "el-upload-list"
        )[0].children;
        for (let i = 0; i < upload_list_li.length; i++) {
          let li_a = upload_list_li[i].children[0];
          let imgElement = document.createElement("img");
          imgElement.setAttribute("src", fileList[i].url);
          imgElement.setAttribute("style", "max-width:50%;padding-left:25%");
          if (li_a.lastElementChild.nodeName !== "IMG") {
            li_a.appendChild(imgElement);
          }
        }
      });
    },

    handleSuccess(response, file, fileList) {
      var imagekey = `http://pg6q6hwnq.bkt.clouddn.com/${response.key}`;
      this.srcOfImage = imagekey;
 
	},


	//删除帖子
	handleDelBlog: function(index, row) {
		this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.deleteLoading = true;
					let para = {
						id: row._id,
					};
					removeBlog(para).then((res) => {
						this.deleteLoading = false;
						this.$message({
								message: (res.data.code == "1"	) ? "操作成功" : "操作失败",
								type: (res.data.code == "1"	) ? "success" : "error"
							});
							let param = {
						board:this.boardId,
						describe :'getPostBlogs'
						};
						getBlogList(param).then((res) => {
							this.BlogList = res.data.PostBlogs;
							this.BlogList.forEach((e) => {
										e.posttime = e.time ? (e.time.year + '-' + e.time.month + '-' + e.time.day + ' ' + e.time.hour + ':' + e.time.minutes) : "时间被吃了"
									})
							//console.log(this.BlogList);
					})
					});
				}).catch(() => {

				});
	},
  },
	mounted() {
		this.getBoards();
	}
};
</script>

<style scoped>
</style>
