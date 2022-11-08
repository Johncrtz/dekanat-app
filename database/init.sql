-- begin project-management schema
CREATE TABLE users(
    _id SERIAL PRIMARY KEY,
    email TEXT,
    password TEXT
);

CREATE TABLE projects(
    _id SERIAL PRIMARY KEY,
    "projectName" TEXT,
    "ownerId" INTEGER,
    FOREIGN KEY("ownerId") REFERENCES users(_id)
);

CREATE TABLE userprojects(
    _id SERIAL PRIMARY KEY,
    "userId" INTEGER,
    "projectId" INTEGER,
    FOREIGN KEY("userId") REFERENCES users(_id),
    FOREIGN KEY("projectId") REFERENCES projects(_id)
);

CREATE TABLE tables(
    _id SERIAL PRIMARY KEY,
    key TEXT NOT NULL,
    name TEXT,
    "ownerId" INTEGER,
    FOREIGN KEY("ownerId") REFERENCES users(_id)
);

CREATE TABLE projecttables(
    _id SERIAL PRIMARY KEY,
    "projectId" INTEGER,
    "tableId" INTEGER,
    FOREIGN KEY("projectId") REFERENCES projects(_id),
    FOREIGN KEY("tableId") REFERENCES tables(_id)
);

CREATE TABLE columns(
    _id SERIAL PRIMARY KEY,
    "columnName" TEXT,
    "tableId" INTEGER,
    type TEXT default 'string' NOT NULL,
    FOREIGN KEY("tableId") REFERENCES tables(_id)
);
-- end project-management schema

-- begin lazy-views schema
CREATE TABLE views(
    _id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    base_id INTEGER NOT NULL,
    base_type INTEGER NOT NULL,
    user_id INTEGER NULL,
    row_options TEXT NOT NULL
);

CREATE TABLE view_joins(
    _id SERIAL PRIMARY KEY,
    view_id INTEGER NOT NULL,
    base_id INTEGER NOT NULL,
    base_type INTEGER NOT NULL,
    "on" TEXT NOT NULL
);

CREATE TABLE view_columns(
    _id SERIAL PRIMARY KEY,
    view_id INTEGER NOT NULL,
    join_id INTEGER NULL,
    -- parent column whose data this column inherits
    column_id INTEGER NOT NULL,
    function TEXT NULL,
    -- custom metadata, see types/rdg.ts for explanations on them
    -- userPrimary: a designated column that is shown to the user as a sort of primary key,
    -- for example to create short previews of records.
    "userPrimary" INTEGER DEFAULT 0 NOT NULL,
    -- kinds of columns: plain data (text, date, ...), link to other table, lookup field, ...
    _kind TEXT NOT NULL DEFAULT 'standard',
    -- type of the content of a column
    "_cellContentType" TEXT NOT NULL,
    "displayName" TEXT NULL,
    -- various RDG props
    "__columnIndex__" INTEGER NULL,
    editable INTEGER DEFAULT 1,
    editor TEXT NULL,
    formatter TEXT NUll,
    width VARCHAR(32) NULL,
    "minWidth" VARCHAR(32) NULL,
    "maxWidth" VARCHAR(32) NULL,
    "cellClass" VARCHAR(255) NULL,
    "headerCellClass" VARCHAR(255) NULL,
    "summaryCellClass" VARCHAR(255) NULL,
    "summaryFormatter" VARCHAR(255) NULL,
    "groupFormatter" VARCHAR(255) NULL,
    "colSpan" VARCHAR(255) NULL,
    frozen INTEGER NULL,
    resizable INTEGER NULL,
    sortable INTEGER NULL,
    "sortDescendingFirst" INTEGER NULL,
    "headerRenderer" VARCHAR(255) NULL
);
-- end lazy-views schema
