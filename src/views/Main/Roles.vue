<template>
    <div class="box">
        <!--面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/HomePage' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图-->
        <el-card>
<!--            添加角色按钮区域-->
            <el-row>
                <el-col><el-button type="primary">添加角色</el-button></el-col>
            </el-row>
<!--            角色列表区域-->
            <el-table :data="roleList" border stripe>
<!--                展开列-->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['dbbottom',index1 === 0 ? 'dbtop':'','vcenter']" v-for="(item1,index1) in scope.row.children" :key="index1">
                            <!--一级权限-->
                            <el-col :span="5" >
                                <el-tag closable>{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!--二级权限 三级权限 -->
                            <el-col :span="19">
<!--                                //通过 for 循环 嵌套 渲染 二级权限-->
                                <el-row :class="[index2 === 0 ?  '':'dbtop','vcenter']" v-for="(item2,index2) in item1.children" :key="index2">
                                    <el-col :span="6">
                                        <el-tag type="success" closable>{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag type="warning" v-for="(item3,index3) in item2.children" :key="index3"
                                                closable
                                                @close="removeRightById(scope.row,item3.id)"
                                        >{{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="350px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
<!--        //分配权限的对话框-->
        <el-dialog
                title="分配权限"
                :visible.sync="setRightDialogVisible"
                width="50%"
                @close="setRightDialogClosed()"
                >
<!--            //树形控件-->
            <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" :default-expand-all="true"
                     :default-checked-keys="defKeys" ref="treeRef"
            ></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Roles",
        data(){
            return{
                //所有角色列表区域
                roleList:[],
                //控制分配权限的 对话框的 显示与隐藏
                setRightDialogVisible:false,
                // 分配权限数据的 数据
                rightsList:[],
                //树形控件的绑定对象
                treeProps:{
                    label:'authName',
                    children:'children'
                },
                //默认选中的 id 数组
                defKeys:[],
                //当前即将分配权限的
                roleId:''
            }
        },
        created(){
            this.getRoleList();
        },
        methods:{
            //获取所有角色列表数据
            async getRoleList(){
                const { data:res } = await this.$http.get('roles');
                // console.log(res);
                //判断是否获取成功
                if(res.meta.status !== 200){
                    this.$message.error('角色列表数据获取失败');
                }else{
                    this.roleList = res.data;
                }
            },
            //根据 id 删除 相应的权限
            async removeRightById(role,rightId){
                //弹框提示是否确认
                const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(error => error);
                if(confirmResult !== 'confirm'){
                    return this.$message.info("用户取消删除");
                }else{
                    const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
                    console.log(res);
                    if(res.meta.status !== 200){
                        this.$message.error("删除失败");
                    }
                    // this.getRoleList();
                    role.children = res.data;
                }
            },
            //展示分配权限的 对话框
            async showSetRightDialog(role){
                this.roleId = role.id;
                //获取所有权限的数据
                const {data:res} = await this.$http.get('rights/tree');
                if(res.meta.status !== 200){
                    return this.$message.error("获取权限数据失败");
                }
                //保存数据
                this.rightsList = res.data;
                // 获取三级节点的 id
                this.getLeafKeys(role,this.defKeys);
                this.setRightDialogVisible = true;
            },
            //通过递归的方式 获取三级权限的id， 保存到defkeys数组里面
            getLeafKeys(node,arr){
                //不包含的情况下
                if(!node.children){
                    return arr.push(node.id);
                }
                node.children.forEach(item=>{
                    this.getLeafKeys(item,arr);
                })
            },
            //监听分配对话框的关闭事件
            setRightDialogClosed(){
                this.defKeys = [];
            },
            //点击为角色分配权限
            async allotRights(){
                const keys = [
                    ...this.$refs.treeRef.
                        getCheckedKeys(),
                    ...this.$refs.treeRef.
                        getHalfCheckedKeys()
                ];
                // console.log(keys);
                const idStr = keys.join(',');
                const { data:res } = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr});
                if(res.meta.status !== 200){
                    return this.$message.info("分配权限失败")
                }
                this.$message.success("分配权限成功");
                this.getRoleList();
                this.setRightDialogVisible = false;
            }
        }
    }
</script>

<style lang="scss" scoped>
.box{
    width: 100%;
    height: 100%;
    .el-card{
        margin-top: 15px;
        .el-table{
            margin-top: 15px;
            .el-tag{
                margin: 8px;
            }
            .dbtop{
                border-top: 1px #eee solid;
            }
            .dbbottom{
                border-bottom: 1px #eee solid;
            }
        }
    }
    .vcenter{
        display: flex;
        align-items: center;
    }
}
</style>