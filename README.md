# cookie

#### 介绍
HTHL5 移动端

#### 软件架构
软件架构说明


#### 安装教程

1.  xxxx
2.  xxxx
3.  xxxx

#### 使用说明

1.  xxxx
2.  xxxx
3.  xxxx

#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request

### 进度条说明
1、进度条的核心思路就是百分比换算，即:
   进度条的长度 = 视频当前时间 / 视频总长度
2、进度条控制：监听进度条的touchmove和touchend事件
  1.拿到当前手指所处于进度条总长度的百分百比。
  2.将视频的总时间乘以这个百分比，换算得到当前时间。
  3.通过: 进度条的长度 = 视频当前时间 / 视频总长度，重新计算进度条长度
  4.视频播放动态获取： 通过监听video的timeupdate事件（250毫米自动执行）去动态获取当前时间（currentTime），然后动态计算百分比，给进度条长度赋值即可。

### 路由说明
1、见配置文件pages.json   uniapp没有父子路由的区分

### PCplay说明
1、PCplay首先是需要把所有的touch事件，换成mouse事件。
2、PCplay和play的坐标问题
  # 1.首先在play页面中，由于是基于移动端的，所有的坐标都是基于750rpx的宽度来进行获取的。所以说，在所有的top坐标和left坐标的基础上，都要加上videoBox的
  # left值和top值，这里通过dom.getBoundingClientRect()就能拿到dom元素的绝对信息(通过dom.style.left获得的都是相对的)，这里需要注意一点，在横屏模式下，
  # video是没有进行旋转的，因为pc端不能让它旋转。所以说top和left值，在横屏状态下，要反过来进行转换。（left为top， top为left）

