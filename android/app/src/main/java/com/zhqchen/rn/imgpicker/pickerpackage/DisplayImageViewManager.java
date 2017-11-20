package com.zhqchen.rn.imgpicker.pickerpackage;

import com.facebook.drawee.view.SimpleDraweeView;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

/**
 *
 * 加载图片的ImageView
 * Created by CHENZHIQIANG247 on 2017-11-17.
 */
public class DisplayImageViewManager extends SimpleViewManager<SimpleDraweeView> {
    @Override
    public String getName() {
        return "DisplayImageView";
    }

    @Override
    protected SimpleDraweeView createViewInstance(ThemedReactContext reactContext) {
        SimpleDraweeView imageView = new SimpleDraweeView(reactContext);
        return imageView;
    }

}
