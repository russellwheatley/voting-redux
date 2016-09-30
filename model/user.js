const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');


//define model
const userSchema = new Schema({
        email        :{type:String,unique:true,lowercase:true},
        userName     : String,
        password     : String,
        polls        : [],
        votedFor: [],
        itemCreated: []


})

//encrypt password before adding user to database
userSchema.pre('save',function(next){

    const user = this;

//generate a salt
    bcrypt.genSalt(10,function(err,salt){

      if(err){
        return next(err);
      }
      //encrypt password
      bcrypt.hash(user.password,salt,null,function(err,hash){
        if(err){
          return next(err);
        }
        //overwrite plain text password with hashed password
        user.password = hash;
        next();
      })
    })
})

userSchema.methods.comparePasswords = function(candidatePassword,callback){

  bcrypt.compare(candidatePassword,this.password, function(err,isMatch){

    if(err){
      return callback(err);
    }
    callback(null,isMatch);
  })
}

const ModelClass = mongoose.model('user',userSchema);

module.exports = ModelClass;
