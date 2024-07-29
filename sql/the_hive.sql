CREATE TABLE Feedback(
	name VARCHAR(24) NOT NULL,
	mail VARCHAR(20) NOT NULL,
	message VARCHAR(200) NOT NULL
);

CREATE TABLE Users(
	user_id SERIAL PRIMARY KEY NOT NULL,
	mail VARCHAR(40) UNIQUE NOT NULL,
	username VARCHAR(20) NOT NULL,
	pswd VARCHAR NOT NULL
);

CREATE TABLE lists(
	list_id SERIAL PRIMARY KEY NOT NULL,
	list_name VARCHAR(20) NOT NULL,
	user_id INT NOT NULL,
	FOREIGN KEY(user_id) REFERENCES users(user_id)
);

CREATE TABLE tasks(
	task_id SERIAL PRIMARY KEY NOT NULL,
	task_name VARCHAR(30) NOT NULL,
	user_id INT NOT NULL,
	list_id	INT NOT NULL,
	task_info VARCHAR,
	due_date DATE,
	FOREIGN KEY(user_id) REFERENCES users(user_id),
	FOREIGN KEY(list_id) REFERENCES lists(list_id)
);