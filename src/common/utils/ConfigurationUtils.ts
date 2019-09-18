
import * as vscode from 'vscode';

export class ConfigurationUtils {
    private static readonly CONFIG_NICKNAME = 'magix.config.user.nickname';
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
}