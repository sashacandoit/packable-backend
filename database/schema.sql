CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(25),
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1)
);

CREATE TABLE destination_lists (
    id SERIAL PRIMARY KEY,
    user_id int NOT NULL REFERENCES users ON DELETE CASCADE,
    searched_address TEXT NOT NULL,
    longitude FLOAT NOT NULL,
    latitude FLOAT NOT NULL,
    arrival_date DATE NOT NULL,
    departure_date DATE NOT NULL
);

CREATE TABLE list_items (
    id SERIAL PRIMARY KEY,
    list_id int NOT NULL REFERENCES destination_lists ON DELETE CASCADE,
    category TEXT NOT NULL,
    item TEXT NOT NULL,
    qty int NOT NULL
);

-- ALTER TABLE "Destination_List" ADD CONSTRAINT "fk_Destination_List_user_id" FOREIGN KEY("user_id")
-- REFERENCES "User" ("id");

-- ALTER TABLE "List_Item" ADD CONSTRAINT "fk_List_Item_user_id" FOREIGN KEY("user_id")
-- REFERENCES "User" ("id");

-- ALTER TABLE "List_Item" ADD CONSTRAINT "fk_List_Item_list_id" FOREIGN KEY("list_id")
-- REFERENCES "Destination_List" ("id");

