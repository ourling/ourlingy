<?php

//    namespace user;

// 加载基础文件

//首页故事列表   最热  推荐等等

    require __DIR__ . '/../../public/index.php';
    use think\Request;
    function typeStory($inv){
        $list = [];
        foreach ($inv as $k => $v) {
            $user = db('usertable')->where('userId',$v['userId'])->select();
            $list[] = array('title' =>$v['title'],
                            'userId' =>$v['userId'],
                            'user' =>$user[0]['name'],
                            'cover' =>$v['cover'],
                            'storyId' =>$v['storyId'],
                            'desc' =>$v['desc'],
                            'date' =>$v['date'],
                            );
        }
        return $list;
    }

    function invests()

        {

            $ajax = Request::instance()->post(false);
            $size = 6;//每页显示数量
            $page = $ajax['page'];
            $list = db('storytable')
                        ->where('state',1)
                        ->order('date','desc')
                        ->limit(($page-1)*$size, $size)
                        ->select();
            $data['list'] = typeStory($list);
            $data['count'] = db('storytable')->where('state',1)->count();
            $data['isSuccess'] = true;
            $data['msg'] = '查询成功！';
            echo json_encode($data);
        }
 
        invests();