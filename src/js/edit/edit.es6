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
            createPart: `${GLOBAL_STATIC_API}story/create_part.php`,
            createOther: `${GLOBAL_STATIC_API}story/create_other.php`
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
            other: 1
        },
        boo: {
            isOpenCover: false,
            errorTitle: false,
            errorDesc: false,
            isPartTime: false, //是否是编辑兼职信息
            isShowOther12: false,
            isShowOther14: false,

            errorName: false,
            errorArea: false,
            errorCompany: false,
            errorDate: false,
            errorMoney: false,
            errorUrl: false
        },
        param: {
            userId: "",
            user: "",
            name: "",
            area: "",
            company: "",
            date: "",
            money: "",
            methods: '日结',
            url: ''
        },
        storyType: [
            {title: '学霸君', val: 9},
            {title: '兼职君', val: 10},
            {title: '专业分析', val: 11},
            {title: '游戏攻略', val: 12},
            {title: '旅游攻略', val: 13},
            {title: '合肥汇', val: 14},
            {title: '神话传说', val: 2},
            {title: '民间奇谭', val: 3},
            {title: '校园诡事', val: 4},
            {title: '灵异事件', val: 5},
            {title: '宇宙奥秘', val: 6},
            {title: '奇异自然', val: 7},
            {title: '五彩历史', val: 8},
        ],
        methodsList: [
            {id: 1,val: '月结'},
            {id: 2,val: '周结'},
            {id: 3,val: '日结'},
        ],
        otherType12: [
            {id: 1,val: 'LOL'},
            {id: 2,val: '绝地求生'},
            {id: 3,val: '刺激战场'},
            {id: 4,val: '王者荣耀'}
        ],
        otherType14: [
            {id: 1,val: '美食美味'},
            {id: 2,val: '玩乐趣处'}
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
                _self.param.userId = addCookie.getCookie('userId')
                _self.param.user = addCookie.getCookie('userName')
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
        createStory(item,url){
            let _self = this
            _self.$http.post(url,item,{emulateJSON:true}).then(
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
            _self.createStory(_self.info,_self.https.storyCreate);
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
        },
        change(val){
            let _self = this
            _self.boo.isPartTime = val == 10 ? true : false
            _self.boo.isShowOther12 = false
            _self.boo.isShowOther14 = false
            if(val == 12){
                _self.boo.isShowOther12 = true
                _self.boo.isShowOther14 = false
            }
            if(val == 14){
                _self.boo.isShowOther12 = false
                _self.boo.isShowOther14 = true
            }
        },
        submitPart(){
            let _self = this
            if(isBlank(_self.param.name)) {
                _self.boo.errorName = true
                return _self.$Message.error('兼职名称不能为空！');
            }else{
                _self.boo.errorName = false
            }
            if(isBlank(_self.param.area)) {
                _self.boo.errorArea = true
                return _self.$Message.error('工作区域不能为空！');
            }else{
                _self.boo.errorArea = false
            }
            if(isBlank(_self.param.company)) {
                _self.boo.errorCompany = true
                return _self.$Message.error('公司名称不能为空！');
            }else{
                _self.boo.errorCompany = false
            }
            if(isBlank(_self.param.money)) {
                _self.boo.errorMoney = true
                return _self.$Message.error('薪水不能为空！');
            }else{
                _self.boo.errorMoney = false
            }
            if(isBlank(_self.param.date)) {
                _self.boo.errorDate = true
                return _self.$Message.error('发布时间不能为空！');
            }else{
                _self.boo.errorDate = false
            }
            if(isBlank(_self.param.url)) {
                _self.boo.errorUrl = true
                return _self.$Message.error('第三方链接不能为空！');
            }else{
                _self.boo.errorUrl = false
            }
            _self.createStory(_self.param,_self.https.createPart);
        },
        enterPlant(){
            window.open(`${GLOBAL_HOME_URL}/admin/`);
        }
    }
})