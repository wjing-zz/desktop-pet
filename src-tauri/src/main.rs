// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::menu::{Menu, MenuItem, PredefinedMenuItem, Submenu};
// CORRECTED: Import both Manager (for .get_webview_window) and Emitter (for .emit)
use tauri::{Emitter, Manager, WebviewWindowBuilder}; 

// --- 跨平台的原生音效指令 (no changes here) ---

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

#[cfg(target_os = "windows")]
#[tauri::command]
fn play_native_sound(_sound_name: String) {
    use windows_sys::Win32::UI::WindowsAndMessaging::MessageBeep;
    const MB_OK: u32 = 0x00000000;
    unsafe {
        MessageBeep(MB_OK);
    }
}

#[cfg(not(any(target_os = "windows", target_os = "macos")))]
#[tauri::command]
fn play_native_sound(_sound_name: String) {
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
                        "Actions",
                        true,
                        &[
                            &MenuItem::with_id(handle, "next_gif", "Next GIF", true, None::<&str>)?
                        ],
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
                "next_gif" => {
                    // CORRECTED: This logic is correct, it just needed the Emitter trait in scope.
                    if let Some(main_window) = app.get_webview_window("main") {
                        main_window.emit("next_gif", ()).unwrap();
                    }
                }
                "settings" => {
                    if let Some(settings_window) = app.get_webview_window("settings") {
                        settings_window.set_focus().unwrap();
                    } else {
                        WebviewWindowBuilder::new(
                            app,
                            "settings",
                            tauri::WebviewUrl::App("index.html#/settings".into()),
                        )
                        .title("Reminder Settings")
                        .devtools(true)
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