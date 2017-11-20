package com.zhqchen.rn.imgpicker.pickerpackage;

import android.annotation.TargetApi;
import android.content.Context;
import android.database.Cursor;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;

import com.zhqchen.rn.imgpicker.bean.GalleryInfoBean;
import com.zhqchen.rn.imgpicker.bean.ImageInfoBean;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by CHENZHIQIANG247 on 2017-11-13.
 */
public class ImagePickerModel {

    public static final int CHOOSE_MODE_ONLY_IMAGE = 0;//仅选图片模式, 默认
    public static final int CHOOSE_MODE_IMAGE_AND_VIDEO = 1;//选图片和视频模式//若以后可以同时选择图片和视频，使用此模式即可

    public static final long ALL_PHOTO_BUCKET_ID = -1;//自定义的所有图片的文件夹id
    public static final long ALL_VIDEO_BUCKET_ID = -2;//自定义的视频相册的文件夹id

    private Context context;

    private int currentChooseMode;//选图模式
    private long currentBucketId;//当前所在文件夹的id

    private ArrayList<ImageInfoBean> imageInfos = new ArrayList<>();//存储了所得图库文件夹内的图片信息
    private ArrayList<GalleryInfoBean> photoGalleryFolders = new ArrayList<>();//存放图库中文件夹的路径

    public ImagePickerModel(Context context, int mode) {
        this.context = context;
        this.currentChooseMode = mode;
    }

    /**
     * 获取手机图库中的文件夹
     */
    public ArrayList<GalleryInfoBean> getPhotoGalleryFolders() {
        // which image properties are we querying
        Map<Long, GalleryInfoBean> bucketMap = new HashMap<>();
        String[] projection = new String[]{
                MediaStore.Images.Media.BUCKET_ID,
                MediaStore.Images.Media._ID,
                MediaStore.Images.Media.BUCKET_DISPLAY_NAME,
                MediaStore.Images.Media.DATA,
                MediaStore.Images.Media.ORIENTATION,
                MediaStore.Images.Media.DATE_MODIFIED
        };
        // Get the base URI for the People table in the Contacts content provider.
        Uri images = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
        // Make the query.
        Cursor cur = context.getContentResolver().query(images,
                projection, // Which columns to return
                null,         // Which rows to return (all rows)
                null,       // Selection arguments (none)
                MediaStore.Images.Media.DATE_MODIFIED + " DESC"          // Ordering
        );
        if (cur == null || cur.getCount() == 0) {
            if (cur != null) {
                cur.close();
            }
            return null;
        }
        if (cur.moveToFirst()) {
            String bucket = "";
            String imagePath = "";
            int degree;
            long bucketId;
            int bucketColumn = cur.getColumnIndex(
                    MediaStore.Images.Media.BUCKET_DISPLAY_NAME);
            int imageColumn = cur.getColumnIndex(MediaStore.Images.Media.DATA);
            int bucketIdColumn = cur.getColumnIndex(MediaStore.Images.Media.BUCKET_ID);
            int degreeColumn = cur.getColumnIndex(MediaStore.Images.Media.ORIENTATION);
            do {
                // Get the field values
                bucket = cur.getString(bucketColumn);//图库中的文件夹名称
                imagePath = cur.getString(imageColumn);//里面图片的绝对路径
                bucketId = cur.getLong(bucketIdColumn);
                degree = cur.getInt(degreeColumn);
                if (photoGalleryFolders.contains(new GalleryInfoBean(bucketId))) {
                    bucketMap.get(bucketId).addTotalCount(1);
                } else {
                    GalleryInfoBean ginfo = new GalleryInfoBean(bucketId);
                    ginfo.bucketDisplayName = bucket;
                    ginfo.galleryPath = getParentDirPath(imagePath);
                    ginfo.firstImagePath = imagePath;
                    ginfo.degree = degree;
                    if (bucket.equals("Camera") && ginfo.galleryPath.startsWith(Environment.getExternalStorageDirectory().getPath() + "/DCIM")) {
                        photoGalleryFolders.add(0, ginfo);//Camera文件夹放在首位
                    } else {
                        photoGalleryFolders.add(ginfo);//获得一个文件夹的路径
                    }
                    imageInfos.clear();
                    int videoCount = getBucketVideos(bucketId);
                    ginfo.addTotalCount(videoCount);
                    bucketMap.put(bucketId, ginfo);
                }
            } while (cur.moveToNext());
        }
        cur.close();
        return photoGalleryFolders;
    }

