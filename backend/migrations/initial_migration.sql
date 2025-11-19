-- =====================================================
-- Database Migration: Initial Schema
-- =====================================================
-- IMPORTANT: Always use [dbo] schema in this file.
-- The migration-runner will automatically replace [dbo] with [project_repositoryname]
-- at runtime based on the PROJECT_ID environment variable.
-- DO NOT hardcode [project_XXX] - always use [dbo]!
-- DO NOT create schema here - migration-runner creates it programmatically.
--
-- NAMING CONVENTION (CRITICAL):
-- Use camelCase for ALL column names to align with JavaScript/TypeScript frontend
-- CORRECT: [userId], [createdAt], [firstName]
-- WRONG: [user_id], [created_at], [first_name]
-- Exception: [id] is always lowercase
-- =====================================================

-- =====================================================
-- TABLES
-- =====================================================

/**
 * @table {grade} Student grade records
 * @multitenancy true
 * @softDelete true
 * @alias grd
 */
CREATE TABLE [dbo].[grade] (
  [id] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [studentName] NVARCHAR(100) NOT NULL,
  [subject] NVARCHAR(100) NOT NULL,
  [gradeValue] NUMERIC(5, 2) NOT NULL,
  [dateCreated] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
  [dateModified] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
  [deleted] BIT NOT NULL DEFAULT (0)
);
GO

/**
 * @primaryKey {pkGrade}
 * @keyType Object
 */
ALTER TABLE [dbo].[grade]
ADD CONSTRAINT [pkGrade] PRIMARY KEY CLUSTERED ([id]);
GO

-- =====================================================
-- INDEXES
-- =====================================================

/**
 * @index {ixGrade_Account} Account isolation index
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixGrade_Account]
ON [dbo].[grade]([idAccount])
WHERE [deleted] = 0;
GO

/**
 * @index {ixGrade_Account_StudentName} Student name search optimization
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixGrade_Account_StudentName]
ON [dbo].[grade]([idAccount], [studentName])
INCLUDE ([subject], [gradeValue], [dateCreated])
WHERE [deleted] = 0;
GO

/**
 * @index {ixGrade_Account_Subject} Subject filtering optimization
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixGrade_Account_Subject]
ON [dbo].[grade]([idAccount], [subject])
INCLUDE ([studentName], [gradeValue], [dateCreated])
WHERE [deleted] = 0;
GO

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

/**
 * @summary
 * Creates a new grade record for a student in a specific subject.
 * Validates required parameters and ensures grade value is within valid range.
 *
 * @procedure spGradeCreate
 * @schema dbo
 * @type stored-procedure
 *
 * @endpoints
 * - POST /api/v1/internal/grade
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {NVARCHAR(100)} studentName
 *   - Required: Yes
 *   - Description: Name of the student
 *
 * @param {NVARCHAR(100)} subject
 *   - Required: Yes
 *   - Description: Subject name
 *
 * @param {NUMERIC(5,2)} gradeValue
 *   - Required: Yes
 *   - Description: Grade value (0.00 to 100.00)
 *
 * @returns {INT} Created grade identifier
 *
 * @testScenarios
 * - Valid creation with all parameters
 * - Validation failure for missing required parameters
 * - Validation failure for invalid grade value range
 */
CREATE OR ALTER PROCEDURE [dbo].[spGradeCreate]
  @idAccount INTEGER,
  @studentName NVARCHAR(100),
  @subject NVARCHAR(100),
  @gradeValue NUMERIC(5, 2)
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Validate required parameter: idAccount
   * @throw {idAccountRequired}
   */
  IF (@idAccount IS NULL)
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  /**
   * @validation Validate required parameter: studentName
   * @throw {studentNameRequired}
   */
  IF (@studentName IS NULL OR LTRIM(RTRIM(@studentName)) = '')
  BEGIN
    ;THROW 51000, 'studentNameRequired', 1;
  END;

  /**
   * @validation Validate required parameter: subject
   * @throw {subjectRequired}
   */
  IF (@subject IS NULL OR LTRIM(RTRIM(@subject)) = '')
  BEGIN
    ;THROW 51000, 'subjectRequired', 1;
  END;

  /**
   * @validation Validate required parameter: gradeValue
   * @throw {gradeValueRequired}
   */
  IF (@gradeValue IS NULL)
  BEGIN
    ;THROW 51000, 'gradeValueRequired', 1;
  END;

  /**
   * @validation Validate grade value range (0.00 to 100.00)
   * @throw {gradeValueMustBeBetweenZeroAndOneHundred}
   */
  IF (@gradeValue < 0 OR @gradeValue > 100)
  BEGIN
    ;THROW 51000, 'gradeValueMustBeBetweenZeroAndOneHundred', 1;
  END;

  BEGIN TRY
    BEGIN TRAN;

      /**
       * @rule {db-grade-create} Insert new grade record
       */
      INSERT INTO [dbo].[grade] (
        [idAccount],
        [studentName],
        [subject],
        [gradeValue],
        [dateCreated],
        [dateModified]
      )
      VALUES (
        @idAccount,
        LTRIM(RTRIM(@studentName)),
        LTRIM(RTRIM(@subject)),
        @gradeValue,
        GETUTCDATE(),
        GETUTCDATE()
      );

      /**
       * @output {GradeCreateResult, 1, 1}
       * @column {INT} id
       * - Description: Created grade identifier
       */
      SELECT SCOPE_IDENTITY() AS [id];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO

