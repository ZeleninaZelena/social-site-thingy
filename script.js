
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
  
    connection.query('SELECT * FROM `Users` ORDER by Surname', (err, results) => {
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
  if(newUser.Age < 13){
    return response.status(400).send("You must be older that 13 to create an account.")
  }

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
      return response.status(500).send("Database error");
    }

    response.status(201).send("User created");
  });

});

app.get('/posts', (request, response) => {

  connection.query('SELECT * FROM `Posts` ORDER BY CreatedAt DESC', (err, results) => {
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

app.get('/posts/:authorId', (request, response) => {

  const userId = request.params.authorId;

  connection.query(
    'SELECT * FROM Posts WHERE AuthorId = ?',
    [userId],
    (err, results) => {
      if (err) {
        console.error(err);
        return response.status(500).send("Database error");
      }

      response.status(200).json(results[0]);
    }
  );
});

app.post('/posts', (request, response) => {

  const newPost = request.body
  

  const sql = `INSERT INTO Posts (AuthorId, Title, Content) VALUES (?,?,?)`;

  const values = [
    newPost.AuthorId,
    newPost.Title,
    newPost.Content
    
  ];

  connection.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      return response.status(500).send("Database error");
    }

    response.status(201).send("Post created");
  });
});

app.delete('/posts/:id', (request, response) => {

  const postId = request.params.id;

  connection.query(
    'DELETE FROM Posts WHERE Id = ?',
    [postId],
    (err, results) => {
      if (err) {
        console.error(err);
        return response.status(500).send("Database error");
      }

      response.status(200).send("Post deleted");
    }
  );


});

app.get('/postComments/:postId', (request, response) => {

  const postId = request.params.postId;

  connection.query(
    'SELECT * FROM Comments WHERE PostId = ?',
    [postId],
    (err, results) => {
      if (err) {
        console.error(err);
        return response.status(500).send("Database error");
      }

      response.status(200).json(results);
    }
  );

});

app.get('/userComments/:userId', (request, response) => {

  const userId = request.params.userId;

  connection.query(
    'SELECT * FROM Comments WHERE AuthorId = ?',
    [userId],
    (err, results) => {
      if (err) {
        console.error(err);
        return response.status(500).send("Database error");
      }

      response.status(200).json(results);
    }
  );

});


app.post('/comments', (request, response) => {

  const newComment = request.body
  

  const sql = `INSERT INTO Comments(AuthorId, PostId, Content) VALUES (?,?,?)`;

  const values = [
    newComment.AuthorId,
    newComment.PostId,
    newComment.Content
    
  ];

  connection.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      return response.status(500).send("Database error");
    }

    response.status(201).send("Post created");
  });


});

app.delete('/comments/:id', (request, response) => {
  

  const commentId = request.params.id;

  connection.query(
    'DELETE FROM Comments WHERE Id = ?',
    [commentId],
    (err, results) => {
      if (err) {
        console.error(err);
        return response.status(500).send("Database error");
      }

      response.status(200).send("Comment deleted");
    }
  );


});


app.get('/likes/:postId', (request, response) =>{

const PostId = request.params.postId;

  connection.query(
    'SELECT * FROM Likes WHERE PostId = ?',
    [postId],
    (err, results) => {
      if (err) {
        console.error(err);
        return response.status(500).send("Database error");
      }

      response.status(200).json(results);
    }
  );


});

app.post('/likes', (request, response) => {

  const newLike = request.body
  

  const sql = `INSERT INTO Likes(UserId, PostId) VALUES (?,?)`;

  const values = [
    newLike.UserId,
    newLike.PostId
    
  ];

  connection.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      return response.status(500).send("Database error");
    }

    response.status(201).send("Like created");
  });


})


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
});

