<template>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">账号注册</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm2.account" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item prop="checkPassTwo">
      <el-input type="password" v-model="ruleForm2.checkPassTwo" placeholder="确认密码"></el-input>
    </el-form-item>
    <el-form-item prop="college">
      <el-input type="text" v-model="ruleForm2.college" placeholder="大学名称"></el-input>
    </el-form-item>
    <el-form-item prop="community">
      <el-input type="text" v-model="ruleForm2.community" placeholder="社团名称"></el-input>
    </el-form-item>
    <el-form-item prop="tel">
      <el-input type="text" v-model="ruleForm2.tel" placeholder="电话"></el-input>
    </el-form-item>
    <el-form-item prop="name">
      <el-input type="text" v-model="ruleForm2.name" placeholder="真实姓名"></el-input>
    </el-form-item>
    <el-form-item prop="IDcard">
      <el-input type="text" v-model="ruleForm2.IDcard" placeholder="身份证号"></el-input>
    </el-form-item>

    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="registering">注册</el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>
  </el-form>
</template>

<script>
import { requestRegister } from "../api/api";
//import NProgress from 'nprogress'
export default {
  data() {
    return {
      registering: false,
      ruleForm2: {
        account: "",
        checkPass: "",
        checkPassTwo: "",
        community: "",
        college:"",
        tel: "",
        name: "",
        IDcard:""
      },
      rules2: {
        account: [
          { required: true, message: "请输入账号", trigger: "blur" }
          //{ validator: validaePass }
        ],
        checkPass: [
          { required: true, message: "请输入密码", trigger: "blur" }
          //{ validator: validaePass2 }
        ],
        checkPassTwo: [
          { required: true, message: "请确认密码", trigger: "blur" }
          //{ validator: validaePass2 }
        ],
        community: [
          { required: true, message: "请输入社团名称", trigger: "blur" }
          //{ validator: validaePass2 }
        ],
        tel: [
          { required: true, message: "请输入你的电话", trigger: "blur" }
          //{ validator: validaePass2 }
        ],
        name: [
          { required: true, message: "请输入你的真实姓名", trigger: "blur" }
          //{ validator: validaePass2 }
        ],
         IDcard:[
           { required: true, message: "请输入你的身份证号", trigger: "blur" }
         ]
      },
      checked: true
    };
  },
  methods: {
    handleReset2() {
      this.$refs.ruleForm2.resetFields();
    },
    handleSubmit2(ev) {
      var _this = this;
      this.$refs.ruleForm2.validate(valid => {
        if (valid) {
          //_this.$router.replace('/table');
          this.registering = true;
          //NProgress.start();
          var p4wd1 = this.ruleForm2.checkPass;
          var p4wd2 = this.ruleForm2.checkPassTwo;
          if (p4wd1 != p4wd2) {
            this.registering = false;
            console.log("error password!!");
            this.$message({
              message: "两次密码输入不一样",
              type: "error"
            });
          } else {
            var registerParams = {
              username: this.ruleForm2.account,
              password: this.ruleForm2.checkPass,
              community: this.ruleForm2.community,
              name: this.ruleForm2.name,
              tel: this.ruleForm2.tel,
              college: this.ruleForm2.college,
              IDcard: this.ruleForm2.IDcard,
              permission: 2
            };
            requestRegister(registerParams).then(res => {
              this.registering = false;
              //NProgress.done();

              this.$message({
                message: res.data.code == "200" ? "注册成功" : "信息有误",
                type: res.data.code == "200" ? "success" : "error"
              });
                  this.$router.push('/login');
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.login-container {
  /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
}
</style>