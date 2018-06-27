import Utils from('../utils/utils.js');
import Exception from('../exception/exception.js');
import Layer from('./layers.js');
import Projection from('./projection.js');
import maxExtent from('./maxExtent.js');
import Resolutions from('./resolutions.js');
import Zoom from('./zoom.js');
import Center from('./center.js');

export class Parameter {
  'use strict';

  constructor(userParameters) {
    if (Utils.isNullOrEmpty(userParameters)) {
      Exception('No ha especificado ningún parámetro');
    }

    /**
     * @public
     * @type {Object}
     * @api stable
     */
    this.container = parseContainer(userParameters);

    /**
     * @public
     * @type {Object}
     * @api stable
     */
    this.layers = parseLayers(userParameters);

    /**
     * @public
     * @type {Object}
     * @api stable
     */
    this.wmc = parseWMC(userParameters);

    /**
     * @public
     * @type {Object}
     * @api stable
     */
    this.wms = parseWMS(userParameters);

    /**
     * @public
     * @type {Object}
     * @api stable
     */
    this.wmts = parseWMTS(userParameters);

    /**
     * @public
     * @type {Object}
     * @api stable
     */
    this.kml = parseKML(userParameters);

    /**
     * @public
     * @type {Object}
     * @api stable
     */
    this.controls = parseControls(userParameters);

    /**
     * @public
     * @type {Object}
     * @api stable
     */
    this.getfeatureinfo = parseGetFeatureInfo(userParameters);

    /**
     * @public
     * @type {Object}
     * @api stable
     */
    this.maxExtent = parseMaxExtent(userParameters);

    /**
     * @public
     * @type {Object}
     * @api stable
     */
    this.bbox = parseBbox(userParameters);

    /**
     * @public
     * @type {Number}
     * @api stable
     */
    this.zoom = parseZoom(userParameters);

    /**
     * @public
     * @type {Object}
     * @api stable
     */
    this.center = parseCenter(userParameters);

    /**
     * @public
     * @type {String|Array<String>|Array<Number>}
     * @api stable
     */
    this.resolutions = parseResolutions(userParameters);

    /**
     * @public
     * @type {Object}
     * @api stable
     */
    this.projection = parseProjection(userParameters);

    /**
     * @public
     * @type {Object}
     * @api stable
     */
    this.label = parseLabel(userParameters);

    /**
     * @public
     * @type {Object}
     * @api stable
     */
    this.ticket = parseTicket(userParameters);
  }

  /**
   * This function parses a container parameter in a legible
   * parameter to Mapea and checks posible errors
   *
   * @private
   * @function
   * @param {string|Mx.parameters.Map} userParameters parameters
   * especified by the user
   * @returns {Object} container of the map
   */
  parseContainer(userParameters) {
    let container;

    if (Utils.isString(userParameters)) {
      container = document.getElementById(userParameters);
    } else if (Utils.isObject(userParameters)) {
      if (!Utils.isNullOrEmpty(userParameters.id)) {
        container = document.getElementById(userParameters.id);
      } else if (!Utils.isNullOrEmpty(userParameters.container)) {
        container = parseContainer(userParameters.container);
      } else {
        Exception('No ha especificado ningún parámetro contenedor');
      }
    } else {
      Exception('El tipo del parámetro container no es válido: ' + (typeof userParameters));
    }

    if (Utils.isNullOrEmpty(container)) {
      Exception('No existe ningún contenedor con el id especificado');
    }

    return container;
  }

  /**
   * This function parses a layer parameter in a legible
   * parameter to Mapea and checks posible errors
   *
   * @private
   * @function
   * @param {string|Mx.parameters.Map} parameter parameters
   * especified by the user
   * @returns {string|Object|Array<string|Object>} layers specified by the user
   */
  parseLayers(parameter) {
    let layers;

    if (Utils.isString(parameter)) {
      layers = Utils.getParameterValue('layers', parameter);
    } else if (Utils.isObject(parameter)) {
      layers = parameter.layers;
    } else {
      Exception('El tipo del parámetro container no es válido: ' + (typeof parameter));
    }

    return layers;
  }

