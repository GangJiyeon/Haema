"use strict";

String.format = function() {
	var s = arguments[0];
	for (var i = 0; i < arguments.length - 1; i += 1) {
		var reg = new RegExp('\\{' + i + '\\}', 'gm');
		s = s.replace(reg, arguments[i + 1]);
	}
	return s;
};

/**
 * 유효성 체크
 */
var _validation = {};


/**
 * 정규식 검사에 사용할 정규식 패턴 값
 */
_validation.patterns = {
	'Password' : /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{9,16}$/,
	'Email' : /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9\-\_]+\.)+[a-zA-Z]{2,}))$/,
	'ID' : /^[A-Za-z\d\.\_\-\/]{1,200}$/,
	'FileName' : /^[\w ㄱ-ㅎㅏ-ㅣ가-힣-_\~\@\#\$\%\^\&\(\)\,\.\+\=\`\!\;\']+$/,
	'FileExtension' : /^[^.]+$/,
	'String' : /^[A-Za-z]+\/[A-Za-z]+$/,
	'ContentType' : /^[A-Za-z]+\/[A-Za-z]+$/,
	'English' : /^[a-zA-Z]+$/,
	'Ascii' : /^[\x00-\x7F]*$/,
	'Url' : /^(http|https|HTTP|HTTPS):\/\/((\*)|((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|((\*\.)?([a-zA-Z0-9-]+\.){0,5}[a-zA-Z0-9-][a-zA-Z0-9-]+\.[a-zA-Z]{2,63}?))(\:([0-9]{1,5})){0,}(\/([a-zA-Z0-9]{1,63})){0,}$/,
	'Number' : /^\d*$/
}

/**
 * 검색 기간 유효성 검사
 */
_validation.periodChecker = function(from, to) {
	
	var date1 = new Date(from).getTime;
	var date2 = new Date(to).getTime;
	console.log(date1.getTime() > date2.getTime());
	
	if(date1 >= date2) {
        alert("기간의 시작일은 종료일 이전 날짜로 선택해야 합니다.");
		return false;
	}
	
	return true;
}


/**
 * 선택 여부 검사
 */
_validation.selectChecker = function(count, subject) {
	
	if(count == 0) {
		// '{subject}' 값을 선택하세요.
        alert(String.format("'{0}' 값을 선택하세요.", subject));
		//cr.growl.showMessage("failure", String.format(cr.messages["Validation.count.select"], subject));
		return false;
	}
	
	return true;
}

/**
 * 입력 값 최소 길이 검사
 */
_validation.minLengthChecker = function(minLength, str, subject) {
	
	str = ( str || '');
	
	if(str.trim().length < minLength) {
		// {subject}의\n최소 입력 길이는 '{minLength}'입니다.
        alert(String.format("{0}의%n최소 입력 길이는 '{1}'입니다.", subject,minLength));
		//cr.growl.showMessage("failure", String.format(cr.messages["Validation.length.min"], subject, minLength));
		return false;
	} 
	return true;
}

/**
 * 입력 값 최대 길이 검사
 */
_validation.maxLengthChecker = function(maxLength, str, subject) {
	
	str = ( str || '');

	if(str.length > maxLength) {
		// {subject}의\n최대 입력 길이는 '{maxLength}'입니다.
        alert(String.format("{0}의%n최대 입력 길이는 '{1}'입니다.", subject,maxLength));
		//cr.growl.showMessage("failure", String.format(cr.messages["Validation.length.max"], subject, maxLength));
		return false;
	}
	
	return true;
}

/**
 * input 값 입력 여부 체크
 */
_validation.nullLengthChecker = function(str, subject) {

	str = ( str || '');
	
	if(str.trim().length === 0) {
		// '{subject}' 값을 입력하세요.
        alert(String.format("'{0}' 값을 입력하세요.", subject));
		//cr.growl.showMessage("failure", String.format(cr.messages["Validation.length.null"], subject));
		return false;
	} 
	
	return true;
}

/**
 * 입력값 최대길이, 최소길이 검사
 */
_validation.bothLengthChecker = function(minLength, maxLength, str, subject) {
	
	str = ( str || '');
	
	if(str.trim().length < minLength || str.length > maxLength) {
		// {subject}의\n입력 길이는 최소 {minLength}, 최대 {maxLength}입니다.
        alert(String.format("{0}의%n입력 길이는 최소 {1}, 최대 {2}입니다.", subject, minLength, maxLength));
		//cr.growl.showMessage("failure", String.format(cr.messages["Validation.length.both"], subject, minLength, maxLength));
		return false;
	}
	
	return true;
}

/**
 * 입력값 정규식 검사
 */
_validation.patternChecker = function(key, obj, subject, desc, bandWidth) {

	desc = (desc || '');
	
	
	if(!_validation.patterns[key].test(obj)) {
		// {subject}의\n잘못된 {key} 형식입니다.{desc}
        alert(String.format("{0}의%n잘못된 {1} 형식입니다.{2}", subject, key, desc));
		//cr.growl.showMessage("failure", String.format(cr.messages["Validation.regex.format"], subject, key, desc));
		return false;
	}
	
	return true;
}