-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'STAFF');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STAFF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvaluationMap" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "evaluatorId" TEXT NOT NULL,
    "evaluateeId" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EvaluationMap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveyResponse" (
    "id" TEXT NOT NULL,
    "evaluationMapId" TEXT NOT NULL,
    "scores" JSONB NOT NULL,
    "avgTotalScore" DOUBLE PRECISION NOT NULL,
    "trustPercent" DOUBLE PRECISION NOT NULL,
    "classification" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SurveyResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EvaluationMap_token_key" ON "EvaluationMap"("token");

-- CreateIndex
CREATE UNIQUE INDEX "EvaluationMap_projectId_evaluatorId_evaluateeId_key" ON "EvaluationMap"("projectId", "evaluatorId", "evaluateeId");

-- CreateIndex
CREATE UNIQUE INDEX "SurveyResponse_evaluationMapId_key" ON "SurveyResponse"("evaluationMapId");

-- AddForeignKey
ALTER TABLE "EvaluationMap" ADD CONSTRAINT "EvaluationMap_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationMap" ADD CONSTRAINT "EvaluationMap_evaluatorId_fkey" FOREIGN KEY ("evaluatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationMap" ADD CONSTRAINT "EvaluationMap_evaluateeId_fkey" FOREIGN KEY ("evaluateeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyResponse" ADD CONSTRAINT "SurveyResponse_evaluationMapId_fkey" FOREIGN KEY ("evaluationMapId") REFERENCES "EvaluationMap"("id") ON DELETE CASCADE ON UPDATE CASCADE;
