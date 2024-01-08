
export interface DbUser
{
    user_id: number;
    username: string;
    password: string;
    is_deleted: boolean;
    created: Date;
}