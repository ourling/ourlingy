<?php
//    namespace user;
// 加载基础文件
//故事搜索   故事列表
    require dirname(dirname(__DIR__)) . '../thinkphp/base.php';
    function invests()
        {
            $ajax = Request::instance()->post(false);
            $size = 10;//每页显示数量
            $page = $ajax['page'];
            $type = $ajax['type'];
            $title = $ajax['title'];
            if($type == 0){
                $invests = Db::table('storytable')
                            ->where('title','like', '%'.$title.'%')
                            ->where('state',1)
                            ->order('storyId','desc')->limit(($page-1)*$size, $size)->select();
                $count = Db::table('storytable')
                            ->where('title','like', '%'.$title.'%')
                            ->where('state',1)
                            ->order('storyId')->count();
            }else{
                $invests = Db::table('storytable')
                            ->where('type',$type)
                            ->where('title',$title)
                            ->where('state',1)
                            ->order('storyId','desc')->limit(($page-1)*$size, $size)->select();
                $count = Db::table('storytable')
                            ->where('type',$type)
                            ->where('title',$title)
                            ->where('state',1)
                            ->order('storyId')->count();
            }
            $data['list'] = [];
            foreach ($invests as $k => $v) {
                $data['list'][] = array('title' =>$v['title'],
                                        'userId' =>$v['userId'],
                                        'desc' =>$v['desc'],
                                        'cover' =>$v['cover'],
                                        'storyId' =>$v['storyId']
                                         );
            }
            $data['page'] = $page;
            $data['count'] = $count;
            $data['isSuccess'] = true;
            $data['msg'] = '查询成功！';
            echo json_encode($data);
        }
        invests();