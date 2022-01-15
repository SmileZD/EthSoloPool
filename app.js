var wakuang=8888;
var houtai=80;
var net = require('net');
var suanliarr = {};//矿机对象集合
const trim = require('lodash/trim');
var express = require('express');
var app = express();
function isEmpty(value) {return (Array.isArray(value) && value.length === 0) || (Object.prototype.isPrototypeOf(value) && Object.keys(value).length === 0);}
function errorHandler(err, req, res, next) {}
app.use(errorHandler);
app.all("*", function (req, res, next) {res.header("Access-Control-Allow-Origin", '*');res.header("Access-Control-Allow-Headers", 'content-type');next();})
app.get('/s', function (req, res) {try {res.send(getlen3())} catch (err) {res.send('报错了');console.log('s_err',err)}})
app.get('/', function (req, res) {
    try {
        var getaddress = req.query.address;
        if (getaddress) {res.send('<center><table border="1"><tr><td>序号</td><td>矿机名</td><td>上报算力</td><td>最近提交</td><td>在线时长</td><td>在线</td></tr>' + getlen2(getaddress) + '</table>')
        } else {
            let gett = getlen()
                res.send('当前进程pid：' + process.pid + '<br>'
                    +'当前内存占用：' + (process.memoryUsage().rss / 1024 / 1024).toFixed(2) + 'MB' + '<br>'
                     + '当前在线矿机：' + gett.count + '台<br>'
                     + '当前在线地址：<br>'
                    +gett.arr);
        }
    } catch (err) {
        res.send('报错了')
        console.log(err)
    }
})
function getlen() {//获取当前在线矿机数量和地址列表
    let count = 0;
    let addresslist = [];
    let addresslistarr = '';
    try {
        for (var key in suanliarr) {
            if (suanliarr[key] && suanliarr[key].o == true) {
                count++
                if (!addresslist.includes(suanliarr[key].a)) {
                    addresslist.push(suanliarr[key].a)
                    addresslistarr += '<a href="?address=' + suanliarr[key].a + '">' + suanliarr[key].a + '</a><br>';
                }
            }
        }
        addresslistarr += '<br><a href="/s">合计</a><br>';
    } catch (err) {
        console.log(err)
    }
    return {
        count: count,
        arr: addresslistarr
    }
}

function getlen2(address) {//获取该地址矿机算力
    let backstr = '';
    let slqh = 0;
    let iii = 1;
    let slhj = 0;
    try {
        for (var key in suanliarr) {
            if (suanliarr[key].a == address) {
                backstr = backstr +
                    '<tr>' +
                    '<td>' +
                    iii +
                    '</td>' +
                    '<td>' +
                    suanliarr[key].n +
                    '</td>' +
                    '<td>' +
                    suanliarr[key].h +
                    '</td>' +
                    '<td>' +
                    (((new Date().getTime()) - suanliarr[key].t1) / 1000).toFixed(2) + '秒前' +
                    '</td>' +
                    '<td>' +
                    (((new Date().getTime()) - suanliarr[key].t2) / 1000).toFixed(2) + '秒前' +
                    '</td>' +
                    '<td>' +
                    (suanliarr[key].o ? '在线' : '离线') +
                    '</td>' +
                    '</tr>';
                slqh = (parseFloat(slqh) + parseFloat(suanliarr[key].h.slice(0, suanliarr[key].h.length - 1))).toFixed(2)
                iii++
            }
        }
        backstr += '<tr><td>合计</td><td colspan="5">' + slqh + 'M</td></tr>'
    } catch (err) {
        console.log(err)
    }
    return backstr
}

function getlen3() {//获取在线矿机总算力
    let backstr = '';
    let slqh = 0;
    let iii = 1;
    let slhj = 0;
    try {
        for (var key in suanliarr) {
            if (suanliarr[key].o == true) {
                slhj = (parseFloat(slhj) + parseFloat(suanliarr[key].h.slice(0, suanliarr[key].h.length - 1))).toFixed(2)
            }
        }
        backstr += '合计:' + slhj + 'M'
    } catch (err) {
        console.log(err)
    }
    return backstr
}

