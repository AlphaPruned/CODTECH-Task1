import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
import env from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
const saltRounds = 10;
env.config();

app.use(
  session({
    secret: process.env.SECRET_WORD,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 10 , /*for 10 min*/
      }
  })
);

app.use(express.static("public"));
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true}));
app.use(passport.initialize());
app.use(passport.session());
app.set("view engine", "ejs")

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

db.connect().then(() => {
    console.log("Connected to PostgreSQL");
})
.catch((err) => {
    console.log("Connection Error",err);
})

app.get("/",(req,res) => {
    if(req.isAuthenticated()){
        console.log("You still logged In");
        res.redirect("/user/home");
    } else{
        res.render("index.ejs");
    }
    // res.render("index.ejs");
    console.log("Home Loaded");
});

app.get("/login",(req,res) => {
    res.sendFile(__dirname + "/login.html");
})

app.get("/login.js",(req,res) => {
    res.sendFile(__dirname + "/js/login.js");
})

app.get("/register.js",(req,res) => {
    res.sendFile(__dirname + "/js/register.js");
})

app.get("/register",(req,res) => {
    res.sendFile(__dirname + "/register.html");
})

app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.get("/user/home", async (req, res) => {
  console.log(req.user);
  if (req.isAuthenticated()) {
    try {
      const taskQuery = await db.query(
        "SELECT task_id, task_name, task_info, lists.list_name, lists.list_id, due_date, status FROM tasks JOIN lists ON tasks.list_id = lists.list_id WHERE tasks.user_id = $1 ORDER BY due_date ASC LIMIT 5",
        [req.user.user_id]
      );
      
      const listQuery = await db.query(
        "SELECT list_id, list_name FROM lists WHERE user_id = $1",
        [req.user.user_id]
      );

      const tasks = taskQuery.rows;
      const lists = listQuery.rows;
      const usrnm = req.user.username;
      
      res.render("home.ejs", { tasks, lists, usrnm });
    } catch (err) {
      console.log(err);
      res.send("Error fetching tasks or lists");
    }
  } else {
    res.redirect("/login");
  }
});

app.get("/user/all_tasks", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const taskQuery = await db.query(
        "SELECT task_id, task_name, task_info, lists.list_name, lists.list_id, due_date, status FROM tasks JOIN lists ON tasks.list_id = lists.list_id WHERE tasks.user_id = $1 ORDER BY due_date ASC",
        [req.user.user_id]
      );
      
      const listQuery = await db.query(
        "SELECT list_id, list_name FROM lists WHERE user_id = $1",
        [req.user.user_id]
      );

      const tasks = taskQuery.rows;
      const lists = listQuery.rows;
      const usrnm = req.user.username;
      
      res.render("alltask.ejs", { tasks, lists, usrnm });
    } catch (err) {
      console.log(err);
      res.send("Error fetching tasks or lists");
    }
  } else {
    res.redirect("/login");
  }
});

app.get("/user/my_list", async (req,res) => {
  if(req.isAuthenticated()){
    try {
      const taskQuery = await db.query(
        "SELECT task_id, task_name, task_info, lists.list_name, lists.list_id, due_date, status FROM tasks JOIN lists ON tasks.list_id = lists.list_id WHERE tasks.user_id = $1 ORDER BY due_date ASC",
        [req.user.user_id]
      );
      
      const listQuery = await db.query(
        "SELECT list_id, list_name FROM lists WHERE user_id = $1",
        [req.user.user_id]
      );

      const tasks = taskQuery.rows;
      const lists = listQuery.rows;
      const usrnm = req.user.username;
      
      res.render("mylists.ejs", { tasks, lists, usrnm });
    } catch (err) {
      console.log(err);
      res.send("Error fetching tasks or lists");
    }
  } else {
    res.redirect("/");
  }
})

app.get("/user/add_task", async (req,res) => {
  if (req.isAuthenticated()) {
    // res.sendFile(__dirname + "/home.html");
    try {
      const listNames = await db.query("SELECT list_name,list_id FROM lists WHERE user_id = $1", [req.user.user_id]);
      if (listNames.rows.length > 0) {
        const types = listNames.rows;
        const usrnm = req.user.username;
        console.log(types);
        res.render("addtask.ejs", { types: types, usrnm });
      } else {
        res.render("addtask.ejs", { types: [{list_name: 'None'}], usrnm });
      }
    } catch (err) {
      console.log(err);
      res.render("addtask.ejs", { types: [{list_name: 'None'}], usrnm });
    }
  } else {
    res.redirect("/login");
  }
})

app.get("/user/create_list", (req,res) => {
  if(req.isAuthenticated()){
    const usrnm = req.user.username;
    res.render("createlist.ejs",{usrnm})
  } else {
    res.redirect("/login");
  }
})

app.get("/user/profile", async (req,res) => {
  if(req.isAuthenticated()){
    try {
      const credQuery = await db.query("SELECT mail,username FROM users WHERE user_id=$1",[req.user.user_id]);

      if(credQuery.rows.length > 0){
        const credRow = credQuery.rows[0];
        const usrnm = req.user.username;
        console.log("Credentials:", credRow," ",credRow.mail," ",credRow.username);
        res.render("profile.ejs", { 'mail': credRow.mail , 'usrnm': credRow.username, usrnm});
      } else {
        res.send("Error finding credentials");
      }
    } catch (err) {
      console.log(err)
    }
    // res.render("profile.ejs");
  } else{
    res.redirect("/login");
  }
})

