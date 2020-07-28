<template>
    <div class="box">
<!--        面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/HomePage' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
<!--        卡片视图-->
        <el-card>
            <el-table :data="RightsList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="权限名称" prop="authName"></el-table-column>
                <el-table-column label="路径" prop="path"></el-table-column>
                <el-table-column label="权限等级" prop="level">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level === '0'">一级权限</el-tag>
                        <el-tag type="success" v-else-if="scope.row.level === '1'"">二级权限</el-tag>
                        <el-tag type="warning" v-else>三级权限</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "Rights",
        data(){
            return{
                //权限列表数据
                RightsList:[]
            }
        },
        created(){
            //获取权限数据
            this.getRightsList();
        },
        methods:{
            //获取权限列表数据
            async getRightsList(){
                const {data:res} = await this.$http.get('rights/list');
                if(res.meta.status !== 200){
                    return this.$message.error('获取权限列表数据失败');
                }
                this.RightsList = res.data;
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
        .el-table .cell{
            font-size: 12px;
        }
    }
}
</style>