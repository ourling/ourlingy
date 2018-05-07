<?php
//    namespace user;
// 加载基础文件
    require __DIR__ . '/../../public/index.php';
    use think\Request;
    function invests()
        {
            $ajax = Request::instance()->post(false);
            $storyId = $ajax['storyId'];
            $item = db('storytable')
                        ->where('storyId', $storyId)
                        ->where('state',1)->select();
            if(count($item)){
                $item = $item[0];
                $typeId = $item['type'];
                $userId = $item['userId'];
                $type = db('typetable')
                            ->field(['type'])
                            ->where('typeId', $typeId)->select();
                $user = db('usertable')
                            ->field(['name'])
                            ->where('userId', $userId)->select();
                $data['story'] = [
                    'type'=>$type[0]['type'],
                    'user'=>$user[0]['name'],
                    'title'=>$item['title'],
                    'html'=>$item['text'],
                    'title'=>$item['title'],
                    'desc'=>$item['desc'],
                    'like'=>$item['like'],
                    'date'=>$item['date'],
                    'lookNum'=>$item['lookNum']
                    ];
                $data['isSuccess'] = true;
                $data['msg'] = '查询成功！';
            }else{
                $data['isSuccess'] = false;
                $data['msg'] = '查询失败！';
            }
            echo json_encode($data);
        }
        invests();