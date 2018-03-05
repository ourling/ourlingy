new Vue({
    el: "#app",
    components: {
        'app-head': Head,
        'app-foot':Foot
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
        },
        defaultList: [
            {
                'name': 'a42bdcc1178e62b4694c830f028db5c0',
                'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
            },
            {
                'name': 'bc7521e033abdd1e92222d733590f104',
                'url': 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'
            }
        ],
        imgName: '',
        visible: false,
        uploadList: []
    },
    mounted(){
        this.test();
        // this.uploadList = this.$refs.upload.fileList;
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
        },
        handleView (name) {
            this.imgName = name;
            this.visible = true;
        },
        handleRemove (file) {
            const fileList = this.$refs.upload.fileList;
            this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
        },
        handleSuccess (res, file) {
            console.log(res)
            console.log(file)
            // file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
            // file.name = '7eb99afb9d5f317c912f08b5212fd69a';
        },
        handleFormatError (file) {
            this.$Notice.warning({
                title: 'The file format is incorrect',
                desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
            });
        },
        handleMaxSize (file) {
            this.$Notice.warning({
                title: 'Exceeding file size limit',
                desc: 'File  ' + file.name + ' is too large, no more than 2M.'
            });
        },
        handleBeforeUpload () {
            const check = this.uploadList.length < 5;
            if (!check) {
                this.$Notice.warning({
                    title: 'Up to five pictures can be uploaded.'
                });
            }
            return check;
        }
    }
})