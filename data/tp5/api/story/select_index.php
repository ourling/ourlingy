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
                                    'userId' =>$v['userId'],
                                    'cover' =>$v['cover'],
                                    'storyId' =>$v['storyId']
                                     );
        }
        return $list;
    }
    function invests()
        {
            $ajax = Request::instance()->post(false);
            $size = 6;//每页显示数量
            $host = db('storytable')
                        ->where('state',1)
                        ->where('isHot',1)
//                        ->order('lookNum','desc')->limit($size)->select();
                        ->order('storyId','desc')->limit($size)->select();
            $new = db('storytable')
                        ->where('state',1)
                        ->order('date','desc')->limit($size)->select();
            $recomment = db('storytable')
                        ->where('state',1)
                        ->where('isRecommend',1)
                        ->order('storyId','desc')->limit($size)->select();
            $data['hostList'] = []; //最热
            $data['newList'] = [];  //最新
            $data['recomList'] = []; //推荐

            $data['hostList'] = typeStory($host);
            $data['newList'] = typeStory($new);
            $data['recomList'] = typeStory($recomment);
            $data['isSuccess'] = true;
            $data['msg'] = '查询成功！';
            echo json_encode($data);
        }
        invests();