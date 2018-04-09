new Vue({
    el: "#app",
    store,
    components:{
        'app-head': Head,
        'app-foot':Foot,
        "app-login": Login,
    },
    data: {
        https: {
            story: `${GLOBAL_STATIC_API}story/item.php`,
        },
        param: {
            storyId: 39,
        },
        story: {},
    },
    computed: {
        isLogin(){
            return this.$store.state.isLogin
        }
    },
    created(){
        let _self = this
        _self.param.storyId = queryUrl('story');
        console.log(queryUrl('story'));
        if(_self.param.storyId == null){
            location.href = GLOBAL_HOME_URL
        }
        store.commit('isEditPage', {flag: false})
        _self.initLogin();
        _self.initStory();
    },
    mounted(){
    },
    methods: {
        initLogin(){
            let _self = this
            let isLogin = addCookie.getCookie('isLogin')
            if(isLogin != 0 && !isBlank(isLogin)){
                store.commit('isLogin', {flag: true})
                store.commit('userName', {flag: addCookie.getCookie('userName')})
                store.commit('userHead', {flag: addCookie.getCookie('userHead')})
            }else{
                store.commit('isLogin', {flag: false})
                store.commit('userName', {flag: ''})
                store.commit('userHead', {flag: ''})
            }
        },
        initStory(){
            let _self = this
            _self.$http.post(_self.https.story,_self.param,{}).then(
                (res)=>{
                    res = JSON.parse(res.data)
                    if(res.isSuccess){
                        _self.story = res.story;
                    }else{
                        _self.$Message.error(res.msg);
                    }
                },
                (err)=>{
                    _self.$Message.error(err)
                }
            )
        }
    },
})