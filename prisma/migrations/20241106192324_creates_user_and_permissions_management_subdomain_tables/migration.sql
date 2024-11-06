-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "role_name" TEXT NOT NULL,
    "user_group_name" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "name" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "use_cases" (
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "use_cases_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "subdomains" (
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "subdomains_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "permissions" (
    "subdomain_name" TEXT NOT NULL,
    "use_case_name" TEXT NOT NULL,
    "access_level" TEXT NOT NULL,
    "user_group_name" TEXT
);

-- CreateTable
CREATE TABLE "user_groups" (
    "name" TEXT NOT NULL,

    CONSTRAINT "user_groups_pkey" PRIMARY KEY ("name")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_subdomain_name_use_case_name_key" ON "permissions"("subdomain_name", "use_case_name");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_name_fkey" FOREIGN KEY ("role_name") REFERENCES "roles"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_user_group_name_fkey" FOREIGN KEY ("user_group_name") REFERENCES "user_groups"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_subdomain_name_fkey" FOREIGN KEY ("subdomain_name") REFERENCES "subdomains"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_use_case_name_fkey" FOREIGN KEY ("use_case_name") REFERENCES "use_cases"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_user_group_name_fkey" FOREIGN KEY ("user_group_name") REFERENCES "user_groups"("name") ON DELETE SET NULL ON UPDATE CASCADE;
