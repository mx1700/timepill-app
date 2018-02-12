timepill app
=====

TODO
-----
1. 在日记详情页修改日记后，回到详情页日记内容没有变更
1. 草稿功能未实现
1. 别人的日记页不应该提示 写一篇日记吧

bugs
-----
https://github.com/oblador/react-native-vector-icons/issues/626

android 目前加载图片没有进度条，因为官方的 Image 组件没有获取进度的事件

第三方组件 react-native-fast-image 有进度事件
但是 onLoad 事件触发诡异，无法实现加载进度

react-native-navigation 最新版在 RN 0.52 下编译不通过，暂时使用一个分支版本
android 版本调试过程会经常会白屏，需要删除 app 重新安装
且执行 adb reverse tcp:8081 tcp:8081 后重启 app 拉取新版本
react-native-navigation 在启动过程中一旦出现问题，app 会白屏无法操作
所以必须保证 app 能正常启动，才能进行调试，一旦白屏，即使重启 app 也无法解决

react-native-image-crop-picker iOS 安装问题
-----
建议按照官方的 pod 方式安装
注意：安装 pod 后，需要从 xcode 里打开 xcworkspace 文件才能编译通过

android 平台 jpush 和 react-native-navigation 兼容问题解决
-----
### 问题现象

android App 在后台状态，点击通知 App 会重置

### 原因

react-native-navigation 的启动逻辑是在 MainActivity 启动时，主 Activity 从 MainActivity 替换成 NavigationActivity
见：https://wix.github.io/react-native-navigation/#/android-specific-use-cases?id=why-overriding-these-methods-in-mainactivity-won39t-work
而 jpush 处理点击时，总是去激活 MainActivity ，这就导致总会产生一个新的 NavigationActivity

### 处理办法是修改 jpush 处理点击的逻辑

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

### 获取 getTopActivity 的原因
App 后台，或者退出后，通过通知唤起，都会进入 isApplicationRunningBackground 的分支条件
从后台唤起，应该激活 NavigationActivity ，而退出状态下唤起，不能直接启动 NavigationActivity，因为缺少初始化的参数
NavigationActivity 的初始化时通过 MainActivity 运行的
所以需要先获取当前激活的 Activity，如果有，则直接激活，如果没有，则启动 MainActivity

