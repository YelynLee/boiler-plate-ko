const { User } = require('../models/User');

let auth = (req, res, next) => {

    //Authentication(인증) 과정

    //client cookies.cookie name에서 token을 가져오기
    let token = req.cookies.x_auth;

    //User.js에서 진행한 findByUSer 이후, user가 있으면 authentication True
    //user가 없으면 authentication False, index.js의 middleware에서 빠져나가고 다음 진행X(next()X)
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({ isAuth: false, err: true })
        
        req.token = token; //index.js의 request에 현재의 token, user data를 전달
        req.user = user;
        next(); //index.js의 middleware로서 다음인 callback function으로 진행하기 위함

    })
}

module.exports = { auth };