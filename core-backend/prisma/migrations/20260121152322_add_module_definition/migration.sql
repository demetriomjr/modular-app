-- CreateTable
CREATE TABLE "ModuleDefinition" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "menuLabel" TEXT NOT NULL,
    "remoteEntry" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "exposedModule" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ModuleDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ModuleDefinition_route_key" ON "ModuleDefinition"("route");
