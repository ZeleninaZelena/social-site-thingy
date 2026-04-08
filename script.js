
var connection = mysql.createConnection({
  host     : 'mysqlstudenti.litv.sssvt.cz',
  user     : 'pechopetr',
  password : '123456',
  database : '4a2_pechopetr_db1'
});


import express from 'express'
import cors from 'cors'
import mysql from 'mysql'

const app = express();
const PORT = 666;




app.use(express.json());
app.use(cors({

    origin: "http://127.0.0.1:5500",
    methods: ['GET', 'POST']
    }
));

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('connected as id ' + connection.threadId);
});

app.get('/users', (request, response) => {
  
    connection.query('SELECT * FROM Users', (err, results) => {
    if (err) {
      console.error(err);
      return response.status(500).send("Database error");
    }

    if (results.length === 0) {
      return response.status(404).send("User not found");
    }

    response.status(200).json(results);
  });
  
});

app.get('/users/:id', (request, response) => {

  const userId = request.params.id;

  connection.query(
    'SELECT * FROM Users WHERE Id = ?',
    [userId],
    (err, results) => {
      if (err) {
        console.error(err);
        return response.status(500).send("Database error");
      }

      if (results.length === 0) {
        return response.status(404).send("User not found");
      }

      response.status(200).json(results[0]);
    }
  );

});

app.post('/users', (request, response) => {

  const newUser = request.body

  const sql = `
    INSERT INTO Users 
      (Name, Surname, Age, Gender, ProfilePicture, LoginName, LoginPassword)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    newUser.Name,
    newUser.Surname,
    newUser.Age,
    newUser.Gender,
    newUser.ProfilePicture || null,
    newUser.LoginName,
    newUser.LoginPassword
  ];

  connection.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Database error");
    }

    response.status(201).send("User created");
  });

});


    

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
});

