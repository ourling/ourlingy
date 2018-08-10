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
            $item = db('storytable')

                        ->where('storyId', $storyId)

                        ->delete();

             if($item == 1){
                 $data['isSuccess'] = true;
                 $data['msg'] = '删除成功！';
             }else{
                 $data['isSuccess'] = false;
                 $data['msg'] = '删除失败，稍后重试！';
             }
            echo json_encode($data);
        }

        invests();