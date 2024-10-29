-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "use_cases" (
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "use_cases_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "rules" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "useCaseId" TEXT NOT NULL,

    CONSTRAINT "rules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "rules_roleId_useCaseId_key" ON "rules"("roleId", "useCaseId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rules" ADD CONSTRAINT "rules_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rules" ADD CONSTRAINT "rules_useCaseId_fkey" FOREIGN KEY ("useCaseId") REFERENCES "use_cases"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
