import type { Question } from "@/content/types";

export type Response = { kind: "mcq"; choice: number } | { kind: "numeric"; value: string };

export interface Grade {
  correct: boolean;
  /** Feedback specific to the response, e.g. why a chosen distractor is wrong. */
  feedback: string;
  explanation: string;
}

/**
 * Pure grading logic, independent of any UI. Deterministic: the same question and
 * response always produce the same grade.
 */
export function grade(question: Question, response: Response): Grade {
  if (question.kind === "mcq") {
    if (response.kind !== "mcq") throw new Error("response kind does not match question");
    const correct = response.choice === question.answer;
    const feedback = correct
      ? "Correct."
      : (question.distractors?.[response.choice] ??
        "Not quite. Compare your choice with the explanation below.");
    return { correct, feedback, explanation: question.explanation };
  }
  if (response.kind !== "numeric") throw new Error("response kind does not match question");
  const text = response.value.trim();
  if (!/^-?\d+(\.\d+)?$/.test(text)) {
    return { correct: false, feedback: "Enter a number.", explanation: question.explanation };
  }
  const correct = Number(text) === question.answer;
  return {
    correct,
    feedback: correct ? "Correct." : `${text} is not right.`,
    explanation: question.explanation,
  };
}
