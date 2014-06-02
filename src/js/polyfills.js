if (typeof Object.create !== 'function') {
	Object.create = function(obj) {
		var F = function() {};
		F.prototype = obj;
		return new F();
	};
}
