import {SoftDeleteDocument} from "mongoose-delete";
import {Types} from "mongoose";

export interface PixelI extends SoftDeleteDocument {
    name: string;
    apiKey: string;
    token: string;
}

// faceBookApiKey: string;
// twitterApiKey: string;
// tikTokApiKey: string;
// snapchatApiKey: string;
// facebookInstagramCatalogApiKey: string;