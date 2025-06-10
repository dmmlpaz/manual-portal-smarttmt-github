import { AbstractAuthProvider } from 'tinacms'

type TokenObject = {
    id_token: string;
    access_token?: string;
    refresh_token?: string;
};

export class CustomAuthProvider extends AbstractAuthProvider {
    constructor() {
        super()
        // Do any setup here
    }
    async authenticate(props?: {}): Promise<any> {
        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx entro')
        return true
    }
    async getToken():Promise<TokenObject> {
        // Return the token here. The token will be passed as an Authorization header in the format `Bearer <token>`
        return {id_token:'xxxxxx'}
    }
    async getUser() {
        // Returns a truthy value, the user is logged in and if it returns a falsy value the user is not logged in.
    }
    async logout() {
        // Do any logout logic here
    }
    async authorize(context?: any): Promise<any> {
        // Do any authorization logic here
    }

    getSessionProvider(): React.FC<{}> {
        // Return a React functional component as required
        return () => null; // Replace with your actual React context provider if needed
    }
}
