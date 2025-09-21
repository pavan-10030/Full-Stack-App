const { faker } = require('@faker-js/faker');
const uuid=require('uuid')
const mysql=require("mysql2");
const path=require("path");
const express=require("express");
const app=express();
const methodoverride=require('method-override');
const { connect } = require('http2');
app.use(methodoverride("_method"))
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));


const connection=mysql.createConnection({
    host:"localhost",
    user:"root",
    database:"delta_app",
    password:"pavan@5f7"

});

app.listen("8080",()=>{
    console.log("Listening on port 8080");
})

// Home route
app.get("/",(req,res)=>{
    let q='select count(*) from user;';
    try{

    connection.query(q,(err,result)=>{
        if (err) throw err;
        // console.log(result[0]);
        // res.send(result[0]['count(*)']);
        let count=result[0]['count(*)']
        res.render("home.ejs",{count});
    });
    }catch(err){
        console.log(err);
        res.send(err);
    }
})

//insert route
app.get("/join",(req,res)=>{
    res.render("join.ejs");
})

app.post("/join",(req,res)=>{
    let id=faker.string.uuid();
    let {username,email,password}=req.body;
    console.log(req.body);
    let q=`insert into user values ('${id}','${username}','${email}','${password}');`
    try{
        connection.query(q,(err,result)=>{
            if (err) throw err;
            // res.send(result);
            res.render("acc.ejs");
            
        })
    }catch(err){
        console.log(err);
    }
})

// Show users route
app.get("/user",(req,res)=>{ 
    let q="select * from user;";
     try{
    connection.query(q,(err,users)=>{
        if (err) throw err;
        // console.log(result);
        // res.send(result);
        res.render("showusers.ejs",{users});
    });
    }catch(err){
    console.log(err);
    }
    
});

// Edit Route
app.get("/users/:id/edit",(req,res)=>{
    let {id}=req.params;
    let q=`select * from user where id='${id}';`
    try{
    connection.query(q,(err,result)=>{
        if (err) throw err;
        let user = result[0];
        res.render('edit.ejs',{user});
        // res.send(result);
        // res.render("showusers.ejs",{users});
    });
    }catch(err){
    console.log(err);
    }
    
});

// Update Route
app.patch("/user/:id",(req,res)=>{
     let {id}=req.params;
     let {password:formPass,username:newUsername}=req.body;
    let q=`select * from user where id='${id}';`
    try{
    connection.query(q,(err,result)=>{
        if (err) throw err;
        let user = result[0];
        if(formPass!=user.password){
            res.send("Wrong Password");
        }else{
            let q2=`update user set username='${newUsername}' where id='${id}'`;
            // let q2=`select * from user where id=${user.id};`
            connection.query(q2,(err,result)=>{
                if(err) throw err;
                res.render("editre.ejs");
            })
        }
        
        // res.send(result);
        // res.render("showusers.ejs",{users});
    });
    }catch(err){
    console.log(err);
    }
    
})



// Delete Route
app.get("/users/:id/delete",(req,res)=>{
    let {id}=req.params;
    let q=`select * from user where id='${id}';`;
    try{
        connection.query(q,(err,result)=>{
            if (err) throw err;
            let user=result[0];
            res.render('delete.ejs',{user});
            
        })
    }catch(err){
        console.log(err);
    }
})

app.delete("/user/:id",(req,res)=>{
     let {id}=req.params;
     let {password:formPass,username:newUsername}=req.body;
    let q=`select * from user where id='${id}';`
    try{
    connection.query(q,(err,result)=>{
        if (err) throw err;
        let user = result[0];
        if(formPass!=user.password){
            res.send("Wrong Password");
        }else{
            let q2=`delete from user where id='${id}'`;
            // let q2=`select * from user where id=${user.id};`
            connection.query(q2,(err,result)=>{
                if(err) throw err;
                let q3=`select * from user`;
                connection.query(q3,(err,users)=>{
                    if(err) throw err;
                    res.render("showusers.ejs",{users});
                })
            })
        }
        
    });
    }catch(err){
    console.log(err);
    }
    
})