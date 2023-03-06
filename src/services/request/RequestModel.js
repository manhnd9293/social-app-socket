const {Schema, model} = require("mongoose");
const requestSchema = new Schema({
  from: {type: Schema.Types.ObjectId, ref: 'User' },
  to: {type: Schema.Types.ObjectId, ref: 'User' },
  message: {type: String, maxLength: 200},
  seen: {type: Boolean, default: false},
  date: {type: Date}
})

const RequestModel = model('Request', requestSchema);
module.exports = RequestModel;