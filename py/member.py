from flask import jsonify, session
from py.db import config

import pymssql

server = config.server
user = config.user
password = config.password
database = config.database

# mssql 접속
def dbconnect():
    conn = pymssql.connect(server, user, password, database)
    return conn

# 로그인 세션 체크
def session_check():
    res = "null"
    if 'user_info' in session:
        res =  session['user_info']
    print(res)
    return jsonify(res)


# 로그인
def login(id, pw):
    query = "SELECT * FROM user_account WHERE user_id = %s AND user_pw = %s"
    conn = dbconnect()
    cursor = conn.cursor()
    cursor.execute(query, (id, pw))
    array = []
    row = cursor.fetchone()

    if(row == None):
        res = "null"
    else:
        while row:
            user_id = row[0].encode('ISO-8859-1').decode('euc-kr')
            user_pw = row[1].encode('ISO-8859-1').decode('euc-kr')
            user_name = row[2].encode('ISO-8859-1').decode('euc-kr')

            array_item = {"user_id":user_id, "user_pw":user_pw, "user_name": user_name}
            array.append(array_item)
            row = cursor.fetchone()
        res = array
        
    conn.close()

    if(res != "null"):
        session['user_info'] = res

    print(res)
    return jsonify(res)


# 사용자 검색
def search_user_info(search_item):

    query = "SELECT * FROM user_account WHERE user_id = %s or user_name = %s"
    conn = dbconnect()
    cursor = conn.cursor()
    cursor.execute(query, (search_item, search_item))
    array = []
    row = cursor.fetchone()

    if(row == None):
        res = "null"
    else:
        while row:
            user_id = row[0].encode('ISO-8859-1').decode('euc-kr')
            user_pw = row[1].encode('ISO-8859-1').decode('euc-kr')
            user_name = row[2].encode('ISO-8859-1').decode('euc-kr')
            user_postion = row[3].encode('ISO-8859-1').decode('euc-kr')

            array_item = {"user_id":user_id, "user_pw":user_pw, "user_name": user_name, "user_postion":user_postion}
            array.append(array_item)
            row = cursor.fetchone()
        res = array
        
    conn.close()

    return jsonify(res)

# 사용자 추가
def insert_user_info(user_id, user_pw, user_name, user_position):

    query = "INSERT into user_account (user_id, user_pw, user_name, user_position) values (%s, %s, %s, %s)"
    conn = dbconnect()
    cursor = conn.cursor()
    cursor.execute(query, (user_id, user_pw, user_name, user_position))
    conn.commit()
    
    conn.close()


# 사용자 수정
def update_user_info(user_id, user_pw, user_name, user_position):

    query = "UPDATE user_account set user_pw=%s, user_name=%s, user_position=%s WHERE user_id=%s"
    conn = dbconnect()
    cursor = conn.cursor()
    cursor.execute(query, (user_pw, user_name, user_position, user_id))
    conn.commit()
    
    conn.close()

# 사용자 삭제
def delete_user_info(user_id):

    query = "UPDATE user_account set account_state=%s WHERE user_id=%s"
    conn = dbconnect()
    cursor = conn.cursor()
    cursor.execute(query, ("0", user_id))
    conn.commit()
    
    conn.close()


# 로그아웃
def logout():
    session.pop('user_info',None)


# 사용자 정보 조회
def select_member_list(page_no):
    query = "SELECT * FROM user_account WHERE account_state = %s ORDER BY user_id ASC OFFSET %s ROWS FETCH NEXT 10 ROWS ONLY"
    conn = dbconnect()
    cursor = conn.cursor()
    cursor.execute(query, ("1", page_no-1))
    array = []
    row = cursor.fetchone()

    if(row == None):
        res = "null"
    else:
        while row:
            user_id = row[0].encode('ISO-8859-1').decode('euc-kr')
            user_pw = row[1].encode('ISO-8859-1').decode('euc-kr')
            user_name = row[2].encode('ISO-8859-1').decode('euc-kr')
            user_postion = row[3].encode('ISO-8859-1').decode('euc-kr')

            array_item = {"user_id":user_id, "user_pw":user_pw, "user_name": user_name, "user_postion":user_postion}
            array.append(array_item)
            row = cursor.fetchone()
        res = array
        
    conn.close()


    return res


# 사용자 수 확인
def count_member_list():
    query = "SELECT COUNT(*) FROM user_account WHERE account_state = %s"
    conn = dbconnect()
    cursor = conn.cursor()
    cursor.execute(query, ("1"))
    row = cursor.fetchone()
    conn.close()
    return row[0]