<template>
    <div class="box">
<!--        面包屑导航区域-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/HomePage' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
<!--        卡片区域-->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <!--//搜索与添加区域-->
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
<!--            //用户列表数据-->
            <el-table :data="userList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态" prop="mg_state">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200px">
                    <template slot-scope="scope">
<!--                        修改按钮-->
                         <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
<!--                        删除按钮-->
                         <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
<!--                        分配按钮-->
                         <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                             <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
                         </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
<!--            //分页功能-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[2,5,10,15]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>
<!--        //添加用户的对话框-->
        <el-dialog
                title="添加用户"
                :visible.sync="addDialogVisible"
                width="50%"
                @close="addDialogClosed"
                >
<!--            //内容主体区域-->
                <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="addForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="addForm.password" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="addForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model="addForm.mobile"></el-input>
                    </el-form-item>
                </el-form>
<!--            //底部区域-->
            <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">添加</el-button>
          </span>
        </el-dialog>
<!--        修改数据的对话框-->
        <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="emile">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
        </el-dialog>
<!--        //修改分配权限的-->
        <el-dialog
                title="分配角色"
                :visible.sync="setRoleDialogVisible"
                width="50%"
                @close="setRoleDialogClosed"
        >
            <div>
                <p>当前的用户:{{userInfo.username}}</p>
                <p :style="{marginTop:'15px'}">当前的角色:{{userInfo.role_name}}</p>
                <p :style="{marginTop:'15px'}">
                    分配新角色:
                    <el-select v-model="selectedRoleId" placeholder="请选择">
                        <el-option
                                v-for="item in rolesList"
                                :key="item.id"
                                :label="item.roleName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Users",
        data(){
            //验证邮箱规则
            var checkEmail = (rule,value,cb)=>{
                const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
                if(regEmail.test(value)){
                    //合法的邮箱
                    return cb()
                }else{
                    cb(new Error('请输入合法的邮箱'))
                }
            }
            //验证手机号规则
            var checkMobile = (rule,value,cb)=>{
                //手机号的正则表达
                let regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
                if (regMobile.test(value)) {
                    cb()
                } else {
                    cb(new Error('手机号码格式不正确'))
                }
            }
            return{
                //获取用户列表的参数对象
                queryInfo:{
                    query:'',
                    //当前的页数
                    pagenum:1,
                    //当前每页显示的数据 有多少条
                    pagesize:2
                },
                //用户列表数据
                userList:[],
                total:0,
                //控制添加用户对话框的显示与隐藏
                addDialogVisible:false,
                //添加用户的数据对象
                addForm:{
                    username:'',
                    password:'',
                    email:'',
                    mobile:''
                },
                //添加表单的验证规则对象
                addFormRules:{
                    username:[
                        {required:true,message:'请输入用户名',trigger:'blur'},
                        {min:3,max:10,message:'用户名长度在3~10个字符之间',trigger:"blur"}
                    ],
                    password:[
                        {required:true,message:'请输入密码',trigger:'blur'},
                        {min:6,max:15,message:'密码长度在6~15个字符之间',trigger:"blur"}
                    ],
                    email:[
                        {required:true,message:'请输入邮箱',trigger:'blur'},
                        {min:6,max:25,message:'邮箱长度在6~15个字符之间',trigger:"blur"},
                        {validator:checkEmail,trigger: 'blur'},
                    ],
                    mobile:[
                        {required:true,message:'请输入手机',trigger:'blur'},
                        {min:11,max:11,message:'手机号长度在11个字符',trigger:"blur"},
                        {validator:checkMobile,trigger: 'blur'},
                    ],
                },
                //控制修改对象的对话框的显示与隐藏
                editDialogVisible:false,
                //查询到的用户信息对象
                editForm:{},
                // 修改表单的验证规则对象
                editFormRules:{
                    email:[
                        {required:true,message:'请输入邮箱',trigger:'blur'},
                        {min:6,max:25,message:'邮箱长度在6~15个字符之间',trigger:"blur"},
                        {validator:checkEmail,trigger: 'blur'},
                    ],
                    mobile:[
                        {required:true,message:'请输入手机',trigger:'blur'},
                        {min:11,max:11,message:'手机号长度在11个字符',trigger:"blur"},
                        {validator:checkMobile,trigger: 'blur'},
                    ],
                },
                //控制分配角色对话框的显示与隐藏
                setRoleDialogVisible:false,
                //需要被分配权限的角色用户信息
                userInfo:{},
                //所有角色的数据列表
                rolesList:{},
                //当前选中的id值
                selectedRoleId:''
            }
        },
        created(){
            this.getUserList();
        },
        methods: {
            async getUserList() {
                const {data: res} = await this.$http.get('users', {params: this.queryInfo});
                // console.log(res);
                if (res.meta.status !== 200) {
                    return this.$message.error("获取用户列表失败");
                } else {
                    this.userList = res.data.users;
                    this.total = res.data.total;
                }
            },
            //监听pagesize改变的 事件
            handleSizeChange(NewSize) {
                this.queryInfo.pagesize = NewSize;
                // console.log(NewSize);
                this.getUserList();
            },
            //监听 页码值 改变的事件
            handleCurrentChange(NewPage) {
                this.queryInfo.pagenum = NewPage;
                // console.log(NewPage);
                this.getUserList();
            },
            //监听switch 开关状态的 改变
            async userStateChanged(userinfo) {
                console.log(userinfo);
                let {data: res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`);
                // console.log(res);
                if (res.meta.status !== 200) {
                    userinfo.mg_state = !userinfo.mg_state;
                    return this.$message.error("更新用户状态失败");
                } else {
                    this.$message.success("更新用户状态成功");
                }
            },
            //添加用户对话框关闭 后的事件
            addDialogClosed() {
                this.$refs.addFormRef.resetFields();
            },
            //点击按钮 实现 添加用户操作
            addUser() {
                this.$refs.addFormRef.validate(async valid => {
                    // console.log(valid)
                    if (!valid) return
                    //可以发送请求
                    const {data: res} = await this.$http.post("users", this.addForm)
                    // console.log(res);
                    if (res.meta.status !== 201) {
                        this.$message.error("添加用户失败")
                    }
                    this.$message.success("添加用户成功")
                    this.addDialogVisible = false;
                    this.getUserList();
                })
            },
            //修改数据 ， 编辑数据的对话框
            async showEditDialog(id){
                // console.log(id);
                const {data: res} = await this.$http.get('users/'+id);
                if (res.meta.status !== 200) {
                    return this.$message.error("查询用户信息错误");
                }
                this.editForm= res.data;
                this.editDialogVisible = true;
            },
            //监听修改对话框关闭事件
            editDialogClosed(){
                this.$refs.editFormRef.resetFields();
            },
            //修改用户信息
            editUserInfo(){
                this.$refs.editFormRef.validate(async valid => {
                    // console.log(valid);
                    if(!valid) return
                    //发起请求
                    const {data:res} = await this.$http.put('users/'+this.editForm.id,{
                        email:this.editForm.email,
                        mobile:this.editForm.mobile
                    });
                    if(res.meta.status !== 200){
                        return this.$message.error("更新用户信息失败");
                    }else{
                        this.editDialogVisible = false;
                        this.getUserList();
                        this.$message.success("更新用户信息成功");
                    }
                })
            },
            async deleteUser(id){
                const configResult  = await this.$confirm(
                    '此操作将永久删除该用户,是否继续?',
                    '提示',
                    {
                        confirmButtonText:'确定',
                        cancelButtonText: '取消',
                        type:'warning'
                    }
                ).catch(err=>err)
                if(configResult !== 'confirm'){
                    this.$message.info("已经取消");
                }else{
                    const {data:res} = await this.$http.delete('users/'+id);
                    if(res.meta.status !== 200){
                        this.$message.error("删除用户失败");
                    }else{
                        this.$message.success("删除用户成功");
                        this.getUserList();
                    }
                }
            },
            //展示分配角色的对话框
            async setRole(userInfo){
                this.userInfo = userInfo;
                //在展示对话框之前 先获取所有角色列表
                const {data:res} = await this.$http.get('roles');
                if(res.meta.status !== 200){
                    return this.$message.error("获取角色列表失败");
                }
                this.rolesList = res.data;
                this.setRoleDialogVisible = true;
            },
            //点击确定 分配 角色
            async saveRoleInfo(){
                if(!this.selectedRoleId){
                    return this.$message.error("请选择分配角色");
                }
                const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectedRoleId});
                if(res.meta.status !== 200){
                    return this.$message.error("更新角色失败");
                }
                this.$message.success("更新角色成功");
                this.getUserList();
                this.setRoleDialogVisible = false;
            },
            //分配角色 对话框 的 关闭事件
            setRoleDialogClosed(){
                this.selectedRoleId = "";
                this.userInfo = {};
            }
        }
    }
</script>

<style lang="scss" scoped>
.box{
    width: 100%;
    height: 100%;
    .el-breadcrumb{
        margin-bottom: 15px;
        font-size: 12px;
    }
    .el-card{
        box-shadow: 0 1px 1px rgba(0,0,0,0.15) !important;
    }
    .el-table{
        margin-top: 15px;
        font-size: 12px;
    }
    .el-pagination{
        margin-top: 15px;
    }
}
</style>