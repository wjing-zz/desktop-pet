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

use tauri::menu::{Menu, MenuItem, PredefinedMenuItem, Submenu};
use tauri::{AppHandle, Manager, Runtime, WebviewWindowBuilder};

// --- 跨平台的原生音效指令 ---

/// 在 macOS 上的实现
#[cfg(target_os = "macos")]
#[tauri::command]
fn play_native_sound(sound_name: String) {
    use cocoa::base::{id, nil};
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
        .plugin(tauri_plugin_store::Builder::new().build())
         .setup(|app| {
            let handle = app.handle();
            
            let menu = Menu::with_items(
                handle,
                &[
                    &PredefinedMenuItem::about(handle, Some("About Tauri Pet"), None)?,
                    &Submenu::with_items(
                        handle,
                        "File",
                        true,
                        &[&MenuItem::with_id(handle, "quit", "Quit", true, None::<&str>)?],
                    )?,
                    &Submenu::with_items(
                        handle,
                        "Settings",
                        true,
                        &[&MenuItem::with_id(handle, "settings", "Change Reminder Time...", true, None::<&str>)?],
                    )?,
                ],
            )?;

            app.set_menu(menu)?;
            Ok(())
        })
        .on_menu_event(|app, event| {
            match event.id().as_ref() {
                "quit" => {
                    app.exit(0);
                }
                "settings" => {
                    if let Some(settings_window) = app.get_webview_window("settings") {
                        settings_window.set_focus().unwrap();
                    } else {
                        // --- THIS IS THE CORRECTED PART ---
                        WebviewWindowBuilder::new(
                            app,
                            "settings",
                            // Use the WebviewUrl::App variant for internal pages.
                            // The .into() converts the string into the required path type.
                            tauri::WebviewUrl::App("index.html#/settings".into()),
                        )
                        .title("Reminder Settings")
                        .devtools(true)
                        // .inner_size(300.0, 200.0)
                        // .resizable(false)
                        .always_on_top(true)
                        .build()
                        .unwrap();
                    }
                }
                _ => {}
            }
        })
        .invoke_handler(tauri::generate_handler![play_native_sound])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
