<?php
//    namespace user;
// 加载基础文件
    require __DIR__ . '/../../public/index.php';
    use think\Request;
    //检查文章是否已经存在
    function checkTitle($title)
    {
        $sizeof = sizeof(db('storytable')->where('title',$title)->column('storyId'),0);
        return $sizeof;
    }
    function create()
    {
        date_default_timezone_set("PRC");
        $date = date("Y-m-d H:i:s");
        $ajax = Request::instance()->post(false);
        $ajax['date'] = $date;
        $title = $ajax['title'];
        $code = checkTitle($title);
        if($code != 0){
            //故事已经存在
            $data = ['isSuccess'=>false,'msg'=>'故事或故事名称已经存在，请更换！','data'=>[]];
        }else{
            //故事可以创建
            $storyId = Db::name('storytable')->insertGetId($ajax,false);
            $data = array('isSuccess'=>true,'msg'=>'故事新建成功！');
        }
        echo json_encode($data);
    }
    create();