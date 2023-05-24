const Model = require(`../model/model`)
const bcrypt = require('bcryptjs')
const jwt = require(`jsonwebtoken`)

const createToken = (existedUser) => {
    // encrypt user info
    const data = { userId: existedUser._id }
    // function jwt.sign() will create an obj
    const token = jwt.sign(
        data,
        process.env.PRIVATE_KEY,
        { expiresIn: process.env.EXPIRE_TIME }
    )
    return token
}

const findUser = async (userData) => {
    const { email, password } = userData
    const existedUser = await Model.cycvuser.findOne({ email })
    if (existedUser) {
        const _existedUser_password = existedUser.password;
        const isMatch = bcrypt.compareSync(password, _existedUser_password)

        const token = createToken(existedUser)
        const name = existedUser.name
        if (isMatch) {
            return { token, name, messenger: "successfully!" }
        }
        return { messenger: "authenticate fail!" }
    }
    return null;
}
//
// /auth/login
//
exports.generateToken = async (request, response) => {
    const { email, password } = request.body;
    let sendData = await findUser({ email, password })
    if (sendData) {
        console.log(`login - found token:`, sendData)
        response.send(sendData)
        return;
    }
    response.status(404).send({ messenger: "there is no result for that user!" });
}
//
// /auth/signup
//
exports.createUser = async (request, response) => {
    if (!request.body) {
        response.status(404).send({ messenger: "content cannot be empty!" });
        return;
    }
    const { email, name, password } = request.body
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt)

    const user = await findUser({ email })
    if (user) {
        return response.send({ messenger: "The user have already initialized in our database!" });
    }
    const cycv = new Model.cycvuser({
        email, password: hashPassword, name
    })
    cycv.save(cycv)
        .then(newUser => {
            const token = createToken(newUser)
            response.send({ token, name, messenger: "successfully!" });
        })
        .catch(err => {
            response.status(500).send({ messenger: err })
        })
}