<template>
    <div class="box">
        <div class="login_box">
<!--            //头像区域-->
            <div class="avatar-box">
                <img src="../../assets/logo.png" alt="" />
            </div>
<!--            //登录区域-->
            <el-form class="login_form" :model="LoginForm" :rules="LoginFromRule" ref="LoginFormRef">
<!--                //用户名-->
                <el-form-item prop="username">
                    <el-input prefix-icon="iconfont icon-user" v-model="LoginForm.username"></el-input>
                </el-form-item>
<!--                //密码-->
                <el-form-item prop="password">
                    <el-input prefix-icon="iconfont icon-3702mima" type="password" v-model="LoginForm.password"></el-input>
                </el-form-item>
<!--                //按钮区域-->
                <el-form-item class="btns">
                    <el-button type="primary" @click="Login()">登录</el-button>
                    <el-button type="info" @click="ResetLogin()">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data(){
            return{
                LoginForm:{
                    //账户名
                    username:'admin',
                    //密码
                    password:'123456'
                },
                //这是表单的验证规则对象
                LoginFromRule:{
                    //验证用户名是否规范
                    username:[
                        { required: true, message: '请输入登录用户名', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在3到10个字符', trigger: 'blur' }
                    ],
                    //验证密码是否规范
                    password:[
                        { required: true, message: '请输入登录密码', trigger: 'blur' },
                        { min: 6, max: 15, message: '长度在6到15个字符', trigger: 'blur' }
                    ]
                }
            }
        },
        methods:{
            //点击重置按钮，实现重置数据
            ResetLogin(){
                this.$refs.LoginFormRef.resetFields();
            },
            //点击按钮,登录验证
            Login(){
                this.$refs.LoginFormRef.validate(async(valid)=>{
                    if(!valid) return;
                    const {data:res} = await this.$http.post("login",this.LoginForm);
                    console.log(res);
                    if(res.meta.status !== 200) return  this.$message.error("登陆失败");
                    this.$message.success("登陆成功");
                    window.sessionStorage.setItem("token",res.data.token);
                    this.$router.push("/HomePage");
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
.box{
    width: 100%;
    height: 100%;
    background: #2B4B6B;
    .login_box{
        width: 35%;
        height: 300px;
        background: white;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        .avatar-box{
            width: 130px;
            height: 130px;
            border: 1px #ddd solid;
            border-radius: 50%;
            padding: 10px;
            box-shadow: 0 0 10px #ddd;
            position: absolute;
            left: 50%;
            transform: translate(-50%,-50%);
            background-color: #fff;
            img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #eeeeee;
            }
        }
        .login_form{
            position: absolute;
            bottom: 0;
            width: 100%;
            padding: 0 25px;
            box-sizing: border-box;
            .btns{
                display: flex;
                justify-content: flex-end;
            }
        }
    }
}
</style>