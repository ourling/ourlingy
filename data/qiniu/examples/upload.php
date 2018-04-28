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
    if(count($_FILES)){
      $filePath = $_FILES['file']['tmp_name'];
      // 上传到七牛后保存的文件名
      $key = md5(time()).'.png';
      // 初始化 UploadManager 对象并进行文件的上传。
      $uploadMgr = new UploadManager();
      // 调用 UploadManager 的 putFile 方法进行文件的上传。
      list($ret, $err) = $uploadMgr->putFile($token, $key, $filePath);
      if ($err !== null) {
          $data = [
                  'isSuccess'=>false,
                  'msg'=>'图片上传失败，请重新上传',
                  'data'=>[]];
      } else {
        $file = [
                'url'=>'//ozjrt1c1f.bkt.clouddn.com/'.$key,
                'name'=>$_FILES['file']['name'],
                'userId'=>$_COOKIE['userId']
                ];
        $data = ['isSuccess'=>true,'msg'=>'图片上传成功','data'=>$file];
        $userId = $file['userId'];
        $url = $file['url'];
        $name = $file['name'];
        $con = mysqli_connect("qdm19334835.my3w.com","qdm19334835","bin110123","qdm19334835_db");
        $sql="INSERT INTO imgtable VALUES (null,'$userId','$url','$name','finished')";
        $result=mysqli_query($con,$sql);
        mysqli_close($con);
      }      
    }else{
      $data = [
        'isSuccess'=>false,
        'msg'=>'图片已超过1.5M，请重新上传',
        'data'=>[]];
    }
    
    echo json_encode($data);