export interface User{
    uid: string,
    email: string,
    password: string,
    name: string,
    perfil: 'admin' | 'visitante' | 'Técnico';
}