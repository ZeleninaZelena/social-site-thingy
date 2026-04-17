


var connection = mysql.createConnection({
  host     : 'mysqlstudenti.litv.sssvt.cz',
  user     : 'pechopetr',
  password : '123456',
  database : '4a2_pechopetr_db1'
});


import express from 'express'
import cors from 'cors'
import mysql from 'mysql'
import bcrypt from 'bcrypt'


// Login

import { UsersEndpoints } from './usersRoute.js';
import { PostsEndpoints } from './postsRoute.js';
import { CommentsEndpoints } from './commentsRoute.js';
import { LikesEndpoints } from './likesRoute.js';

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


UsersEndpoints(app, connection, bcrypt);

PostsEndpoints(app, connection);

CommentsEndpoints(app, connection);

LikesEndpoints(app, connection);




app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
});

