const experss = require('express');
const app = experss();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mysql = require('mysql');
const bodyParser = require('body-parser');
let usersArr=[], onLineUser = [];
// const connection = mysql.createConnection({
//     host:'localhost',
//     user:'root',
//     password:'admin',
//     database:'website'
// });
//
// connection.connect();
// syncUser();
// function syncUser(){
//     let sql = 'SELECT * FROM userinfo';
//     connection.query(sql,function (err,result) {
//         if (err) {
//             console.error(err.message);
//             return;
//         }
//         usersArr = result;
//     });
// }
//
// let urlencodedParser = bodyParser.urlencoded({extended:false});
app.use('/', experss.static(__dirname + '/public'));
// app.get('/ajax/user', function (req, res) {
//     let username = req.query.username;
//     for (let i = 0; i < onLineUser.length; i++) {
//         if (username === onLineUser[i].name) {
//             res.end('false');
//         } else {
//             res.end('true');
//         }
//     }
// });

// app.post('/',urlencodedParser,function (req, res) {
//     let username = req.body.username;
//     let password = req.body.password;
//
//     let addSql = 'INSERT INTO userinfo(Id,username,password) VALUES(0,?,?)';
//     let addSqlParams = [username,password];
//     connection.query(addSql,addSqlParams,function (err,result) {
//         if (err) {
//             console.error(err.message);
//             res.end('false');
//             return;
//         }
//         res.end('true');
//     })
// });

io.on('connection', function (socket) {

    socket.on('chat message', function (data) {
        socket.broadcast.emit('chat message', {
            type: data.type,
            name: data.name,
            msg: data.msg,
            url: data.url
        });
    });
    socket.on('chat image',function (data) {
        socket.broadcast.emit('chat image',{
            type: data.type,
            name: data.name,
            msg: data.msg,
            url: data.url
        })
    });
    socket.on('login', function (user) {
        let username = user.name,url = user.url;
        for (let i = 0; i < onLineUser.length; i++) {
            if (username === onLineUser[i].name) {
                socket.emit('loginErr');
                return;
        }}
        usersArr.push(username);
        onLineUser.push({name: username, url:url});
        socket.nickname = username;
        socket.emit('loginSuc', {name: username, url:url});
        io.emit('displayuser', onLineUser);
    });
    socket.on('disconnect',function () {
        let index = usersArr.indexOf(socket.nickname);
        if (index > -1) {
            usersArr.splice(index,1);
            onLineUser.splice(index,1);
            io.emit('displayuser', onLineUser);
        }
    })
    // socket.on('reg',function (user) {
    //     let username = user.name,password = user.password,url ='img/'+user.url+'.jpg';
    //     let addSql = 'INSERT INTO userinfo(Id,username,password,url) VALUES(0,?,?,?)';
    //     let addSqlParams = [username,password,url];
    //     connection.query(addSql,addSqlParams,function (err) {
    //         if (err) {
    //             console.error(err.message);
    //             socket.emit('regErr')
    //         }
    //         onLineUser.push({name:username,url:url});
    //         socket.emit('regover',{name:username,url:url});
    //         io.emit('displayuser',onLineUser);
    //     })
    // })
});

http.listen(8080);
