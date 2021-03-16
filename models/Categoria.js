const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const Categoria = new Schema({
    nome: {
        type: String, 
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    date:{
        type: Date,
        //"default" serve para colocar algo como padrão 
        //caso o usuario não digite e o campo n seja obrigatorio
        default: Date.now()
    }

})

mongoose.model("categorias", Categoria)