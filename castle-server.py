print (" [+] Loading basics...")
import os
import json
import getopt
import sys

try:
    opts, args = getopt.getopt(sys.argv[1:], "", ["debug", "host=", "port=", "external-host=", "external-port="])
except getopt.GetoptError as e:
    print("Error:", e.msg)
    exit(1)

if os.name == 'nt':
    os.system("color")
    os.system("title RaidTheCastles Server")
else:
    sys.stdout.write("\x1b]2;RaidTheCastles Server\x07")

print (" [+] Loading players...")
from player import load_saves, load_static_villages, all_saves_info, all_saves_uids, save_info, new_village
load_saves()
print (" [+] Loading static villages...")
load_static_villages()

print (" [+] Loading server...")
from flask import Flask, render_template, send_from_directory, request, Response, redirect, session
from flask.debughelpers import attach_enctype_error_multidict
from werkzeug.utils import safe_join
from pyamf import remoting
import pyamf

import commands
from engine import timestamp_now
from version import version_name, release_date
from bundle import TEMPLATES_DIR
from player import save_session
BIND_IP = "127.0.0.1"  # can be 0.0.0.0 for all interfaces
BIND_PORT = 5500
EXTERNAL_HOST_IP = "127.0.0.1"  # can't be 0.0.0.0
EXTERNAL_HOST_PORT = 5500
debug = False

for o, a in opts:
    if o == '--host':
        BIND_IP = a
    elif o == '--port':
        BIND_PORT = int(a)
    elif o == '--external-host':
        EXTERNAL_HOST_IP = a
    elif o == '--external-port':
        EXTERNAL_HOST_PORT = int(a)
    elif o == '--debug':
        debug = True

app: Flask = Flask(__name__)

print (" [+] Configuring server routes...")

# Templates

@app.route("/", methods=['GET', 'POST'])
def login():
    # Log out previous session
    session.pop('UID', default=None)
    # Reload saves (not static villages nor quests). Allows saves modification without server reset
    load_saves()
    # If logging in, set session UID, and go to play
    if request.method == 'POST':
        session['UID'] = request.form['UID']
        print("[LOGIN] UID:", request.form['UID'])
        return redirect("/play.html")
    # Login page
    if request.method == 'GET':
        saves_info = all_saves_info()
        return render_template("login.html",
            saves_info=saves_info,
            version=version_name,
            release_date=release_date
        )


@app.route("/play.html", methods=['GET'])
def play():
    if 'UID' not in session:
        return redirect("/")

    if session['UID'] not in all_saves_uids():
        return redirect("/")

    UID = session['UID']
    print("[PLAY] UID:", UID)
    return render_template("play.html",
                           # swf_file="Game.74708-full-tracer.swf", currently broken
                           # swf_file="Game.74708-tracer2a.swf", # has fixes
                           # swf_file="Game.74708-tracer2b.swf",  # has fixes, lightweight
                           swf_file="Game.74708-tracer2bx.swf",  # 2b with debugging symbols
                           # swf_file="Game.74708-tracer2x.swf",  # add traced files on demand
                           # swf_file="Game.74708-tracer2y.swf",  # add traced files on demand
                           version=version_name,
                           release_date=release_date,
                           base_url=f"http://{BIND_IP}:{BIND_PORT}",
                           external_ip=EXTERNAL_HOST_IP,
                           external_port=EXTERNAL_HOST_PORT,
                           server_time=timestamp_now(),
                           debug="true",
                           user={
                               "uid": UID,
                               "name": save_info(UID)["name"]
                           },
                           zid=UID,
                           save_info=save_info(UID)
                           )

#def get_zid():
#    return libscrc.iso(session.sid.encode()) // 2048
    #return libscrc.iso(session['UID'].encode()) // 2048

@app.route("/new.html")
def new():
    session['UID'] = new_village()
    return redirect("play.html")

@app.route("/help.html")
def help():
    return render_template("help.html")

@app.route("/locale_switcher.html")
def localswitch():
    return render_template("locale_switcher.html")

