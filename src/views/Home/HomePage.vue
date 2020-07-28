<template>
    <div class="box">
        <el-container class="homepage_container">
<!--            //头部显示区域-->
            <el-header>
                <div>
                    <img src="../../assets/heima.png" alt="" />
                    <span>电商后台管理系统</span>
                </div>
                <el-button type="info" @click="LoginOut()">推出</el-button>
            </el-header>
<!--            //页面主题区域-->
            <el-container>
<!--            //侧边栏-->
                <el-aside :width="isCollapse ? '64px':'200px'" >
                    <div class="toggle-button" @click="toggleCollapse()">|||</div>
                    <!--侧边栏列表菜单-->
                    <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF"
                             :unique-opened="true"
                             :collapse="isCollapse"
                             :collapse-transition="false"
                             :router="true"
                             :default-active="activePath"
                    >
                        <!--一级菜单-->
                        <el-submenu :index="index+''" v-for="(item,index) in menuList" :key="index">
                            <template slot="title">
<!--                                //图标-->
                                <i :class="iconObj[item.id]"></i>
<!--                                //文本-->
                                <span>{{item.authName}}</span>
                            </template>
                            <!--//二级菜单-->
                            <el-menu-item :index="'/'+itemList.path+''"
                                          v-for="(itemList,indexkey) in item.children" :key="indexkey"
                                          @click="SaveNavState('/'+itemList.path)"
                            >
                                <template slot="title">
                                    <!--//图标-->
                                    <i class="el-icon-menu"></i>
                                    <!--//文本-->
                                    <span>{{itemList.authName}}</span>
                                </template>
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <!--右侧主题区域-->
                <el-main>
                    <!--路由占位符-->
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "HomePage",
        data(){
            return{
                menuList:[],
                //图标库对象
                iconObj:{
                    '125':'iconfont icon-user',
                    '103':'iconfont icon-tijikongjian',
                    '101':'iconfont icon-shangpin',
                    '102':'iconfont icon-danju',
                    '145':'iconfont icon-baobiao'
                },
                //控制是否折叠
                isCollapse:false,
                //保存激活的菜单链接地址
                activePath:''
            }
        },
        created(){
          this.getMenuList();
          this.activePath = window.sessionStorage.getItem("activePath");
        },
        methods:{
            LoginOut(){
                window.sessionStorage.clear();
                this.$router.push('/Login');
            },
            //获取菜单列表数据
            async getMenuList(){
                const {data:res} =await this.$http.get("menus");
                // console.log(res);
                if(res.meta.status !== 200){
                    return this.$message.error("res.meta.msg");
                }else{
                    this.menuList = res.data;
                }
            },
            //点击控制 切换菜单的折叠与展开
            toggleCollapse(){
                this.isCollapse = !this.isCollapse;
            },
            //保存链接的激活状态
            SaveNavState(activePath){
                window.sessionStorage.setItem('activePath',activePath);
                this.activePath = activePath;
            }
        }
    }
</script>

<style lang="scss" scoped>
.box{
    width: 100%;
    height: 100%;
    .homepage_container{
        height: 100%;
    }
    .el-header{
        background-color: #373d41;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-left: 0;
        color: white;
        font-size: 25px;
        div{
            display: flex;
            align-items: center;
            span{
                margin-left: 15px;
            }
        }
    }
    .el-aside{
        background-color: #333744;
        .el-menu{
            border-right: none;
        }
        .iconfont{
            margin-right: 10px;
        }
        .toggle-button{
            background-color: #4A5064;
            font-size: 10px;
            line-height: 24px;
            color: white;
            text-align: center;
            letter-spacing: 0.3em;
            cursor: pointer;
        }
    }
    .el-main{
        background-color: #EAEDF1;
    }
}
</style>