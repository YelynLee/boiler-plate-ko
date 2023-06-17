const express = require('express') /*express 모듈을 가져오기*/
const app = express() /*express function을 통해 새로운 express app 생성*/
const port = 5000
const bodyParser = require('body-parser'); //bodyParser 가져오기
const cookieParser = require('cookie-parser'); //cookieParser 가져오기
const config = require('./config/key'); //config folder 중 key file 가져오기
const { auth } = require('./middleware/auth'); //exported된 auth 가져오기
const { User } = require('./models/User'); //exported된 User model 가져오기

//application/x-www-form-urlencoded 가져오기
app.use(bodyParser.urlencoded({extended: true}));

//application/json 가져오기
app.use(bodyParser.json());
//application/cookie 가져오기
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongDB Connected...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => res.send('Hello World!'))
/*루트 directory에 오면 app이 'Hello World!' 출력*/

app.post('/api/users/register', (req, res) => {
  //client(postman)에 입력된 회원 정보를 body-parser가 server에서 가져오면 req.body로 저장 
  //이를 database에 넣어주기

  const user = new User(req.body) //instance 생성

  user.save((err, userInfo) => {
    if(err) return res.json({ success: false, err})
    return res.status(200).json({ success: true })
  })
  
  //User model에 회원 정보를 저장
  //몽고DB method(save)에 callback function; 저장 시 에러가 있으면 err 메시지
                                                  //성공하면 status(200)

})

app.post('/api/users/login', (req, res) => {

  //요청된 이메일이 database에 있는지 찾기
  User.findOne({email: req.body.email}, (err, user) => {
    if(!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }

  //요청된 이메일이 database에 있다면, 비밀번호가 맞는지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch)
        return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})
  
  //비밀번호까지 맞다면 token 생성
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err); //실패하면 status(400)를 client에 전달

        //token을 storage(cookies, local storage...)에 저장 -> cookies에 저장
          res.cookie("x_auth", user.token) //"x_auth"는 name, user.token은 value
          .status(200) //성공
          .json({ loginSuccess: true, userId: user._id })

      })

    
    })


  })


})


app.get('/api/users/auth', auth, (req, res) => {

  //auth를 통과해서 여기까지 진행했다 = authentication이 true이다
  //client에서 필요한 user data 전달
  res.status(200).json({
    _id: req.user._id, //auth.js에서 전달한 req.user 사용
    isAdmin: req.user.role === 0 ? false : true, //0이면 false, 아니면 true (일반이 0이고, 관리자가 1일 경우)
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })


})


app.get('/api/users/logout', auth, (req, res) => {

  //database에서 로그아웃하려는 user를 찾기
  User.findOneAndUpdate({ _id: req.user._id },
  //해당 user의 token을 database에서 삭제
    { token: "" }, (err, user) => {
      if(err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true
      })

    })

})



app.listen(port, () => console.log('Example app listening on port ${port}!'))
/*port 5000에서 app의 실행*/