import { AuthToken, RefreshToken, VerifyToken, alreadyExistUser, comparePassword, forgetPasswordMail, generateAuthUrl, getCredentials, hashPassword, isExistUser, addHeaderInGoogleSheets } from '../helpers/index.js';
import { User } from '../models/index.js';
import RandToken from 'rand-token';
const { uid, generator } = RandToken

export const logIn = async (req, res) => {
    try {
        const content = req.body
        
        let user = await User.findOne({ email: content.email });
        
        // If Password don't match
        if (!user) {
            res.json({"message": "Email not found", "code": "EMAIL_NOT_FOUND"}).status(422).send();
            return ;
        }

        let isMatch = await comparePassword(content.password, user.password);
        
        // If Password don't match
        if (!isMatch) {
            res.json({"message": "Password incorrect", "code": "PASSWORD_INCORRECT"}).status(422).send();
            return ;
        }

        // If Password don't match
        if (!user.emailVerify) {
            res.json({"message": "Email not verify", "code": "EMAIL_NOT_VERIFY"}).status(422).send();
            return ;
        }

        // If Password don't match
        if (!user.activation) {
            res.json({"message": "Account is not active", "code": "ACCOUNT_NOT_ACTIVE"}).status(422).send();
            return ;
        }

        let {ok} = await User.findByIdAndUpdate(user._id, {
            firebaseToken: content.firebaseToken
        }, {rawResult: true});

        // Issue Token
        let token = AuthToken({id: user.id}, 365);
        
        

        res.json({token, user}).status(200).send();
    } catch (error) {
        console.error(error);
        res.json({error}).status(500).send();
    }
}

export const user = async (req, res) => {
    try {
        const id = req.params.id;
        
        const user = await User.findById(id)
        res.json(user).status(200).send();
    } catch (error) {
        console.error(error)
        res.status(500).send(error);
    }
}
export const allUser = async (req, res) => {
    try {
        const users = await User.find();
        
        res.json(users).status(200).send();
    } catch (error) {
        console.error(error)
        res.status(500).send(error);
    }
}

export const createUser = async (req, res) => {
    try {
        const content = req.body
        
        let alreadyExist = await alreadyExistUser(content.email, content.phone);

        if (alreadyExist !== false) {
            res.json(alreadyExist).status(500).send();
            return;
        }

        let password = await hashPassword(content.password);

        let user = await User.create({
            ...content,
            role: "admin",
            password,
            activation: true,
            emailVerify: true
        })

        let token = await AuthToken({id: user.id}, 15);

        res.json({user, token}).status(200).send();
    } catch (error) {
        console.error(error)
        res.status(500).send(error);
    }
}
export const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const content = req.body

        let {ok} = await User.findByIdAndUpdate(id, content, {rawResult: true});

        res.json({status: ok === 1 }).status(200).send();
    } catch (error) {
        console.error(error)
        res.status(500).send(error);
    }
}
export const updatePassword = async (req, res) => {
    try {
        const {id} = req.params;
        const {password, confirmPassword, oldPassword} = req.body

        if (password !== confirmPassword) {
            res.status(500).send("Password not incorrect");
        }

        let isExist =  await isExistUser(id);
        if (!isExist) {
            res.status(500).send('User not found');
        }
        
        //@ts-ignore
        let isMatch = await comparePassword(oldPassword, isExist?.password);
        // If Password don't match
        if (!isMatch) {
            res.status(500).send({"message": "Password not incorrect", "code": "PASSWORD_INCORRECT"});
        }
        
        let hash = await hashPassword(password);
        let {ok} = await User.findByIdAndUpdate(id, { password: hash }, {rawResult: true});

        res.json({status: ok === 1 }).status(200).send();
    } catch (error) {
        console.error(error)
        res.status(500).send(error);
    }
}
export const deleteUser = async (req, res) =>  {
    try {
        const id = req.params.id;
        // @ts-ignore
        const {modifiedCount} = await User?.deleteById(id)

        res.json({status: modifiedCount >= 1}).status(200).send();
    } catch (error) {
        console.error(error)
        res.status(500).send(error);
    }
}