@app.route("/swf/flashservices/gateway.php", methods=['POST'])
def flashservices_gateway():
    resp_msg = remoting.decode(request.data)
    print("[+] Gateway AMF3 Request:", resp_msg)
    resps = []
    reqs = resp_msg.bodies[0][1].body[1]
    for reqq in reqs:

        print(f"[+] {reqq.functionName}: {reqq['params']}")
        # UID = resp_msg.bodies[0][1].body[0]["uid"]
        UID = resp_msg.bodies[0][1].body[0]["clientZid"]

        response = {
            "errorType": 0,
            "errorData": None,
            "isDST": 0,
            "sequenceNumber": reqq["sequence"],
            "worldTime": timestamp_now(),
            "metadata": {
                "QuestComponent": {},
            },
            # "zySig": {
            #     "zy_user": resp_msg.bodies[0][1].body[0]["zy_user"],
            #     "zy_ts": timestamp_now(),
            #     "zy_session": resp_msg.bodies[0][1].body[0]["zy_session"]
            # },
            "data": None
        }

        if reqq.functionName == 'UserService.initUser':
            firstName = reqq['params'][0]
            timezoneOffset = reqq['params'][1]
            needsToLoadWorld = reqq['params'][2]
            flashControllerInit = reqq['params'][3]
            response["data"] = commands.init_user(UID)
            resps.append(response)

        elif reqq.functionName == 'UserService.postInit':
            response["data"] = commands.post_init_user(UID)
            resps.append(response)
        
        elif reqq.functionName == 'FriendSetService.getBatchFriendSetData':
            response["data"] = []
            resps.append(response)
        
        elif reqq.functionName == 'UserService.r2InterstitialPostInit':
            response["data"] = {
                "r2InterstitialItems": [],
                "r2InterstitialFeedItems": [],
                "r2InterstitialMinigameIndex": [],
                "r2InterstitialTypeIndex": None,
                "r2InterstitialFriendCount": None
            }
            resps.append(response)
        
        elif reqq.functionName == 'FriendListService.getFriendsForR2FlashNeighborFlow':
            response["data"] = {
                "requestedFriends": {
                    "GhostNeighbor": [],
                    "FarmVille": [],
                    "Facebook": [],
                    "PossibleCommunity": [],
                    "CurrentAllNeighbor": [],
                }
            }
            resps.append(response)

        elif reqq.functionName == 'UserService.incrementActionCount':
            action = reqq['params'][0]
            commands.increment_action_count(UID, action)
            resps.append(response)
        
        elif reqq.functionName == 'UserService.resetActionCount':
            action = reqq['params'][0]
            commands.reset_action_count(UID, action)
            resps.append(response)

        elif reqq.functionName == 'UserService.setSeenFlag':
            flag = reqq['params'][0]
            commands.set_seen_flag(UID, flag)
            resps.append(response)

        elif reqq.functionName == 'UserService.resetSystemNotifications':
            resps.append(response)
        
        elif reqq.functionName == 'UserContentService.onCreateImage':
            name = reqq['params'][0]
            png_b64 = reqq['params'][1]
            feed_post = reqq['params'][2]
            if name == "avatar_appearance":
                commands.set_avatar_appearance(UID, name, png_b64, feed_post)
            resps.append(response)

        elif reqq.functionName == 'UserService.saveOptions':
            options = reqq['params'][0]
            commands.save_options(UID, options)
            resps.append(response)
        
        elif reqq.functionName == 'WorldService.performAction':
            actionName = reqq['params'][0]
            m_save = reqq['params'][1]
            params = reqq['params'][2]
            object_id = commands.world_perform_action(UID, actionName, m_save, params)
            # This infroms the client of the new (non-temporary) object ID
            response["id"] = object_id
            response["data"] = {"id": object_id} # onMultiComplete and onComplete treat this differently. This is a temporary workaround
            resps.append(response)
        
        elif reqq.functionName == 'UserService.updateFeatureFrequencyTimestamp':
            feature = reqq['params'][0]
            commands.update_feature_frequency_timestamp(UID, feature)
            resps.append(response)

        elif reqq.functionName == 'DataServicesService.getFriendsPlayingGame':
            feature = reqq['params'][0]
            response["zids"] = []
            response["lastPlayed"] = []


            resps.append(response)

        else:
            resps.append(response)
    
    assert len(resps) == len(reqs)

    save_session(UID)

    emsg = {
        "serverTime": timestamp_now(),
        "errorType": 0,
        "data": resps
    }
    print("[+] Gateway AMF3 emsg:", emsg)

    req = remoting.Response(emsg)
    print("[+] Gateway AMF3 response:", req)
    ev = remoting.Envelope(pyamf.AMF0)
    ev[resp_msg.bodies[0][0]] = req
    # print("[+] Response:", ev)
    print("[+] Gateway AMF3 envelope response:", ev)


    ret_body = remoting.encode(ev, strict=True, logger=True).getvalue()
    return Response(ret_body, mimetype='application/x-amf')

