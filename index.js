const express = require('express') /*express 모듈을 가져오기*/
const app = express() /*express function을 통해 새로운 express app 생성*/
const port = 5000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://yelynlee1004:asdfqwer1234@boilerplate.ve9w8xq.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongDB Connected...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => res.send('Hello World!'))
/*루트 directory에 오면 app이 'Hello World!' 출력*/

app.listen(port, () => console.log('Example app listening on port ${port}!'))
/*port 5000에서 app의 실행*/