/**
 * @summary
 * Retrieves a specific grade record by identifier.
 * Applies account-based filtering for multi-tenancy security.
 *
 * @procedure spGradeGet
 * @schema dbo
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/grade/:id
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} id
 *   - Required: Yes
 *   - Description: Grade identifier
 *
 * @testScenarios
 * - Valid retrieval with existing grade
 * - Validation failure for missing parameters
 * - Empty result for non-existent grade
 * - Security validation for different account access
 */
CREATE OR ALTER PROCEDURE [dbo].[spGradeGet]
  @idAccount INTEGER,
  @id INTEGER
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Validate required parameter: idAccount
   * @throw {idAccountRequired}
   */
  IF (@idAccount IS NULL)
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  /**
   * @validation Validate required parameter: id
   * @throw {idRequired}
   */
  IF (@id IS NULL)
  BEGIN
    ;THROW 51000, 'idRequired', 1;
  END;

  /**
   * @output {GradeDetail, 1, n}
   * @column {INT} id - Grade identifier
   * @column {NVARCHAR(100)} studentName - Student name
   * @column {NVARCHAR(100)} subject - Subject name
   * @column {NUMERIC(5,2)} gradeValue - Grade value
   * @column {DATETIME2} dateCreated - Creation timestamp
   * @column {DATETIME2} dateModified - Last modification timestamp
   */
  SELECT
    [grd].[id],
    [grd].[studentName],
    [grd].[subject],
    [grd].[gradeValue],
    [grd].[dateCreated],
    [grd].[dateModified]
  FROM [dbo].[grade] [grd]
  WHERE [grd].[idAccount] = @idAccount
    AND [grd].[id] = @id
    AND [grd].[deleted] = 0;
END;
GO

/**
 * @summary
 * Lists all grade records for an account with optional filtering.
 * Supports filtering by student name and subject.
 *
 * @procedure spGradeList
 * @schema dbo
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/grade
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {NVARCHAR(100)} studentName
 *   - Required: No
 *   - Description: Optional filter by student name (partial match)
 *
 * @param {NVARCHAR(100)} subject
 *   - Required: No
 *   - Description: Optional filter by subject (partial match)
 *
 * @testScenarios
 * - List all grades without filters
 * - Filter by student name
 * - Filter by subject
 * - Filter by both student name and subject
 * - Empty result for non-matching filters
 */
CREATE OR ALTER PROCEDURE [dbo].[spGradeList]
  @idAccount INTEGER,
  @studentName NVARCHAR(100) = NULL,
  @subject NVARCHAR(100) = NULL
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Validate required parameter: idAccount
   * @throw {idAccountRequired}
   */
  IF (@idAccount IS NULL)
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  /**
   * @output {GradeList, n, n}
   * @column {INT} id - Grade identifier
   * @column {NVARCHAR(100)} studentName - Student name
   * @column {NVARCHAR(100)} subject - Subject name
   * @column {NUMERIC(5,2)} gradeValue - Grade value
   * @column {DATETIME2} dateCreated - Creation timestamp
   * @column {DATETIME2} dateModified - Last modification timestamp
   */
  SELECT
    [grd].[id],
    [grd].[studentName],
    [grd].[subject],
    [grd].[gradeValue],
    [grd].[dateCreated],
    [grd].[dateModified]
  FROM [dbo].[grade] [grd]
  WHERE [grd].[idAccount] = @idAccount
    AND [grd].[deleted] = 0
    AND (@studentName IS NULL OR [grd].[studentName] LIKE '%' + @studentName + '%')
    AND (@subject IS NULL OR [grd].[subject] LIKE '%' + @subject + '%')
  ORDER BY
    [grd].[studentName],
    [grd].[subject],
    [grd].[dateCreated] DESC;
END;
GO

/**
 * @summary
 * Updates an existing grade record.
 * Validates parameters and ensures grade exists before updating.
 *
 * @procedure spGradeUpdate
 * @schema dbo
 * @type stored-procedure
 *
 * @endpoints
 * - PUT /api/v1/internal/grade/:id
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} id
 *   - Required: Yes
 *   - Description: Grade identifier
 *
 * @param {NVARCHAR(100)} studentName
 *   - Required: Yes
 *   - Description: Updated student name
 *
 * @param {NVARCHAR(100)} subject
 *   - Required: Yes
 *   - Description: Updated subject name
 *
 * @param {NUMERIC(5,2)} gradeValue
 *   - Required: Yes
 *   - Description: Updated grade value (0.00 to 100.00)
 *
 * @testScenarios
 * - Valid update with all parameters
 * - Validation failure for missing required parameters
 * - Validation failure for invalid grade value range
 * - Validation failure for non-existent grade
 * - Security validation for different account access
 */
