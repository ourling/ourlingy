<?php

//    namespace user;

// 加载基础文件

//首页故事列表   最热  推荐等等

    require __DIR__ . '/../../public/index.php';

    use think\Request;

    function invests()

        {

            $ajax = Request::instance()->post(false);

            $storyId = $ajax['storyId'];
            $updata["isRecommend"] = $ajax['isRecommend'];
            $item = db('storytable')

                        ->where('storyId', $storyId)

                        ->update($updata);

             if($item == 1){
                 $data['isSuccess'] = true;
                 $data['msg'] = '更新成功！';
             }else{
                 $data['isSuccess'] = false;
                 $data['msg'] = '更新失败，稍后重试！';
             }
            echo json_encode($data);
        }

        invests();