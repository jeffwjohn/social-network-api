const dateFormat = require('../utils/dateFormat');
const { Schema, model } = require('mongoose');

const UserSchema = new Schema ({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
        
    },
    email: {
        type: String,
        required: true,
        unique: true, 
        trim: true,
        match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
    },
    thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Thought'
        }
    ],

    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
},
{
    toJSON: {
      virtuals: true,
      getters: true
      //  we'll need to tell the Mongoose model that it should use any getter function we've specified.
    },
    id: false
    // We set id to false because this is a virtual that Mongoose returns, and we don’t need it.
  }
  );

  UserSchema.virtual('friendCount').get(function() {
      return this.friends.length;
  })


const User = model('User', UserSchema);

module.exports = User;