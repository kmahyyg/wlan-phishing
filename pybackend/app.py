#!/usr/bin/env python3
# -*- encoding:utf-8 -*-
#
# Main Program for honeypot
#
# UWSGI: gunicorn -b 127.0.0.1:58088 -w 1 --reload
# UWSGI: --preload --threads 2 -D main:app

from flask import Flask, request, make_response, redirect
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/', methods=['GET'])
def server_status():
    return 'Server is running!'


@app.route('/api/login', methods=['POST'])
def save_net_cred():
    return 'Hello!'


@app.route('/api/uniq/login', methods=['POST'])
def save_uniq_cred():
    return 'Hello!'


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=58088, debug=False)
