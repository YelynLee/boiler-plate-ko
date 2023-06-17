const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

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

userSchema.pre('save', function( next ) {
    var user = this;

    if(user.isModified('password')) {
        
        //비밀번호 암호화
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)

            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)
                user.password = hash
                next()
            })
        })

    } else {
        next() //비밀번호가 아닌 다른 요소가 바뀌면 넘어가기
    }

})

userSchema.methods.comparePassword = function(plainPassword, cb) {

    //plainPassword->암호화 vs 암호화된 비밀번호
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err), //다르면 err를 전달
            cb(null, isMatch) //같으면 (err는 없음=null, isMatch)
    })
}


userSchema.methods.generateToken = function(cb) {
    var user = this;

    //jsonwebtoken을 이용해서 token 생성
    var token = jwt.sign(user._id.toHexString(), 'secretToken') 
    /*token = user._id + 'secretToken', 
    이후에 'secretToken'을 입력하면 user._id을 알아내는 방식*/

    user.token = token
    user.save(function(err, user) {
        if(err) return cb(err),
            cb(null, user)
    })

}


userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    //client의 token을 decode
    jwt.verify(token, 'secretToken', function(err, decoded) {

    //DB의 User Collection에서 'user(decoded)를 찾기' &
    //client와 일치하는 DB의 'token을 찾기' (client와 DB의 token이 일치하는지)
        user.findOne({"_id": decoded, "token": token}, function(err, user) {
            if(err) return cb(err);
            cb(null, user)
        })

    })

}

const User = mongoose.model('User', userSchema)

module.exports = {User} /*다른 파일에도 공유*/