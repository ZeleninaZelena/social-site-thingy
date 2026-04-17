

export function CommentsEndpoints(app, connection) {

    app.get('/posts/comments/:postId', (request, response) => {

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

app.get('/users/comments/:userId', (request, response) => {

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
}