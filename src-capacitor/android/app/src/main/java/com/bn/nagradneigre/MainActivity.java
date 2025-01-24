package com.bn.nagradneigre;

import android.content.BroadcastReceiver;
import android.content.IntentFilter;
import android.os.Bundle;
import android.os.Build;
import android.app.PendingIntent;
import android.content.Intent;
import android.content.Context;

import androidx.annotation.Nullable;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    registerPlugin(com.getcapacitor.community.admob.AdMob.class);

//   Intent intent = new Intent(this, MainActivity.class);

// // Creating a pending intent and wrapping our intent
//     PendingIntent pendingIntent = PendingIntent.getActivity(this, 1, intent, PendingIntent.FLAG_IMMUTABLE);
//     try {
//         // Perform the operation associated with our pendingIntent
//         pendingIntent.send();
//     } catch (PendingIntent.CanceledException e) {
//         e.printStackTrace();
//     }

    // if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
    //   PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_IMMUTABLE);
    //   // views.setOnClickPendingIntent(R.id.katkal_widget_lblsveci, pendingIntent);
    // } else {
    //   PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, 0);
    //   // views.setOnClickPendingIntent(R.id.katkal_widget_lblsveci, pendingIntent);
    // }


  }

// dodano zbog zahtjeva za Android API 34
public Intent registerReceiver(@Nullable BroadcastReceiver receiver, IntentFilter filter) {

        if (Build.VERSION.SDK_INT >= 34 && getApplicationInfo().targetSdkVersion >= 34) {
        return super.registerReceiver(receiver, filter, Context.RECEIVER_EXPORTED);
        } else {
        return super.registerReceiver(receiver, filter);
}
      }



}
