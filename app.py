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



# ============================================================================= #
# 사용자 관리 - member
# ============================================================================= #

# 사용자 관리 페이지
@app.route("/member")
def view_member():
    # 페이지네이션 
    pgn = member.count_member_list()
    pgn = (pgn-1)//10 + 1 

    page_no = request.args.get('page_no')

    # 사용자 리스트
    member_list = member.select_member_list(int(page_no))

    return render_template('member/member.html', pgn = pgn, member_list = member_list, page_no = page_no)

# 사용자 등록 페이지
@app.route("/member/insert")
def view_member_insert():
    return render_template('member/member_insert.html')

# 사용자 수정 페이지
@app.route("/member/update", methods=['GET'])
def view_member_update():
    user_id = request.args.get('user_id')
    return render_template('member/member_update.html', user_id=user_id)


# [사용자 조회]
@app.route("/v1/member/list")
def member_list():
    res = member.select_member_list()
    return res

# [사용자 검색]
@app.route("/v1/member/search")
def member_search():
    search_item = request.args.get('search_item')
    res = member.search_user_info(search_item)
    return res

# [사용자 등록]
@app.route("/v1/member/insert", methods=['POST'])
def member_insert():
    user_id = request.form['user_id']
    user_pw = request.form['user_pw']
    user_name = request.form['user_name']
    user_position = request.form['user_position']
    member.insert_user_info(user_id, user_pw, user_name, user_position)

    res = member.search_user_info(user_id)
    return res

# [사용자 수정]
@app.route("/v1/member/update", methods=['POST'])
def memeber_update():
    user_id = request.form['user_id']
    user_pw = request.form['user_pw']
    user_name = request.form['user_name']
    user_position = request.form['user_position']
    member.update_user_info(user_id, user_pw, user_name, user_position)

    res = member.search_user_info(user_id)
    return res

# [사용자 삭제]
@app.route("/v1/member/delete")
def member_delete():
    user_id = request.args.get('user_id')
    member.delete_user_info(user_id)
    res = member.search_user_info(user_id)

    return res

    
# [아이디 중복 체크]
@app.route("/v1/check/id", methods=['GET'])
def id_check():
    user_id = request.args.get('user_id')
    res = member.search_user_info(user_id)
    print(res)
    return res

if __name__ == "__main__":
    app.run(debug=False, port=8080)