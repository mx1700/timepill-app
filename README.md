timepill app
------------

bugs
=====
https://github.com/oblador/react-native-vector-icons/issues/626

android 目前加载图片没有进度条，因为官方的 Image 组件没有获取进度的事件

第三方组件 react-native-fast-image 有进度事件
但是 onLoad 事件触发诡异，无法实现加载进度