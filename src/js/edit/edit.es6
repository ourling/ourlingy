new Vue({
    el: "#app",
    components:{
        'app-head': Head,
        'app-foot':Foot
    },
    data: {
        https: {
            test: `${GLOBAL_STATIC_API}user/create.php`,
        },
        formItem: {
            input: '',
            textarea: ''
        },
        modal1: false
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
        modelOk(){
            this.$Message.info('Clicked ok');
        },
        modelCancel () {
            this.$Message.info('Clicked cancel');
        }
    }
})