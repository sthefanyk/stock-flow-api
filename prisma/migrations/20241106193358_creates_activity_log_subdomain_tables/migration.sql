-- CreateTable
CREATE TABLE "action_logs" (
    "id" TEXT NOT NULL,
    "user_who_executed_id" TEXT NOT NULL,
    "use_case_name" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "action_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "action_logs" ADD CONSTRAINT "action_logs_user_who_executed_id_fkey" FOREIGN KEY ("user_who_executed_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action_logs" ADD CONSTRAINT "action_logs_use_case_name_fkey" FOREIGN KEY ("use_case_name") REFERENCES "use_cases"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
