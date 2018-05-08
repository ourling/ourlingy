$(".mask-tel").click(function(e){
    let $a = e.target.nodeName;
    let $c = e.target.classList[1];
    if($c == "mask-tel" || $c == "remove"){
        $(".mask-tel").fadeOut()
    }
});

let app = new Vue({
    el: "#app",
    components: {
        'app-head': Head,
        'app-foot': Foot
    },
    data: {

    },
    mounted(){

    },
    methods: {
        linkUrl(url){
            window.location.href = url
        }
    }
})