  /**
   * This function parses a wmc parameter in a legible
   * parameter to Mapea and checks posible errors
   *
   * @private
   * @function
   * @param {string|Mx.parameters.Map} parameter parameters
   * especified by the user
   * @returns {string|Object|Array<string|Object>} WMC layers
   */
  parseWMC(parameter) {
    let wmc;

    if (Utils.isString(parameter)) {
      wmc = Utils.parameterValue('wmc', parameter);
      if (Utils.isNullOrEmpty(wmc)) {
        wmc = Utils.parameterValue('wmcfile', parameter);
      }
      if (Utils.isNullOrEmpty(wmc)) {
        wmc = Utils.parameterValue('wmcfiles', parameter);
      }
    } else if (Utils.isObject(parameter)) {
      wmc = parameter.wmc;
      if (Utils.isNullOrEmpty(wmc)) {
        wmc = parameter.wmcfile;
      }
      if (Utils.isNullOrEmpty(wmc)) {
        wmc = parameter.wmcfiles;
      }
    } else {
      Exception('El tipo del parámetro container no es válido: ' + (typeof parameter));
    }
    return wmc;
  }

  /**
   * This function parses a wms parameter in a legible
   * parameter to Mapea and checks posible errors
   *
   * @private
   * @function
   * @param {string|Mx.parameters.Map} parameter parameters
   * especified by the user
   * @returns {string|Object|Array<string|Object>} WMS layers
   */
  parseWMS(parameter) {
    let wms;

    if (Utils.isString(parameter)) {
      wms = Utils.parameterValue('wms', parameter);
    } else if (Utils.isObject(parameter)) {
      wms = parameter.wms;
    } else {
      Exception('El tipo del parámetro container no es válido: ' + (typeof parameter));
    }

    return wms;
  }
  /**
   * This function parses a wmts parameter in a legible
   * parameter to Mapea and checks posible errors
   *
   * @private
   * @function
   * @param {string|Mx.parameters.Map} parameter parameters
   * especified by the user
   * @returns {string|Object|Array<string|Object>} WMTS layers
   */
  parseWMTS(parameter) {
    let wmts;

    if (Utils.isString(parameter)) {
      wmts = Utils.parameterValue('wmts', parameter);
    } else if (Utils.isObject(parameter)) {
      wmts = parameter.wmts;
    } else {
      Exception('El tipo del parámetro container no es válido: ' + (typeof parameter));
    }

    return wmts;
  }

  /**
   * This function parses a kml parameter in a legible
   * parameter to Mapea and checks posible errors
   *
   * @private
   * @function
   * @param {string|Mx.parameters.Map} parameter parameters
   * especified by the user
   * @returns {string|Object|Array<string|Object>} KML layers
   */
  parseKML(parameter) {
    let kml;

    if (Utils.isString(parameter)) {
      kml = Utils.parameterValue('kml', parameter);
    } else if (Utils.isObject(parameter)) {
      kml = parameter.kml;
    } else {
      Exception('El tipo del parámetro container no es válido: ' + (typeof parameter));
    }

    return kml;
  }

  /**
   * This function parses a controls parameter in a legible
   * parameter to Mapea and checks posible errors
   *
   * @private
   * @function
   * @param {string|Mx.parameters.Map} parameter parameters
   * especified by the user
   * @returns {string|Object|Array<string|Object>} WMS layers
   */
  parseControls(parameter) {
    let controls;

    if (Utils.isString(parameter)) {
      controls = Utils.parameterValue('controls', parameter);
    } else if (Utils.isObject(parameter)) {
      controls = parameter.controls;
    } else {
      Exception('El tipo del parámetro controls no es válido: ' + (typeof parameter));
    }

    return controls;
  }

  /**
   * This function parses a controls parameter in a legible
   * parameter to Mapea and checks posible errors
   *
   * @private
   * @function
   * @param {string|Mx.parameters.Map} parameter parameters
   * especified by the user
   * @returns {string|Object|Array<string|Object>} WMS layers
   */
  parseGetFeatureInfo(parameter) {
    let getFeatureInfo;

    if (Utils.isString(parameter)) {
      getFeatureInfo = Utils.parameterValue('getfeatureinfo', parameter);
    } else if (Utils.isObject(parameter)) {
      getFeatureInfo = parameter.getfeatureinfo;
      if (!Utils.isUndefined(getFeatureInfo) && Utils.isNullOrEmpty(getFeatureInfo)) {
        getFeatureInfo = 'plain';
      }
    } else {
      Exception('El tipo del parámetro controls no es válido: ' + (typeof parameter));
    }

    return getFeatureInfo;
  }

