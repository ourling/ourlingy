<?php
//    namespace user;
// 加载基础文件
    require dirname(dirname(__DIR__)) . '../thinkphp/base.php';
        function create()
        {
            date_default_timezone_set("PRC");
            $date = date("Y-m-d H:i:s");
            $ajax = Request::instance()->post(false);
            $ajax['date'] = $date;
            $storyId = Db::name('storytable')->insertGetId($ajax,false);

            $data = array('isSuccess'=>true,'msg'=>'新建故事成功！');
            echo json_encode($data);
        }
    create();