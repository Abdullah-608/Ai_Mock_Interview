import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { createLearningCard } from "@/lib/actions/general.action";

// Set function timeout to 60 seconds
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { title, content, userId, userName } = await request.json();

    if (!title || !content || !userId) {
      return Response.json({ error: 'Title, content, and userId are required' }, { status: 400 });
    }

    // Generate structured learning content using AI (optimized for speed)
    const { text } = await generateText({
      model: google("gemini-2.0-flash-001"),
      maxTokens: 2000, // Limit tokens for faster generation
      temperature: 0.7,
      prompt: `You are an expert educator. Create concise, well-structured learning materials for: "${title}"

CONTEXT: ${content}

Generate a JSON response with exactly 2 fields:

1. "notes": Structured bullet-point notes with:
   - **Key Concepts**: Core ideas and definitions (use ** for headings)
   - **Important Points**: 5-8 bullet points (•) covering main topics
   - **Examples**: Practical examples with inline code using backticks
   - **Best Practices**: 3-5 key recommendations

2. "explanation": Clear explanation with:
   - **Overview**: Brief introduction
   - **How It Works**: Step-by-step breakdown
   - **Practical Use**: Real-world applications with code examples
   - **Key Takeaways**: Summary points

FORMATTING RULES:
- Use exactly ** for headings (e.g., **Core Concepts**)
- Use • or - for bullet points
- Use \` for inline code
- Use triple backticks for code blocks
- Keep it concise but informative
- Focus on clarity over length

RETURN VALID JSON:
{
  "notes": "your formatted notes here",
  "explanation": "your formatted explanation here"
}`,
    });

    try {
      const parsedResponse = JSON.parse(text);
      
      // Validate the response structure
      if (!parsedResponse.notes || !parsedResponse.explanation) {
        console.error('Invalid AI response format:', parsedResponse);
        throw new Error('AI response missing notes or explanation');
      }

      console.log('AI generated successfully:', {
        notesLength: parsedResponse.notes.length,
        explanationLength: parsedResponse.explanation.length
      });

      // Save the learning card to database
      const { success, cardId, error } = await createLearningCard({
        title,
        content,
        notes: parsedResponse.notes,
        explanation: parsedResponse.explanation,
        userId,
        userName
      });

      if (!success) {
        console.error('Failed to save to database:', error);
        throw new Error(error || 'Failed to save learning card');
      }

      console.log('Learning card saved successfully:', cardId);

      return Response.json({
        success: true,
        cardId,
        notes: parsedResponse.notes,
        explanation: parsedResponse.explanation
      });
    } catch {
      // If JSON parsing fails, extract content manually
      const lines = text.split('\n');
      let notes = '';
      let explanation = '';
      let currentSection = '';
      
      for (const line of lines) {
        if (line.includes('"notes"') || line.includes('notes:')) {
          currentSection = 'notes';
          continue;
        }
        if (line.includes('"explanation"') || line.includes('explanation:')) {
          currentSection = 'explanation';
          continue;
        }
        
        if (currentSection === 'notes') {
          notes += line + '\n';
        } else if (currentSection === 'explanation') {
          explanation += line + '\n';
        }
      }
      
      // Fallback: if we can't parse properly, create detailed structure
      if (!notes && !explanation) {
        notes = `• **Core Concept**: ${title}
• **Definition**: ${content}
• **Key Principles**: Fundamental concepts and their relationships
• **Implementation Details**: Step-by-step approaches and methodologies
• **Practical Examples**: Real-world use cases and applications
• **Best Practices**: Industry standards and recommended approaches
• **Common Pitfalls**: Mistakes to avoid and troubleshooting tips
• **Performance Considerations**: Optimization strategies and efficiency tips
• **Security Implications**: Safety considerations and best practices
• **Integration Patterns**: How this connects with other technologies
• **Advanced Techniques**: Advanced usage patterns and expert tips
• **Debugging Guide**: Common issues and how to resolve them
• **Related Technologies**: Connected concepts and complementary tools
• **Industry Standards**: Conventions and best practices in the field
• **Future Trends**: Evolution and upcoming developments
• **Interview Preparation**: Common questions and detailed answers
• **Learning Resources**: Additional materials and next steps`;
        
        explanation = `This comprehensive learning guide covers ${title}, a fundamental concept that plays a crucial role in modern development and problem-solving.

**Overview and Context**
${content} This topic is essential for building a strong foundation in the subject area and understanding how various components work together to create robust solutions.

**Deep Dive into Core Concepts**
The topic involves several interconnected principles that work together to provide comprehensive functionality. Understanding these relationships is key to mastering the subject and applying it effectively in real-world scenarios.

**Practical Applications and Use Cases**
In practice, this concept is used across multiple domains and industries. It provides the foundation for building scalable, maintainable solutions and enables developers to create efficient, robust applications.

**Implementation Strategies**
When implementing this concept, it's important to consider performance implications, security considerations, and maintainability. The approach you choose will depend on your specific use case, performance requirements, and architectural constraints.

**Best Practices and Common Patterns**
Industry best practices have evolved around this topic, providing proven patterns and approaches that lead to successful implementations. Understanding these patterns helps avoid common pitfalls and ensures your solutions are robust and maintainable.

**Advanced Considerations**
As you become more experienced with this topic, you'll encounter advanced scenarios that require deeper understanding of the underlying principles. These advanced concepts build upon the fundamentals and enable you to solve complex, real-world problems.

**Troubleshooting and Debugging**
Common issues and challenges include performance bottlenecks, integration problems, and edge cases that weren't initially considered. Having a systematic approach to debugging and troubleshooting is essential for successful implementation.

**Future Trends and Evolution**
The field continues to evolve with new technologies, approaches, and best practices emerging regularly. Staying current with these developments ensures your knowledge remains relevant and valuable.

This comprehensive understanding will enable you to effectively apply this knowledge in interviews, projects, and professional development scenarios.`;
      }

      // Save the learning card to database
      const { success, cardId, error } = await createLearningCard({
        title,
        content,
        notes: notes.trim(),
        explanation: explanation.trim(),
        userId,
        userName
      });

      if (!success) {
        throw new Error(error || 'Failed to save learning card');
      }

      return Response.json({
        success: true,
        cardId,
        notes: notes.trim(),
        explanation: explanation.trim()
      });
    }

  } catch (error) {
    console.error("=== ERROR GENERATING LEARNING CONTENT ===");
    console.error("Error type:", error?.constructor?.name);
    console.error("Error message:", error instanceof Error ? error.message : String(error));
    console.error("Full error:", error);
    
    return Response.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate learning content',
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined
    }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ 
    success: true, 
    message: 'Learning Cards API is ready!' 
  }, { status: 200 });
}
