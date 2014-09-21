/** --------------------------------------------------------
	config/bowerComponents.js
	--------------------------------------------------------
	@author Keenan Staffieri
	List of bower components to inject into the main
	template.
	-------------------------------------------------------- */

// Path to bower_components folder
var bowerComponentsPath = './src/bower_components',

	/**
		Bower Components
		Array of bower resources.
	*/
	bowerComponents = [
		bowerComponentsPath + '/jquery/dist/jquery.js'
	];

// Make bowerComponents available from require
module.exports = bowerComponents;
