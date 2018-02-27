new Vue({
    el: "#app",
    components: {
        'app-head': Head
    },
    data: {
        https: {
            test: `${GLOBAL_STATIC_API}test.php`
        }
    },
    mounted(){
        this.test();
    },
    methods:{
        test(){
            let _self = this
            _self.$http.post(_self.https.test,{emulateJSON:true}).then(
                (res)=>{
                    console.log(res)
                },
                (err)=>{
                    console.log(err)
                }
            )
        }
    }
})