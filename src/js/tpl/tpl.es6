const store = new Vuex.Store({
    state: {
        isLogin: false,
        isOpenLogin: false,
    },
    mutations: {
        isLogin (state, obj) {
            state.isLogin = obj.flag;
        },
        isOpenLogin (state, obj) {
            state.isOpenLogin = obj.flag;
        },
    }
})
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
            <Avatar v-if="isLogin" style="background-color: #87d068" icon="person" />
            <i-button v-if="!isLogin" @click.native="openLogin" type="success">登 录</i-button>
        </div>
    </header>
    `,
    data(){
        return {
            theme1: 'dark',
            value14: "",
        }
    },
    computed: {
        isLogin(){
            return this.$store.state.isLogin
        }
    },
    methods:{
        search(){
          console.log(this.value14);
        },
        openLogin(){
            store.commit('isOpenLogin', {flag: true})
        }
    },
}
const Foot = {
    template: `
        <footer>
            123
        </footer>
    `
}
const coverImg = {
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
const Login = {
    template: `
        <modal v-model="isOpen"
            @on-cancel="cancel"
            @on-ok="submit">
            <tabs @on-click="selectTabs($event)">
                <tab-pane label="立即登录" name="login">
                    <i-form :model="login" :label-width="50">
                        <form-item label="昵称">
                            <i-input
                                    :class="[boo.hasLoginName ? 'ivu-form-item-error' : '']"
                                    v-model="login.name"
                                    @on-blur="blur($event,'login-name')"
                            ></i-input>
                        </form-item>
                        <form-item label="密码">
                            <i-input type="password"
                                     :class="[boo.hasLoginPwd ? 'ivu-form-item-error' : '']"
                                     v-model="login.pwd"
                                     @on-blur="blur($event,'login-pwd')"
                            ></i-input>
                        </form-item>
                    </i-form>
                </tab-pane>
                <tab-pane label="马上注册" name="register">
                    <i-form :model="register" :label-width="62">
                        <form-item label="手机号" prop="phone">
                            <i-input
                                    v-model="register.phone"
                                    :class="[boo.hasRegisterPhone ? 'ivu-form-item-error' : '']"
                                    @on-blur="blur($event,'register-phone')"
                            ></i-input>
                        </form-item>
                        <form-item label="昵称" prop="name">
                            <i-input
                                    v-model="register.name"
                                    :class="[boo.hasRegisterName ? 'ivu-form-item-error' : '']"
                                    @on-blur="blur($event,'register-name')"
                            ></i-input>
                        </form-item>
                        <form-item label="密码" prop="passwd">
                            <i-input type="password"
                                     v-model="register.pwd"
                                     :class="[boo.hasRegisterPwd ? 'ivu-form-item-error' : '']"
                                     @on-blur="blur($event,'register-pwd')"
                            ></i-input>
                        </form-item>
                        <form-item label="确认密码" prop="passwdCheck">
                            <i-input type="password"
                                     v-model="cpwd"
                                     :class="[boo.hasRegisterCpwd ? 'ivu-form-item-error' : '']"
                                     @on-blur="blur($event,'register-cpwd')"
                            ></i-input>
                        </form-item>
                        <form-item label="性别">
                            <radio-group v-model="register.sex">
                                <radio label="男">男</radio>
                                <radio label="女">女</radio>
                            </radio-group>
                        </form-item>
                    </i-form>
                </tab-pane>
            </tabs>
            <div slot="footer">
                <i-button type="success" size="large" long  @click="submit">{{text.submitText}}</i-button>
            </div>
        </modal>
    `,
    data () {
        return {
            https: {
                register: `${GLOBAL_STATIC_API}user/create.php`
            },
            boo: {
                canSubmit: false, //是否可以提交
                isLogin: true, //是否是注册行为
                hasRegisterName: false, //是否显示注册输入框报错
                hasRegisterPhone: false, //是否显示注册输入框报错
                hasRegisterPwd: false, //是否显示注册输入框报错
                hasRegisterCpwd: false, //是否显示注册输入框报错
                hasLoginName: false, //是否显示登陆输入框报错
                hasLoginPwd: false, //是否显示登陆输入框报错
            },
            text: {
                submitText: '立即登陆'
            },
            register: {
                phone: "",
                name: "",
                pwd: '',
                sex: '男'
            },
            cpwd: "",
            login: {
                name: "",
                pwd: ""
            },
        }
    },
    computed: {
        isOpen(){
            return this.$store.state.isOpenLogin
        }
    },
    methods: {
        submit(){
            let _self = this
            _self.submitMsg();
            if(!_self.boo.canSubmit) return;
            if(!_self.boo.isLogin){
                _self.registerAjax();
            }
        },
        cancel(){
            store.commit('isOpenLogin', {flag: false})
        },
        selectTabs(e){
            let _self = this
            if(e == 'login') {
                _self.text.submitText = '立即登陆'
                _self.boo.isLogin = true
            }else{
                _self.text.submitText = '马上注册'
                _self.boo.isLogin = false
            }
        },
        blur(e,type){
            let _self = this
            let val = e.target.value;
            _self.boo.canSubmit = false
            switch (type){
                case 'login-name':
                    _self.boo.hasLoginName = _self.checkMsg(val,type,'用户名不能为空！');
                    break;
                case 'login-pwd':
                    _self.boo.hasLoginPwd = _self.checkMsg(val,'pwd','密码不能为空！');
                    break;
                case 'register-phone':
                    _self.boo.hasRegisterPhone = _self.checkMsg(val,'phone','手机号不能为空！');
                    break;
                case 'register-name':
                    _self.boo.hasRegisterName = _self.checkMsg(val,type,'用户名不能为空！');
                    break;
                case 'register-pwd':
                    _self.boo.hasRegisterPwd = _self.checkMsg(val,'pwd','密码不能为空！');
                    break;
                case 'register-cpwd':
                    _self.boo.hasRegisterCpwd = _self.checkMsg(val,type,'确认密码不能为空！');
                    break;
            }
        },
        checkMsg(val,type,msg){
            let _self = this
            if(val == '') {
                _self.$Message.error(msg);
                return true
            }
            if(type == 'pwd' && (val.length < 5 || val.length > 10)) {
                _self.$Message.error('密码长度不小于6位或不大于10位！');
                return  true
            }
            if(type == 'phone' && !isPhone(val)) {
                _self.$Message.error('手机号格式不正确！');
                return true
            }
            if(type == 'register-cpwd' && val != _self.register.pwd) {
                _self.$Message.error('密码不统一！');
                return true
            }
            return false
        },
        submitMsg(){
            let _self = this
            if(_self.boo.isLogin){
                if(_self.login.name == ''){
                    _self.boo.hasLoginName = true
                    return _self.$Message.error('昵称不能为空！');
                }
                if(_self.login.pwd == ''){
                    _self.boo.hasLoginPwd = true
                    return _self.$Message.error('密码不能为空！');
                }
                if(_self.login.pwd.length < 6 || _self.login.pwd.length > 10){
                    _self.boo.hasLoginPwd = true
                    return _self.$Message.error('密码不能少于6位或大于10位！');
                }
            }else{
                if(_self.register.phone == ''){
                    _self.boo.hasRegisterPhone = true
                    return _self.$Message.error('手机号不能为空！');
                }
                if(_self.register.name == ''){
                    _self.boo.hasRegisterName = true
                    return _self.$Message.error('昵称不能为空！');
                }
                if(_self.register.pwd == ''){
                    _self.boo.hasRegisterPwd = true
                    return _self.$Message.error('密码不能为空！');
                }
                if(_self.cpwd == ''){
                    _self.boo.hasRegisterCpwd = true
                    return _self.$Message.error('确认密码不能为空！');
                }
                if(_self.register.pwd.length < 6 || _self.register.pwd.length > 10){
                    _self.boo.hasRegisterPwd = true
                    return _self.$Message.error('密码不能少于6位或大于10位！');
                }
            }
            _self.boo.canSubmit = true
        },
        registerAjax(){
            let _self = this
            _self.$http.post(_self.https.register,_self.register).then(
                (res)=>{
                    res = JSON.parse(res.data)
                    if(res.isSuccess){
                        store.commit('isLogin', {flag: true})
                        _self.$Message.success(res.msg)
                    }else{
                        _self.$Message.error(res.msg)
                    }
                    store.commit('isOpenLogin', {flag: false})
                },
                (err)=>{
                    _self.$Message.error(err)
                }
            )
        }
    }
}
