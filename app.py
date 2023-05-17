from flask import Flask, render_template, request, jsonify
from py import member
from py import biz

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
    total = member.count_member_list() #11
    pgn = (total-1)//10 + 1 #2

    if(request.args.get('page_no') == None):
        page_no = 1
    else:
        page_no = int(request.args.get('page_no'))

    count = 10

    if(page_no == pgn):
        count = total % 10 

    # 사용자 리스트
    member_list = member.select_member_list(int(page_no), count)

    return render_template('member/member.html', pgn = pgn, member_list = member_list, page_no = page_no, info = "/member")

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





# ============================================================================= #
# 업체관리 - business
# ============================================================================= #

# 업체목록 페이지
@app.route("/biz/list")
def view_biz_list():

    total = biz.count_biz_list()
    pgn = (total-1)//10 + 1 
    if(request.args.get('page_no') == None):
        page_no = 1
    else:
        page_no = int(request.args.get('page_no'))

    count = 10

    if(page_no == pgn):
        count = total % 10 

    biz_list = biz.select_biz_list_10(int(page_no), count)
    
    return render_template('business/biz_list.html',pgn = pgn, biz_list = biz_list, page_no = page_no, info = "/biz/list")

# 네이버 업체목록 페이지
@app.route("/biz/naver/list")
def view_biz_naver_list():
    return render_template('business/biz_naver_list.html')

# 업체등록 페이지
@app.route("/biz/insert")
def view_biz_insert():
    return render_template('business/biz_insert.html')

# 업체정보 수정 페이지
@app.route("/biz/update")
def view_biz_update():
    return render_template('business/biz_update.html')

# [업체목록 조회]
@app.route("/v1/biz/list")
def biz_list():
    res = biz.select_biz_list()
    return res

# [업체정보 조회]
@app.route("/v1/biz/item")
def biz_item():
    biz_code = request.args.get('biz_code')
    res = biz.select_biz_item(biz_code)
    return res

# [업체정보 수정]
@app.route("/v1/biz/update", methods=['POST'])
def biz_update():
    biz_code = request.form['biz_code']
    biz_name = request.form['biz_name']
    gubun_sel = request.form['gubun_sel']
    naver_biz_code = request.form['naver_biz_code']
    bank_name = request.form['bank_name']
    account_name = request.form['account_name']
    account_number = request.form['account_number']
    homepage_url = request.form['homepage_url']

    biz.update_biz_info(biz_code,biz_name,gubun_sel,naver_biz_code,bank_name,account_name,account_number,homepage_url)

    return "success"


# [업체코드 조회]
@app.route("/v1/biz_code_check")
def biz_code():
    biz_code = request.args.get('biz_code')
    res = biz.select_biz_item(biz_code)
    return res


# [업체정보 등록]
@app.route("/v1/biz/insert", methods=['POST'])
def biz_insert():

    biz_code = request.form['biz_code']

    biz_name = request.form['biz_name']
    gubun_sel = request.form['gubun_sel']
    naver_biz_code = request.form['naver_biz_code']
    bank_name = request.form['bank_name']
    account_name = request.form['account_name']
    account_number = request.form['account_number']
    homepage_url = request.form['homepage_url']

    print(biz_code)
    biz.insert_biz_info(biz_code,biz_name,gubun_sel,naver_biz_code,
                              bank_name,account_name,account_number,homepage_url)

    return "success"


# [업체정보 삭제]
@app.route("/v1/biz/delete", methods=['POST'])
def biz_delete():

    biz_code = request.form['biz_code']

    print(biz_code)
    biz.delete_biz_info(biz_code)

    return "success"







if __name__ == "__main__":
    app.run(debug=False, port=8080)