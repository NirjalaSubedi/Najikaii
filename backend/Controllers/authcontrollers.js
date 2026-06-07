const user=require('../models/UserModels');
const Product = require('../models/ProductModels');
const jwt = require('jsonwebtoken');
const bcryptjs= require('bcryptjs');
const crypto = require('crypto');
const sendEmail= require('../utils/sendEmail');
const { find } = require('../models/ProductModels');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.register=async(req,res)=>{
    try{
        const {name,email,password,role,PhoneNumber,Address,location,shopName, shopImage}=req.body;
        //check if user alredy exist
        let existinguser = await user.findOne({email});
        if(existinguser){
             return res.status(400).json({
                message:"user already exist"
            })
        }

        //Hash password
        const salt = await bcryptjs.genSalt(10);
        const hashpassword= await bcryptjs.hash(password,salt);

        //otp generating
        const otp= crypto.randomInt(100000,999999).toString();
        const otpExpire = Date.now() + 10 * 60 * 1000;

        //save user
        const newuser =new user({name,
            email,
            password:hashpassword,
            role,
            PhoneNumber,
            Address,
            location,
            otp,
            otpExpire,
            isVerified:false,
            shopName:role==='Vendor'?shopName:undefined,
            shopImage:role==='Vendor'?shopImage:undefined
        });
        await newuser.save();

        //sending email
        try {
            await sendEmail({
                email: newuser.email,
                subject: 'Najikai App - Email Verification Code',
                message: `Namaste ${name}, timro verification code ${otp} ho. Yo 10 minute pachi expire hunecha.`
            });

            res.status(201).json({
                success: true,
                message: "User registered! email ma aayeko OTP check garnuhos.",
                email: newuser.email
            });

        } catch (mailError) {
            if(newuser){
                await user.findByIdAndDelete(newuser.id)
            }
            console.log("Email error: ", mailError);
            return res.status(500).json({
                 message: "Email pathauna sakiyena." 
                });
        }

    }catch(e){
        res.status(500).json({
            error:e.message
        })

    }
}

