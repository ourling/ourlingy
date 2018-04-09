new Vue({
    el: "#app",
    store,
    components: {
        'app-head': Head,
        'app-foot':Foot,
        'app-login': Login,
    },
    data: {
        https: {
            storySelect: `${GLOBAL_STATIC_API}story/select.php`,
            storyIndex: `${GLOBAL_STATIC_API}story/select_index.php`,
        },
        userParam: {
            userId: ""
        },
        param: {
            page: 1,
            title: "",
            type: ""
        },
        paramModel: {
            type: ''
        },
        banner: 0,
        newList: [], //最新故事列表
        hostList: [], //最热故事列表
        recomList: [], //推荐故事列表
    },
    computed: {
        isLogin(){
            return this.$store.state.isLogin
        }
    },
    mounted(){
        store.commit('storyType', {flag: 0})
        this.initLogin();
        this.storyAjaxIndex();
    },
    methods:{
        initLogin(){
            let _self = this
            let isLogin = addCookie.getCookie('isLogin')
            if(isLogin != 0 && !isBlank(isLogin)){
                store.commit('isLogin', {flag: true})
                store.commit('userName', {flag: addCookie.getCookie('userName')})
                store.commit('userHead', {flag: addCookie.getCookie('userHead')})
                _self.userParam.userId = addCookie.getCookie('userId')
            }else{
                store.commit('isLogin', {flag: false})
                store.commit('userName', {flag: ''})
                store.commit('userHead', {flag: ''})
            }
        },
        search(arg){
            let _self = this
            _self.param = {
                title: arg.title,
                page: 1,
                type: arg.type
            }
            _self.storyAjax(_self.param)
        },
        //搜索故事
        storyAjax(arg){
            let _self = this
            _self.$http.post(_self.https.storySelect,arg,{emulateJSON:true}).then(
                (res)=>{
                    res = JSON.parse(res.data)
                    if(res.isSuccess){
                       console.log(res)
                    }else{
                        _self.$Message.error(res.msg);
                    }
                },
                (err)=>{
                    _self.$Message.error(err);
                }
            )
        },
        //页面列表  最热  推荐  等等
        storyAjaxIndex(type){
            let _self = this
            _self.$http.post(_self.https.storyIndex,{type: type},{emulateJSON:true}).then(
                (res)=>{
                    res = JSON.parse(res.data)
                    if(res.isSuccess){
                        _self.newList = res.newList
                        _self.hostList = res.hostList
                        _self.recomList = res.recomList
                    }else{
                        _self.$Message.error(res.msg);
                    }
                },
                (err)=>{
                    _self.$Message.error(err);
                }
            )
        },
        urlLink(item){
            let url = `${GLOBAL_PAGE_URL}story.html?story=${item.storyId}`
            window.open(url)
        }
    }
})