import google.generativeai as genai
from typing import List, Dict, Optional
from app.core.config import settings

class GeminiLLMService:
    def __init__(self, api_key: str = settings.GEMINI_API_KEY):
        genai.configure(api_key=api_key)
        self.model_name = "models/gemini-2.5-flash-lite"
        self.model = genai.GenerativeModel(self.model_name)

    async def contextualize_query(self, query: str, history: List[Dict[str, str]]) -> str:
        """
        Rewrites a follow-up query into a standalone version based on history.
        """
        if not history:
            return query

        history_text = ""
        for turn in history[-3:]: # Only use last 3 turns for context
            role = "User" if turn["role"] == "user" else "Assistant"
            history_text += f"{role}: {turn['content']}\n"

        prompt = f"""
        Given the following conversation history and a new followup question, 
        rewrite the followup question into a STANDALONE question that can be understood 
        without the history. If the question is already standalone, return it EXACTLY as-is.

        Conversation History:
        {history_text}

        Followup Question: {query}
        
        Standalone Question:
        """
        
        try:
            # We use a very low temperature for deterministic rewriting
            generation_config = {"max_output_tokens": 100, "temperature": 0.0}
            response = self.model.generate_content(prompt, generation_config=generation_config)
            rewritten = response.text.strip()
            return rewritten if rewritten else query
        except Exception:
            # Fallback to original query on failure
            return query

    async def compress_history(
        self,
        previous_history: str,
        query: str,
        answer: str,
        profile_snapshot: str,
    ) -> str:
        """
        Uses the LLM to create a concise, intelligent memory snapshot.
        Combines the previous history, the latest Q&A, and the user's financial
        profile snapshot into a compact string that preserves only what matters
        for future conversations.
        """
        import asyncio
        from loguru import logger

        new_turn = f"Q: {query}\nA: {answer}"
        previous_block = f"Previous History:\n{previous_history}" if previous_history else "No previous history."

        prompt = f"""
You are a financial conversation memory manager.

Your task is to produce a DETAILED memory snapshot (max 400 words) that a future AI advisor can read to fully understand this user's financial situation, what was discussed, and what advice was given.

Structure your output with these sections:

**PROFILE SUMMARY**: Key financial facts — income, savings rate, risk profile, debt ratio, employment, dependents.
**ACTIVE GOALS**: What financial goals the user is working toward, their status, and any gaps identified.
**CONVERSATION HIGHLIGHTS**: The most important topics discussed across all exchanges — questions asked, concerns raised, and key insights shared.
**ADVICE GIVEN**: Specific actionable recommendations that were provided to the user.
**ACTION ITEMS**: Any next steps the user should take based on the conversation.
**KEY NUMBERS**: Important financial figures referenced (amounts, rates, percentages, dates).

Rules:
- Preserve ALL important financial details and advice from previous history
- Add new information from the latest exchange
- Remove only truly redundant or filler content
- Keep specific numbers, dates, and amounts — these are critical for continuity
- Write in a factual, third-person style

{previous_block}

User Financial Profile Snapshot:
{profile_snapshot}

Latest Exchange:
{new_turn}

Detailed Memory Snapshot:
"""
        generation_config = {"max_output_tokens": 500, "temperature": 0.2}
        max_retries = 3
        retry_delay = 2

        for attempt in range(max_retries):
            try:
                response = self.model.generate_content(prompt, generation_config=generation_config)
                return response.text.strip()
            except Exception as e:
                if "429" in str(e) or "ResourceExhausted" in str(e):
                    if attempt < max_retries - 1:
                        logger.warning(f"Rate limit hit (compress_history). Retrying in {retry_delay}s...")
                        await asyncio.sleep(retry_delay)
                        retry_delay *= 2
                        continue
                logger.error(f"compress_history error: {e}")
                # Fallback: deterministic truncation
                return f"**PROFILE SUMMARY**: {profile_snapshot}\n\n**CONVERSATION HIGHLIGHTS**:\nUser asked: {query[:200]}\n\n**ADVICE GIVEN**:\n{answer[:500]}"


    def _is_simple_query(self, query: str) -> bool:
        """
        Determine if a query is 'simple' based on length and keywords.
        """
        query_lower = query.lower()
        # Heuristic: Short length AND doesn't contain complex keywords
        complex_keywords = ["explain", "compare", "analyze", "detail", "list", "requirement", "process", "difference"]
        
        if len(query) < 50:
            if not any(word in query_lower for word in complex_keywords):
                return True
        return False

    async def generate_answer(self, query: str, chunks: List[str]) -> str:
        """
        Generate an analytical answer with citations and dynamic token budgeting.
        """
        is_simple = self._is_simple_query(query)
        # 40 tokens for simple (~30 words), 1000 for complex
        token_limit = 50 if is_simple else 1000 
        
        # Format the context with explicit Chunk IDs
        context_text = ""
        for i, chunk in enumerate(chunks):
            context_text += f"--- [CHUNK {i+1}] ---\n{chunk}\n\n"

        prompt_persona = "You are a professional Financial Compliance Assistant."
        conciseness_hint = "BE EXTREMELY CONCISE (max 2 sentences) and answer directly." if is_simple else "Provide a detailed, reasoned, and analytical argumentation."

        prompt = f"""
        {prompt_persona} 
        {conciseness_hint}
        
        Your task is to answer the user's question using ONLY the provided context chunks.

        CORE INSTRUCTIONS:
        1. **Analytical Argumentation**: Build a logical explanation based on the evidence.
        2. **Mandatory Citations**: You MUST cite the specific chunk(s) used using [CHUNK X].
        3. **Strict Grounding**: Only use the provided context.

        Context Chunks:
        {context_text}

        User Question: {query}
        
        Answer:
        """
        
        import asyncio
        from loguru import logger
        
        max_retries = 3
        retry_delay = 2
        
        # Configure Generation
        generation_config = {
            "max_output_tokens": token_limit,
            "temperature": 0.1 if is_simple else 0.7,
        }
        
        for attempt in range(max_retries):
            try:
                response = self.model.generate_content(
                    prompt, 
                    generation_config=generation_config
                )
                return response.text
            except Exception as e:
                if "429" in str(e) or "ResourceExhausted" in str(e):
                    if attempt < max_retries - 1:
                        logger.warning(f"Rate limit hit. Retrying in {retry_delay}s... (Attempt {attempt+1}/{max_retries})")
                        await asyncio.sleep(retry_delay)
                        retry_delay *= 2
                        continue
                
                logger.error(f"Gemini LLM error: {e}")
                raise e

    async def generate_direct_answer(self, prompt: str) -> str:
        """
        Generate an answer directly from a pre-constructed prompt, without adding citation instructions.
        """
        import asyncio
        from loguru import logger
        
        max_retries = 3
        retry_delay = 2
        
        generation_config = {
            "max_output_tokens": 1000,
            "temperature": 0.7,
        }
        
        for attempt in range(max_retries):
            try:
                response = self.model.generate_content(
                    prompt, 
                    generation_config=generation_config
                )
                return response.text
            except Exception as e:
                if "429" in str(e) or "ResourceExhausted" in str(e):
                    if attempt < max_retries - 1:
                        logger.warning(f"Rate limit hit. Retrying in {retry_delay}s... (Attempt {attempt+1}/{max_retries})")
                        await asyncio.sleep(retry_delay)
                        retry_delay *= 2
                        continue
                logger.error(f"Gemini LLM error: {e}")
                raise e
