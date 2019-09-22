
/**
 * postMessage 中 command type 的定义，与 /web/config/command.js 中一一对应
 */
export class WebCommand {
  public static SAVE_NICKNAME: string = "web.nickname.save";
  public static GET_NICKNAME: string = "web.nickname.get";
  public static GET_SHORTCUT: string = 'web.shortcut.get';
  public static SAVE_SHORTCUT: string = 'web.shortcut.save';
  public static GET_PROJECT_INFO: string = 'web.project.info.get';
  public static START_SCAN_RAP: string = 'web.rap.scan.start';
  public static FINISH_SCAN_RAP: string = 'web.rap.scan.finish';
  public static OPEN_EDITOR: string = 'web.editor.open';
  public static CLOSE: string = 'web.close';
}