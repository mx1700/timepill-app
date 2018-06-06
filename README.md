timepill app
=====

TODO
-----
1. 在日记详情页修改日记后，回到详情页日记内容没有变更
1. 草稿功能未实现
1. 别人的日记页不应该提示 写一篇日记吧
1. 写日记后，我的日记页自动刷新
1. 日记本页优化
1. 日记本添加编辑页
1. 设置页
1. 回复某人偶尔会丢失回复人的问题
1. iOS 不做更新检查

android 打包 js bundle 方法（iOS编译时会自动打包）
-----
```bash
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/
```


RN 版本问题
-----
目前使用的 0.53 版本，iOS 完美，android 有个 TextInput 的 崩溃问题

0.55 在 iOS 上问题较多，自带输入法无法输入中文，react-native-navigation 兼容问题（隐藏 tab 不稳定，有时候出白条，有时候闪烁）
android 没有仔细测试，不清楚具体问题多少



android 已知问题修复
-----

### android 平台 jpush 和 react-native-navigation 兼容问题解决
#### 问题现象

android App 在后台状态，点击通知 App 会重置

#### 原因

react-native-navigation 的启动逻辑是在 MainActivity 启动时，主 Activity 从 MainActivity 替换成 NavigationActivity
见：https://wix.github.io/react-native-navigation/#/android-specific-use-cases?id=why-overriding-these-methods-in-mainactivity-won39t-work
而 jpush 处理点击时，总是去激活 MainActivity ，这就导致总会产生一个新的 NavigationActivity

#### 处理办法是修改 jpush 处理点击的逻辑

修改 jpush-react-native/android/src/main/java/cn/jpush/reactnativejpush/JPushModule.java 544 行
```java
if (isApplicationRunningBackground(context)) {
    ComponentName componentName = getTopActivity(context);
    intent = new Intent();
    if (componentName != null) {
        intent.setClassName(componentName.getPackageName(), componentName.getClassName());
    } else {
        intent.setClassName(context.getPackageName(), context.getPackageName() + ".MainActivity");
    }
    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
} else {
```

并增加一个函数 getTopActivity
```java
private static ComponentName getTopActivity(Context context){
    ActivityManager activityManager = (ActivityManager) context.getSystemService(Service.ACTIVITY_SERVICE);
    if (activityManager == null) return null;
    List<ActivityManager.RunningTaskInfo> runningTaskInfoList = activityManager.getRunningTasks(Integer.MAX_VALUE);
    for (ActivityManager.RunningTaskInfo taskInfo : runningTaskInfoList) {
        if (taskInfo.topActivity.getPackageName().equals(context.getPackageName())){
            return taskInfo.topActivity;
        }
    }
    return null;
}
```

#### 获取 getTopActivity 的原因
App 后台，或者退出后，通过通知唤起，都会进入 isApplicationRunningBackground 的分支条件
从后台唤起，应该激活 NavigationActivity ，而退出状态下唤起，不能直接启动 NavigationActivity，因为缺少初始化的参数
NavigationActivity 的初始化时通过 MainActivity 运行的
所以需要先获取当前激活的 Activity，如果有，则直接激活，如果没有，则启动 MainActivity

### jpush 引起崩溃的问题

Fatal Exception: java.lang.NullPointerException: Attempt to invoke virtual method 'java.lang.Object android.util.SparseArray.get(int)' on a null object reference
       at cn.jpush.reactnativejpush.JPushModule$MyJPushMessageReceiver.onAliasOperatorResult(JPushModule.java:654)
       at cn.jpush.android.a.a$a.run(SourceFile:76)
       at android.os.Handler.handleCallback(Handler.java:808)
       at android.os.Handler.dispatchMessage(Handler.java:101)
       at android.os.Looper.loop(Looper.java:166)
       at android.os.HandlerThread.run(HandlerThread.java:65)
       
修改 jpush-react-native/android/src/main/java/cn/jpush/reactnativejpush/JPushModule.java 85 行

```java
    if (null != sCacheMap) {
         sCacheMap.clear();
-        sCacheMap = null;                   //删掉这行
    }
```

### android react-native-fetch-blob 问题
如果 android targetSdkVersion >= 24 ，自动更新打开安装包的动作会报错

```javascript
RNFetchBlob.android.actionViewIntent(resp.path(), 'application/vnd.android.package-archive');
```

所以 sdk 暂时使用 23

官方有一个修复的pull，不过还没合并

https://github.com/wkh237/react-native-fetch-blob/pull/614

需要持续关注


iOS 已知问题修复
-----

### react-native-image-crop-picker iOS 安装问题
建议按照官方的 pod 方式安装
注意：安装 pod 后，需要从 xcode 里打开 xcworkspace 文件才能编译通过


### react-native-fabric iOS 安装问题
react-native-fabric react-native link 的时候，会通过 pod 安装，但是 pod 方式安装编译失败，
暂时没有找到解决办法，最好是 link 后恢复自动修改的 pod 文件，通过手动方式安装

### iOS FlatList 手动下拉刷新后，用程序触发刷新，刷新指示器不显示的问题

修改 react 源码 /React/Views/RCTRefreshControl.m 57 行

```objective-c
-    CGPoint offset = {scrollView.contentOffset.x, scrollView.contentOffset.y - self.frame.size.height};
+    CGPoint offset = {scrollView.contentOffset.x, scrollView.contentOffset.y - 60};
```

一直存在的问题，官方一直没有修改

https://github.com/facebook/react-native/issues/17734

### RN 0.55 TextInput 无法输入中文的问题
已确认 RN bug

反馈：https://github.com/facebook/react-native/issues/18403#issuecomment-380051333

pull：https://github.com/facebook/react-native/pull/18456

还未合并，持续关注

可手工修改代码解决

bugs
-----
https://github.com/oblador/react-native-vector-icons/issues/626

android 目前加载图片没有进度条，因为官方的 Image 组件没有获取进度的事件

第三方组件 react-native-fast-image 有进度事件
但是 onLoad 事件触发诡异，无法实现加载进度

react-native-navigation 在 android 上 debug 时没有进度条，如果无法链接更新服务器则会卡在启动屏上


Debug Server 问题
-----
### Debug Server 出现 While resolving module `react-native-vector-icons/Ionicons` 错误

rm ./node_modules/react-native/local-cli/core/fixtures/files/package.json
rm ./node_modules/react-native/local-cli/core/__fixtures__/files/package.json

https://github.com/oblador/react-native-vector-icons/issues/627


