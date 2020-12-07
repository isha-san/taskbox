import sqlite3
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
    # Form gets rendered with React'''
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
        db = sqlite3.connect("timebox.db")
        # Work on this tomorrow!
        rows = db.execute("SELECT * FROM tasks WHERE user_id = ? AND date = ? ", [session["user_id"], date.today()])
        rows = rows.fetchall()
        if (len(rows) == 0):
            print("correct branch reached, no rows here")
            return {"title": None}
        print(rows)
        return rows
    elif (request.method == "POST"):
        try: 
            d = str(request.data)
            print(d)
            data = json.loads(d[2 : len(d) - 1])
        except RuntimeError:
            # can i return nothing?
            return {"caption" : "Internal error"}
        db = sqlite3.connect("timebox.db")
        db.execute("INSERT INTO tasks (user_id, title, color, date, time, checked) VALUES (?, ?, ?, ?, ?, ?)", [session['user_id'], data['text'], data['color'], date.today(), data['time'], data['checked']])
        print("task stored successfully")
        return {"caption": "task stored successfully"}

@app.route('/deleteTask', methods = ["POST"])
def delete_task():
    if (request.method == "POST"):
        db = sqlite3.connect("timebox.db")
        try: 
            d = str(request.data)
            print(d)
            data = json.loads(d[2 : len(d) - 1])
        except RuntimeError:
            # can i return nothing?
            return {"caption" : "Internal error"}
        db.execute("DELETE * FROM tasks WHERE user_id = ? AND date = ? AND time = ?", [session["user_id"], data['date'], data['time']])
        # return nothing? 

@app.route('/updateTask', methods = ["POST"])
def edit_task():
    if (request.method == "POST"):
        db = sqlite3.connect("timebox.db")
        try: 
            d = str(request.data)
            print(d)
            data = json.loads(d[2 : len(d) - 1])
        except RuntimeError:
            # can i return nothing?
            return {"caption" : "Internal error"}
        db.execute("UPDATE (SELECT * FROM tasks WHERE user_id = ? AND date = ? AND time = ?) SET time = ? AND color = ? AND title = ? AND checked = ?", [session["user_id"], data['time'], data['color'], data['text'], data['checked']])
        # return nothing? 