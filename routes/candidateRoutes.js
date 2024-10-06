const express = require('express');
const router = express.Router();

const  Candidate=  require('./../models/candidate'); 
const {jwtAuthMiddleware,generateToken} = require('./../jwt');
const User = require('./../models/user');

const checkAdminRole = async (userID) =>{
    try{
        const user = await User.findById(userID);
        if(user.role === 'admin'){
            return true;
        }
        
    }
    catch(err)
    {
        return false;
    }
}


router.post('/candidate',jwtAuthMiddleware, async function(req, res) {
    try {
        if(! await checkAdminRole(req.user.id))
        {
            return res.status(403).json({message :'user has does not have admin role'});    
        }

      const data = req.body; // Assuming the request body contains tye Candidate data

      //Create a new Candidate document using thr mongoose model
      const newCandidate = new Candidate(data);

      //Save the new Candidate to database 
      const response = await newCandidate.save();
      console.log('data saved')
      res.status(200).json({response:response} );
    } catch (error) {
      console.log('Error in person data saving', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

// Login Route



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




router.put('/:candidateID',jwtAuthMiddleware,async (req, res)=>{
  try{
    if(!checkAdminRole(req.user.id))
        {
            return res.status(403).json({message :'user has does not have admin role'});     
        }



        const candidateID = req.params.candidateID; // Extract the id from the URL parameter
        const updatedCandidateData = req.body; // Updated data for the person

        const response = await Person.findByIdAndUpdate(candidateID, updatedCandidateData, {
            new: true, // Return the updated document
            runValidators: true, // Run Mongoose validation
        })

        if (!response) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        console.log('Candidate data updated');
        res.status(200).json(response);
  }
  catch(err){
      console.log(err);
      res.status(500).json({error: 'Internal Server Error'});
  }
})



router.delete('/:candidateID',jwtAuthMiddleware,async (req, res)=>{
    try{
      if(!checkAdminRole(req.user.id))
          {
            return res.status(403).json({message :'user has does not have admin role'});    
          }
  
  
  
          const candidateID = req.params.candidateID; // Extract the id from the URL parameter
          const updatedCandidateData = req.body; // Updated data for the person
  
          const response = await Person.findByIdAndDelete(candidateID)
  
          if (!response) {
              return res.status(404).json({ error: 'Candidate not found' });
          }
  
          console.log('Candidate data Deleted');
          res.status(200).json(response);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
  })
  
//   router.get('/',async(req,res)=>{
//     try{
//       const data = await Person.find();
//       console.log('data fetched');
//       res.status(200).json(data);
//     }
//     catch(err)
//     {
//       console.log(err);
//       res.status(500).json({ error: 'Internal server error' });
//     }
    
//   }
//   )
//   router.get('/:workType',async(req,res)=>{
//     try{
//     const workType = req.params.workType; //extract the work type from the url parameter
//     if(workType == 'chef' || workType == 'manager' || workType == 'waiter')
//       {
//         const response = await Person.find({work:workType})
//         console.log("Data fetched as workType");
//         res.status(200).json(response);
//       }
//       else{
//         res.status(404).json({error:'Invalid work type'});
//       }
//     }
//     catch(err)
//     {
//       console.log(err);
//       res.status(500).json({error:'Internal server Error'})
//     }
//   })
  

  module.exports = router;