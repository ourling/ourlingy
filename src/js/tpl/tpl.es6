let  linkTag = `<link rel="shortcut icon" href="${GLOBAL_STATIC_URL}/images/ico.jpg">`;
// 动态将ico添加到head里
$($('head')[0]).append(linkTag);
const store = new Vuex.Store({
    state: {
        isLogin: false,
        isOpenLogin: false,
        userName: "",
        userHead: "",
        isEditPage: false,
        storyType: 0,
    },
    mutations: {
        isLogin (state, obj) {
            state.isLogin = obj.flag;
        },
        isOpenLogin (state, obj) {
            state.isOpenLogin = obj.flag;
        },
        userName (state, obj) {
            state.userName = obj.flag;
        },
        userHead (state, obj) {
            state.userHead = obj.flag;
        },
        isEditPage (state, obj) {
            state.isEditPage = obj.flag;
        },
        storyType(state, obj){
            state.storyType = obj.flag;
}
    }
})
Vue.http.interceptors.push((request, next)=>{
    request.emulateJSON = true
    next((response) => {
        return response
    })
})
const Head = {
    template: `
        <div :class="['app-header',isFixedNav ? 'fixed' : '']">
            <header class="header-container">
                <div class="container clearfix">
                    <i-menu @on-select="menuSelect" class="header" mode="horizontal" :theme="theme1" active-name="1" v-cloak>
                        <menu-item name="1">
                            首页
                        </menu-item>
                        <menu-item name="2">
                            神话传说
                        </menu-item>
                        <menu-item name="3">
                            民间奇谭
                         </menu-item>
                        <menu-item name="4">
                            校园诡事
                        </menu-item>
                        <menu-item name="5">
                            灵异事件
                        </menu-item>
                        <menu-item name="6">
                            宇宙奥秘
                        </menu-item>
                        <menu-item name="7">
                            奇异自然
                        </menu-item>
                        <menu-item name="8">
                            五彩历史
                        </menu-item>
                    </i-menu>
                    <i-input v-if="!isEditPage" @keyup.enter.native="search" class="search-input" v-model="title" placeholder="Enter something..."></i-input>                    
                    <div v-if="isLogin" class="login">
                        <i-menu class="header" mode="horizontal" :theme="theme1"  v-cloak>                
                            <submenu name="1">
                                <template slot="title">
                                    <Avatar :src="userHead"/></Avatar>
                                    <span class="user-name">{{userName}}</span>
                                </template>
                                <menu-item name="1-1">
                                    <i-button type="text" @click.native="exitLogin" long>退出登录</i-button>
                                </menu-item>
                            </submenu>
                        </i-menu>
                    </div>
                    <i-button v-if="!isEditPage" @click="publish" class="edit-btn head-btn" type="text">分享故事</i-button>
                    <i-button v-if="!isLogin" @click.native="openLogin" type="text" class="head-btn">登 录</i-button>
                </div>
            </header>  
        </div>    
    `,
    data(){
        return {
            theme1: 'dark',
            title: "",
            isFixedNav: false,
        }
    },
    computed: {
        isLogin(){
            return this.$store.state.isLogin
        },
        userName(){
            return this.$store.state.userName;
        },
        userHead(){
            return this.$store.state.userHead;
        },
        isEditPage(){
            return this.$store.state.isEditPage;
        },
        storyType(){
            return this.$store.state.storyType;
        },
    },
    mounted () {
        let _self = this
        _self.$nextTick(()=>{
            _self.initScroll()
        })
    },
    methods:{
        search(){
            let _self = this
            let arg = {
                title: _self.title,
                type: _self.storyType
            }
            this.$emit('search',arg)
        },
        openLogin(){
            store.commit('isOpenLogin', {flag: true})
        },
        exitLogin(){
            addCookie.setCookie('isLogin',0,'h3',GLOBAL_HOME_PATH,GLOBAL_HOME_DOMAIN)
            addCookie.delCookie('userId')
            addCookie.delCookie('userName')
            store.commit('isLogin', {flag: false})
            store.commit('userName', {flag: ''})
        },
        publish(){
            let _self = this
            if(_self.isLogin){
                window.open(`${GLOBAL_PAGE_URL}edit.html`)
            }else{
                store.commit('isOpenLogin', {flag: true})
            }
        },
        initScroll(){
            let _self = this
            window.document.addEventListener('scroll', () => {
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
                if(scrollTop > 250){
                    _self.isFixedNav = true
                }else{
                    _self.isFixedNav = false
                }
            }, false)
        },
        menuSelect(name){
            switch (name) {
                case '1':
                    window.location.href = GLOBAL_HOME_URL
                    break;
            }
        }
    },
}
const Foot = {
    template: `
        <footer class="foot-container">
            <div class="container">
               ©Copyright 2017 - 2018  畅想工作室版权所有   &nbsp;&nbsp;&nbsp;<a href="http://www.miitbeian.gov.cn/">浙ICP备18016237号</a>
            </div>            
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
                userId: '',
                page: '1'
            },
        }
    },
    mounted () {
        let _self = this
        _self.initLogin();
        _self.getList(_self.infoList);
    },
    methods: {
        initLogin(){
            let _self = this
            let isLogin = addCookie.getCookie('isLogin')
            if(isLogin != 0 && !isBlank(isLogin)){
                store.commit('userName', {flag: addCookie.getCookie('userName')})
                _self.infoList.userId = addCookie.getCookie('userId')
            }
        },
        getList(item){
            let _self = this
            _self.$http.post(_self.https.getList,item).then(
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
            _self.infoList.page = page
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
                        <!--<form-item label="手机号" prop="phone">-->
                            <!--<i-input-->
                                    <!--v-model="register.phone"-->
                                    <!--:class="[boo.hasRegisterPhone ? 'ivu-form-item-error' : '']"-->
                                    <!--@on-blur="blur($event,'register-phone')"-->
                            <!--&gt;</i-input>-->
                        <!--</form-item>-->
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
                register: `${GLOBAL_STATIC_API}user/create.php`,
                login: `${GLOBAL_STATIC_API}user/select.php`,
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
            }else{
                _self.loginAjax();
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
                // case 'register-phone':
                //     _self.boo.hasRegisterPhone = _self.checkMsg(val,'phone','手机号不能为空！');
                //     break;
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
            // if(type == 'phone' && !isPhone(val)) {
            //     _self.$Message.error('手机号格式不正确！');
            //     return true
            // }
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
                // if(_self.register.phone == ''){
                //     _self.boo.hasRegisterPhone = true
                //     return _self.$Message.error('手机号不能为空！');
                // }
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
                    _self.res(res);
                },
                (err)=>{
                    _self.$Message.error(err)
                }
            )
        },
        loginAjax(){
            let _self = this
            _self.$http.post(_self.https.login,_self.login).then(
                (res)=>{
                    _self.res(res);
                },
                (err)=>{
                    _self.$Message.error(err)
                }
            )
        },
        res(res){
            let _self = this
            res = JSON.parse(res.data)
            if(res.isSuccess){
                _self.$Message.success(res.msg)
                addCookie.setCookie('isLogin',1,'h3',GLOBAL_HOME_PATH,GLOBAL_HOME_DOMAIN)
                addCookie.setCookie('userId',res.data.userId,'h3',GLOBAL_HOME_PATH,GLOBAL_HOME_DOMAIN)
                addCookie.setCookie('userName',res.data.name,'h3',GLOBAL_HOME_PATH,GLOBAL_HOME_DOMAIN)
                addCookie.setCookie('userHead',res.data.head,'h3',GLOBAL_HOME_PATH,GLOBAL_HOME_DOMAIN)
                store.commit('isOpenLogin', {flag: false})
                store.commit('isLogin', {flag: true})
                store.commit('userName', {flag: res.data.name})
                store.commit('userHead', {flag: res.data.head})
            }else{
                _self.$Message.error(res.msg)
                addCookie.setCookie('isLogin',0,'h3',GLOBAL_HOME_PATH,GLOBAL_HOME_DOMAIN)
                addCookie.delCookie('userId')
                addCookie.delCookie('userName')
                addCookie.delCookie('userHead')
                store.commit('isOpenLogin', {flag: true})
                store.commit('isLogin', {flag: false})
            }
        }
    }
}
