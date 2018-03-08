let upImg = {
    template: `
        <row>
            <i-col span="6" class="demo-upload-list" v-for="item in uploadList">
                <template v-if="item.status === 'finished'">
                    <img :src="item.url">
                    <div class="demo-upload-list-cover">
                        <icon type="ios-eye-outline" @click.native="handleView(item)"></icon>
                        <icon type="ios-trash-outline" @click.native="handleRemove(item)"></icon>
                    </div>
                </template>
                <template v-else>
                    <i-progress v-if="item.showProgress" :percent="item.percentage" hide-info></i-progress>
                </template>
            </i-col>
            <upload
                    ref="upload"
                    :show-upload-list="false"
                    :default-file-list="defaultList"
                    :on-success="handleSuccess"
                    :format="['jpg','jpeg','png']"
                    :max-size="2048"
                    :on-format-error="handleFormatError"
                    :on-exceeded-size="handleMaxSize"
                    multiple="false"
                    type="drag"
                    name="file"
                    :action="https.test"
                    style="display: inline-block;width:58px;">
                    <div style="width: 58px;height:58px;line-height: 58px;">
                        <icon type="camera" size="20"></icon>
                    </div>
            </upload>
            <modal title="View Image" v-model="visible">
                <img :src="viewPic.url" v-if="visible" style="width: 100%">
            </modal>
        </row>
    `,
    data(){
        return {
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
        }
    },
    mounted () {
        this.uploadList = this.$refs.upload.fileList;
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
    }
}
new Vue({
    el: "#app",
    components: {
        "up-img" : upImg
    }
})