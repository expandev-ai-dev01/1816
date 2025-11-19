/**
 * @summary
 * Grade management API controller.
 * Handles HTTP requests for grade CRUD operations.
 *
 * @module api/v1/internal/grade/controller
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import { gradeCreate, gradeGet, gradeList, gradeUpdate, gradeDelete } from '@/services/grade';
import type {
  GradeCreateRequest,
  GradeUpdateRequest,
  GradeListRequest,
} from '@/services/grade/gradeTypes';

const securable = 'GRADE';

/**
 * @api {post} /api/v1/internal/grade Create Grade
 * @apiName CreateGrade
 * @apiGroup Grade
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new grade record for a student
 *
 * @apiParam {String} studentName Student name (3-100 characters)
 * @apiParam {String} subject Subject name (2-100 characters)
 * @apiParam {Number} gradeValue Grade value (0.00-100.00)
 *
 * @apiSuccess {Number} id Grade identifier
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} ServerError Internal server error
 */
export async function createHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'CREATE' }]);

  const bodySchema = z.object({
    studentName: z.string().min(3).max(100),
    subject: z.string().min(2).max(100),
    gradeValue: z.coerce.number().min(0).max(100),
  });

  const [validated, error] = await operation.create(req, bodySchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = validated.params as GradeCreateRequest;
    const result = await gradeCreate({
      ...validated.credential,
      ...data,
    });

    res.json(successResponse(result));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

/**
 * @api {get} /api/v1/internal/grade/:id Get Grade
 * @apiName GetGrade
 * @apiGroup Grade
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves a specific grade record
 *
 * @apiParam {Number} id Grade identifier
 *
 * @apiSuccess {Number} id Grade identifier
 * @apiSuccess {String} studentName Student name
 * @apiSuccess {String} subject Subject name
 * @apiSuccess {Number} gradeValue Grade value
 * @apiSuccess {Date} dateCreated Creation timestamp
 * @apiSuccess {Date} dateModified Last modification timestamp
 *
 * @apiError {String} NotFound Grade not found
 * @apiError {String} ServerError Internal server error
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const paramsSchema = z.object({
    id: z.coerce.number().int().positive(),
  });

  const [validated, error] = await operation.read(req, paramsSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await gradeGet({
      ...validated.credential,
      ...validated.params,
    });

    if (!data) {
      res.status(404).json(errorResponse('gradeNotFound'));
      return;
    }

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

/**
 * @api {get} /api/v1/internal/grade List Grades
 * @apiName ListGrades
 * @apiGroup Grade
 * @apiVersion 1.0.0
 *
 * @apiDescription Lists all grades with optional filtering
 *
 * @apiParam {String} [studentName] Filter by student name (partial match)
 * @apiParam {String} [subject] Filter by subject (partial match)
 *
 * @apiSuccess {Array} data Array of grade records
 *
 * @apiError {String} ServerError Internal server error
 */
export async function listHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const querySchema = z.object({
    studentName: z.string().min(3).optional(),
    subject: z.string().min(2).optional(),
  });

  const [validated, error] = await operation.list(req, querySchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = validated.params as GradeListRequest;
    const result = await gradeList({
      ...validated.credential,
      ...data,
    });

    res.json(successResponse(result));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

/**
 * @api {put} /api/v1/internal/grade/:id Update Grade
 * @apiName UpdateGrade
 * @apiGroup Grade
 * @apiVersion 1.0.0
 *
 * @apiDescription Updates an existing grade record
 *
 * @apiParam {Number} id Grade identifier
 * @apiParam {String} studentName Student name (3-100 characters)
 * @apiParam {String} subject Subject name (2-100 characters)
 * @apiParam {Number} gradeValue Grade value (0.00-100.00)
 *
 * @apiSuccess {Number} id Updated grade identifier
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} NotFound Grade not found
 * @apiError {String} ServerError Internal server error
 */
export async function updateHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'UPDATE' }]);

  const paramsSchema = z.object({
    id: z.coerce.number().int().positive(),
  });

  const bodySchema = z.object({
    studentName: z.string().min(3).max(100),
    subject: z.string().min(2).max(100),
    gradeValue: z.coerce.number().min(0).max(100),
  });

  const [validated, error] = await operation.update(req, paramsSchema, bodySchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = validated.params as GradeUpdateRequest;
    const result = await gradeUpdate({
      ...validated.credential,
      ...data,
    });

    res.json(successResponse(result));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

/**
 * @api {delete} /api/v1/internal/grade/:id Delete Grade
 * @apiName DeleteGrade
 * @apiGroup Grade
 * @apiVersion 1.0.0
 *
 * @apiDescription Soft deletes a grade record
 *
 * @apiParam {Number} id Grade identifier
 *
 * @apiSuccess {Number} id Deleted grade identifier
 *
 * @apiError {String} NotFound Grade not found
 * @apiError {String} ServerError Internal server error
 */
export async function deleteHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'DELETE' }]);

  const paramsSchema = z.object({
    id: z.coerce.number().int().positive(),
  });

  const [validated, error] = await operation.delete(req, paramsSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const result = await gradeDelete({
      ...validated.credential,
      ...validated.params,
    });

    res.json(successResponse(result));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}
