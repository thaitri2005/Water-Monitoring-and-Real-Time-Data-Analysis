#
#   @ File: client.py
#   
#   @ Author: André Vargas (https://github.com/andrevargas22)
#
#   @ This code is a small client example to interact with my ESP8266 Soft Access Point code to send and recieve json data
#

# Imports
import requests
from requests.auth import HTTPBasicAuth

# This IP address must be the same IP given by the ESP at the start of server.ino code, run it once, open the terminal and copy paste the IP here
ESP_IP = '192.168.4.1'

# Authenticator
account = 'admin'
password = 'esp12f'


content = requests.get('http://' + ESP_IP + '/json1', auth=HTTPBasicAuth(account, password), timeout = 0.5)    
print(content.json())
