export interface Grade {
  id: number;
  studentName: string;
  subject: string;
  gradeValue: number;
  dateCreated: string;
  dateModified: string;
}

export interface GradeCreateDto {
  studentName: string;
  subject: string;
  gradeValue: number;
}

export interface GradeUpdateDto {
  studentName: string;
  subject: string;
  gradeValue: number;
}

export interface GradeListParams {
  studentName?: string;
  subject?: string;
}

export interface GradeFormData {
  studentName: string;
  subject: string;
  gradeValue: number;
}
