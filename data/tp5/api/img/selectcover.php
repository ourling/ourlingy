<?php
//    namespace user;
// 加载基础文件
    require dirname(dirname(__DIR__)) . '../thinkphp/base.php';
    function invests()
        {
            $ajax = Request::instance()->post(false);
//            $size = $ajax['size'];
            $size = 7;//每页显示数量
            $page = $ajax['page'];
            $userId = $ajax['userId'];
//            $page = '1';
//            $userId = '1';
            $invests = Db::table('imgtable')->where('userId',$userId)->order('imgId','desc')->limit(($page-1)*$size, $size)->select();
            $count = Db::table('imgtable')->where('userId',$userId)->order('imgId')->count();
            foreach ($invests as $k => $v) {
                $data['list'][] = array('imgId' =>$v['imgId'],
                                        'userId' =>$v['userId'],
                                        'url' =>$v['url'],
                                        'name' =>$v['name'],
                                        'status'=>'finished'
                                         );
            }
            $data['page'] = $page;
            $data['count'] = $count;
            $data['isSuccess'] = true;
            $data['msg'] = '查询成功！';
            echo json_encode($data);
        }
        invests();