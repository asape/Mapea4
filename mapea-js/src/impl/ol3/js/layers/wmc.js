goog.provide('M.impl.layer.WMC');

goog.require('M.utils');
goog.require('M.exception');
goog.require('M.impl.Layer');
goog.require('M.impl.format.WMC.v110');

goog.require('ol.Extent');


(function () {
   /**
    * @classdesc
    * Main constructor of the class. Creates a WMC layer
    * with parameters specified by the user
    *
    * @constructor
    * @implements {M.impl.Layer}
    * @param {Mx.parameters.LayerOptions} options custom options for this layer
    * @api stable
    */
   M.impl.layer.WMC = (function (options) {
      /**
       * Indicates if the layer was selected
       * @private
       * @type {boolean}
       */
      this.selected = false;

      /**
       * WMS layers defined into the WMC
       * @private
       * @type {Array<M.layer.WMS>}
       */
      this.layers = [];

      /**
       * Load WMC file promise
       * @private
       * @type {Promise}
       */
      this.loadContextPromise = null;

      /**
       * Envolved extent for the WMC
       * @private
       * @type {Mx.Extent}
       */
      this.maxExtent = null;

      // calls the super constructor
      goog.base(this, options);
   });
   goog.inherits(M.impl.layer.WMC, M.impl.Layer);

   /**
    * This function sets the map object of the layer
    *
    * @public
    * @function
    * @param {M.impl.Map} map
    * @api stable
    */
   M.impl.layer.WMC.prototype.addTo = function (map) {
      this.map = map;
   };

   /**
    * This function select this WMC layer and
    * triggers the event to draw it
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.layer.WMC.prototype.select = function () {
      if (this.selected === false) {
         // unselect layers
         this.map.getWMC().forEach(function (wmcLayer) {
            wmcLayer.unselect();
         });

         this.selected = true;

         // loads the layers from this WMC if it is not cached
         var this_ = this;
         this.loadContextPromise = new Promise(function (success, fail) {
            M.remote.get(this_.url).then(function (response) {
               var wmcDocument = response.responseXml;
               var formater = new M.impl.format.WMC({
                  'projection': this_.map.getProjection().code
               });
               var context = formater.readFromDocument(wmcDocument);
               success.call(this_, context);
            });
         });
         this.loadContextPromise.then(function (context) {
            this_.loadLayers(context);
         });
      }
   };

   /**
    * This function unselect this WMC layer and
    * triggers the event to remove it
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.layer.WMC.prototype.unselect = function () {
      if (this.selected === true) {
         this.selected = false;

         // removes all loaded layers
         if (!M.utils.isNullOrEmpty(this.layers)) {
            this.map.removeLayers(this.layers);
         }
      }
   };

   /**
    * This function load all layers of the WMC and
    * it adds them to the map
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.layer.WMC.prototype.loadLayers = function (context) {
      this.layers = context.layers;
      this.projection = context.projection;
      this.maxExtent = context.maxExtent;

      this.map.addWMS(this.layers, true);
   };

   /**
    * This function gets the envolved extent for
    * this WMC
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.layer.WMC.prototype.getMaxExtent = function () {
      var this_ = this;
      var promise = new Promise(function (success, fail) {
         if (M.utils.isNullOrEmpty(this_.maxExtent)) {
            this_.loadContextPromise.then(function (context) {
               this_.maxExtent = context.maxExtent;
               success(this_.maxExtent);
            });
         }
         else {
            success(this_.maxExtent);
         }
      });
      return promise;
   };

   /**
    * This function gets layers loaded from
    * this WMC
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.layer.WMC.prototype.getLayers = function () {
      return this.layers;
   };

   /**
    * This function destroys this layer, cleaning the HTML
    * and unregistering all events
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.layer.WMC.prototype.destroy = function () {
      if (!M.utils.isNullOrEmpty(this.layers)) {
         this.map.removeLayers(this.layers);
      }
      this.map = null;
      this.layers.length = 0;
      this.wmcDocument = null;
   };

   /**
    * This function checks if an object is equals
    * to this layer
    *
    * @function
    * @api stable
    */
   M.impl.layer.WMC.prototype.equals = function (obj) {
      var equals = false;

      if (obj instanceof M.impl.layer.WMC) {
         equals = (this.url === obj.url);
         equals = equals && (this.name === obj.name);
      }

      return equals;
   };
})();