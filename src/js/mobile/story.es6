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
            story: `${GLOBAL_STATIC_API}story/item.php`,
        },
        param: {
            storyId: ''
        },
        story: {}
    },
    created(){
        let _self = this
        _self.initPage();
        _self.param.storyId = getQueryString('story');
        if(_self.param.storyId == null){
            location.href = `${GLOBAL_HOME_URL}/mobile/`
        }
        _self.initStory();
    },
    mounted(){
    },
    methods: {
        initStory(){
            let _self = this
            _self.$http.post(_self.https.story,_self.param).then(
                (res)=>{
                    res = JSON.parse(res.data)
                    if(res.isSuccess){
                        _self.story = res.story;
                        document.title = _self.story.title
                        console.log(this.story)
                        _self.$Spin.hide();
                    }else{
                        _self.$Message.error(res.msg);
                    }
                },
                (err)=>{
                    _self.$Message.error(err)
                }
            )
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
        }
    }
})