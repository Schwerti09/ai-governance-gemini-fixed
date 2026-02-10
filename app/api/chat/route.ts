
import { createComplianceGraph } from "@/lib/compliance-agent";
import type { AgentMessage } from "@/lib/compliance-agent";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages || [];
    
    const graph = createComplianceGraph();
    const result = await graph.invoke({ messages });
    const resultMessages = result.messages as AgentMessage[];
    
    if (!resultMessages || resultMessages.length === 0) {
        return Response.json({ role: "assistant", content: "No analysis generated.", risk: "unknown" });
    }

    const lastMsg = resultMessages[resultMessages.length - 1];
    return Response.json({ role: "assistant", content: lastMsg.content, risk: result.riskLevel });

  } catch (e) {
    console.error("Route Error:", e);
    return Response.json({ error: "Agent Error" }, { status: 500 });
  }
}