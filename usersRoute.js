


export async function UsersEndpoints(app, connection, bcrypt) {

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

app.post('/users/register', async (request, response) => {


  

  const newUser = request.body
  if(newUser.Age < 13){
    return response.status(400).send("You must be older that 13 to create an account.")
  };


  const saltRounds = 10;
  const plainPassword = newUser.LoginPassword;
  
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

  const sql = `INSERT INTO Users (Name, Surname, Age, Gender, ProfilePicture, LoginName, LoginPassword) VALUES (?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    newUser.Name,
    newUser.Surname,
    newUser.Age,
    newUser.Gender,
    newUser.ProfilePicture || null,
    newUser.LoginName,
    hashedPassword
  ];

  connection.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      return response.status(500).send("Database error");
    }

    response.status(201).send("User created");
  });

});

app.post('/users/login', async (request, response) => {

  const { username, password} = request.body

  const sql = 'SELECT * FROM Users WHERE LoginName = ?'
  
  connection.query(sql, [username], async (err, results) => {
    if(err) {
      console.error(err);
      return response.status(500).send("Database error");

    }
    if(results.length === 0){
      return response.status(404).send("User not found");
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.LoginPassword);

    if (!match) return response.status(400).send("Wrong password");

    response.send(user)

    

  })

});


}



