(function () {
    const socket = io();
    let rnadom = (x) => Math.round(Math.random() * x);
    let textarea = document.getElementById('textarea');
    let send = document.getElementById('send');
    let dialog = document.getElementById('dialog');
    let shutdown = document.getElementById('shutdown');
    let username = document.getElementById('username');
    let head = document.getElementById('head');
    let tempSrc;
    let height;
    let upPic = document.getElementById('upPic');
    let expression = document.getElementById('expression');
    let expressionBox = document.getElementById('expressionBox');
    let emojiList = document.getElementById('emojiList').getElementsByTagName('li');
    // let password = document.getElementById('password');
    // let judge = document.getElementById('judge').getElementsByTagName('input');
    let loginBut = document.getElementById('but');
    let online = document.getElementById('online');
    let userlist = document.getElementById('userlist');
    const xmlhttp = new XMLHttpRequest();
    let users = [], //全部在新用户
        userInfo = {//本地登陆用户
            name: "",
            url: ""
        }, status = -1;

    //------------创建消息接收盒子，消息内容，头像链接地址，用户名。
    function createAcceptMsgDom(msg, url, username, type) {
        if (type === 'text') {
            let div1 = document.createElement('div');
            div1.setAttribute('class', 'other-people');
            let div2 = document.createElement('div');
            let img = document.createElement('img');
            img.setAttribute('src', url);
            let span = document.createElement('span');
            span.innerText = username;
            div2.appendChild(img);
            div2.appendChild(span);
            let p = document.createElement('p');
            p.innerText = msg;
            div1.appendChild(div2);
            div1.appendChild(p);
            dialog.appendChild(div1);
        } else if (type === 'image') {
            let div1 = document.createElement('div');
            div1.setAttribute('class', 'other-people');
            let div2 = document.createElement('div');
            let img = document.createElement('img');
            img.setAttribute('src', url);
            let span = document.createElement('span');
            span.innerText = username;
            div2.appendChild(img);
            div2.appendChild(span);
            let p = document.createElement('p');
            p.setAttribute('class', 'pic');
            let img2 = document.createElement('img');
            img2.setAttribute('src', msg);
            p.appendChild(img2);
            div1.appendChild(div2);
            div1.appendChild(p);
            dialog.appendChild(div1);
        }


    }

    //--------------创建一个消息发送盒子，消息内容。
    function createSendMsgDom(msg, type) {
        if (type === 'text') {
            let div1 = document.createElement('div');
            div1.setAttribute('class', 'me');
            let div2 = document.createElement('div');
            let img = document.createElement('img');
            img.setAttribute('src', userInfo.url);
            div2.appendChild(img);
            let p = document.createElement('p');
            p.innerText = msg;
            div1.appendChild(div2);
            div1.appendChild(p);
            dialog.appendChild(div1)
        } else if (type === 'image') {
            let div1 = document.createElement('div');
            div1.setAttribute('class', 'me');
            let div2 = document.createElement('div');
            let img = document.createElement('img');
            img.setAttribute('src', userInfo.url);

            div2.appendChild(img);
            let p = document.createElement('p');
            p.setAttribute('style','height:'+height+'px');
            p.setAttribute('class', 'pic');
            let img2 = document.createElement('img');
            img2.setAttribute('src', msg);
            p.appendChild(img2);
            div1.appendChild(div2);
            div1.appendChild(p);
            dialog.appendChild(div1);
            height = 0;
        }

    }

    //----------------创建在新用户信息列表，用户名，头像链接地址
    function createOnlineUserDom(username, url) {
        let li = document.createElement('li');
        let img = document.createElement('img');
        let p = document.createElement('p');
        img.setAttribute('src', url);
        p.innerText = username;
        li.appendChild(img);
        li.appendChild(p);
        userlist.appendChild(li);
    }

    //-----------------------------
    function createImg(url) {
        let img = document.createElement('img');
        img.setAttribute('src', url);
        textarea.appendChild(img);
    }

    //-----消息发送事件，类型，消息，用户名，头像连接地址。
    function sendMsg() {
        socket.emit('chat message', {
            type: 'text',
            msg: textarea.innerText,
            name: userInfo.name,
            url: userInfo.url
        })
    }

    function sendPic(src) {
        socket.emit('chat image', {
            type: 'image',
            msg: src,
            name: userInfo.name,
            url: userInfo.url
        })
    }

    shutdown.addEventListener('click', function () {
        document.getElementById('box').style.display = 'block';
    });

    upPic.addEventListener('change', function () {
        let image = this.files[0];
        let reade = new FileReader();

        reade.onerror = function () {
            alert('文件读取失败');
        };
        reade.onload = function () {
            let image = new Image();
            image.src = reade.result;
            image.addEventListener('load',function () {
                tempSrc = reade.result;
                createImg(tempSrc);
                height = (250/image.width)*image.height;
            });
        };
        reade.readAsDataURL(image)
    });
    //-----------------消息发送按钮点击事件。
    send.addEventListener('click', function () {
        if (!userInfo.name) {
            document.getElementById('box').style.display = 'none';
        } else if (userInfo.name) {
            if (textarea.getElementsByTagName('img').length>=1){
                createSendMsgDom(tempSrc, 'image');
                dialog.scrollTop = dialog.scrollHeight;
                sendPic(tempSrc);
                textarea.innerText = "";
                tempSrc = '';
                textarea.innerHTML = '';
                return false;
            } else {
                if (textarea.innerText === '') {
                    alert('请不要发送空内容!')
                } else {
                    createSendMsgDom(textarea.innerText,'text');
                    dialog.scrollTop = dialog.scrollHeight;
                    sendMsg();
                    textarea.innerText = "";
                    return false;
                }
            }

        }
    });
    //------在线人数事件。
    socket.on('displayuser', function (obj) {
        online.innerText = obj.length;
        userlist.innerHTML = "";
        for (let i = 0; i < obj.length; i++) {
            createOnlineUserDom(obj[i].name, obj[i].url)
        }
    });
    //-------接收消息事件
    socket.on('chat message', function (obj) {
        createAcceptMsgDom(obj.msg, obj.url, obj.name, obj.type);
        dialog.scrollTop = dialog.scrollHeight;

    });
    socket.on('chat image',function (obj) {
        createAcceptMsgDom(obj.msg,obj.url,obj.name,obj.type);
        setTimeout(function () {
            dialog.scrollTop = dialog.scrollHeight;
        },0);
    });
    //-------登陆成功事件
    socket.on('loginSuc', function (obj) {
        document.getElementById('box').style.display = 'block';
        userInfo.name = obj.name;
        userInfo.url = obj.url;
        head.getElementsByTagName('img')[0].setAttribute('src', obj.url);
        alert('登陆成功!');
    });
    //--------登陆失败事件
    socket.on('loginErr', function () {
        alert('用户名重复。')
    });
    //---------注册成功事件
    socket.on('regover', function (obj) {
        document.getElementById('box').style.display = 'block';
        userInfo.name = obj.name;
        userInfo.url = obj.url;
        alert('注册成功，记好密码哦！')
    });
    //-------------注册失败事件
    socket.on('regErr', function () {
        alert('服务器原因，注册失败！')
    });
    //--------用户名查重ajax
    // username.addEventListener('blur', function () {
    //     // if (status === -1&&judge[0].checked===false) {
    //         xmlhttp.onreadystatechange = function () {
    //             if (xmlhttp.readyState === 4 || xmlhttp.status === 200) {
    //                 if (xmlhttp.responseText === 'false') {
    //                     alert('该用户名已经被使用')
    //                 }
    //             }
    //         };
    //         xmlhttp.open('GET', 'http://127.0.0.1:8080/ajax/user?username=' + username.value, true);
    //         xmlhttp.send();
    //     // }
    // });
    loginBut.addEventListener('click', function () {
        if (username.value === '') {
            alert('请输入用户名再继续')
        } else {
            socket.emit('login', {
                name: username.value,
                url: 'img/' + index + '.jpg'
            })
        }

    });
    expression.addEventListener('click', function () {
        status *= -1;
        if (status === 1) {
            expressionBox.style.display = 'block';

        } else if (status === -1) {
            expressionBox.style.display = 'none';
        }
    });
    for (let i = 0; i < emojiList.length; i++) {
        emojiList[i].addEventListener('click', function () {
            textarea.innerText += emojiList[i].innerText;
            expressionBox.style.display = 'none';
            status *= -1;
        })
    }
    //-----------关闭注册界面

    //-----------切换注册和登陆状态
    // judge[0].addEventListener('click', function () {
    //     status *= -1;
    //     // if (judge[0].checked === true) { //判断用户状态
    //     //     loginBut.value = '登陆';
    //     //     loginBut.addEventListener('click', function () {
    //     //         if (username.value !== "") {
    //     //             socket.emit('login', {//触发登陆事件
    //     //                 name: username.value,
    //     //                 password: password.value,
    //     //             });
    //     //         } else {
    //     //             alert('请输入内容再继续!')
    //     //         }
    //     //     })
    //     // } else if (judge[0].checked === false) {//判断用户状态
    //     //     loginBut.value = '注册';
    //     //     username.addEventListener('blur', function () {//用户名查重
    //     //         xmlhttp.onreadystatechange = function () {
    //     //             if (xmlhttp.readyState === 4 || xmlhttp.status === 200) {
    //     //                 if (xmlhttp.responseText === 'false') {
    //     //                     alert('该用户名已经被使用')
    //     //                 }
    //     //             }
    //     //         };
    //     //         xmlhttp.open('GET', 'http://127.0.0.1:8080/ajax/user?username=' + username.value, true);
    //     //         xmlhttp.send();
    //     //     });
    //     //     loginBut.addEventListener('click', function () {//
    //     //         if (username.value == '' || password.value == '') {
    //     //             alert('请输入后继续');
    //     //         }else {
    //     //             socket.emit('reg',{//触发登陆事件
    //     //                 name:username.value,
    //     //                 password:password.value,
    //     //                 url: rnadom(35)
    //     //             })
    //     //         }
    //     //     })
    //     // }
    //     if (status === -1) {
    //         loginBut.value = '注册';
    //         loginBut.addEventListener('click', function () {//
    //             if (username.value === '' || password.value === '') {
    //                 alert('请输入后继续');
    //             }else {
    //                 socket.emit('reg',{//触发登陆事件
    //                     name:username.value,
    //                     password:password.value,
    //                     url: rnadom(35)
    //                 })
    //             }
    //         })
    //     }else if (status === 1) {
    //         loginBut.value = '登陆';
    //         loginBut.addEventListener('click', function () {
    //             if (username.value !== "") {
    //                 socket.emit('login', {//触发登陆事件
    //                     name: username.value,
    //                     password: password.value,
    //                 });
    //             } else {
    //                 alert('请输入内容再继续!')
    //             }
    //         })
    //     }
    // });


})();