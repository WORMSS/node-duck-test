/**
 * ...
 * @author Colin Richardson
 */

(function(ns) {
	function DuckTest(options) {
		this._throwErrors = options && 'throwErrors' in options ? options.throwErrors : DuckTest.defaults.throwErrors;
		this._require = [];
		this._optional = [];
		this._block = [];
	};
	DuckTest.defaults = {
		throwErrors: false
	};
	DuckTest.require = function (propName, allowedTypes, allowedValues) {
		return new DuckTest().require(propName, allowedTypes, allowedValues);
	}
	DuckTest.optional = function (propName, allowedTypes, allowedValues) {
		return new DuckTest().optional(propName, allowedTypes, allowedValues);
	}
	DuckTest.block = function (propName, blockTypes, blockValues) {
		return new DuckTest().block(propName, blockTypes, blockValues);
	}
	
	function DuckTestMath(type, val) {
		this.type = type;
		this.value = val;
	}
	DuckTestMath.GT = 'gt';
	DuckTestMath.GTE = 'gte';
	DuckTestMath.LT = 'lt';
	DuckTestMath.LTE = 'lte';
	
	DuckTest.gt = function (val) {
		return new DuckTestMath(DuckTestMath.GT, val);
	}
	DuckTest.lt = function (val) {
		return new DuckTestMath(DuckTestMath.LT, val);
	}
	DuckTest.gte = function (val) {
		return new DuckTestMath(DuckTestMath.GTE, val);
	}
	DuckTest.lte = function (val) {
		return new DuckTestMath(DuckTestMath.LTE, val);
	}
	
	DuckTest.prototype.require = function (propName, allowedTypes, allowedValues) {
		this._require.push({
			'propName': propName, 
			'allowedTypes': allowedTypes,
			'allowedValues': allowedValues
		});
		return this;
	};
	
	DuckTest.prototype.optional = function (propName, allowedTypes, allowedValues) {
		this._optional.push({
			'propName': propName, 
			'allowedTypes': allowedTypes,
			'allowedValues': allowedValues
		});
		return this;
	};
	
	DuckTest.prototype.block = function (propName, blockTypes, blockValues) {
		this._block.push({
			'propName': propName, 
			'allowedTypes': blockTypes,
			'allowedValues': blockValues
		});
		return this;
	};
	
	function testAllowedTypes(obj, prop, _throwErrors) {
		var j, jLength, foundAllowedType = false;
		if ( prop.allowedTypes !== null && prop.allowedTypes !== void 0 ) {
			switch ( typeof prop.allowedTypes ) {
				case 'string' :
					if ( typeof obj[prop.propName] !== prop.allowedTypes ) {
						return false;
					}
					break;
				case 'function' : // constructor
					if ( !(obj[prop.propName] instanceof prop.allowedTypes) ) {
						return false;
					}
					break;
				case 'object': 
					if ( Array.isArray(prop.allowedTypes) ) {
						foundAllowedType = false;
						for ( j = 0, jLength = prop.allowedTypes.length; !foundAllowedType && j < jLength; j++ ) {
							if ( prop.allowedTypes[j] === null || prop.allowedTypes[j] === void 0 ) {
								if ( _throwErrors ) {
									throw TypeError('allowedTypes array must not contain null or undefined');
								}
								return false;
							}
							switch ( typeof prop.allowedTypes[j] ) {
								case 'string' :
									if ( typeof obj[prop.propName] === prop.allowedTypes[j] ) {
										foundAllowedType = true;
									}
									break;
									
								case 'function' : // constructor
									if ( obj[prop.propName] instanceof prop.allowedTypes[j] ) {
										foundAllowedType = true;
									}
									break;
								default :
									if ( _throwErrors ) {
										throw TypeError('alloedType array must contain strings or constructors');
									}
									return false;
							}
						}
						if ( foundAllowedType === false ) {
							return false;
						}
						break;
					}
				default :
					if ( _throwErrors ) {
						throw TypeError('allowedTypes must be passed in as a string, constructor or an array');
					}
					return false;
			}
		}
		return true;
	}
	
	function testAllowedValues(obj, prop, _throwErrors) {
		var j, jLength, foundAllowedValue = false, mathObj, foundAllowedValueMath = false;
		if ( prop.allowedValues !== null && prop.allowedValues !== void 0 ) {
			switch ( typeof prop.allowedValues ) {
				case 'string' :
				case 'number' :
				case 'boolean' :
					if ( obj[prop.propName] !== prop.allowedValues ) {
						return false;
					}
					break;
				case 'function' : // constructor
					if ( !(obj[prop.propName] instanceof prop.allowedValues) ) {
						return false;
					}
				case 'object' : // array,DuckTestMath
					if ( Array.isArray(prop.allowedValues) ) {
						foundAllowedValue = false;
						for ( j = 0, jLength = prop.allowedValues.length; !foundAllowedValue && j < jLength; j++ ) {
							if ( prop.allowedValues[j] === null || prop.allowedValues[j] === void 0 ) {
								if ( _throwErrors ) {
									throw TypeError('allowedValues array must contain null or undefined');
								}
								return false;
							}
							switch ( typeof prop.allowedValues[j] ) {
								case 'string' :
								case 'number' :
								case 'boolean' :
									if ( obj[prop.propName] === prop.allowedValues[j] ) {
										foundAllowedValue = true;
									}
									break;
								case 'function' : //constructor
									if ( obj[prop.propName] instanceof prop.allowedValues[j] ) {
										foundAllowedValue = true;
									}
									break;
								case 'object' : // DuckTestMath
									if ( prop.allowedValues[j] instanceof DuckTestMath ) {
										if ( typeof obj[prop.propName] !== 'number' ) {
											if ( _throwErrors ) {
												throw TypeError('property type must be number to use DuckTestMath');
											}
											return false;
										}
										mathObj = prop.allowedValues[j];
										switch ( mathObj.type ) {
											case DuckTestMath.GT : 
												if ( !(obj[prop.propName] > mathObj.value) ) {
													return false;
												}
												break;
											case DuckTestMath.LT :
												if ( !(obj[prop.propName] < mathObj.value) ) {
													return false;
												}
												break;
											case DuckTestMath.GTE : 
												if ( !(obj[prop.propName] >= mathObj.value) ) {
													return false;
												}
												break;
											case DuckTestMath.LTE :
												if ( !(obj[prop.propName] <= mathObj.value) ) {
													return false;
												}
												break;
											default :
												if ( _throwErrors ) {
													throw TypeError('unknown DuckTestMath type: ' + mathObj.type);
												}
												return false;
										}
										foundAllowedValueMath = true;
										break;
									}
								default :
									if ( _throwErrors ) {
										throw TypeError('allowedValues array must contain string, number, boolean, constructor, DuckTestMath');
									}
									return false;
							}
						}
						if ( foundAllowedValue === false && foundAllowedValueMath === false ) {
							return false;
						}
						break;
					} else if ( prop.allowedValues instanceof DuckTestMath ) {
						if ( typeof obj[prop.propName] !== 'number' ) {
							if ( _throwErrors ) {
								throw TypeError('property type must be number to use DuckTestMath');
							}
							return false;
						}
						mathObj = prop.allowedValues;
						switch ( mathObj.type ) {
							case DuckTestMath.GT : 
								if ( !(obj[prop.propName] > mathObj.value) ) {
									return false;
								}
								break;
							case DuckTestMath.LT :
								if ( !(obj[prop.propName] < mathObj.value) ) {
									return false;
								}
								break;
							case DuckTestMath.GTE : 
								if ( !(obj[prop.propName] >= mathObj.value) ) {
									return false;
								}
								break;
							case DuckTestMath.LTE :
								if ( !(obj[prop.propName] <= mathObj.value) ) {
									return false;
								}
								break;
							default :
								if ( _throwErrors ) {
									throw TypeError('unknown DuckTestMath type: ' + mathObj.type);
								}
								return false;
						}
						break;
					}
				default :
					if ( _throwErrors ) {
						throw TypeError('not allowed allowedValues type: ' +  typeof prop.allowedValues);
					}
					return false;
			}
		}
		return true;
	}
	
	DuckTest.prototype.test = function (obj) {
		var i, iLength, prop, _throwErrors = this._throwErrors;
		for ( i = 0, iLength = this._require.length; i < iLength; i++ ) {
			prop = this._require[i];
			// test propertyName
			if ( !(prop.propName in obj) ) {
				return false;
			}
			
			// test propertyType
			if ( testAllowedTypes(obj, prop, _throwErrors) === false ) {
				return false;
			}
			
			// test propertyValue
			if ( testAllowedValues(obj, prop, _throwErrors) === false ) {
				return false;
			}
		}
		
		for ( i = 0, iLength = this._optional.length; i < iLength; i++ ) {
			prop = this._optional[i];
			// test propertyName
			if ( prop.propName in obj ) { // if it exists, subject it to tests.
				// test propertyType
				if ( testAllowedTypes(obj, prop, _throwErrors) === false ) {
					return false;
				}
				
				// test propertyValue
				if ( testAllowedValues(obj, prop, _throwErrors) === false ) {
					return false;
				}
			}
		}
		
		for ( i = 0, iLength = this._block.length; i < iLength; i++ ) {
			prop = this._block[i];
			
			if ( prop.propName in obj ) {
				if ( (prop.allowedTypes === null || prop.allowedTypes === void 0) && (prop.allowedValues === null || prop.allowedValues === void 0) ) {
					// block the whole property name if no allowedTypes or allowedValues exist.
					return false;
				}
				if ( !(prop.allowedTypes === null || prop.allowedTypes === void 0) ) {
					if ( testAllowedTypes(obj, prop, _throwErrors) === true ) {
						// block if it's type matches.
						return false;
					}
				}
				
				if ( !(prop.allowedValues === null || prop.allowedValues === void 0) ) {
					if ( testAllowedValues(obj, prop, _throwErrors) === true ) {
						// block if it's value matches.
						return false;
					}
				}
			}
		}
		
		return true;
	};
	
	ns.DuckTest = DuckTest;
})(module.exports);