import OLLayerHeatmap from 'ol/layer/Heatmap';
import { isNullOrEmpty, extendsObj } from 'facade/js/util/Utils';
import Style from './Style';
import HeatmapLayer from '../layer/Heatmap';

export default class Heatmap extends Style {
  /**
   * @classdesc
   * Main constructor of the class. Creates a Heatmap
   * control
   *
   * @constructor
   * @param {Object} options - config options of user
   * @api stable
   */
  constructor(attribute, options, vendorOptions) {
    super({});

    /**
     * @private
     * @type {OLLayerHeatmap}
     */
    this.heatmapLayer_ = null;
    /**
     * @private
     * @type {string}
     */
    this.attribute_ = attribute;

    /**
     * @private
     * @type {object}
     */
    this.opt_options_ = extendsObj(options, vendorOptions);

    this.opt_options_.zIndex = 999999;
    /**
     * @private
     * @type {ol.layer.Vector}
     *
     */
    this.oldOLLayer_ = null;
  }

  /**
   * This function apply the style to specified layer
   * @function
   * @public
   * @param{M.layer.Vector}
   * @api stable
   */
  applyToLayer(layer) {
    this.layer_ = layer;
    if (!isNullOrEmpty(layer)) {
      const ol3Layer = this.layer_.getImpl().getOL3Layer();
      if (!(ol3Layer instanceof OLLayerHeatmap)) {
        this.oldOLLayer_ = ol3Layer;
      }
      const features = this.layer_.getFeatures();
      const olFeatures = features.map(f => f.getImpl().getOLFeature());
      olFeatures.forEach(f => f.setStyle(null));
      this.createHeatmapLayer_(olFeatures);
      this.layer_.getImpl().setOL3Layer(this.heatmapLayer_);
    }
  }

  /**
   * This function remove the style to specified layer
   * @function
   * @public
   * @api stable
   */
  unapply(layer) {
    if (!isNullOrEmpty(this.oldOLLayer_)) {
      this.layer_.getImpl().setOL3Layer(this.oldOLLayer_);
      this.layer_.redraw();
      this.layer_ = null;
      this.oldOLLayer_ = null;
      this.heatmapLayer_ = null;
    }
  }

  /**
   * This function creates a heatmap layer
   * @function
   * @private
   * @api stable
   */
  createHeatmapLayer_(olFeatures) {
    this.opt_options_.source = new ol.source.Vector({
      features: olFeatures,
    });
    this.heatmapLayer_ = new HeatmapLayer(this.opt_options_);
  }

  /**
   * This function
   * @public
   * @param {object} options_
   * @param {object} vendorOptions
   * @function
   */
  setOptions(options, vendorOptions) {
    this.opt_options_ = extendsObj(options, vendorOptions);
  }

  /**
   * This function
   * @public
   * @function
   * @return {number}
   */
  getMinWeight() {
    return this.heatmapLayer_.getMinWeight();
  }

  /**
   * This function
   * @public
   * @function
   * @return {number}
   */
  getMaxWeight() {
    return this.heatmapLayer_.getMaxWeight();
  }
}
