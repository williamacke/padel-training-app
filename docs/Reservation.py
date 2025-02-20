import sys
import requests
import json

##
##    function to obtain a new OAuth 2.0 token from the authentication server
##
def get_new_token():

    auth_server_url = "https://elit.tennisvlaanderen.be/ords/ace/oauth/token"
    client_id = 'ID'
    client_secret = 'SECRET'

    token_req_payload = {'grant_type': 'client_credentials'}
    token_response = requests.post(auth_server_url,data=token_req_payload,auth=(client_id, client_secret))
    if token_response.status_code !=200:
        print("Failed to obtain token from the OAuth 2.0 server", file=sys.stderr)
        sys.exit(1)

    print("Successfuly obtained a new token")
    tokens = json.loads(token_response.text)
    return tokens['access_token']

    ## 
    ## 	obtain a token before calling the API for the first time
    ##

token = get_new_token()

api_call_headers = {'Authorization': 'Bearer ' + token}
api_call_response = requests.get('https://elit.tennisvlaanderen.be/ords/ace/v4/reservation/daily_schedule?club_number=7115&reservation_key=TBP2UCJWA22NRE2M29L5NDN2TP5RHEE4', headers=api_call_headers)

if	api_call_response.status_code == 401:
    token = get_new_token()
else:
    with open('data.json', 'w', encoding='utf-8') as f:
        f.write(api_call_response.text + "\n")

    # print(api_call_response.text)

# api_call_response = requests.get('https://elit.tennisvlaanderen.be/ords/ace/v4/reservation/courts_in_daily_schedule?club_number=7115&reservation_key=TBP2UCJWA22NRE2M29L5NDN2TP5RHEE4', headers=api_call_headers)
# api_call_response = requests.get('https://elit.tennisvlaanderen.be/ords/ace/v4/reservation/available_courts?club_number=7115&reservation_key=TBP2UCJWA22NRE2M29L5NDN2TP5RHEE4', headers=api_call_headers)os.