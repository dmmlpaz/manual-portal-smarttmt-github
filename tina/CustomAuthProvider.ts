import { AbstractAuthProvider } from 'tinacms'

export class CustomAuthProvider extends AbstractAuthProvider {
  constructor() {
    super()
    // Do any setup here
  }
  async authenticate(props?: {}): Promise<any> {
   return { email: 'dev@example.com' };
  }
  async getToken():Promise<any> {
   return 'my-dev-token'; // El backend validará este token
  }
  async getUser() {
    return { email: 'dev@example.com' }; // Simula sesión activa
  }
  async logout() {
     console.log('User logged out');
  }
  async authorize(context?: any): Promise<any> {
    return true; // Permite autorizar siempre
  }
}