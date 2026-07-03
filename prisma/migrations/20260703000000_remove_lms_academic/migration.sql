-- Remove LMS / Akademik module
-- Drop child tables first to respect foreign key constraints

-- DropTable
DROP TABLE IF EXISTS "student_answers";

-- DropTable
DROP TABLE IF EXISTS "question_options";

-- DropTable
DROP TABLE IF EXISTS "questions";

-- DropTable
DROP TABLE IF EXISTS "exam_submissions";

-- DropTable
DROP TABLE IF EXISTS "exams";

-- DropTable
DROP TABLE IF EXISTS "session_attendances";

-- DropTable
DROP TABLE IF EXISTS "module_sessions";

-- DropTable
DROP TABLE IF EXISTS "program_enrollments";

-- DropTable
DROP TABLE IF EXISTS "modules";

-- DropTable
DROP TABLE IF EXISTS "programs";

-- DropTable
DROP TABLE IF EXISTS "student_profiles";

-- DropTable
DROP TABLE IF EXISTS "lecture_profiles";

-- DropEnum
DROP TYPE IF EXISTS "QuestionType";

-- DropEnum
DROP TYPE IF EXISTS "ExamStatus";

-- DropEnum
DROP TYPE IF EXISTS "EnrollmentStatus";

-- DropEnum
DROP TYPE IF EXISTS "ModuleStatus";

-- DropEnum
DROP TYPE IF EXISTS "ProgramLevel";
