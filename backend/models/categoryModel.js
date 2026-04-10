const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    image: String,
    description: String
}, { timestamps: true });