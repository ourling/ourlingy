new Vue({
    el: "#app",
    components: {
        'app-head': Head
    },
    data: {
        https: {
            test: `${GLOBAL_STATIC_API}user/create.php`,
            // test: `${GLOBAL_STATIC_API}test.php`,
        },
        userData:{
            phone: '17099298919',
            name: "测试",
            pwd: "bin110123",
            age: '15',
            sex: "男",
            head: ""
        }
    },
    mounted(){
        this.test();
    },
    methods:{
        test(){
            let _self = this
            _self.$http.post(_self.https.test,this.userData,{emulateJSON:true}).then(
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