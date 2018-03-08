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
let upImg = {
    template: `
        <row>
            <i-col span="6" :class="['demo-upload-list',coverId == item.id ? 'active' : '']" v-for="item in uploadList" :style="{height: height + 'px'}">
                <template v-if="item.status === 'finished'">
                    <img class="response-img" :src="item.url" @click="select(item)">
                    <!--<div class="demo-upload-list-cover">-->
                        <!--<icon type="ios-eye-outline" @click.native="handleView(item)"></icon>-->
                        <!--<icon type="ios-trash-outline" @click.native="handleRemove(item)"></icon>-->
                    <!--</div>-->
                </template>
                <template v-else>
                    <i-progress v-if="item.showProgress" :percent="item.percentage" hide-info></i-progress>
                </template>
            </i-col>
            <upload
                    class="ivu-col ivu-col-span-6"
                    ref="upload"
                    :show-upload-list="false"
                    :default-file-list="defaultList"
                    :on-success="handleSuccess"
                    :format="['jpg','jpeg','png']"
                    :max-size="2048"
                    :on-format-error="handleFormatError"
                    :on-exceeded-size="handleMaxSize"
                    multiple="false"
                    type="drag"
                    name="file"
                    :style="{display: 'table',height: height + 'px'}"
                    :action="https.test">
                    <div>
                        <icon type="camera" size="20"></icon>
                    </div>
            </upload>
            <!--<modal title="View Image" v-model="visible">-->
                <!--<img :src="viewPic.url" v-if="visible" style="width: 100%">-->
            <!--</modal>-->
        </row>
    `,
    props: {
        list: Array,
        height: Number
    },
    data(){
        return {
            https: {
                test: '//ourlingy.com/data/qiniu/examples/upload.php',
            },
            defaultList: this.list,
            coverId: "",
            imgName: '',
            viewPic: {},
            visible: false,
            uploadList: [],
        }
    },
    mounted () {
        this.uploadList = this.$refs.upload.fileList;
    },
    methods: {
        handleView (item) {
            this.viewPic = item;
            this.visible = true;

        },
        handleRemove (file) {
            // 从 upload 实例删除数据
            const fileList = this.$refs.upload.fileList;
            this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
        },
        handleSuccess (res, file) {
            file.url = res.data.url;
            file.name = res.data.name;
        },
        handleFormatError (file) {
            this.$Notice.warning({
                title: '文件格式不正确',
                desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
            });
        },
        handleMaxSize (file) {
            this.$Notice.warning({
                title: '超出文件大小限制',
                desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
            });
        },
        select(item){
            this.coverId = item.id
            this.$emit('selected-cover',item.url);
        }
    }
}