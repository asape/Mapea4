/**
 * @namespace M.impl.control
 */
export default class GeosearchbylocationControl extends M.impl.control.Geosearch {

  /**
   * @classdesc
   * Main constructor of the Geosearchbylocation control.
   *
   * @constructor
   * @param {string} searchUrl_ - URL for the request
   * @extends {M.impl.control.Geosearch}
   * @api stable
   */

  constructor(searchUrl_) {
    // calls super
    super({
      'layerName': GeosearchbylocationControl.NAME
    });

    /**
     * Popup showed
     * @private
     * @type {Mx.Popup}
     */
    this.popup_ = null;

    /**
     * URL for the query
     * @private
     * @type {string}
     */
    this.searchUrl_ = searchUrl_;

  }

  /**
   * Set the map instance the control is associated with.
   * @param {ol.Map} map - The map instance.
   * @public
   * @function
   * @api stable
   */
  setMap(map) {

    super('setMap', map);

    if (M.utils.isNullOrEmpty(map)) {
      this.facadeMap_.getImpl().removeFeatures([this.positionFeature_]);
    } else {
      this.map = map;
    }
  }

  /**
   * This function get coordinates
   * @public
   * @function
   * @returns {Promise} coordinates
   * @api stable
   */
  locate() {
    // TODO
    let geolocation = new ol.Geolocation({
      projection: this.facadeMap_.getMapImpl().getView().getProjection()
    });
    geolocation.setTracking(true);
    this.positionFeature_ = M.impl.Feature.olFeature2Facade(new ol.Feature());
    this.positionFeature_.getImpl().getOLFeature().setStyle(new ol.style.Style({
      image: new ol.style.Circle({
        radius: 6,
        fill: new ol.style.Fill({
          color: '#3399CC'
        }),
        stroke: new ol.style.Stroke({
          color: '#fff',
          width: 2
        })
      })
    }));
    let coordinates;
    this.positionFeature_.click = function (evt) {
      M.Template.compile(GeosearchbylocationControl.POPUP_LOCATION, {
        'jsonp': true,
        'vars': {
          'valorX': coordinates[0],
          'valorY': coordinates[1]
        },
        'parseToHtml': false
      }).then(htmlAsText => {
        let positionTabOpts = {
          'icon': 'g-cartografia-gps2',
          'title': 'posición',
          'content': htmlAsText
        };
        this_.popup_ = this_.facadeMap_.getPopup();
        if (M.utils.isNullOrEmpty(this_.popup_)) {
          this_.popup_ = new M.Popup();
          this_.popup_.addTab(positionTabOpts);
          this_.facadeMap_.addPopup(this_.popup_, coordinates);
        } else {
          this_.popup_.addTab(positionTabOpts);
        }
      });
    };
    return new Promise((success, fail) => {
      geolocation.on('change:position', () => {
        geolocation.setTracking(false);
        coordinates = geolocation.getPosition();
        success(coordinates);
      }, this);
    });
  }

  /**
   * This function remove point locate
   * @public
   * @function
   * @api stable
   */
  M.impl.control.Geosearch.prototype.removeLocate = function () {
    this.facadeMap_.removeFeatures([this.positionFeature_]);
  };

  /**
   * This function draw point location
   * @param {array} coord - Coordinates
   * @public
   * @function
   * @api stable
   */
  drawLocation(coord) {
    this.positionFeature_.getImpl().getOLFeature().setGeometry(coord ? new ol.geom.Point(coord) : null);
    this.facadeMap_.drawFeatures([this.positionFeature_]);
  }

  /**
   * This function shows the container with the results
   *
   * @public
   * @function
   * @param {HTMLElement} container HTML to display
   * @api stable
   */
  addResultsContainer(container) {
    let mapContainer = this.map.getTargetElement();
    mapContainer.appendChild(container);
  }

  /**
   * This function destroy the container with the results
   *
   * @public
   * @function
   * @param {HTMLElement} container HTML results panel
   * @api stable
   */
  removeResultsContainer(container) {
    delete container;
  }

  /**
   * Zoom Results
   *
   * @public
   * @function
   * @api stable
   */
  zoomToResultsAll() {
    let bbox = this.facadeMap_.getControls("geosearchbylocation")[0].getImpl().getLayer().getFeaturesExtent();
    this.facadeMap_.setBbox(bbox);
  }

  /**
   * This function destroys this control and clear HTML
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    this.facadeMap_.getMapImpl().removeControl(this);
    this.clear();
    this.facadeMap_.removeFeatures([this.positionFeature_]);
    this.popup_ = null;
    this.searchUrl_ = null;
  }

  /**
   * Template for popup
   * @const
   * @type {string}
   * @public
   * @api stable
   */
}

GeosearchbylocationControl.POPUP_LOCATION = "geosearchbylocationfeaturepopup.html";
