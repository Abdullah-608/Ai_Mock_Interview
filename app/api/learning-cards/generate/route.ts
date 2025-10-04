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

    // Generate structured learning content using AI
    const { text } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `You are an expert educational content creator and learning specialist with 15+ years of experience. Create comprehensive, detailed learning materials for the following topic.

TOPIC: ${title}
CONTENT TO LEARN: ${content}

TASK: Generate two outputs with maximum detail and depth:

1. **COMPREHENSIVE STRUCTURED NOTES** - Create extremely detailed bullet-point notes that include:
   - Core concepts with precise definitions and technical details
   - Step-by-step processes and methodologies
   - Multiple practical examples and use cases
   - Advanced techniques and best practices
   - Common pitfalls, mistakes, and how to avoid them
   - Performance considerations and optimizations
   - Security implications and best practices
   - Integration patterns and architectural considerations
   - Debugging techniques and troubleshooting guides
   - Related technologies and how they connect
   - Real-world case studies and success stories
   - Industry standards and conventions
   - Future trends and evolution of the topic
   - Interview questions and answers related to this topic
   - Code examples (if applicable) with explanations

**FORMATTING REQUIREMENTS FOR NOTES:**
- Use bullet points (•) for all list items
- Use **bold headings** for major sections (exactly 2 asterisks: **Core Concepts**, **Best Practices**)
- Use inline code with single backticks for technical terms, functions, and variables
- Structure with clear headings followed by bullet points
- Keep formatting clean and consistent
- IMPORTANT: Only use exactly 2 asterisks (**) for bold text, never more than 2

2. **IN-DEPTH EXPLANATION** - Write a comprehensive, detailed explanation that:
   - Provides thorough, beginner-to-advanced explanations
   - Uses multiple analogies and real-world examples
   - Explains the "why", "how", and "when" behind concepts
   - Connects different ideas and shows relationships
   - Provides historical context and evolution
   - Discusses trade-offs and decision-making factors
   - Includes performance implications and scalability considerations
   - Covers edge cases and advanced scenarios
   - Provides practical implementation guidance with code examples
   - Includes troubleshooting and debugging approaches
   - Discusses industry best practices and standards
   - Explains related concepts and technologies
   - Provides learning paths and next steps

**FORMATTING REQUIREMENTS FOR EXPLANATION:**
- Use **bold headings** for major sections (exactly 2 asterisks before and after: **Core Concepts**, **Advanced Topics**, **Best Practices**)
- Include comprehensive code blocks using triple backticks for programming examples, syntax, and implementations
- Use inline code with single backticks for specific terms, functions, variables, and technical concepts
- Structure content with clear headings, bullet points, and numbered lists
- Provide practical, real-world code examples that demonstrate the concepts
- Include step-by-step implementations and tutorials
- Use bullet points (•) for lists and numbered lists (1., 2., 3.) for sequential steps
- Mix different content types: headings, paragraphs, lists, and code blocks
- Make content highly readable with proper spacing and organization
- IMPORTANT: Only use exactly 2 asterisks (**) for bold text, never more than 2

DETAIL REQUIREMENTS:
- Be extremely thorough and comprehensive
- Include technical depth while remaining accessible
- Provide multiple perspectives and approaches
- Include practical, actionable information
- Cover both fundamentals and advanced topics
- Use clear, professional language
- Structure information logically with clear hierarchy
- Include specific examples and use cases
- Address common questions and concerns
- Provide context for when and why to use concepts

OUTPUT FORMAT:
Return your response as a JSON object with exactly these keys:
{
  "notes": "Your extremely detailed structured notes here as a single string with line breaks",
  "explanation": "Your comprehensive detailed explanation here as a single string"
}

Generate the most comprehensive, detailed, and valuable educational content possible that will help someone become an expert in this topic.`,
    });

    try {
      const parsedResponse = JSON.parse(text);
      
      // Validate the response structure
      if (!parsedResponse.notes || !parsedResponse.explanation) {
        throw new Error('Invalid response format');
      }

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
        throw new Error(error || 'Failed to save learning card');
      }

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
    console.error("Error generating learning content:", error);
    return Response.json({ 
      success: false, 
      error: 'Failed to generate learning content' 
    }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ 
    success: true, 
    message: 'Learning Cards API is ready!' 
  }, { status: 200 });
}
