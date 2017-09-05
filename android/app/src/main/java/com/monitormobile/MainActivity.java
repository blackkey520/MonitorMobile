package com.monitormobile;

import android.os.Bundle;

import com.cboy.rn.splashscreen.SplashScreen;
import com.facebook.react.ReactActivity;
import com.cboy.rn.splashscreen.SplashScreenReactPackage;
import com.facebook.soloader.SoLoader;
import com.microsoft.codepush.react.CodePush;

public class MainActivity extends ReactActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {

        SplashScreen.show(this);  // 添加这一句
        super.onCreate(savedInstanceState);
        SoLoader.init(this, /* native exopackage */ false);
    }
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "MonitorMobile";
    }
}
