<?php
//    namespace user;
// 加载基础文件
    require __DIR__ . '/../../public/index.php';
    use think\Request;
    /*检查类
    *@param string $phone 用户手机号
    */
    class Check {
        //检查手机号是否已经存在
        function checkTable($phone,$name)
        {
//            $sizeofPhone = sizeof(db('usertable')->where('phone',$phone)->column('userId'),0);
            $sizeofName = sizeof(db('usertable')->where('name',$name)->column('userId'),0);
//            if($sizeofPhone == 0 && $sizeofName == 0){
//                $code = 1; // 正常
//            }
//            if($sizeofPhone == 1 && $sizeofName == 0){
//                $code = 2; //手机号重复
//            }
//            if($sizeofPhone == 1 && $sizeofName == 1){
//                $code = 2; //手机号重复
//            }
//            if($sizeofPhone != 1 && $sizeofName == 1){
//                $code = 3; //用户名重复
//            }
         if($sizeofName == 0){
                $code = 1; // 正常
            }
            if($sizeofName == 1){
                $code = 3; //用户名重复
            }
            return $code;
        }
    }
    class User {
        /*注册逻辑类
        *@param array $ajax 前端ajax数据
        */
        /*注册客户*/
        function post()
        {
            date_default_timezone_set("PRC");
            $date = date("Y-m-d H:i:s");
            $check = new Check();
            $ajax = Request::instance()->post(false);
            $phone = $ajax['phone'];
            $name = $ajax['name'];
            $code= $check->checkTable($phone,$name);
            switch ($code)
            {
            case 1:
              $ajax['date'] = $date;
              $userId = db('usertable')->insertGetId($ajax,false);
              $line = db('usertable')->where('userId',$userId)->find();
              $data = ['isSuccess'=>true,'msg'=>'注册成功！','data'=>$line];
              break;
//            case 2:
//              $data = ['isSuccess'=>false,'msg'=>'手机号已经存在，请直接登录','data'=>[]];
//              break;
            case 3:
              $data = ['isSuccess'=>false,'msg'=>'昵称已经存在，请更换','data'=>[]];
              break;
            }
            echo json_encode($data);
        }
    }
    $bar = new User();
    $bar->post();