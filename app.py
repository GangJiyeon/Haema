from flask import Flask, render_template, request, jsonify
from py import member

import jinja2


app = Flask(__name__)

from logging.config import dictConfig


app.secret_key = "1234wgh-9-#11dd"

'''
페이지 렌더링 url 형식 : /경로
데이터 베이스 조회 url 형식 : /v1/경로
기타 url 형식 : /v2/경로
'''

# ============================================================================= #
# 로그인
# ============================================================================= #


# 로그인 페이지
@app.route("/")
def view_index():
    return render_template('member/login.html')

# 로그인 페이지
@app.route("/login")
def view_login():
    return render_template('member/login.html')

# 로그인
@app.route("/login_check", methods=['GET'])
def login():
    user_id = request.args.get('user_id')
    user_pw = request.args.get('user_pw')
    res = member.login(user_id, user_pw)
    print(res)
    return res

# 로그인 상태 체크
@app.route("/v2/login/status", methods=['GET'])
def login_status():
    res = member.session_check()
    return res

# 로그아웃
@app.route("/v2/logout", methods=['GET'])
def logout():
    member.logout()
    return "true"



if __name__ == "__main__":
    app.run(debug=False, port=8080)