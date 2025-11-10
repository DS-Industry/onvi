package com.onvimobile

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

import io.branch.rnbranch.*  // Добавить
import android.content.Intent  // Добавить

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String = "OnviMobile"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  // Добавить методы Branch.io
  override fun onStart() {
      super.onStart()
      RNBranchModule.initSession(intent.data, this)
  }

  override fun onNewIntent(intent: Intent?) {
      super.onNewIntent(intent)
      setIntent(intent)
      RNBranchModule.reInitSession(this)
  }
}