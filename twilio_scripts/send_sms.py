# /usr/bin/env python
# Download the twilio-python library from twilio.com/docs/libraries/python

import twilio
from twilio.rest import Client
from flask import Flask

#@app.route("/")
#def hello():
 #   return "Hello World!"

# Find these values at https://twilio.com/user/account
#account_sid = "AC5e88808feca3beef0e331025d9145e3c"
#auth_token = "4170d65f65f4d4cb0848ac00daba6f14"

account_sid = "AC610a13bdb4e66808beace23a61c6d0d4"
auth_token = "7a52286c05bac629ca5001c62315fb37"

client = Client(account_sid, auth_token)

client.api.account.messages.create(
    to="+15877071849",
    from_="+15873175479 ",
    body="Sudden fall detected for our elderly patient.")

app = Flask(__name__)