export const forgetPassword = async (req, res) => {
    try {
        const {email} = req.body
        let user =  await User.findOne({ email });

        if (!user) {
            res.status(500).send('User not found');
        }

        // let token = await AuthToken({id: user.id, email: user.email}, 15);
        let token = generator({chars: '0-9'}).generate(4)

        await User.findOneAndUpdate({ email }, {codeVerify: token}, {rawResult: true})

        const createdMail = await forgetPasswordMail ({
            to: email,
            subject: "Forget your password",
            token: token
        });

        res.json({status: createdMail[0].statusCode === 202}).status(200).send();
    }  catch (error) {
        console.error(error)
        res.status(500).send(error);
    }
};
export const verifyCode = async (req, res) => {
    try {
        const {code, email} = req.body;

        if (!code || code === "") {
            res.status(500).send("Token invalid or expired");
        }

        let user =  await User.findOne({ codeVerify: code, email });
        if (!user) {
            res.status(500).send('User not found');
        }

        res.json({status: user !== null && user !== undefined}).status(200).send();
    }  catch (error) {
        console.error(error)
        res.status(500).send(error);
    }
};
export const changePassword = async (req, res) => {
    try {
        const {token} = req.query;
        const {email, code, password, confirmPassword} = req.body;

        if (!code || code === "") {
            res.status(500).send("Token invalid or expired");
        }

        if (password !== confirmPassword) {
            res.status(500).send("Password not incorrect");
        }

        let isExist =  await User.findOne({ codeVerify: code, email });
        if (!isExist) {
            res.status(500).send('User not found');
        }

        let hash = await hashPassword(password);
        let user = null
        if (typeof isExist !== "boolean" && "id" in isExist) {
            user = await User.findByIdAndUpdate(isExist.id, {password: hash, codeVerify: ""}, {rawResult: true});
        }

        res.json({status: user?.ok === 1}).status(200).send();
    }  catch (error) {
        console.error(error)
        res.status(500).send(error);
    }
};

export const authorizationSheets = async (req, res) => {
    try {
        const authUrl = await generateAuthUrl()
        res.redirect(authUrl)
    }  catch (error) {
        console.error(error)
        res.status(500).send(error);
    }
}

export const saveAuthorizationSheets = async (req, res) => {
    try {
        const {id, authorizationCode} = req.body
        const credentials = await getCredentials(authorizationCode)

        if (credentials !== null) {
            let {ok} = await User.findByIdAndUpdate(id, {
                "sheetsCredentials": {
                    "spreadsheetId": "",
                    "access_token": credentials.access_token,
                    "refresh_token": credentials.refresh_token,
                    "expiry_date": credentials.expiry_date
                }
            }, {rawResult: true});
            res.json({status: ok === 1 }).status(200).send();
            return;
        } else {
            res.json({status: false }).status(200).send();
            return;
        }
    }  catch (error) {
        console.error(error)
        res.status(500).send(error);
    }
}

export const addSpreadsheetId = async (req, res) => {
    try {
        const {id, spreadsheetId} = req.body
        let user = await User.findById(id);
        let newData = {}
        if ("sheetsCredentials" in user) {
            newData = { ...user?.sheetsCredentials, "spreadsheetId": spreadsheetId }
            await addHeaderInGoogleSheets({ spreadsheetId: spreadsheetId, access_token: user?.sheetsCredentials.access_token })
        } else {
            newData = { "spreadsheetId": spreadsheetId }
        }
        let {ok} = await User.findByIdAndUpdate(id, { "sheetsCredentials": newData }, {rawResult: true});
        res.json({status: ok === 1 }).status(200).send();
    }  catch (error) {
        console.error(error)
        res.status(500).send(error);
    }
}