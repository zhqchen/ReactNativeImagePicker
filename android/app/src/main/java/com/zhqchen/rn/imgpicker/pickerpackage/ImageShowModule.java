package com.zhqchen.rn.imgpicker.pickerpackage;

import android.app.Activity;
import android.content.Intent;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.common.ModuleDataCleaner;
import com.zhqchen.rn.imgpicker.bean.GalleryInfoBean;
import com.zhqchen.rn.imgpicker.bean.ImageInfoBean;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * 图片获取的Module
 * Created by CHENZHIQIANG247 on 2017-11-03.
 */
public class ImageShowModule extends ReactContextBaseJavaModule implements ModuleDataCleaner.Cleanable, ActivityEventListener {

    private ImagePickerModel model;

    public ImageShowModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "ImageShowModule";
    }

    @Override
    public Map<String, Object> getConstants() {//设置JS可以使用的常量
        Map<String, Object> Constants = new HashMap<>();
        Constants.put("CHOOSE_MODE_ONLY_IMAGE", ImagePickerModel.CHOOSE_MODE_ONLY_IMAGE);
        Constants.put("CHOOSE_MODE_IMAGE_AND_VIDEO", ImagePickerModel.CHOOSE_MODE_IMAGE_AND_VIDEO);
        Constants.put("ALL_PHOTO_BUCKET_ID", ImagePickerModel.ALL_PHOTO_BUCKET_ID);
        Constants.put("ALL_VIDEO_BUCKET_ID", ImagePickerModel.ALL_VIDEO_BUCKET_ID);
        return Constants;
    }

    @Override
    public boolean canOverrideExistingModule() {
        return true;
    }

    @ReactMethod
    public void init() {
        initWithMode(ImagePickerModel.CHOOSE_MODE_ONLY_IMAGE);
    }

    /**
     * 初始化module，主要是为了设置选图模式,不调用的话，默认仅选择图片
     * @param mode 见ImagePickerModel
     */
    @ReactMethod
    public void initWithMode(int mode) {
        if(model == null) {
            model = new ImagePickerModel(getReactApplicationContext(), mode);
        }
    }

    @ReactMethod
    public void getMyPhotoGallery(Callback callback) {
        ArrayList<GalleryInfoBean> folders = model.getPhotoGalleryFolders();
        if(folders == null || folders.isEmpty()) {
            callback.invoke((Object) null);
            return;
        }
        WritableNativeArray array = new WritableNativeArray();
        for(GalleryInfoBean infoBean : folders) {
            WritableNativeMap map = new WritableNativeMap();
            map.putString("bucketId", String.valueOf(infoBean.bucketId));
            map.putString("bucketDisplayName",infoBean.bucketDisplayName);
            map.putString("galleryPath",infoBean.galleryPath);
            map.putString("firstImagePath",infoBean.firstImagePath);
            map.putInt("degree", infoBean.degree);
            map.putInt("count", infoBean.count);
            array.pushMap(map);
        }
        callback.invoke(array);
    }

    @ReactMethod
    public void getBucketMedias(String bucketId, Callback callback) {
        ArrayList<ImageInfoBean> infoBeans = model.getBucketMedias(Long.parseLong(bucketId));
        WritableNativeArray array = new WritableNativeArray();
        for(ImageInfoBean infoBean : infoBeans) {
            WritableNativeMap map = new WritableNativeMap();
            map.putString("imageId", String.valueOf(infoBean.imageId));
            map.putString("mMediaUrl",infoBean.mMediaUrl);
            map.putString("mMediaThumbUrl",infoBean.mMediaThumbUrl);
            map.putString("mediaSize",infoBean.mediaSize);
            map.putString("mSize", String.valueOf(infoBean.mSize));
            map.putString("mediaTime", infoBean.mediaTime);
            map.putInt("rotateDegree", infoBean.rotateDegree);
            map.putString("mContentType", infoBean.mContentType);
            map.putInt("width", infoBean.width);
            map.putInt("height", infoBean.height);
            map.putInt("mType", infoBean.getType().ordinal());
            array.pushMap(map);
        }
        callback.invoke(array);
    }

    @ReactMethod
    public void recycle() {
        model = null;
    }

    @Override
    public void clearSensitiveData() {
        model = null;
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {

    }

    @Override
    public void onNewIntent(Intent intent) {

    }
}
