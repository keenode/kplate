/** --------------------------------------------------------
    main.js
    --------------------------------------------------------
    @author Keenan Staffieri
    Main JavaScript file. Should serve as main entry point.
    -------------------------------------------------------- */

/* global jQuery */

(function($) {

    'use strict';

    class Messenger {

        constructor() {
            this.message = 'Hello, World.';
        }

        sayHello() {
            console.log(this.message);
        }
    }

    var m = new Messenger();
    m.sayHello();

})(jQuery);
