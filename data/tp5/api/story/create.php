<?php
//    namespace user;
// 加载基础文件
    require dirname(dirname(__DIR__)) . '../thinkphp/base.php';
    class Story {
        /*故事编辑类
        *@param array $ajax 前端ajax数据
        */
        /*编辑新故事*/
        function create()
        {
            $ajax = Request::instance()->post(false);
            $storyId = Db::name('storytable')->insertGetId($ajax,false);
            $line = Db::table('storytable')->where('$storyId',$storyId)->find();
            $data = array('isSuccess'=>true,'msg'=>'新建故事成功！','data'=>$line);
            echo json_encode($data);
        }
    }
    $bar = new Story();
    $bar->create();