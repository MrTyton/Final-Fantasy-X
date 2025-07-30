use std::fs;
use std::path::PathBuf;

#[tauri::command]
fn read_guide_file(filename: String) -> Result<String, String> {
    // Try different possible paths for the file
    let possible_paths = vec![
        PathBuf::from(format!("public/data/{}", filename)),
        PathBuf::from(format!("../public/data/{}", filename)),
        PathBuf::from(format!("./public/data/{}", filename)),
        PathBuf::from(format!("data/{}", filename)),
    ];
    
    for path in possible_paths {
        println!("Trying to read file from: {:?}", path);
        if path.exists() {
            match fs::read_to_string(&path) {
                Ok(content) => {
                    println!("Successfully read file from: {:?}", path);
                    return Ok(content);
                }
                Err(e) => {
                    println!("Failed to read from {:?}: {}", path, e);
                    continue;
                }
            }
        } else {
            println!("Path does not exist: {:?}", path);
        }
    }
    
    Err(format!("Could not find file: {}", filename))
}

#[tauri::command]
fn write_guide_file(filename: String, content: String) -> Result<(), String> {
    // Try to write to the same paths we read from
    let possible_paths = vec![
        PathBuf::from(format!("public/data/{}", filename)),
        PathBuf::from(format!("../public/data/{}", filename)),
        PathBuf::from(format!("./public/data/{}", filename)),
        PathBuf::from(format!("data/{}", filename)),
    ];
    
    for path in possible_paths {
        println!("Trying to write file to: {:?}", path);
        
        // Ensure the parent directory exists
        if let Some(parent) = path.parent() {
            if let Err(e) = fs::create_dir_all(parent) {
                println!("Failed to create directory {:?}: {}", parent, e);
                continue;
            }
        }
        
        // Try to write the file
        match fs::write(&path, &content) {
            Ok(_) => {
                println!("Successfully wrote file to: {:?}", path);
                return Ok(());
            }
            Err(e) => {
                println!("Failed to write to {:?}: {}", path, e);
                continue;
            }
        }
    }
    
    Err(format!("Could not write file: {}", filename))
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init()) // Keep this line
        .invoke_handler(tauri::generate_handler![read_guide_file, write_guide_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}