@app.route("/css/<path:path>")
def css(path):
    return send_from_directory(TEMPLATES_DIR + "/css", path)

@app.route("/js/<path:path>")
def js(path):
    return send_from_directory(TEMPLATES_DIR + "/js", path)

@app.route("/zpatch/<path:path>")
def zpatch(path):
    return send_from_directory(TEMPLATES_DIR + "/zpatch", path)

@app.route("/locale/<path:path>")
def locale(path):
    return send_from_directory(TEMPLATES_DIR + "/locale", path)

@app.route("/swf/<path:path>")
def swf(path):
    return send_from_directory(TEMPLATES_DIR + "/swf", path)

@app.route("/img/<path:path>", methods=['GET'])
def img(path):
    return send_from_directory(TEMPLATES_DIR + "/img", path)

@app.route("/xml/<path:path>", methods=['GET'])
def xml(path):
    return send_from_directory(TEMPLATES_DIR + "/xml", path)

@app.route("/Game.74708.swf")
def flashFile():
    return send_from_directory("assets/zynga1-a.akamaihd.net ##1–4/castleville/74708 ##last revision, complete", "Preloader.swf")  # regular one

@app.route("/127.0.0.1record_stats.php", methods=['GET', 'POST'])
def record_stats():
    stats = json.loads(request.data)
    print("[+] Stats:")
    for i in stats["stats"]:
        print(" * ", i["statfunction"], ": ", i["data"], sep="")
    return "{}"

@app.route("/web-client-ca2/record_stats.php", methods=['GET', 'POST'])
def record_stats_2():
    stats = json.loads(request.data)
    print("[+] Stats:")
    for i in stats["stats"]:
        print(" * ", i["statfunction"], ": ", i["data"], sep="")
    return "{}"

@app.route("/swf/record_stats.php", methods=['GET', 'POST'])
def record_stats_3():
    stats = json.loads(request.data)
    print("[+] Stats:")
    for i in stats["stats"]:
        print(" * ", i["statfunction"], ": ", i["data"], sep="")
    return "{}"

@app.route("/crossdomain.xml")
def crossdomain_file():
    return send_from_directory("assets/zynga1-a.akamaihd.net ##1–4/castleville/74708 ##last revision, complete", "crossdomain.xml")

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')


@app.route('/1-a_assets/castleville//74708/<path:path>')
def c_1_assets(path):
    return send_from_directory("assets/zynga1-a.akamaihd.net ##1–4/castleville/74708 ##last revision, complete", path)

@app.route('/1-a_assets/castleville//hashed/<path:path>')
def h_1_assets(path):
    return send_from_directory("assets/zynga1-a.akamaihd.net ##1–4/castleville/hashed", path)

@app.route('/2-a_assets/zap/zac/1/<path:path>')
def h_2_assets_zap(path):
    return send_from_directory("assets/zynga1-a.akamaihd.net ##1–4/castles/67286 ##17 localizations, complete/", path)

@app.route('/zcache/<path:path>')
def zcache_url(path):
    return send_from_directory("assets/zcache.zgncdn.com", path)

@app.route('/zchan0-a/<path:path>')
def zchan0_url(path):
    return send_from_directory("assets/zchan0-a.akamaihd.net ##0–3", path)


@app.route('/js/zui.js')
def zui_js():
    return send_from_directory("assets/zynga1-a.akamaihd.net ##1–4/zlive/zdc-e31cb61f_c76f89bd_2e5b1248-static/js/compiled", "zyc--profile-a3b34c0871dc2fd51eec5559b68f709d-en_US.js")

@app.errorhandler(500)
def server_error_page(error):
    # if crash_log:
    #     text = editor.edit(filename=os.path.join(log_path(), "log.txt"))
    return 'It went wrong'

print (" [+] Running server...")

if __name__ == '__main__':
    app.secret_key = 'SECRET_KEY'
    app.run(host=BIND_IP, port=BIND_PORT, debug=debug, threaded=True)