import { createQueryKeys } from '@lukemorales/query-key-factory';

import { IAuthService } from '@/src/services/auth-service/auth-service';
import { ILoginData } from '@/src/data/data-contracts';

export const authQueryKeysFactory = createQueryKeys('auth', {
    
    logIn: (authService: IAuthService, data: ILoginData) => ({
            queryKey: [undefined],
            queryFn: ()=>authService.logIn(data)
        })
    }
)