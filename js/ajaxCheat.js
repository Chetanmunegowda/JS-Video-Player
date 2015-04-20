/*
	Refernce:
	http://www.w3schools.com/ajax/
	IIT ITMD565 Professor code
*/
var ajax = {}; //map ajax namespace
ajax.get = function(url, callback){
    var xmlhttp;
    
    //Create XMLHttpRquest Object
    xmlhttp = new XMLHttpRequest();

    //Check the request is complete and server status
    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
            callback(xmlhttp.responseText);
        }
    }

    //Three parameters - method,url to get,boolean status for asynchronous js
    xmlhttp.open("GET", url, true);

    //send the data and wait for ready state change
    xmlhttp.send();
}