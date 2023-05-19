import json
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
def select_product_list(page_no, count):
    
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
            ORDER BY T.id desc
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



    return res


# 상품 단건 조회
def select_product_item(id):
    
    query = '''SELECT  b.id,
                b.businessCode,
                b.bizItemName,
                CONVERT(CHAR(10), b.impstartdatetimestart, 23) AS impStartDateTimeStart,
                CONVERT(CHAR(10), b.impstartdatetimeend, 23)   AS impStartDateTimeEnd,
                t.biz_name                                    AS businessName,
                bid.id AS bidId,
                bid.time AS time,
                bid.adultPriceName AS adultPriceName,
                bid.adultNormalPrice AS adultNormalPrice,
                bid.adultPrice AS adultPrice,
                bid.childPriceName AS childPriceName,
                bid.childNormalPrice AS childNormalPrice,
                bid.childPrice AS childPrice,
                bid.toddlerPriceName AS toddlerPriceName,
                bid.toddlerNormalPrice AS toddlerNormalPrice,
                bid.toddlerPrice AS toddlerPrice,
                bid.stock AS stock
                FROM BIZ_ITEM b
                JOIN biz_list t ON b.businesscode = t.biz_code
                JOIN BIZ_ITEM_DETAIL bid ON b.id = bid.bizItemId
                WHERE b.id = %d
                ORDER BY b.id ASC'''
    

    conn = dbconnect()
    cursor = conn.cursor()

    cursor.execute(query, (int(id)))
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
            time = row[7].encode('ISO-8859-1').decode('euc-kr')

            adultPriceName = row[8].encode('ISO-8859-1').decode('euc-kr')
            adultNormalPrice = row[9]
            adultPrice = row[10]

            childPriceName = row[11].encode('ISO-8859-1').decode('euc-kr')
            childNormalPrice = row[12]
            childPrice = row[13]

            toddlerPriceName = row[14].encode('ISO-8859-1').decode('euc-kr')
            toddlerNormalPrice = row[15]
            toddlerPrice = row[16]

            stock = row[17]

            array_item = {"id":id,
                          "businessName":businessName, 
                          "bizItemName":bizItemName, "impStartDateTimeStart": impStartDateTimeStart, "impStartDateTimeEnd":impStartDateTimeEnd, "time":time, 
                          "adultPriceName":adultPriceName, "adultPrice":adultPrice, "adultNormalPrice":adultNormalPrice,
                          "childPriceName":childPriceName, "childPrice":childPrice, "childNormalPrice":childNormalPrice,
                          "toddlerPriceName":toddlerPriceName, "toddlerNormalPrice":toddlerNormalPrice, "toddlerPrice":toddlerPrice, 
                          "stock":stock}
            print(array_item)
            array.append(array_item)
            
            row = cursor.fetchone()
        res = array
        
    conn.close()



    return jsonify(res)

# 상품 정보 수정
def update_product_item(id, bizItemName, impStartDateTimeStart, impStartDateTimeEnd, param):
    
    query ='''UPDATE BIZ_ITEM 
                SET bizItemName=%s, 
                impStartDateTimeStart=%s, 
                impStartDateTimeEnd=%s  
                WHERE id=%d;
            '''
    
    conn = dbconnect()
    cursor = conn.cursor()
    cursor.execute(query, (bizItemName, impStartDateTimeStart, impStartDateTimeEnd, int(id)))
    conn.commit()
    conn.close()

# 상품 세부 정보 수정
def update_product_detail(param):
    param = json.loads(param)

    for i in range(len(param)):
        time = param[i]['time']

        adultPriceName = param[i]['adultPriceName']
        adultNormalPrice = param[i]['adultNormalPrice']
        adultPrice = param[i]['adultPrice']

        childPriceName = param[i]['childPriceName']
        childNormalPrice = param[i]['adultNormalPrice']
        childPrice = param[i]['childPrice']

        toddlerPriceName = param[i]['toddlerPriceName']
        toddlerNormalPrice = param[i]['toddlerNormalPrice']
        toddlerPrice = param[i]['toddlerPrice']
        stock = param[i]['stock']
        id = param[i]['bid']

        print(adultPriceName)
        print(id)

        query ='''UPDATE BIZ_ITEM_DETAIL
                    SET time = %s, 
                    adultPriceName = %s, 
                    adultNormalPrice = %d, 
                    adultPrice = %d, 
                    childPriceName = %s, 
                    childNormalPrice = %d, 
                    childPrice = %d, 
                    toddlerPriceName = %s, 
                    toddlerNormalPrice = %d, 
                    toddlerPrice = %d, 
                    stock = %d
                    WHERE id = %d
                '''
        
        conn = dbconnect()
        cursor = conn.cursor()
        cursor.execute(query, (time, adultPriceName, adultNormalPrice, adultPrice, childPriceName, childNormalPrice, childPrice, toddlerPriceName, childPrice, toddlerNormalPrice, toddlerPrice, stock, id))
        conn.commit()
        conn.close()

# 상품 삭제
def delete_product(id):

    conn = dbconnect()
    cursor = conn.cursor()

    query = '''DELETE 
                FROM BIZ_ITEM
                WHERE id = %d'''
    cursor.execute(query, (id))
    conn.commit()
    conn.close()

    conn = dbconnect()
    cursor = conn.cursor()

    query = '''DELETE 
                FROM BIZ_ITEM_DETAIL
                WHERE bizItemId = %d'''
    cursor.execute(query, (id))
    conn.commit()
    conn.close()