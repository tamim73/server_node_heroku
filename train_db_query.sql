CREATE TABLE employees ( 
id serial PRIMARY KEY,
name VARCHAR(100) NOT NULL,
gender BOOLEAN NOT NULL,
birthday DATE NOT NULL,
depID INT NOT NULL,
isActive BOOLEAN NOT NULL,
salary MONEY NOT NULL,
yrsOfExp SMALLINT,
notes TEXT  
);

CREATE TABLE departments ( 
id serial PRIMARY KEY,
name VARCHAR(100) NOT NULL,
notes TEXT  
);