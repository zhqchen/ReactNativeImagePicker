package com.zhqchen.rn.imgpicker.bean;

import java.io.Serializable;

public class ImageBaseInfoBean implements Serializable {
    public long imageId;//图片在多媒体数据库中的id
    public String mMediaUrl;//原始路径
    public String mMediaThumbUrl;//图片处理后路径或视频缩略图路径
    public String mediaSize;//大小, *MB *KB
    public long mSize;//大小
    public String mediaTime;//时间, 仅视频才有 0:00:00
    public int rotateDegree;//图片的旋转角度
    public String mContentType = "";// image/... 或者video/...
    public int width;
    public int height;

    public String getMediaThumbUrl() {
        if (mMediaThumbUrl == null) {
            return mMediaUrl;
        }
        return mMediaThumbUrl;
    }
}
