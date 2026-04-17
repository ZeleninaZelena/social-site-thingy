

export function LikesEndpoints(app, connection) {

    app.get('/likes/:postId', (request, response) =>{

const PostId = request.params.postId;

  connection.query(
    'SELECT * FROM Likes WHERE PostId = ?',
    [PostId],
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
}