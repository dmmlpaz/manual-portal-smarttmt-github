import type { BackendAuthProvider } from "@tinacms/datalayer";
import type { IncomingMessage, ServerResponse } from "http";

export const CustomBackendAuth = (): BackendAuthProvider => {
  return {
    isAuthorized: async (req: IncomingMessage,res: ServerResponse<IncomingMessage>) => {
      const authHeader = req.headers.authorization;
      console.log('CustomBackendAuth token:', authHeader);
      // Aquí podrías validar el token
      return {
        isAuthorized: true,
      };
    },
  };
};

