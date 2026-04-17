
export function PostsEndpoints(app, connection) {

    app.get('/posts', (request, response) => {

  connection.query('SELECT * FROM `Posts` ORDER BY CreatedAt DESC', (err, results) => {
    if (err) {
      console.error(err);
      return response.status(500).send("Database error");
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

      response.status(200).json(results);
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


}