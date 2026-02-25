#[test]
fn test_toml_parse() {
    let contents = std::fs::read_to_string("assets/syllabus/module_1.toml").unwrap();
    match sovereign_sandbox::syllabus::Syllabus::load_from_str(&contents) {
        Ok(_) => println!("OK"),
        Err(e) => panic!("ERROR: {}", e),
    }
}
