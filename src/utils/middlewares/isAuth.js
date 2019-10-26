const isAuth = (req, res, next) => {
    if(!req.headers.authorization) {
        return res.status(200).json({session: false, message: 'Token does not exist'})
    }else{
        const token = req.headers.authorization.split(' ')[1]
        if(token==='something'){
            // payload of token
            req.token = {
                id: '1db23de5bfd03b703026f3ee'
            }
            next()
        }else{
            return res.status(200).json({session: false, message: 'Invalid token'})
        }
    }
}

module.exports = isAuth