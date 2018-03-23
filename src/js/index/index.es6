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
        },
        userParam: {
            userId: ""
        },
        param: {
            page: 1,
            title: "",
            type: ""
        }
    },
    mounted(){
        store.commit('storyType', {flag: 0})
        this.initLogin();
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
        search(arg){
            let _self = this
            _self.param = {
                title: arg.title,
                page: 1,
                type: arg.type
            }
            _self.storyAjax(_self.param)
        },
    }
})