import mongoose from "mongoose"; 

const foodSchema = new mongoose.Schema({
    name: {type:String,required:true},
    description: {type:String, required:true},
    price: {
        type: Number,
        required:true,
        validate: {
            validator: function(value) {
                return value>=0;
            },
            message: props => `${props.value} is not a valid price! Price must be positive.`
        }
    },
    image:{type:String, required:true},
    category:{type:String, required:true}
})

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);

export default foodModel;

