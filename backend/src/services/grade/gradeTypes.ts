/**
 * @summary
 * Grade service type definitions.
 * Defines interfaces and types for grade operations.
 *
 * @module services/grade/gradeTypes
 */

/**
 * @interface GradeEntity
 * @description Represents a grade record in the system
 *
 * @property {number} id - Unique grade identifier
 * @property {string} studentName - Student name
 * @property {string} subject - Subject name
 * @property {number} gradeValue - Grade value (0.00-100.00)
 * @property {Date} dateCreated - Creation timestamp
 * @property {Date} dateModified - Last modification timestamp
 */
export interface GradeEntity {
  id: number;
  studentName: string;
  subject: string;
  gradeValue: number;
  dateCreated: Date;
  dateModified: Date;
}

/**
 * @interface GradeCreateRequest
 * @description Parameters for creating a new grade
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 * @property {string} studentName - Student name
 * @property {string} subject - Subject name
 * @property {number} gradeValue - Grade value
 */
export interface GradeCreateRequest {
  idAccount: number;
  idUser: number;
  studentName: string;
  subject: string;
  gradeValue: number;
}

/**
 * @interface GradeUpdateRequest
 * @description Parameters for updating a grade
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 * @property {number} id - Grade identifier
 * @property {string} studentName - Updated student name
 * @property {string} subject - Updated subject name
 * @property {number} gradeValue - Updated grade value
 */
export interface GradeUpdateRequest {
  idAccount: number;
  idUser: number;
  id: number;
  studentName: string;
  subject: string;
  gradeValue: number;
}

/**
 * @interface GradeGetRequest
 * @description Parameters for retrieving a specific grade
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 * @property {number} id - Grade identifier
 */
export interface GradeGetRequest {
  idAccount: number;
  idUser: number;
  id: number;
}

/**
 * @interface GradeListRequest
 * @description Parameters for listing grades with filters
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 * @property {string} [studentName] - Optional student name filter
 * @property {string} [subject] - Optional subject filter
 */
export interface GradeListRequest {
  idAccount: number;
  idUser: number;
  studentName?: string;
  subject?: string;
}

/**
 * @interface GradeDeleteRequest
 * @description Parameters for deleting a grade
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 * @property {number} id - Grade identifier
 */
export interface GradeDeleteRequest {
  idAccount: number;
  idUser: number;
  id: number;
}

/**
 * @interface GradeCreateResult
 * @description Result of grade creation operation
 *
 * @property {number} id - Created grade identifier
 */
export interface GradeCreateResult {
  id: number;
}

/**
 * @interface GradeUpdateResult
 * @description Result of grade update operation
 *
 * @property {number} id - Updated grade identifier
 */
export interface GradeUpdateResult {
  id: number;
}

/**
 * @interface GradeDeleteResult
 * @description Result of grade deletion operation
 *
 * @property {number} id - Deleted grade identifier
 */
export interface GradeDeleteResult {
  id: number;
}
