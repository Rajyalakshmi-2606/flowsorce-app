const mongoose = require('mongoose');
const validator = require('validator');
const jobschema = new mongoose.Schema({
    title:{
        type: String,
        required:[true, "Please enter the job title"],
        trim: true,
        maxlenght:[100, "Job title cannot exceed 100 characters"],

    },
    slug: String,
    description:{
        type: String,
        required:[true, "Please enter the Job description"],
        trim: true,
        maxlenght:[100, "Job description cannot exceed  1000 characters"]
    },
    email:{
        type: String,
        validate: [validator.isEmail, "Please enter valid email address"]
    },
    address:{
        type: String,
        required:[true, "Please enter the job address"],
        trim: true,
        maxlenght:[100, "Job address cannot exceed 100 characters"]
    },
    location:{
        type: {
            type: String ,
            enum:['Point']
        },
        coordinates:{
            type:[Number],
            index:'2dsphere'
        },
        formattedAddress:String,
        city: String,
        state: String,
        zipcode : String,
        country: String
    },
    company:{
        type: String ,
        required:[true, "Please enter the company name"],
    },
    industry:{
        type: String,
        required:[true, "Please enter the job industry"],
        enum:{
            values:[
                "IT",
                "Finance",
                "Healthcare",
                "Education",
                "Retail",
                "Manufacturing",
                "Hospitality",
                "Construction",
                "Transportation",
                "Real Estate"
            ],
             message:"Please select a valid industry"
        },
       
    },
    jobType:{
        type: String,
        required:[true, "Please enter the job type"],
        enum:{
            values:[
                "Full-time",
                "Part-time",
                "Contract",
                "Temporary",
                "Internship"
            ],
            message:"Please select a valid job type"
        }

    },
    education:{
        type: String,
        required:[true, "Please enter the job education"],
        enum:{
            values:[
                "Bachelors",
                "Masters",
                "Phd"
            ],
            message:"Please select a valid education level"
        }
    },
    positions:{
        type:Number,
        default:1,

        
    },
    experince:{
        type: String,
        required:[true, "Please enter the job experience"],
        enum:{
            values:[
                "Fresher",
                "1-2 years",
                "3-5 years",
                "6-10 years",
                "10+ years"
            ],
            message:"Please select a valid experience level"
        }
    },
    salary:{
        type: Number,
        required:[true, "Please enter the job salary"],
        max: [1000000, "Salary cannot exceed 1,000,000"]
    },
    positingDate:{
        type: Date,
        default: Date.now
    },
    lastDate:{
        type: Date,
        default: new Date().setDate(new Date().getDate() + 10) // Default to 30 days from now
    },
    applicantsApplied:{
        type:[Object],
        select: false

    }

});
//creatin job slug before saving
jobschema.pre("save", function(next){
   this.slug = slugify(this.title, {lower:true});
    next();
});

module.exports =mongoose.model("Job", jobschema);