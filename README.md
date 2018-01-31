timepill app
------------

bugs
=====
https://github.com/oblador/react-native-vector-icons/issues/626

android 目前加载图片没有进度条，因为官方的 Image 组件没有获取进度的事件

第三方组件 react-native-fast-image 有进度事件
但是 onLoad 事件触发诡异，无法实现加载进度

react-native-navigation 最新版在 RN 0.52 下编译不通过，暂时使用一个分支版本
android 版本调试过程会经常会白屏，需要删除 app 重新安装
且执行 adb reverse tcp:8081 tcp:8081 后重启 app 拉取新版本
react-native-navigation 在启动过程中一旦出现问题，app 会白屏无法操作
所以必须保证 app 能正常启动，才能进行调试，一旦白屏，即使重启 app 也无法解决