export const env = {
 port: process.env.PORT!,
 mongodb: {
  uri: process.env.MONGODB_URI!,
 },
 jwt: {
  secret: process.env.JWT_SECRET!,
 },
};
