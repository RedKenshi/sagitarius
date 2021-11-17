import Economy from "../economy/economy";

export default {
    Query : {
        economy(obj, { user }){
            console.log(Economy.find({user:user._id}));
            return Economy.find({user:user._id}) || {}
        }
    }
}