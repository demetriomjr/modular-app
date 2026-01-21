-- CreateTable
CREATE TABLE "_ModuleDefinitionToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ModuleDefinitionToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ModuleDefinitionToUser_B_index" ON "_ModuleDefinitionToUser"("B");

-- AddForeignKey
ALTER TABLE "_ModuleDefinitionToUser" ADD CONSTRAINT "_ModuleDefinitionToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "ModuleDefinition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ModuleDefinitionToUser" ADD CONSTRAINT "_ModuleDefinitionToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
