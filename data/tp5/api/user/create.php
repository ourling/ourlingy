<?php
//    namespace user;
// 加载基础文件
    require dirname(dirname(__DIR__)) . '../thinkphp/base.php';
    /*检查类
    *@param string $phone 用户手机号
    */
    class Check {
        //检查手机号是否已经存在
        function checkUser($phone)
        {
            $sizeof = sizeof(Db::table('usertable')->where('phone',$phone)->column('userId'),0);
            return $sizeof;
        }
    }
    class User {
        /*注册逻辑类
        *@param array $ajax 前端ajax数据
        */
        /*注册客户*/
        function post()
        {
            $check = new Check();
            $ajax = Request::instance()->post(false);
            $phone = $ajax['phone'];
            $boo= $check->checkUser($phone);
            if($boo == 1){
                //已经存在
                $data = ['isSuccess'=>false,'msg'=>'手机号已经存在，请直接登录','data'=>[]];
            }else{
                //不存在
                $userId = Db::name('usertable')->insertGetId($ajax,false);
                $line = Db::table('usertable')->where('userId',$userId)->find();
                $data = ['isSuccess'=>true,'msg'=>'注册成功！','data'=>$line];
            }
            echo json_encode($data);
        }
    }
    $bar = new User();
    $bar->post();