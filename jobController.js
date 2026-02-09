const Job= require('../models/jobs');

//get all jobs  => /jobs
exports.getAllJobs = async(req, res, next) => {
     const jobs = await Job.find();
     res.status (200).json({
        success:true,
        results: jobs.length,
        data:jobs,
        message : "This route will display the list of jobs"
     })
}

// Create a new job api=> /jobs/new
exports.newJob = async(req, res, next) =>{
    const job = await Job.create(req.body);
    res.status(201).json({
      success: true,
      message:"Jobs created sucessfully",
      data:job
    })
}
// update a job api => /jobs/:id
exports.updateJob = async(req,res, next)=>{
   let job = await Job.findById(req.params.id);
   if (!job){
     return res.status(404).json({
      success: false,
      message: 'Job not found',
    });
   }
   job = await Job.findByIdAndUpdate(req.params.id, req.body,{
     new: true,
     runValidators: true,
     useFindAndModify: false
   });
   res.status(200).json({
     success: true,
     message : 'Job updated successfully',
     data: job

   });
}
// delete a job api => /jobs/:id
exports.deleteJob = async(req, res , next)=>{
  const job = await Job.findById(req.params.id);
  if(!job){
    return res.status(404).json({
      success: false,
      meassage : 'Job not found'
    })
  }
  job = await Job.findByIdAndDelete(req.params.id);
  res.status(200).json({
     success:true,
     message: 'Job deleted successfully'
  });
  
}

// Get a single job api with id slug => /jobs/:id
  exports.getJob = async(req, res, next) =>{
    const job = await Job.find({$and:[{_id: req.params.id},{slug: req.params.slug}]});
    if(!job || job.length === 0){
      return res.status(404).json({
        status: false,
        message : 'Job not found'
      })
    }
    res.status(200).json({
      success : true ,
      data: job,
      message : 'job finded successfully'
    });
  }