const hostname = "0.0.0.0";
const port = "3000";

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const mysql = require('mysql');
const con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "wjdxhd2018",
	database: "Hanium"
});

app.use(express.json());
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//read
app.get("/", function(req, res, next) {
	console.log("home");
	res.send("Hello, World!");

});
app.get("/path",function(req, res, next) {
	console.log("path");
	res.render('daum_address');
});
app.get("/safemap", function(req, res, next) {
	console.log("safeMap");
	res.render('safemap');
});
app.post("/emergency",function(req,res,next){
	console.log("emergency");
	var inputData;
//	console.log(req.param("id"));
	req.on('data',(data)=>{
		console.log(data);
		inputData=JSON.parse(data);
		var uuid=inputData.uuid;
		console.log(uuid);
		var sql='SELECT name,ecPhone from user WHERE uuid=?';
		con.query(sql,uuid,function(err,result,fields){
			if(err) throw err;
			else{
				console.log(result);
				res.send(JSON.stringify(result[0]));
			}
		});
	});
});
app.post('/', (req, res) => {
	var inputData;

	req.on('data', (data) => {
		inputData = JSON.parse(data);
		console.log(inputData.name+"access post");
		var sql = 'INSERT INTO user (uuid, myPhone, ecPhone, machineId, name) VALUES(?,?,?,?,?) ON DUPLICATE KEY UPDATE myPhone=?,ecPhone=?,machineId=?,name=?';
		var uuid = inputData.uuid,
		myPhone = inputData.myPhone,
		ecPhone = inputData.ecPhone,
		machineId = inputData.machineId,
		name = inputData.name;
		var params = [uuid, myPhone, ecPhone, machineId, name, myPhone, ecPhone, machineId, name];
		con.query(sql,params,function(err, result, fields) {
			if(err) throw err;
			else
				console.log(result);
		});
	});
	res.send({result: "등록되었습니다."});
	res.end();
});

const server = app.listen(port, hostname, () => {
	console.log(`Server running at http:${hostname}:${port}/`);
});
