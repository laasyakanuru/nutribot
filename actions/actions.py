from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.forms import FormValidationAction
from openai import OpenAI

class ValidateUserInfoForm(FormValidationAction):
    def name(self) -> Text:
        return "validate_user_info_form"

    def validate_age(
        self,
        value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> Dict[Text, Any]:
        if value.isdigit() and 18 <= int(value) <= 100:
            return {"age": value}
        else:
            dispatcher.utter_message(text="Please provide a valid age between 18 and 100.")
            return {"age": None}

    def validate_gender(
        self,
        value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> Dict[Text, Any]:
        if value.lower() in ["man", "woman", "other"]:
            return {"gender": value}
        else:
            dispatcher.utter_message(text="Please select a valid gender option.")
            return {"gender": None}

    def validate_residence(
        self,
        value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> Dict[Text, Any]:
        if value:
            return {"residence": value}
        else:
            dispatcher.utter_message(text="Please provide your place and neighborhood of residence.")
            return {"residence": None}

    def validate_children(
        self,
        value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> Dict[Text, Any]:
        try:
            num_children = int(value)
            if num_children >= 0:
                return {"children": [{"age": None, "school_status": None} for _ in range(num_children)]}
            else:
                dispatcher.utter_message(text="Please provide a valid number of children.")
                return {"children": None}
        except ValueError:
            dispatcher.utter_message(text="Please provide a valid number of children.")
            return {"children": None}


client = OpenAI()

class ActionChatWithLLM(Action):

    def name(self) -> Text:
        return "action_chat_with_llm"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        # Prompt the system to act like a dietician for kids
        messages = [
            {"role": "system", "content": "You are a dietician specializing in children's nutrition. A parent asks you, 'What are some healthy diet tips for my kids?' Answer in Spanish"},
            {"role": "user", "content": ""}
        ]

        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages,
                max_tokens=150
            )

            bot_response = response.choices[0].message.content
            dispatcher.utter_message(text=bot_response)
        except Exception as e:
            dispatcher.utter_message(text="I'm sorry, I couldn't process your request. Please try again later.")
            print(f"Error: {e}")

        return []
