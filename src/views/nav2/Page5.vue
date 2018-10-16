<template>
	<el-form ref="form" :model="form" label-width="80px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
		<el-form-item label="商品名称">
			<el-input v-model="form.name"></el-input>
		</el-form-item>
		<el-form-item label="商品描述">
			<el-input type="textarea" v-model="form.content"></el-input>
		</el-form-item>
		<el-form-item label="商品价格">
			<el-col :span="6">
			<el-input type="number" v-model="form.price"></el-input>
			</el-col>
		</el-form-item>
    <el-form-item label="商品数量">
			<el-col :span="6">
			<el-input type="number" v-model="form.number"></el-input>
			</el-col>
		</el-form-item>
    <el-form-item label="商品性质">
			<template>
        <el-select v-model="form.feature" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </template>
		</el-form-item>
    

		<!---添加图片及上传-->
		<el-form-item label="商品图片">
			<el-upload 
			class="upload-demo" 
			accept="image/jpeg,image/gif,image/png"
			:before-upload="onBeforeUpload"
			multiple
			action="https://upload-z2.qiniup.com" 
			:limit='5' 
			:auto-upload="true" 
			:data="addform"
			:on-success="handleSuccess"
			:on-exceed='uploadOverrun' 
			ref="upload" 
			:on-change='changeUpload'
      :file-list="files">
				<el-button size="small" type="primary">点击上传</el-button>
				<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
			</el-upload>
		</el-form-item>

		<el-form-item>
			<el-button type="primary" @click.native ='submitAssess' :loading="listloading">立即创建</el-button>
			<el-button @click.native.prevent>取消</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
import { addModel, getQiniuUploadToken } from "../../api/api";

export default {
  data() {
    return {
      form: {
        name: "",
        price: "",
        describe: "AddGood",
        content: "",
        number: "",
        poster: "",
        nickName: "",
        shopKind: 0,
        feature:'',
        picture: []
      },
      addform: null,
      listloading: false,
        options: [{
          value: '1',
          label: '服装'
        }, {
          value: '2',
          label: '场地使用'
        }, {
          value: '3',
          label: '道具租赁'
        }, {
          value: '4',
          label: '摄影'
        }, {
          value: '5',
          label: '后期'
        }, {
          value: '6',
          label: '化妆'
        }],
    };
  },
  methods: {
    //根据点击上传按钮触发input
    onSubmit() {
      console.log("submit!");
    },

    uploadOverrun: function() {
      this.$message({
        type: "error",
        message: "上传文件个数超出限制!最多上传5张图片!"
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
        return getQiniuUploadToken(param)
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
      var imagekey = `https://qiniu.misswd.com/${response.key}`;
      this.form.picture.push(imagekey);
    },

    submitAssess: function() {
      //this.$refs.upload.submit(); //调用submit方法

      //其他业务代码

      var user = sessionStorage.getItem("user");
      if (user) {
        user = JSON.parse(user);
        this.form.poster = user.username;
        this.form.nickName = user.name;
      }
      this.listloading = true;
      let para = Object.assign({}, this.form);
      console.log(para);
      addModel(para)
        .then(res => {
          this.listloading = false;
          //NProgress.done();
          this.$message({
            message: res.data.code == "1" ? "操作成功" : "操作失败",
            type: res.data.code == "1" ? "success" : "error"
          });
          this.reload();
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped>
.image_upload {
  height: 60px;
  width: 60px;
  background: red;
}
</style>