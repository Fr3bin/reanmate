export type Grade = 10 | 11 | 12;

export type SubjectId = 'math' | 'history';

export type ChapterStatus = 'draft' | 'approved';

export interface Question {
  id: string;
  chapterId: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  sortOrder: number;
}

export interface Chapter {
  id: string;
  grade: Grade;
  subject: SubjectId;
  title: string;
  sortOrder: number;
  summary: string;
  sourceText: string;
  moeysEmbedUrl: string;
  moeysCredit: string;
  status: ChapterStatus;
  questions: Question[];
}
