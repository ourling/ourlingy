$(".mask-tel").click(function(e){
    let $a = e.target.nodeName;
    let $c = e.target.classList[1];
    if($c == "mask-tel" || $c == "remove"){
        $(".mask-tel").fadeOut()
    }
});

let app = new Vue({
    el: "#app",
    mixins: [mixin],
    components: {
        'app-head': Head,
        'app-foot': Foot
    },
    data: {
        https: {
            storyIndex: `${GLOBAL_STATIC_API}story/select_index.php`,
        },
        type: '',
        list: [],
    },
    created(){
        this.initPage();
        this.type = getQueryString('type')
        this.switchList(this.type);
    },
    mounted(){
    },
    methods: {
        storyAjaxIndex(type,listType){
            let _self = this
            _self.$http.post(_self.https.storyIndex,{type: type}).then(
                (res)=>{
                    res = JSON.parse(res.data)
                    if(res.isSuccess){
                        switch (listType){
                            case '推荐':
                                _self.list = res.recomList;
                                document.title = '阁主推荐'
                                break;
                            case '最热':
                                _self.list = res.hostList;
                                document.title = '热门故事'
                                break;
                            case '最新':
                                _self.list = res.newList;
                                document.title = '最新分享'
                                break;
                        }
                        this.$Spin.hide();
                    }else{
                        alert(res.msg);
                    }
                },
                (err)=>{
                    _self.$Message.error(err);
                }
            )
        },
        switchList(type){
            let _self = this
            switch (type) {
                case 'tuijian':
                    _self.storyAjaxIndex('', '推荐');
                    break;
                case 'hot':
                    _self.storyAjaxIndex('', '最热');
                    break;
                case 'new':
                    _self.storyAjaxIndex('', '最新');
                    break;
            }
        },
        initPage(){
            this.$Spin.show({
                render: (h) => {
                    return h('div', [
                        h('Icon', {
                            'class': 'demo-spin-icon-load',
                            props: {
                                type: 'load-c',
                            }
                        }),
                        h('div', 'Loading')
                    ])
                }
            });
        },
        toStory(id){
            location.href = `${GLOBAL_HOME_URL}/mobile/story.html?story=${id}`
        }
    }
})