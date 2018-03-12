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
let coverImg = {
    template: `
    <modal
            width="800"
            class="cover-select"
            v-model="boo.modelOpen"
            title="封面素材"
            @on-ok="modelOk">
            <row>
                <i-col span="6" :class="['demo-upload-list',coverId == item.imgId ? 'active' : '']" v-for="item in uploadList" :style="{height: height + 'px'}">
                    <template v-if="item.status === 'finished'">
                        <img class="response-img" :src="item.url" @click="select(item)">
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
                        :action="https.upImg">
                        <div>
                            <icon type="camera" size="20"></icon>
                        </div>
                </upload>
            </row>
            <Page :current="1" :total="total" :page-size="size" @on-change="changePage" simple></Page>
        </modal>
    `,
    props: {
        isopen: Boolean
    },
    watch: {
        isopen(newV,oldV){
            this.boo.modelOpen = true
        }
    },
    data(){
        return {
            https: {
                upImg: '//ourlingy.com/data/qiniu/examples/upload.php',
                getList: `${GLOBAL_STATIC_API}img/selectcover.php`
            },
            defaultList: [],
            height: 192,
            coverId: "",
            selectImg: {
                id: "",
                name: "",
                url: ""
            },
            boo: {
                modelOpen: this.isopen
            },
            uploadList: [],
            total: 0,
            size: 7,
            infoList: {
                userId: '1',
                page: '1'
            },
        }
    },
    mounted () {
        let _self = this
        _self.getList(_self.infoList);
    },
    methods: {
        getList(item){
            let _self = this
            _self.$http.post(_self.https.getList,item,{emulateJSON:true}).then(
                (res)=>{
                    res = JSON.parse(res.data)
                    if(res.isSuccess){
                        _self.uploadList = res.list
                        _self.total = res.count
                    }else{
                        _self.$Message.error('封面列表查询失败！');
                    }
                },
                (err)=>{
                    _self.$Message.error(err);
                }
            )
        },
        handleSuccess (res, file) {
            let _self = this
            _self.getList(_self.infoList);
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
            this.coverId = item.imgId
            this.selectImg = {
                imgId: item.imgId,
                name: item.name,
                url: item.url
            }
        },
        modelOk(){
            let _self = this
            if(_self.selectImg.url == "") {
                return _self.$Message.error('请选择一个封面！');
            }
            this.$emit('select-cover',_self.selectImg)
        },
        changePage(page){
            let _self = this
            _self.infoList = {
                userId: '1',
                page: page
            }
            _self.getList(_self.infoList);
        }
    }
}