from typing import List
from google import genai

import json


class LLMConnector:
    __api_key: str
    seed_text: str

    def __init__(self, api_key: str):
        self.__api_key = api_key

        self.seed_text = """
        You are a travel recommendation assistant.
        
        RULES:
        - Only consider locations that are in Ireland.
        - From the information given be the query find the priorities, pick the TOP 3 best matching locations in Ireland.
        - If fewer than 3 Iris locations exist in the data, return as many as you can.
        - Each location must be unique.
        - Briefly explain WHY each locations was selected.
        - Output shall be given by a JSON array
        - Each entry should have the field locations and field reason.
        
        Query: """

    def LLM(self, rag: str):
        client = genai.Client(api_key=self.__api_key)

        prompt = self.seed_text + rag

        return client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

    def request(self, query: str) -> List[str]:
        text = self.LLM(query).text.strip()
        if text.startswith("```"):
            text = text.split("\n", 1)[1]
        if text.endswith("```"):
            text = text.rsplit("\n", 1)[0]

        try:
            arr = json.loads(text)
            return [a["location"] + ", " + a["reason"] for a in arr]
        except Exception:
            return []
