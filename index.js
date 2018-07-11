const express = require('express')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')

const app = express()

const Op = Sequelize.Op
const sequelize = new Sequelize('sqz', 'postgres', 'lilfluffy22',{
   host: 'localhost',
   port: '5432',
   dialect: 'postgres',
   $and : Op.and,
   $or: Op.or,
   $eq: Op.eq,
   $like: Op.like
})

const Shoe = sequelize.define('shoe',
   {
      name: Sequelize.STRING,
      material: Sequelize.STRING,
      size: Sequelize.INTEGER,
      color: Sequelize.STRING,
      qty: Sequelize.INTEGER,
   }
)

sequelize.sync()

app.set('view engine', 'ejs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static('public'))
//routes
let message="";

app.get('/', (req,res)=>{
  Shoe.findAll({order: ['name']}).then((rows)=>{
    return rows;
  }).then((rows)=>{
    return res.render('shoes', {rows, message})
  })
})

app.get('/search', (req, res)=>{
    let s = req.query.search
    Shoe.findAll({
        where:
        {
            name:
            {
                $iLike: `${s}`
            }
        }
    })
    .then(rows =>{
        if(rows == ""){
            return res.render('shoes', {rows, message: "Not found"})
        }
        return res.render('shoes', {rows, message})
    })
})

app.post('/add', (req, res)=>{
  Shoe.create({
    name: res.body.name,
    material: res.body.material,
    size: req.body.size,
    color: req.body.color,
    qty: req.body.qty
  }).then(()=>{
    return res.redirect('/')
  })
})
app.post('/edit/:id', (req,res)=>{
  let id = req.params.id
  Shoe.findById(id)
  .then(row =>{
    return row
  })
  .then(row =>{
    return res.render('edit-shoe', {row})
  })
})

app.post('/delete/:id', (req,res)=>{
  let id = req.params.id
  Shoe.findById(id)
  .then(row=>row.destroy(row)
  )
  .then(()=>{
    return res.redirect('/shoes')
     })
  })
app.listen(3000, ()=>
console.log("okay works")
)
