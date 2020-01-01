const User = require('./user');
const bcrypt = require('bcryptjs');
const mailerService = require('../models/mailerService');

// services
exports.getUserByUsername = async (username) => {
    var query = { username: username };
    return await User.findOne(query);
}

//register
exports.createUser = async (thongtin) => {
    const newUser = new User({
        username: thongtin.username,
        password: thongtin.password,
        email: thongtin.email,
        name: thongtin.name,
        active: false
    });

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newUser.password, salt);
    newUser.password = hashPassword;
    await newUser.save();
    return newUser;
}

exports.registerValidate = async (thongtin) => {
    let result = true;
    let message = '';
    if (thongtin.password.length < 6)
    {
        result = false;
        message = 'Mật khẩu phải dài từ 6 kí tự';
    }
    else if (await this.getUserByUsername(thongtin.username))
    {
        result = false;
        message = 'Tên đăng nhập đã được sử dụng';
    }
    return ({
        result,
        message
    })
}

// login
exports.comparePassword = async (candidatePassword, hash) => {
    const result = await bcrypt.compare(candidatePassword, hash);
    return result;
}

// forget password
exports.forgetPassword = async (thongtin) => {
  if (await User.exists({email: thongtin.email})) {
      const mail = {
          from: process.env.USERNAME_YANDEX,
          to: thongtin.email,
          subject: 'Please reset your password',
          html: 'We heard that you lost your Aviato password. Sorry about that!<br><br>'
          + 'But don’t worry! You can use the following link to reset your password:<br><br>'
          + '<a href="http://localhost:4000/user/resetPassword">Click here</a>'
      }
      mailerService.transporter.sendMail(mail, function(error, info){
          if (error) {
              console.log(error);
          }
          else {
              console.log('Email sent: ' + info.response);
          }
      });
      return true;
  }
  return false;
}

module.exports.resetPassword = async (body, userEmail) => {
    const userReset = await User.findOne({email: userEmail});
    if (body.pass == body.confirmPass) {
        userReset.password = body.pass;
        await bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(userReset.password, salt, function (err, hash) {
                userReset.password = hash;
                userReset.save();
            });
        });
        return true;
    }
    return false;
}

module.exports.getUserInfo = async (usernameOfUser) => {
    const userInfo = await User.findOne({username: usernameOfUser});
    if (userInfo != null) {
      return {
        fullname: userInfo.name,
        // address: userInfo.address,
        phone: userInfo.phone
      };
    } else {
      return false;
    }
}

module.exports.postUserInfo = async (usernameOfUser, infoOfUser) => {
    const userUpdateInfo = await User.findOne({username: usernameOfUser})
    userUpdateInfo.name = infoOfUser.fullname
    // userUpdateInfo.address = infoOfUser.address
    userUpdateInfo.phone = infoOfUser.phone
    userUpdateInfo.save();
    return true;
}

module.exports.postChangePassword = async (usernameOfUser, oldPass, newPass, confirmPass) => {
    const userChangePass = await User.findOne({username: usernameOfUser});
    var isSuccess = false;
    const comparePass = await new Promise((resolve, reject) => {
        bcrypt.compare(oldPass, userChangePass.password, async function(err, isMatch) {
            if (isMatch && newPass == confirmPass) {
              isSuccess = true;
              await bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(newPass, salt, function (err, hash) {
                    userChangePass.password = hash;
                    userChangePass.save();
                });
              });
            }
            resolve(isSuccess);
        });
    });
    if (isSuccess) {
      return true;
    } else {
      return false;
    }
};

exports.sendMailActiveAccount = async (userId, userEmail) => {
    const mail = {
        from: process.env.USERNAME_YANDEX,
        to: userEmail,
        subject: 'Turn on active account',
        html: 'Chaò mừng bạn đến với Aviato shop!<br><br>'
        + 'Xin vui lòng bấm vào đường link bên dưới để kích hoạt tài khoản của bạn:<br><br>'
        + `<u>http://localhost:4000/user/${userId}/active</u>`
    }
    mailerService.transporter.sendMail(mail, function(error, info){
        if (error) {
            console.log(error);
        }
        else {
            console.log('Email sent: ' + info.response);
        }
    });
}

exports.activeAccout = async (userId) => {
    const newUser = await User.findOne({_id: userId});
    newUser.active = true;
    await newUser.save();
}
