package com.zhqchen.rn.imgpicker.bean;

import android.support.annotation.NonNull;

import java.io.Serializable;

/**
 * Created by CHENZHIQIANG247 on 2017-11-13.
 */
public class ImageInfoBean extends ImageBaseInfoBean implements Serializable, Comparable<ImageInfoBean> {

    public enum AttachmentType {
        IMAGE, GIF, VIDEO, UNKNOWN
    }

    private AttachmentType mType = AttachmentType.UNKNOWN;    //文件类型

    private String choosePosition = "";//选图的顺序标识(1~9)，只在图片选择组件中有用

    private long modifyDate;//最后修改时间

    public ImageInfoBean() {
    }

    public ImageInfoBean(String originalUrl) {
        this.mMediaUrl = originalUrl;
        this.mType = AttachmentType.IMAGE;
    }

    public long getModifyDate() {
        return modifyDate;
    }

    public void setModifyDate(long modifyDate) {
        this.modifyDate = modifyDate;
    }

    public String getChoosePosition() {
        return choosePosition;
    }

    public void setChoosePosition(String choosePosition) {
        this.choosePosition = choosePosition;
    }

    public AttachmentType getType() {
        return mType;
    }

    public void setType(AttachmentType mType) {
        this.mType = mType;
    }

    @Override
    public boolean equals(Object obj) {
        if (null == obj) {
            return false;
        }
        if (this == obj) {
            return true;
        }
        return obj instanceof ImageInfoBean && ((ImageInfoBean) obj).mMediaUrl != null && ((ImageInfoBean) obj).mMediaUrl.equals(mMediaUrl);
    }

    @Override
    public int compareTo(@NonNull ImageInfoBean another) {//按modifyDate降序排序
        if (this.modifyDate > another.getModifyDate()) {
            return -1;
        } else if (this.modifyDate < another.getModifyDate()) {
            return 1;
        }
        return 0;
    }
}
