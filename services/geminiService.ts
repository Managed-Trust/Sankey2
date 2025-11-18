
import { GoogleGenAI, Type } from "@google/genai";
import { SankeyNode, SankeyLink, SankeyData, ExportFormat, Chat } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const dataToText = (nodes: SankeyNode[], links: SankeyLink[]): string => {
    const nodeNames = `Nodes: ${nodes.map(n => n.name).join(', ')}`;
    const linkConnections = `Links:\n${links.map(l => `${l.source} -> ${l.target} (${l.value})`).join('\n')}`;
    return `${nodeNames}\n${linkConnections}`;
};

export const getDeepAnalysis = async (nodes: SankeyNode[], links: SankeyLink[]): Promise<string> => {
    const model = 'gemini-2.5-pro';
    const textData = dataToText(nodes, links as unknown as SankeyLink[]); // Temp cast
    const prompt = `
        Analyze the following Sankey diagram data representing a flow system.
        
        Data:
        ${textData}

        Your task is to provide a deep, insightful analysis. Identify the following:
        1.  **Primary Flow Paths:** What are the most significant paths from source to sink?
        2.  **Bottlenecks or Concentrations:** Where does the flow converge most heavily?
        3.  **Inefficiencies or "Losses":** Identify nodes that represent loss and quantify their impact relative to the total flow.
        4.  **Surprising Patterns:** Are there any non-obvious connections or distributions?
        5.  **Suggestions for Optimization:** Based on the data, suggest potential areas for improvement or investigation.

        Present your analysis in a clear, structured Markdown format.
    `;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            thinkingConfig: { thinkingBudget: 32768 }
        }
    });
    return response.text;
};

// FIX: Return the stream from chat.sendMessageStream directly instead of wrapping it in a ReadableStream.
export const getChatResponse = (history: Chat[], message: string, data: SankeyData) => {
    const model = 'gemini-2.5-flash';
    const processedHistory = history.map(h => ({ role: h.role, parts: h.parts.map(p => ({ text: p.text })) }));
    const textData = dataToText(data.nodes, data.links as unknown as SankeyLink[]);

    const chat = ai.chats.create({
        model: model,
        config: {
            systemInstruction: `You are a helpful assistant analyzing Sankey diagram data. The user has provided the following data context for this conversation:\n\n${textData}\n\nKeep your answers concise and directly related to the user's questions about this data.`,
        },
        history: processedHistory,
    });

    return chat.sendMessageStream({ message });
};

export const generateTextFormat = async (format: ExportFormat, data: SankeyData): Promise<string> => {
    const model = 'gemini-flash-lite-latest';
    const textData = dataToText(data.nodes, data.links as unknown as SankeyLink[]);

    let prompt = '';
    switch (format) {
        case 'markdown':
            prompt = `Generate a Markdown description for the following Sankey data:\n${textData}`;
            break;
        case 'csv':
            prompt = `Generate two CSV blocks (one for nodes, one for links) for the following Sankey data. Use a header row for each. Enclose them in \`\`\`csv code blocks.\nNodes should be a single column: "name". Links should have three columns: "source", "target", "value".\n${textData}`;
            break;
        case 'mermaid':
            prompt = `Generate a Mermaid-compliant Sankey diagram definition for the following data. Enclose it in a \`\`\`mermaid code block.\n${textData}`;
            break;
    }

    const response = await ai.models.generateContent({ model, contents: prompt });
    // Clean up the response to remove markdown code block fences
    return response.text.replace(/```[a-zA-Z]*\n/g, '').replace(/```/g, '').trim();
};