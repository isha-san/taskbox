import sqlite3
import types
from datetime import date
from flask import Flask, request, session
import json
#from flask_mail import Message
#from app import mail
#from threading import Thread
#from time import time
#import jwt

app = Flask(__name__)

app.secret_key="_.xfbgY.xca.xba.x91E}.xe7.x91).xb1.x8a.xb0"
#Commented out because mailing password reset feature is not fully functional
#mail = Mail(app)

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

"""
# Commented out because feature is not fully functional
# Route for password reset
@app.route('/resetPassword')
def resetPassword():
    try: 
        d = str(request.data)
        print(d)
        data = json.loads(d[2 : len(d) - 1])
        db = sqlite3.connect("timebox.db")
    except RuntimeError:
        return { 'isAuthenticated' : False, "caption" : "Internal error"}
    if not data["email"]:
        print("incomplete form")
        return {'isAuthenticated': False, "caption": "Must enter an email address"}
    # checks to see if there is a user with the data
    # creates a connection to database
    users = db.execute("SELECT * FROM users WHERE email = ?", [data["email"]])
    users = users.fetchall()
    # if such a user exists, sets the session user id to the user's id in the database
    if len(users) == 1:
        sendPasswordReset(data)
        flash('Check your email for instructions to reset your password')
        return redirect ('/login')
    # if a user does not exist, returns error message
    else:
        print("No user found with this email address")
        return {'isAuthenticated' : False, "caption": "Incorrect email"}

def sendPasswordReset(user):
    token = get_reset_password_token(user["user_id"])
    send_email('[Taskbox] Reset Your Password',
                sender='taskbox@gmail.com',
                recipients=[user["email"],
                text_body=render_template('reset_password.txt', token=token),
                html_body=render_template('reset_password.html', token=token))


def get_reset_password_token(user_id):
    return jwt.encode(
        {'changePassword': user_id, 'exp': time() + 600},
        app.config['SECRET_KEY'], algorithm='HS256').decode('utf-8')


def verify_reset_password_token(token):
    try:
        id = jwt.decode(token, app.config['SECRET_KEY'],
                        algorithms=['HS256'])['changePassword']
    except:
        return
        # have to change bc not using the user model
    return user ??????


def send_async_email(app, msg):
    # send the email asynchronously to avoid slowing down program
    with app.app_context():
        mail.send(msg)


@app.route('/send_email')
def send_email(subject, sender, recipients, text_body, html_body):
    msg = Message(subject, sender=sender, recipients=recipients)
    msg.body = text_body
    msg.html = html_body
    # should be calling (app, msg) or just msg?
    Thread(target=send_async_email, args=(app, msg)).start()

@app.route('/changePassword/<token>', methods=['GET', 'POST'])
def changePassword(token):
    try: 
        d = str(request.data)
        print(d)
        data = json.loads(d[2 : len(d) - 1])
        db = sqlite3.connect("timebox.db")
    except RuntimeError:
        return { 'isAuthenticated' : False, "caption" : "Internal error"}
    users = db.execute("SELECT * FROM users WHERE email = ?", [data["email"]])
    users = users.fetchall()
    # update users table with new password
    db.execute("UPDATE users SET password = ? WHERE email = ?", [data["password"]], [data["email"]])
    flash('Your password has been reset.')
    return redirect('/login')
"""


@app.route('/tasks', methods = ["GET", "POST"])
def tasks():
    # Populating the page with existing tasks
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
    # Creating a new task
    elif (request.method == "POST"):
        try: 
            d = str(request.data)
            
            data = json.loads(d[2 : len(d) - 1])
        except RuntimeError:
            return {"caption" : "Internal error"}
        with sqlite3.connect("timebox.db") as db:
            # inserting a new task into the databaes with form data
            db.execute("CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, user_id INTEGER NOT NULL, title TEXT, color TEXT, date DATE NOT NULL, time INTEGER NOT NULL, checked BOOLEAN);")
            db.execute("INSERT INTO tasks (user_id, title, color, date, time, checked) VALUES (?, ?, ?, ?, ?, ?);", [session['user_id'], data['text'], data['color'], date.today(), data['time'], data['checked']])
            rows = db.execute("SELECT * from tasks WHERE user_id = ? AND date = ? AND time = ?;", [session["user_id"], date.today(), data["time"]])
            rows = rows.fetchall()
            if len(rows) == 0:
                print("TASK NOT STORED")
            else: 
                
                print("TASK STORED SUCCESSFULLY")
            return {"caption": "task stored successfully"}
# deleting a task
@app.route('/deleteTask', methods = ["POST"])
def deleteTask():
    if (request.method == "POST"):
        with sqlite3.connect("timebox.db") as db:
            try: 
                d = str(request.data)
                
                data = json.loads(d[2 : len(d) - 1])
            except RuntimeError:
                return {"caption" : "Internal error"}
            # deleting a task from the database
            db.execute("DELETE FROM tasks WHERE user_id = ? AND date = ? AND time = ?", [session["user_id"], date.today(), data['time']])
            rows = db.execute("SELECT * from tasks WHERE user_id = ? AND date = ? AND time = ?;", [session["user_id"], date.today(), data["time"]])
            rows = rows.fetchall()
            if (len(rows) == 0):
                print("task deleted")
            return {"caption": "task deleted successfully"}

# editing a task
@app.route('/updateTask', methods = ["POST"])
def updateTask():
    if (request.method == "POST"):
        with sqlite3.connect("timebox.db") as db:
            try: 
                d = str(request.data)
               
                data = json.loads(d[2 : len(d) - 1])
            except RuntimeError:
                return {"caption" : "Internal error"}
            # editing an existing task in the database
            db.execute("UPDATE tasks SET color = ?, title = ?, checked = ? WHERE user_id = ? AND date = ? AND time = ? ", [data['color'], data['text'], data['checked'], session["user_id"], date.today(), data['time']])
            return {"caption": "task updated successfully"}

# moving tasks forward by an hour
@app.route('/shiftTasks')
def shiftTasks():
    with sqlite3.connect("timebox.db") as db:
        db.execute("UPDATE tasks SET time = time + 1 WHERE user_id = ? AND date = ?", [session['user_id'], date.today()])
        print("tasks shifted successfully")
        return {"caption": "tasks shifted successfully"}
