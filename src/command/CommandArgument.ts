

export class WebViewCommandArgument {
    public webviewType: WebviewType;
    public data: any;
    constructor() {
        this.webviewType = WebviewType.None;
        this.data = null;
    }
}

export enum WebviewType {
    None = '',
    Setting = 'Setting',
    Welcome = 'Welcome',
    StatusBarShortcut = 'StatusBarShortcut',
    Gallery = 'Gallery',
    RapScan = 'RapScan',
    About = 'About'
}