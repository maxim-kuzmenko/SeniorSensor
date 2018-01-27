# /usr/bin/env python
# Download the twilio-python library from twilio.com/docs/libraries/python

import twilio
from twilio.rest import Client
from flask import Flask

#@app.route("/")
#def hello():
 #   return "Hello World!"

# Find these values at https://twilio.com/user/account
account_sid = "AC5e88808feca3beef0e331025d9145e3c"
auth_token = "4170d65f65f4d4cb0848ac00daba6f14"

client = Client(account_sid, auth_token)

client.api.account.messages.create(
    to="+16133015513",
    from_="+16138006802",
    body="you suck dick")

app = Flask(__name__)
