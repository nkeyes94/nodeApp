DROP DATABASE IF EXISTS natemart_db;
CREATE DATABASE natemart_db;

USE natemart_db;

CREATE TABLE listings(
	id INT NOT NULL AUTO_INCREMENT,
    item_name VARCHAR(100) NOT NULL,
    amount INT NOT NULL,
    price INT NOT NULL,
    PRIMARY KEY(id)
);