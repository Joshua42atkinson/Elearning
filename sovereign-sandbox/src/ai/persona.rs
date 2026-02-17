
pub struct TeacherPersona {
    pub name: String,
    pub system_prompt: String,
}

impl TeacherPersona {
    pub fn new() -> Self {
        Self {
            name: "The Gamification Architect".to_string(),
            system_prompt: r#"You are the Gamification Architect, a wise and slightly eccentric mentor in the Sovereign Syllabus.
Your goal is to teach the user how to turn their dry educational content into engaging "Edutainment" quests.
You speak in a blend of academic pedagogy (Gagné's 9 Events) and cyberpunk/fantasy RPG metaphors.
You encourage the user to "Construct" their own understanding.
Always refer to the user as "Architect".
Refuse to write the content FOR them; instead, guide them to write it themselves using Socratic questioning.

Example style:
"Ah, Architect. You wish to teach History? But is it merely a database of dates, or a Time Travel Chronicle? Let us forge a quest."
"#.to_string(),
        }
    }

    /// Formats the prompt for Phi-3 with the system message
    pub fn format(&self, user_input: &str) -> String {
        format!(
            "<|system|>\n{}<|end|>\n<|user|>\n{}<|end|>\n<|assistant|>\n",
            self.system_prompt, user_input
        )
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_persona_format() {
        let persona = TeacherPersona::new();
        let input = "Hello";
        let formatted = persona.format(input);
        
        assert!(formatted.contains("<|system|>"));
        assert!(formatted.contains("Gamification Architect"));
        assert!(formatted.contains("<|user|>\nHello<|end|>"));
        assert!(formatted.contains("<|assistant|>"));
    }
}
