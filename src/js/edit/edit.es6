new Vue({
    el: "#app",
    store,
    components:{
        'app-head': Head,
        'app-foot':Foot,
        "cover-img" : coverImg,
        "app-login": Login,
    },
    data: {
        https: {
            storyCreate: `${GLOBAL_STATIC_API}story/create.php`,
        },
        viewInfo: {
            cover: "http://ozjrt1c1f.bkt.clouddn.com/1f2a9a4ecf5457208557c8a15ee1d4c3.png",
        },
        info: {
            userId: "",
            title: "",
            desc: "",
            text: "",
            type: 9,
            cover: "",
            user: "",
        },
        boo: {
            isOpenCover: false,
            errorTitle: false,
            errorDesc: false
        },
        storyType: [
            {title: '学霸君', val: 9},
            {title: '兼职君', val: 10},
            {title: '专业分析', val: 11},
            {title: '游戏攻略', val: 12},
            {title: '周末必去', val: 13},
            {title: '神话传说', val: 2},
            {title: '民间奇谭', val: 3},
            {title: '校园诡事', val: 4},
            {title: '灵异事件', val: 5},
            {title: '宇宙奥秘', val: 6},
            {title: '奇异自然', val: 7},
            {title: '五彩历史', val: 8},
        ],
        ue: null,
        userName: "",
    },
    computed: {
        isLogin(){
            return this.$store.state.isLogin
        }
    },
    mounted(){
        let _self = this
        store.commit('isEditPage', {flag: true})
        _self.initEdit();
        _self.initLogin();
    },
    methods: {
        //初始化editor
        initLogin(){
            let _self = this
            let isLogin = addCookie.getCookie('isLogin')
            if(isLogin != 0 && !isBlank(isLogin)){
                store.commit('isLogin', {flag: true})
                store.commit('userName', {flag: addCookie.getCookie('userName')})
                store.commit('userHead', {flag: addCookie.getCookie('userHead')})
                _self.info.userId = addCookie.getCookie('userId')
                _self.info.user = addCookie.getCookie('userName')
            }else{
                store.commit('isLogin', {flag: false})
                store.commit('userName', {flag: ''})
                store.commit('userHead', {flag: ''})
            }
        },
        initEdit(){
            this.ue = UE.getEditor('editor')
        },
        openCover(){
            let _self = this
            if(_self.isLogin){
                _self.boo.isOpenCover = !_self.boo.isOpenCover
            }else{
                store.commit('isOpenLogin', {flag: true})
            }
        },
        selectCover(item){
            console.log(item)
            let _self = this
            _self.viewInfo.cover = item.url
        },
        createStory(item){
            let _self = this
            _self.$http.post(_self.https.storyCreate,item,{emulateJSON:true}).then(
                (res)=>{
                    res = JSON.parse(res.data)
                    if(res.isSuccess){
                        _self.$Message.success(res.msg)
                    }else{
                        _self.$Message.error(res.msg);
                    }
                },
                (err)=>{
                    _self.$Message.error(err);
                }
            )
        },
        submit(){
            let _self = this
            _self.info.cover = _self.viewInfo.cover
            _self.info.text = _self.ue.getContent()
            if(isBlank(_self.info.title)) {
                _self.boo.errorTitle = true
                return _self.$Message.error('文章标题不能为空！');
            }else{
                _self.boo.errorTitle = false
            }
            if(isBlank(_self.info.desc)) {
                _self.boo.errorDesc = true
                return _self.$Message.error('文章摘要不能为空！');
            }else{
                _self.boo.errorDesc = false
            }
            if(isBlank(_self.info.text)) return _self.$Message.error('文章内容不能为空！');
            _self.createStory(_self.info);
        },
        blur(e,type){
            let _self = this
            if(isBlank(e.target.value)){
                if(type == 'title'){
                    _self.boo.errorTitle = true
                    return _self.$Message.error('文章标题不能为空！');
                }else{
                    _self.boo.errorDesc = true
                    return _self.$Message.error('文章摘要不能为空！');
                }
            }else{
                if(type == 'title'){
                    return _self.boo.errorTitle = false
                }else{
                    return _self.boo.errorDesc = false
                }
            }
        }
    }
})