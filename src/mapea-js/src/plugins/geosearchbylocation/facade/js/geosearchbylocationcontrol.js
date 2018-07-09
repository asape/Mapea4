import GeosearchControl from "geosearch/facade/js/geosearchcontrol";
import Utils from "facade/js/utils/utils";
import Exception from "facade/js/exception/exception";
import GeosearchbylocationImpl from "../../impl/ol/js/geosearchbylocation";
import Template from "facade/js/utils/template";
import Remote from "facade/js/utils/remote";

export default class GeosearchbylocationControl extends GeosearchControl {
  /**
   * @classdesc
   * Main constructor of the class. Creates a Geosearchbylocation
   * Control to display nearby points of interest to your location
   *
   * @constructor
   * @param {string} url - URL for the query
   * @param {string} core - Core to the URL for the query
   * @param {string} handler - Handler to the URL for the query
   * @param {number} distance - Distance search
   * @param {string} spatialField - Spatial field
   * @param {number} rows - Number of responses allowed
   * @extends {M.control.Geosearch}
   * @api stable
   */
  constructor(url, core, handler, distance, spatialField, rows) {
    // implementation of this control
    let impl = new GeosearchbylocationImpl(this.searchUrl_);
    this.setImpl(impl);

    // calls super
    super(url, core, handler);

    /**
     * Status button 'Geosearchbylocation'
     * @private
     * @type {boolean}
     */

    this.activate_ = true;

    /**
     * Status button 'List' Geosearchbylocation
     * @private
     * @type {boolean}
     */
    this.activatebtnList_ = true;

    /**
     * Distance search
     * @private
     * @type {number}
     */
    this.distance_ = distance;

    /**
     * Spatial field
     * @private
     * @type {string}
     */
    this.spatialField_ = spatialField;

    /**
     * Number of responses allowed
     * @private
     * @type {number}
     */
    this.rows_ = rows;

    /**
     * URL for the query
     * @private
     * @type {string}
     */
    this.searchUrl_ = Utils.concatUrlPaths([url, core, handler]);

    /**
     * Facade Map
     * @private
     * @type {M.map}
     */
    this.facadeMap_ = null;

    /**
     * Container of the results to scroll
     * @private
     * @type {HTMLElement}
     */
    this.resultsScrollContainer_ = null;

    // checks if the implementation can create Geosearchbylocation Control
    if (Utils.isUndefined(GeosearchbylocationImpl)) {
      Exception('La implementación usada no puede crear controles Geosearchbylocation');
    }


    // name for this control
    this.name = GeosearchbylocationControl.NAME;

  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @public
   * @function
   * @param {*} obj - Object to compare
   * @returns {boolean} equals - Returns if they are equal or not
   * @api stable
   */
  equals(obj) {
    var equals = false;
    if (obj instanceof GeosearchbylocationControl) {
      equals = (this.name === obj.name);
    }
    return equals;
  }

  /**
   * This function creates the view to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map - Facade map
   * @returns {Promise} HTML template
   * @api stable
   */
  createView(map) {
    this.facadeMap_ = map;
    return Template.compile(GeosearchbylocationControl.TEMPLATE, {
      'jsonp': true
    });
  }

  /**
   * This function returns the HTML control button
   *
   * @public
   * @function
   * @param {HTMLElement} html to add the plugin
   * @api stable
   * @export
   */
  getActivationButton(element) {
    return element.querySelector('button#m-geosearchbylocation-button');
  }

  /**
   * This function enables search
   *
   * @public
   * @function
   * @api stable
   */
  activate() {
    this.element_.classList.add('activated');
    this.element_.classlist.add(GeosearchControl.SEARCHING_CLASS);
    this.getImpl().locate().then(coor => {
      var pointGeom = new ol.geom.Point(coor);
      var format = new ol.format.WKT();
      var coorTrans = format.writeGeometry(pointGeom);
      this.searchFrom_(coorTrans, coor);
    });
  }

  /**
   * This feature disables the search and delete the contents displayed by this control
   * @public
   * @function
   * @api stable
   */
  deactivate() {
    this.element_.classList.remove('activated');
    this.getImpl().clear();
    this.getImpl().removeLocate();
    this.getImpl().removeResultsContainer(this.resultsContainer_);
  }

  /**
   * This function draws the location on the map
   * @param {array} coor - Location coordinates
   * @private
   * @function
   */
  drawLocation_(coor) {
    this.getImpl().drawLocation(coor);
  }


  /**
   * This function performs search
   *
   * @param {string} coorTrans - Formatted coordinates with WKT
   * @param {array} coor - Coordinates
   * @private
   * @function
   */
  searchFrom_(coorTrans, coor) {
    let searchUrl = null;
    searchUrl = Utils.addParameters(this.searchUrl_, {
      'wt': 'json',
      'pt': coorTrans,
      'q': '*:*',
      'start': 0,
      'd': this.distance_,
      'spatialField': this.spatialField_,
      'rows': this.rows_,
      'srs': this.map_.getProjection().code
    });

    this.searchTime_ = Date.now();
    /* uses closure to keep the search time and it checks
     if the response is about the last executed search */
    (searchTime => {
      Remote.get(searchUrl).then(response => {
        // if searchTime was updated by this promise then this is the last
        if (searchTime === this.searchTime_) {
          let results;
          try {
            results = JSON.parse(response.text);
          } catch (err) {
            Exception('La respuesta no es un JSON válido: ' + err);
          }
          this.showResults_(results);
          this.drawLocation_(coor);
          this.zoomToResultsAll_();
          this.activationBtn_.classlist.remove(GeosearchControl.HIDDEN_RESULTS_CLASS);
          this.element_.classlist.remove(GeosearchControl.SEARCHING_CLASS);
        }
      });
    })(this.searchTime_);
  }

  /**
   * This function zooms results
   *
   * @private
   * @function
   */
  zoomToResultsAll_() {
    this.getImpl().zoomToResultsAll();
  }

  /**
   * This function clear map. draw results and adds a button click event to show list
   *
   * @private
   * @function
   * @param {object} results - Query results
   */
  showResults_(results) {
    // clears the layer
    this.getImpl().clear();

    this.results = results;
    this.showList = true;

    // draws the results on the map
    this.drawResults(results);

    let btnShowList = this.element_.querySelector('button#m-geosearchbylocation-button-list');
    btnShowList.addEventListener("click", this.showList_);
  }

  /**
   * This function adds a button click event to show list
   *
   * @private
   * @function
   */
  showList_() {
    if (this.showList === true) {
      let resultsTemplateVars = this.parseResultsForTemplate_(this.results);
      Template.compile(GeosearchbylocationControl.RESULTS_TEMPLATE, {
        'jsonp': true,
        'vars': resultsTemplateVars
      }).then(html => {
        this.resultsContainer_ = html;
        this.resultsScrollContainer_ = this.resultsContainer_.querySelector("div#m-geosearchbylocation-results-scroll");
        Utils.enableTouchScroll(this.resultsScrollContainer_);
        this.getImpl().addResultsContainer(this.resultsContainer_);
        var resultsHtmlElements = this.resultsContainer_.getElementsByClassName("result");
        for (var i = 0, ilen = resultsHtmlElements.length; i < ilen; i++) {
          let resultHtml = resultsHtmlElements.item(i);
          resultHtml.addEventListener("click", evt => {
            this.resultClick_(evt);
            this.getImpl().removeResultsContainer(this.resultsContainer_);
            this.showList = true;
          });
        }
        let btnCloseList = html.querySelector('.title > button.m-panel-btn');
        btnCloseList.addEventListener("click", this.showList_);
      });
      this.showList = false;
    } else {
      this.getImpl().removeResultsContainer(this.resultsContainer_);
      this.showList = true;
    }
  }

  /**
   * This function add/remove 'hidden' class
   *
   * @private
   * @function
   * @param {goog.events.BrowserEvent} evt - Keypress event
   */
  resultsClick_(evt) {
    this.resultsContainer_.classList.toggle(GeosearchControl.HIDDEN_RESULTS_CLASS);
  }
}

/**
 * Name of this control
 *
 * @const
 * @type {string}
 * @public
 * @api stable
 */
GeosearchbylocationControl.NAME = 'geosearchbylocation';

/**
 * Hidden class
 *
 * @const
 * @type {string}
 * @public
 * @api stable
 */
GeosearchbylocationControl.HIDDEN = 'hidden';

/**
 * Template for this controls
 *
 * @const
 * @type {string}
 * @public
 * @api stable
 */

GeosearchbylocationControl.TEMPLATE = 'geosearchbylocation.html';

/**
 * Template for show results
 * @const
 * @type {string}
 * @public
 * @api stable
 */
GeosearchbylocationControl.RESULTS_TEMPLATE = 'geosearchbylocationresults.html';
