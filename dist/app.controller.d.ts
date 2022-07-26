import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    root(): {
        message: string;
    };
    getAuthPage(response: Response): Promise<{
        url: string;
    }>;
}
