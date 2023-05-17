const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50   /*작성 길이 최대한도*/
    },
    email: {
        type: String,
        trim: true,     /*yel yn@naver.com -> 스페이스 제거*/
        unique: 1       /*고유한 아이디 생성*/
    },
    password: {
        type: String,
        minlength: 5    /*작성 길이 최소한도*/
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {             /*일반 유저(0)/관리자(1)를 구분하기 위함*/
        type: Number,
        default: 0
    },
    image: String,      /*유저의 이미지*/
    token: {            /*유효성 관리*/
        type: String
    },
    tokenExp: {         /*token의 유효기간*/
        type: Number
    }
})

const User = mongoose.model('User', userSchema)

module.exports = {User} /*다른 파일에도 공유*/