app.post("/login", (req, res, next) => {
  console.log("Login route reached");
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.log(req.body);
      console.error("Authentication error:", err);
      return next(err);
    }
    if (!user) {
      console.log(req.body);
      console.log("Authentication failed:", info.message);
      return res.redirect("/login");
    }
    req.login(user, (err) => {
      if (err) {
        console.error("Login error:", err);
        return next(err);
      }
      console.log("Login successful");
      return res.redirect("/user/home");
    });
  })(req, res, next);
});

app.post("/register",async (req,res) => {
    const reqMail = req.body.mail;
    const regUsername = req.body.username;
    const regPasssword = req.body.password;

    console.log("tryna register");
    console.log(req.body);

    try {
      const checkResult = await db.query("SELECT * FROM users WHERE mail = $1", [
        reqMail,
      ]);
  
      if (checkResult.rows.length > 0) {
        req.redirect("/login");
      } else {
        bcrypt.hash(regPasssword, saltRounds, async (err, hash) => {
          if (err) {
            console.error("Error hashing password:", err);
          } else {
            const result = await db.query(
              "INSERT INTO users (mail, username, pswd) VALUES ($1, $2, $3) RETURNING *",
              [reqMail, regUsername, hash]
            );

            const user = result.rows[0];
            const id_val = user.user_id;
            const setup = await db.query(
              "INSERT INTO lists (list_name,user_id) VALUES ($1, $2)",
              ['None',id_val]
            );
            req.login(user, (err) => {
              console.log("success");
              res.redirect("/");
            });
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
})

app.post("/user/add_task",async (req,res) => {
  // console.log("addede");

  console.log(req.body);
  // console.log("newer");
  // console.log(req.user);

  // try {
  //   const credQuery = await db.query("SELECT list_id FROM lists WHERE list_name = $1 AND user_id=$2",[req.body.taskList, req.user.user_id]);
  //   if(credQuery.rows.length > 0){
  //     const list_no = credQuery.rows[0].list_id;
  //     // console.log("this sa list",list_no)
  //     const resQuery = await db.query(
  //       "INSERT INTO tasks(task_name,user_id,list_id,task_info, due_date) VALUES($1, $2, $3, $4, $5)",
  //       [req.body.taskName, req.user.user_id, list_no, req.body.taskDescription, req.body.taskDeadline]
  //     );
  //     res.redirect("/user/add_task");
  //   }
  //   else{
  //     res.send("Error finding user credentials")
  //   }
  // } catch (err) {
  //   console.log(err);
  // }
  try {
    const result = await db.query(
        "INSERT INTO tasks (task_name, task_info, due_date, list_id, user_id, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING task_id",
        [req.body.taskName, req.body.taskDescription, req.body.taskDeadline, req.body.taskList, req.user.user_id, 'Incomplete']
    );
    // res.json({ success: true, task_id: result.rows[0].task_id });
    res.redirect("/user/add_task");
} catch (err) {
    console.error(err);
    res.json({ success: false, message: "Error adding task" });
}
})

app.post("/user/create_list", async (req,res) => {
  // console.log("reached here", req.body)
  try {
    const resQuery = await db.query(
      "INSERT INTO lists(list_name,user_id) VALUES($1, $2) RETURNING *",
      [req.body.listName, req.user.user_id]
    );
    if(resQuery.rows.length > 0){
      res.redirect("/user/create_list");
    }
    else{
      res.send("Error while creation")
    }
  } catch (err) {
    console.log(err);
  }
})

app.post("/user/update_status", async (req, res) => {
  if (req.isAuthenticated()) {
    console.log("status",req.body)
    const { task_id, status } = req.body;
    try {
        await db.query(
            "UPDATE tasks SET status = $1 WHERE task_id = $2 AND user_id = $3",
            [status, task_id, req.user.user_id]
        );
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: "Error updating status" });
    }
  } else {
    res.redirect("/login");
  }
});

app.post("/user/update_task", async (req, res) => {
  if (req.isAuthenticated()) {
    const { task_id, task_name, due_date, list_id } = req.body;
    try {
        await db.query(
            "UPDATE tasks SET task_name = $1, due_date = $2, list_id = $3 WHERE task_id = $4 AND user_id = $5",
            [task_name, due_date, list_id, task_id, req.user.user_id]
        );
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: "Error updating task" });
    }
  } else {
    res.redirect("/login");
  }
});

app.post("/user/delete_task", async (req, res) => {
  const { task_id } = req.body;
  try {
      await db.query("DELETE FROM tasks WHERE task_id = $1 AND user_id = $2", [task_id, req.user.user_id]);
      res.json({ success: true });
  } catch (err) {
      console.error(err);
      res.json({ success: false, message: "Error deleting task" });
  }
});

app.post("/feedback", async(req,res) => {
  const result = await db.query(
    "INSERT INTO Feedback VALUES ($1, $2, $3)",
    [req.body.name, req.body.email, req.body.message]
  );
  res.redirect("/");
})

passport.use(
    new Strategy(async function verify(username, password, cb) {
      console.log("checking for strat");
      try {
        const result = await db.query("SELECT * FROM users WHERE mail = $1 ", [
          username,
        ]);
        if (result.rows.length > 0) {
          const user = result.rows[0];
          const storedHashedPassword = user.pswd;
          bcrypt.compare(password, storedHashedPassword, (err, valid) => {
            if (err) {
              //Error with password check
              console.error("Error comparing passwords:", err);
              return cb(err);
            } else {
              if (valid) {
                //Passed password check
                return cb(null, user);
              } else {
                //Did not pass password check
                return cb(null, false);
              }
            }
          });
        } else {
          return cb("User not found");
        }
      } catch (err) {
        console.log(err);
      }
    })
  );
  
  passport.serializeUser((user, cb) => {
    cb(null, user);
  });
  passport.deserializeUser((user, cb) => {
    cb(null, user);
  });

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });