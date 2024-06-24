// ----------
// Packing:
// ~pre
// locale-compiled/id_ID.js
// ~post
// ----------

// Begin ~pre
// ----------
// Packing:
// submodules/ModUtils/onModuleReady.js
// =onModuleReady('ZSC', function (ZSC) {
// =var validator = ZSC.validator;
// specs/GameMessage.js
// =ZSC.once(['DAPI', 'SNAPI', 'snid', '$'], function (DAPI, SNAPI, snid, $) {
// submodules/ZLoc/ZLocalization.js
// ----------

// Begin submodules/ModUtils/onModuleReady.js
/*global Zynga*/
(function () {
	var
		funcName = 'onModuleReady',
		root = window,
		had = Object.prototype.hasOwnProperty.call(root, funcName),
		previous = root[funcName],
		timer
	;
 //submodules/ModUtils/onModuleReady.js:10//
	root[funcName] = function (modName, callback) {
		root[funcName] = previous;
		if (!had) {
			try {
				delete root[funcName];
			} catch (ex) {
			}
		}
		timer = setInterval(function () {
			var mod; //submodules/ModUtils/onModuleReady.js:20//
			try {
				mod = Zynga.ns.Channels[modName];
			} catch (ex) {
			}
			if (mod) {
				clearInterval(timer);
				callback(mod);
			}
		}, 150);
	}; //submodules/ModUtils/onModuleReady.js:30//
}());

// End submodules/ModUtils/onModuleReady.js


