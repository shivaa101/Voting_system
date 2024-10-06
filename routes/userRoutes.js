const express = require('express');
const router = express.Router();

const  User =  require('./../models/user'); 
const {jwtAuthMiddleware,generateToken} = require('./../jwt')

router.post('/signup', async function(req, res) {
    try {
      const data = req.body; // Assuming the request body contains tye User data

      //Create a new User document using thr mongoose model
      const newUser = new User(data);

      //Save the new user to database
      const response = await newUser.save();
      console.log('data saved')

      const payload = {
        id: response.id
      }

      console.log(JSON.stringify(payload));
      const token = generateToken(payload);
      console.log("Token is: ",token );
    
      res.status(200).json({response:response,token:token} );
    } catch (error) {
      console.log('Error in person data saving', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

// Login Route
router.post('/login', async(req, res) => {
  try{
      // Extract aadharNumber and password from request body
      const {aadharNumber, password} = req.body;

      // Find the user by username
      const user = await User.findOne({aadharNumber: aadharNumber});

      // If user does not exist or password does not match, return error
      if( !user || !(await user.comparePassword(password))){
          return res.status(401).json({error: 'Invalid username or password'});
      }


      // generate Token 
      const payload = {
          id: user.id,
          
      }
      const token = generateToken(payload);

      // return token as response
      res.json({token})
  }catch(err){
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Profile route
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
  try{
      const userData = req.user;
      // console.log("User Data: ", userData);

      const userId = userData.id;
      const user = await User.findById(userId);

      res.status(200).json({user});
  }catch(err){
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
})




router.put('/profile/passowrd',jwtAuthMiddleware,async (req, res)=>{
  try{
      const userId = req.user.id; // Extract the id from the URL parameter
      
      const {currentPassword,newPassword} = req.body //Extract current and new password from body
       
      //Find the user by userID
      const user = await User.findById(userId);

      //If password does not ,match return the error
      if( !user || !(await user.comparePassword(currentPassword))){
        return res.status(401).json({error: 'Invalid username or password'});
    }


     //Update the user password
     user.password  = newPassword;
     await user.save();

      

      console.log('password updated');
      res.status(200).json(response);
  }catch(err){
      console.log(err);
      res.status(500).json({error: 'Internal Server Error'});
  }
})




  
  router.get('/',async(req,res)=>{
    try{
      const data = await Person.find();
      console.log('data fetched');
      res.status(200).json(data);
    }
    catch(err)
    {
      console.log(err);
      res.status(500).json({ error: 'Internal server error' });
    }
    
  }
  )


  router.get('/:workType',async(req,res)=>{
    try{
    const workType = req.params.workType; //extract the work type from the url parameter
    if(workType == 'chef' || workType == 'manager' || workType == 'waiter')
      {
        const response = await Person.find({work:workType})
        console.log("Data fetched as workType");
        res.status(200).json(response);
      }
      else{
        res.status(404).json({error:'Invalid work type'});
      }
    }
    catch(err)
    {
      console.log(err);
      res.status(500).json({error:'Internal server Error'})
    }
  })
  

  module.exports = router;