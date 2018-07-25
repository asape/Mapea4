import PopupImpl from 'impl/Popup';
import Config from 'configuration';
import 'assets/css/popup';
import Utils from './util/Utils';
import Base from './Base';
import Template from './util/Template';
import EventsManager from './event/Manager';
import MWindow from './util/Window';

class Tab {
  /**
   * @classdesc
   * Main constructor of the class. Creates a layer
   * with parameters specified by the user
   *
   * @constructor
   */
  constructor(options = {}) {
    /**
     * TODO
     * @public
     * @type {String}
     * @api stable
     * @expose
     */
    this.icon = options.icon;

    /**
     * TODO
     * @public
     * @type {String}
     * @api stable
     * @expose
     */
    this.title = options.title;

    /**
     * TODO
     * @public
     * @type {String}
     * @api stable
     * @expose
     */
    this.content = options.content;
  }
}

export default class Popup extends Base {
  /**
   * @classdesc
   * Main constructor of the class. Creates a layer
   * with parameters specified by the user
   *
   * @constructor
   * @extends {M.facade.Base}
   * @api stable
   */
  constructor(options) {
    const impl = new PopupImpl(options);
    // calls the super constructor
    super(impl);

    /**
     * TODO
     * @private
     * @type {Array<Number>}
     */
    this.coord_ = null;

    /**
     * TODO
     * @private
     * @type {Array<Popup.Tab>}
     */
    this.tabs_ = [];

    /**
     * TODO
     * @private
     * @type {HTMLElement}
     */
    this.element_ = null;

    /**
     * TODO
     * @private
     * @type {string}
     */
    this.status_ = Popup.status.COLLAPSED;
  }

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  getTabs() {
    return this.tabs_;
  }

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  removeTab(tabToRemove) {
    this.tabs_ = this.tabs_.filter(tab => tab.content !== tabToRemove.content);
    this.update();
  }

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  addTab(tabOptions) {
    let tab = tabOptions;
    if (!(tab instanceof Tab)) {
      tab = new Tab(tabOptions);
    }
    this.tabs_.push(tab);
    this.update();
  }

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  addTo(map, coordinate) {
    this.map_ = map;
    if (Utils.isNullOrEmpty(this.element_)) {
      Template.compile(Popup.TEMPLATE, {
        jsonp: true,
        vars: {
          tabs: this.tabs_,
        },
      }).then((html) => {
        if (this.tabs_.length > 0) {
          this.element_ = html;
          this.addEvents(html);
          this.getImpl().addTo(map, html);
          this.show(coordinate);
        }
      });
    }
    else {
      this.getImpl().addTo(map, this.element_);
      this.show(coordinate);
    }
  }

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  update() {
    if (!Utils.isNullOrEmpty(this.map_)) {
      Template.compile(Popup.TEMPLATE, {
        jsonp: true,
        vars: {
          tabs: this.tabs_,
        },
      }).then((html) => {
        if (this.tabs_.length > 0) {
          this.element_ = html;
          this.addEvents(html);
          this.getImpl().setContainer(html);
          this.show(this.coord_);
        }
      });
    }
  }

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  show(coord) {
    this.coord_ = coord;
    this.getImpl().show(this.coord_, () => {
      this.fire(EventsManager.SHOW);
    });
  }

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  hide(evt) {
    if (!Utils.isNullOrEmpty(evt)) {
      evt.preventDefault();
    }
    this.getImpl().hide();
  }

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  switchTab(index) {
    if (this.tabs_.length > index) {
      const tab = this.tabs_[index];
      this.setContent_(tab.content);
      this.show(this.coord_);
    }
  }

  /**
   * TODO
   * @private
   * @function
   */
  setContent_(content) {
    this.getImpl().setContent(content);
  }

  /**
   * TODO
   * @private
   * @function
   */
  getContent() {
    return this.getImpl().getContent();
  }

