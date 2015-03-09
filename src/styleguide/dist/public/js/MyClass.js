/** --------------------------------------------------------
    MyClass.js
    --------------------------------------------------------
    @author Keenan Staffieri
    JavaScript class template file.
    -------------------------------------------------------- */

/* global jQuery */

(function($) {

    'use strict';

    /**
        MyClass
    */
    var MyClass = function(name) {

        // Properties
        this.name = name;

        console.log('MyClass instantiated.');
    };


    /** --------------------------------------------------------
        Methods
        -------------------------------------------------------- */

    /**
        sayHello
        Simply say hello!
    */
    MyClass.prototype.sayHello = function () {
        console.log("Hello, I'm " + this.name + ".");
    };

    // Expose class for use in other files
    window.MyClass = MyClass;
  
})(jQuery);

//# sourceMappingURL=maps/MyClass.js.map