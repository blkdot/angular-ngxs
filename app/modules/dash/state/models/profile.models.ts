import {IUserProfileResponse} from "../../../../core/api/api-client.service";

export interface IProfileStateModel {
    currentUserProfile: IUserProfileResponse | null,
    hasActiveWholesaleProducts: boolean;
}
