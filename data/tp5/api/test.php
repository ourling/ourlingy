<?php
// 定义应用目录
//define('APP_PATH', __DIR__ . '/../application/');
// 加载框架引导文件
    require __DIR__ . '/../public/index.php';
    $ret = db('test')->where('id',1)->find();
    echo json_encode($ret);
