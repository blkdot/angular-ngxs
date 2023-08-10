export class AlertError {
    static readonly type = '[Alert] Error';

    constructor(public payload: string) {
    }
}

export class AlertSuccess {
    static readonly type = '[Alert] Success';

    constructor(public payload: string) {
    }
}