exports.login= async (req,res)=>{
    try{
        const {email,password}=req.body;

        //find user
        const founduser = await user.findOne({email});
        if(!founduser){
            return res.status(404).json({
                message:"user is not register"
            })
        }

        //check password 
        const ismatch = await bcryptjs.compare(password,founduser.password);
        if(!ismatch){
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if(!founduser.isVerified) {
                return res.status(401).json({ 
                message: "Please verify your email before logging in." 
                });
        }

        

        //admin approval for vendor
        if (founduser.role === 'Vendor') {
        if (founduser.status === 'Pending') {
            return res.status(403).json({ 
                success: false, 
                message: "Tapai ko account Admin approval ko lagi 'Pending' ma chha." 
            });
        }
        if (founduser.status === 'Rejected') {
            return res.status(403).json({ 
                success: false, 
                message: "Tapai ko account Admin le 'Rejected' gareko chha. Kripaya support ma contact garnus." 
            });
        }
    }
    

        //create jwt token
        const token=jwt.sign({
            id:founduser._id,
            role:founduser.role
        },
        process.env.JWT_SECRET,
        {expiresIn:'1d'})

       //send email if successfull login 
       try {
            await sendEmail({
                email: founduser.email, 
                subject: 'Najikai App - Login Success',
                message: `Namaste, you logged in as ${founduser.name}` 
            });
        } catch (mailError) {
            console.log("Email pathauna sakiyena, tara login success bhayo.");
        }
        res.status(200).json({
            success: true,
            token: token, 
            user: {
                id: founduser._id,
                name: founduser.name,
                email:founduser.email,
                phonenumber:founduser.PhoneNumber,
                address:founduser.Address,
                role: founduser.role
            }
        });
    }catch(e){
        res.status(500).json({ message: e.message });
    }
}

//update user profile
exports.updateProfile = async (req, res) => {
    try {
        const { name, PhoneNumber, Address,location,shopName, shopImage } = req.body;
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: No user found in request" });
        }

        const userId = req.user.id; 
        // 1. User khojne ra update garne
        const updatedUser = await user.findByIdAndUpdate(
            userId,
            { name, PhoneNumber, Address,location,shopName, shopImage},
            { new: true, runValidators: true } 
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User bhetiyena!" });
        }

        res.status(200).json({
            success: true,
            message: "Profile update bhayo!",
            user: updatedUser
        });

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

//user delete garne logic
exports.deleteuser = async (req, res) => {
    try {
        const targetUserId = req.params.id; 
        const loggedInUser = req.user;    

        // 1. Authorization Check
        if (loggedInUser.role !== 'Admin' && loggedInUser.id !== targetUserId) {
            return res.status(403).json({
                success: false,
                message: "Tapaile aruko account delete garna paunu hunna!"
            });
        }

        const userToDelete = await user.findById(targetUserId);

        if (!userToDelete) {
            return res.status(404).json({ 
                success: false,
                message: "User bhetiyena!" 
            });
        }

        if (userToDelete.role === 'Vendor') {
            await Product.deleteMany({ vendor: targetUserId }); 
        }

        await user.findByIdAndDelete(targetUserId);

        res.status(200).json({
            success: true,
            message: userToDelete.role === 'Vendor' 
                ? "Vendor account ra sabai products delete bhayo!" 
                : "User account delete bhayo!"
        });

    } catch (e) {
        res.status(500).json({ 
            success: false,
            error: e.message 
        });
    }
};

//display logedin user info
exports.GetMyProfileInfo= async (req,res)=>{
    try{
        const userid=req.user.id
        const userInfo= await user.findById(userid);

        if (!userInfo) {
            return res.status(404).json({
                success: false,
                message: "User bhetiyena"
            });
        }

        res.status(200).json({
            success:true,
            message:"success in fetching logedin user info",
            userInfo
        })

    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

//display all user info in admin pannel
exports.getAllUserInfo = async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({
                success: false,
                message: "all user display access admin saga matraii xa "
            });
        }

        const userinfo = await user.aggregate([
            {
                $match: { role: { $regex: /customer/i } }
            },
            {
                $lookup: {
                    from: "orders",        
                    localField: "_id",  
                    foreignField: "customer",
                    as: "customerOrders"
                }
            },
            {
                $project: {
                    name: 1,
                    email: 1,
                    PhoneNumber: 1,
                    status: 1,
                    role: 1,
                    totalOrders: { $size: "$customerOrders" },
                    totalSpent: { $sum: "$customerOrders.totalAmount" }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: userinfo
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// Admin le Vendor ko status update garne (Approved ya Rejected)
exports.updateVendorStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const updatedVendor = await user.findByIdAndUpdate(
            id, 
            { status: status }, 
            { new: true }
        );

        if (!updatedVendor) {
            return res.status(404).json({ 
            success: false, 
            message: "Yo ID vaye ko user bhetiye na!" 
            });
        }

        //approve vayo ki reject vanerw mail ma msg jane 
        let emailMessage = "";
        if (status === 'Approved') {
            emailMessage = `Namaste ${updatedVendor.name}, Tapai ko Vendor account Approved bhayeko chha. Aba tapai login garera saman haru bechna saknu hunchha!`;
        } else {
            emailMessage = `Namaste ${updatedVendor.name}, Tapai ko Vendor application hami le Reject gareka chhau. Thap jankari ko lagi support ma samparka garnus.`;
        }

        try {
            await sendEmail({
                email: updatedVendor.email,
                subject: `Najikai App - Account Status: ${status}`,
                message: emailMessage
            });
        } catch (mailError) {
            console.log("Status update bhayo tara email gayena:", mailError.message);
        }

        res.status(200).json({
            success: true,
            message: `Vendor status aba '${status}' bhayo.`,
            data: updatedVendor
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getNearbyShops = async (req, res) => {
    try {
        const { lng, lat, distance = 5 } = req.query; 

        if (!lng || !lat) {
            return res.status(400).json({ 
                success: false, 
                message: "Location (longitude ra latitude) pathaunu hos!" 
            });
        }

        const shops = await user.aggregate([
            {
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    distanceField: "distanceFromMe", // Naya field jaha distance calculate hunchha
                    maxDistance: distance * 1000, // KM lai meters ma badaleko
                    query: { role: 'Vendor', status: 'Approved' }, // Khali approved vendors matra
                    spherical: true
                }
            },
            {
                // Distance meters ma hunchha, teslai KM ma lagna 1000 le divide gareko
                $addFields: {
                    distanceInKm: { $divide: ["$distanceFromMe", 1000] }
                }
            },
            {
                // Output ma k k dekhaune filter gareko
                $project: {
                    name: 1,
                    shopName: 1,
                    shopImage: 1,
                    Address: 1,
                    distanceInKm: { $round: ["$distanceInKm", 2] } // 2 decimal digit ma round gareko
                }
            }
        ]);

        res.status(200).json({
            success: true,
            totalShops: shops.length,
            shops
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Social Login Logic
// Social Login Logic
exports.socialLogin = async (req, res) => {
    try {
        const { name, email, googleId, facebookId, avatar, role } = req.body;
        let existingUser = await user.findOne({ email });

        if (existingUser) {
            const token = jwt.sign(
                { id: existingUser._id, role: existingUser.role },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            return res.status(200).json({
                success: true,
                message: "Login successful via Social Account",
                token,
                user: {
                    id: existingUser._id,
                    name: existingUser.name,
                    email: existingUser.email,
                    phonenumber: existingUser.PhoneNumber, // <- यो थप्नुहोस्
                    address: existingUser.Address,         // <- यो थप्नुहोस्
                    role: existingUser.role
                }
            });
        }

        const newUser = new user({
            name,
            email,
            googleId,
            facebookId,
            avatar,
            role: role || 'Customer',
            isVerified: true,
            status: role === 'Vendor' ? 'Pending' : 'Approved'
        });

        await newUser.save();

        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(201).json({
            success: true,
            message: "User registered via Social Account",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                phonenumber: newUser.PhoneNumber, 
                address: newUser.Address,        
                role: newUser.role
            }
        });

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;

        //Google Token Verify garne
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { name, email, picture, sub: googleId } = ticket.getPayload();

        let foundUser = await user.findOne({ email });

        if (!foundUser) {
            foundUser = new user({
                name,
                email,
                googleId,
                avatar: picture,
                isVerified: true, 
                role: 'Customer',
                status: 'Approved',
                password: crypto.randomBytes(16).toString('hex') 
            });
            await foundUser.save();
        }
        const token = jwt.sign(
            { id: foundUser._id, role: foundUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            success: true,
            token,
            user: {
                id: foundUser._id,
                name: foundUser.name,
                email: foundUser.email,              
                
                phonenumber: foundUser.PhoneNumber || foundUser.phoneNumber, 
                address: foundUser.Address || foundUser.address,

                role: foundUser.role
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Google Authentication failed!" });
    }
};

exports.resendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const foundUser = await user.findOne({ email });
        if (!foundUser) {
            return res.status(404).json({
                success: false,
                message: "email doesnot exist"
            });
        }

        if (foundUser.isVerified) {
            return res.status(400).json({
                success: false,
                message: "User is already verified"
            });
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        foundUser.otp = otp;
        foundUser.otpExpire = Date.now() + 10 * 60 * 1000;
        await foundUser.save();

        await sendEmail({
            email: foundUser.email,
            subject: 'Najikai App - Email Verification Code',
            message: `Namaste ${foundUser.name}, timro naya verification code ${otp} ho. Yo 10 minute pachi expire hunecha.`
        });

        return res.status(200).json({
            success: true,
            message: "OTP resend bhayo"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getUserCount = async (req, res) => {
    try {
        const [total, customers, vendors, pendingVendors] = await Promise.all([
            user.countDocuments({}),
            user.countDocuments({ role: 'Customer' }), 
            user.countDocuments({ role: 'Vendor' }),   
            user.countDocuments({ role: 'Vendor', status: 'pending' }) 
        ]);

        console.log("DB RE-SYNC LIVE:", { total, customers, vendors, pendingVendors });

        res.status(200).json({
            success: true,
            data: { 
                total, 
                customers, 
                vendors,
                pendingVendors
            }
        });
    } catch (error) {
        console.error("Dashboard backend filter stream block failed:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error counting multi-vendor platform elements layout data",
            error: error.message 
        });
    }
};