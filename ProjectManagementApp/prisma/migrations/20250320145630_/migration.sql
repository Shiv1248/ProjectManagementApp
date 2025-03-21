-- AlterTable
CREATE SEQUENCE account_id_seq;
ALTER TABLE "Account" ALTER COLUMN "id" SET DEFAULT nextval('account_id_seq');
ALTER SEQUENCE account_id_seq OWNED BY "Account"."id";

-- AlterTable
CREATE SEQUENCE project_id_seq;
ALTER TABLE "Project" ALTER COLUMN "id" SET DEFAULT nextval('project_id_seq');
ALTER SEQUENCE project_id_seq OWNED BY "Project"."id";

-- AlterTable
CREATE SEQUENCE session_id_seq;
ALTER TABLE "Session" ALTER COLUMN "id" SET DEFAULT nextval('session_id_seq');
ALTER SEQUENCE session_id_seq OWNED BY "Session"."id";

-- AlterTable
CREATE SEQUENCE task_id_seq;
ALTER TABLE "Task" ALTER COLUMN "id" SET DEFAULT nextval('task_id_seq');
ALTER SEQUENCE task_id_seq OWNED BY "Task"."id";

-- AlterTable
CREATE SEQUENCE user_id_seq;
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT nextval('user_id_seq');
ALTER SEQUENCE user_id_seq OWNED BY "User"."id";

-- AlterTable
CREATE SEQUENCE userproject_id_seq;
ALTER TABLE "UserProject" ALTER COLUMN "id" SET DEFAULT nextval('userproject_id_seq');
ALTER SEQUENCE userproject_id_seq OWNED BY "UserProject"."id";

-- AlterTable
CREATE SEQUENCE verificationtoken_identifier_seq;
ALTER TABLE "VerificationToken" ALTER COLUMN "identifier" SET DEFAULT nextval('verificationtoken_identifier_seq'),
ADD CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier");
ALTER SEQUENCE verificationtoken_identifier_seq OWNED BY "VerificationToken"."identifier";
