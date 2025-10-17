require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const { PrismaClient } = require ('./generated/prisma')
const prisma = new PrismaClient()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const loggerMidelware = require('./midleWares/loggerMidlewares')
const errorHandle = require('./midleWares/errorHandler')
const authenticateUser = require('./midleWares/auth')



const fs = require('fs')
const path = require('path')
const fileOfJson = path.join(__dirname, 'archivo.json')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(loggerMidelware)
app.use(errorHandle)

const PORT =  process.env.PORT || 3000
console.log(PORT)

app.get('/', (req, res)=>{
    res.send(`
        <h1> Curso de ExpressJS </h1>
        <p> Estoy en proceso de practicar mi conocimiento en NODE </p>
        
        `)
})

app.get('/users/:ID', (req, res)=>{
    const userId = req.params.ID

    res.send(`El usuario con el ID ${userId}`)

})

app.get('/search', (req, res)=>{
    const terms = req.query.termino
    const category = req.query.categoria

    res.send(`
        <2> Estos son los terminos y categorías </2>
        <p>  Término es ${terms} </p>
          <p>  Categoría es ${category} </p>
        
        `)
})


app.get('/users', (req, res)=>{

    fs.readFile(fileOfJson, 'utf-8', (err, data)=>{
        if (err) {
            return res.status(500).json({ error: 'No se puede conectar con la base de datos'})
            
        }

        let user = []
        try {
            user = JSON.parse(data)
        } catch (error) {
            return res.status(500).json({error: 'No hay datos'})

        }
           user.sort((a, b) => a.id - b.id)

        return res.status(200).json({
            message: 'Datos recibidos correctamente',
            data: user
        })

  

    })

})

function isValidEmail(email){
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
}

app.post('/users', (req, res)=>{
    const newuser = req.body
    const userId = parseInt(req.body.id, 10)
    const {name, email} = newuser

    if (!newuser || Object.keys(newuser).length === 0) {
        return res.status(400).json({ error: 'No se ha recibido datos'})   
    }

    if (!name || name.length < 3) {
        return res.status(400).json({error:'Intenta con otro nombre'})  
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Correo incorrecto'})
    }

    fs.readFile(fileOfJson, 'utf-8', (err, data)=>{
        if (err) {
            return res.status(500).json({error: 'No se pudo leer los datos'})
            
        }
      let users = JSON.parse(data)

      let  index = users.findIndex (user => user.id === userId)
       
        if (index !== -1) {
            return res.status(409).json({error: 'Usuario ya existe'})
         }
      

      
       users.push(newuser)

       index.sort((a, b) => a.id - b.id)
    

           fs.writeFile(fileOfJson, JSON.stringify(users, null, 2), (err)=>{
        if (err) {
          return res.status(500).json({error:' No se pudo escribir los usuarios'})  
        }
        return res.status(201).json({message: 'USuario creado correctamente', user:newuser})
    })


    })


})

app.put('/users/:id', (req, res)=>{
    const userId = parseInt(req.params.id, 10)
    const updatedUser = req.body

    if (!updatedUser.name || updatedUser.name.length < 3) {
        return res.status(400).json({error: 'El nombre debe ser mayor que 3 letras'})
        
    }

    if (!updatedUser.email || !isValidEmail(updatedUser.email)) {
        return res.status(400).json({error: 'Email invalido'})
    
    }

    fs.readFile(fileOfJson, 'utf8', (err, data) =>{
        if (err) {
          return res.status(400).json({error: 'No se pudo leer los archivos'})  
        }
        let users = JSON.parse(data)

        let  index = users.findIndex (user => user.id === userId)
       
        if (index === -1) {
        return res.status(404).json({error: 'Usuario no encontrado'})
         }

    users[index] = { ...users[index], ...updatedUser }

    fs.writeFile(fileOfJson, JSON.stringify(users, null, 2), (err)=>{
        if (err) {
            return res.status(500).json({error:'No se puede guardar los datos'})
        }
        return res.status(200).json({message: 'Datos actualizados', users})
    })
    })

})

// app.delete('/users/:id', (req, res)=>{
//     const userId = parseInt(req.params.id, 10)

//     fs.readFile(fileOfJson, 'utf-8', (err, data)=>{
//         if (err) {
//             return res.status(500).json({error: 'Error al leer los datos'})
            
//         }

//         let user = JSON.parse(data)
//         const initialLenght = user.length


//         let updatedUsers = user.filter(user => user.id !== userId)

//         if (updatedUsers.length === initialLenght) {
//             return res.status(404).json({message: 'Usuario no encontrado'})
//         }

//         fs.writeFile(fileOfJson, JSON.stringify(updatedUsers, null, 2), (err)=>{
//             if (err) {
//                 return res.status(500).json({error: ' No se pudo escribir los datos'})
//             }
//               return res.status(200).json({message: 'Usuario eliminado correctamente'})
//         })

      
//     })

// })

app.delete('/users/:id', (req, res)=>{
    const userID = parseInt(req.params.id, 10)

    fs.readFile(fileOfJson, 'utf-8', (err, data)=>{
        if (err) {
            return res.status(500).json({error: 'No se pudo leer los archivos'})
            
        }

        let users = JSON.parse(data)

        users = users.filter(user => user.id !== userID)

        fs.writeFile(fileOfJson, JSON.stringify(users, null, 2), (err)=>{
            if (err) {
                return res.status(500).json({error: 'No se pudo eliminar el usuario'})
                
            }
            return res.status(200).json({message: ' USuario eliminado correctamente'})
        })
    })
})


app.get('/error', (req, res, next)=>{
    next(new Error('Error Intencional'))
})

app.get('/db-users', async (req, res)=>{
    try {
        const users = await prisma.user.findMany()
        res.json(users)
        
    } catch (error) {
        res.status(500).json({ error : ' No se pudo conectar con la base de datos'})
    }

})

app.get('/protected-route', authenticateUser, (req, res)=>{
    res.send('Ruta proegida no se puede acceder')
})


app.post('/register', async (req, res)=>{
    const {email, password, name} = req.body
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
        data:{
            email,
            password: hashedPassword,
            name,
            rol: 'USER'
        }
    })

    res.status(201).json({message: 'User created succefully'})
})


app.post('/login', async (req, res)=>{
    const {email, password} = req.body
    const user = await prisma.user.findUnique({ where: {email}})
     const hashedcomparePassword = await bcrypt.compare( password, user.password)

    if (!user) return res.status(400).json({error: ' email o password invalido'})
    
    if (!hashedcomparePassword) {
        return res.status(500).json({error : 'email o password invalido '})
    }

    const token = jwt.sign({ id: user.id, role: user.rol}, process.env.JWT_SECRET, {expiresIn: '4h'} )

    res.json({token})

})



app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en: http://localhost:${PORT}`)
})













