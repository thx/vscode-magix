

export class ShortcutInfo {
    nickname: string;
    projectName: string;
    list: Array<ShortcutItem>;
    constructor(data: any = {}) {
        this.nickname = data.nickname || '';
        this.projectName = data.projectName || '';
        this.list = data.list || [];
    }
}
export class ShortcutItem {
    name: string;
    url: number;
    constructor(data: any = {}) {
        this.name = data.name || '';
        this.url = data.url || '';
    }
}