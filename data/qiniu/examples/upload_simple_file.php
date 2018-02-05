<?php
require_once __DIR__ . '/../autoload.php';

// 引入鉴权类
use Qiniu\Auth;

// 引入上传类
use Qiniu\Storage\UploadManager;
// 需要填写你的 Access Key 和 Secret Key
$accessKey = getenv('QINIU_ACCESS_KEY');
$secretKey = getenv('QINIU_SECRET_KEY');
$bucket = getenv('QINIU_TEST_BUCKET');

// 构建鉴权对象
$auth = new Auth('jwjY-VZv9b1XDjzbMLwy4mnHexYxu_ZPgCu9U-CD', 'YokwwLhFU7SOdEkTTAMv_WFpvmsXnFefL4UyknxA');

// 生成上传 Token
$token = $auth->uploadToken('ourlingy');

// 要上传文件的本地路径
$filePath = './php-logo.png';

// 上传到七牛后保存的文件名
$key = md5(time()).'.png';

// 初始化 UploadManager 对象并进行文件的上传。
$uploadMgr = new UploadManager();

// 调用 UploadManager 的 putFile 方法进行文件的上传。
list($ret, $err) = $uploadMgr->putFile($token, $key, $filePath);
echo "\n====> putFile result: \n";
if ($err !== null) {
    var_dump($err);
} else {
    var_dump('http://ozjrt1c1f.bkt.clouddn.com/'.$key);
}
