new Vue({
    el: "#app",
    data: {
        https: {
            test: '//ourlingy.com/data/qiniu/examples/upload.php',
            // test: '//ourlingy.com/data/tp5/api/upload/upload.php',
        },
        defaultList: [
            {
                'name': 'a42bdcc1178e62b4694c830f028db5c0',
                'url': '//o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
            },
            {
                'name': 'bc7521e033abdd1e92222d733590f104',
                'url': '//o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'
            }
        ],
        imgName: '',
        viewPic: {},
        visible: false,
        uploadList: [],
    },
    methods: {
        handleView (item) {
            this.viewPic = item;
            this.visible = true;

        },
        handleRemove (file) {
            // 从 upload 实例删除数据
            const fileList = this.$refs.upload.fileList;
            this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
        },
        handleSuccess (res, file) {
            file.url = res.data.url;
            file.name = res.data.name;
        },
        handleFormatError (file) {
            this.$Notice.warning({
                title: '文件格式不正确',
                desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
            });
        },
        handleMaxSize (file) {
            this.$Notice.warning({
                title: '超出文件大小限制',
                desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
            });
        },
    },
    mounted () {
        this.uploadList = this.$refs.upload.fileList;
    }
})