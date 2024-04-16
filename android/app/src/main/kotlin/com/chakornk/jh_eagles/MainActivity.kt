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

class MainActivity : FlutterActivity() {

  private var flutterUIReady : Boolean = false

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    // This activity will be handling the splash screen transition.
    val splashScreen = installSplashScreen()

    // The splash screen goes edge to edge, so for a smooth transition to our app, also
    // want to draw edge to edge.
    WindowCompat.setDecorFitsSystemWindows(window, false)

    // The content view needs to be set before calling setOnExitAnimationListener
    // to ensure that the SplashScreenView is attached to the right view root.
    val rootLayout: FrameLayout = findViewById(android.R.id.content)
    View.inflate(this, R.layout.main_activity, rootLayout)

    ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.container)) { view, windowInsets ->
      val insets = windowInsets.getInsets(WindowInsetsCompat.Type.systemBars())
      view.setPadding(insets.left, insets.top, insets.right, insets.bottom)
      windowInsets.inset(insets)
    }

    // Setting an OnExitAnimationListener on the splash screen indicates
    // to the system that the application will handle the exit animation.
    // The listener will be called once the app is ready.
//    splashScreen.setOnExitAnimationListener { splashScreenViewProvider ->
//
//    }
  }

  override fun onFlutterUiDisplayed(){
    flutterUIReady = true

//    if (initialAnimationFinished) {
      hideSplashScreenAnimation()
//    }
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