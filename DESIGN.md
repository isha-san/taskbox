# Technologies used

We chose to use React, a Javascript/client-side framework, and Flask, a Python/server-side framework. 

We chose React because it allowed us to create more dynamic webpages with relative ease and most of the group members were fairly familiar with React. Moreover, there was a lot of support available online, which made it an appealing choice for less experienced programmers like us. 

We chose Flask because everyone in the group was familiar with it and because it seemed lighter and more flexible than other frameworks like Django. Overall, it seemed like there was less work involved. 

On the backend, we used a SQLite database to store user information and task information. This was the most straightforward option, since it was similar to what we did in Problem Set 9 (Finance), so it wouldn't require too much extra learning. 

# Frontend-backend connection/how the servers are set up

In the file "package.json", the React frontend is configured to use the API backend as a proxy. When you run the application on your computer, you're running both servers at once. 

React sends requests to the backend using the Fetch API, which is built into Javascript. Lines that look like: 

fetch('./<Flask route name>)...

are calls to the API backend. 

# User authentication

Our user authentication system is, unfortunately, very insecure. We plan to work on this project more after finals and address this issue. For now, this is how our user authentication system is set up: 

Users sign up via a process very similar to that of Problem Set 9 (Finance). They enter their account information, which gets stored in an HTML form and then sent in a POST request to the server the Flask route 'signup'. The Flask application inserts the information into the users table in the SQLite database. The login process is very similar, except instead of SQL INSERT statements, we use SELECT statements. 

# Password reset (forgot password)

CLARE

# Task management

FRONTEND: SHAY

Backend:
When users enter or change their tasks, the React application sends more POST requests to the backend, specifically to the routes 'updateTask', 'deleteTask', and 'tasks'. These routes perform the corresponding CRUD operations on the tasks table in the database. The 'tasks' route is used to create new tasks and also accepts GET requests, so it is used to retrieve existing task information to display to the user when they open the schedule page. 

# Integration with Google Calendar API

We added the option for users to display events from their Google Calendar for that day in the schedule page. In the getEvents() function in 'Grid.js', we initialize a Google API client and then make requests to Google's server using the unique credentials obtained from the Google API Console. When the user asks to see their GCal events, we use OAuth to have them to sign in and select a primary calendar. 

We use the API's calendar.list() function to retrieve a list of all the users' events for that day. Then, functions in 'Grid.js'  re-format the data so it fits with our existing structure of half-hour timeblocks. React uses the stored event data to display the schedule with busy areas greyed out. 
