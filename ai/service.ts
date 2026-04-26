import { Task } from "@/types";

export interface AIRecommendation {
  suggestedPriority: "low" | "medium" | "high";
  reasoning: string;
}

export class AIService {
  static async recommendPriority(task: Partial<Task>): Promise<AIRecommendation> {
    // Placeholder logic for AI recommendation
    // In a real app, this would call OpenAI/Gemini API
    
    const deadline = task.deadline ? new Date(task.deadline) : null;
    const now = new Date();
    
    if (deadline) {
      const diffTime = deadline.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 2) {
        return {
          suggestedPriority: "high",
          reasoning: "AI analysis: Deadline is very close (within 2 days). Immediate attention required."
        };
      } else if (diffDays <= 7) {
        return {
          suggestedPriority: "medium",
          reasoning: "AI analysis: Deadline is within a week. Recommended to start soon."
        };
      }
    }
    
    return {
      suggestedPriority: "low",
      reasoning: "AI analysis: Task has a comfortable timeline or no specific deadline."
    };
  }

  static async generateStudyPlan(tasks: Task[]): Promise<string> {
    // Placeholder for AI Planner
    return "Study Plan generated based on your tasks: \n1. Focus on high priority tasks first. \n2. Allocate 2 hours for " + tasks[0]?.title + " tomorrow morning.";
  }
}
