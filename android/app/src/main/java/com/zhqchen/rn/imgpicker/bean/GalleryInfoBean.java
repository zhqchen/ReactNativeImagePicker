package com.zhqchen.rn.imgpicker.bean;

import com.facebook.react.bridge.WritableNativeMap;

/**
 * Created by zhqchen on 2017-11-13.
 */

public class GalleryInfoBean extends WritableNativeMap {

    public long bucketId;//文件夹Id
    public String bucketDisplayName;//文件夹名称
    public String galleryPath; //文件夹的路径
    public String firstImagePath;//里面第一张图的路径
    public int degree;
    public int count = 1;

    public GalleryInfoBean() {
        super();
    }

    public GalleryInfoBean(long bucketId) {
        super();
        this.bucketId = bucketId;
    }

    public void addTotalCount(int num) {
        count = count + num;
    }

    @Override
    public boolean equals(Object obj) {
        return null != obj && (this == obj || (obj instanceof GalleryInfoBean && ((GalleryInfoBean) obj).bucketId == this.bucketId));
    }
}