
// // Prevents additional console window on Windows in release, DO NOT REMOVE!!
// #![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// fn main() {
//     tauri_pet_lib::run()
// }

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::{
    menu::{AboutMetadata, MenuBuilder, MenuItemBuilder, SubmenuBuilder},
    Manager,
};

// --- 跨平台的原生音效指令 ---

/// 在 macOS 上的实现
#[cfg(target_os = "macos")]
#[tauri::command]
fn play_native_sound(sound_name: String) {
    use cocoa::base::{nil, id};
    use cocoa::foundation::NSString;
    use objc::{msg_send, sel, sel_impl};

    unsafe {
        let sound: id = msg_send![
            objc::class!(NSSound),
            soundNamed: NSString::alloc(nil).init_str(&sound_name)
        ];
        let _: () = msg_send![sound, play];
    }
}

/// 在 Windows 上的实现
#[cfg(target_os = "windows")]
#[tauri::command]
fn play_native_sound(_sound_name: String) {
    // sound_name 参数在Windows上被忽略，因为我们播放的是默认系统声音
    use windows_sys::Win32::UI::WindowsAndMessaging::MessageBeep;
    
    // 播放与 "OK" 按钮关联的默认系统声音
    const MB_OK: u32 = 0x00000000;
    unsafe {
        MessageBeep(MB_OK);
    }
}

/// 在所有其他系统（如Linux）上的备用实现
#[cfg(not(any(target_os = "windows", target_os = "macos")))]
#[tauri::command]
fn play_native_sound(_sound_name: String) {
    // 留空或打印一条消息
    println!("Native sound playback is not implemented for this OS.");
}


fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![play_native_sound])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}