  /**
   * TODO
   * @private
   * @function
   */
  addEvents(htmlParam) {
    const html = htmlParam;

    // adds tabs events
    let touchstartY;
    const tabs = html.querySelectorAll('div.m-tab');
    Array.prototype.forEach.call(tabs, (tab) => {
      goog.events.listen(tab, ['click', 'touchend'], (evt) => {
        evt.preventDefault();
        // 5px tolerance
        const touchendY = evt.clientY;
        if ((evt.type === 'click') || (Math.abs(touchstartY - touchendY) < 5)) {
          // remove m-activated from all tabs
          Array.prototype.forEach.call(tabs, (addedTab) => {
            addedTab.classList.remove('m-activated');
          });
          tab.classList.add('m-activated');
          const index = tab.getAttribute('data-index');
          this.switchTab(index);
        }
      }, false);
    });

    // adds close event
    const closeBtn = html.querySelector('a.m-popup-closer');
    closeBtn.addEventListener('click', this.hide, false);
    closeBtn.addEventListener('touchend', this.hide, false);
    // mobile events
    let headerElement = html.querySelector('div.m-tabs');
    if (Utils.isNullOrEmpty(headerElement)) {
      headerElement = html.querySelector('div.m-content > div.m-header');
    }
    if (!Utils.isNullOrEmpty(headerElement)) {
      let topPosition;
      headerElement.addEventListener('touchstart', (evt) => {
        evt.preventDefault();
        touchstartY = evt.clientY;
        if (this.status_ === Popup.status.COLLAPSED) {
          topPosition = 0.9 * window.HEIGHT;
        }
        else if (this.status_ === Popup.status.DEFAULT) {
          topPosition = 0.45 * window.HEIGHT;
        }
        else if (this.status_ === Popup.status.FULL) {
          topPosition = 0;
        }
        html.classList.add('m-no-animation');
      }, false);

      headerElement.addEventListener('touchmove', (evt) => {
        evt.preventDefault();
        const touchY = evt.clientY;
        const translatedPixels = touchY - touchstartY;
        html.style.top = `${topPosition + translatedPixels}px`;
      }, false);

      headerElement.addEventListener('touchend', (evt) => {
        evt.preventDefault();
        const touchendY = evt.clientY;
        this.manageCollapsiblePopup_(touchstartY, touchendY);
      }, false);

      // CLICK EVENTS
      headerElement.addEventListener('mouseup', (evt) => {
        evt.preventDefault();

        // COLLAPSED --> DEFAULT
        if (this.tabs_.length <= 1) {
          if (this.status_ === Popup.status.COLLAPSED) {
            this.setStatus_(Popup.status.DEFAULT);
          }
          // DEFAULT --> FULL
          else if (this.status_ === Popup.status.DEFAULT) {
            this.setStatus_(Popup.status.FULL);
          }
          else {
            this.setStatus_(Popup.status.COLLAPSED);
          }
        }
      });
    }
  }

  /**
   * TODO
   * @private
   * @function
   */
  setStatus_(status) {
    if (status !== this.status_) {
      this.element_.classList.remove(this.status_);
      this.status_ = status;
      this.element_.classList.add(this.status_);
      this.element_.style.top = '';
      this.element_.classList.remove('m-no-animation');
      // mobile center
      if (MWindow.WIDTH <= Config.MOBILE_WIDTH) {
        this.getImpl().centerByStatus(status, this.coord_);
      }
    }
  }

  /**
   * TODO
   * @private
   * @function
   */
  manageCollapsiblePopup_(touchstartY, touchendY) {
    const touchPerc = (touchendY * 100) / MWindow.HEIGHT;
    const distanceTouch = Math.abs(touchstartY - touchendY);
    const distanceTouchPerc = (distanceTouch * 100) / MWindow.HEIGHT;
    // 10% tolerance
    if (distanceTouchPerc > 10) {
      /*
       * manages collapsing events depending on
       * the current position of the popup header and the direction
       *
       * These are the thresholds:
       *  _____________     ____________
       * |     0%      |       FULL
       * |-------------|
       * |             |
       * |     45%     |
       * |             | 2
       * |-------------|   ------------
       * |             | 1      DEFAULT
       * |             |
       * |             |
       * |-------------|   ------------
       * |     85%     |      COLLAPSED
       * |_____________|
       *
       */
      if (this.status_ === Popup.status.COLLAPSED) {
        // 2
        if (touchPerc < 45) {
          this.setStatus_(Popup.status.FULL);
        }
        // 1
        else if (touchPerc < 85) {
          this.setStatus_(Popup.status.DEFAULT);
        }
        else {
          this.setStatus_(Popup.status.COLLAPSED);
        }
      }
      else if (this.status_ === Popup.status.DEFAULT) {
        // 1
        if (touchPerc > 45) {
          this.setStatus_(Popup.status.COLLAPSED);
        }
        // 2
        else if (touchPerc < 45) {
          this.setStatus_(Popup.status.FULL);
        }
        else {
          this.setStatus_(Popup.status.DEFAULT);
        }
      }
      else if (this.status_ === Popup.status.FULL) {
        // 1
        if (touchPerc > 45) {
          this.setStatus_(Popup.status.COLLAPSED);
        }
        // 2
        else if (touchPerc > 0) {
          this.setStatus_(Popup.status.DEFAULT);
        }
        else {
          this.setStatus_(Popup.status.FULL);
        }
      }
    }
    else {
      this.setStatus_(this.status_);
    }
  }

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  getCoordinate() {
    return this.coord_;
  }

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  setCoordinate(coord) {
    this.coord_ = coord;
    if (!Utils.isNullOrEmpty(this.element_)) {
      this.getImpl().show(coord);
    }
  }

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  destroy() {
    this.tabs_.length = 0;
    this.coord_ = null;
    this.fire(EventsManager.DESTROY);
  }
}

/**
 * Template for popup
 * @const
 * @type {string}
 * @public
 * @api stable
 */
Popup.TEMPLATE = 'popup.html';

/**
 * status of this popup
 * @const
 * @type {object}
 * @public
 * @api stable
 */
Popup.status = {};

/**
 * collapsed status of this popup
 * @const
 * @type {string}
 * @public
 * @api stable
 */
Popup.status.COLLAPSED = 'm-collapsed';

/**
 * default status of this popup
 * @const
 * @type {string}
 * @public
 * @api stable
 */
Popup.status.DEFAULT = 'm-default';

/**
 * full status of this popup
 * @const
 * @type {string}
 * @public
 * @api stable
 */
Popup.status.FULL = 'm-full';
