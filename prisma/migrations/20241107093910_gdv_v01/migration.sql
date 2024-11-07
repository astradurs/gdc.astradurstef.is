-- CreateTable
CREATE TABLE "gdcwaitlist" (
    "email" VARCHAR(100) NOT NULL,
    "isodate" VARCHAR(100) NOT NULL,
    "createtime" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "restaurantid" TEXT,

    CONSTRAINT "gdcwaitlist_pkey" PRIMARY KEY ("isodate","email")
);

-- CreateTable
CREATE TABLE "restaurants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "createtime" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatetime" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "googlemapsurl" TEXT,
    "websiteurl" TEXT,

    CONSTRAINT "restaurants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "votes" (
    "email" VARCHAR(100) NOT NULL,
    "restaurantid" TEXT NOT NULL,
    "vote" BOOLEAN NOT NULL,
    "createtime" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "votes_pkey" PRIMARY KEY ("email","restaurantid")
);

-- CreateTable
CREATE TABLE "user" (
    "email" TEXT NOT NULL,
    "firstname" TEXT,
    "lastname" TEXT,
    "imageurl" TEXT,
    "createtime" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatetime" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("email")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "gdcwaitlist" ADD CONSTRAINT "gdcwaitlist_email_fkey" FOREIGN KEY ("email") REFERENCES "user"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gdcwaitlist" ADD CONSTRAINT "gdcwaitlist_restaurantid_fkey" FOREIGN KEY ("restaurantid") REFERENCES "restaurants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_email_fkey" FOREIGN KEY ("email") REFERENCES "user"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_restaurantid_fkey" FOREIGN KEY ("restaurantid") REFERENCES "restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
