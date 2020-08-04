import datetime
import os
import uuid
import jwt
from functools import wraps
from flask import Flask, jsonify, make_response, request, abort, render_template
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash, generate_password_hash

# Grabs the folder where the script runs.
basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)

app.config['SECRET_KEY'] = 'secret123'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'library.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

db = SQLAlchemy(app)


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.Integer)
    name = db.Column(db.String(50))
    password = db.Column(db.String(50))
    admin = db.Column(db.Boolean)


class Vhrs(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    vin = db.Column(db.String(50), unique=True, nullable=False)
    report = db.Column(db.Text, unique=False, nullable=True)
    owner_id = db.Column(db.Integer)


def token_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = None
        if 'token' in request.headers:
            token = request.headers['token']
        if not token:
            abort(401)

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'])
            current_user = Users.query.filter_by(public_id=data['public_id']).first()
        except:
            abort(401)
        return f(current_user, *args, **kwargs)

    return decorator


@app.route('/')
def index():
    return render_template('index.html')


# Register a new user
@app.route('/register', methods=['GET', 'POST'])
def signup_user():
    data = request.get_json()

    hashed_password = generate_password_hash(data['password'], method='sha256')

    new_user = Users(public_id=str(uuid.uuid4()), name=data['name'], password=hashed_password, admin=False)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'registered successfully'})


@app.route('/login', methods=['GET', 'POST'])
def login_user():
    username = request.form.get('name')
    password = request.form.get('password')

    if not username or not password:
        return make_response('could not verify', 401, {'WWW.Authentication': 'Basic realm: "login required"'})

    user = Users.query.filter_by(name=username).first()
    if user:
        if check_password_hash(user.password, password):
            token = jwt.encode(
                {'public_id': user.public_id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=300)},
                app.config['SECRET_KEY'])
            return jsonify({'token': token.decode('UTF-8'), 'id': user.id})

    return make_response('could not verify', 401, {'WWW.Authentication': 'Basic realm: "login required"'})


@app.route('/preference')
def preference():
    return render_template('preference.html')


@app.route('/itinerary')
@token_required
def itinerary():
    return render_template('itinerary.html')


@app.route('/user/<name>', methods=['GET', 'POST'])
def get_user(current_user, name):
    user = Users.query.filter_by(name=name, id=current_user.id).first()
    if not user:
        return jsonify({'message': 'user does not exist'})

    output = []

    user_data = {'name': user.name, 'id': user.id, 'public_id': user.public_id}
    output.append(user_data)

    return jsonify({'User detail': output})


# List of users - Need to remove. Example: http://localhost:5000/users
@app.route('/users', methods=['GET'])
def get_all_users(current_user):
    users = Users.query.all()
    result = []

    for user in users:
        user_data = {'public_id': user.public_id, 'name': user.name, 'password': user.password, 'admin': user.admin}
        result.append(user_data)

    return jsonify({'users': result})


# Gets user details. Example: localhost:5000/getvhr/GOOD-VIN
@app.route('/getvhr/<vin>', methods=['GET', 'POST'])
def get_vhr(current_user, vin):
    vhr = Vhrs.query.filter_by(vin=vin, owner_id=current_user.id).first()

    if not vhr:
        return jsonify({'Status': 'Not Exist'})

    return vhr.report


# Adds new VHR detail Samples: 1: { "vin": "BAD-VIN-2", "report": "{\"Status\":\"Good\", \"Message\": \"Good\"}" } 2:
# { "vin": "BAD-VIN-2", "report": "{\"Status\":\"Alert\",\"Message\":{\"ABS\":\"Not working\",\"Night View
# Assistance\":\"Not working\",\"Engine Oil\":\"Medium\",\"Fuel Level\":\"10%\"}}" }


@app.route('/addvhr', methods=['POST', 'GET'])
def add_vhr(current_user):
    data = request.get_json()
    app.logger.info('VIN: %s', data['vin'])
    app.logger.info('Report: %s', data['report'])

    new_vhr = Vhrs(vin=data['vin'], report=data['report'], owner_id=current_user.id)
    db.session.add(new_vhr)
    db.session.commit()

    return jsonify({'Status': 'New VHR created'})
