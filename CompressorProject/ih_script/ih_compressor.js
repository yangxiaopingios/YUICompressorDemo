/**
 * Created by yangyang on 17/1/5.
 */
    
var compressor = require('yuicompressor');
var fs = require( "fs" );
var path = require('path');

function ih_writeFile(dir, fileName, data){
    return new Promise(function (resolve, reject) {
        fs.writeFile(path.resolve(dir + fileName), data, function(err){
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

/**
 *压缩单个文件
 *
 * compressFileName 压缩文件名
 * 压缩文件所在文件夹路径
 * 压缩后的文件存放的文件夹路径
 */
function compressorFile(compressFileName, fileDir, minDir){
    console.log(fileDir);
    console.log(minDir);
    compressor.compress(path.resolve(fileDir + '/' + compressFileName + '.js'), {
        // defaults to 'utf8' 被压缩文件编码
        charset: 'utf8',
        // defaults to 'js'    被压缩文件类型
        type: 'js',
        //注释nomunge 选项，否则 YUI Compressor 将自动缩短 JavaScript 文件中的变量名
        // nomunge: true,
        //多长内容换行
        'line-break': 80
    }, async function(err, data, extra) {
        //err  当不为null 压缩出现错误
        console.log(err);
        //data  压缩完的字符串
        if(!err){
            let result = await ih_writeFile(minDir+'/', compressFileName + '.min.js', data);
            if(result){
                console.log('压缩成功啦');
            }
        }
        //extra 警告消息
        console.log(extra);
    });
}

//compressorFile('login_v2', '.', '.');

//使用fs.readdir读取目录，重点其回调函数中files对象
//fs.readdir(path, callback);


/**
 *压缩文件夹下的所有文件
 *
 * ih_dir 压缩文件夹路径
 */
function compressFolder(ih_dir){
    fs.readdir(ih_dir, function (err, files) {
        if(err) {
            console.error(err);
            return;
        } else {
            fs.exists(ih_dir + '/min', function (exists) {
                if(exists){
                    console.log('目录存在');
                    files.forEach(function (file) {
                        var arr = file.split('.js');
                        if(arr.length === 2){
                            console.log(arr[0] + '开始压缩了');
                            compressorFile(arr[0], ih_dir, ih_dir + '/min');
                        }
                    });
                }else {
                    fs.mkdir(path.resolve('./' + dirName + '/min'), function (err) {
                        if(err)
                            throw err;
                        console.log('创建目录成功')
                        files.forEach(function (file) {
                            var arr = file.split('.js');
                            if(arr.length === 2){
                                console.log(arr[0] + '开始压缩了');
                                compressorFile(arr[0], ih_dir, ih_dir + '/min');
                            }
                        });
                    });
                }
            });
        }
    });
}

var dirName = 'files';
var ih_dir = path.resolve('./' + dirName);
compressFolder(ih_dir);
