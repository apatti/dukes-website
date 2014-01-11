from flask import Flask

app = Flask(__name__)

@app.route('/')
def index():
    return "Hello Dukes11 from OpenShift"

if __name__ == '__main__':
    app.run()
