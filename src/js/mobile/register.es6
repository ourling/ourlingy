function isBlank(varValue) {
    if (varValue !== null && varValue !== undefined && varValue !== '' && varValue !== 'null') {
        return false;
    }
    return true;
}
let Local =  'http://121.199.182.2:30004';
let app = new Vue({
    el: "#app",
    data: {
        https: {
            register:`${Local}/hrm/account/register.do`,
            getCode: `${Local}/hrm/account/getRegisterCode.do`,
            checkCode: `${Local}/hrm/account/checkRegisterCode.do`,
            index: './index.html'
        },
        arg: {
            name: '',
            pwd: ''
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
            this.isOver = !isBlank(this.arg.name) && !isBlank(this.arg.pwd) && this.arg.pwd.length >= 8 && this.arg.pwd == this.transformObj.rpwd ? true : false;
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
            this.$http.post(_self.https.register,arg,{emulateJSON:true}).then(
                (res)=>{
                    res = res.body
                    if(res.code == '0'){
                        _self.arg = {
                            phone: '',
                            email: '',
                            code: '',
                            userName: '',
                            password: '',
                            shopName: ''
                        }
                        window.location.href = _self.https.index
                        return layer.msg(res.message, {icon: 1, time: 1000});
                    }else if(res.code == '1'){
                        _self.arg.email = ''
                        _self.isOver = false
                        $('#email').addClass('error')
                        layer.msg(res.message, {icon: 5, time: 1000});
                    }else{
                        layer.msg(res.message, {icon: 5, time: 1000});
                    }
                },
                (err)=>{
                    layer.msg('网络连接超时，请稍候重试', {icon: 5, time: 1000});
                }
            )
        },
    }
})