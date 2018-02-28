<?php
// 加载基础文件
    require dirname(dirname(__DIR__)) . '../thinkphp/base.php';
    class Story {
        /*故事筛选类
        *@param array $ajax 前端ajax数据
        */
        /*通过类型筛选故事*/
        function select_type()
        {
            $ajax = Request::instance()->post(false);
            $line = Db::table('storytable')->where('type',$ajax['type'])->limit(10)->select();
            $data= array('isSuccess'=>true,'msg'=>'查询成功！','data'=>$line);
            echo json_encode($data);
        }
        function select_other()
        {
            $ajax = Request::instance()->post(false);
            $title = '标题';
            $line = Db::table('storytable')
                    ->where('title','like','%'.$ajax['title'].'%')
                    ->limit(10)
                    ->select();
            $data= array('isSuccess'=>true,'msg'=>'查询成功！','data'=>$line,'num'=>12);
            echo json_encode($data);
        }
    }
    $bar = new Story();
//    $bar->select_type();
    $bar->select_other();