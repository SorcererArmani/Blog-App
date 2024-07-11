import conf from '../conf/conf.js'
import {Client , Account , ID} from "appwrite";

export class AuthService {
    //create client
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account (this.client)
    }
    async createAccount({email , password , name}) {
        try {
            const userId = ID.unique();
            const userAccount = await this.account.create(userId , email , password , name)

            if (userAccount) {
                //call another method
                return this.login({email , password})
            } else {
                return userAccount; 
            }
        } catch (error) {
            console.log("Error Creating Account:",error.message)
            throw error;
        }
    }

    async login ({email , password}) {
        try {
            return await  this.account.createEmailPasswordSession(email , password);
        } catch (error) {
            console.error("Error logging in:", error.message);
            throw error;
        }
    }

    //check if after landing on home page , user is logged in or not
    async getCurrentUser() {
        try {
            const user = await this.account.get();
            return user;
        } catch (error) {
            console.error('Error fetching current user:', error);
            return null;
        }
    }

    async logout() {
        try {
            await this.account.deleteSessions();
        } catch (error) { 
            console.log("Appwrite service :: logout :: error", error.message);
            throw error; 
        }
    }
}

//object creation
const authService = new AuthService ();

export default authService;