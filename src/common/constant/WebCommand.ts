
/**
 * postMessage 中 command type 的定义，与 /web/config/command.js 中一一对应
 */
export class WebCommand {
  public static SAVE_NICKNAME: string = "web.nickname.save";
  public static GET_NICKNAME: string = "web.nickname.get";
  public static GET_SHORTCUT: string = 'web.shortcut.get';
  public static SAVE_SHORTCUT: string = 'web.shortcut.save';
  public static CLOSE: string = 'web.close';
}