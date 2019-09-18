

export class WebViewCommandArgument {
    public webviewType: WebviewType;
    constructor() {
        this.webviewType = WebviewType.None;
    }
}

export enum WebviewType {
    None = '',
    Setting = 'Setting',
    Welcome = 'Welcome',
    StatusBarShortcut = 'StatusBarShortcut',
    Gallery = 'Gallery',
    RapScan = 'RapScan'
}