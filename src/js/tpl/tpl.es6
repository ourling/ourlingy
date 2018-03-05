const Head = {
    template: `
    <header class="header-container">
    <div class="container clearfix">
        <i-menu class="header" mode="horizontal" :theme="theme1" active-name="1" v-cloak>
            <menu-item name="1">
                <icon type="ios-paper"></icon>
                内容管理
            </menu-item>
            <menu-item name="2">
                <icon type="ios-people"></icon>
                用户管理
            </menu-item>
            <submenu name="3">
                <template slot="title">
                    <icon type="stats-bars"></icon>
                    统计分析
                </template>
                <menu-group title="使用">
                    <menu-item name="3-1">新增和启动</menu-item>
                    <menu-item name="3-2">活跃分析</menu-item>
                    <menu-item name="3-3">时段分析</menu-item>
                </menu-group>
                <menu-group title="留存">
                    <menu-item name="3-4">用户留存</menu-item>
                    <menu-item name="3-5">流失用户</menu-item>
                </menu-group>
            </submenu>
            <menu-item name="4">
                <icon type="settings"></icon>
                综合设置
            </menu-item>
        </i-menu>
        <i-input @keyup.enter.native="search" class="search-input" v-model="value14" placeholder="Enter something..."></i-input>
        <Avatar style="background-color: #87d068" icon="person" />
    </div>
</template>
    </header>
    `,
    data(){
        return {
            theme1: 'dark',
            value14: "",
        }
    },
    methods:{
      search(){
          console.log(this.value14);
      },
    },
}
const Foot = {
    template: `
        <footer>
            123
        </footer>
    `
}