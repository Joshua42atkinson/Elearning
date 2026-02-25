use bevy::prelude::*;

// 1. Define the Data Structure (The Quiz Content)
#[derive(Resource)]
pub struct QuizManager {
    pub current_question_index: usize,
    pub score: u32,
    pub questions: Vec<QuizQuestion>,
}

pub struct QuizQuestion {
    pub prompt: String,
    pub options: Vec<String>,
    pub correct_index: usize,
    pub feedback_correct: String,
    pub feedback_incorrect: String,
}

impl Default for QuizManager {
    fn default() -> Self {
        Self {
            current_question_index: 0,
            score: 0,
            questions: vec![
                QuizQuestion {
                    prompt: "> TEACHER: Which AI architecture guarantees that student data never leaves the local classroom hardware?".to_string(),
                    options: vec![
                        "1. Cloud-based OpenAI APIs".to_string(),
                        "2. Local-First Open Weights (e.g., Llama 3 via LM Studio)".to_string(),
                        "3. A shared Google Drive".to_string(),
                    ],
                    correct_index: 1, // The 2nd option (0-indexed)
                    feedback_correct: "> SYSTEM: Correct. Local-First models process all data on the machine, bypassing FERPA risks.".to_string(),
                    feedback_incorrect: "> SYSTEM: Incorrect. Cloud APIs send data to external servers. We need a Local-First approach.".to_string(),
                }
                // Add more questions here to meet the 10-20 min module requirement
            ],
        }
    }
}

// 2. Define the Event
#[derive(Event)]
pub struct SubmitAnswerEvent(pub usize);

// 3. The Input System (Fires the Event)
pub fn handle_quiz_input(
    keyboard_input: Res<ButtonInput<KeyCode>>,
    mut event_writer: EventWriter<SubmitAnswerEvent>,
) {
    if keyboard_input.just_pressed(KeyCode::Digit1) {
        event_writer.send(SubmitAnswerEvent(0));
    } else if keyboard_input.just_pressed(KeyCode::Digit2) {
        event_writer.send(SubmitAnswerEvent(1));
    } else if keyboard_input.just_pressed(KeyCode::Digit3) {
        event_writer.send(SubmitAnswerEvent(2));
    }
}

// 4. The Logic System (Processes the Event)
pub fn evaluate_quiz_answer(
    mut events: EventReader<SubmitAnswerEvent>,
    mut quiz_manager: ResMut<QuizManager>,
    // mut dialogue_text_query: Query<&mut Text, With<DialogueBox>>, // Assuming you have a UI component for text
) {
    for event in events.read() {
        if quiz_manager.current_question_index >= quiz_manager.questions.len() {
            continue; // Quiz complete
        }

        let question = &quiz_manager.questions[quiz_manager.current_question_index];
        let chosen_index = event.0;

        if chosen_index == question.correct_index {
            println!("{}", question.feedback_correct); // Replace with UI text update
            quiz_manager.score += 1;
            // Advance to next phase or question
            quiz_manager.current_question_index += 1; 
        } else {
            println!("{}", question.feedback_incorrect); // Replace with UI text update
        }
    }
}

// 5. Plugin Setup
pub struct QuizPlugin;

impl Plugin for QuizPlugin {
    fn build(&self, app: &mut App) {
        app.init_resource::<QuizManager>()
           .add_event::<SubmitAnswerEvent>()
           .add_systems(Update, (handle_quiz_input, evaluate_quiz_answer));
    }
}
