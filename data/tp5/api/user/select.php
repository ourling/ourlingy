<?php
//    namespace user;
// 加载基础文件
    require dirname(dirname(__DIR__)) . '../thinkphp/base.php';
    /*检查类
    *@param string $phone 用户手机号
    */
    class Check {
        //检查手机号是否已经存在
        function checkUser($name,$pwd)
        {
            $sizeof = sizeof(Db::table('usertable')
                    ->where('name',$name)
                    ->where('pwd',$pwd)
                    ->column('userId'),0);
            return $sizeof;
        }
    }
    class User {
        /*注册逻辑类
        *@param array $ajax 前端ajax数据
        */
        /*用户登录*/
        function post()
        {
            date_default_timezone_set("PRC");
            $date = date("Y-m-d H:i:s");
            $check = new Check();
            $ajax = Request::instance()->post(false);
            $name = $ajax['name'];
            $pwd = $ajax['pwd'];
            $boo= $check->checkUser($name,$pwd);
            if($boo == 1){
                //正常登录
                $line = Db::table('usertable')->where('name',$name)->find();
                $data = ['isSuccess'=>true,'msg'=>'登录成功！','data'=>$line];
            }else{
                //登录失败
                $data = ['isSuccess'=>false,'msg'=>'用户名或密码错误！','data'=>[]];
            }
            echo json_encode($data);
        }
    }
    $bar = new User();
    $bar->post();