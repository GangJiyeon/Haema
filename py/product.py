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

# 상품등록
def product_insert(businessCode, bizItemName,impStartDateTimeStart,impStartDateTimeEnd,param):
    query = "SELECT * FROM user_account WHERE user_id = %s AND user_pw = %s"
    conn = dbconnect()
    cursor = conn.cursor()
    cursor.execute(query, (id))
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



    return jsonify(res)

# 상품 정보 조회
def select_product_list():
    
    query = '''SELECT T.id as id, 
            T.businessCode AS businessCode, 
            T.bizitemName AS bizItemName,
            T.impStartDateTimeStart AS impStartDateTimeStart,
            T.impStartDateTimeEnd AS impStartDateTimeEnd,
            T.businessName AS businessName,
            T.time AS time,
            bid.adultNormalPrice AS adultNormalPrice,
            bid.adultPrice AS adultPrice,
            bid.childNormalPrice AS childNormalPrice,
            bid.childPrice AS childPrice,
            bid.toddlerNormalPrice AS toddlerNormalPrice,
            bid.toddlerPrice AS toddlerPrice,
            bid.stock AS stock
            FROM
            (SELECT b.id,
                    b.businessCode,
                    b.bizitemName AS bizItemName,
                    CONVERT(CHAR(10), b.impstartdatetimestart, 23) AS impStartDateTimeStart,
                    CONVERT(CHAR(10), b.impstartdatetimeend, 23)   AS impStartDateTimeEnd,
                    t.biz_name                                    AS businessName,
                    string_agg(bid.time, ', ') AS time,
                    MIN(bid.id) minId
            FROM biz_list t
            LEFT JOIN BIZ_ITEM b ON b.businesscode = t.biz_code
            LEFT JOIN BIZ_ITEM_DETAIL bid ON bid.bizItemId = b.id
            WHERE  b.delstate = 1
            GROUP BY b.id,  b.businesscode, b.bizitemname, b.impstartdatetimestart,  b.impstartdatetimeend, t.biz_name, b.regdate
            ) T
            LEFT JOIN BIZ_ITEM_DETAIL bid ON T.minId = bid.id
            ORDER BY T.id desc;'''
    

    conn = dbconnect()
    cursor = conn.cursor()
    cursor.execute(query, ("1"))
    array = []
    row = cursor.fetchone()


  
    if(row == None):
        res = "null"
    else:
        while row:
            id = row[0]
            businessName = row[5].encode('ISO-8859-1').decode('euc-kr')
            bizItemName = row[2].encode('ISO-8859-1').decode('euc-kr')
            impStartDateTimeStart = row[3].encode('ISO-8859-1').decode('euc-kr')
            impStartDateTimeEnd = row[4].encode('ISO-8859-1').decode('euc-kr')
            time = row[6].encode('ISO-8859-1').decode('euc-kr')
            adultPrice = row[8]
            childPrice = row[10]
            toddlerPrice = row[12]
            stock = row[13]

            array_item = {"id":id,
                          "businessName":businessName, 
                          "bizItemName":bizItemName, "impStartDateTimeStart": impStartDateTimeStart, "impStartDateTimeEnd":impStartDateTimeEnd, "time":time, "adultPrice":adultPrice,"childPrice":childPrice,"toddlerPrice":toddlerPrice, "stock":stock}
            print(array_item)
            array.append(array_item)
            
            row = cursor.fetchone()
        res = array
        
    conn.close()



    return jsonify(res)

