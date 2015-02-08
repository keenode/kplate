/** --------------------------------------------------------
    jquery.myplugin.js
    --------------------------------------------------------
    @author Keenan Staffieri
    jQuery plugin template.
    See jQuery plugin documentation:
    http://learn.jquery.com/plugins/basic-plugin-creation/
    -------------------------------------------------------- */

/* global jQuery */

(function($) {

    'use strict';

    /**
        jquery.myplugin
        Simply add a border to something for demonstration
        purposes.
    */
    $.fn.myplugin = function(options) {

        // Merge options with default options
        var _settings = $.extend({
            action: 'nothing'
        }, options);

        // Private vars for plugin
        var _borderColor = '#556b2f';

        // Perform specified action
        if(_settings.action === 'addBorder') {
            this.css('border', '2px solid ' + _borderColor);
        }

        return this; // make chainable
    };

})(jQuery);

//# sourceMappingURL=../maps/jquery-plugins/jquery.myplugin.js.map