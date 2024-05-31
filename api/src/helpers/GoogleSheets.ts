import {google} from 'googleapis';
import {OAuth2Client} from 'google-auth-library';
import { User } from '../models/index.js';

const ClientID = "1011868917838-87cmledotloanaqa9begsneao09d8eo0.apps.googleusercontent.com";
const ClientSecret = "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";
const REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob';
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const oAuth2Client = new OAuth2Client(ClientID, ClientSecret, REDIRECT_URI);

export const generateAuthUrl = async () => {
    try {
        const authUrl = await oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
    
        return authUrl
    }  catch (error) {
        console.error(error)
        throw new Error(error)
    }
}

export const getCredentials = async (authorizationCode) => {
    try {
        const { tokens } = await oAuth2Client.getToken(authorizationCode);
        
        return tokens
    }  catch (error) {
        console.error(error)
        throw new Error(error)
    }
}

export const getAccessToken = async (authorizationCode) => {
    const { tokens } = await oAuth2Client.getToken(authorizationCode);
    oAuth2Client.setCredentials({ access_token: tokens.access_token });
    
    return tokens.access_token
}

export const getNewTokenFromRefreshToken = async (refreshAccessToken) => {
    oAuth2Client.setCredentials({refresh_token: refreshAccessToken});
    const {credentials} = await oAuth2Client.refreshAccessToken();
    
    return credentials.access_token
}


export const addHeaderInGoogleSheets = async ({spreadsheetId, access_token}: {spreadsheetId: string, access_token: string}) => {
    oAuth2Client.setCredentials({ access_token });

    if (spreadsheetId === null || spreadsheetId === undefined || spreadsheetId === "") {
        return null;
    }

    const request = {
        spreadsheetId,
        range: 'A1:K1',
        valueInputOption: 'RAW',
        resource: { values: [["اسم المنتج", "اسم العميل", "رقم الهاتف", "السعر", "الكمية", "حالة الطلب", "تاريخ التسجيل", "نوع التوصيل", "الولاية", "البلدية", "العنوان"]] },
    };

    try {
        const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });
        const response = await sheets.spreadsheets.values.update(request);

        return response.data
    } catch (error) {
        console.error(error);
    }
}

export const addRowInGoogleSheets = async (dataRow: string[][]) => {
    const admin = await User.findOne({role: "admin"})
    let spreadsheetId = '';

    if (admin !== null && "sheetsCredentials" in admin && "refresh_token" in admin.sheetsCredentials && admin.sheetsCredentials.refresh_token !== "" && admin.sheetsCredentials.refresh_token !== undefined && admin.sheetsCredentials.refresh_token !== null) {
        const newAccessToken = await getNewTokenFromRefreshToken(admin.sheetsCredentials.refresh_token);
        oAuth2Client.setCredentials({ access_token: newAccessToken });

        spreadsheetId = admin.sheetsCredentials?.spreadsheetId
    } else {
        return null;
    }

    if (spreadsheetId === null || spreadsheetId === undefined || spreadsheetId === "") {
        return null;
    }

    const request = {
        spreadsheetId,
        range: 'A2:C2',
        valueInputOption: 'RAW',
        resource: { values: dataRow },
    };

    try {
        const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });
        const response = await sheets.spreadsheets.values.append(request);

        return response.data
    } catch (error) {
        console.error(error);
    }
}