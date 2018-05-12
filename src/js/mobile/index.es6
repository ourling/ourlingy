$(".mask-tel").click(function(e){
    let $a = e.target.nodeName;
    let $c = e.target.classList[1];
    if($c == "mask-tel" || $c == "remove"){
        $(".mask-tel").fadeOut()
    }
});

let app = new Vue({
    el: "#app",
    mixins: [mixin],
    components: {
        'app-head': Head,
        'app-foot': Foot
    },
    data: {
        listUrl: '//ourlingy.com/mobile/list.html'
    },
    mounted(){

    },
    methods: {
        linkUrl(url){
            window.location.href = url
        },
        toList(type){
            window.location.href = `${this.listUrl}?type=${type}`
        },
        openModel(){
            $('.mask-erwei').fadeIn();
        },
        closeModel(){
            $('.mask-erwei').fadeOut();
        },
    }
})