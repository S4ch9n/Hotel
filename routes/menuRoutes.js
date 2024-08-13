const express = require('express')

const router = express.Router()


//import the module from models/menuItem.js
const MenuItem = require('../models/menuItem');



//routes define

//create menu items
router.post('/' , async(req,res)=>{
    const data = req.body;
    try {
        const menuData = new MenuItem(data)
        const response = await menuData.save()
        console.log("data saved");
        res.status(200).json(response)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error : 'Invalid server error'
        })
    } 
})


//get the information
router.get('/' , async(req,res)=>{
    try{
     const data = await MenuItem.find()
     console.log('data fetched');
     res.status(500).json(data)
    }catch{
     res.status(200).json({
         error : "Invalid server error"
     })
    }
 })

 //parametrized 
 router.get('/:tasteType' , async (req, res)=>{
    try {
    const tasteType = req.params.tasteType
    //req.params object is used to retrieve route parameters defined in the URL.
        if(tasteType == "sweet" || tasteType == "sour" || tasteType == "spicy"){
            const taste = await MenuItem.find({
                taste : tasteType
            })
            res.status(200).json(taste)
        }else{
            res.status(500).json('Invalid taste type')
        }
    } catch (error) {
       res.status(500).json({
        error : "Invalid server error"
       }) 
    }
 })


 //to update the data we use put method 
 router.put('/:id', async (req, res) => {
    try {
        const menuId = req.params.id //extract the personid's from the url parameter
        const updateMenuData = req.body; //updated data for the menuItem
        
        const response = await MenuItem.findByIdAndUpdate(menuId , updateMenuData,{
            new : true, //return the updated document
            runValidators : true //run mongoose validation , means check data updated according to defined schema
        })
        if(!response){
            return res.status(404).json({
                error : "MenuItem not found"
            })
        }
        console.log('data updated');
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            error : "Internal serve error"
        })
    }
 });

 //delete the user
 router.delete('/:id', async (req, res)=>{
    try {
        const menuId = req.params.id //extract the personid's from url parameter
        const respone = await MenuItem.findByIdAndDelete(menuId)
        if(!respone){
            return res.status(404).json({
                error : "Menju item not found"
            })
        }
        console.log('data delete');
        res.status(200).json(respone)
    } catch (error) {
        res.status(500).json({
            error : "Invalid server error"
        })
    }
 })
 //exporting the router file
 module.exports = router