function gettime() {//获取当前时间
    return new Date().toLocaleString().replace(/:\d{1,2}$/, ' ');
}
var havecon=false
var result='';
var diff='0xffff80403fbff02ff7e4100bf0fe0a7d3a44022c8fea432ed8f95f39';
const WebSocket = require('ws')
var ws = new WebSocket('ws://127.0.0.1:8546')
ws.on('open', () => {havecon=true})
function getwork(){
    if(havecon){
        ws.send('{"id": 0, "method": "eth_getWork", "params": []}')
    }
    setTimeout(function(){getwork()},120)
}
getwork()
ws.on('message', (data) => {
                        data.toString().split('\n').forEach(jsonDataStr => {
                            if (trim(jsonDataStr).length) {
                                let data2 = JSON.parse(trim(jsonDataStr));
                                if(data2.result&&data2.result.length!=0){
                                    if(data2.result[0]!=result){
                                        result=data2.result[0];
                                        //console.log(data2)
                                        for (var key in suanliarr) {
                                            if (suanliarr[key] && suanliarr[key].o == true) {
                                                data2.result[2]=diff;
                                                try{suanliarr[key].cli.write(Buffer.from(JSON.stringify(data2)+'\n'))}catch(errr){}}
                                            }
                                    }
                                }else{
                                    console.log(data2)
                                }

                            }
                        })
})
var server = net.createServer(function (client) {
        client.on('data', function (data) {
                        data.toString().split('\n').forEach(jsonDataStr => {
                            if (trim(jsonDataStr).length) {
                                let data2 = JSON.parse(trim(jsonDataStr));
                            if (data2.method == 'eth_submitLogin') {//如果矿机发来登录数据，记录并登录
                                client.write(Buffer.from('{"id":' + data2.id + ',"jsonrpc":"2.0","result":true}\n'));
                                data3 = data2.params[0].split('.');
                                if (!data3[1]) {
                                    data3[1] = data2.worker;
                                }
                                suanliarr[data3[0] + '.' + data3[1]] = {};
                                suanliarr[data3[0] + '.' + data3[1]].cli=client;
                                suanliarr[data3[0] + '.' + data3[1]].a = data3[0];
                                suanliarr[data3[0] + '.' + data3[1]].o = true;
                                suanliarr[data3[0] + '.' + data3[1]].n = data3[1];
                                suanliarr[data3[0] + '.' + data3[1]].h = '0M';
                                suanliarr[data3[0] + '.' + data3[1]].t2 = new Date().getTime();
                                suanliarr[data3[0] + '.' + data3[1]].t1 = new Date().getTime();
                            }else if((data3.length != 0) && data2.method == 'eth_submitHashrate'){
                                client.write(Buffer.from('{"id":' + data2.id + ',"jsonrpc":"2.0","result":true}\n'));
                                suanliarr[data3[0] + '.' + data3[1]].h = parseFloat(parseInt(data2.params[0], 16) / 1000000).toFixed(2) + 'M';
                                suanliarr[data3[0] + '.' + data3[1]].t1 = new Date().getTime();
                            }else if((data3.length != 0) && data2.method == 'eth_submitWork'){
                                console.log(JSON.stringify(data2))
                                client.write(Buffer.from('{"id":' + data2.id + ',"jsonrpc":"2.0","result":true}\n'));
                                ws.send(JSON.stringify(data2))
                            }
                            }
                        })
        })
        client.on('error',function(err) {
            suanliarr[data3[0] + '.' + data3[1]].o = false;
            client.end()
            client.destroy()
            //console.log(err)
        });
        client.on('close',function() {suanliarr[data3[0] + '.' + data3[1]].o = false;});
})
server.listen(wakuang, '0.0.0.0', function () {
    server.on('close', function () {});
    server.on('error', function (err) {});
});
app.listen(houtai)
