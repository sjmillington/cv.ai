-- CreateTable
CREATE TABLE "PersonalEntry" (
    "id" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PersonalEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PersonalEntry_userId_key" ON "PersonalEntry"("userId");

-- AddForeignKey
ALTER TABLE "PersonalEntry" ADD CONSTRAINT "PersonalEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
