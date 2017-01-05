/**
 * Created by yangyang on 17/1/5.
 */
    
var compressor = require('yuicompressor');
var fs = require( "fs" );
var path = require('path');

compressor.compress(path.resolve('./bootstrap.js'), {
    // defaults to 'utf8' 被压缩文件编码
    charset: 'utf8',
    // defaults to 'js'    被压缩文件类型
    type: 'js',
    // defaults to 'false'
    //当为false 被压缩文件自动缩短 JavaScript 文件中的变量名。
    // nomunge: false,
    //多长内容换行
    'line-break': 80
}, async function(err, data, extra) {
    //err  当不为null 压缩出现错误
    console.log(err);
    //data  压缩完的字符串
    if(!err){
        let result = await ih_writeFile('bootstrap.min.js', data);
        if(result){
            console.log('压缩成功啦');
        }
    }
    //extra 警告消息
    console.log(extra);
});

function ih_writeFile(fileName, data){
    return new Promise(function (resolve, reject) {
        fs.writeFile(path.resolve('./' + fileName), data, function(err){
            if (err){
                console.log(err);
                reject (false);
            }
            else {
                resolve (true);
            }
        });
    });
}
