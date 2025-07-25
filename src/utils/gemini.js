const GEMINI_API_KEY = "AIzaSyAZlcoIv55lujZG0IwZsSvtK_BuwiZdSbE"; // IMPORTANT: PASTE YOUR GEMINI API KEY HERE

export async function generateSummary(text, config) {
  if (!GEMINI_API_KEY) {
    return "Error: Please add your Gemini API key to src/utils/gemini.js";
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
  
  const prompt = `
    You are an expert summarizer. Analyze the following text and generate a summary based on these rules:
    1.  **Desired Length:** The final summary should be approximately ${config.summaryPages} page(s) long, assuming a standard document page.
    2.  **Format:** Structure the summary using ${config.summaryFormat === 'bullets' ? 'detailed bullet points' : 'well-structured paragraphs'}.
    3.  **Structure:** Use Markdown for clear organization. Use '##' for main headings and '###' for subheadings. Do NOT use '# ' for a main title. Start directly with the main content headings.
    4.  **Content:** Identify the key topics, arguments, and conclusions from the text. Create logical headings and subheadings for these topics.
    
    Here is the text to summarize:
    ---
    ${text}
  `;

  const requestBody = { contents: [{ parts: [{ text: prompt }] }] };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });
    
    const data = await response.json();

    // BUG FIX 1: Better error checking. If the API returns an error object, display it.
    if (!response.ok || data.error) {
        console.error("Gemini API Error Response:", data);
        const errorMessage = data.error ? data.error.message : `API Error: ${response.status}`;
        throw new Error(errorMessage);
    }

    // Check if the response was blocked or is missing content
    if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content) {
        console.warn("API Warning: No content returned. This may be due to safety settings.", data);
        const finishReason = data.candidates ? data.candidates[0].finishReason : 'UNKNOWN';
        throw new Error(`The AI returned no content. Reason: ${finishReason}. Please try a different PDF or adjust the content.`);
    }

    return data.candidates[0].content.parts[0].text;

  } catch (error) {
    console.error("Gemini API call failed:", error);
    // Re-throw the specific error message to be displayed in the UI
    throw error;
  }
}
