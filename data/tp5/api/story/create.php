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
            date_default_timezone_set("PRC");
            $date = date("Y-m-d H:i:s");
            $ajax = Request::instance()->post(false);
            $ajax['date'] = $date;
            $ajax['userName'] = Db::table('usertable')->where('userId',$ajax['userId'])->find('name');
            $storyId = Db::name('storytable')->insertGetId($ajax);
            $line = Db::table('storytable')->where('storyId',$storyId)->find();
            $data = array('isSuccess'=>true,'msg'=>'新建故事成功！','data'=>$line);
            echo json_encode($data);
        }
    }
    $bar = new Story();
    $bar->create();