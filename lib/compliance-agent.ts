
import { StateGraph, Annotation } from "@langchain/langgraph";
import { GoogleGenerativeAI } from "@google/generative-ai";

export interface AgentMessage {
  role: string;
  content: string;
}

const ComplianceState = Annotation.Root({
  messages: Annotation<AgentMessage[]>({ 
    reducer: (x, y) => x.concat(y), 
    default: () => [] 
  }),
  riskLevel: Annotation<string>({ 
    reducer: (x, y) => y ?? x, 
    default: () => "low" 
  })
});

const analyzerNode = async (state: typeof ComplianceState.State) => {
    const messages = state.messages;
    const lastMessage = messages[messages.length - 1];
    const textToAnalyze = lastMessage?.content || "";

    if (!process.env.GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY missing");
        return { 
            riskLevel: "unknown", 
            messages: [{ role: "assistant", content: "System Error: API Key missing configuration." }] 
        };
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
        Act as an EU AI Act Compliance Auditor.
        Analyze the following system description for risks:
        "${textToAnalyze}"
        
        Respond briefly. Start with "Risk Level: [Low/Medium/High/Critical]".
        Then provide a 1-sentence reason.
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        let risk = "low";
        if (responseText.toLowerCase().includes("high")) risk = "high";
        else if (responseText.toLowerCase().includes("medium")) risk = "medium";
        else if (responseText.toLowerCase().includes("critical")) risk = "critical";

        return { 
            riskLevel: risk, 
            messages: [{ role: "assistant", content: responseText }] 
        };

    } catch (error) {
        console.error("Gemini Error:", error);
        return { 
            riskLevel: "error", 
            messages: [{ role: "assistant", content: "Analysis failed due to neural engine error." }] 
        };
    }
};

export const createComplianceGraph = () => {
    const builder = new StateGraph(ComplianceState);
    builder.addNode("analyze", analyzerNode);
    
    // FIX: Explizites Casting, um TypeScript Build-Fehler zu verhindern
    // Wir sagen TS: "Vertrau mir, 'analyze' ist ein valider Knoten."
    builder.addEdge("__start__", "analyze" as any);
    
    return builder.compile();
};