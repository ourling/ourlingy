
let route = [
    {
        path: '/test',
        component: resolve => (resolve(test))
    }
]
let router = new VueRouter({
    routes : route
})
let Main = {
    store,
    router,
    components:{
        'app-head': Head,
        'app-foot':Foot,
        "app-login": Login,
        "cover-img" : coverImg,
    },
    data () {
        return {
            modal1: true,
            https: {
                list: `${GLOBAL_STATIC_API}admin/list.php`,
                upcover: `${GLOBAL_STATIC_API}admin/upcover.php`,
                del: `${GLOBAL_STATIC_API}admin/del.php`,
                publish: `${GLOBAL_STATIC_API}admin/publish.php`,
                uptext: `${GLOBAL_STATIC_API}admin/edit.php`,
                recommend: `${GLOBAL_STATIC_API}admin/recommend.php`,
            },
            boo: {
                isOpenCover: false,
                openDel: false,
                modal_loading: false,
                isView: false,
                isEdit: false
            },
            params: {
                page: 1,
                userId: '',
                state: 1,
                type: 9,
                isRecommend: 0,
            },
            upcover: {
                storyId: '',
                cover: ''
            },
            transform: {
                count: 1,
            },
            item: {},
            columns7: [
                {
                    title: '序号',
                    type:'index',
                    width: 150,
                    align: 'center',
                },
                {
                    title: '文章ID',
                    key: 'storyId',
                    width: 150,
                    align: 'center',
                },
                {
                    title: '文章标题',
                    key: 'title',
                    align: 'center',
                },
                {
                    title: '文章封面',
                    key: 'cover',
                    align: 'center',
                    render: (h,params)=>{
                        return h('div',[
                            h('img',{
                                attrs: {
                                    src: params.row.cover,
                                    class: 'cover'
                                }
                            })
                        ])
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 280,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'info',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        let _self = this
                                        if(_self.isLogin){
                                            _self.boo.isOpenCover = !_self.boo.isOpenCover
                                            _self.upcover.storyId = params.row.storyId
                                            _self.item = params.row
                                        }else{
                                            store.commit('isOpenLogin', {flag: true})
                                        }
                                    }
                                }
                            }, '更改封面'),
                            h('Button', {
                                props: {
                                    type: 'info',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        let _self = this
                                        if(_self.isLogin){
                                            _self.item = params.row
                                            _self.recommend(params.row)
                                        }else{
                                            store.commit('isOpenLogin', {flag: true})
                                        }
                                    }
                                }
                            }, this.params.isRecommend == 1 ? '取消精选': '置为精选'),
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px',
                                    display: params.row.state == 0 ? 'inline-block' : 'none'
                                },
                                on: {
                                    click: () => {
                                        this.item = params.row
                                        this.publish(params.row.storyId)
                                    }
                                }
                            }, '发布'),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.item = params.row
                                        this.del()
                                    }
                                }
                            }, '删除'),
                            h('Button', {
                                props: {
                                    type: 'success',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.item = params.row
                                        this.boo.isView = true
                                    }
                                }
                            }, '预览')
                        ]);
                    }
                }
            ],
            typeList: [
                {
                    value: 9,
                    label: '学霸君'
                },
                {
                    value: 10,
                    label: '兼职君'
                },
                {
                    value: 11,
                    label: '专业分析'
                },
                {
                    value: 12,
                    label: '游戏攻略'
                },
                {
                    value: 13,
                    label: '旅游攻略'
                },
                {
                    value: 14,
                    label: '合肥汇'
                }
            ],
            stateList: [
                {value: 0,label: '未发布'},
                {value: 1,label: '已发布'}
            ],
            recommendList: [
                {value: 0,label: '未精选'},
                {value: 1,label: '精选'}
            ],
            list: [],
        }
    },
    computed: {
        isLogin(){
            return this.$store.state.isLogin
        },
    },
    created(){
        let _self = this
        store.commit('isEditPage', {flag: true})
        _self.params.userId = addCookie.getCookie('userId')
        // _self.params.userId = 36
        _self.initLogin();
        _self.getList();
    },
    mounted(){
        let _self = this
    },
    methods: {
        ok () {
            this.$Message.info('Clicked ok');
        },
        getList(){
            let _self = this
            _self.$http.post(_self.https.list,_self.params).then(
                (res)=>{
                    res = JSON.parse(res.data)
                    if(res.isSuccess){
                        _self.list = res.list
                        _self.transform.count = res.count
                    }
                },
                (err)=>{
                    console.log(err)
                }
            )
        },
        upCover(){
            let _self = this
            _self.$http.post(_self.https.upcover,_self.upcover).then(
                (res)=>{
                    res = JSON.parse(res.data)
                    if(res.isSuccess){
                        _self.item.cover = _self.upcover.cover
                        _self.$Message.success(res.msg);
                    }else{
                        _self.$Message.error(res.msg);
                    }
                },
                (err)=>{
                    console.log(err)
                }
            )
        },
        upText(item){
            let _self = this
            let param = {
                storyId: item.storyId,
                text: item.text
            }
            _self.$http.post(_self.https.uptext,param).then(
                (res)=>{
                    res = JSON.parse(res.data)
                    if(res.isSuccess){
                        _self.$Message.success(res.msg);
                        _self.boo.isView = false
                    }else{
                        _self.$Message.error(res.msg);
                    }
                },
                (err)=>{
                    console.log(err)
                }
            )
        },
        openDel(){
            let _self = this
            _self.boo.openDel = true
        },
        del(){
            let _self = this
            _self.boo.modal_loading = true
            _self.$http.post(_self.https.del,{storyId: _self.item.storyId}).then(
                (res)=>{
                    res = JSON.parse(res.data)
                    if(res.isSuccess){
                        _self.getList()
                        _self.$Message.success(res.msg);
                    }else{
                        _self.$Message.error(res.msg);
                    }
                    _self.boo.openDel = false
                    _self.boo.modal_loading = false
                },
                (err)=>{
                    console.log(err)
                }
            )
        },
        publish (id) {
            let _self = this
            _self.$http.post(_self.https.publish,{storyId: id}).then(
                (res)=>{
                    res = JSON.parse(res.data)
                    if(res.isSuccess){
                        _self.getList()
                        _self.$Message.success(res.msg);
                    }else{
                        _self.$Message.error(res.msg);
                    }
                },
                (err)=>{
                    console.log(err)
                }
            )
        },
        recommend(item){
            let _self = this
            let param = {
                storyId: item.storyId,
                isRecommend: item.isRecommend == 1 ? 0 : 1
            }
            _self.$http.post(_self.https.recommend,param).then(
                (res)=>{
                    res = JSON.parse(res.data)
                    if(res.isSuccess){
                        _self.getList()
                        _self.$Message.success(res.msg);
                    }else{
                        _self.$Message.error(res.msg);
                    }
                },
                (err)=>{
                    console.log(err)
                }
            )
        },
        page(page){
            let _self = this
            if(page != _self.params.page){
                _self.params.page = page
                _self.getList()
            }
        },
        selectCover(item){
            let _self = this
            _self.upcover.cover = item.url
            _self.upCover();
        },
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
        change(val,type){
            let _self = this
            switch (type){
                case 'state':
                    _self.params.page = 1
                    _self.params.state = val
                    _self.getList();
                    break;
                case 'type':
                    _self.params.page = 1
                    _self.params.type = val
                    _self.getList();
                    break;
                case 'recommend':
                    _self.params.page = 1
                    _self.params.isRecommend = val
                    _self.getList();
                    break;
            }
        },
    },
}
let Component = Vue.extend(Main)
new Component().$mount('#app')
