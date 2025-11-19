/**
 * @summary
 * Grade business logic and database operations.
 * Implements CRUD operations for grade management.
 *
 * @module services/grade/gradeRules
 */

import { getPool } from '@/utils/database';
import type {
  GradeCreateRequest,
  GradeCreateResult,
  GradeGetRequest,
  GradeEntity,
  GradeListRequest,
  GradeUpdateRequest,
  GradeUpdateResult,
  GradeDeleteRequest,
  GradeDeleteResult,
} from './gradeTypes';

/**
 * @summary
 * Creates a new grade record.
 *
 * @function gradeCreate
 * @module grade
 *
 * @param {GradeCreateRequest} params - Grade creation parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {string} params.studentName - Student name
 * @param {string} params.subject - Subject name
 * @param {number} params.gradeValue - Grade value
 *
 * @returns {Promise<GradeCreateResult>} Created grade identifier
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails
 *
 * @example
 * const result = await gradeCreate({
 *   idAccount: 1,
 *   idUser: 1,
 *   studentName: 'John Doe',
 *   subject: 'Mathematics',
 *   gradeValue: 85.5
 * });
 */
export async function gradeCreate(params: GradeCreateRequest): Promise<GradeCreateResult> {
  const pool = await getPool();

  const result = await pool
    .request()
    .input('idAccount', params.idAccount)
    .input('studentName', params.studentName)
    .input('subject', params.subject)
    .input('gradeValue', params.gradeValue)
    .execute('spGradeCreate');

  return result.recordset[0];
}

/**
 * @summary
 * Retrieves a specific grade record.
 *
 * @function gradeGet
 * @module grade
 *
 * @param {GradeGetRequest} params - Grade retrieval parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {number} params.id - Grade identifier
 *
 * @returns {Promise<GradeEntity | null>} Grade entity or null if not found
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails
 *
 * @example
 * const grade = await gradeGet({
 *   idAccount: 1,
 *   idUser: 1,
 *   id: 123
 * });
 */
export async function gradeGet(params: GradeGetRequest): Promise<GradeEntity | null> {
  const pool = await getPool();

  const result = await pool
    .request()
    .input('idAccount', params.idAccount)
    .input('id', params.id)
    .execute('spGradeGet');

  return result.recordset.length > 0 ? result.recordset[0] : null;
}

/**
 * @summary
 * Lists all grades with optional filtering.
 *
 * @function gradeList
 * @module grade
 *
 * @param {GradeListRequest} params - Grade list parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {string} [params.studentName] - Optional student name filter
 * @param {string} [params.subject] - Optional subject filter
 *
 * @returns {Promise<GradeEntity[]>} Array of grade entities
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails
 *
 * @example
 * const grades = await gradeList({
 *   idAccount: 1,
 *   idUser: 1,
 *   studentName: 'John',
 *   subject: 'Math'
 * });
 */
export async function gradeList(params: GradeListRequest): Promise<GradeEntity[]> {
  const pool = await getPool();

  const result = await pool
    .request()
    .input('idAccount', params.idAccount)
    .input('studentName', params.studentName || null)
    .input('subject', params.subject || null)
    .execute('spGradeList');

  return result.recordset;
}

/**
 * @summary
 * Updates an existing grade record.
 *
 * @function gradeUpdate
 * @module grade
 *
 * @param {GradeUpdateRequest} params - Grade update parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {number} params.id - Grade identifier
 * @param {string} params.studentName - Updated student name
 * @param {string} params.subject - Updated subject name
 * @param {number} params.gradeValue - Updated grade value
 *
 * @returns {Promise<GradeUpdateResult>} Updated grade identifier
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails
 *
 * @example
 * const result = await gradeUpdate({
 *   idAccount: 1,
 *   idUser: 1,
 *   id: 123,
 *   studentName: 'John Doe',
 *   subject: 'Mathematics',
 *   gradeValue: 90.0
 * });
 */
export async function gradeUpdate(params: GradeUpdateRequest): Promise<GradeUpdateResult> {
  const pool = await getPool();

  const result = await pool
    .request()
    .input('idAccount', params.idAccount)
    .input('id', params.id)
    .input('studentName', params.studentName)
    .input('subject', params.subject)
    .input('gradeValue', params.gradeValue)
    .execute('spGradeUpdate');

  return result.recordset[0];
}

/**
 * @summary
 * Soft deletes a grade record.
 *
 * @function gradeDelete
 * @module grade
 *
 * @param {GradeDeleteRequest} params - Grade deletion parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {number} params.id - Grade identifier
 *
 * @returns {Promise<GradeDeleteResult>} Deleted grade identifier
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails
 *
 * @example
 * const result = await gradeDelete({
 *   idAccount: 1,
 *   idUser: 1,
 *   id: 123
 * });
 */
export async function gradeDelete(params: GradeDeleteRequest): Promise<GradeDeleteResult> {
  const pool = await getPool();

  const result = await pool
    .request()
    .input('idAccount', params.idAccount)
    .input('id', params.id)
    .execute('spGradeDelete');

  return result.recordset[0];
}
