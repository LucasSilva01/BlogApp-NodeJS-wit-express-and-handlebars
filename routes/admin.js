const express = require("express");
const { Mongoose } = require("mongoose");
const router = express.Router();
/*usando model deforma externa no mongooose
1 - importa a o mongoose
2 - chama o arquivo do model
3 - chama a função que passaa referencia do model para a variavel*/
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")


router.get('/',(req, res) => {
    res.render("admin/index")
})
router.get('/posts',(req, res) => {
     res.send("Pagina de Posts")
 } )

router.get('/categorias', (req, res) => {
    Categoria.find().lean().sort({date: 'desc'}).then((categorias) => {
        res.render("admin/categorias", {categorias: categorias})
    }).catch((err) => {
        req.flash("error_msg", "Ocorreu um erro ao listar as categorias.")
        res.redirect("/admin")
    })
 })

router.get('/categorias/add', (req, res)=>{
     res.render("admin/addcategorias")
 })

router.post("/categorias/nova", (req, res) => {
    
    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome.length < 3){
        erros.push({texto: "Nome inválido, tente novamente"})   
    }


    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug.length < 3){
        erros.push({texto: "Slug inválido, tente novamente."})
    }

    if(erros.length > 0){
        res.render("admin/addcategorias", {erros: erros})
    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
        new Categoria(novaCategoria).save().then(() => {
            //flash é um tipo de sessão que so se vê temporariamnete
            req.flash("success_msg", "Categoria criada com sucesso!")
            res.redirect("/admin/categorias")
           
        }).catch((err) =>{
            req.flash("error_msg", "Ocorreu um erro, tente novamente.")
            res.redirect("/admin")
        })
    }    
})

router.get("/categorias/edit/:id", ((req, res) =>{
    Categoria.findOne({_id: req.params.id}).lean().then((categoria) => {
        res.render("admin/editcategorias", {categoria: categoria})
    }).catch((err)=>{
        req.flash("error_msg", "Esta categoria não existe")
        res.redirect("/admin/categorias")
    })   
}))

router.post("/categorias/edit", ((req, res) =>{

    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome.length < 3){
        erros.push({texto: "Nome inválido, tente novamente"})   
    }


    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug.length < 3){
        erros.push({texto: "Slug inválido, tente novamente."})
    }

    if(erros.length > 0){
        res.render("admin/editcategorias", {erros: erros})
    }else{

        Categoria.findOne({_id: req.body.id}).then((categoria)=>{
            categoria.nome = req.body.nome
            categoria.slug = req.body.slug
            categoria.save().then(()=>{
                    
                req.flash("success_msg", "Alterações salvas com sucesso.")
                res.redirect("/admin/categorias")
                }).catch((err) =>{
                    req.flash("error_msg", "Ocorreu um erro ao editar.")
            })
            
        })
    }
}))


router.post("/categorias/delete", (req, res)=>{
    Categoria.remove({_id: req.body.id}).then(()=>{
        req.flash("success_msg", "Deletado com sucesso")
        res.redirect("/admin/categorias")
    }).catch((err)=>{
        req.flash("error_msg", "Não foi possivel deletar")
    })
})


module.exports = router