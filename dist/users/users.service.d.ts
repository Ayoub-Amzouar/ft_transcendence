import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import { AvatarDto } from './dto/upload.dto';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    getUserById(id: number): Promise<User>;
    getUser(id: number): Promise<void>;
    create(createUserDto: CreateUserDto): Promise<User>;
    setTwoFactorAuthenticationSecret(secret: string, userId: number): Promise<import("typeorm").UpdateResult>;
    uploadAvatar(id: number, avatarDto: AvatarDto): Promise<User>;
    updateUsername(id: number, newUsername: string): Promise<void>;
}
