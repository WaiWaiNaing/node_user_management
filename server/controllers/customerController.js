const Customer = require("../models/Customer");
const mongoose = require("mongoose");
exports.homepage = async(req, res) => {
    const msg = await req.flash("info");
    const locals = {
        title: "NodeJS",
        desc: "Free NodeJS User Management System"
    }

    let perPage = 12;
    let page = req.query.page || 1;

    try {
        const customer = await Customer.aggregate([{ $sort: { createdAt: -1 } }])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();
        const count = await Customer.countDocuments({});
        res.render("index", {
            locals,
            msg,
            customer,
            current: page,
            pages: Math.ceil(count/perPage)
        });
    } catch (error) {
        console.log(error);
    }
}

exports.addCustomer = async(req, res) => {
    const locals = {
        title: "Add New Customer - NodeJS",
        desc: "Free NodeJS User Management System"
    }
    res.render("customer/add", locals);
}

exports.postCustomer = async(req, res) => {
    console.log(req.body);

    const newCustomer = new Customer({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        details: req.body.details,
        tel: req.body.tel,
        email: req.body.email       
    });
    try{
        await Customer.create(newCustomer);
        await req.flash("info", "New Customer Added");
        res.redirect("/");
    }catch(err){
        console.log(err)
    }

    const locals = {
        title: "Add New Customer - NodeJS",
        desc: "Free NodeJS User Management System"
    }
    
    res.render("customer/add", locals);
}

exports.view = async(req, res) => {
    try{
        const cus = await Customer.findOne({_id: req.params.id});
        const locals = {
            title: "View Customer Data",
            desc: "Free NodeJS User Management System"
        }
        res.render("customer/view",{
            locals,
            cus
        });
       
    }catch(err){
        console.log(err)
    }
}

exports.edit = async(req, res) => {
    try{
        const cus = await Customer.findOne({_id: req.params.id});
        const locals = {
            title: "Edit Customer Data",
            desc: "Free NodeJS User Management System"
        }
        res.render("customer/edit",{
            locals,
            cus
        });
       
    }catch(err){
        console.log(err)
    }
}

exports.editCustomer = async(req, res) => {
    try{
        await Customer.findOneAndUpdate({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            details: req.body.details,
            tel: req.body.tel,
            email: req.body.email,
            updatedAt:  Date.now(),      
        }).where(req.params.id);

        await res.redirect(`edit/${req.params.id}`, locals);
    }catch(err){
        console.log(err)
    }
}

exports.deleteCustomer = async(req, res) => {
    try{
        await Customer.deleteOne({ _id: req.params.id });
        res.redirect("/");
    }catch(err){
        console.log(err)
    }
}

exports.searchCustomers = async(req, res) => {
    try{
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

        const customers = await Customer.find({
            $or:[
                { firstName: {$regex: new RegExp(searchNoSpecialChar, "i") }},
                { lastName: {$regex: new RegExp(searchNoSpecialChar, "i") }},
            ]
        });
        const locals = {
            title: "Search Customer Data",
            desc: "Free NodeJS User Management System"
        }
        res.render("customer/search",{
            locals,
            customers
        });
       
    }catch(err){
        console.log(err)
    }
}

exports.about = async (req, res) => {
    const locals = {
      title: "About",
      description: "Free NodeJs User Management System",
    };
  
    try {
      res.render("about", locals);
    } catch (error) {
      console.log(error);
    }
  };