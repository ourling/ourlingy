<?php
//     [ 应用入口文件 ]
    namespace think;
// 加载基础文件
    require __DIR__ . '/../thinkphp/base.php';
    $ret = Db::table('ageTable')->where('id',1)->find();
    echo json_encode($ret);
