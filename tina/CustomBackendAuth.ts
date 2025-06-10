import type { BackendAuthProvider } from "@tinacms/datalayer"

export const CustomBackendAuth = ():BackendAuthProvider => {
   console.log('CustomBackendAuthxx')
  return {
    isAuthorized: async (req:any, res:any) => {
      const token = req.headers.authorization
       console.log('token',token)
      return {
        isAuthorized: true
      }
    },
  }
}