import pkg from 'mongodb';
const { ObjectId } = pkg;
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Users = new Schema({
    login            : String,
    password         : String,
});
export default mongoose.model('users', Users); 
