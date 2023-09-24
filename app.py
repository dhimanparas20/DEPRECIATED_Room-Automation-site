from flask_restful import Resource, Api
from os import system,getcwd
from flask import request, redirect, make_response, Flask , render_template ,url_for,session
import requests
import json

with open('userData.json') as json_file:
  data = json.load(json_file)

# System Variables
USERNAME = [user["username"] for user in data["user"]]
TOKEN = [user["token"] for user in data["user"]]
PASSWORD = "Mst@2069"
APP_SECRET_KEY = "9H2g2M5iI0fwkQc"

#Clear the terminal output
system("clear")
# Get Current Path
cwd =getcwd()
#Admin Details
user1 = {"username": USERNAME[0], "password": PASSWORD}
user2 = {"username": USERNAME[1], "password": PASSWORD}

# App Declarartion
app = Flask(__name__)
api = Api(app)
app.secret_key = APP_SECRET_KEY  #Secret Key To Store Session Cookies
 
# Redirect to Website Home
class root(Resource):  
  def get(self):
    return redirect(url_for('home')) 

# Admin Login page   
class login(Resource):
  def get(self):
    return make_response(render_template('login.html')) 

  def post(self):
    username = request.form.get('uname')
    password = request.form.get('psw')     
    if (username == user1['username'] and password == user1['password']) or (username == user2['username'] and password == user2['password']) :  
      session['user'] = username 
      return redirect('/home')
    return make_response(render_template('login.html',message="Invalid Credentials", uname=username))  

# Home Dashboard
class home(Resource):  
  def get(self):
    #print(pinConfig_json,pinStats_json)
    if('user' in session and session['user'] == user1['username']):
      return make_response(render_template('home.html',data=data["user"][0]))
    elif ('user' in session and session['user'] == user2['username']):
      return make_response(render_template('home.html',data=data["user"][1]))  
    return make_response(render_template('login.html'))  #if the user is not in the session
 
#Logout
class logout(Resource):
  def get(self):
      session.pop('user')         
      return redirect('/login')
        
'''
#Get values  
class getval(Resource):
  def get(self):
      if('user' in session and session['user'] == user['username']):
        response = requests.get('https://blr1.blynk.cloud/external/api/get?token=g2-VR83SfRVfmPIMoTQLX0nCrWbJQ9kA&V1&V2&V3&V4') 
        state = requests.get('https://blr1.blynk.cloud/external/api/isHardwareConnected?token=g2-VR83SfRVfmPIMoTQLX0nCrWbJQ9kA')
        if response.status_code == 200 and state.status_code == 200 :
          data = response.json()
          data2 = state.json()
          return {"V1":data['V1'],"V2":data['V2'],"V3":data['V3'],"V4":data['V4'],"state":data2}
        else:
          return {'error': 'API request failed'}  
      else:         
        return redirect('/login')     
'''        

api.add_resource(root, '/',methods=['GET', 'POST'])
api.add_resource(login, '/login/',methods=['GET', 'POST'])
api.add_resource(home, '/home/',methods=['GET', 'POST'])
#api.add_resource(getval, '/getval/',methods=['GET', 'POST'])
api.add_resource(logout, '/logout/',methods=['GET', 'POST'])


if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0',port=5000)
