package com.mathemagicia.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Разрешаем autoplay аудио без пользовательского жеста —
        // нужно чтобы фоновая музыка меню начинала играть сразу после LoadingScreen.
        this.bridge.getWebView().getSettings().setMediaPlaybackRequiresUserGesture(false);
    }
}
