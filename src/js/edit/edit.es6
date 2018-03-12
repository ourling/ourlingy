new Vue({
    el: "#app",
    components:{
        'app-head': Head,
        'app-foot':Foot,
        "cover-img" : coverImg
    },
    data: {
        https: {
            storyCreate: `${GLOBAL_STATIC_API}story/create.php`,
        },
        viewInfo: {
            cover: "http://ozjrt1c1f.bkt.clouddn.com/1f2a9a4ecf5457208557c8a15ee1d4c3.png",
        },
        info: {
            userId: "1",
            title: "",
            desc: "",
            text: "",
            type: 1,
            cover: "",
        },
        boo: {
            isOpenCover: false,
        },
        ue: null,
    },
    mounted(){
        let _self = this
        _self.initEdit();
    },
    methods: {
        //初始化editor
        initEdit(){
            this.ue = UE.getEditor('editor')
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
        submit(){
            let _self = this
            _self.info.cover = _self.viewInfo.cover
            _self.info.text = _self.ue.getContent()
            _self.createStory(_self.info);
        }
    }
})