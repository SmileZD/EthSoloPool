# EthSoloPool
一个简单的eth本地独自挖矿(局域网)矿池<br>
使用教程(Windows)：<br>
1、下载并安装geth：<https://gethstore.blob.core.windows.net/builds/geth-windows-amd64-1.10.17-25c9b49f.exe><br>
2、请务必去官网看一下最新版本号，上一步中的版本号为当前日期最新版本1.10.17，官网<https://geth.ethereum.org/downloads/>，可能需要tz，如果不是最新版本请在官网直接下载最新版本<br>
3、下载该项目，右上角Code然后点DownloadZip，然后解压，进入到项目目录，右键编辑"启动钱包.bat"，将"D:\eth"更改为电脑中某个位置，并保证该位置所处盘的剩余空间大于600g，然后修改0x55DAEB4609f2d7D216E6513D21de960ed8CF0fB0为你自己的钱包地址，这个地址就是矿池收益地址，改完保存之后双击"启动钱包.bat"，开始同步eth钱包，速度取决于所处硬盘的读写速度，建议使用m.2接口的Nvme协议固态硬盘，机械盘或速度太慢的普通sata固态将无法完成安装和同步钱包；速度快的大概在一天之内可以完成同步；内存要求大于等于8g，大于多少取决于连接的矿机数量<br>
4、上一步如何检测是否完成同步：打开cmd命令行，输入 geth attach ws://127.0.0.1:8546 回车，然后输入eth.syncing，回车，如果看到显示false且钱包大小大于503g，则同步完成；<br>
5、下载右侧Releases中启动矿池里的StartPool.exe,双击运行启动；需要占用80和8888端口,80为后台端口，在浏览器里输入http://127.0.0.1 可以看到已经连接的矿机，8888为挖矿端口，也就是说挖矿软件里填的矿池地址是 局域网地址:8888，如果不知道这台电脑的局域网地址，就打开cmd命令行输入ipconfig，找到192.168开头的地址，例如是192.168.1.108，则局域网内所有矿机都可以用192.168.1.108:8888的地址挖矿；如果出现问题有可能是防火墙的原因，开放端口或者关闭防火墙自行百度；到这里简易教程结束，如果需要改端口或者二次开发可以看后面的源码使用教程；<br><br><br>
源码使用教程：<br>
5、下载并安装nodejs：<https://nodejs.org/dist/v16.13.1/node-v16.13.1-x64.msi><br>
6、进入到项目文件夹，在文件夹空白处按住shift键同时右键鼠标，打开命令窗口；或者打开cmd命令行cd到项目文件夹下<br>
7、输入npm i 然后按回车，等执行完之后右键编辑app.js,修改前两行中的端口，保存后,在命令行输入node app.js启动矿池服务<br>
8、启动之后会看到很多输出，基本上都是{ jsonrpc: '2.0', id: 40, result: false }，这是正常的，表示这个份额没有能爆块，当前大概130多g算力平均一天爆一块，一块收益大约2点几eth，爆块之后收益直接到之前填的钱包地址里；<br>
9、转发请注明原作者<br>
10、捐赠ETH地址：0x55DAEB4609f2d7D216E6513D21de960ed8CF0fB0<br>
