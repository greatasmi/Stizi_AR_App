package com.stizi_ar_app

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.soloader.SoLoader

// MUST inherit from Application AND implement ReactApplication
class MainApplication : Application(), ReactApplication {

    // This is the required property from ReactApplication
    override val reactNativeHost: ReactNativeHost =
        object : DefaultReactNativeHost(this) {
            override fun getPackages(): List<com.facebook.react.ReactPackage> =
                PackageList(this).packages.apply {
                    // Packages that cannot be autolinked yet can be added manually here.
                }

            override fun getJSMainModuleName(): String = "index"

            // Now correctly implementing the required abstract member
            override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

            // *** THESE TWO LINES ARE REMOVED/COMMENTED OUT TO FIX THE FINAL ERROR ***
            // override val isNewArchitectureEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
            // override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
        }

    // New Architecture entry point (required for recent RN versions)
    override fun onCreate() {
        super.onCreate()
        SoLoader.init(this, /* native exopackage */ false)
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            load()
        }
    }
}