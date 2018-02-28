new Vue({
    el: "#app",
    components: {
        'app-head': Head
    },
    data: {
        https: {
            test: `${GLOBAL_STATIC_API}user/create.php`,
            story: `${GLOBAL_STATIC_API}story/create.php`,
            storySele: `${GLOBAL_STATIC_API}story/select.php`,
            // test: `${GLOBAL_STATIC_API}test.php`,
        },
        userData:{
            phone: '17099298919',
            name: "测试",
            pwd: "bin110123",
            age: '15',
            sex: "男",
            head: ""
        },
        storyData:{
            userId: 1,
            title: "标题",
            dec:"摘要",
            text:"故事主体",
            type: 3,//故事类型
        },
        selectData:{
            type: 2,
            userId: 1,
            title: "标题1",
        }
    },
    mounted(){
        this.test();
    },
    methods:{
        test(){
            let _self = this
            _self.$http.post(_self.https.storySele,this.selectData,{emulateJSON:true}).then(
                (res)=>{
                    res = JSON.parse(res.data)
                    console.log(res);
                },
                (err)=>{
                    console.log(err)
                }
            )
        }
    }
})