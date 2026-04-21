-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "phone" VARCHAR(20),
    "role" VARCHAR(20) NOT NULL DEFAULT 'user',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IpGeoloc" (
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

    CONSTRAINT "IpGeoloc_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "IpGeoloc_ip_key" ON "IpGeoloc"("ip");

-- CreateIndex
CREATE INDEX "IpGeoloc_country_code_idx" ON "IpGeoloc"("country_code");

-- CreateIndex
CREATE INDEX "IpGeoloc_city_idx" ON "IpGeoloc"("city");
