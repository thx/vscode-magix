export class ComponentInfo {
    type?: Type;
    importInfo?: string;
    tag?: string;
    attrs?: Array<AttrInfo>;
    content?: object | string;
    element?: object | string;
}
export class AttrInfo {
    key?: string;
    value?: string;
}
export enum Type{
    /**
     * 通用，通过Rule配置文件处理
     */
    Common = 1,
    /**
     * 通过代码处理
     */
    Complex = 2
}