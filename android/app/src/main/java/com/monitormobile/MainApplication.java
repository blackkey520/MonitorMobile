package com.monitormobile;

import android.app.Application;

import com.facebook.react.ReactApplication;
import cn.jpush.reactnativejpush.JPushPackage;
import com.microsoft.codepush.react.CodePush;
import com.imagepicker.ImagePickerPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import cn.qiuxiang.react.amap3d.AMap3DPackage;
import com.cboy.rn.splashscreen.SplashScreenReactPackage;
import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
  private boolean SHUTDOWN_TOAST = false;
  private boolean SHUTDOWN_LOG = false;
  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new JPushPackage(SHUTDOWN_TOAST, SHUTDOWN_LOG),
              new SplashScreenReactPackage(),  //here
            new CodePush(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey), getApplicationContext(), BuildConfig.DEBUG),
            new ImagePickerPackage(),
            new RCTCameraPackage(),
            new VectorIconsPackage(),
              new AMap3DPackage()

      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

//  @Override
//  public void onCreate() {
//
//    super.onCreate();
//
//  }
}