  /**
   * This function parses a maxExtent parameter in a legible
   * parameter to Mapea and checks posible errors
   *
   * @private
   * @function
   * @param {string|Mx.parameters.Map} parameter parameters
   * especified by the user
   * @returns {String|Array<String>|Array<Number>|Mx.Extent} maximum extent
   * established by the user
   */
  parseMaxExtent(parameter) {
    let maxExtent;

    if (Utils.isString(parameter)) {
      maxExtent = Utils.parameterValue('maxExtent', parameter);
      if (Utils.isNullOrEmpty(maxExtent)) {
        maxExtent = Utils.parameterValue('maxextent', parameter);
      }
    } else if (Utils.isObject(parameter)) {
      maxExtent = parameter.maxExtent;
      if (Utils.isNullOrEmpty(maxExtent)) {
        maxExtent = parameter.maxextent;
      }
    } else {
      Exception('El tipo del parámetro container no es válido: ' + (typeof parameter));
    }
    return maxExtent;
  }

  /**
   * This function parses a bbox parameter in a legible
   * parameter to Mapea and checks posible errors
   *
   * @private
   * @function
   * @param {string|Mx.parameters.Map} parameter parameters
   * especified by the user
   * @returns {String|Array<String>|Array<Number>|Mx.Extent} bbox
   * established by the user
   */
  parseBbox(parameter) {
    let bbox;

    if (Utils.isString(parameter)) {
      bbox = Utils.parameterValue('bbox', parameter);
    } else if (Utils.isObject(parameter)) {
      bbox = parameter.bbox;
    } else {
      Exception('El tipo del parámetro container no es válido: ' + (typeof parameter));
    }

    return bbox;
  };

  parseZoom(parameter) {
    let zoom;

    if (Utils.isString(parameter)) {
      zoom = Utils.parameterValue('zoom', parameter);
    } else if (Utils.isObject(parameter)) {
      zoom = parameter.zoom;
    } else {
      Exception('El tipo del parámetro zoom no es válido: ' + (typeof parameter));
    }

    return zoom;
  }

  parseCenter(parameter) {
    let center;

    if (Utils.isString(parameter)) {
      center = Utils.parameterValue('center', parameter);
    } else if (Utils.isObject(parameter)) {
      center = parameter.center;
    } else {
      Exception('El tipo del parámetro center no es válido: ' + (typeof parameter));
    }

    return center;
  }

  /**
   * This function parses a ticket parameter in a legible
   * parameter to Mapea and checks posible errors
   *
   * @private
   * @function
   * @param {string|Mx.parameters.Map} parameter parameters
   * especified by the user
   * @returns {String} ticket
   * established by the user
   */
  parseTicket(parameter) {
    let ticket;

    if (Utils.isString(parameter)) {
      ticket = Utils.parameterValue('ticket', parameter);
    } else if (Utils.isObject(parameter)) {
      ticket = parameter.ticket;
    } else {
      Exception('El tipo del parámetro ticket no es válido: ' + (typeof parameter));
    }

    return ticket;
  }

  /**
   * This function parses a resolutions parameter in a legible
   * parameter to Mapea and checks posible errors
   *
   * @private
   * @function
   * @param {string|Mx.parameters.Map} parameter parameters
   * especified by the user
   * @returns {String|Array<String>|Array<Number> resolutions}
   * established by the user
   */
  parseResolutions(parameter) {
    let resolutions;

    if (Utils.isString(parameter)) {
      resolutions = Utils.parameterValue('resolutions', parameter);
    } else if (Utils.isObject(parameter)) {
      resolutions = parameter.resolutions;
    } else {
      Exception('El tipo del parámetro container no es válido: ' + (typeof parameter));
    }

    return resolutions;
  }

  /**
   * This function parses a projection parameter in a legible
   * parameter to Mapea and checks posible errors
   *
   * @private
   * @function
   * @param {string|Mx.parameters.Map} parameter parameters
   * especified by the user
   * @returns {String|Array<String>|Array<Number>|Mx.Extent} bbox
   * established by the user
   */
  parseProjection(parameter) {
    let projection;

    if (Utils.isString(parameter)) {
      projection = Utils.parameterValue('projection', parameter);
    } else if (Utils.isObject(parameter)) {
      projection = parameter.projection;
    } else {
      Exception('El tipo del parámetro container no es válido: ' + (typeof parameter));
    }

    return projection;
  }

  /**
   * This function parses a projection parameter in a legible
   * parameter to Mapea and checks posible errors
   *
   * @private
   * @function
   * @param {string|Mx.parameters.Map} parameter parameters
   * especified by the user
   * @returns {String|Array<String>|Array<Number>|Mx.Extent} bbox
   * established by the user
   */
  parseLabel(parameter) {
    let label;

    if (Utils.isString(parameter)) {
      label = Utils.parameterValue('label', parameter);
    } else if (Utils.isObject(parameter)) {
      label = parameter.label;
    } else {
      Exception('El tipo del parámetro container no es válido: ' + (typeof parameter));
    }

    return label;
  }
}
