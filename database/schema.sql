CREATE TABLE "User" (
    "id" int   NOT NULL,
    "email" text   NOT NULL,
    "password" password   NOT NULL,
    "first_name" text   NOT NULL,
    "last_name" text   NOT NULL,
    CONSTRAINT "pk_User" PRIMARY KEY (
        "id"
     ),
    CONSTRAINT "uc_User_email" UNIQUE (
        "email"
    )
);

CREATE TABLE "Destination_List" (
    "id" int   NOT NULL,
    "user_id" int   NOT NULL,
    "location" string   NOT NULL,
    "longitude" number   NOT NULL,
    "latitude" number   NOT NULL,
    "arrival_date" date   NOT NULL,
    "departure_date" date   NOT NULL,
    CONSTRAINT "pk_Destination_List" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "List_Item" (
    "id" int   NOT NULL,
    "user_id" int   NOT NULL,
    "list_id" int   NOT NULL,
    "category" string   NOT NULL,
    "item" string   NOT NULL,
    "qty" int   NOT NULL,
    CONSTRAINT "pk_List_Item" PRIMARY KEY (
        "id"
     )
);

ALTER TABLE "Destination_List" ADD CONSTRAINT "fk_Destination_List_user_id" FOREIGN KEY("user_id")
REFERENCES "User" ("id");

ALTER TABLE "List_Item" ADD CONSTRAINT "fk_List_Item_user_id" FOREIGN KEY("user_id")
REFERENCES "User" ("id");

ALTER TABLE "List_Item" ADD CONSTRAINT "fk_List_Item_list_id" FOREIGN KEY("list_id")
REFERENCES "Destination_List" ("id");

