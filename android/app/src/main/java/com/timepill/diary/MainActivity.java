package com.timepill.diary;

import android.graphics.Color;
import android.os.Bundle;
import android.util.TypedValue;
import android.view.Gravity;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.facebook.react.ReactActivity;
import com.reactnativenavigation.controllers.SplashActivity;

import cn.jpush.android.api.JPushInterface;

public class MainActivity extends SplashActivity {

//    /**
//     * Returns the name of the main component registered from JavaScript.
//     * This is used to schedule rendering of the component.
//     */
//    @Override
//    protected String getMainComponentName() {
//        return "timepill";
//    }

//    protected void onCreate(Bundle savedInstanceState) {
//        super.onCreate(savedInstanceState);
//        overridePendingTransition(R.anim.design_fab_in, R.anim.design_fab_out);
//    }

    @Override
    public LinearLayout createSplashLayout() {
        LinearLayout view = new LinearLayout(this);
        TextView textView = new TextView(this);

        view.setBackgroundColor(Color.parseColor("#FFFFFF"));
        view.setGravity(Gravity.CENTER);

        textView.setTextColor(Color.parseColor("#0071E1"));
        textView.setText("胶囊日记");
        textView.setGravity(Gravity.CENTER);
        textView.setTextSize(TypedValue.COMPLEX_UNIT_DIP, 40);

        view.addView(textView);
        return view;
    }

}
