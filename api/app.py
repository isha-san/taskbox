import sqlite3
import types
from datetime import date
from flask import Flask, request, session
import json

app = Flask(__name__)

app.secret_key="_.xfbgY.xca.xba.x91E}.xe7.x91).xb1.x8a.xb0"

@app.route('/')
def default():
    return {'caption': "hello, world!"}

# route to check if user is logged in
@app.route('/authentication', methods = ["GET"])
def authentication():
    try:
        if session["user_id"] != -1:
            print("currently logged in")
            return {'isAuthenticated' : True}
    except KeyError: 
        print("currently not logged in")
        return {'isAuthenticated' : False}  
    print("currently not logged in")
    return {'isAuthenticated' : False}

# Route for login
@app.route('/login', methods = ["GET", "POST"])
def login():
    if request.method == "POST":
        d = str(request.data)
        print(d)
        data = json.loads(d[2 : len(d) - 1])
        db = sqlite3.connect("timebox.db")
        # checks if all the fields have been entered
        if not data["password"] or not data["email"]:
            print("incomplete form")
            return {'isAuthenticated' : False, "caption": "Enter all fields"}
        # checks to see if there is a user with the data
        # creates a connection to database
        users = db.execute("SELECT * FROM users WHERE email = ? AND password = ?", [data["email"], data["password"]])
        users = users.fetchall()
        # if such a user exists, sets the session user id to the user's id in the database
        if len(users) == 1:
            session["user_id"] = users[0][0]
            print("successful login")
            return {'isAuthenticated' : True, "caption": "Successful login"}
        # if a user does not exist, returns error messaeg
        else:
            print("incorrect credentials")
            return {'isAuthenticated' : True, "caption": "Incorrect email or password"}
    if request.method == "GET":
        return {'isAuthenticated' : False}

# Route for signup
@app.route('/signup', methods = ["GET", "POST"])
def signup():
    if request.method == "POST":
        try: 
            d = str(request.data)
            print(d)
            data = json.loads(d[2 : len(d) - 1])
        except RuntimeError:
            return { 'isAuthenticated' : False, "caption" : "Internal error"}
        # checks if all the fields have been entered
        if not data["password"] or not data["confirmPassword"] or not data["email"]:
            print("incomplete form")
            return {'isAuthenticated' : False, "caption": "Enter all fields"}
        # Creates SQLite connection to the users database
        with sqlite3.connect("timebox.db") as db:
            db.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY NOT NULL, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL)")
            # checks if the email address has already been registered
            user = db.execute("SELECT * FROM users WHERE email = ? ", [data['email']])
            if len(user.fetchall()) > 0:
                print("already registered")
                return {'isAuthenticated' : False, "caption": "Email address already registered"}
            # checks if the two passwords are the same
            if data["password"] != data["confirmPassword"]:
                print("password mismatch")
                return {'isAuthenticated' : False, "caption": "Passwords do not match"}
            # stores the email, password in the database
            db.execute("INSERT INTO users (email, password) VALUES (?, ?)", [data["email"], data["password"]])
            # begins the user's session
            cursor = db.execute("SELECT * FROM users WHERE email = ?", [data["email"]])
            rows = cursor.fetchall()
            session["user_id"] = rows[0][0]
            print("login successful")
            return {'isAuthenticated' : True, "caption" : "Login successful"}
    # Return that the user has not been authenticated
    elif request.method == "GET":
        return {'isAuthenticated' : False}
    
# Route for logout
@app.route('/logout')
def logout():
    session["user_id"] = -1
    print("logged out successfully")
    return {'isAuthenticated': False, "caption": "Logged out successfully"}

@app.route('/tasks', methods = ["GET", "POST"])
def tasks():
    if (request.method == "GET"):
        with sqlite3.connect("timebox.db") as db:
            rows = db.execute("SELECT * FROM tasks WHERE user_id = ? AND date = ?;", [session["user_id"], date.today()])
            rows = rows.fetchall()
            if (len(rows) == 0):
                print("no rows here")
                return {"title": None}
            
            d = {'-1':{'hi': 'bye'}}
            for i in range(len(rows)):
                d[str(i)] = {"title": "", "color": 1, "time": 0, "checked": False}
                d[str(i)]['title'] = rows[i][2]
                d[str(i)]['color'] = rows[i][3]
                d[str(i)]['time'] = rows[i][5]
                d[str(i)]['checked'] = rows[i][6]
            
            return d
    elif (request.method == "POST"):
        try: 
            d = str(request.data)
            
            data = json.loads(d[2 : len(d) - 1])
        except RuntimeError:
            return {"caption" : "Internal error"}
        with sqlite3.connect("timebox.db") as db:
            
            db.execute("CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, user_id INTEGER NOT NULL, title TEXT, color TEXT, date DATE NOT NULL, time INTEGER NOT NULL, checked BOOLEAN);")
            db.execute("INSERT INTO tasks (user_id, title, color, date, time, checked) VALUES (?, ?, ?, ?, ?, ?);", [session['user_id'], data['text'], data['color'], date.today(), data['time'], data['checked']])
            rows = db.execute("SELECT * from tasks WHERE user_id = ? AND date = ? AND time = ?;", [session["user_id"], date.today(), data["time"]])
            rows = rows.fetchall()
            if len(rows) == 0:
                print("TASK NOT STORED")
            else: 
                
                print("TASK STORED SUCCESSFULLY")
            return {"caption": "task stored successfully"}

@app.route('/deleteTask', methods = ["POST"])
def deleteTask():
    if (request.method == "POST"):
        with sqlite3.connect("timebox.db") as db:
            try: 
                d = str(request.data)
                
                data = json.loads(d[2 : len(d) - 1])
            except RuntimeError:
                return {"caption" : "Internal error"}
            db.execute("DELETE FROM tasks WHERE user_id = ? AND date = ? AND time = ?", [session["user_id"], data['date'], data['time']])
            rows = db.execute("SELECT * from tasks WHERE user_id = ? AND date = ? AND time = ?;", [session["user_id"], data['date'], data["time"]])
            rows = rows.fetchall()
            if (len(rows) == 0):
                print("task deleted")
            return {"caption": "task deleted successfully"}

@app.route('/updateTask', methods = ["POST"])
def updateTask():
    if (request.method == "POST"):
        with sqlite3.connect("timebox.db") as db:
            try: 
                d = str(request.data)
               
                data = json.loads(d[2 : len(d) - 1])
            except RuntimeError:
                return {"caption" : "Internal error"}
            db.execute("UPDATE tasks SET color = ?, title = ?, checked = ? WHERE user_id = ? AND date = ? AND time = ? ", [data['color'], data['text'], data['checked'], session["user_id"], date.today(), data['time']])
            return {"caption": "task updated successfully"}