// Begin =onModuleReady('ZSC', function (ZSC) {
onModuleReady('ZSC', function (ZSC) {

// End =onModuleReady('ZSC', function (ZSC) {


// Begin =var validator = ZSC.validator;
var validator = ZSC.validator;

// End =var validator = ZSC.validator;


// Begin specs/GameMessage.js
/*global validator*/

validator.define('GameMessageData', {
	type: 'object',
	properties: {
		// Asset image
		image: { type: 'string' },

		// Body text for type=other
		body: { type: 'string' } //specs/GameMessage.js:10//
	}
});

validator.define('GameMessageMetadata', {
	type: 'object',
	properties: {
		// Sender
		sender: { required: true, type: 'string' },

		// Sent timestamp //specs/GameMessage.js:20//
		timestamp: { required: true, spec: 'timestamp' },

		// Arbitrary message type identifier (eg, 'gift')
		type: { required: true, type: 'string' },

		// Arbitrary message subtype identifier (eg, 'Claymore', 'Ice Pick', etc)
		subtype: { required: true, type: 'string' },

		// Arbitrary message subtype identifier for aggregation
		// (eg, 'Claymores', 'Ice Picks', etc) //specs/GameMessage.js:30//
		subtype_aggregate: { type: 'string' },

		// Prevent message from aggregation
		preventAggregation: { type: 'boolean' },

		// Message has expired
		expired: { type: 'boolean' },

		// Category header to use for type=other
		type_text: { type: 'string' } //specs/GameMessage.js:40//
	}
});

// Game message (as received from ZRequests)
validator.define('GameMessage', {
	type: 'object',
	properties: {
		// Data
		data: { required: true, type: 'array', each: { spec: 'GameMessageData' }},
 //specs/GameMessage.js:50//
		// Metadata
		metadata: { required: true, spec: 'GameMessageMetadata' }
	}
});

// End specs/GameMessage.js


// Begin =ZSC.once(['DAPI', 'SNAPI', 'snid', '$'], function (DAPI, SNAPI, snid, $) {
ZSC.once(['DAPI', 'SNAPI', 'snid', '$'], function (DAPI, SNAPI, snid, $) {

// End =ZSC.once(['DAPI', 'SNAPI', 'snid', '$'], function (DAPI, SNAPI, snid, $) {


// Begin submodules/ZLoc/ZLocalization.js
/**
 * ZLoc.js
 *
 * Convinience wrappers/aliases
 *
 * @package ZLocalization
 * @copyright Copyright (&copy;) 2010, 2012 Zynga Game Network, Inc.
 */

var ZLoc = { //submodules/ZLoc/ZLocalization.js:10//

	locale: null,
	rawData: null,
	instance: null,

	/**
	 * Initializes a new Localizer instance with the locale and data you pass
	 * @param locale	string	the locale the rawData is for
	 * @param rawData	object	raw localized strings in nested objects
	 */ //submodules/ZLoc/ZLocalization.js:20//
	init: function (locale, rawData) {
		if (ZLoc.instance) {
			ZLoc.merge(locale, rawData);
			return;
		}
		ZLoc.locale = locale;
		ZLoc.rawData = rawData;
		ZLoc.instance = new ZLoc.Localizer(locale, rawData);
	},
 //submodules/ZLoc/ZLocalization.js:30//
	merge: function (locale, rawData) {
		if (locale != ZLoc.locale) {
			throw new Error('cannot merge ' + locale + ' with ' + ZLoc.locale);
		}
		ZLoc.instance.merge(rawData);
	},

	/** Convenience alias for translate */
	t: function (pkg, key, replacements) {
		return ZLoc.instance.t(pkg, key, replacements); //submodules/ZLoc/ZLocalization.js:40//
	},

	/** Convenience alias for createToken */
	tk: function (pkg, key, attributes, count) {
		return ZLoc.instance.tk(pkg, key, attributes, count);
	},

	/** Convenience alias for createName */
	tn: function (name, gender) {
		return ZLoc.instance.tn(name, gender); //submodules/ZLoc/ZLocalization.js:50//
	},

	/**
	 * Convenience alias for translateImagePath
	 */
	ti: function (path) {
		return ZLoc.instance.translateImagePath(path);
	},

	/** Convenience alias for timeAgoInWords */ //submodules/ZLoc/ZLocalization.js:60//
	timeAgoInWords: function () {
		return ZLoc.Formatter.timeAgoInWords.apply(null, arguments);
	},

	/** Convenience alias for formatList */
	formatList: function () {
		return ZLoc.Formatter.formatList.apply(null, arguments);
	},

	/** Convenience alias for sort */ //submodules/ZLoc/ZLocalization.js:70//
	sort: function (stringArray) {
		return ZLoc.instance.sort(stringArray);
	}
};


/**
 * ZLocUtil.js
 *
 * @package ZLocalization //submodules/ZLoc/ZLocalization.js:80//
 * @copyright Copyright (&copy;) 2010, Zynga Game Network, Inc.
 */

var ZLocUtil = {

	/**
	 * Diffs two arrays
	 * @param a1	array	first array
	 * @param a2	array	second array
	 * @return array	elements not in both arrays //submodules/ZLoc/ZLocalization.js:90//
	 */
	arrayDiff: function (a1, a2) {
		var index = {};
		var diff = [];

		for (var i = 0; i < a1.length; i++) {
			index[a1[i]] = true;
		}

		for (var j = 0; j < a2.length; j++) { //submodules/ZLoc/ZLocalization.js:100//
			if (index[a2[j]]) {
				delete index[a2[j]];
			} else {
				diff.push(a2[j]);
			}
		}

		for (var element in index) {
			if (index.hasOwnProperty(element)) {
				diff.push(element); //submodules/ZLoc/ZLocalization.js:110//
			}
		}

		return diff;
	},

	/**
	 * Intersects two arrays
	 * @param a1	array	first array
	 * @param a2	array	second array //submodules/ZLoc/ZLocalization.js:120//
	 * @return array	elements that are in both arrays
	 */
	arrayIntersect: function (a, b) {
		var intersection = [];
		var lookupIndex = {};

		for (var i = 0; i < a.length; ++i) {
			lookupIndex[a[i]] = true;
		}
 //submodules/ZLoc/ZLocalization.js:130//
		for (var j = 0; j < b.length; ++j) {
			if (lookupIndex[b[j]]) {
				intersection.push(b[j]);
			}
		}

		return intersection;
	},

	/** //submodules/ZLoc/ZLocalization.js:140//
	 * Copies the contents of the 2nd, 3rd, etc arguments into the 1st argument
	 */
	extend: function () {
		if (arguments.length < 2) {
			return;
		}

		var target = arguments[0];

		for (var i = 1; i < arguments.length; ++i) { //submodules/ZLoc/ZLocalization.js:150//
			for (var p in arguments[i]) {
				if (arguments[i].hasOwnProperty(p)) {
					target[p] = arguments[i][p];
				}
			}
		}
	}
};

 //submodules/ZLoc/ZLocalization.js:160//
/**
 * LocalizationToken.js
 *
 * @package ZLocalization
 * @copyright Copyright (&copy;) 2010, Zynga Game Network, Inc.
 */

/**
 * Constructs a new LocalizationToken
 */ //submodules/ZLoc/ZLocalization.js:170//
ZLoc.LocalizationToken = function () {
	this.m_attributes = [];
};

ZLoc.LocalizationToken.prototype = {

	/**
	 * Given an array of arrays of attributes, returns the indexes of the ones that are applicable.
	 * @param indexex	Array	An array of arrays of attributes
	 * @return Array	The indexes of the arrays of attributes that are applicable, or match, this token's attributes. //submodules/ZLoc/ZLocalization.js:180//
	 */
	filterIndexes: function (indexes) {
		var filteredIndexes = [];

		for (var i = 0; i < indexes.length; ++i) {
			var diff = ZLocUtil.arrayDiff(this.m_attributes, indexes[i]);
			if (!diff.length) {
				filteredIndexes.push(i);
			} else if (diff.length == 1 && ZLoc.LocalizationObjectToken.GENDERS.hasOwnProperty(diff[0]) && (this instanceof ZLoc.LocalizationName)) {
				// This will allow for the "known cases" not to blow up the translation //submodules/ZLoc/ZLocalization.js:190//
				filteredIndexes.push(i);
			}
		}

		return filteredIndexes;
	},

	/**
	 * Adds an array of attributes to our current set of attributes
	 * @param attributes	Array	An array of attributes to add //submodules/ZLoc/ZLocalization.js:200//
	 */
	addAttributes: function (attributes) {
		this.m_attributes = this.m_attributes.concat(attributes);
	},

	/**
	 * Returns the string that this LocalizationToken should be displayed as.
	 * Should be override by subclasses.
	 * @return String	The string to use for this token
	 */ //submodules/ZLoc/ZLocalization.js:210//
	getString: function () {
		throw new Error('Must override');
	}
};


/**
 * LocalizationObjectToken.js
 *
 * A LocalizationObjectToken is used to represent a token that has many variants, //submodules/ZLoc/ZLocalization.js:220//
 * and helps choose the correct one depending on the context.
 *
 * @package ZLocalization
 * @copyright Copyright (&copy;) 2010, Zynga Game Network, Inc.
 */

/**
 * Constructs a new object token
 * @param locString	LocalizedString	The localized string object that has the data for this token
 * @param attributes	String	Delimited string of attributes for this token (default delimiter is ',') //submodules/ZLoc/ZLocalization.js:230//
 * @param count	int	(optional)	Adds 'plural' or 'singular' based on the count
 */
ZLoc.LocalizationObjectToken = function (locString, attributes, count) {
	this.m_locString = locString;
	if (attributes) {
		this.m_attributes = attributes.split(ZLoc.LocalizationObjectToken.ATTRIBUTE_DELIM);
	} else {
		this.m_attributes = [];
	}
	if (!isNaN(count)) { //submodules/ZLoc/ZLocalization.js:240//
		this.m_attributes.push(
			(count == 1) ? ZLoc.LocalizationObjectToken.SINGULAR :
				ZLoc.LocalizationObjectToken.PLURAL);
	}
	if (this.m_locString && this.m_locString.m_gender !== null && this.m_locString.m_gender !== undefined) {
		this.m_attributes.push(this.m_locString.m_gender);
	}
};

ZLocUtil.extend(ZLoc.LocalizationObjectToken, { //submodules/ZLoc/ZLocalization.js:250//
	ATTRIBUTE_DELIM: ',',
	DEFAULT_GENDER: 'masc',
	SINGULAR: 'singular',
	GENDERS: { 'masc': 0, 'fem': 1, 'neuter': 2 },
	PLURAL: 'plural',
	VALID_ATTRIBUTES: ['plural', 'singular', 'count', 'indefinite', 'definite', 'masc', 'fem'],
	LOOKUP_ATTRIBUTES: [['indefinite', 'definite'], ['singular', 'plural']]
});

 //submodules/ZLoc/ZLocalization.js:260//
ZLoc.LocalizationObjectToken.prototype = new ZLoc.LocalizationToken();

ZLocUtil.extend(ZLoc.LocalizationObjectToken.prototype, {
	/** re set the constructor back after inheriting */
	constructor: ZLoc.LocalizationObjectToken,

	/** @inherit */
	getString: function () {
		var keyPieces = [];
		for (var i = 0; i < ZLoc.LocalizationObjectToken.LOOKUP_ATTRIBUTES.length; ++i) { //submodules/ZLoc/ZLocalization.js:270//
			var chosen = ZLocUtil.arrayIntersect(this.m_attributes, ZLoc.LocalizationObjectToken.LOOKUP_ATTRIBUTES[i]);
			if (chosen.length > 0) {
				if (chosen.length == 1) {
					keyPieces.push(chosen[0]);
				} else {
					throw new Error("Token attributes lead to an ambiguous variant.");
				}
			}
		}
		return this.m_locString.getVariation(keyPieces.join("_")); //submodules/ZLoc/ZLocalization.js:280//
	},

	/**
	 * Validates attributes using the list of validate attributes specified as a static var.
	 * Throws an exception if the attributes are not valid.
	 * @param attributes	Array	An array of attributes to validate
	 */
	validateAttributes: function (attributes) {
		var diff = ZLocUtil.arrayDiff(attributes, ZLoc.LocalizationObjectToken.VALID_ATTRIBUTES);
		if (diff.length) { //submodules/ZLoc/ZLocalization.js:290//
			throw "Invalid token attributes: " + diff.join(",");
		}
	}
});

/**
 * LocalizationName.js
 *
 * @package ZLocalization
 * @copyright Copyright (&copy;) 2010, Zynga Game Network, Inc. //submodules/ZLoc/ZLocalization.js:300//
 */

/**
 * Constructs a new LocalizationName
 * @param name	string	the name of the user we're representing
 * @param gender	string	the gender of the name
 */
ZLoc.LocalizationName = function (name, gender) {
	this.m_name = name;
	if (!gender) { //submodules/ZLoc/ZLocalization.js:310//
		gender = ZLoc.LocalizationName.DEFAULT_GENDER;
	}
	this.m_attributes = [gender];
};

/** Default gender for names */
ZLoc.LocalizationName.DEFAULT_GENDER = "masc";

/** Inherit from LocalizationToken */
ZLoc.LocalizationName.prototype = new ZLoc.LocalizationToken(); //submodules/ZLoc/ZLocalization.js:320//

ZLocUtil.extend(ZLoc.LocalizationName.prototype, {
	/** re set the constructor */
	constructor: ZLoc.LocalizationName,

	/** @inherit */
	getString: function () {
		return this.m_name;
	}
}); //submodules/ZLoc/ZLocalization.js:330//

/**
 * LocalizedString.js
 *
 * @package ZLocalization
 * @copyright Copyright (&copy;) 2010, Zynga Game Network, Inc.
 */

/**
 * Creates a new LocaliedString. //submodules/ZLoc/ZLocalization.js:340//
 * A LocalizedString represents an entry in the XML, including data such as variants and gender.
 * @param original	String	The original, un-expanded string
 * @param variations	Object	A map of variation string
 */
ZLoc.LocalizedString = function (original, variations, gender) {
	this.attributes = [];
	this.m_original = original;
	this.m_variations = variations;
	this.m_gender = gender;
}; //submodules/ZLoc/ZLocalization.js:350//


ZLocUtil.extend(ZLoc.LocalizedString, {
	ORIGINAL: "original",
	PROPAGATED_ATTRIBUTES: ['indefinite', 'definite', 'singular', 'plural']
});

ZLoc.LocalizedString.prototype = {
	/**
	 * Sets the gender of this string //submodules/ZLoc/ZLocalization.js:360//
	 * @param gender	String	The gender to set this string to (masc/fem)
	 */
	setGender: function (gender) {
		this.m_gender = gender;
	},

	/**
	 * @return String	The gender of this string
	 */
	getGender: function () { //submodules/ZLoc/ZLocalization.js:370//
		return this.m_gender;
	},

	/**
	 * Returns the variation specifed by key
	 * @param key	String	The key of the variant to retrieve
	 * @return String	The variant you requested
	 */
	getVariation: function (key) {
		if (key == ZLoc.LocalizedString.ORIGINAL) { //submodules/ZLoc/ZLocalization.js:380//
			return this.m_original;
		} else {
			return this.m_variations[key];
		}
	},

	/**
	 * Computes the string after token replacements if any using the substituter passed in
	 * @param replacements	Object	Map of replacement tokens
	 * @param substituter	SubstituterSimple //submodules/ZLoc/ZLocalization.js:390//
	 * @return String	The string representation after choosing a variant and substituting tokens
	 */
	toString: function (replacements, substituter) {

		var keys = [];
		for (var obj in this.m_variations) {
			if (this.m_variations.hasOwnProperty(obj)) {
				keys.push(obj);
			}
		} //submodules/ZLoc/ZLocalization.js:400//

		if (keys.length === 0) {
			keys.push(ZLoc.LocalizedString.ORIGINAL);
		}

		var theString, tokenReplacements = {};
		var i, choice, match, attrs, token, occurrences;
		var attributes, toPropagate, validIndexes, newKeys;
		for (var key in replacements) {
 //submodules/ZLoc/ZLocalization.js:410//
			if (replacements[key] instanceof ZLoc.LocalizationToken) {
				token = replacements[key];
				attributes = [];
				toPropagate = ZLoc.LocalizedString.PROPAGATED_ATTRIBUTES;
				occurrences = 0;
				for (i = 0; i < keys.length; ++i) {
					choice = this.getVariation(keys[i]);

					match = choice.match(new RegExp('{' + key + '(?:,\\s*([a-z,]+))?}'));
					if (match && match.length == 2) { //submodules/ZLoc/ZLocalization.js:420//
						occurrences++;
						if (typeof(match[1]) == 'string' && match[1] !== "") {
							attrs = match[1].split(',');
							toPropagate = ZLocUtil.arrayIntersect(toPropagate, attrs);
							attributes.push(attrs);
						}
					}
				}
				if (occurrences > 0) {
					if (attributes.length > 0) { //submodules/ZLoc/ZLocalization.js:430//
						token.addAttributes(toPropagate);
						validIndexes = token.filterIndexes(attributes);
						newKeys = [];
						for (i = 0; i < validIndexes.length; ++i) {
							newKeys.push(keys[validIndexes[i]]);
						}
						keys = newKeys;
					}

					tokenReplacements[key] = token.getString(); //submodules/ZLoc/ZLocalization.js:440//
				}
			} else {
				tokenReplacements[key] = replacements[key].toString();
			}
		}

		if (keys.length == 1) {
			theString = this.getVariation(keys[0]).replace(new RegExp('{([^},]+),\\s*[a-z,]+}', 'g'), '{$1}');
		} else if (keys.length > 1) {
			throw new Error('Ambiguous token specification for string, please provide more token attributes to narrow your selection.'); //submodules/ZLoc/ZLocalization.js:450//
		} else if (keys.length < 1) {
			throw new Error('No matches found');
		}

		return substituter.replace(theString, tokenReplacements);
	}
};

/**
 * SubstituterSimple.js //submodules/ZLoc/ZLocalization.js:460//
 *
 * @package ZLocalization
 * @copyright Copyright (&copy;) 2010, Zynga Game Network, Inc.
 */

ZLoc.SubstituterSimple = function () {
};

ZLoc.SubstituterSimple.prototype = {
	/** //submodules/ZLoc/ZLocalization.js:470//
	 * Substitutes a string's tokens using the replacements passed in
	 * @param str	String	The string with tokens
	 * @param	replacements	Object	A map of tokens and their replacements
	 * @return String	The string you passed in with all the substitutions made.
	 */
	replace: function (str, replacements) {
		for (var key in replacements) {
			if (replacements.hasOwnProperty(key)) {
				str = str.replace(new RegExp("{" + key + "}", "g"), replacements[key]);
			} //submodules/ZLoc/ZLocalization.js:480//
		}
		return str;
	}
};

/**
 * SubstituterContractions.js
 *
 * @package ZLocalization
 * @copyright Copyright (&copy;) 2010, Zynga Game Network, Inc. //submodules/ZLoc/ZLocalization.js:490//
 */

ZLoc.SubstituterContractions = function () {
};

ZLoc.SubstituterContractions.prototype = new ZLoc.SubstituterSimple();

ZLocUtil.extend(ZLoc.SubstituterContractions.prototype, {
	/**
	 * Substitutes a string's tokens using the replacements passed in //submodules/ZLoc/ZLocalization.js:500//
	 * @param str	String	The string with tokens
	 * @param	replacements	Object	A map of tokens and their replacements
	 * @return String	The string you passed in with all the substitutions made.
	 */
	replace: function (str, replacements) {
		for (var key in replacements) {
			if (replacements.hasOwnProperty(key)) {
				var replacement = replacements[key];
				var articlePattern = this.getContractionPattern();
				var match = replacement.match(articlePattern); //submodules/ZLoc/ZLocalization.js:510//
				if (match) {
					var article = match[1];
					var withoutArticle = replacement.replace(new RegExp('^' + article + ' '), '');
					article = article.toLowerCase();
					var contractionMap = this.getContractionMap();
					var contractionsForArticle = contractionMap[article];
					for (var matchingArticle in contractionsForArticle) {
						if (contractionsForArticle.hasOwnProperty(matchingArticle)) {
							var contractionRaw = contractionMap[article][matchingArticle];
							var contraction = this.getContraction(contractionRaw, withoutArticle); //submodules/ZLoc/ZLocalization.js:520//
							////
							var replacementString;
							if (contraction.substr(-1, 1) == "'") {
								// if the last letter of the contraction is ' we dont need space
								replacementString = ' ' + contraction + withoutArticle;
							} else {
								replacementString = ' ' + contraction + ' ' + withoutArticle;
							}
							////
							str = str.replace(new RegExp('^' + matchingArticle  + ' {' + key + '}'), replacementString); //submodules/ZLoc/ZLocalization.js:530//
							str = str.replace(new RegExp(' ' + matchingArticle  + ' {' + key + '}', 'g'), replacementString);
						}
					}
				}
				str = str.replace(new RegExp('{' + key + '}', 'g'), replacement);
			}
		}
		return str;
	},
 //submodules/ZLoc/ZLocalization.js:540//
	/**
	 * gets the RegExp to seach for valid articles in the token
	 * @return RegExp
	 **/
	getContractionPattern: function () {
		var contractionMap = this.getContractionMap();
		var pattern = "";
		for (var key in contractionMap) {
			if (contractionMap.hasOwnProperty(key)) {
				pattern += key + '|'; //submodules/ZLoc/ZLocalization.js:550//
			}
		}
		pattern = pattern.substr(0, pattern.length - 1); //strips the last "|" off... there has got to be a better way of doing this
		var contractionPattern = new RegExp('^(' + pattern + ') ', 'i');
		return contractionPattern;
	},

	/**
	 * gets the contraction
	 *  @param contraction is by default a string. However some child classes take in an Object, so override this if //submodules/ZLoc/ZLocalization.js:560//
	 *		you expect to take in a string or an object (see SubstituterFr for an example)
	 *  @return String	the proper contraction
	 * */
	getContraction: function (contraction, withoutArticle) {
		if (typeof(contraction) == 'string') {
			return String(contraction);
		} else {
			//shouldn't get here
			return '';
		} //submodules/ZLoc/ZLocalization.js:570//
	}
});

/**
 * SubstituterEs.js
 *
 * @package ZLocalization
 * @copyright Copyright (&copy;) 2010, Zynga Game Network, Inc.
 */
 //submodules/ZLoc/ZLocalization.js:580//
ZLoc.SubstituterEs = function () {
};

ZLoc.SubstituterEs.prototype = new ZLoc.SubstituterSimple();
ZLocUtil.extend(ZLoc.SubstituterEs.prototype, {
	/**
	 * Substitutes a string's tokens using the replacements passed in
	 * @param str	String	The string with tokens
	 * @param	replacements	Object	A map of tokens and their replacements
	 * @return String	The string you passed in with all the substitutions made. //submodules/ZLoc/ZLocalization.js:590//
	 */
	replace: function (str, replacements) {
		for (var key in replacements) {
			if (replacements.hasOwnProperty(key)) {
				var replacement = replacements[key];
				if (replacement.indexOf('el ') === 0) {
					var withoutArticle = replacement.substr(3);
					str = str.replace(new RegExp(" de {" + key + "}", "g"), " del " + withoutArticle);
					str = str.replace(new RegExp(" a {" + key + "}", "g"), " al " + withoutArticle);
				} //submodules/ZLoc/ZLocalization.js:600//
				str = str.replace(new RegExp("{" + key + "}", "g"), replacement);
			}
		}
		return str;
	}
});

/**
 * SubstituterPt.js
 * //submodules/ZLoc/ZLocalization.js:610//
 * @package ZLocalization
 * @copyright Copyright (&copy;) 2010, Zynga Game Network, Inc.
 */

ZLoc.SubstituterPt = function () {
};

ZLoc.SubstituterPt.prototype = new ZLoc.SubstituterContractions();

/** @var	Object	maps contraction words to their contracted form */ //submodules/ZLoc/ZLocalization.js:620//
ZLoc.SubstituterPt.contractionMap = {
	'o': {'de': 'do', 'em': 'no', 'por': 'pelo', 'a': 'ao'},
	'a': {'de': 'da', 'em': 'na', 'por': 'pela', 'a': 'à'},
	'os': {'de': 'dos', 'em': 'nos', 'por': 'pelos', 'a': 'aos'},
	'as': {'de': 'das', 'em': 'nas', 'por': 'pelas', 'a': 'às'}
};

ZLocUtil.extend(ZLoc.SubstituterPt.prototype, {

	/** //submodules/ZLoc/ZLocalization.js:630//
	 *  @inherit
	 * returns the contractionMap
	 * @return Object	SubstituterPt.contractionMap
	 */
	getContractionMap: function () {
		return ZLoc.SubstituterPt.contractionMap;
	}
});

/** //submodules/ZLoc/ZLocalization.js:640//
 * SubstituterDe.js
 *
 * @package ZLocalization
 * @copyright Copyright (&copy;) 2010, Zynga Game Network, Inc.
 */

ZLoc.SubstituterDe = function () {
};

ZLoc.SubstituterDe.prototype = new ZLoc.SubstituterContractions(); //submodules/ZLoc/ZLocalization.js:650//

/** @var	Object	maps contraction words to their contracted form */
ZLoc.SubstituterDe.contractionMap = {
	'der': { 'an': 'am', 'bei': 'beim', 'in': 'im', 'von': 'vom', 'zu': 'zum' },
	'die': { 'zu': 'zur' },
	'das': { 'an': 'ans', 'in': 'ins' }
};

ZLocUtil.extend(ZLoc.SubstituterDe.prototype, {
 //submodules/ZLoc/ZLocalization.js:660//
	/**
	 *  @inherit
	 * returns the contractionMap
	 * @return Object	SubstituterPt.contractionMap
	 */
	getContractionMap: function () {
		return ZLoc.SubstituterDe.contractionMap;
	}
});
 //submodules/ZLoc/ZLocalization.js:670//
/**
 * SubstituterFr.js
 *
 * @package ZLocalization
 * @copyright Copyright (&copy;) 2010, Zynga Game Network, Inc.
 */

ZLoc.SubstituterFr = function () {
};
 //submodules/ZLoc/ZLocalization.js:680//
ZLoc.SubstituterFr.prototype = new ZLoc.SubstituterContractions();

/** @var	String	const for 'vowel' */
ZLoc.SubstituterFr.VOWEL = 'vowel';

/** @var	String	const for 'consonant' */
ZLoc.SubstituterFr.CONSONANT = 'consonant';

/** @var	Object	french vowels as keys */
ZLoc.SubstituterFr.vowels = { //submodules/ZLoc/ZLocalization.js:690//
	'a': 1,
	'à': 1,
	'á': 1,
	'â': 1,
	'ä': 1,
	'e': 1,
	'è': 1,
	'é': 1,
	'ê': 1,
	'ë': 1, //submodules/ZLoc/ZLocalization.js:700//
	'i': 1,
	'ì': 1,
	'í': 1,
	'î': 1,
	'ï': 1,
	'o': 1,
	'ò': 1,
	'ó': 1,
	'ô': 1,
	'ö': 1, //submodules/ZLoc/ZLocalization.js:710//
	'u': 1,
	'ù': 1,
	'ú': 1,
	'û': 1,
	'ü': 1
};

/** @var	Object	maps contraction words to their contracted form */
ZLoc.SubstituterFr.contractionMap = {
	'le': { 'de': 'du', 'à': 'au' }, //submodules/ZLoc/ZLocalization.js:720//
	'les': { 'de': 'des', 'à': 'aux' },
	'un': { 'de': "d'un" },
	'une': { 'de': "d'une" },
	'des': {
		'de': {
			'vowel': "d'", //vowel
			'consonant': 'de'  //consonant
		}
	}
}; //submodules/ZLoc/ZLocalization.js:730//

ZLocUtil.extend(ZLoc.SubstituterFr.prototype, {

	/**
	 *  @inherit
	 * returns the contractionMap
	 * @return Object	SubstituterFr.contractionMap
	 */
	getContractionMap: function () {
		return ZLoc.SubstituterFr.contractionMap; //submodules/ZLoc/ZLocalization.js:740//
	},

	/**
	 *  @inherit
	 * returns the correct Contraction... in some langauges the same article pairs have multiple contractions depending on the rest of the token.
	 * @param contraction	Object	An object if the article pair has more than 1 contractions, or a string if the pair only has 1 contraction.
	 * @param	withoutArticle	String	the token without the matching article.
	 * @return String	the proper contraction
	 */
	getContraction: function (contraction, withoutArticle) { //submodules/ZLoc/ZLocalization.js:750//
		if (typeof(contraction) == 'string') {
			return String(contraction);
		}

		var match = withoutArticle.match(new RegExp("\\S"));
		var firstLetter = match[0];
		if (ZLoc.SubstituterFr.vowels.hasOwnProperty(firstLetter)) {
			//vowel;
			return contraction[ZLoc.SubstituterFr.VOWEL];
		} else { //submodules/ZLoc/ZLocalization.js:760//
			return contraction[ZLoc.SubstituterFr.CONSONANT];
		}
	}
});


/**
 * Collator
 *
 * Provides locale specific sorting on client. //submodules/ZLoc/ZLocalization.js:770//
 *
 * If user's selected locale is the same as the browser's locale, this
 * uses the defaule localeCompare function.   Otherwise, it uses the
 * alphabets specified in lc_locale to sort.   If an alphabet isn't specified
 * for the user's locale, it will fall back to the default locale compare.
 *
 */
ZLoc.Collator = function (locale) {
	var me = {};
 //submodules/ZLoc/ZLocalization.js:780//
	// TODO: Add alphabets here for languages that need custom sort rules
	var _lc_locale_def = {
		'default': '_0123456789aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ',
		'en_UD': 'zZyYxXwWuUtTsSrRqQpPoOnNmMlLkKjJiIhHgGfFeEdDcCbBaA98765432310_'
	};

	var _lc_locale = _lc_locale_def['default'];
	if (_lc_locale_def.hasOwnProperty(locale)) {
		_lc_locale = _lc_locale_def[locale];
	} //submodules/ZLoc/ZLocalization.js:790//
	// produce equivavlent of alphabet in native JavaScript sort order
	var _lc_native = _lc_locale.split("").sort().join("");

	var _lc_cache = [];

	// Create character remapping array
	var _lc_l2n_arr = [];
	var r = 0;
	for (var i = 0; i < _lc_locale.length; i++) {
		if (_lc_locale.charAt(i) != _lc_native.charAt(i)) { //submodules/ZLoc/ZLocalization.js:800//
			_lc_l2n_arr[_lc_locale.charAt(i)] = _lc_native.charAt(i);
			r++;
		}
	}

	// Convert string to correct sort order according to locale
	function _lc(str) {
		if (_lc_cache && _lc_cache[str]) {
			return _lc_cache[str];
		} else { //submodules/ZLoc/ZLocalization.js:810//
			var out = '';
			for (var i = 0; i <= str.length; i++) {
				var c = str.charAt(i);
				if (_lc_l2n_arr[c]) {
					out += _lc_l2n_arr[c];
				} else {
					out += c;
				}
			}
			if (_lc_cache) { //submodules/ZLoc/ZLocalization.js:820//
				_lc_cache[str] = out;
			}
			return out;
		}
	}

	// Return the default locale of the browser
	function getBrowserLanguage() {
		var lang;
		if (navigator) { //submodules/ZLoc/ZLocalization.js:830//
			if (navigator.language) {
				lang = navigator.language;
			}
			else if (navigator.browserLanguage) {
				lang = navigator.browserLanguage;
			}
			else if (navigator.systemLanguage) {
				lang = navigator.systemLanguage;
			}
			else if (navigator.userLanguage) { //submodules/ZLoc/ZLocalization.js:840//
				lang = navigator.userLanguage;
			}
		}
		if (lang) {
			lang = lang.replace('-', '_');
		}
		return lang;
	}

	// Default locale sort function of browser //submodules/ZLoc/ZLocalization.js:850//
	function defaultSort(string1, string2) {
		return string1.toString().localeCompare(string2.toString());
	}


	// Sort function with custom locale support
	function localeSort(a, b) {
		var a_l = _lc(a);
		var b_l = _lc(b);
 //submodules/ZLoc/ZLocalization.js:860//
		if (a_l < b_l) {
			return -1;
		} else if (a_l == b_l) {
			return 0;
		} else {
			return 1;
		}
	}

	/** //submodules/ZLoc/ZLocalization.js:870//
     * Sort an array of localized strings
     * @param {array} strArray  An array of unsorted localized strings
     * returns {array}          An array of sorted localized strings
     */
	me.sort = function (locale, strArray) {
		// If user selected locale doesn't match browser locale,
		//  AND we have an alphabet for this locale, do custom sort
		if (getBrowserLanguage() !== locale && _lc_locale_def.hasOwnProperty(locale)) {
			return strArray.sort(localeSort);
		} //submodules/ZLoc/ZLocalization.js:880//
		//  Fall back to default browser compare
		return strArray.sort(defaultSort);
	};

	return me;
};

/**
 * Localizer.js
 * //submodules/ZLoc/ZLocalization.js:890//
 * @package ZLocalization
 * @copyright Copyright (&copy;) 2010, Zynga Game Network, Inc.
 */

/**
 * Constructs a new Localizer object
 * @param locale	string	the locale we're loading
 * @param rawData	object	the raw data of nested objects containing the localized strings for this locale
 */
ZLoc.Localizer = function (locale, rawData) { //submodules/ZLoc/ZLocalization.js:900//

	this.m_locale = locale;
	this.m_langCode = this.m_locale.split(ZLoc.Localizer.LOCALE_DELIMITER)[0];
	this.m_raw = rawData;
	this.m_cached = {};
	for (var pkg in this.m_raw) {
		if (this.m_raw.hasOwnProperty(pkg)) {
			this.m_cached[pkg] = {};
		}
	} //submodules/ZLoc/ZLocalization.js:910//

	if (ZLoc.Localizer.substituterMap.hasOwnProperty(this.m_locale)) {
		this.m_substituter = new ZLoc.Localizer.substituterMap[this.m_locale]();
	} else if (ZLoc.Localizer.substituterMap.hasOwnProperty(this.m_langCode)) {
		this.m_substituter = new ZLoc.Localizer.substituterMap[this.m_langCode]();
	} else {
		this.m_substituter = new ZLoc.SubstituterSimple();
	}

	this.m_collator = new ZLoc.Collator(this.m_locale); //submodules/ZLoc/ZLocalization.js:920//
};

ZLocUtil.extend(ZLoc.Localizer, {
	MASC: 'masc',
	FEM: 'fem',
	IMAGE_PACKAGE: 'LocalizedImages',
	LOCALE_DELIMITER: '_',
	DEFAULT_GENDER: 'masc',
	substituterMap: {
		'es': ZLoc.SubstituterEs, //submodules/ZLoc/ZLocalization.js:930//
		'en_UD': ZLoc.SubstituterEnFlip,
		'en_PI': ZLoc.SubstituterEnZy,
		'fr': ZLoc.SubstituterFr,
		'pt': ZLoc.SubstituterPt,
		'de': ZLoc.SubstituterDe
	}
});


ZLoc.Localizer.prototype = { //submodules/ZLoc/ZLocalization.js:940//

	merge: function (rawData) {
		for (var pkg in rawData) {
			if (rawData.hasOwnProperty(pkg)) {
				this.m_raw[pkg] = rawData[pkg];
				this.m_cached[pkg] = {};
			}
		}
	},
 //submodules/ZLoc/ZLocalization.js:950//
	/** Convenience wrapper for translate */
	t: function (pkg, key, replacements) {
		return this.translate(pkg, key, replacements);
	},

	/** Convenience wrapper for createToken */
	tk: function (pkg, key, attributes, count) {
		return this.createToken(pkg, key, attributes, count);
	},
 //submodules/ZLoc/ZLocalization.js:960//
	/** Convenience wrapper for createName */
	tn: function (name, gender) {
		return this.createName(name, gender);
	},

	/**
	 * Creates an instance of LocalizationObjectToken
	 * @param pkg	string	The package the string is in
	 * @param key string	The key of the string
	 * @param attributes	string	Delimited string of attributes for this token (default delimiter is ',') //submodules/ZLoc/ZLocalization.js:970//
	 * @param count	int	(optional)	Adds 'plural' or 'singular' based on the count
	 * @return LocalizationObjectToken	An instance of LocalizationObjectToken created based on your arguments
	 */
	createToken: function (pkg, key, attributes, count) {
		if (!attributes) {
			attributes = '';
		}
		return new ZLoc.LocalizationObjectToken(this.getString(pkg, key), attributes, count);
	},
 //submodules/ZLoc/ZLocalization.js:980//
	/**
	 * Creates a name token
	 * @param name	string	The name of the person
	 * @param gender	string	The gender of the person you passed in (masc/fem)
	 * @return LocalizationName	An instance of LocalizationName based on your arguments
	 */
	createName: function (name, gender) {
		if (!gender) {
			gender = ZLoc.Localizer.DEFAULT_GENDER;
		} //submodules/ZLoc/ZLocalization.js:990//
		return new ZLoc.LocalizationName(name, gender);
	},

	/**
	 * Translates a string and does substitutions if any
	 * @param pkg	string	The package name for the string you want
	 * @param key	string	The key name for the string you want
	 * @param replacements Object Optional set of replacement tokens
	 * @return string	The string translated into the current locale
	 */ //submodules/ZLoc/ZLocalization.js:1000//
	translate: function (pkg, key, replacements) {
		if (!replacements) {
			replacements = {};
		}
		var locString = this.getString(pkg, key);
		if (locString === null) {
			return 'Cannot find string [' + key + '] in package [' + pkg + '].';
		} else {
			return locString.toString(replacements, this.m_substituter);
		} //submodules/ZLoc/ZLocalization.js:1010//
	},

	/**
	 * Returns the translated image path.
	 * @param path the path to be translated. (ex. /folder/image)
	 *  leave out the STATIC_URL part of the url
	 *  MUST START WITH A "/"
	 * @return translated image path (ex. /folder/image => /fr/folder/image)
	 */
	translateImagePath: function (path) { //submodules/ZLoc/ZLocalization.js:1020//
		var locString = this.getString(ZLoc.Localizer.IMAGE_PACKAGE, path);
		if (locString === null) {
			return 'Cannot find path ' + path;
		} else {
			return locString.getVariation(ZLoc.LocalizedString.ORIGINAL);
		}
	},

	/**
	 * Returns a sorted array of localized strings //submodules/ZLoc/ZLocalization.js:1030//
	 * @param strArray array  An array of unsorted localized strings
	 * @return array          An array of sorted localized strings
	 */
	sort: function (strArray) {
		return this.m_collator.sort(this.m_locale, strArray);
	},

	/**
	 * Retrieves a LocalizedString object out of cache, or creates a new one from the XML data if it's not cached
	 * @param pkg	string	The package the string is in //submodules/ZLoc/ZLocalization.js:1040//
	 * @param key	string	The key of the string
	 * @return LocalizedString	An instance of LocalizedString from cache or a new one, or null if the string is not found
	 */
	getString: function (pkg, key) {
		if (!this.m_raw.hasOwnProperty(pkg)) {
			return null;
		}
		if (!this.m_cached[pkg].hasOwnProperty(key)) {
			if (this.m_raw[pkg].hasOwnProperty(key)) {
				this.m_cached[pkg][key] = new ZLoc.LocalizedString( //submodules/ZLoc/ZLocalization.js:1050//
					this.m_raw[pkg][key].original,
					this.m_raw[pkg][key].variations,
					this.m_raw[pkg][key].gender
				);
			} else {
				return null;
			}
		}

		return this.m_cached[pkg][key]; //submodules/ZLoc/ZLocalization.js:1060//
	}
};

/**
 * Formatter.js
 *
 * @package ZLocalization
 * @copyright Copyright (&copy;) 2010, Zynga Game Network, Inc.
 */
 //submodules/ZLoc/ZLocalization.js:1070//
ZLoc.Formatter = (function () {
	/** @var Array of time units and how many seconds are in each unit */
	var timeUnits = [[1, 'Second'], [60, 'Minute'], [3600, 'Hour'], [86400, 'Day'], [604800, 'Week'], [2592000, 'Month'], [31536000, 'Year']];

	/** @const Currency Delimenator */
	var CURRENCY_DELIM = '{n}';

	 /** @const format package name */
	var PACKAGE_NAME  = 'ZLocDateTimeFormats';
	/** @const currency format type */ //submodules/ZLoc/ZLocalization.js:1080//
	var CURRENCY  = 'currency';
	/** @const date format type */
	var DATE  = 'date';
	/** @const number format type */
	var NUMBER  = 'number';
	/** @const duriation format type */
	var DURIATION  = 'duriation';
	/** @const time format type */
	var TIME  = 'time';
	/** @const 'am' format type */ //submodules/ZLoc/ZLocalization.js:1090//
	var AM  = 'am';
	/** @const 'pm' format type */
	var PM  = 'pm';

	/** @var array	Array of language to currency... {n} for the numeral part */
	var currencyFormats = {
		'en_US': '${n}',
		'fr': '{n} €',
		'it': '€ {n}',
		'de': '{n} €', //submodules/ZLoc/ZLocalization.js:1100//
		'es': '{n} €',
		'pt_BR': 'R$ {n}',
		'zh_TW': 'NTD {n}',
		'zh_CN': '{n}元',
		'id': 'Rp {n}',
		'tr': '{n} TL',
		'ko': '₩{n}',
		'ms': 'RM {n}',
		'ja': '￥{n}',
		'th': '฿ {n}' //submodules/ZLoc/ZLocalization.js:1110//
	};

	/** @var array	Array of langformat to php format */
	var dateFormats = {
		'{d}': 'j',
		'{dd}': 'd',
		'{m}': 'n',
		'{mm}': 'm',
		'{yyyy}': 'Y'
	}; //submodules/ZLoc/ZLocalization.js:1120//

	/** @var array	Array of langformat to php format */
	var timeFormats = {
		'{h}': 'g',
		'{hh}': 'h',
		'{mm}': 'i',
		'{ss}': 's',
		'{H}': 'G',
		'{HH}': 'H',
		'{a}': 'a', //submodules/ZLoc/ZLocalization.js:1130//
		'{aa}': 'aa'
	};


	return {

		/** @const flag to use the current locale */
		CURRENT_LOCALE: 'current_locale',

		/** //submodules/ZLoc/ZLocalization.js:1140//
		 * Retrieves the format from the language data in ZLocalization
		 * @param type the type of the format
		 * @return the format string
		 */
		getFormat: function (type) {
			var string = ZLoc.instance.getString(PACKAGE_NAME, type);
			return string.getVariation(ZLoc.LocalizedString.ORIGINAL);
		},

		/** //submodules/ZLoc/ZLocalization.js:1150//
		 * Returns time ago in words (eg '5 mintues ago' )
		 * @param time	int	the time to start from
		 * @param start	int	(optional) what time we should consider the starting point (if the user clock is wrong for example)
		 * @return string	time ago in words
		 */
		timeAgoInWords: function (time, start) {
			if (start === undefined || start === null) {
				start = Math.floor(new Date() / 1000);
			}
 //submodules/ZLoc/ZLocalization.js:1160//
			var index = 0;
			var size = timeUnits.length;
			var diff = start - time;

			while ((index + 1) < size && timeUnits[index + 1][0] <= diff) {
				index++;
			}

			var units = Math.floor(diff / timeUnits[index][0]);
			var unitName = timeUnits[index][1]; //submodules/ZLoc/ZLocalization.js:1170//

			if (index == 1 && units == 1) {
				return ZLoc.t("Time", "EstimateTimeAgoInWords", {'timeUnit': ZLoc.tk('Time', unitName)});
			} else {
				return ZLoc.t("Time", "TimeAgoInWords", {'timeUnit': ZLoc.tk('Time', unitName, "", units), 'count': units});
			}
		},

		/**
		 * Returns a formatted list given an array //submodules/ZLoc/ZLocalization.js:1180//
		 * @param list	array	array of strings to concat with and or 'or
		 * @param isAnd	boolean	whether or not to use an and or an or
		 * @return string	string concat'd with the delimiter 'and' or 'or'
		 */
		formatList: function (list, isAnd) {
			var joiningWord = ZLoc.t('Lists', isAnd !== false ? 'and' : 'or');
			if (list.length < 2) {
				return list.join('');
			} else if (list.length == 2) {
				return list.join(' ' + joiningWord + ' '); //submodules/ZLoc/ZLocalization.js:1190//
			} else {
				var last = [list.pop(), joiningWord, list.pop()].reverse().join(' ');
				list.push(last);

				var delimiter = ZLoc.t('Lists', 'delimiter') + ' ';

				return list.join(delimiter);
			}
		},
 //submodules/ZLoc/ZLocalization.js:1200//
		/**
		 * Translates timestamp to date string
		 * @param $raw int timeStamp to be translated
		 * @return string translated date
		 */
		formatDate: function (date) {
			var format = ZLoc.Formatter.getFormat(DATE);
			var tokens = format.match(new RegExp('{([^}]+)}', 'g'));
			var formatted;
			for (var tokenKey in tokens) { //submodules/ZLoc/ZLocalization.js:1210//
				if (tokens.hasOwnProperty(tokenKey)) {
					var token = tokens[tokenKey];
					formatted = ZLoc.Formatter.getFormattedDateTime(dateFormats[token], date);
					var temp = format.split(token);
					format = temp.join(formatted);
				}
			}
			return format;
		},
 //submodules/ZLoc/ZLocalization.js:1220//
		/**
		 * Translates timestamp to time strings
		 * @param $raw	int timeStamp to be translated
		 * @param $hasSeconds boolean flag, true to include seconds, false to exclude seconds
		 * @return string translated time
		 */
		formatTime: function (date, hasSeconds) {
			hasSeconds = (hasSeconds === undefined) ? true : hasSeconds;
			var format = ZLoc.Formatter.getFormat(TIME);
			if (!hasSeconds) { //This might have to change later if new languages have weirder formats //submodules/ZLoc/ZLocalization.js:1230//
				var newFormat = format.replace(':{ss}', '');
				if (newFormat == format) {
					format = format.replace(new RegExp('({ss}[^{]*)'), '');
				} else {
					format = newFormat;
				}
			}
			var tokens = format.match(new RegExp('{([^}]+)}', 'g'));
			var formatted;
			for (var tokenKey in tokens) { //submodules/ZLoc/ZLocalization.js:1240//
				if (tokens.hasOwnProperty(tokenKey)) {
					var token = tokens[tokenKey];
					formatted = ZLoc.Formatter.getFormattedDateTime(timeFormats[token], date);
					var temp = format.split(token);
					if (formatted == 'pm') {
						formatted = ZLoc.Formatter.getFormat(PM);
					} else if (formatted == 'am') {
						formatted = ZLoc.Formatter.getFormat(AM);
					}
					format = temp.join(formatted); //submodules/ZLoc/ZLocalization.js:1250//
				}
			}
			return format;
		},

		/**
		 * Translates seconds to time strings
		 * @param $raw int number of seconds
		 * @param $hasSeconds boolean flag, true to include seconds, false to exclude seconds
		 * @param $reqHours boolean flag, true for <1 hour show: 00:mm:ss, false for mm:ss //submodules/ZLoc/ZLocalization.js:1260//
		 * @return string translated time
		 */
		formatDuration: function (raw, reqHours, hasSeconds) {
			reqHours = (reqHours === undefined) ? true : reqHours;
			hasSeconds = (hasSeconds === undefined) ? true : hasSeconds;
			var lang = ZLoc.instance.m_langCode;
			var seconds = raw % 60;
			var minutes = Math.floor(raw / 60) % 60;
			var hours = Math.floor(raw / 3600);
			var formatted; //submodules/ZLoc/ZLocalization.js:1270//
			var temp;
			var format = ZLoc.Formatter.getFormat(DURIATION);
			if (!hasSeconds) {
				if ('{h}:{mm}:{ss}' == format) {
					format = '{h}:{mm}';
				} else {
					format = format.replace(new RegExp('({ss}[^{]*)'), '');
				}
			} else {
				formatted = (seconds < 10) ? '0' + seconds : seconds.toString(); //submodules/ZLoc/ZLocalization.js:1280//
				temp = format.split('{ss}');
				format = temp.join(formatted);
			}
			if (!reqHours && hours === 0) {
				format = format.replace(new RegExp('([^{]*{h}[^{]*)'), '');
				formatted = minutes.toString();
				temp = format.split('{mm}');
				format = temp.join(formatted);
			} else {
				formatted = (minutes < 10) ? '0' + minutes : minutes.toString(); //submodules/ZLoc/ZLocalization.js:1290//
				temp = format.split('{mm}');
				format = temp.join(formatted);
				formatted = hours.toString();
				temp = format.split('{h}');
				format = temp.join(formatted);
			}

			return format;
		},
 //submodules/ZLoc/ZLocalization.js:1300//
		/**
		 * Formats Numers to locale
		 * @param $raw int number to be formated
		 * @return string formated number
		 */
		formatNumber: function (raw) {
			var format = ZLoc.Formatter.getFormat(NUMBER);
			var temp = format.split('|');
			var delim = temp[0];
			var dec = temp[1]; //submodules/ZLoc/ZLocalization.js:1310//
			var lhsrhs = raw.toString().split('.');
			var lhs;
			var rhs;
			if (lhsrhs.length > 1) {
				lhs = lhsrhs[0];
				rhs = lhsrhs[1];
			} else {
				dec = '';
				lhs = lhsrhs[0];
				rhs = ''; //submodules/ZLoc/ZLocalization.js:1320//
			}
			var len = lhs.length;
			var leftMost = len % 3;
			var leftMostPart = lhs.substr(0, leftMost);
			var parts;
			if (!leftMostPart.length) {
				parts = [];
			} else {
				parts = new Array(leftMostPart);
			} //submodules/ZLoc/ZLocalization.js:1330//
			for (var i = leftMost; i < len; i += 3) {
				parts.push(lhs.substr(i, 3));
			}
			var ret = parts.join(delim) + dec + rhs;
			return ret;
		},

		/**
		 * Formats Numers to currency String
		 * **WARNING** THIS METHOD IS USED TO FORMAT CURRENCY THUS NO FALLBACKS ARE APPLIED. //submodules/ZLoc/ZLocalization.js:1340//
		 * THIS MEANS THAT en != en_US
		 * @param raw number to be formated
		 * @param currencyLocale selects the locale to format to. Use CURRENT_LOCALE to select the current locale.
		 * @return formated String
		 */
		formatCurrency: function (raw, currencyLocale) {
			var format;
			if (currencyLocale == ZLoc.Formatter.CURRENT_LOCALE) {
				format = ZLoc.Formatter.getFormat(CURRENCY);
			} else { //submodules/ZLoc/ZLocalization.js:1350//
				if (!currencyFormats.hasOwnProperty(currencyLocale)) {
					throw new Error('Locale: ' + currencyLocale + ', is unsupported in currencyFormats');
				} else {
					format = currencyFormats[currencyLocale];
				}
			}

			var formattedNum = ZLoc.Formatter.formatNumber(raw);

			var temp = format.split(CURRENCY_DELIM); //submodules/ZLoc/ZLocalization.js:1360//
			return temp.join(formattedNum);
		},

		/**
		 * Works like php's date(pattern, timestamp);
		 * BUT pattern is an array
		 * @param pattern An array of request formats.
		 *  POSSIBLE FORMATS: "j","d","n","m","Y","g","h","i","s","G","H","a","aa"
		 *  corresponding to the php versions except "a" and "aa" return "am" or "pm"
		 *  PHP FORMATS: http://php.net/manual/en/function.date.php //submodules/ZLoc/ZLocalization.js:1370//
		 * @param date			Date to be formated
		 * @return				an array of the results requested in the pattern preserving order.
		 */
		getMultiFormattedDateTime: function (pattern, date) {
			var datePart = [];
			for (var patternKey = 0; patternKey < pattern.length; patternKey++) {
				datePart[patternKey] = ZLoc.Formatter.getFormattedDateTime(pattern[patternKey], date);
			}
			return datePart;
		}, //submodules/ZLoc/ZLocalization.js:1380//

		/**
		 * Works like php's date(pattern, timestamp);
		 * BUT only selects and returns one pattern
		 * @param pattern requested format
		 *  POSSIBLE FORMATS: "j","d","n","m","Y","g","h","i","s","G","H","a","aa"
		 *  corresponding to the php versions except "a" and "aa" return "am" or "pm"
		 *  PHP FORMATS: http://php.net/manual/en/function.date.php
		 * @param date Date to be formated
		 * @return the formatte return //submodules/ZLoc/ZLocalization.js:1390//
		 */
		getFormattedDateTime: function (key, date) {
			var raw, rawHour;
			switch (key) {
			case 'a':
			case 'aa':
				var am = date.getHours() < 12;
				if (am) {
					raw = 'am';
				} else { //submodules/ZLoc/ZLocalization.js:1400//
					raw = 'pm';
				}
				break;
			case 'j': // d
				raw = date.getDate().toString();
				break;
			case 'd': //dd
				raw = date.getDate().toString();
				if (raw.length == 1) {
					raw = '0' + raw; //submodules/ZLoc/ZLocalization.js:1410//
				}
				break;
			case 'n': //m
				raw = (date.getMonth() + 1).toString();
				break;
			case 'm': //mm
				raw = (date.getMonth() + 1).toString();
				if (raw.length == 1) {
					raw = '0' + raw;
				} //submodules/ZLoc/ZLocalization.js:1420//
				break;
			case 'Y': //yyyy
				raw = date.getFullYear().toString();
				break;
			case 'g': //h
				rawHour = date.getHours() % 12;
				if (rawHour === 0) {
					rawHour = 12;
				}
				raw = rawHour.toString(); //submodules/ZLoc/ZLocalization.js:1430//
				break;
			case 'h': //hh
				rawHour = date.getHours() % 12;
				if (rawHour === 0) {
					rawHour = 12;
				}
				raw = rawHour.toString();
				if (raw.length == 1) {
					raw = '0' + raw;
				} //submodules/ZLoc/ZLocalization.js:1440//
				break;
			case 'i': //mm
				raw = date.getMinutes().toString();
				break;
			case 's': //ss
				raw = date.getSeconds().toString();
				break;
			case 'G': //H
				raw = date.getHours().toString();
				break; //submodules/ZLoc/ZLocalization.js:1450//
			case 'HH': //HH
				raw = date.getHours().toString();
				if (raw.length == 1) {
					raw = '0' + raw;
				}
				break;
			default:
				break;
			}
			return raw; //submodules/ZLoc/ZLocalization.js:1460//
		}
	};
}());

// End submodules/ZLoc/ZLocalization.js


// End ~pre


// Begin locale-compiled/id_ID.js
ZLoc.init("id_ID", {"Inbox":{"listNames":{"original":"{commaDelimNames} dan {finalName}"},"followUpCTASendGiftBack":{"original":"Kirim balik hadiah"},"followUpCTASendGift":{"original":"Kirim hadiah"},"followUpInviteTitle":{"original":"Anda kini bertetangga dengan {listNames}."},"followUpInviteBody":{"original":"Ingin menyapa dengan mengirim hadiah {gift}?"},"followUpGiftBody":{"original":"Kirimkan lagi hadiah ucapan terima kasih kepada {listNames}?"},"followUpCrewBody":{"original":"Kirim {gift} kepada {listNames}?"},"formatCTAAccept":{"original":"Terima"},"formatCTAAcceptAll":{"original":"Terima Semua"},"formatCTAAcceptSee":{"original":"Terima & Lihat"},"formatCTAAcceptSend":{"original":"Terima & Kirim"},"formatCTAAcceptOnly":{"original":"Hanya Terima"},"formatCTAHelp":{"original":"Bantuan"},"formatCTASendGiftBack":{"original":"Kirim balik hadiah"},"formatCTASendGift":{"original":"Kirim Hadiah"},"formatCTASendGifts":{"original":"Kirim Hadiah"},"formatGiftAggregateTitle":{"original":"Anda menerima {number} {gift}."},"formatGiftAggregateBody":{"original":"Terima hadiah dan kirim balik hadiah kepada {listNames}?"},"formatGiftSingleTitle":{"original":"{name1} mengirimi Anda {gift}."},"formatGiftSingleBody":{"original":"Terima hadiah dan kirim balik hadiah kepada {name1}?"},"formatInviteAggregateTitle":{"original":"Anda memiliki {number} {neighbors,object,count}.","variations":["Anda memiliki {number} {neighbors,plural}.","Anda memiliki {number} {neighbors,singular}."]},"neighbors":{"original":"undangan tetangga","variations":{"indefinite_singular":"undangan tetangga","singular":"undangan tetangga","plural":"undangan tetangga","indefinite_plural":"beberapa undangan tetangga","definite_plural":"undangan tetangga","definite_singular":"undangan tetangga"}},"formatInviteAggregateSubText":{"original":"{listNames}"},"formatInviteAggregateBody":{"original":"Beri tahu mereka bahwa Anda telah menerima!"},"formatInviteSingleTitle":{"original":"{name1} ingin menjadi tetangga Anda di {game}."},"formatInviteSingleBody":{"original":"Tolong Anda terima?"},"formatHelpAggregateTitle":{"original":"Teman Anda memerlukan {type}."},"formatHelpAggregateBody":{"original":"Beri tahu mereka Anda dengan senang hati membantu."},"formatHelpAggregateSubText":{"original":"{listNames}"},"formatHelpSingleTitle":{"original":"{name1} mengirimkan:"},"formatHelpSingleBody":{"original":"Hei! Bisa bantu saya dengan mengirimi saya {type}?"},"formatCrewAggregateTitle":{"original":"Teman Anda memerlukan bantuan untuk membangun {type}."},"formatCrewAggregateBody":{"original":"Beri tahu mereka Anda akan bergabung dengan mereka."},"formatCrewAggregateSubText":{"original":"{listNames}"},"formatCrewSingleTitle":{"original":"{name1} mengirimkan:"},"formatCrewSingleBody":{"original":"Saya membutuhkan Anda pada kru {crew} di kota!"},"formatNotifSingleTitle":{"original":"{name1} mengirimkan barang yang Anda minta."},"formatNotifSingleBody":{"original":"Kirimkan hadiah terima kasih pada mereka!"},"formatNotifAggregateTitle":{"original":"Teman Anda mengirimkan barang yang Anda minta."},"formatNotifAggregateBody":{"original":"Kirimkan hadiah terima kasih pada mereka!"},"formatNotifAggregateSubText":{"original":"{listNames}"},"formatExpiredTitle":{"original":"{number} {friends,object,count} mengirimi Anda permintaan yang telah kedaluwarsa! Sering-sering periksa!","variations":["{number} {friends,plural} mengirimi Anda permintaan yang telah kedaluwarsa! Sering-sering periksa!","{number} {friends,singular} mengirimi Anda permintaan yang telah kedaluwarsa! Sering-sering periksa!"]},"formatExpiredBody":{"original":"Kirim {gift} sebagai hadiah ucapan terima kasih kepada: {listNames}"},"groupGift":{"original":"Hadiah"},"groupGifts":{"original":"Hadiah"},"groupInvite":{"original":"Undangan Tetangga"},"groupInvites":{"original":"Undangan Tetangga"},"groupHelp":{"original":"Permintaan Bantuan"},"groupHelps":{"original":"Permintaan Bantuan"},"groupCrew":{"original":"Undangan Kru"},"groupCrews":{"original":"Undangan Kru"},"groupFactory":{"original":"Undangan Pabrik"},"groupFactories":{"original":"Undangan Pabrik"},"groupNotif":{"original":"Pemberitahuan"},"groupNotifs":{"original":"Pemberitahuan"},"groupRecommendation":{"original":"Tetangga Yang Disarankan"},"groupRecommendations":{"original":"Tetangga Yang Disarankan"},"groupExpired":{"original":"Permintaan Kedaluwarsa"},"groupExpireds":{"original":"Permintaan Kedaluwarsa"},"groupFeed":{"original":"Minta Teman"},"groupFeeds":{"original":"Minta Teman"},"feedPromptTitle":{"original":"Teman mempermudah Anda untuk memperluas"},"feedPromptContent":{"original":"Minta izin wilayah dari teman Anda?"},"feedPromptCTA":{"original":"Minta Teman"},"scrollhead":{"original":"Kotak Masuk"},"sendGift":{"original":"Kirim Hadiah"},"friends":{"original":"satu teman","variations":{"indefinite_singular":"satu teman","singular":"teman","plural":"teman","indefinite_plural":"beberapa teman","definite_plural":"teman","definite_singular":"teman"}}}});
// End locale-compiled/id_ID.js


// Begin ~post
// ----------
// Packing:
// src/main.js
// src/getMessages.js
// src/groupSort.js
// src/displayMessage.js
// src/messageFlows.js
// src/acceptIgnore.js
// src/giftBack.js
// ~fp
// =});
// =});
// ----------

// Begin src/main.js
/*global console, global, module, ZLoc, ZSC, ZY*/
(function (win, ZLoc, ZSC, $) {
	'use strict';

	// Make a module
	var undef, Inbox1P = (function (name) {
		var root = typeof win !== 'undefined' ? win : global,
			had = Object.prototype.hasOwnProperty.call(root, name),
			prev = root[name], me = root[name] = {};
		if (typeof module !== 'undefined' && module.exports) { //src/main.js:10//
			module.exports = me;
		}
		me.noConflict = function () {
			root[name] = had ? prev : undef;
			if (!had) {
				try {
					delete root[name];
				} catch (ex) {
				}
			} //src/main.js:20//
			return this;
		};
		return me;
	}('Inbox1P'));

	Inbox1P.VERSION = '0.5.20';

	var
		atom = Inbox1P.atom = ZSC.atom,
		clock = Inbox1P.clock = ZSC.clock, //src/main.js:30//
		style = Inbox1P.style = ZSC.style,
		validator = Inbox1P.validator = ZSC.validator,
		UserInfo = Inbox1P.UserInfo = ZSC.UserInfo,

		callDAPI = ZSC.callDAPI,

		defaultGift = Inbox1P.defaultGift = {
			id: 'giftRequest',
			name: 'coins',
			eventTypeId: 14000 //src/main.js:40//
		},

		requestTypes = Inbox1P.requestTypes = {
			gift: 14000,
			help: 14002,
			invite: 14001,
			notif: 35008,
			other: 13028
		},
 //src/main.js:50//
		signingFunc = ZY.PrepareURL,

		a = Inbox1P.a = atom.create(),
		session = Inbox1P.session = clock.session(),

		urlBase = '//' + win.location.hostname + '/'
	;

	var loc = Inbox1P.loc = function (property, obj) {
		return ZLoc.t('Inbox', property, obj); //src/main.js:60//
	};
	var locTk = Inbox1P.locTk = function (key, attributes, count) {
		return ZLoc.tk('Inbox', key, attributes, count);
	};

	a.set({
		// ZEvent accept endpoint served from the game.
		acceptURL: urlBase + 'zsc/callback.php',

		// ZEvent giftback inputs endpoint served from the game. //src/main.js:70//
		giftBackInputsURL: urlBase + 'zsc/zsc_r2_giftBack_inputs.php',

		// ZEvent ignore endpoint served from the game.
		ignoreURL: urlBase + 'zsc/callback.php',

		// ZEvent message endpoint served from the game.
		messagesURL: urlBase + 'zsc/evt_data.php',

		// Feed data endpoint
		feedGetURL: urlBase + 'zsc/zsc_feed_data.php', //src/main.js:80//

		// Feed posting inputs endpoint.
		feedInputsURL: urlBase + 'zsc/zsc_feed_inputs.php',

		// Feed confirmation endpoint
		feedPostURL: urlBase + 'zsc/zsc_feed_post.php',

		// Where some of our assets live.
		assetURL: '//zynga1-a.akamaihd.net/zlive/channels/Inbox1P/' + Inbox1P.VERSION + '/assets',
 //src/main.js:90//
		// Minimum amount of time before we are allowed to poll next.
		pollMin: 15000, // 15 seconds in milliseconds

		// Maximum amount of time before the next poll is triggered.
		pollMax: 900000 // 15 minutes in milliseconds
	});

	ZSC.once('prodGameID', function (prodGameID) {
		a.set('gid', prodGameID);
	}); //src/main.js:100//

	var log = Inbox1P.log = function (msg, prefix) {
		if (console && console.log) {
			if (typeof msg === 'string') {
				console.log((prefix ? prefix + ' ' : '') + 'Inbox1P: ' + msg);
			} else {
				console.log((prefix ? prefix + ' ' : '') + 'Inbox1P:');
				console.log(msg);
			}
		} //src/main.js:110//
	};
	var error = Inbox1P.error = function (msg) {
		log(msg, 'ERROR:');
	};
	var info = Inbox1P.info = function (msg) {
		log(msg, 'INFO:');
	};
	var warn = Inbox1P.warn = function (msg) {
		log(msg, 'WARN:');
	}; //src/main.js:120//

	// Append additional parameters then sign.
	// params can be an object or a string in the following format: 'a=1&b=2&c=3'
	var signURL = Inbox1P.signURL = function (url, params) {
		var
			each = $.each,
			result = url,
			list = [],
			sign = signingFunc
		; //src/main.js:130//
		if (params) {
			if (typeof params === 'string') {
				result = params;
			} else {
				each(params, function (key, value) {
					list.push(key + '=' + value);
				});
				result = list.join('&');
			}
			result = url + (url.indexOf('?') === -1 ? '?' : '&') + result; //src/main.js:140//
		}
		return (sign !== undef) ? sign(result) : result;
	};

}(window, ZLoc, ZSC, $));

// End src/main.js


// Begin src/getMessages.js
/*global Inbox1P, ZSC*/
(function (Inbox1P, ZSC, $) {
	var
		a = Inbox1P.a,
		atom = Inbox1P.atom,
		each = $.each,
		get = a.get,
		set = a.set,
		log = Inbox1P.log,
		session = Inbox1P.session, //src/getMessages.js:10//
		signURL = Inbox1P.signURL,
		undef,
		undef,
		UserInfo = Inbox1P.UserInfo,
		users = Inbox1P.users = atom.create(),
		validator = Inbox1P.validator,
		warn = Inbox1P.warn
	;

	a.once(['gid', 'messagesURL'], function (gid, messagesURL) {
		var //src/getMessages.js:20//
			getJSON = $.getJSON,
			messageIDs = {}
		;

		function handleMessages(response, onCompleteCallback) {
			var messages = [], uids = [], messagesAdded = false;
			// Massage data into required format
			each(response, function (evtId, evtData) {
				messagesAdded = true;
 //src/getMessages.js:30//
				// TODO JVL: May still need to validate evtId
				// Force sender to a string because it can come in as either
				// number or string and a string is better for us.
				if (evtData.metadata && evtData.metadata.sender) {
					evtData.metadata.sender += '';
				}
				if (!validator.validate('GameMessage', evtData)) {
					warn('Game message validation failed: ' + validator.error);
					return;
				} //src/getMessages.js:40//

				var
					data = {},
					msgKey = evtId,
					meta = evtData.metadata,
					// Ensure uid is a string when we use it as a key in atom.
					uid = meta.sender + '',
					addMessage = function () {
						var user = users.get(uid);
						var message = { //src/getMessages.js:50//
							id: evtId,
							sender: {
								zid: user.zid,
								name: user.name,
								snid: user.snid,
								snuid: user.snuid,
								pic: user.pic
							},
							snid: user.snid,
							game: gid, //src/getMessages.js:60//
							type: meta.expired ? 'expired' : meta.type,
							// Aggregate expired requests so they are displayed together.
							agg: meta.expired ? 'expired' : (
								((meta.preventAggregation && meta.type !== 'gift') || data.waitForServer) ?
									'' : meta.subtype
							),
							ts: meta.timestamp,
							request_ids: {},
							data: data,
							loc: {} // optional //src/getMessages.js:70//
						};
						if (message.agg === 'expired') {
							message.batchSize = 200;
						}
						messages.push(message);
					}
				;

				// Add additional info to the data param.
				if (meta.subtype) { //src/getMessages.js:80//
					data.subtype = meta.subtype;
				}
				if (meta.subtype_aggregate) {
					data.subtype_aggregate = meta.subtype_aggregate;
				}
				if (meta.expired) {
					data.expired = meta.expired;
				}
				if (meta.type === 'other' && !meta.expired && meta.type_text) {
					data.type_text = meta.type_text; //src/getMessages.js:90//
				}
				if (meta.waitForServer) {
					data.waitForServer = meta.waitForServer;
				}
				if (meta.contentID) {
					data.contentID = meta.contentID;
					if (!data.waitForServier &&
						data.contentID.indexOf('mysterygift') > -1)
					{
						data.waitForServer = true; //src/getMessages.js:100//
					}
				}
				if (meta.giftBackAble) {
					data.giftBackAble = meta.giftBackAble;
				}
				if (!meta.expired && evtData.data && evtData.data[0]) {
					// TODO JVL: Need to remove data array if we can.
					var d = evtData.data[0];
					if (d.image) {
						data.image = d.image; //src/getMessages.js:110//
					}
					if (d.title) {
						data.title = d.title;
					}
					if (d.body) {
						data.body = d.body;
					}
				}

				if (!messageIDs[msgKey]) { //src/getMessages.js:120//
					// If we already have the user info, just add the message,
					// otherwise, collect the uids and call addMessage after we
					// retrieve the user info.
					if (users.has(uid)) {
						addMessage();
					} else {
						uids.push(uid);
						users.once(uid, addMessage);
					}
					messageIDs[msgKey] = true; //src/getMessages.js:130//
				}
			});

			if (onCompleteCallback && !messagesAdded) {
				onCompleteCallback(0);
			}
			UserInfo.get(uids, 18, function (response) {
				var msgCount = messages.length || 0;
				// Cache user info in memory for later use.
				each(response, function (id, map) { //src/getMessages.js:140//
					users.set(id, {
						zid: map.zid,
						name: map.name,
						snid: map.snid,
						snuid: map.snuid,
						pic: map.pic
					});
				});
				if (messages.length) {
					a.set('messagesProcessed', messages); //src/getMessages.js:150//
					ZSC.addRawMessages(messages, function () {
						if (onCompleteCallback) {
							onCompleteCallback(msgCount);
						}
					});
				} else {
					if (onCompleteCallback) {
						onCompleteCallback(0);
					}
				} //src/getMessages.js:160//
			});
		}

		function fetch(onCompleteCallback, firstFetch) {
			onCompleteCallback = onCompleteCallback || function () {};
			if (!firstFetch || (get('messagesFetched') !== true)) {
				set('messagesFetched', true);
				getJSON(signURL(messagesURL), function (response) {
					handleMessages(response, function (count) {
						ZSC.InboxService.notifyFetchComplete(); //src/getMessages.js:170//
						onCompleteCallback();
					});
				});
			}
			else {
				// Already did the first fetch
				onCompleteCallback();
			}
		}
 //src/getMessages.js:180//
		// Start polling for messages.
		var messagePoller = session.poller(function () {
			fetch(undef, get('messagesFetched') !== true);
		}, get('pollMin'), get('pollMax'));
		messagePoller.poll();
		Inbox1P.poll = messagePoller.poll;

		function startFetchOnZSCOpened(firstFetch) {
			ZSC.showSpinner();
			fetch(function () { //src/getMessages.js:190//
				ZSC.hideSpinner();
				ZSC.refreshMessages();
			}, firstFetch);
		}

		ZSC.once('open', function () {
			startFetchOnZSCOpened(true);
			ZSC.on('open', function () {
				startFetchOnZSCOpened();
			}); //src/getMessages.js:200//
		});
	});

}(Inbox1P, ZSC, $));

// End src/getMessages.js


// Begin src/groupSort.js
/*global Inbox1P, ZSC*/
(function (Inbox1P, ZSC) {

	var
		loc = Inbox1P.loc,
		a = Inbox1P.a,
		messageTypeOrder = {
			feed: 0,
			recommendation: 1,
			gift: 2, //src/groupSort.js:10//
			help: 3,
			other: 4,
			notif: 5,
			invite: 6,
			expired: 7
		}
	;

	ZSC.set({
 //src/groupSort.js:20//
		// Compare function used for sorting groups.
		compareGroups: function (grpA, grpB) {
			return messageTypeOrder[grpA.messages[0].type] -
				messageTypeOrder[grpB.messages[0].type];
		},

		// Compare function used for sorting messages within a group.
		compareMessages: function (msgA, msgB) {
			return msgB.timestamps[0] - msgA.timestamps[0];
		}, //src/groupSort.js:30//

		// Function to group messages.
		groupMessage: function (message) {
			// Cases should match your messageTypeOrder above.
			switch (message.type) {
			case 'feed':
				return { singular: loc('groupFeed'), plural: loc('groupFeeds') };
			case 'gift':
				return { singular: loc('groupGift'), plural: loc('groupGifts') };
			case 'invite': //src/groupSort.js:40//
				return { singular: loc('groupInvite'), plural: loc('groupInvites') };
			case 'help':
				return { singular: loc('groupHelp'), plural: loc('groupHelps') };
			case 'notif':
				return { singular: loc('groupNotif'), plural: loc('groupNotifs') };
			case 'other':
				return { singular: message.data.type_text, plural: message.data.type_text };
			case 'recommendation':
				return {
					singular: loc('groupRecommendation'), //src/groupSort.js:50//
					plural: loc('groupRecommendations')
				};
			case 'expired':
				return { singular: loc('groupExpired'), plural: loc('groupExpireds') };
			default:
				return { singular: message.type, plural: message.type };
			}
		}

	}); //src/groupSort.js:60//

}(Inbox1P, ZSC));

// End src/groupSort.js


// Begin src/displayMessage.js
/*global Inbox1P, ZSC*/
(function (Inbox1P, ZSC) {

	var
		acceptAndSend = true,
		defaultGift = Inbox1P.defaultGift,
		gameName = 'CastleVille',
		loc = Inbox1P.loc,
		locTk = Inbox1P.locTk
	; //src/displayMessage.js:10//

	// senders param is an array of user objects with name properties.
	// returns a list of names in the following format:
	// name1, name2, ..., nameN-1 and nameN
	var listNames = Inbox1P.listNames = function (senders) {
		if (senders.length < 2) {
			return senders.length === 1 ? senders[0].name : '';
		}
		var
			idx = 0, //src/displayMessage.js:20//
			len = senders.length - 1,
			names = []
		;
		for (; idx < len; idx += 1) {
			names.push(senders[idx].name);
		}
		return loc('listNames',
			{ commaDelimNames: names.join(', '), finalName: senders[len].name });
	};
 //src/displayMessage.js:30//
	Inbox1P.a.set('gameName', gameName);

	// Convert an AggregateMessage into a DisplayMessage.
	ZSC.set({
		gameName: gameName,

		formatMessage: function (aggMessage) {
			var
				message = {
					ids: aggMessage.ids, //src/displayMessage.js:40//
					senders: aggMessage.senders,
					type: aggMessage.type,
					timestamps: aggMessage.timestamps,
					primaryCTA: { key: 'accept', text: loc('formatCTAAccept') },
					giftBackTracking: 'ref=pbChainv2'
				},
				aggData = aggMessage.data,
				subtype = aggData.subtype,
				waitForServer = aggData.waitForServer,
				aggSubtype = aggData.subtype_aggregate || subtype, //src/displayMessage.js:50//
				firstUserName = aggMessage.senders[0].name,
				len = aggMessage.ids.length
			;

			switch (aggMessage.type) {
			case 'gift':
				// To list gifts individually, set preventAggregation:true for the
				// message in the event_messages.php endpoint.
				if (len > 1) {
					// Aggregate messages. //src/displayMessage.js:60//
					message.title = loc('formatGiftAggregateTitle',
						{ number: len, gift: aggSubtype });
					message.body = loc('formatGiftAggregateBody',
						{ listNames: listNames(aggMessage.senders) });
					message.primaryCTA = { key: 'accept', text: loc('formatCTAAcceptAll') };
				} else {
					// Single message.
					message.title = aggData.title ? aggData.title + ' ' : '';
					message.title += loc('formatGiftSingleTitle',
						{ name1: firstUserName, gift: aggData.subtype }); //src/displayMessage.js:70//
					message.body = loc('formatGiftSingleBody', { name1: firstUserName });
					if (waitForServer) {
						message.secondaryCTA =
							{ key: 'accept_see', text: loc('formatCTAAcceptSee') };
					}
				}
				if (!waitForServer && acceptAndSend) {
					message.primaryCTA =
						{ key: 'accept_send', text: loc('formatCTAAcceptSend') };
					message.secondaryCTA = //src/displayMessage.js:80//
						{ key: 'accept_only', text: loc('formatCTAAcceptOnly') };
				}
				// Postback Chaining V2: Remove giftBackTracking for gift requests.
				delete message.giftBackTracking;
				break;
			case 'invite':
				if (len > 1) {
					message.title = loc('formatInviteAggregateTitle',
						{ number: len, neighbors: locTk('neighbors', '', len) });
					message.subtext = loc('formatInviteAggregateSubText', //src/displayMessage.js:90//
						{ listNames: listNames(aggMessage.senders) });
					message.body = loc('formatInviteAggregateBody');
					message.primaryCTA = { key: 'accept', text: loc('formatCTAAcceptAll') };
				} else {
					message.title = loc('formatInviteSingleTitle',
						{ name1: firstUserName, game: gameName });
					message.body = loc('formatInviteSingleBody');
					message.primaryCTA = { key: 'accept', text: loc('formatCTAAccept') };
				}
				break; //src/displayMessage.js:100//
			case 'help':
				if (len > 1) {
					// Aggregate messages.
					message.title = loc('formatHelpAggregateTitle',
						{ number: len, type: aggSubtype });
					message.body = loc('formatHelpAggregateBody');
					message.subtext = loc('formatHelpAggregateSubText',
						{ listNames: listNames(aggMessage.senders) });
					message.primaryCTA = { key: 'accept', text: loc('formatCTAAcceptAll') };
				} else { //src/displayMessage.js:110//
					// Single message.
					message.title = aggData.title || loc('formatHelpSingleTitle', { name1: firstUserName });
					message.body = aggData.body || loc('formatHelpSingleBody',
						{ type: aggMessage.data.subtype + '' });
					message.primaryCTA = { key: 'accept', text: loc('formatCTAAccept') };
				}
				break;
			case 'crew':
			case 'factory':
			case 'other': //src/displayMessage.js:120//
				if (len > 1) {
					message.title = loc('formatCrewAggregateTitle',
						{ number: len, type: aggSubtype });
					message.body = loc('formatCrewAggregateBody');
					message.subtext = loc('formatCrewAggregateSubText',
						{ listNames: listNames(aggMessage.senders) });
					message.primaryCTA = { key: 'accept', text: loc('formatCTAAcceptAll') };
				} else {
					// Single message.
					message.title = loc('formatCrewSingleTitle', //src/displayMessage.js:130//
						{ name1: firstUserName });
					message.body = loc('formatCrewSingleBody',
						{ crew: aggMessage.data.subtype + '' });
					message.primaryCTA = { key: 'accept', text: loc('formatCTAAccept') };
				}
				break;
			case 'notif':
				if (len > 1) {
					// Aggregate messages.
					message.title = loc('formatNotifAggregateTitle', //src/displayMessage.js:140//
						{ number: len, type: aggSubtype });
					message.body = loc('formatNotifAggregateBody');
					message.subtext = loc('formatNotifAggregateSubText',
						{ listNames: listNames(aggMessage.senders) });
					message.primaryCTA = { key: 'accept_send', text: loc('formatCTASendGifts') };
				} else {
					// Single message.
					message.title = aggData.title || loc('formatNotifSingleTitle', { name1: firstUserName });
					message.body = loc('formatNotifSingleBody');
					message.primaryCTA = { key: 'accept_send', text: loc('formatCTASendGiftBack') }; //src/displayMessage.js:150//
				}
				break;
	// TODO JVL: Need a recommendation example.
			case 'recommendation':
				break;
			case 'expired':
				len = aggMessage.senders.length;
				message.title = loc('formatExpiredTitle',
					{ number: len, friends: locTk('friends', '', len) });
				message.body = loc('formatExpiredBody', //src/displayMessage.js:160//
					{ gift: defaultGift.name, listNames: listNames(aggMessage.senders) });
				message.primaryCTA = { key: 'send', text: loc('formatCTASendGiftBack') };
				message.image = '//zynga1-a.akamaihd.net/zlive/snapi_plugins/r21501-prod/plugins/inbox/img/expired.png';
				message.giftBackTracking = 'ref=expired';
				break;
			case 'feed':
				message.title = aggData.title;
				message.body = aggData.body;
				message.primaryCTA = aggData.primaryCTA;
				message.image = aggData.image; //src/displayMessage.js:170//
				break;
			default:
				message.title = 'Unknown message type.';
				message.body = 'Sorry, I do not know how to categorize a message event of type: ' + aggMessage.type;
				break;
			}

			if (acceptAndSend && !waitForServer) {
				switch (aggMessage.type) {
				case 'gift': //src/displayMessage.js:180//
				case 'invite':
				case 'help':
				case 'crew':
				case 'factory':
				// TODO JVL: Need to include type='other' for now until CityVille moves
				// away from categorizing their help requests using type='other'
				case 'other':
					message.primaryCTA =
						{ key: 'accept_send', text: loc('formatCTAAcceptSend') };
					message.secondaryCTA = //src/displayMessage.js:190//
						{ key: 'accept_only', text: loc('formatCTAAcceptOnly') };
				}
			}

			if (!aggMessage.expired && subtype) {
				message.subtype = subtype;
			}

			if (aggData.image) {
				message.image = aggData.image; //src/displayMessage.js:200//
			}

			if (aggData.contentID) {
				message.contentID = aggData.contentID;
			}

			return message;
		}
	});
 //src/displayMessage.js:210//
}(Inbox1P, ZSC));

// End src/displayMessage.js


// Begin src/messageFlows.js
/*global Inbox1P, ZSC*/
(function (Inbox1P, win, ZSC, $) {

	var
		defaultGift = Inbox1P.defaultGift,
		extend = $.extend,
		listNames = Inbox1P.listNames,
		loc = Inbox1P.loc,
		requestTypes = Inbox1P.requestTypes
	; //src/messageFlows.js:10//

	function accept(message, callback) {
		Inbox1P.acceptRequest(
			{
				typeId: requestTypes[message.type],
				eventIds: message.ids,
				acceptOnly: !!message.acceptOnly
			},
			function (response) {
				function checkForFailure(obj) { //src/messageFlows.js:20//
					return obj && obj.success === false &&
						!obj.hasOwnProperty('failureType');
				}
				if (!response ||
					response.timeout ||
					(message.type === 'gift' &&
						(checkForFailure(response) ||
							(response.length && checkForFailure(response[0]))
						)
					) //src/messageFlows.js:30//
				)
				{
					// Failure.
					callback({failure: { timeout: response.timeout }});
				} else {
					// Success.
					var
						item = response[0] ? response[0] : response,
						status = {
							totalGifts: item.totalGifts, //src/messageFlows.js:40//
							limitGifts: item.limitGifts,
							expiredGifts: item.expiredGifts,
							otherGifts: item.otherGifts,
							acceptedGifts: item.totalGifts -
								(item.limitGifts + item.expiredGifts + item.otherGifts)
						}
					;

					sendClientNotifications(response);
 //src/messageFlows.js:50//
					if (item.notif_data) {
						Inbox1P.sendNotifs(message.senders, item.notif_data,
							defaultGift.id, ZSC.get('gid'));
						// TODO JVL: Deal with ui.v2.js#1153; blocking on giftback
					}

					if (item.contentID) {
						status.contentID = item.contentID;
					}
					if (item.message) { //src/messageFlows.js:60//
						status.message = item.message;
					}
					if (item.giftBack) {
						status.giftBack = item.giftBack;
					}

					callback(status);
				}
			}
		); //src/messageFlows.js:70//
	}

	function send(message, callback) {
		// TODO XXX: Post back chaining V1
		// TODO JVL: Wait for giftback? ui.v2.js#812; blocking on giftback

		Inbox1P.getGiftBackInputs(
			message.contentID,
			message.senders,
			message.giftBackTracking, //src/messageFlows.js:80//
			function (input_response) {
				if (input_response.status === 'success') {
					var
						eligible = input_response.eligible,
						// TODO BH: confirm that these values are supposed to be set to defaultGift
						giftBack = {
							contentID: defaultGift.id,
							subtype: defaultGift.name,
							eventTypeId: defaultGift.eventTypeId
						} //src/messageFlows.js:90//
					;
					extend(giftBack, input_response.giftBack);
					if (eligible && eligible.snuids && eligible.snuids.length > 0) {
						Inbox1P.sendGift(
							{
// TODO JVL: May need to add other params; see data_shim.js#259-276
								body: giftBack.body || loc('sendGift'),
								contentID: giftBack.contentID,
								eligible: input_response.eligible.zids,
								gameId: ZSC.get('gid'), //src/messageFlows.js:100//
								button_href: giftBack.button_post,
								postBackURL: giftBack.postBackURL,
								sendkey: giftBack.sendkey,
								timestamp: giftBack.timestamp,
								title: giftBack.title || loc('sendGift'),
								type: 'gift',
								type_id: requestTypes.gift,
								signature: giftBack.signature
							},
							function (gift_response) { //src/messageFlows.js:110//
								switch (gift_response.status) {
								case 'cancel':
								case 'failure':
									break;
								case 'success':
									break;
								}
								// TODO BH: I think we should be looking for message.expired here. Also do we do ignore requests regardlss of gift_response.status?
								if (message.type === 'expired') {
									// After the user has sent a gift back in response to //src/messageFlows.js:120//
									// expired gifts, we want to delete those expired
									// gifts in the background.
									Inbox1P.ignoreRequests(message.ids);
								}
								// TODO BH: work with JVL to see how we can determine 'all' or 'partial' sendback, meantime treat as 'all'
								// failure, cancel, success, failure;timeout
								callback(gift_response);
							}
						);
					} else { //src/messageFlows.js:130//
						//TODO BH: verify that we want to treat as successful when no eligible snuids
						callback({ status: 'success' });
					}
				} else {
					callback({ status: 'failure' });
				}
			}
		);
	}
 //src/messageFlows.js:140//
	function sendClientNotifications(response) {
		function checkForClientNotification(obj) {
			if (!obj.hasOwnProperty('failureType')) {
				var clientNotification = obj.clientNotification;
				if (clientNotification && win[clientNotification]) {
					clientNotification = win[clientNotification];
					if (typeof clientNotification === 'function') {
						try {
							clientNotification(obj);
						} catch (ex) { //src/messageFlows.js:150//
						}
					}
				}
			}
		}
		if (response.length) {
			for (var i = 0; i < response.length; i += 1) {
				checkForClientNotification(response[i]);
			}
		} else { //src/messageFlows.js:160//
			checkForClientNotification(response);
		}
	}

	// When user clicks an action on a particular message, determine whether to
	// show a follow-up message. callback() must be called as the last step for
	// the item to disappear from the Inbox UI.
	ZSC.set('followUp', function (message, action, callback) {
		var followUp = {
			ids: message.ids, //src/messageFlows.js:170//
			senders: message.senders,
			type: message.type,
			timestamps: message.timestamps
		};
		if (message.hasOwnProperty('image')) {
			followUp.image = message.image;
		}
		if (message.hasOwnProperty('contentID')) {
			followUp.contentID = message.contentID;
		} //src/messageFlows.js:180//
		if (message.hasOwnProperty('notifData')) {
			followUp.notifData = message.notifData;
		}
		if (message.hasOwnProperty('giftBackTracking')) {
			followUp.giftBackTracking = message.giftBackTracking;
		}
		if (message.hasOwnProperty('giftBack')) {
			followUp.giftBack = message.giftBack;
		}
		if (message.hasOwnProperty('giftBackAble')) { //src/messageFlows.js:190//
			followUp.giftBackAble = message.giftBackAble;
		}

		function trackStatus(response) {
			if (!response) {
				return;
			}
			if (response.failure) {
				ZSC.set('accept-failure', {
					action: action, //src/messageFlows.js:200//
					message: message,
					failure: response.failure
				});
			}
			if (response.sendResponse) {
				ZSC.set('send-complete', {
					action: action,
					message: message,
					sendResponse: response.sendResponse
				}); //src/messageFlows.js:210//
			}
			if (response.totalGifts) {
				ZSC.set('accept-status', {
					message: message,
					action: action,
					status: {
						totalGifts: response.totalGifts,
						limitGifts: response.limitGifts,
						expiredGifts: response.expiredGifts,
						otherGifts: response.otherGifts, //src/messageFlows.js:220//
						acceptedGifts: response.acceptedGifts
					}
				});
			}
		}

		switch (action) {
		case 'accept':
		case 'accept_only':
			if (action === 'accept_only') { //src/messageFlows.js:230//
				message.acceptOnly = true;
			}

			// Tell the game server (and clientNotification listeners) that this
			// message has been accepted. (Fire and forget!)
			accept(message, trackStatus);

			// We're going to prompt user to send a gift back...
			followUp.primaryCTA = { key: 'send', text: loc('followUpCTASendGift') };
 //src/messageFlows.js:240//
			// For gifts, prompt user to send the same gift back.
			if (message.type === 'gift') {
				followUp.contentID = message.contentID;
				followUp.body = loc('followUpGiftBody',
					{ listNames: listNames(message.senders) });
				followUp.primaryCTA =
					{ key: 'send', text: loc('followUpCTASendGiftBack') };

			} else {
				followUp.contentID = defaultGift.id; //src/messageFlows.js:250//

				followUp.body = loc('followUpCrewBody', {
					gift: defaultGift.name,
					listNames: listNames(message.senders)
				});

				if (message.type === 'invite') {
					followUp.title = loc('followUpInviteTitle',
						{ listNames: listNames(message.senders) });
					followUp.body = loc('followUpInviteBody', { //src/messageFlows.js:260//
						gift: defaultGift.name
					});
					followUp.primaryCTA =
						{ key: 'send', text: loc('followUpCTASendGift') };
				}
			}

			callback(followUp);
			break;
 //src/messageFlows.js:270//
		case 'accept_send':
			// Tell the game server (and clientNotification listeners) that this
			// message has been accepted.
			accept(message, function (response) {
				trackStatus(response);

				// If the server wants a specific contentID used for the giftback,
				// use that.  Otherwise, make it the same type as the original gift,
				// or else use the default gift type.
				// CASTLE: Only send if giftBack is true //src/messageFlows.js:280//
				var sendBack = false;
				if (followUp.hasOwnProperty("giftBack") || followUp.hasOwnProperty("giftBackAble")) {
					followUp.contentID = followUp.giftBack.contentID || response.contentID ||
					followUp.contentID || defaultGift.id;
					sendBack = true;
				} else if (response.hasOwnProperty("giftBack") || response.hasOwnProperty("giftBackAble")) {
					followUp.contentID = response.giftBack.contentID;
					sendBack = true;
				}
 //src/messageFlows.js:290//
				if (sendBack) {
					send(followUp, function (sendResponse) {
						trackStatus({ sendResponse: sendResponse });
					});
				}
			});

			// No follow-up.
			callback();
			break; //src/messageFlows.js:300//

		case 'accept_see':
			// Tell the game server (and clientNotification listeners) that this
			// message has been accepted, but don't show a follow-up message until
			// the server responds.
			accept(message, function (response) {
				trackStatus(response);

				if (!response || !response.message) {
					callback(); //src/messageFlows.js:310//
					return;
				}

				extend(followUp, response);
				followUp.body = response.message;
				followUp.primaryCTA =
					{ key: 'send', text: loc('followUpCTASendGiftBack') };
				callback(followUp);
			});
			break; //src/messageFlows.js:320//

		case 'send':
			// We cannot send a gift of contentID=0 so set to the default gift.
			if (!followUp.contentID) {
				followUp.contentID = defaultGift.id;
			}
			send(followUp, function (sendResponse) {
				trackStatus({ sendResponse: sendResponse });
			});
			callback(); //src/messageFlows.js:330//
			break;

		case 'accept_feed':
			Inbox1P.postFeed(message.ids[0], message.endpoint, message.feed_type);
			callback();
			break;

		default:
			callback();
			break; //src/messageFlows.js:340//
		}
	});
}(Inbox1P, window, ZSC, $));

// End src/messageFlows.js


// Begin src/acceptIgnore.js
/*global Inbox1P, ZSC*/
(function (Inbox1P, ZSC, $) {

	var
		a = Inbox1P.a,
		error = Inbox1P.error,
		getJSON = $.getJSON,
		InboxService = ZSC.InboxService,
		requestTypes = Inbox1P.requestTypes,
		session = Inbox1P.session, //src/acceptIgnore.js:10//
		signURL = Inbox1P.signURL
	;

	// Ugly hack to support legacy ignore callback.
	function getRemoveRequestType(id) {
		var message = InboxService.getRawMessage(id);
		if (!message) {
			error('getRemoveRequestType(): Cannot find type for eventID: ' + id);
			return 0;
		} //src/acceptIgnore.js:20//
		return requestTypes[message.type];
	}

	function removeRequests(ids, type, callback) {
		a.once('ignoreURL', function (ignoreURL) {
			var
				done = false,
				timeoutPeriod = 10000 + (ids.length * 1000),
				eventId = ids[0]
			; //src/acceptIgnore.js:30//

			session.setTimeout(function () {
				if (!done) {
					callback({ 'status': 'failure', timeout: true });
					done = true;
				}
			}, timeoutPeriod);

			getJSON(
				signURL(ignoreURL, { //src/acceptIgnore.js:40//
					action: 'ignore',
					eventId: eventId,
					eventTypeId: getRemoveRequestType(eventId),
					zy_ctoken: ''
				}),
				{
					all: 'all',
					eventIds: ids
				},
				function (response) { //src/acceptIgnore.js:50//
					if (!done) {
						if (callback) {
							callback({ 'status':
								(response && response.success === false) ? 'failure' : 'success'
							});
						}
						done = true;
					}
				}
			); //src/acceptIgnore.js:60//
		});
	}

	// Programatically ignore requests.
	Inbox1P.ignoreRequests = function (ids) {
		InboxService.deleteMessages(ids);
		removeRequests(ids);
	};

	// Triggered when user ignores requests from the UI. //src/acceptIgnore.js:70//
	InboxService.on('messagesIgnored', function (ids) {
		removeRequests(ids);
	});

	Inbox1P.acceptRequest = function (params, callback) {
		a.once('acceptURL', function (acceptURL) {
			var
				done = false,
				timeoutPeriod = 10000 + (params.eventIds.length * 1000)
			; //src/acceptIgnore.js:80//

			session.setTimeout(function () {
				if (!done) {
					callback({ 'status': 'failure', timeout: true });
					done = true;
				}
			}, timeoutPeriod);

			getJSON(
				signURL(acceptURL, { //src/acceptIgnore.js:90//
					action: 'accept',
					eventId: params.eventIds[0],
					eventTypeId: params.typeId,
					zy_ctoken: ''
				}),
				{
					all: 'all',
					eventIds: params.eventIds,
					acceptOnly: params.acceptOnly
				}, //src/acceptIgnore.js:100//
				function (response) {
					if (!done) {
						callback(response);
						done = true;
					}
				}
			);
		});
	};
 //src/acceptIgnore.js:110//
}(Inbox1P, ZSC, $));

// End src/acceptIgnore.js


// Begin src/giftBack.js
/*global Inbox1P, SNAPI, ZSC*/
(function (Inbox1P, SNAPI, ZSC, $) {

	var
		a = Inbox1P.a,
		atom = ZSC.atom,
		callDAPI = ZSC.callDAPI,
		each = $.each,
		extend = $.extend,
		session = Inbox1P.session, //src/giftBack.js:10//
		signURL = Inbox1P.signURL,
		SNID = { Facebook: 1, Zynga: 18 },
		UserInfo = ZSC.UserInfo,
		warn = Inbox1P.warn
	;

	function getListOf(senders, prop) {
		var
			i = 0,
			len = senders.length, //src/giftBack.js:20//
			list = []
		;
		for (; i < len; i += 1) {
			list.push(senders[i][prop]);
		}
		return list;
	}

	function sendRequest(params, callback) {
		var payload = { //src/giftBack.js:30//
			gameId: params.gameId,
			toZid: params.eligible,
			type: params.type,
			data: {
				title: params.title || 'Send Request',
				body: params.body || 'Send Request'
			},
			eventTypeId: params.type_id
		};
		extend(payload.data, params.data); //src/giftBack.js:40//

		// Hack for CityVille
		if (params.button_href) {
			payload.data.button_href = params.button_href;
		}

		SNAPI.api(
			'request.send',
			/* TODO JVL: Ideally this is all we want to pass along (in this order)
					but we must wait until http://jira.corp.zynga.com/browse/ZDSYS-1384 //src/giftBack.js:50//
					is resolved first.
			{
				toZid: toZids,
				eventTypeId: eventTypeId,
				data: { title: title, body: body }
			},
			*/
			payload,
/*
			function (postIds) { //src/giftBack.js:60//
				if (!postIds) {
					callback({ status: 'cancel' });
				} else if (typeof postIds === 'string') {
					callback({ status: 'failure' });
				} else {
					callback({ status: 'success', postIds: postIds });
				}
			},
*/
			callback, //src/giftBack.js:70//
			true	// This flag can be removed once we move to SNAPI 1.9.
		);
	}

	Inbox1P.getGiftBackInputs = function (contentID, senders, tracking, callback) {
		a.once('giftBackInputsURL', function (giftBackInputsURL) {
			$.post(
				signURL(giftBackInputsURL, tracking),
				{
					gift: contentID, //src/giftBack.js:80//
					zids: getListOf(senders, 'zid')
				},
				function (response) {
					if (!response) {
						warn('GiftBackInputs retrieval failed');
						callback({ 'status': 'failure' });
						return;
					}
					var b = atom.create();
					b.once(['eligible_userInfos', 'ineligible_userInfos'], //src/giftBack.js:90//
						function (eligible, ineligible) {
							callback({
								'status': 'success',
// TODO JVL: Cleanup what's passed back if we get a chance.
								eligible: {
									snuids: getListOf(eligible, 'snuid'),
									zids: getListOf(eligible, 'zid')
								},
								ineligible: {
									snuids: getListOf(ineligible, 'snuid'), //src/giftBack.js:100//
									zids: getListOf(ineligible, 'zid')
								},
								giftBack: { // gift
									button_post: response.acceptUrlR2,
									image: response.giftImageURL,
									sendkey: response.outgoingSendKey,
									title: response.title,
									body: response.body,
									contentID: response.giftbackName,
									name: response.giftbackName, //src/giftBack.js:110//
									subtype: response.giftbackFriendlyName,
									subtypeAggregate: response.giftbackFriendlyName,
									button_text: response.buttonText,
									signature: response.signature,
									timestamp: response.timestamp,
									postBackURL: response.sendPostBack,
									giftCode: response.giftCode,
									gameData: response.gameData,
									eventTypeId: response.giftbackEventTypeId
								}, //src/giftBack.js:120//
								postBackURL: response.sendPostBack
							});
						}
					);
					function getUserInfo(zids, property) {
						var list = [];
						if (!zids || zids.length < 1) {
							b.set(property, list);
							return;
						} //src/giftBack.js:130//
						UserInfo.get(zids, SNID.Zynga, function (map, ids) {
							each(ids, function (dummy, id) {
								list.push(map[id]);
							});
							b.set(property, list);
						});
					}
					// response.eligible and response.inEligible are array of zids.
					getUserInfo(response.eligible, 'eligible_userInfos');
					getUserInfo(response.inEligible, 'ineligible_userInfos'); //src/giftBack.js:140//
				}
			);
		});
	};

	Inbox1P.sendGift = function (params, callback) {
		var
			result,
			done = false,
			timeoutPeriod = 20000 // Need a long timeout here in case of FB dialog //src/giftBack.js:150//
		;

		session.setTimeout(function () {
			if (!done) {
				callback({ 'status': 'failure', timeout: true });
				done = true;
			}
		}, timeoutPeriod);

		// Add additional parameters for gift back. //src/giftBack.js:160//
		params.data = {
			data: {
				item: params.contentID,
				reverse: '',
				ts: params.timestamp,
				signature: params.signature
			}
		};

		sendRequest(params, function (response) { //src/giftBack.js:170//
			if (!response) {
				// User pressed Cancel on Facebook request
				$.get(signURL(params.postBackURL, 'error=null'));
				result = { 'status': 'cancel' };
			} else if (typeof response === 'string') {
				// Call failed.
				$.get(signURL(params.postBackURL, 'error=' + response));
				result = { 'status': 'failure' };
			} else {
				// Call succeeded. //src/giftBack.js:180//
				$.post(signURL(params.postBackURL), {
					action: 'send',
					gift: params.contentID,
					key: params.sendkey,
					zids: params.eligible,
					postedIDs: response
				});
				result = { 'status': 'success' };
			}
			if (!done) { //src/giftBack.js:190//
				callback(result);
				done = true;
			}
		});
	};

	Inbox1P.sendNotifs = function (senders, notifData, contentID, gameId) {
		var
			zids = getListOf(senders, 'zid'),
			payload = { //src/giftBack.js:200//
				gameId: gameId,
				eligible: zids,
				type: 'notif',
				type_id: notifData.eventTypeId,
				contentID: contentID,
				giftBackTracking: 'ref=notif',
				data: {}
			}
		;
		extend(true, payload.data, notifData); //src/giftBack.js:210//

		sendRequest(payload, function (response) {
			each(zids, function (dummy, zid) {
				callDAPI('ztrack.messageSendkeyTo', {
					sendKey: notifData.data.sendkey,
					toZid: zid,
					status: 'ok'
				});
			});
		}); //src/giftBack.js:220//
	};

}(Inbox1P, SNAPI, ZSC, $));

// End src/giftBack.js


// Begin ~fp
// ----------
// Packing:
// submodules/linger/linger.js
// src/feedPrompts.js
// src/feedPromptConf.js
// =linger.noConflict();
// ----------

// Begin submodules/linger/linger.js
/*global global, module*/
(function () {

	// Make a module
	var linger = (function (name) {
		var root = typeof window !== 'undefined' ? window : global,
			had = Object.prototype.hasOwnProperty.call(root, name),
			prev = root[name], me = root[name] = {};
		if (typeof module !== 'undefined' && module.exports) {
			module.exports = me; //submodules/linger/linger.js:10//
		}
		me.noConflict = function () {
			root[name] = had ? prev : undefined;
			if (!had) {
				try {
					delete root[name];
				} catch (ex) {
				}
			}
			return this; //submodules/linger/linger.js:20//
		};
		return me;
	}('linger'));

	linger.VERSION = '0.0.5';

	var
		ls = window.localStorage,
		DEFAULT_NS = '*',
		NS_SEPARATOR = ':' //submodules/linger/linger.js:30//
	;

	linger.ERRORS = {
		NOT_SUPPORTED: 1,
		QUOTA_EXCEEDED: 2
	};


	linger.cache = function (ns) {
		var //submodules/linger/linger.js:40//
			myNS = (ns && typeof ns === 'string') ? ns : DEFAULT_NS,

			genKey = function (key) {
				key = me.namespace + NS_SEPARATOR + key;
				return me.serializer.serialize(key);
			},

			parseKey = function (key) {
				key = key.slice(me.namespace.length + NS_SEPARATOR.length);
				return me.serializer.deserialize(key); //submodules/linger/linger.js:50//
			},

			me = {
				namespace: myNS,

				serializer: {
					serialize: function (val) {
						return val;
					},
					deserialize: function (val) { //submodules/linger/linger.js:60//
						return val;
					}
				},

				get: function (key, callback) {
					key = genKey(key);
					var val = me.serializer.deserialize(ls.getItem(key));
					callback(null, val);
				},
 //submodules/linger/linger.js:70//
				set: function (key, val, callback) {
					var setVal;
					key = genKey(key);
					try {
						setVal = ls.setItem(key, me.serializer.serialize(val));
						callback(null, setVal);
					}
					catch (e) {
						if (e.code && (e.code === 22 || e.code === 1024)) {
							callback({ //submodules/linger/linger.js:80//
								err: linger.ERRORS.QUOTA_EXCEEDED,
								msg: 'Quota Exceeded!'
							}, null);
						}
						else {
							throw e;
						}
					}
				},
 //submodules/linger/linger.js:90//
				// Remove/unset a specified key.
				remove: function (key, callback) {
					key = genKey(key);
					var val = ls.removeItem(key);
					if (callback) {
						callback(null, val);
					}
				},

				// Determine the number of keys currently set in this namespace. //submodules/linger/linger.js:100//
				length: function (callback) {
					me.keys(function (err, keys) {
						callback(err, keys && keys.length);
					});
				},

				keys: function (callback) {
					var
						keys = [],
						key, //submodules/linger/linger.js:110//
						len = ls.length,
						ns = me.namespace + NS_SEPARATOR,
						i = 0
					;
					while (i < len) {
						key = ls.key(i);
						// Only return keys with our namespace.
						if (key.indexOf(ns) === 0) {
							keys.push(parseKey(key));
						} //submodules/linger/linger.js:120//
						i++;
					}
					callback(null, keys);
				},

				clear: function (callback) {
					// Use me.keys() to ensure we only remove keys with our
					// namespace.
					me.keys(function (err, aKeys) {
						function removeNext() { //submodules/linger/linger.js:130//
							var key = aKeys.shift();
							if (key) {
								me.remove(key, removeNext);
							} else if (callback) {
								// No more keys to remove, so we're done.
								callback();
							}
						}
						removeNext();
					}); //submodules/linger/linger.js:140//
				}
			}
		;
		return me;
	};

	// Set up the default namespace
	var defaultNamespace = linger.cache(DEFAULT_NS);
	linger.serializer = defaultNamespace.serializer;
	linger.get = defaultNamespace.get; //submodules/linger/linger.js:150//
	linger.set = defaultNamespace.set;
	linger.remove = defaultNamespace.remove;
	linger.length = defaultNamespace.length;
	linger.keys = defaultNamespace.keys;
	linger.clear = defaultNamespace.clear;

}());

// End submodules/linger/linger.js


// Begin src/feedPrompts.js
/*global Inbox1P, linger, SNAPI, ZSC*/
(function (Inbox1P, linger, SNAPI, ZSC, $) {
	var
		conf,
		a = Inbox1P.a,
		loc = Inbox1P.loc,
		session = Inbox1P.session,
		lastPostTS = 'lastPost',
		lastViewTS = 'lastView',
		store = linger.cache('feedPrompts'), //src/feedPrompts.js:10//
		feedItems = [],
		poster,
		undef,
		ONE_HOUR_MINS = 60,
		DEFAULT_COOLDOWN_FEEDS_MINS = 4 * ONE_HOUR_MINS
	;

	function getString(key) {
		var
			strings = //src/feedPrompts.js:20//
				conf.feed.strings
		;
		if (strings && strings.hasOwnProperty(key)) {
			return strings[key];
		}
		else {
			throw 'String not found for key: ' + key;
		}
	}
 //src/feedPrompts.js:30//
	function post(url, params, callback) {
		var signed = Inbox1P.signURL(url + '?callback=?');
		$.getJSON(
			signed,
			params,
			callback
		);
	}

	function post2(url, params, cb) { //src/feedPrompts.js:40//
		var signed = Inbox1P.signURL(url);
		$.post(Inbox1P.signURL(url), params, cb);
	}

	function track(params) {
		var payload =
			{
				kingdom: 'feed',
				phylum: conf.feed.feedType,
				'class': conf.gameName //src/feedPrompts.js:50//
			};
		$.extend(payload, params);
		ZSC.trackCount(payload);
	}

	function conf2messages() {
		// convert the configuration to suitable zsc raw messages

		if (!a.has('feedItems')) {
			a.set('feedItems', []); //src/feedPrompts.js:60//
		}

		var messages = [];

		// make a fake sender so the picUrl displays
		// where the avatar pic should be.
		function fakeSender(picUrl) {
			return {
				pic: picUrl,
				zid: 20000000000, //src/feedPrompts.js:70//
				snid: 18,
				snuid: '1',
				name: 'none'
			};
		}

		function makeMessage(fid, ts, avatarPicUrl, itemPicUrl, title, content, cta, feedType) {
			return {
				id: fid,
				sender: fakeSender(avatarPicUrl), //src/feedPrompts.js:80//
				snid: 18,
				game: a.get('gid'),
				type: 'feed',
				agg: '',
				ts: ts,
				data: {
					title: title,
					body: content,
					image: itemPicUrl,
					primaryCTA: { key: 'accept_feed', text: cta } //src/feedPrompts.js:90//
				},
				request_ids: {},
				feed_type: feedType
			};
		}

		$.getJSON(Inbox1P.signURL(a.get('feedGetURL')), function (response) {
			var fd = response;

			var rightNow = new Date(); //src/feedPrompts.js:100//
			feedItems = a.get('feedItems');
			if (fd) {
				for (var i = 0; i < fd.length; ++i) {
					var f = fd[i];
					var fid = 'feed' + i;
					messages.push(makeMessage(fid, rightNow.getTime(), f.avatarPicUrl, f.itemPicUrl, f.title, f.content, f.cta, f.feedType));
					feedItems[fid] = f;
				}
			}
 //src/feedPrompts.js:110//
			if (messages.length > 0) {
				track({genus: 'view'});
				a.set('feedsProcessed', messages);
			} else {
				ZSC.set('feedsFetched', 0);
			}
		});
	}

	// TODO: refactor. city-specific //src/feedPrompts.js:120//
	function shouldDisplayPrompt() {
		if (g_zscFeedsEnabled) {
			store.get(lastViewTS, function (err, lastView) {
				lastView = parseInt(lastView, 10) || 0;
				if (!lastView || lastView < (new Date() - g_zscFeedsViewCooldown * 60 * 1000)) {
					ZSC.set('showFeedPrompt', true);
					a.set('showFeedPrompt', true);
					store.set(lastViewTS, (new Date()).getTime(), function () { });
				} else {
					ZSC.set('showFeedPrompt', false); //src/feedPrompts.js:130//
				}
			});
		} else {
			ZSC.set('showFeedPrompt', false);
		}
	}

	a.once(['feedConf', 'gid'], function (c, g) {

		shouldDisplayPrompt(); //src/feedPrompts.js:140//
		conf = c;

		a.once('showFeedPrompt', function () {
			// jsonp supported or not?
			if (conf.usePlainJson) {
				poster = post2;
			}
			else {
				poster = post;
			} //src/feedPrompts.js:150//

			var cooldown = conf.feed.cooldown !== undef ? conf.feed.cooldown : DEFAULT_COOLDOWN_FEEDS_MINS;
			store.get(lastPostTS, function (err, lastPost) {
				lastPost = parseInt(lastPost, 10) || 0;
				if (!lastPost || lastPost < (new Date() - cooldown * 60 * 1000)) {
					conf2messages();
				} else {
					ZSC.set('feedsFetched', 0);
				}
			}); //src/feedPrompts.js:160//
		});
		Inbox1P.info('feedPrompts: All globals loaded');
	});

	// place our feed messages in the inbox.
	a.on('feedsProcessed', function (messages) {
		var msgCount = messages.length;
		ZSC.addRawMessages(messages, function () {
			ZSC.set('feedsFetched', msgCount);
		}); //src/feedPrompts.js:170//
	});
	
	Inbox1P.postFeed = function (fid) {
		function error(description, response) {
			Inbox1P.error('postFeed failure');
			track({
				genus: 'error',
				milestone: description
			});
 //src/feedPrompts.js:180//
			if (conf.feed.error) {
				conf.feed.error(response);
			}
		}

		function success(response, inputs) {
			Inbox1P.info('postFeed success');
			track({ genus: 'success', milestone: 'stream.publish' });
			if (conf.feed.success) {
				conf.feed.success(response, inputs); //src/feedPrompts.js:190//
			}
			// Need to let both the client and server know we succeeded so they can store the data off
			document.getElementById("flashapp").externalAddSentFeed(inputs.viralName, inputs.vid);
			$.getJSON(Inbox1P.signURL(a.get('feedPostURL')), { viralName: inputs.viralName, vid: inputs.vid, sendKey: inputs.sendKey }, function (response) {

			});
		}

		function jpCallback(inputs) {
			if (!inputs) { //src/feedPrompts.js:200//
				Inbox1P.error('feed inputs api error');
				return;
			}
			var payload = inputs, firstResponse = false;
			Inbox1P.info(inputs);
			// Try frictionless first
			payload.auto_publish = true;
			SNAPI.api(
					'stream.publish',
					{ payload: payload }, //src/feedPrompts.js:210//
					function (response) {
						if (firstResponse) {
							// Prevent re-entry.
							return;
						}
						firstResponse = true;

						if (!response || response.hasOwnProperty('error') ||
							response.hasOwnProperty('error_code'))
						{ //src/feedPrompts.js:220//
							// This probably means that the user hasn't granted
							// authorization to auto-publish, or else that the
							// auto-publishing limit reached. Try again.
							payload.auto_publish = false;
							SNAPI.api(
								'stream.publish',
								{ payload: payload },
								function (response2) {
									if (response2) {
										if (response2.hasOwnProperty('error_code')) { //src/feedPrompts.js:230//
											error(
												'stream.publish error_code=' +
												response2.error_code,
												response2
												);
										} else if (response2.hasOwnProperty('error')) {
											error(
												'stream.publish error=' +
												response2.error,
												response2 //src/feedPrompts.js:240//
												);
										} else {
											success(response2, inputs);
										}

									} else {
										error('stream.publish empty response', response2);
									}
								}
							); //src/feedPrompts.js:250//
						}
						else {
							success(response, inputs);
						}
					}
			);
		}

		track({genus: 'click'});
		var f; //src/feedPrompts.js:260//
		a.get('feedItems', function (feedItems) {
			f = feedItems[fid];
		});

		if (!f) {
			Inbox1P.error('missing feed: ' + fid);
			return;
		}

		var u = a.get('feedInputsURL'); //src/feedPrompts.js:270//
		poster(u, { type: f.feedType }, jpCallback);
		store.set(lastPostTS, (new Date()).getTime(), function () { });
	};
}(Inbox1P, linger, SNAPI, ZSC, $));

// End src/feedPrompts.js


// Begin src/feedPromptConf.js
/*global Inbox1P*/
(function (Inbox1P) {

	var a = Inbox1P.a;

	a.once(['assetURL', 'gameName'], function (url, gameName) {
		a.set('feedConf', {
			gameName: gameName,
			usePlainJson: true,
			feed: //src/feedPromptConf.js:10//
			{

				feedType: 'permits_request',
				avatarPicUrl: url + '/expansion.png',
				itemPicUrl: url + '/permit.png',

				strings: {
					title: 'feedPromptTitle',
					content: 'feedPromptContent',
					cta: 'feedPromptCTA' //src/feedPromptConf.js:20//
				},

				// Callback for a successful feed post
				success: function (snapiResponse, inputs) { },

				// Callback for a failed feed post
				error: function (snapiResponse) { },
			
				// The minimum amount of time in minutes to wait before showing another feed prompt.
				// If not specified or set to undefined then a default of 4 hours is used. //src/feedPromptConf.js:30//
				cooldown: 0
			}
		});
	});
}(Inbox1P));

// End src/feedPromptConf.js


// Begin =linger.noConflict();
linger.noConflict();

// End =linger.noConflict();


// End ~fp


// Begin =});
});

// End =});


// Begin =});
});

// End =});


// End ~post

