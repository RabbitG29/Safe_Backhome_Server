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

//read
app.get("/", function(req, res, next) {
	console.log("home");
	param = {name:'안전녹색길(밤) 20시 ~ 24시(전체)', 
	serverUrl:'www.safemap.go.kr/sm/apis.do?apikey=[APIKEY]',
	layername:'A2SM_CRMNLHSPOT_TM6_TOT_G',
	styles:'A2SM_CrmnlHspot_Tm6_Tot'};
	var wmsLayer = new OpenLayers.Layer.WMS( param.name, param.serverUrl,
	{layers: ''+param.layername, 
	styles:param.styles,
	format: 'image/png', 
	exceptions:'text/xml',
	transparent: true},
	{isBaseLayer: false});
	res.send(wmsLayer);
	});

app.post('/', (req, res) => {
		console.log('who get in here post /users');
		var inputData;

		req.on('data', (data) => {
			inputData = JSON.parse(data);
			console.log(inputData);
			var sql = 'INSERT INTO user VALUES(?,?,?,?,?)';
			var uuid = inputData.uuid,
			myPhone = inputData.myPhone,
			ecPhone = inputData.ecPhone,
			machineId = inputData.machineId,
			name = inputData.name;
			console.log(name);
			var params = [uuid, myPhone, ecPhone, machineId, name];
			con.query(sql,params,function(err, result, fields) {
				if(err) throw err;
				else
				console.log(result);
				});
			});
		res.write({result: "등록되었습니다."});
		res.end();
});

const server = app.listen(port, hostname, () => {
		console.log(`Server running at http:${hostname}:${port}/`);
		});
