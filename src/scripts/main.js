/** --------------------------------------------------------
    main.js
    --------------------------------------------------------
    @author Keenan Staffieri
    Main JavaScript file. Should serve as main entry point
    for the web application.
    -------------------------------------------------------- */

/* global jQuery */
/* global MyClass */
/* global MyChildClass */

(function($) {

    'use strict';

    console.log("From 'main.js' file.");

    // Test jquery.myplugin
    $('img').myplugin({ action: 'addBorder' });

    // Test JavaScript OOP
    var classObj1 = new MyClass('Keenan');
    var classObj2 = new MyClass('Sean');

    console.log('Class Object 1 name: ' + classObj1.name);
    console.log('Class Object 2 name: ' + classObj2.name);

    classObj1.sayHello();
    classObj2.sayHello();

    // Test JavaScript OOP Inheritance
    var childClassObj = new MyChildClass('Keenode', 'smart');

    childClassObj.sayHello();
    childClassObj.sayAdj();

})(jQuery);
