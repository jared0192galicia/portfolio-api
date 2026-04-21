/*
  Warnings:

  - You are about to drop the `IpGeoloc` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "IpGeoloc";

-- CreateTable
CREATE TABLE "visit" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" TEXT NOT NULL,
    "network" TEXT,
    "version" TEXT,
    "asn" TEXT,
    "org" TEXT,
    "city" TEXT,
    "region" TEXT,
    "region_code" TEXT,
    "postal" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "timezone" TEXT,
    "utc_offset" TEXT,
    "country" TEXT,
    "country_name" TEXT,
    "country_code" TEXT,
    "country_code_iso3" TEXT,
    "country_capital" TEXT,
    "country_tld" TEXT,
    "continent_code" TEXT,
    "in_eu" BOOLEAN NOT NULL DEFAULT false,
    "country_calling_code" TEXT,
    "currency" TEXT,
    "currency_name" TEXT,
    "languages" TEXT,
    "country_area" DOUBLE PRECISION,
    "country_population" BIGINT,

    CONSTRAINT "visit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "visit_country_code_idx" ON "visit"("country_code");

-- CreateIndex
CREATE INDEX "visit_city_idx" ON "visit"("city");
