package com.monitormobile;

import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.horcrux.svg.SvgPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.facebook.soloader.SoLoader;
import com.microsoft.codepush.react.CodePush;

import cn.jpush.android.api.JPushInterface;

public class MainActivity extends ReactActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        JPushInterface.init(this);
        SoLoader.init(this, /* native exopackage */ false);
    }
    @Override
    protected void onPause() {
        super.onPause();
        JPushInterface.onPause(this);
    }

    @Override
    protected void onResume() {
        super.onResume();
        JPushInterface.onResume(this);
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
