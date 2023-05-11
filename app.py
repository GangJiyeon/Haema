from flask import Flask, render_template, request, jsonify
import jinja2


app = Flask(__name__)

from logging.config import dictConfig


app.secret_key = "1234wgh-9-#11dd"

'''
페이지 렌더링 url 형식 : /경로
데이터 베이스 조회 url 형식 : /v1/경로
기타 url 형식 : /v2/경로
'''



if __name__ == "__main__":
    app.run(debug=False, port=8080)