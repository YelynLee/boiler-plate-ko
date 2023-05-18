const express = require('express') /*express 모듈을 가져오기*/
const app = express() /*express function을 통해 새로운 express app 생성*/
const port = 5000
const bodyParser = require('body-parser'); //bodyParser 가져오기
const { User } = require("./models/User"); //User model 가져오기
const config = require('./config/key');

//application/x-www-form-urlencoded 가져오기
app.use(bodyParser.urlencoded({extended: true}));

//application/json 가져오기
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongDB Connected...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => res.send('Hello World!'))
/*루트 directory에 오면 app이 'Hello World!' 출력*/

app.post('/register', (req, res) => {
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






app.listen(port, () => console.log('Example app listening on port ${port}!'))
/*port 5000에서 app의 실행*/