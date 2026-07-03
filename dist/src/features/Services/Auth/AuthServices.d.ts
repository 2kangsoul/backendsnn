import { RegisterInput, LoginInput } from "../../Models/Auth/AuthModels";
export declare const AuthService: {
    register: (data: RegisterInput) => Promise<{
        id: string;
        email: string;
        username: string;
        password: string;
        fullName: string;
        role: string;
        no_handphone: string | null;
        address: string | null;
        profilePic: string | null;
        adminDuration: string | null;
        country: string | null;
        device: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    login: (data: LoginInput) => Promise<{
        id: string;
        email: string;
        username: string;
        password: string;
        fullName: string;
        role: string;
        no_handphone: string | null;
        address: string | null;
        profilePic: string | null;
        adminDuration: string | null;
        country: string | null;
        device: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    findById: (id: string) => Promise<{
        id: string;
        email: string;
        username: string;
        password: string;
        fullName: string;
        role: string;
        no_handphone: string | null;
        address: string | null;
        profilePic: string | null;
        adminDuration: string | null;
        country: string | null;
        device: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    } | null>;
};
//# sourceMappingURL=AuthServices.d.ts.map