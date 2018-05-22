package com.testreactnativeapp;

import android.app.Application;

import com.facebook.react.ReactApplication;
import cn.reactnative.modules.update.UpdatePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import cn.reactnative.modules.update.UpdateContext;//热更新添加
import com.AlexanderZaytsev.RNI18n.RNI18nPackage; // <-- Add to ReactNativeI18n to the imports
import com.oblador.vectoricons.VectorIconsPackage;//ioc

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected String getJSBundleFile() {
      return UpdateContext.getBundleUrl(MainApplication.this);
    }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
              new MainReactPackage(),
              new UpdatePackage(),
              new RNI18nPackage(), // <-- Add it to the packages list
              new VectorIconsPackage(),//ioc

              new KChartsPackage() //K线图
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
