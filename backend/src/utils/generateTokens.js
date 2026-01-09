import jwt from "jsonwebtoken";

export const generateAccessToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.REFRESH_JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const setAuthTokens=(res,accessToken,refreshToken)=>{
    const accessOptions={
        httpOnly:true,
        sameSite:'Strict',
        maxAge:15*60*1000, //15 mins 
        path:'/'
    };

    const refreshOptions={
        httpOnly:true,
        sameSite:'Strict',
        maxAge:7*24*60*60*1000, //7 days
        path:'/'
    };

    if(process.env.NODE_ENV==='production'){
        accessOptions.secure=true;
        refreshOptions.secure=true;
    }

    res.cookie('accessToken',accessToken,accessOptions);
    res.cookie('refreshToken',refreshToken,refreshOptions);
};
