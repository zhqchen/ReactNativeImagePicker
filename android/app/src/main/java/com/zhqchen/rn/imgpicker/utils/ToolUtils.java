package com.zhqchen.rn.imgpicker.utils;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Log;

import java.io.File;
import java.io.IOException;

/**
 * Created by zhqchen on 2018-01-05.
 */

public class ToolUtils {

    private static final String TAG = "ToolUtils";

    /**
     * 启动拍照
     * @param activity
     * @param destFile
     * @param requestCode
     */
    public static void takePhoto(Activity activity, File destFile, int requestCode) {
        Intent openCameraIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        openCameraIntent.putExtra(MediaStore.EXTRA_OUTPUT, Uri.fromFile(destFile));
        activity.startActivityForResult(openCameraIntent, requestCode);
    }

    /**
     * 检查SD卡是否存在,或空间空间是否可用
     *
     * @return
     */
    public static boolean isSDCardValid() {
        if (Environment.getExternalStorageState().equals(Environment.MEDIA_MOUNTED)) {
            //判断sd卡的可用空间
            File file = Environment.getExternalStorageDirectory();
            long freeSpace = file.getFreeSpace(); //bytes
            return (freeSpace / 1024f / 1024f) > 50f; // 小于50M
        } else {
            return false;
        }
    }

    /**
    	 * Returns application cache directory. Cache directory will be created on SD card
    	 * <i>("/Android/data/[app_package_name]/cache")</i> if card is mounted and app has appropriate permission. Else -
    	 * Android defines cache directory on device's file system.
    	 *
    	 * @param context Application context
    	 * @return Cache {@link File directory}.<br />
    	 * <b>NOTE:</b> Can be null in some unpredictable cases (if SD card is unmounted and
    	 * {@link android.content.Context#getCacheDir() Context.getCacheDir()} returns null).
    	 */
    	public static File getCacheDirectory(Context context) {
    		return getCacheDirectory(context, true);
    	}

    	/**
    	 * Returns application cache directory. Cache directory will be created on SD card
    	 * <i>("/Android/data/[app_package_name]/cache")</i> (if card is mounted and app has appropriate permission) or
    	 * on device's file system depending incoming parameters.
    	 *
    	 * @param context        Application context
    	 * @param preferExternal Whether prefer external location for cache
    	 * @return Cache {@link File directory}.<br />
    	 * <b>NOTE:</b> Can be null in some unpredictable cases (if SD card is unmounted and
    	 * {@link android.content.Context#getCacheDir() Context.getCacheDir()} returns null).
    	 */
    	public static File getCacheDirectory(Context context, boolean preferExternal) {
    		File appCacheDir = null;
    		String externalStorageState;
    		try {
    			externalStorageState = Environment.getExternalStorageState();
    		} catch (NullPointerException e) { // (sh)it happens (Issue #660)
    			externalStorageState = "";
    		} catch (IncompatibleClassChangeError e) { // (sh)it happens too (Issue #989)
    			externalStorageState = "";
    		}
    		if (preferExternal && Environment.MEDIA_MOUNTED.equals(externalStorageState) && hasExternalStoragePermission(context)) {
    			appCacheDir = getExternalCacheDir(context);
    		}
    		if (appCacheDir == null) {
    			appCacheDir = context.getCacheDir();
    		}
    		if (appCacheDir == null) {
    			String cacheDirPath = "/data/data/" + context.getPackageName() + "/cache/";
    			Log.i(TAG, "Can't define system cache directory!" + cacheDirPath + "will be used.");
    			appCacheDir = new File(cacheDirPath);
    		}
    		return appCacheDir;
    	}

    private static File getExternalCacheDir(Context context) {
    		File dataDir = new File(new File(Environment.getExternalStorageDirectory(), "Android"), "data");
    		File appCacheDir = new File(new File(dataDir, context.getPackageName()), "cache");
    		if (!appCacheDir.exists()) {
    			if (!appCacheDir.mkdirs()) {
    				return null;
    			}
    			try {
    				new File(appCacheDir, ".nomedia").createNewFile();
    			} catch (IOException e) {
    			}
    		}
    		return appCacheDir;
    	}

    	private static boolean hasExternalStoragePermission(Context context) {
    		int perm = context.checkCallingOrSelfPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE);
    		return perm == PackageManager.PERMISSION_GRANTED;
    	}
}
