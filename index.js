//carregando modulos
const express = require('express')
const handlebars= require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const admin = require('./routes/admin')
const path = require('path')
const mongoose = require('mongoose')
const session = require("express-session")
const flash = require("connect-flash")
//configurações
//sessão 
//"app.use" serve para a criação e configuração de middleware
app.use(session({
    secret: "senha1234",
    resave: true,
    saveUninitialized:true
}))
app.use(flash())

//Middleware
app.use((req, res, next) =>{
    //locals serve para criar variaveis globais
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    next()
})

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.engine('handlebars', handlebars({defaultLayout:'main'}))
app.set('view engine', 'handlebars');

//Mongoose
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/blogapp",{
    useNewUrlParser:true, useUnifiedTopology: true
}).then(() =>{ 
    console.log("Conectado ao mongo!")
}).catch((err) => {
    console.log("Erro do carai: "+err)
})


//Rotas

    //Pasta Public
    app.use(express.static(path.join(__dirname, "public")))

    app.use('/admin', admin)

//Outros
const PORT = 3000
app.listen(PORT, () => {
    console.log("Servidor Rodando")
})