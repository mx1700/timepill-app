package com.timepill.diary;

import android.app.Activity;
import android.app.Application;
import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.ReactApplication;
import com.smixx.fabric.FabricPackage;

import cn.jpush.android.api.JPushInterface;
import cn.jpush.reactnativejpush.JPushPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.reactnativenavigation.controllers.ActivityCallbacks;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.reactnativenavigation.NavigationApplication;
import com.timepill.diary.BuildConfig;
import com.crashlytics.android.Crashlytics;
import io.fabric.sdk.android.Fabric;
import com.crashlytics.android.answers.Answers;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication {

  @Override
  public boolean isDebug() {
    // Make sure you are using BuildConfig from your own application
    return BuildConfig.DEBUG;
  }

  protected List<ReactPackage> getPackages() {
    // Add additional packages you require here
    // No need to add RnnPackage and MainReactPackage
    return Arrays.<ReactPackage>
            asList(
            new MainReactPackage(),
            new FabricPackage(),
            new JPushPackage(!BuildConfig.DEBUG, !BuildConfig.DEBUG),
            new RNDeviceInfo(),
            new ImageResizerPackage(),
            new PickerPackage(),
            new RNFetchBlobPackage(),
            new RNGestureHandlerPackage(),
            new VectorIconsPackage()
    );
  }

  @Override
  public List<ReactPackage> createAdditionalReactPackages() {
    return getPackages();
  }

  @Override
  public String getJSMainModuleName() {
    return "index";
  }

  @Override
  public void onCreate() {
    super.onCreate();
    setActivityCallbacks(new ActivityCallbacks() {
      @Override
      public void onActivityCreated(Activity activity, Bundle savedInstanceState) {
        Fabric.with(activity, new Crashlytics(), new Answers());
        JPushInterface.init(activity);
      }

      @Override
      public void onActivityStarted(Activity activity) {

      }

      @Override
      public void onActivityResumed(Activity activity) {
        JPushInterface.onResume(activity);
      }

      @Override
      public void onActivityPaused(Activity activity) {
        JPushInterface.onPause(activity);
      }

      @Override
      public void onActivityStopped(Activity activity) {

      }

      @Override
      public void onActivityResult(int requestCode, int resultCode, Intent data) {

      }

      @Override
      public void onActivityDestroyed(Activity activity) {

      }
    });
  }

}


//public class MainApplication extends Application implements ReactApplication {
//
//  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
//    @Override
//    public boolean getUseDeveloperSupport() {
//      return BuildConfig.DEBUG;
//    }
//
//    @Override
//    protected List<ReactPackage> getPackages() {
//      return Arrays.<ReactPackage>asList(
//          new MainReactPackage(),
//            new VectorIconsPackage()
//      );
//    }
//
//    @Override
//    protected String getJSMainModuleName() {
//      return "index";
//    }
//  };
//
//  @Override
//  public ReactNativeHost getReactNativeHost() {
//    return mReactNativeHost;
//  }
//
//  @Override
//  public void onCreate() {
//    super.onCreate();
//    SoLoader.init(this, /* native exopackage */ false);
//  }
//}


