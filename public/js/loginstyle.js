let index = 13;
(function () {
    let allHead = document.getElementById('allHead');
    let userava = document.getElementById('userava');
    let li = document.getElementById('allHeadList').getElementsByTagName('li');
    userava.addEventListener('click',function () {
        allHead.style.display = 'block';
        let newanimation = new Animation('#allHead');
        newanimation.move([-300,3,1],600,'easeOutBounce')
    });
    for (let i = 0; i < li.length; i++) {
        li[i].addEventListener('click',function () {
            console.log(i);
            userava.setAttribute('src','img/'+(i+1)+'.jpg');
            index = (i+1);
            let newanimation = new Animation('#allHead');
            newanimation.move([3,-300,1],1000,'easeOutExpo')
        })
    }
})();