from flask_restful import Resource, Api
from os import system,getcwd
from flask import request, redirect, make_response, Flask , render_template ,url_for,session
import json

# System Variables
APP_SECRET_KEY = "9H2ghgy6bH6jfFr45mVR452M5iI0fwkQc"
cwd =getcwd()

#Load Json file
with open('userData.json') as json_file:
  jsonData = json.load(json_file)
        
def authenticate_user(username, password):
    for user_data in jsonData.get('user', []):
        if user_data.get('username') == username and user_data.get('password') == password:
            return True  # Authentication successful
    
    return False  # Authentication failed outside the loop
        
  
#Get USer Data  
def get_user_data(username):
    for user_data in jsonData.get('user', []):
        if user_data.get('username') == username:
            return user_data
    return None 

# Object Declarartion
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
    if authenticate_user(username, password):
        session['user'] = username   
        return redirect('/home')
    return make_response(render_template('login.html',message="Invalid Credentials", uname=username))        

# Home Dashboard
class home(Resource): 
  def get(self): 
    if 'user' in session:
          username = session['user']
          user_data = get_user_data(username)
          if user_data:
            return make_response(render_template('home.html', data=user_data,globVar=jsonData["global"]))
      
    return make_response(render_template('login.html'))
 
#Logout
class logout(Resource):
  def get(self):
      session.pop('user')         
      return redirect('/login')
        
#JSON API
class SendJson(Resource):
  def post(self):
    username = request.form.get('user')
    password = request.form.get('pass')  
    if authenticate_user(username, password):
        userdata = get_user_data(username)
        return userdata, 200  # Returning user data with 200 status code for success
    return {"message": "User not found"}, 404  # Return a JSON response with a 404 status code

  def get(self):
    username = request.args.get('user')
    password = request.args.get('pass') 
    if authenticate_user(username, password):
      userdata = get_user_data(username)
      return userdata,200  
    return {"message":404}

api.add_resource(root, '/',methods=['GET', 'POST'])
api.add_resource(login, '/login/',methods=['GET', 'POST'])
api.add_resource(home, '/home/',methods=['GET', 'POST'])
api.add_resource(SendJson, '/api/',methods=['GET', 'POST'])
api.add_resource(logout, '/logout/',methods=['GET', 'POST'])

if __name__ == '__main__':
    app.run(debug=False,host='0.0.0.0',port=5000,threaded=True)
