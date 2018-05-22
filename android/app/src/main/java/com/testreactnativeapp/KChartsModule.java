package com.testreactnativeapp;

import android.content.Intent;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * Created by 11974 on 2018/1/5.
 */

public class KChartsModule extends ReactContextBaseJavaModule {

    public static String linkData;
    public static ReactContext mReactContext;
    public static String RiseAndFall;
    public static String priceNewT;
    public static String priceLowT;
    public static String totalAmount;
    public static String priceHigh;
    public static Double currentExchangPrice;
    public static Double lastExchangPrice;
    public static Callback callback;

    public KChartsModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.mReactContext = reactContext;
    }
    @Override
    public String getName() {
        return "KCharts";
    }

    @ReactMethod
    public void kchart(String textTitle,Callback callback) {
        this.callback = callback;
        Intent intent = new Intent(this.getReactApplicationContext(),KChartsView.class);
        intent.putExtra("textTitle",textTitle);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        this.getReactApplicationContext().startActivity(intent);
    }

    @ReactMethod
    public void setkchart(String data, Double RiseAndFall, Double currentExchangPrice, Double lastExchangPrice,
                          Double priceNewT, Double priceLowT,  Double priceHigh, Double totalAmount) {
        java.text.DecimalFormat df =new   java.text.DecimalFormat("#.########");
        this.RiseAndFall = df.format(RiseAndFall);
        this.currentExchangPrice = currentExchangPrice;
        this.lastExchangPrice = lastExchangPrice;
        this.priceNewT = df.format(priceNewT);
        this.priceLowT = df.format(priceLowT);
        this.totalAmount = df.format(totalAmount);
        this.priceHigh = df.format(priceHigh);
        linkData = data;
        //new KChartsView().loadKLineData(data);
    }
}
