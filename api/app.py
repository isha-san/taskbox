from flask import Flask

app = Flask(__name__)


@app.route('/marissa')
def marissa():
    return {'cap': "hello, world! I'm marissa the investor."}