CREATE OR ALTER PROCEDURE [dbo].[spGradeUpdate]
  @idAccount INTEGER,
  @id INTEGER,
  @studentName NVARCHAR(100),
  @subject NVARCHAR(100),
  @gradeValue NUMERIC(5, 2)
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Validate required parameter: idAccount
   * @throw {idAccountRequired}
   */
  IF (@idAccount IS NULL)
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  /**
   * @validation Validate required parameter: id
   * @throw {idRequired}
   */
  IF (@id IS NULL)
  BEGIN
    ;THROW 51000, 'idRequired', 1;
  END;

  /**
   * @validation Validate required parameter: studentName
   * @throw {studentNameRequired}
   */
  IF (@studentName IS NULL OR LTRIM(RTRIM(@studentName)) = '')
  BEGIN
    ;THROW 51000, 'studentNameRequired', 1;
  END;

  /**
   * @validation Validate required parameter: subject
   * @throw {subjectRequired}
   */
  IF (@subject IS NULL OR LTRIM(RTRIM(@subject)) = '')
  BEGIN
    ;THROW 51000, 'subjectRequired', 1;
  END;

  /**
   * @validation Validate required parameter: gradeValue
   * @throw {gradeValueRequired}
   */
  IF (@gradeValue IS NULL)
  BEGIN
    ;THROW 51000, 'gradeValueRequired', 1;
  END;

  /**
   * @validation Validate grade value range (0.00 to 100.00)
   * @throw {gradeValueMustBeBetweenZeroAndOneHundred}
   */
  IF (@gradeValue < 0 OR @gradeValue > 100)
  BEGIN
    ;THROW 51000, 'gradeValueMustBeBetweenZeroAndOneHundred', 1;
  END;

  /**
   * @validation Validate grade exists and belongs to account
   * @throw {gradeNotFound}
   */
  IF NOT EXISTS (
    SELECT *
    FROM [dbo].[grade] [grd]
    WHERE [grd].[id] = @id
      AND [grd].[idAccount] = @idAccount
      AND [grd].[deleted] = 0
  )
  BEGIN
    ;THROW 51000, 'gradeNotFound', 1;
  END;

  BEGIN TRY
    BEGIN TRAN;

      /**
       * @rule {db-grade-update} Update grade record
       */
      UPDATE [dbo].[grade]
      SET
        [studentName] = LTRIM(RTRIM(@studentName)),
        [subject] = LTRIM(RTRIM(@subject)),
        [gradeValue] = @gradeValue,
        [dateModified] = GETUTCDATE()
      WHERE [id] = @id
        AND [idAccount] = @idAccount
        AND [deleted] = 0;

      /**
       * @output {GradeUpdateResult, 1, 1}
       * @column {INT} id
       * - Description: Updated grade identifier
       */
      SELECT @id AS [id];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO

/**
 * @summary
 * Soft deletes a grade record by setting the deleted flag.
 * Validates grade exists before deletion.
 *
 * @procedure spGradeDelete
 * @schema dbo
 * @type stored-procedure
 *
 * @endpoints
 * - DELETE /api/v1/internal/grade/:id
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} id
 *   - Required: Yes
 *   - Description: Grade identifier
 *
 * @testScenarios
 * - Valid deletion of existing grade
 * - Validation failure for missing parameters
 * - Validation failure for non-existent grade
 * - Security validation for different account access
 * - Idempotent deletion (deleting already deleted grade)
 */
CREATE OR ALTER PROCEDURE [dbo].[spGradeDelete]
  @idAccount INTEGER,
  @id INTEGER
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Validate required parameter: idAccount
   * @throw {idAccountRequired}
   */
  IF (@idAccount IS NULL)
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  /**
   * @validation Validate required parameter: id
   * @throw {idRequired}
   */
  IF (@id IS NULL)
  BEGIN
    ;THROW 51000, 'idRequired', 1;
  END;

  /**
   * @validation Validate grade exists and belongs to account
   * @throw {gradeNotFound}
   */
  IF NOT EXISTS (
    SELECT *
    FROM [dbo].[grade] [grd]
    WHERE [grd].[id] = @id
      AND [grd].[idAccount] = @idAccount
      AND [grd].[deleted] = 0
  )
  BEGIN
    ;THROW 51000, 'gradeNotFound', 1;
  END;

  BEGIN TRY
    BEGIN TRAN;

      /**
       * @rule {db-grade-soft-delete} Soft delete grade record
       */
      UPDATE [dbo].[grade]
      SET
        [deleted] = 1,
        [dateModified] = GETUTCDATE()
      WHERE [id] = @id
        AND [idAccount] = @idAccount;

      /**
       * @output {GradeDeleteResult, 1, 1}
       * @column {INT} id
       * - Description: Deleted grade identifier
       */
      SELECT @id AS [id];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO