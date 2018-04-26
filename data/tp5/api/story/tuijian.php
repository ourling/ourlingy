<?php
//    namespace user;
// 加载基础文件
//首页故事列表   最热  推荐等等
    require __DIR__ . '/../../public/index.php';
    use think\Request;
    /**
     * 随机获取数据
     * @param string $num  抽取条数
     * @param string $table    表名
     * @param string $where    查询条件
     * @return array
     */
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
    function random_data($num,$table)
    {
        $pk = db($table)->getPK();//获取主键
        $countcus = db($table)
                    ->where('state',1)
                    ->where('isRecommend',1)
                    ->field($pk)->select();//查询数据
        $con = '';
        $qu = '';
        foreach($countcus as $v=>$val){
            $con.= $val[$pk].'|';
        }
        $array = explode("|",$con);
        $countnum = count($array)-1;
        for($i = 0;$i <= $num;$i++){
            $sunum = mt_rand(0,$countnum);
            $qu.= $array[$sunum].',';
        }
        $list = db($table)->where($pk,'in',$qu)->select();
        return $list;
    }
    $data['recomList'] = []; //推荐
    $data['recomList'] = typeStory(random_data(4,'storytable'));
    $data['isSuccess'] = true;
    $data['msg'] = '查询成功！';
    echo json_encode($data);