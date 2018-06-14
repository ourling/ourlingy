let test = {
    template : `<div>123</div>`
}
let route = [
    {
        path: '/test',
        component: resolve => (resolve(test))
    }
]
let router = new VueRouter({
    routes : route
})
new Vue({
    el: "#app",
    store,
    router,
    components:{
        'app-head': Head,
        'app-foot':Foot,
        "app-login": Login,
    },
    data: {
        https: {
            story: `${GLOBAL_STATIC_API}story/item.php`,
            recommon: `${GLOBAL_STATIC_API}story/tuijian.php`,
        },
        param: {
            storyId: 39,
        },
        story: {},
        recomList: [],
    },
    computed: {
        isLogin(){
            return this.$store.state.isLogin
        }
    },
    created(){
        let _self = this
        _self.param.storyId = queryUrl('story');
        // console.log(queryUrl('story'));
        store.commit('isEditPage', {flag: false})
        _self.initLogin();
    },
    mounted(){
        let _self = this
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
        urlLink(item){
            let url = `${GLOBAL_PAGE_URL}story.html?story=${item.storyId}`
            window.open(url)
        }
    },
})