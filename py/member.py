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



# 로그아웃
def logout():
    session.pop('user_info',None)


