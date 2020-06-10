
const MapLRU = require("map-lru").default;
//https://www.npmjs.com/package/map-lru/v/1.0.2
export class Cache {
  static cache = new MapLRU(1000);

  static get(key: string) {
    return this.cache.get(key);
  }
  static set(key: string, obj: any) {
    return this.cache.set(key, obj);
  }
  static has(key: string) {
    return this.cache.has(key);
  }
  static remove(key: string) {
    this.cache.remove(key);
  }

}
export class HtmlESMappingCache {

  static mapping = new Map<string, string>();
  /**
   * 添加映射关系
   * @param htmlFilePath 
   * @param esFilePath 
   */
  static addMapping(esFilePath: string, htmlFilePath: string) {
    this.mapping.set(htmlFilePath, esFilePath);
  }
  /**
   * 移除映射关系
   * @param esFilePath 
   */
  public static removeMappingByEsFile(esFilePath: string) {
    if (esFilePath) {
      let htmlKey: string = '';
      this.mapping.forEach((value: string, key: string) => {
        if (value === esFilePath) {
          htmlKey = key;
          return;
        }
      });
      if (htmlKey) {
        this.mapping.delete(htmlKey);
      }
    }

  }
  /**
   * 
   * @param htmlFilePath 
   */
  public static removeMappingByHtmlFile(htmlFilePath: string) {
    if (htmlFilePath) {
      this.mapping.delete(htmlFilePath);
    }
  }
  /**
   * 通过html文件获取相对应的es文件
   * @param htmlFilePath 
   */
  static getEsFilePath(htmlFilePath: string): string | undefined {
    return this.mapping.get(htmlFilePath);
  }
  /**
   * 通过es文件获取html文件
   * @param esFilePath 
   */
  static getHtmlFilePath(esFilePath: string): string | undefined {
    let htmlFilePath: string = '';
    this.mapping.forEach((value: string, key: string) => {
      if (value === esFilePath) {
        htmlFilePath = key;
        return;
      }
    });
    return htmlFilePath;
  }
}