
from flask import Flask, render_template, send_from_directory, request, Response, make_response, redirect


from pyamf import remoting
import pyamf

import pyamf.amf0
import json

from time import sleep
from datetime import timedelta
import os

from flask_socketio import SocketIO

socketio = SocketIO()


debug = True
host = '127.0.0.1'  # host to listen on 0.0.0.0 for all interfaces, 127.0.0.1 for only localhost
host = '0.0.0.0'  # host to listen on 0.0.0.0 for all interfaces, 127.0.0.1 for only localhost
http_host = '127.0.0.1'  # host to open on the webbrowser, can't be 0.0.0.0
http_path = ''  # in order to open a specific page on startup
port = 5005

app: Flask = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/home.html")
def home():
    print("home")

    return render_template("home2.html")


@app.route("/Game.74708.swf")
def flashFile():
    return send_from_directory("assets/zynga1-a.akamaihd.net ##1–4/castleville/74708 ##last revision, complete", "Preloader.swf")  # regular one

@app.route("/127.0.0.1record_stats.php", methods=['GET', 'POST'])
def record_stats():
    stats = json.loads(request.data)
    print("[+] Stats:", json.dumps(stats, indent=4))
    return "{}"

@app.route("/web-client-ca2/record_stats.php", methods=['GET', 'POST'])
def record_stats_2():
    stats = json.loads(request.data)
    print("[+] Stats:", json.dumps(stats, indent=4))
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


@app.route('/2-a_assets/zlive/zui/r45450-prod/zui.js')
def zui_js():
    return send_from_directory("assets/zynga1-a.akamaihd.net ##1–4/zlive/zdc-e31cb61f_c76f89bd_2e5b1248-static/js/compiled", "zyc--profile-a3b34c0871dc2fd51eec5559b68f709d-en_US.js")

@app.route('/nullassets/<path:path>')
def send_sol_assets(path):
    return send_from_directory('assets/sol_assets_octdict/assets', path)

@app.route('/assets/<path:path>')
def send_sol_assets_alternate(path):
    return send_from_directory('assets/sol_assets_octdict/assets', path)

@app.errorhandler(500)
def server_error_page(error):
    # if crash_log:
    #     text = editor.edit(filename=os.path.join(log_path(), "log.txt"))
    return 'It went wrong'

if __name__ == '__main__':
    # if 'WERKZEUG_RUN_MAIN' not in os.environ and open_browser:
        # if os.path.exists(os.path.join("chromium", "chrome.exe")):
            # threading.Timer(1.25, lambda: os.system(os.path.join("chromium", "chrome.exe") + " --user-data-dir=\"" + os.path.join(my_games_path(), "chromium-profile") + "\"" + " --allow-outdated-plugins " + ("--app=" if app_mode else "") + "http://" + http_host + ":" + str(port) + "/" + http_path)).start()
        # elif os.path.exists(os.path.join("chromium", "chrome")):
        #     threading.Timer(1.25, lambda: os.system(os.path.join("chromium", "chrome") + " --user-data-dir=\"" + os.path.join(my_games_path(), "chromium-profile") + "\"" + " --–allow-outdated-plugins " + ("--app=" if app_mode else "") + "http://" + http_host + ":" + str(port) + "/" + http_path)).start()
        # else:
        #     threading.Timer(1.25, lambda: webbrowser.open("http://" + http_host + ":" + str(port) + "/" + http_path)).start()
    # init_db(app, db)
    # set_crash_log(crash_log)
    # if compression:
    #     compress.init_app(app)
    socketio.init_app(app)
    # sess.init_app(app)
    # db.init_app(app)
    # session.app.session_interface.db.create_all()
    # app.session_interface.db.create_all()
    # db.create_all()

    socketio.run(app, host=host, port=port, debug=debug)
    # app.run(host='127.0.0.1', port=5005, debug=True)
    # logging.getLogger('socketio').setLevel(logging.ERROR)
    # logging.getLogger('engineio').setLevel(logging.ERROR)
    # logging.getLogger('geventwebsocket.handler').setLevel(logging.ERROR)