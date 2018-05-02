<?php
//    namespace user;
// 加载基础文件
    require __DIR__ . '/../../public/index.php';
    use think\Request;
    function invests()
        {
            $ajax = Request::instance()->post(false);
            $size = 7;//每页显示数量
            $page = $ajax['page'];
            $userId = $ajax['userId'];
            $invests = db('imgtable')->where('userId',$userId)->order('imgId','desc')->limit(($page-1)*$size, $size)->select();
            $count = db('imgtable')->where('userId',$userId)->order('imgId')->count();
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