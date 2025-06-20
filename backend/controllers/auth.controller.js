import User from '../models/user.model.js';

 
const generateReferralCode = async () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code;
  let exists = true;

  while (exists) {
    code = Array.from({ length: 8 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join('');

    const existingUser = await User.findOne({ referralCode: code });
    exists = !!existingUser;
  }

  return code;
};

 
export const registerUser = async (req, res) => {
  try {
    const { name, email, referralCode: parentCode } = req.body;

    
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already registered' });
    }

     
    const newReferralCode = await generateReferralCode();

    let referredBy = null;
    let directReferrals = [];

    
    if (parentCode) {
      const parentUser = await User.findOne({ referralCode: parentCode });

      if (!parentUser) {
        return res.status(400).json({ message: 'Invalid referral code' });
      }

      if (parentUser.directReferrals.length >= 8) {
        return res.status(400).json({ message: 'Referral limit exceeded (max 8)' });
      }

       
      referredBy = parentCode;
    }

    
    const newUser = new User({
      name,
      email,
      referralCode: newReferralCode,
      referredBy,
      directReferrals
    });

    const savedUser = await newUser.save();

    
    if (referredBy) {
      await User.findOneAndUpdate(
        { referralCode: referredBy },
        { $push: { directReferrals: savedUser._id } }
      );
    }

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        referralCode: savedUser.referralCode,
        referredBy: savedUser.referredBy
      }
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};




 
export const loginUser = async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Login attempt with email:', email);

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

   
    return res.status(200).json({
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        referralCode: user.referralCode,
        referredBy: user.referredBy
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
