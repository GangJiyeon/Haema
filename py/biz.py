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

# 업체 수 확인
def count_biz_list():
    query = "SELECT COUNT(*) FROM biz_list WHERE gubun_del = 1"
    conn = dbconnect()
    cursor = conn.cursor()
    cursor.execute(query, ("1"))
    row = cursor.fetchone()
    conn.close()
    return row[0]

# 업체 목록 조회 (10개)
def select_biz_list_10(page_no, count):
    query = '''SELECT biz_code, biz_name, gubun_sel, naver_biz_code, bank_name, account_name, account_number, homepage_url 
                FROM biz_list 
                WHERE gubun_del = 1
                ORDER BY insert_date DESC
                OFFSET %s
                ROWS FETCH NEXT %s ROWS ONLY;'''

    conn = dbconnect()
    cursor = conn.cursor()
    cursor.execute(query, (page_no-1, count))
    array = []
    row = cursor.fetchone()

    if(row == None):
        res = "null"
    else:
        while row:
            biz_code = row[0].encode('ISO-8859-1').decode('euc-kr')
            biz_name = row[1].encode('ISO-8859-1').decode('euc-kr')
            gubun_sel = row[2].encode('ISO-8859-1').decode('euc-kr')
            naver_biz_code = row[3].encode('ISO-8859-1').decode('euc-kr')
            bank_name = row[4].encode('ISO-8859-1').decode('euc-kr')
            account_name = row[5].encode('ISO-8859-1').decode('euc-kr')
            account_number = row[6].encode('ISO-8859-1').decode('euc-kr')
            homepage_url = row[7].encode('ISO-8859-1').decode('euc-kr')   

            array_item = {"biz_code":biz_code, "biz_name":biz_name, "gubun_sel": gubun_sel, "naver_biz_code":naver_biz_code,
                          "bank_name":bank_name,"account_name":account_name,"account_number":account_number,"homepage_url":homepage_url}
            
            array.append(array_item)
            row = cursor.fetchone()
        res = array
        
    conn.close()

    return res

# 업체 목록 전체 조회
def select_biz_list():
    query = '''SELECT biz_code, biz_name, gubun_sel, naver_biz_code, bank_name, account_name, account_number, homepage_url 
                FROM biz_list 
                WHERE gubun_del = 1;'''

    conn = dbconnect()
    cursor = conn.cursor()
    cursor.execute(query)
    array = []
    row = cursor.fetchone()

    if(row == None):
        res = "null"
    else:
        while row:
            biz_code = row[0].encode('ISO-8859-1').decode('euc-kr')
            biz_name = row[1].encode('ISO-8859-1').decode('euc-kr')
            gubun_sel = row[2].encode('ISO-8859-1').decode('euc-kr')
            naver_biz_code = row[3].encode('ISO-8859-1').decode('euc-kr')
            bank_name = row[4].encode('ISO-8859-1').decode('euc-kr')
            account_name = row[5].encode('ISO-8859-1').decode('euc-kr')
            account_number = row[6].encode('ISO-8859-1').decode('euc-kr')
            homepage_url = row[7].encode('ISO-8859-1').decode('euc-kr')   

            array_item = {"biz_code":biz_code, "biz_name":biz_name, "gubun_sel": gubun_sel, "naver_biz_code":naver_biz_code,
                          "bank_name":bank_name,"account_name":account_name,"account_number":account_number,"homepage_url":homepage_url}
            
            array.append(array_item)
            row = cursor.fetchone()
        res = array
        
    conn.close()

    return jsonify(res)


# 업체 정보 조회(단일)
def select_biz_item(biz_code):
    query = '''SELECT biz_code, biz_name, gubun_sel, naver_biz_code, bank_name, bank_name, account_number, homepage_url 
                FROM biz_list 
                WHERE biz_code = %s;'''

    conn = dbconnect()
    cursor = conn.cursor()
    cursor.execute(query,(biz_code))
    array = []
    row = cursor.fetchone()

    if(row == None):
        res = "null"
    else:
        while row:
            biz_code = row[0].encode('ISO-8859-1').decode('euc-kr')
            biz_name = row[1].encode('ISO-8859-1').decode('euc-kr')
            gubun_sel = row[2].encode('ISO-8859-1').decode('euc-kr')
            naver_biz_code = row[3].encode('ISO-8859-1').decode('euc-kr')
            bank_name = row[4].encode('ISO-8859-1').decode('euc-kr')
            account_name = row[5].encode('ISO-8859-1').decode('euc-kr')
            account_number = row[6].encode('ISO-8859-1').decode('euc-kr')
            homepage_url = row[7].encode('ISO-8859-1').decode('euc-kr')   

            array_item = {"biz_code":biz_code, "biz_name":biz_name, "gubun_sel": gubun_sel, "naver_biz_code":naver_biz_code,
                          "bank_name":bank_name,"account_name":account_name,"account_number":account_number,"homepage_url":homepage_url}
            
            array.append(array_item)
            row = cursor.fetchone()
        res = array
        
    conn.close()

    return jsonify(res)



# 업체 정보 수정
def update_biz_info(biz_code,biz_name,gubun_sel,naver_biz_code,bank_name,account_name,account_number,homepage_url):

    query = '''UPDATE biz_list 
                SET biz_name=%s, gubun_sel=%s, naver_biz_code=%s, bank_name=%s, account_name=%s, account_number=%s, homepage_url=%s
                WHERE biz_code=%s;'''
    
    conn = dbconnect()
    cursor = conn.cursor()
    cursor.execute(query, (biz_name, gubun_sel, naver_biz_code, bank_name, account_name, account_number, homepage_url, biz_code))
    conn.commit()
    
    conn.close()


# 업체 추가
def insert_biz_info(biz_code,biz_name,gubun_sel,naver_biz_code,bank_name,account_name,account_number,homepage_url):

    query = "INSERT into biz_list (biz_code, biz_name, gubun_sel, naver_biz_code, bank_name, account_name, account_number, homepage_url) values (%s, %s, %s, %s, %s, %s, %s, %s)"
    conn = dbconnect()
    cursor = conn.cursor()
    cursor.execute(query, (biz_code, biz_name, gubun_sel, naver_biz_code, bank_name, 
                           account_name, account_number, homepage_url))
    conn.commit()
    
    conn.close()


# 업체 삭제
def delete_biz_info(biz_code):

    query = '''UPDATE biz_list 
                SET gubun_del=%s
                WHERE biz_code=%s;'''
    
    conn = dbconnect()
    cursor = conn.cursor()
    cursor.execute(query, (0, biz_code))
    conn.commit()
    
    conn.close()
