<?php
//    namespace user;
// 加载基础文件
    require __DIR__ . '/../../public/index.php';
    use think\Request;
    //检查文章是否已经存在
    function create()
    {
        $ajax = Request::instance()->post(false);
        //故事可以创建
        $storyId = db('parttimetable')->insertGetId($ajax,false);
        $data = array('isSuccess'=>true,'msg'=>'兼职新建成功！');
        echo json_encode($data);
    }
    create();