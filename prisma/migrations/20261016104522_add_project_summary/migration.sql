-- CreateTable
CREATE TABLE "ProjectSummary" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalEvaluators" INTEGER NOT NULL,
    "completedCount" INTEGER NOT NULL,
    "avgTotalScore" DOUBLE PRECISION NOT NULL,
    "trustPercent" DOUBLE PRECISION NOT NULL,
    "classification" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectSummary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectSummary_projectId_userId_key" ON "ProjectSummary"("projectId", "userId");

-- AddForeignKey
ALTER TABLE "ProjectSummary" ADD CONSTRAINT "ProjectSummary_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectSummary" ADD CONSTRAINT "ProjectSummary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
