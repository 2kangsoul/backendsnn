import bcrypt from 'bcrypt'
export class bcryptUtil {
    static async hashPassword(password:string , saltRounds:number = 10) {
        return await bcrypt.hash(password,saltRounds)
    }
    static async comparePassword(current:string , dbpassword:string){
        return await bcrypt.compare(current,dbpassword)
    }
}