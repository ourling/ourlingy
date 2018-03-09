new Vue({
    el: "#app",
    components:{
        'app-head': Head,
        'app-foot':Foot,
        "cover-img" : coverImg
    },
    data: {
        https: {
            test: `${GLOBAL_STATIC_API}user/create.php`,
        },
        coverList: [
            {
                'id': 12,
                'name': 'a42bdcc1178e62b4694c830f028db5c0',
                'url': '//o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
            },
            {
                'id': 13,
                'name': 'bc7521e033abdd1e92222d733590f104',
                'url': '//o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'
            }
        ],
        viewInfo: {
            cover: "http://ozjrt1c1f.bkt.clouddn.com/1f2a9a4ecf5457208557c8a15ee1d4c3.png",
        },
        info: {
            cover: "",
            title: "预览标题",
            desc: ""
        },
        boo: {
            isOpenCover: false,
        },
    },
    mounted(){
        let _self = this
        _self.initEdit();
    },
    methods: {
        //初始化editor
        initEdit(){
            UE.getEditor('editor')
        },
        selectCover(item){
            console.log(item)
            let _self = this
            _self.viewInfo.cover = item.url
        }
    }
})