
import * as vscode from 'vscode';

export class ConfigurationUtils {
    private static readonly CONFIG_NICKNAME = 'magix.config.user.nickname';
    private static readonly CONFIG_RAP_TYPE = 'magix.config.rap.type';
    /**
     * 保存花名
     * @param nickname 
     */
    public static saveNickname(nickname: string): void {
        vscode.workspace.getConfiguration().update(this.CONFIG_NICKNAME, nickname, true);
    }
    /**
     * 获取花名
     */
    public static getNickname(): string | null | undefined {
        return vscode.workspace.getConfiguration().get(this.CONFIG_NICKNAME);
    }
      /**
     * rap跳转方式
     * @param rapType 
     */
    public static saveRapType(rapType: string): void {
        vscode.workspace.getConfiguration().update(this.CONFIG_RAP_TYPE, rapType, true);
    }
    /**
     * 获取rap跳转方式。0：全部、1:鼠标右键跳转、2:Command点击跳转
     */
    public static getRapType(): string {
        return vscode.workspace.getConfiguration().get(this.CONFIG_RAP_TYPE) || '0';
    }
}