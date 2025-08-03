// REPLACE WITH YOUR ACTUAL HUGGING FACE SPACE URL
// It will look something like: https://your-username-resume-ai-assistant.hf.space
const HF_SPACE_URL = "https://ajay17m-my-resume-assistant.hf.space"; 

// Q&A Elements
const questionInput = document.getElementById('questionInput');
const askQuestionBtn = document.getElementById('askQuestionBtn');
const qaResponseDiv = document.getElementById('qaResponse');

// Summarizer Elements
const generateSummaryBtn = document.getElementById('generateSummaryBtn');
const summaryResponseDiv = document.getElementById('summaryResponse');

// Function to make API calls
async function callApi(endpoint, body = {}) {
    try {
        // Add a loading indicator
        let responseDiv;
        if (endpoint.includes("qa")) {
            responseDiv = qaResponseDiv;
        } else {
            responseDiv = summaryResponseDiv;
        }
        responseDiv.innerHTML = '<div class="loading-indicator">Loading...</div>';

        const response = await fetch(`${HF_SPACE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const data = await response.json();
        // LangServe's /invoke endpoint for a string output returns { output: "Your answer" }
        return data.output; 
    } catch (error) {
        console.error('API call failed:', error);
        return `Error: ${error.message}. Please check the console for more details or ensure the API is running.`;
    }
}

// Event Listener for Ask Question Button
askQuestionBtn.addEventListener('click', async () => {
    const question = questionInput.value.trim();
    if (question) {
        const answer = await callApi("/qa/invoke", { input: question });
        qaResponseDiv.innerText = answer;
    } else {
        qaResponseDiv.innerText = "Please enter a question.";
    }
});

// Event Listener for Generate Summary Button
generateSummaryBtn.addEventListener('click', async () => {
    // For the summarizer, no input is needed as we bound the documents in app.py
    const summary = await callApi("/summarize/invoke", {"input":{}}); 
    summaryResponseDiv.innerText = summary;
});

// Optional: Allow pressing Enter to ask question
questionInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        askQuestionBtn.click();
    }
});
