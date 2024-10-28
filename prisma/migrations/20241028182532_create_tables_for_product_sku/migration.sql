-- CreateTable
CREATE TABLE "categories" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "brands" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "types" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "types_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "sizes" (
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type_code" TEXT NOT NULL,
    "unit_of_measure" TEXT NOT NULL,

    CONSTRAINT "sizes_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "colors" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "colors_pkey" PRIMARY KEY ("code")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_code_key" ON "categories"("code");

-- CreateIndex
CREATE UNIQUE INDEX "brands_code_key" ON "brands"("code");

-- CreateIndex
CREATE UNIQUE INDEX "types_code_key" ON "types"("code");

-- CreateIndex
CREATE UNIQUE INDEX "sizes_code_key" ON "sizes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "colors_code_key" ON "colors"("code");

-- AddForeignKey
ALTER TABLE "sizes" ADD CONSTRAINT "sizes_type_code_fkey" FOREIGN KEY ("type_code") REFERENCES "types"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
