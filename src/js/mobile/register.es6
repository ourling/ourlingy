function isBlank(varValue) {
    if (varValue !== null && varValue !== undefined && varValue !== '' && varValue !== 'null') {
        return false;
    }
    return true;
}
let app = new Vue({
    el: "#app",
    data: {
        https: {
            register: `${GLOBAL_STATIC_API}user/create.php`,
            index: `${GLOBAL_HOME_URL}/mobile/success.html`
        },
        arg: {
            phone: "",
            name: '',
            pwd: '',
            sex: '男'
        },
        isOver: false, //本步表单是否填完
        btnTxt: '注 册', //按钮文本
        isAgree: false, //是否同意协议
        transformObj: {
            rpwd: "",
        },
    },
    methods: {
        contentUpdate() {
            /* input文字修改 */
            this.isOver = !isBlank(this.arg.name) && !isBlank(this.arg.pwd) && this.arg.pwd.length >= 6 && this.arg.pwd == this.transformObj.rpwd ? true : false;
        },
        blurEvent(e, type){
            /****
             * 失去焦点判断事件
             */
            let target, text;
            target = e.currentTarget;
            text = $(target).val();
            let $parent = $(target).parent('.input-group')
            if (isBlank(text)) {
                $(target).siblings('.txt').fadeIn();
                return $parent.addClass('error');
            } else {
                this.type(text, type,$parent);
            }
        },
        type(val, type,ele){
            //表单数据判断
            console.log(val,type,ele)
            switch (type) {
                case 'name':
                    if (val == '') {
                        ele.addClass('error')
                            .children('.txt').fadeIn()
                        return;
                    }else{
                        ele.removeClass('error').children('.txt').fadeOut()
                    }
                    break;
                case 'pwd':
                    if (val.length < 6) {
                        this.arg.pwd = '';
                        ele.addClass('error')
                            .children('.txt').fadeIn()
                        return;
                    }else{
                        ele.removeClass('error').children('.txt').fadeOut()
                    }
                    break;
                case 'rpwd':
                    if (val != this.arg.pwd) {
                        ele.addClass('error')
                            .children('.txt').fadeIn()
                        return;
                    }else{
                        ele.removeClass('error').children('.txt').fadeOut()
                    }
                    break;
            }
        },
        submit(){
            if (!this.isOver) return;
            this.http(this.arg)
        },
        http(arg){
            let _self = this
            this.$http.post(_self.https.register,arg).then(
                (res)=>{
                    res = JSON.parse(res.data)
                    if(res.isSuccess){
                        window.location.href = _self.https.index
                    }else{
                        alert(res.msg)
                    }
                },
                (err)=>{
                    alert('网络连接超时，请稍候重试');
                }
            )
        },
    }
})