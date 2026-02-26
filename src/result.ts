/**
 * Represents results of a yaml-datastore operation
 */
export class YdsResult {
  private _success: boolean;
  private _element: any;
  private _message: string;

  /**
   * Default constructor for YdsResult
   *
   * @param success success status of a yaml-datastore operation
   * @param element element read into memory or stored on-disk per yaml-datastore operation
   * @param message message describing success status of a yaml-datastore operation
   * @returns new YdsResult object
   */
  constructor(success: boolean, element: any, message: string) {
    this._success = success;
    if (this._success) {
      this._element = element;
    } else {
      this._element = null;
    }
    this._message = message;
  }
  /** @returns success status of a yaml-datastore operation. */
  public get success() {
    return this._success;
  }
  /** @returns element read into memory or stored on-disk per yaml-datastore operation. */
  public get element() {
    return this._element;
  }
  /** @returns message describing success status of a yaml-datastore operation. */
  public get message() {
    return this._message;
  }
}
