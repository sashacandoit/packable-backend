CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1)
);

CREATE TABLE destination_lists (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL REFERENCES users ON DELETE CASCADE,
    searched_address TEXT NOT NULL,
    longitude FLOAT,
    latitude FLOAT,
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

-- ALTER TABLE "destination_lists" ADD CONSTRAINT "fk_destination_lists_user" FOREIGN KEY("user")
-- REFERENCES "users" ("username");

-- ALTER TABLE "list_items" ADD CONSTRAINT "fk_list_items_list_id" FOREIGN KEY("list_id")
-- REFERENCES "destination_lists" ("id");

