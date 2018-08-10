<?php

//    namespace user;

// 加载基础文件

//首页故事列表   最热  推荐等等

    require __DIR__ . '/../../public/index.php';

    use think\Request;

    function typeStory($inv){
        $list = [];
        foreach ($inv as $k => $v) {
            $list[] = array('title' =>$v['title'],

                                    'cover' =>$v['cover'],

                                    'storyId' =>$v['storyId'],

                                    'state' =>$v['state']

                                     );

        }

        return $list;

    }

    function invests()

        {

            $ajax = Request::instance()->post(false);

            $size = 10;//每页显示数量
            $userId = $ajax['userId'];
            $page = $ajax['page'];
            $state = $ajax['state'];
            $where['type'] = $ajax['type'];
            $list = db('storytable')

                        ->where('state',$state)

                        ->where('userId',$userId)

                        ->where($where)

                        ->order('storyId','desc')->limit(($page-1)*$size, $size)->select();
            $count = db('storytable')

                       ->where('state',$state)

                       ->where('userId',$userId)

                       ->where($where)

                       ->order('storyId')->count();

            $data['list'] = typeStory($list);

            $data['isSuccess'] = true;

            $data['msg'] = '查询成功！';

            $data['count'] = $count;

            echo json_encode($data);

        }

        invests();