Link to YouTube video: https://www.youtube.com/watch?v=1pgolZVfSbc&feature=youtu.be
# The project is structured as follows: 

taskbox
	- api
	- public
	- src
		- components
		- containers
		- A bunch of files including App.js, index.js, etc.

# Running the servers

- Download and install node.js (if you don't have it already) from this URL: https://nodejs.org/en/download/

- Open a terminal and navigate to the taskbox directory. 
- Run the following commands: 
	npm install npm install @material-ui/core
	
- In a second terminal, navigate back to the taskbox/api directory and run the following command: 
	venv\Scripts\flask run --no-debugger (Windows)
	venv/bin/flask run --no-debugger (others) (if this doesn't work, try running: source venv/bin/flask run --no-debugger)
	This should get the flask server up and running. 
	
- In your first terminal, navigate to the taskbox directory. 
	npm start
This should open a tab in your web browser. The React server should be up and running at port 3000. 


# Package installation (MAY NOT BE NECESSARY; TRY "RUNNING THE SERVERS" FIRST AND THEN INSTALL PACKAGES IF NECESSARY)
	
In the taskbox/api directory, 
(Installation may not be necessary; try running it without these steps first)
- Install flask: 
	- Create a virtual environment with these terminal commands: 
		py -m venv env (Windows)
		python3 -m venv venv (others)
	- Activate the virtual environment like this: 
		venv\Scripts\activate (Windows)
		venv/bin/activate (others)
	- Install flask:
		pip install flask python-dotenv
		
For more instructions on flask installation, follow this URL: https://flask.palletsprojects.com/en/1.1.x/installation/

# More tutorials and links

Here are more resources in case something above didn't work: 
- Using React + Flask together: https://blog.miguelgrinberg.com/post/how-to-create-a-react--flask-project
- Installing material-UI: https://material-ui.com/getting-started/installation/
- Our GitHub repo: https://github.com/isha-san/taskbox
