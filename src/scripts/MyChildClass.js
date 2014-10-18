/** --------------------------------------------------------
    MyChildClass.js
    --------------------------------------------------------
    @author Keenan Staffieri
    JavaScript child class template file.
    -------------------------------------------------------- */

/* global jQuery */
/* global MyClass */

(function($) {

    'use strict';

    /**
        MyChildClass
    */
    var MyChildClass = function(name, adj) {

        // Call the parent constructor
        MyClass.call(this, name);

        // Properties
        this.adj = adj;

        console.log('MyChildClass instantiated.');
    };

    // Create a MyChildClass.prototype object that inherits from MyClass.prototype. (extends)
    MyChildClass.prototype = Object.create(MyClass.prototype);

    // Set the "constructor" property to refer to MyChildClass
    MyChildClass.prototype.constructor = MyChildClass;


    /** --------------------------------------------------------
        Methods
        -------------------------------------------------------- */

    /**
        sayHello
        Simply say hello!
    */
    // Replaces the "sayHello" method from MyClass
    MyChildClass.prototype.sayHello = function() {
        console.log("Hello, I'm " + this.name + " from the child class.");
    };

    /**
        sayAdj
        Say an adjective describing this object.
    */
    MyChildClass.prototype.sayAdj = function() {
        console.log("I am " + this.adj + "!");
    };

    // Expose class for use in other files
    window.MyChildClass = MyChildClass;
  
})(jQuery);
