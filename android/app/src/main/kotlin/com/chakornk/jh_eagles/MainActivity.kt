package com.chakornk.jh_eagles

import android.os.Bundle
import android.view.View
import android.widget.FrameLayout
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import io.flutter.embedding.android.FlutterActivity
import kotlinx.coroutines.delay
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withTimeout

class MainActivity : FlutterActivity() {

  private var flutterUIReady : Boolean = false
  private var animationDone: Boolean = false

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    // attach splashscreen
    val rootLayout: FrameLayout = findViewById(android.R.id.content)
    View.inflate(this, R.layout.main_activity, rootLayout)

    runBlocking {
      delay(600)
      if (flutterUIReady) {
        hideSplashScreenAnimation()
      } else {
        animationDone = true
      }
    }
  }

  override fun onFlutterUiDisplayed(){
    flutterUIReady = true
    if (animationDone) {
      hideSplashScreenAnimation()
    }
  }

  override fun onFlutterUiNoLongerDisplayed(){
    flutterUIReady = false
  }

  /**
   * Hides the splash screen only when the entire animation has finished and the Flutter UI is ready to display.
   */
  private fun hideSplashScreenAnimation(){
    val splashView: ConstraintLayout = findViewById(R.id.container)
    splashView
      .animate()
      .alpha(0.0f)
      .setDuration(SPLASH_SCREEN_TRANSITION_DURATION)
  }

  private companion object {
    const val SPLASH_SCREEN_TRANSITION_DURATION = 200.toLong()
  }
}