    /**
     * 根据文件夹ID查询图片表(Images)中指定文件夹下的图片或视频, 保存获得的图片信息(id, path)
     *
     * @param bucketId 文件夹ID, 为-1表示查询所有的图片 -2表示查询所有的视频
     * @return
     */
    @TargetApi(Build.VERSION_CODES.JELLY_BEAN)
    public ArrayList<ImageInfoBean> getBucketMedias(long bucketId) {
        if (bucketId == currentBucketId) {
            return null;
        }
        currentBucketId = bucketId;
        imageInfos.clear();
        String whereClause;
        if (bucketId == ALL_VIDEO_BUCKET_ID) {
            getBucketVideos(bucketId);
            return null;
        }
        if (bucketId == ALL_PHOTO_BUCKET_ID) {
            whereClause = null;
        } else {
            whereClause = MediaStore.Images.Media.BUCKET_ID + " = '" + bucketId + "'";
        }
        String[] projection;
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {
            projection = new String[] {
                    MediaStore.Images.Media._ID, //图片id
                    MediaStore.Images.Media.DATA, //图片原始路径
                    MediaStore.Images.Media.DATE_TAKEN, //图片拍摄时间
                    MediaStore.Images.Media.ORIENTATION, //图片角度
                    MediaStore.Images.Media.MIME_TYPE, //图片类型
                    MediaStore.Images.Media.DISPLAY_NAME, //图片展示名称**.jpg
                    MediaStore.Images.Media.SIZE, //图片的大小
                    MediaStore.Images.Media.WIDTH, //图片的宽度
                    MediaStore.Images.Media.HEIGHT //图片的高度
            };
        } else {
            projection = new String[] {
                    MediaStore.Images.Media._ID, //图片id
                    MediaStore.Images.Media.DATA, //图片原始路径
                    MediaStore.Images.Media.DATE_TAKEN, //图片拍摄时间
                    MediaStore.Images.Media.ORIENTATION, //图片角度
                    MediaStore.Images.Media.MIME_TYPE, //图片类型
                    MediaStore.Images.Media.DISPLAY_NAME, //图片展示名称**.jpg
                    MediaStore.Images.Media.SIZE, //图片的大小
            };
        }
        Cursor cursor = context.getContentResolver().query(
                MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
                projection, whereClause, null, " " + MediaStore.Images.Media.DATE_TAKEN + " DESC");
        if (cursor == null || cursor.getCount() == 0) {
            if (cursor != null) {
                cursor.close();
            }
            return null;
        }
//        java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat(
//                "yyyy/MM");
        File picFile = null;
        BitmapFactory.Options options = new BitmapFactory.Options();
        options.inJustDecodeBounds = true;
        if (cursor.moveToFirst()) {
            do {
                long imageId = cursor.getLong(cursor
                        .getColumnIndex(MediaStore.Images.Media._ID));
                String imagePath = cursor.getString(cursor
                        .getColumnIndex(MediaStore.Images.Media.DATA));
                int degree = cursor.getInt(cursor
                        .getColumnIndex(MediaStore.Images.Media.ORIENTATION));
                long dateModify = cursor.getLong(cursor
                        .getColumnIndex(MediaStore.Images.Media.DATE_TAKEN));
                String mimeType = cursor.getString(cursor
                        .getColumnIndex(MediaStore.Images.Media.MIME_TYPE));
                String name = cursor.getString(cursor
                        .getColumnIndex(MediaStore.Images.Media.DISPLAY_NAME));
                long imageSize = cursor.getLong(cursor.getColumnIndex(MediaStore.Images.Media.SIZE));
                int width, height;
                if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {
                    width = cursor.getInt(cursor.getColumnIndex(MediaStore.Images.Media.WIDTH));
                    height = cursor.getInt(cursor.getColumnIndex(MediaStore.Images.Media.HEIGHT));
                } else {
                    BitmapFactory.decodeFile(imagePath, options);
                    width = options.outWidth;
                    height = options.outHeight;
                }

//                java.util.Calendar cal = java.util.Calendar.getInstance();
//                cal.setTimeInMillis(dateModify * 1000);
//                String takenDate = formatter.format(cal.getTime());//如2014/11
                picFile = new File(imagePath);
                if(!picFile.exists()) {//这张图片本地已经不存在了，但是还能查到
                    continue;
                }

                ImageInfoBean imageInfo = new ImageInfoBean();
                imageInfo.setModifyDate(dateModify);
//                if (mimeType != null && mimeType.toLowerCase().endsWith("gif")) {
//                    imageInfo.setImageType(StatusAttachment.AttachmentType.GIF);
//                } else {
//                    imageInfo.setImageType(StatusAttachment.AttachmentType.IMAGE);
//                }
                imageInfo.setType(ImageInfoBean.AttachmentType.IMAGE);//目前先不区分IMAGE和GIF
//                imageInfo.setMediaSize(StringUtils.getStringBySize(imageSize));
                imageInfo.imageId = imageId;
                imageInfo.mMediaUrl = imagePath;
                imageInfo.rotateDegree = degree;
                imageInfo.mSize = imageSize;
                imageInfo.mContentType = mimeType;
                imageInfo.width = width;
                imageInfo.height = height;
                imageInfos.add(imageInfo);
            } while (cursor.moveToNext());
        }
        cursor.close();
        getBucketVideos(bucketId);
        integrateImagesAndVideos();
        return imageInfos;
    }

