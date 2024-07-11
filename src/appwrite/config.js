import conf from '../conf/conf.js'
import {Client , ID, Databases , Storage , Query } from "appwrite";

//slug = post_id
export class Service  {
    client = new Client();
    databases;
    storage;    //storage = bucket

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.storage = new Storage(this.storage);
    }

    async createPost({title , slug , content , featuredImage, status, userId}) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId,
                },
            )
        } catch (error) {
            console.log("Appwrite serive :: createPost :: error", error)
        }
    }

    async updatePost(slug ,{title , content , featuredImage, status}) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                },
            );
        } catch (error) {
            console.log("Appwrite serive :: updatePost :: error", error)
        }
    }

    async deletePost(slug) {
        try {
                await this.databases.deleteDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionId,
                    slug
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deletePost :: error", error);
            return false
        }
    }

    async getPost(slug) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
        } catch (error) {
            console.log("Appwrite serive :: getPost :: error", error);
            return false;
        }
    }

    async listPost() {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                [Query.equal("status","active")]
            )
        } catch (error) {
            console.log("Appwrite serive :: listPost :: error", error);
            return false;
        }
    }

    //file upload servises

    async uploadFile(file) {
        try {
            return await this.storage.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Appwrite serive :: uploadFile :: error", error);
            return false;
        }
    }

    async deleteFile(fileId) {
        try {
            await this.storage.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deleteFile :: error", error);
            return false;
        }
    }

    async getFilePreview(fileId) {
        try {
            const previewUrl = await this.storage.getFilePreview(
                conf.appwriteBucketId,
                fileId
            );
            if (!previewUrl) {
                console.log(`Appwrite service :: getFilePreview :: No preview URL found for fileId ${fileId}`);
                return false;
            }
            return previewUrl;
        } catch (error) {
            console.error("Appwrite service :: getFilePreview :: error", error);
            return false;
        }
    }
}

//object creation
const service = new Service();
export default service