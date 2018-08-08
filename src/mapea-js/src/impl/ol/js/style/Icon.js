import OLStyleIcon from 'ol/style/Icon';

export default class Icon extends OLStyleIcon {
  /**
   * @classdesc
   * Set icon style for Vector features.
   *
   * @constructor
   * @param {olx.style.IconOptions=} opt_options Options.
   * @extends {ol.style.Icon}
   * @api
   */
  constructor(opt_options) {
    super(opt_options);
  }

  /**
   * Real Image size used.
   * @public
   * @return {ol.Size} Size.
   * @api stable
   * @expose
   */
  getImageSize() {
    return this.iconImage_.getSize();
  }
}