    /**
     * 对混合的图片和视频按拍摄时间排序
     */
    private void integrateImagesAndVideos() {
        Collections.sort(imageInfos);
    }

    /**
     * 获取指定文件夹里的视频
     *
     * @param bucketId
     * @return 对应文件夹中的视频数量
     */
    private int getBucketVideos(long bucketId) {//Model层
        if(currentChooseMode == CHOOSE_MODE_ONLY_IMAGE) {//仅图片模式直接返回
            return 0;
        }
        Map<Long, ImageInfoBean> currentBucketVideos = new HashMap<>();
//        List<ChooseImageInfoEntity> currentBucketVideos = new ArrayList<>();
        String whereClause = null;
        if (ALL_PHOTO_BUCKET_ID == bucketId) {//所有图片
            whereClause = null;
        } else if (ALL_VIDEO_BUCKET_ID == bucketId) {//视频相册,仅显示全部的视频
            imageInfos.clear();
            whereClause = null;
        } else {//其他文件夹中的视频
            whereClause = " " + MediaStore.Video.Media.BUCKET_ID + " = '" + bucketId + "'";
        }

        Cursor cursor = context.getContentResolver().query(
                MediaStore.Video.Media.EXTERNAL_CONTENT_URI,
                new String[]{
                        MediaStore.Video.Media._ID, //视频id
                        MediaStore.Video.Media.DATA, //视频原始路径
                        MediaStore.Video.Media.DATE_TAKEN, //视频拍摄时间
                        MediaStore.Video.Media.MIME_TYPE, //视频类型
                        MediaStore.Video.Media.DISPLAY_NAME, //视频展示名称 **.mp4
                        MediaStore.Video.Media.SIZE //视频大小
                }, whereClause, null, " " + MediaStore.Video.Media.DATE_TAKEN + " DESC");
        if (cursor == null || cursor.getCount() == 0) {
            if (cursor != null) {
                cursor.close();
            }
            return 0;
        }
//        java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat(
//                "yyyy/MM");
        if (cursor.moveToFirst()) {
            do {
                long imageId = cursor.getLong(cursor
                        .getColumnIndex(MediaStore.Video.Media._ID));
                String imagePath = cursor.getString(cursor
                        .getColumnIndex(MediaStore.Video.Media.DATA));
                long dateModify = cursor.getLong(cursor
                        .getColumnIndex(MediaStore.Video.Media.DATE_TAKEN));
                String name = cursor.getString(cursor
                        .getColumnIndex(MediaStore.Video.Media.DISPLAY_NAME));
                String mimeType = cursor.getString(cursor
                        .getColumnIndex(MediaStore.Images.Media.MIME_TYPE));
                long videoSize = cursor.getLong(cursor.getColumnIndex(MediaStore.Images.Media.SIZE));
//                java.util.Calendar cal = java.util.Calendar.getInstance();
//                cal.setTimeInMillis(dateModify * 1000);
//                String takenDate = formatter.format(cal.getTime());//如2014//11

                ImageInfoBean imageInfo = new ImageInfoBean();
                imageInfo.setModifyDate(dateModify);
                imageInfo.setType(ImageInfoBean.AttachmentType.VIDEO);
//                imageInfo.setMediaSize(StringUtils.getStringBySize(videoSize));
                imageInfo.imageId = imageId;
                imageInfo.mMediaUrl = imagePath;
                imageInfo.mContentType = mimeType;
                imageInfo.mSize = videoSize;
                currentBucketVideos.put(imageId, imageInfo);
            } while (cursor.moveToNext());
        }
        cursor.close();
        if(currentBucketVideos.size() > 0) {
            imageInfos.addAll(currentBucketVideos.values());
        }
        return currentBucketVideos.size();
    }

    /**
     * 获取本地一个文件的父路径
     * @param filePath 文件路径
     * @return
     */
    private String getParentDirPath(String filePath) {
        if(filePath == null) {
            return "";
        }
        String dirPath = "";
        int pos = filePath.lastIndexOf("/");
        if (pos > 0) {
            dirPath = filePath.substring(0, pos);
        }
        return dirPath;
    }

}
