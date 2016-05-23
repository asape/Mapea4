(function (M) {
   /**
    * The Mapea URL
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.config('MAPEA_URL', 'http://localhost:8080/mapea');

   /**
    * The path to the Mapea proxy to send
    * jsonp requests
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.config('PROXY_PATH', '/api/proxy');

   /**
    * The path to the Mapea proxy to send
    * jsonp requests
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.config('PROXY_POST_PATH', '/proxyPost');

   /**
    * The path to the Mapea templates
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.config('TEMPLATES_PATH', '/files/templates/');

   /**
    * The Geosearch URL
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.config('GEOSEARCH_URL', 'http://clientes.guadaltel.es/desarrollo/geosearch');

   /**
    * The Geosearch core
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.config('GEOSEARCH_CORE', 'sigc');

   /**
    * The Geosearch handler
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.config('GEOSEARCH_HANDLER', '/search?');

   /**
    * The Geosearch distance
    * @const
    * @type {int}
    * @public
    * @api stable
    */
   M.config('GEOSEARCH_DISTANCE', 600);

   /**
    * The Geosearchbylocation spatial field
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.config('GEOSEARCH_SPATIAL_FIELD', 'geom');

   /**
    * The Geosearch rows
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.config('GEOSEARCH_ROWS', 100);

   /**
    * Predefined WMC files. It is composed of URL,
    * predefined name and context name.
    * @type {object}
    * @public
    * @api stable
    */
   M.config('predefinedWMC', {
      /**
       * Predefined WMC URLs
       * @const
       * @type {Array<string>}
       * @public
       * @api stable
       */
      'urls': (function (stringValue) {
         return stringValue.split(',');
      })('http://mapea-sigc.juntadeandalucia.es/Componente/mapConfig/contextCallejeroCache.xml,http://mapea-sigc.juntadeandalucia.es/Componente/mapConfig/contextCallejero.xml,http://mapea-sigc.juntadeandalucia.es/Componente/mapConfig/contextOrtofoto.xml,http://mapea-sigc.juntadeandalucia.es/Componente/mapConfig/contextIDEA.xml,http://mapea-sigc.juntadeandalucia.es/Componente/mapConfig/contextOrtofoto2009.xml,http://mapea-sigc.juntadeandalucia.es/Componente/mapConfig/callejero2011cache.xml,http://mapea-sigc.juntadeandalucia.es/Componente/mapConfig/ortofoto2011cache.xml,http://mapea-sigc.juntadeandalucia.es/Componente/mapConfig/hibrido2011cache.xml'),

      /**
       * WMC predefined names
       * @const
       * @type {Array<string>}
       * @public
       * @api stable
       */
      'predefinedNames': (function (stringValue) {
         return stringValue.split(',');
      })('callejerocacheado,callejero,ortofoto,idea,ortofoto09,callejero2011cache,ortofoto2011cache,hibrido2011cache'),

      /**
       * WMC context names
       * @const
       * @type {Array<string>}
       * @public
       * @api stable
       */
      'names': (function (stringValue) {
         return stringValue.split(',');
      })('mapa callejero cache,mapa del callejero,mapa ortofoto,mapa idea,mapa ortofoto09,Callejero,Ortofoto,Híbrido')
   });


   /**
    * Default projection
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.config('DEFAULT_PROJ', 'EPSG:23030*m');
})(window.M);