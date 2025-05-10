import 'express-serve-static-core'
export interface User {
  id:string!;
  username:string!;
  email:string!;
  createdAt: Date!;
  updatedAt: Date!;
}

declare module 'express' {
  export interface Request {
    user?: User
  }
}