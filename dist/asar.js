(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('util'), require('fs'), require('path'), require('os'), require('crypto'), require('assert'), require('events'), require('child_process')) :
	typeof define === 'function' && define.amd ? define(['util', 'fs', 'path', 'os', 'crypto', 'assert', 'events', 'child_process'], factory) :
	(global = global || self, global.asar = factory(global.util$1, global.fs$1, global.path$1, global.os, global.crypto, global.assert, global.events, global.child_process));
}(this, function (util$1, fs$1, path$1, os, crypto, assert, events, child_process) { 'use strict';

	util$1 = util$1 && util$1.hasOwnProperty('default') ? util$1['default'] : util$1;
	fs$1 = fs$1 && fs$1.hasOwnProperty('default') ? fs$1['default'] : fs$1;
	path$1 = path$1 && path$1.hasOwnProperty('default') ? path$1['default'] : path$1;
	os = os && os.hasOwnProperty('default') ? os['default'] : os;
	crypto = crypto && crypto.hasOwnProperty('default') ? crypto['default'] : crypto;
	assert = assert && assert.hasOwnProperty('default') ? assert['default'] : assert;
	events = events && events.hasOwnProperty('default') ? events['default'] : events;
	child_process = child_process && child_process.hasOwnProperty('default') ? child_process['default'] : child_process;

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	function getCjsExportFromNamespace (n) {
		return n && n['default'] || n;
	}

	var originalFs=fs$1;

	var _0777 = parseInt('0777', 8);

	var mkdirp = mkdirP.mkdirp = mkdirP.mkdirP = mkdirP;

	function mkdirP (p, opts, f, made) {
	    if (typeof opts === 'function') {
	        f = opts;
	        opts = {};
	    }
	    else if (!opts || typeof opts !== 'object') {
	        opts = { mode: opts };
	    }
	    
	    var mode = opts.mode;
	    var xfs = opts.fs || fs$1;
	    
	    if (mode === undefined) {
	        mode = _0777 & (~process.umask());
	    }
	    if (!made) made = null;
	    
	    var cb = f || function () {};
	    p = path$1.resolve(p);
	    
	    xfs.mkdir(p, mode, function (er) {
	        if (!er) {
	            made = made || p;
	            return cb(null, made);
	        }
	        switch (er.code) {
	            case 'ENOENT':
	                mkdirP(path$1.dirname(p), opts, function (er, made) {
	                    if (er) cb(er, made);
	                    else mkdirP(p, opts, cb, made);
	                });
	                break;

	            // In the case of any other error, just see if there's a dir
	            // there already.  If so, then hooray!  If not, then something
	            // is borked.
	            default:
	                xfs.stat(p, function (er2, stat) {
	                    // if the stat fails, then that's super weird.
	                    // let the original error be the failure reason.
	                    if (er2 || !stat.isDirectory()) cb(er, made);
	                    else cb(null, made);
	                });
	                break;
	        }
	    });
	}

	mkdirP.sync = function sync (p, opts, made) {
	    if (!opts || typeof opts !== 'object') {
	        opts = { mode: opts };
	    }
	    
	    var mode = opts.mode;
	    var xfs = opts.fs || fs$1;
	    
	    if (mode === undefined) {
	        mode = _0777 & (~process.umask());
	    }
	    if (!made) made = null;

	    p = path$1.resolve(p);

	    try {
	        xfs.mkdirSync(p, mode);
	        made = made || p;
	    }
	    catch (err0) {
	        switch (err0.code) {
	            case 'ENOENT' :
	                made = sync(path$1.dirname(p), opts, made);
	                sync(p, opts, made);
	                break;

	            // In the case of any other error, just see if there's a dir
	            // there already.  If so, then hooray!  If not, then something
	            // is borked.
	            default:
	                var stat;
	                try {
	                    stat = xfs.statSync(p);
	                }
	                catch (err1) {
	                    throw err0;
	                }
	                if (!stat.isDirectory()) throw err0;
	                break;
	        }
	    }

	    return made;
	};

	const { promisify } = util$1;

	const fs = process.versions.electron ? originalFs : fs$1;


	const promisifiedMethods = [
	  'lstat',
	  'readFile',
	  'stat',
	  'writeFile'
	];

	const promisified = {};

	for (const method of Object.keys(fs)) {
	  if (promisifiedMethods.includes(method)) {
	    promisified[method] = promisify(fs[method]);
	  } else {
	    promisified[method] = fs[method];
	  }
	}
	// To make it more like fs-extra
	promisified.mkdirp = promisify(mkdirp);
	promisified.mkdirpSync = mkdirp.sync;

	var wrappedFs = promisified;

	var concatMap = function (xs, fn) {
	    var res = [];
	    for (var i = 0; i < xs.length; i++) {
	        var x = fn(xs[i], i);
	        if (isArray(x)) res.push.apply(res, x);
	        else res.push(x);
	    }
	    return res;
	};

	var isArray = Array.isArray || function (xs) {
	    return Object.prototype.toString.call(xs) === '[object Array]';
	};

	var balancedMatch = balanced;
	function balanced(a, b, str) {
	  if (a instanceof RegExp) a = maybeMatch(a, str);
	  if (b instanceof RegExp) b = maybeMatch(b, str);

	  var r = range(a, b, str);

	  return r && {
	    start: r[0],
	    end: r[1],
	    pre: str.slice(0, r[0]),
	    body: str.slice(r[0] + a.length, r[1]),
	    post: str.slice(r[1] + b.length)
	  };
	}

	function maybeMatch(reg, str) {
	  var m = str.match(reg);
	  return m ? m[0] : null;
	}

	balanced.range = range;
	function range(a, b, str) {
	  var begs, beg, left, right, result;
	  var ai = str.indexOf(a);
	  var bi = str.indexOf(b, ai + 1);
	  var i = ai;

	  if (ai >= 0 && bi > 0) {
	    begs = [];
	    left = str.length;

	    while (i >= 0 && !result) {
	      if (i == ai) {
	        begs.push(i);
	        ai = str.indexOf(a, i + 1);
	      } else if (begs.length == 1) {
	        result = [ begs.pop(), bi ];
	      } else {
	        beg = begs.pop();
	        if (beg < left) {
	          left = beg;
	          right = bi;
	        }

	        bi = str.indexOf(b, i + 1);
	      }

	      i = ai < bi && ai >= 0 ? ai : bi;
	    }

	    if (begs.length) {
	      result = [ left, right ];
	    }
	  }

	  return result;
	}

	var braceExpansion = expandTop;

	var escSlash = '\0SLASH'+Math.random()+'\0';
	var escOpen = '\0OPEN'+Math.random()+'\0';
	var escClose = '\0CLOSE'+Math.random()+'\0';
	var escComma = '\0COMMA'+Math.random()+'\0';
	var escPeriod = '\0PERIOD'+Math.random()+'\0';

	function numeric(str) {
	  return parseInt(str, 10) == str
	    ? parseInt(str, 10)
	    : str.charCodeAt(0);
	}

	function escapeBraces(str) {
	  return str.split('\\\\').join(escSlash)
	            .split('\\{').join(escOpen)
	            .split('\\}').join(escClose)
	            .split('\\,').join(escComma)
	            .split('\\.').join(escPeriod);
	}

	function unescapeBraces(str) {
	  return str.split(escSlash).join('\\')
	            .split(escOpen).join('{')
	            .split(escClose).join('}')
	            .split(escComma).join(',')
	            .split(escPeriod).join('.');
	}


	// Basically just str.split(","), but handling cases
	// where we have nested braced sections, which should be
	// treated as individual members, like {a,{b,c},d}
	function parseCommaParts(str) {
	  if (!str)
	    return [''];

	  var parts = [];
	  var m = balancedMatch('{', '}', str);

	  if (!m)
	    return str.split(',');

	  var pre = m.pre;
	  var body = m.body;
	  var post = m.post;
	  var p = pre.split(',');

	  p[p.length-1] += '{' + body + '}';
	  var postParts = parseCommaParts(post);
	  if (post.length) {
	    p[p.length-1] += postParts.shift();
	    p.push.apply(p, postParts);
	  }

	  parts.push.apply(parts, p);

	  return parts;
	}

	function expandTop(str) {
	  if (!str)
	    return [];

	  // I don't know why Bash 4.3 does this, but it does.
	  // Anything starting with {} will have the first two bytes preserved
	  // but *only* at the top level, so {},a}b will not expand to anything,
	  // but a{},b}c will be expanded to [a}c,abc].
	  // One could argue that this is a bug in Bash, but since the goal of
	  // this module is to match Bash's rules, we escape a leading {}
	  if (str.substr(0, 2) === '{}') {
	    str = '\\{\\}' + str.substr(2);
	  }

	  return expand(escapeBraces(str), true).map(unescapeBraces);
	}

	function embrace(str) {
	  return '{' + str + '}';
	}
	function isPadded(el) {
	  return /^-?0\d/.test(el);
	}

	function lte(i, y) {
	  return i <= y;
	}
	function gte(i, y) {
	  return i >= y;
	}

	function expand(str, isTop) {
	  var expansions = [];

	  var m = balancedMatch('{', '}', str);
	  if (!m || /\$$/.test(m.pre)) return [str];

	  var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
	  var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
	  var isSequence = isNumericSequence || isAlphaSequence;
	  var isOptions = m.body.indexOf(',') >= 0;
	  if (!isSequence && !isOptions) {
	    // {a},b}
	    if (m.post.match(/,.*\}/)) {
	      str = m.pre + '{' + m.body + escClose + m.post;
	      return expand(str);
	    }
	    return [str];
	  }

	  var n;
	  if (isSequence) {
	    n = m.body.split(/\.\./);
	  } else {
	    n = parseCommaParts(m.body);
	    if (n.length === 1) {
	      // x{{a,b}}y ==> x{a}y x{b}y
	      n = expand(n[0], false).map(embrace);
	      if (n.length === 1) {
	        var post = m.post.length
	          ? expand(m.post, false)
	          : [''];
	        return post.map(function(p) {
	          return m.pre + n[0] + p;
	        });
	      }
	    }
	  }

	  // at this point, n is the parts, and we know it's not a comma set
	  // with a single entry.

	  // no need to expand pre, since it is guaranteed to be free of brace-sets
	  var pre = m.pre;
	  var post = m.post.length
	    ? expand(m.post, false)
	    : [''];

	  var N;

	  if (isSequence) {
	    var x = numeric(n[0]);
	    var y = numeric(n[1]);
	    var width = Math.max(n[0].length, n[1].length);
	    var incr = n.length == 3
	      ? Math.abs(numeric(n[2]))
	      : 1;
	    var test = lte;
	    var reverse = y < x;
	    if (reverse) {
	      incr *= -1;
	      test = gte;
	    }
	    var pad = n.some(isPadded);

	    N = [];

	    for (var i = x; test(i, y); i += incr) {
	      var c;
	      if (isAlphaSequence) {
	        c = String.fromCharCode(i);
	        if (c === '\\')
	          c = '';
	      } else {
	        c = String(i);
	        if (pad) {
	          var need = width - c.length;
	          if (need > 0) {
	            var z = new Array(need + 1).join('0');
	            if (i < 0)
	              c = '-' + z + c.slice(1);
	            else
	              c = z + c;
	          }
	        }
	      }
	      N.push(c);
	    }
	  } else {
	    N = concatMap(n, function(el) { return expand(el, false) });
	  }

	  for (var j = 0; j < N.length; j++) {
	    for (var k = 0; k < post.length; k++) {
	      var expansion = pre + N[j] + post[k];
	      if (!isTop || isSequence || expansion)
	        expansions.push(expansion);
	    }
	  }

	  return expansions;
	}

	var minimatch_1 = minimatch;
	minimatch.Minimatch = Minimatch;

	var path = { sep: '/' };
	try {
	  path = path$1;
	} catch (er) {}

	var GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {};


	var plTypes = {
	  '!': { open: '(?:(?!(?:', close: '))[^/]*?)'},
	  '?': { open: '(?:', close: ')?' },
	  '+': { open: '(?:', close: ')+' },
	  '*': { open: '(?:', close: ')*' },
	  '@': { open: '(?:', close: ')' }
	};

	// any single thing other than /
	// don't need to escape / when using new RegExp()
	var qmark = '[^/]';

	// * => any number of characters
	var star = qmark + '*?';

	// ** when dots are allowed.  Anything goes, except .. and .
	// not (^ or / followed by one or two dots followed by $ or /),
	// followed by anything, any number of times.
	var twoStarDot = '(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?';

	// not a ^ or / followed by a dot,
	// followed by anything, any number of times.
	var twoStarNoDot = '(?:(?!(?:\\\/|^)\\.).)*?';

	// characters that need to be escaped in RegExp.
	var reSpecials = charSet('().*{}+?[]^$\\!');

	// "abc" -> { a:true, b:true, c:true }
	function charSet (s) {
	  return s.split('').reduce(function (set, c) {
	    set[c] = true;
	    return set
	  }, {})
	}

	// normalizes slashes.
	var slashSplit = /\/+/;

	minimatch.filter = filter;
	function filter (pattern, options) {
	  options = options || {};
	  return function (p, i, list) {
	    return minimatch(p, pattern, options)
	  }
	}

	function ext (a, b) {
	  a = a || {};
	  b = b || {};
	  var t = {};
	  Object.keys(b).forEach(function (k) {
	    t[k] = b[k];
	  });
	  Object.keys(a).forEach(function (k) {
	    t[k] = a[k];
	  });
	  return t
	}

	minimatch.defaults = function (def) {
	  if (!def || !Object.keys(def).length) return minimatch

	  var orig = minimatch;

	  var m = function minimatch (p, pattern, options) {
	    return orig.minimatch(p, pattern, ext(def, options))
	  };

	  m.Minimatch = function Minimatch (pattern, options) {
	    return new orig.Minimatch(pattern, ext(def, options))
	  };

	  return m
	};

	Minimatch.defaults = function (def) {
	  if (!def || !Object.keys(def).length) return Minimatch
	  return minimatch.defaults(def).Minimatch
	};

	function minimatch (p, pattern, options) {
	  if (typeof pattern !== 'string') {
	    throw new TypeError('glob pattern string required')
	  }

	  if (!options) options = {};

	  // shortcut: comments match nothing.
	  if (!options.nocomment && pattern.charAt(0) === '#') {
	    return false
	  }

	  // "" only matches ""
	  if (pattern.trim() === '') return p === ''

	  return new Minimatch(pattern, options).match(p)
	}

	function Minimatch (pattern, options) {
	  if (!(this instanceof Minimatch)) {
	    return new Minimatch(pattern, options)
	  }

	  if (typeof pattern !== 'string') {
	    throw new TypeError('glob pattern string required')
	  }

	  if (!options) options = {};
	  pattern = pattern.trim();

	  // windows support: need to use /, not \
	  if (path.sep !== '/') {
	    pattern = pattern.split(path.sep).join('/');
	  }

	  this.options = options;
	  this.set = [];
	  this.pattern = pattern;
	  this.regexp = null;
	  this.negate = false;
	  this.comment = false;
	  this.empty = false;

	  // make the set of regexps etc.
	  this.make();
	}

	Minimatch.prototype.debug = function () {};

	Minimatch.prototype.make = make;
	function make () {
	  // don't do it more than once.
	  if (this._made) return

	  var pattern = this.pattern;
	  var options = this.options;

	  // empty patterns and comments match nothing.
	  if (!options.nocomment && pattern.charAt(0) === '#') {
	    this.comment = true;
	    return
	  }
	  if (!pattern) {
	    this.empty = true;
	    return
	  }

	  // step 1: figure out negation, etc.
	  this.parseNegate();

	  // step 2: expand braces
	  var set = this.globSet = this.braceExpand();

	  if (options.debug) this.debug = console.error;

	  this.debug(this.pattern, set);

	  // step 3: now we have a set, so turn each one into a series of path-portion
	  // matching patterns.
	  // These will be regexps, except in the case of "**", which is
	  // set to the GLOBSTAR object for globstar behavior,
	  // and will not contain any / characters
	  set = this.globParts = set.map(function (s) {
	    return s.split(slashSplit)
	  });

	  this.debug(this.pattern, set);

	  // glob --> regexps
	  set = set.map(function (s, si, set) {
	    return s.map(this.parse, this)
	  }, this);

	  this.debug(this.pattern, set);

	  // filter out everything that didn't compile properly.
	  set = set.filter(function (s) {
	    return s.indexOf(false) === -1
	  });

	  this.debug(this.pattern, set);

	  this.set = set;
	}

	Minimatch.prototype.parseNegate = parseNegate;
	function parseNegate () {
	  var pattern = this.pattern;
	  var negate = false;
	  var options = this.options;
	  var negateOffset = 0;

	  if (options.nonegate) return

	  for (var i = 0, l = pattern.length
	    ; i < l && pattern.charAt(i) === '!'
	    ; i++) {
	    negate = !negate;
	    negateOffset++;
	  }

	  if (negateOffset) this.pattern = pattern.substr(negateOffset);
	  this.negate = negate;
	}

	// Brace expansion:
	// a{b,c}d -> abd acd
	// a{b,}c -> abc ac
	// a{0..3}d -> a0d a1d a2d a3d
	// a{b,c{d,e}f}g -> abg acdfg acefg
	// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
	//
	// Invalid sets are not expanded.
	// a{2..}b -> a{2..}b
	// a{b}c -> a{b}c
	minimatch.braceExpand = function (pattern, options) {
	  return braceExpand(pattern, options)
	};

	Minimatch.prototype.braceExpand = braceExpand;

	function braceExpand (pattern, options) {
	  if (!options) {
	    if (this instanceof Minimatch) {
	      options = this.options;
	    } else {
	      options = {};
	    }
	  }

	  pattern = typeof pattern === 'undefined'
	    ? this.pattern : pattern;

	  if (typeof pattern === 'undefined') {
	    throw new TypeError('undefined pattern')
	  }

	  if (options.nobrace ||
	    !pattern.match(/\{.*\}/)) {
	    // shortcut. no need to expand.
	    return [pattern]
	  }

	  return braceExpansion(pattern)
	}

	// parse a component of the expanded set.
	// At this point, no pattern may contain "/" in it
	// so we're going to return a 2d array, where each entry is the full
	// pattern, split on '/', and then turned into a regular expression.
	// A regexp is made at the end which joins each array with an
	// escaped /, and another full one which joins each regexp with |.
	//
	// Following the lead of Bash 4.1, note that "**" only has special meaning
	// when it is the *only* thing in a path portion.  Otherwise, any series
	// of * is equivalent to a single *.  Globstar behavior is enabled by
	// default, and can be disabled by setting options.noglobstar.
	Minimatch.prototype.parse = parse;
	var SUBPARSE = {};
	function parse (pattern, isSub) {
	  if (pattern.length > 1024 * 64) {
	    throw new TypeError('pattern is too long')
	  }

	  var options = this.options;

	  // shortcuts
	  if (!options.noglobstar && pattern === '**') return GLOBSTAR
	  if (pattern === '') return ''

	  var re = '';
	  var hasMagic = !!options.nocase;
	  var escaping = false;
	  // ? => one single character
	  var patternListStack = [];
	  var negativeLists = [];
	  var stateChar;
	  var inClass = false;
	  var reClassStart = -1;
	  var classStart = -1;
	  // . and .. never match anything that doesn't start with .,
	  // even when options.dot is set.
	  var patternStart = pattern.charAt(0) === '.' ? '' // anything
	  // not (start or / followed by . or .. followed by / or end)
	  : options.dot ? '(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))'
	  : '(?!\\.)';
	  var self = this;

	  function clearStateChar () {
	    if (stateChar) {
	      // we had some state-tracking character
	      // that wasn't consumed by this pass.
	      switch (stateChar) {
	        case '*':
	          re += star;
	          hasMagic = true;
	        break
	        case '?':
	          re += qmark;
	          hasMagic = true;
	        break
	        default:
	          re += '\\' + stateChar;
	        break
	      }
	      self.debug('clearStateChar %j %j', stateChar, re);
	      stateChar = false;
	    }
	  }

	  for (var i = 0, len = pattern.length, c
	    ; (i < len) && (c = pattern.charAt(i))
	    ; i++) {
	    this.debug('%s\t%s %s %j', pattern, i, re, c);

	    // skip over any that are escaped.
	    if (escaping && reSpecials[c]) {
	      re += '\\' + c;
	      escaping = false;
	      continue
	    }

	    switch (c) {
	      case '/':
	        // completely not allowed, even escaped.
	        // Should already be path-split by now.
	        return false

	      case '\\':
	        clearStateChar();
	        escaping = true;
	      continue

	      // the various stateChar values
	      // for the "extglob" stuff.
	      case '?':
	      case '*':
	      case '+':
	      case '@':
	      case '!':
	        this.debug('%s\t%s %s %j <-- stateChar', pattern, i, re, c);

	        // all of those are literals inside a class, except that
	        // the glob [!a] means [^a] in regexp
	        if (inClass) {
	          this.debug('  in class');
	          if (c === '!' && i === classStart + 1) c = '^';
	          re += c;
	          continue
	        }

	        // if we already have a stateChar, then it means
	        // that there was something like ** or +? in there.
	        // Handle the stateChar, then proceed with this one.
	        self.debug('call clearStateChar %j', stateChar);
	        clearStateChar();
	        stateChar = c;
	        // if extglob is disabled, then +(asdf|foo) isn't a thing.
	        // just clear the statechar *now*, rather than even diving into
	        // the patternList stuff.
	        if (options.noext) clearStateChar();
	      continue

	      case '(':
	        if (inClass) {
	          re += '(';
	          continue
	        }

	        if (!stateChar) {
	          re += '\\(';
	          continue
	        }

	        patternListStack.push({
	          type: stateChar,
	          start: i - 1,
	          reStart: re.length,
	          open: plTypes[stateChar].open,
	          close: plTypes[stateChar].close
	        });
	        // negation is (?:(?!js)[^/]*)
	        re += stateChar === '!' ? '(?:(?!(?:' : '(?:';
	        this.debug('plType %j %j', stateChar, re);
	        stateChar = false;
	      continue

	      case ')':
	        if (inClass || !patternListStack.length) {
	          re += '\\)';
	          continue
	        }

	        clearStateChar();
	        hasMagic = true;
	        var pl = patternListStack.pop();
	        // negation is (?:(?!js)[^/]*)
	        // The others are (?:<pattern>)<type>
	        re += pl.close;
	        if (pl.type === '!') {
	          negativeLists.push(pl);
	        }
	        pl.reEnd = re.length;
	      continue

	      case '|':
	        if (inClass || !patternListStack.length || escaping) {
	          re += '\\|';
	          escaping = false;
	          continue
	        }

	        clearStateChar();
	        re += '|';
	      continue

	      // these are mostly the same in regexp and glob
	      case '[':
	        // swallow any state-tracking char before the [
	        clearStateChar();

	        if (inClass) {
	          re += '\\' + c;
	          continue
	        }

	        inClass = true;
	        classStart = i;
	        reClassStart = re.length;
	        re += c;
	      continue

	      case ']':
	        //  a right bracket shall lose its special
	        //  meaning and represent itself in
	        //  a bracket expression if it occurs
	        //  first in the list.  -- POSIX.2 2.8.3.2
	        if (i === classStart + 1 || !inClass) {
	          re += '\\' + c;
	          escaping = false;
	          continue
	        }

	        // handle the case where we left a class open.
	        // "[z-a]" is valid, equivalent to "\[z-a\]"
	        if (inClass) {
	          // split where the last [ was, make sure we don't have
	          // an invalid re. if so, re-walk the contents of the
	          // would-be class to re-translate any characters that
	          // were passed through as-is
	          // TODO: It would probably be faster to determine this
	          // without a try/catch and a new RegExp, but it's tricky
	          // to do safely.  For now, this is safe and works.
	          var cs = pattern.substring(classStart + 1, i);
	          try {
	            RegExp('[' + cs + ']');
	          } catch (er) {
	            // not a valid class!
	            var sp = this.parse(cs, SUBPARSE);
	            re = re.substr(0, reClassStart) + '\\[' + sp[0] + '\\]';
	            hasMagic = hasMagic || sp[1];
	            inClass = false;
	            continue
	          }
	        }

	        // finish up the class.
	        hasMagic = true;
	        inClass = false;
	        re += c;
	      continue

	      default:
	        // swallow any state char that wasn't consumed
	        clearStateChar();

	        if (escaping) {
	          // no need
	          escaping = false;
	        } else if (reSpecials[c]
	          && !(c === '^' && inClass)) {
	          re += '\\';
	        }

	        re += c;

	    } // switch
	  } // for

	  // handle the case where we left a class open.
	  // "[abc" is valid, equivalent to "\[abc"
	  if (inClass) {
	    // split where the last [ was, and escape it
	    // this is a huge pita.  We now have to re-walk
	    // the contents of the would-be class to re-translate
	    // any characters that were passed through as-is
	    cs = pattern.substr(classStart + 1);
	    sp = this.parse(cs, SUBPARSE);
	    re = re.substr(0, reClassStart) + '\\[' + sp[0];
	    hasMagic = hasMagic || sp[1];
	  }

	  // handle the case where we had a +( thing at the *end*
	  // of the pattern.
	  // each pattern list stack adds 3 chars, and we need to go through
	  // and escape any | chars that were passed through as-is for the regexp.
	  // Go through and escape them, taking care not to double-escape any
	  // | chars that were already escaped.
	  for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
	    var tail = re.slice(pl.reStart + pl.open.length);
	    this.debug('setting tail', re, pl);
	    // maybe some even number of \, then maybe 1 \, followed by a |
	    tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function (_, $1, $2) {
	      if (!$2) {
	        // the | isn't already escaped, so escape it.
	        $2 = '\\';
	      }

	      // need to escape all those slashes *again*, without escaping the
	      // one that we need for escaping the | character.  As it works out,
	      // escaping an even number of slashes can be done by simply repeating
	      // it exactly after itself.  That's why this trick works.
	      //
	      // I am sorry that you have to see this.
	      return $1 + $1 + $2 + '|'
	    });

	    this.debug('tail=%j\n   %s', tail, tail, pl, re);
	    var t = pl.type === '*' ? star
	      : pl.type === '?' ? qmark
	      : '\\' + pl.type;

	    hasMagic = true;
	    re = re.slice(0, pl.reStart) + t + '\\(' + tail;
	  }

	  // handle trailing things that only matter at the very end.
	  clearStateChar();
	  if (escaping) {
	    // trailing \\
	    re += '\\\\';
	  }

	  // only need to apply the nodot start if the re starts with
	  // something that could conceivably capture a dot
	  var addPatternStart = false;
	  switch (re.charAt(0)) {
	    case '.':
	    case '[':
	    case '(': addPatternStart = true;
	  }

	  // Hack to work around lack of negative lookbehind in JS
	  // A pattern like: *.!(x).!(y|z) needs to ensure that a name
	  // like 'a.xyz.yz' doesn't match.  So, the first negative
	  // lookahead, has to look ALL the way ahead, to the end of
	  // the pattern.
	  for (var n = negativeLists.length - 1; n > -1; n--) {
	    var nl = negativeLists[n];

	    var nlBefore = re.slice(0, nl.reStart);
	    var nlFirst = re.slice(nl.reStart, nl.reEnd - 8);
	    var nlLast = re.slice(nl.reEnd - 8, nl.reEnd);
	    var nlAfter = re.slice(nl.reEnd);

	    nlLast += nlAfter;

	    // Handle nested stuff like *(*.js|!(*.json)), where open parens
	    // mean that we should *not* include the ) in the bit that is considered
	    // "after" the negated section.
	    var openParensBefore = nlBefore.split('(').length - 1;
	    var cleanAfter = nlAfter;
	    for (i = 0; i < openParensBefore; i++) {
	      cleanAfter = cleanAfter.replace(/\)[+*?]?/, '');
	    }
	    nlAfter = cleanAfter;

	    var dollar = '';
	    if (nlAfter === '' && isSub !== SUBPARSE) {
	      dollar = '$';
	    }
	    var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast;
	    re = newRe;
	  }

	  // if the re is not "" at this point, then we need to make sure
	  // it doesn't match against an empty path part.
	  // Otherwise a/* will match a/, which it should not.
	  if (re !== '' && hasMagic) {
	    re = '(?=.)' + re;
	  }

	  if (addPatternStart) {
	    re = patternStart + re;
	  }

	  // parsing just a piece of a larger pattern.
	  if (isSub === SUBPARSE) {
	    return [re, hasMagic]
	  }

	  // skip the regexp for non-magical patterns
	  // unescape anything in it, though, so that it'll be
	  // an exact match against a file etc.
	  if (!hasMagic) {
	    return globUnescape(pattern)
	  }

	  var flags = options.nocase ? 'i' : '';
	  try {
	    var regExp = new RegExp('^' + re + '$', flags);
	  } catch (er) {
	    // If it was an invalid regular expression, then it can't match
	    // anything.  This trick looks for a character after the end of
	    // the string, which is of course impossible, except in multi-line
	    // mode, but it's not a /m regex.
	    return new RegExp('$.')
	  }

	  regExp._glob = pattern;
	  regExp._src = re;

	  return regExp
	}

	minimatch.makeRe = function (pattern, options) {
	  return new Minimatch(pattern, options || {}).makeRe()
	};

	Minimatch.prototype.makeRe = makeRe;
	function makeRe () {
	  if (this.regexp || this.regexp === false) return this.regexp

	  // at this point, this.set is a 2d array of partial
	  // pattern strings, or "**".
	  //
	  // It's better to use .match().  This function shouldn't
	  // be used, really, but it's pretty convenient sometimes,
	  // when you just want to work with a regex.
	  var set = this.set;

	  if (!set.length) {
	    this.regexp = false;
	    return this.regexp
	  }
	  var options = this.options;

	  var twoStar = options.noglobstar ? star
	    : options.dot ? twoStarDot
	    : twoStarNoDot;
	  var flags = options.nocase ? 'i' : '';

	  var re = set.map(function (pattern) {
	    return pattern.map(function (p) {
	      return (p === GLOBSTAR) ? twoStar
	      : (typeof p === 'string') ? regExpEscape(p)
	      : p._src
	    }).join('\\\/')
	  }).join('|');

	  // must match entire pattern
	  // ending in a * or ** will make it less strict.
	  re = '^(?:' + re + ')$';

	  // can match anything, as long as it's not this.
	  if (this.negate) re = '^(?!' + re + ').*$';

	  try {
	    this.regexp = new RegExp(re, flags);
	  } catch (ex) {
	    this.regexp = false;
	  }
	  return this.regexp
	}

	minimatch.match = function (list, pattern, options) {
	  options = options || {};
	  var mm = new Minimatch(pattern, options);
	  list = list.filter(function (f) {
	    return mm.match(f)
	  });
	  if (mm.options.nonull && !list.length) {
	    list.push(pattern);
	  }
	  return list
	};

	Minimatch.prototype.match = match;
	function match (f, partial) {
	  this.debug('match', f, this.pattern);
	  // short-circuit in the case of busted things.
	  // comments, etc.
	  if (this.comment) return false
	  if (this.empty) return f === ''

	  if (f === '/' && partial) return true

	  var options = this.options;

	  // windows: need to use /, not \
	  if (path.sep !== '/') {
	    f = f.split(path.sep).join('/');
	  }

	  // treat the test path as a set of pathparts.
	  f = f.split(slashSplit);
	  this.debug(this.pattern, 'split', f);

	  // just ONE of the pattern sets in this.set needs to match
	  // in order for it to be valid.  If negating, then just one
	  // match means that we have failed.
	  // Either way, return on the first hit.

	  var set = this.set;
	  this.debug(this.pattern, 'set', set);

	  // Find the basename of the path by looking for the last non-empty segment
	  var filename;
	  var i;
	  for (i = f.length - 1; i >= 0; i--) {
	    filename = f[i];
	    if (filename) break
	  }

	  for (i = 0; i < set.length; i++) {
	    var pattern = set[i];
	    var file = f;
	    if (options.matchBase && pattern.length === 1) {
	      file = [filename];
	    }
	    var hit = this.matchOne(file, pattern, partial);
	    if (hit) {
	      if (options.flipNegate) return true
	      return !this.negate
	    }
	  }

	  // didn't get any hits.  this is success if it's a negative
	  // pattern, failure otherwise.
	  if (options.flipNegate) return false
	  return this.negate
	}

	// set partial to true to test if, for example,
	// "/a/b" matches the start of "/*/b/*/d"
	// Partial means, if you run out of file before you run
	// out of pattern, then that's fine, as long as all
	// the parts match.
	Minimatch.prototype.matchOne = function (file, pattern, partial) {
	  var options = this.options;

	  this.debug('matchOne',
	    { 'this': this, file: file, pattern: pattern });

	  this.debug('matchOne', file.length, pattern.length);

	  for (var fi = 0,
	      pi = 0,
	      fl = file.length,
	      pl = pattern.length
	      ; (fi < fl) && (pi < pl)
	      ; fi++, pi++) {
	    this.debug('matchOne loop');
	    var p = pattern[pi];
	    var f = file[fi];

	    this.debug(pattern, p, f);

	    // should be impossible.
	    // some invalid regexp stuff in the set.
	    if (p === false) return false

	    if (p === GLOBSTAR) {
	      this.debug('GLOBSTAR', [pattern, p, f]);

	      // "**"
	      // a/**/b/**/c would match the following:
	      // a/b/x/y/z/c
	      // a/x/y/z/b/c
	      // a/b/x/b/x/c
	      // a/b/c
	      // To do this, take the rest of the pattern after
	      // the **, and see if it would match the file remainder.
	      // If so, return success.
	      // If not, the ** "swallows" a segment, and try again.
	      // This is recursively awful.
	      //
	      // a/**/b/**/c matching a/b/x/y/z/c
	      // - a matches a
	      // - doublestar
	      //   - matchOne(b/x/y/z/c, b/**/c)
	      //     - b matches b
	      //     - doublestar
	      //       - matchOne(x/y/z/c, c) -> no
	      //       - matchOne(y/z/c, c) -> no
	      //       - matchOne(z/c, c) -> no
	      //       - matchOne(c, c) yes, hit
	      var fr = fi;
	      var pr = pi + 1;
	      if (pr === pl) {
	        this.debug('** at the end');
	        // a ** at the end will just swallow the rest.
	        // We have found a match.
	        // however, it will not swallow /.x, unless
	        // options.dot is set.
	        // . and .. are *never* matched by **, for explosively
	        // exponential reasons.
	        for (; fi < fl; fi++) {
	          if (file[fi] === '.' || file[fi] === '..' ||
	            (!options.dot && file[fi].charAt(0) === '.')) return false
	        }
	        return true
	      }

	      // ok, let's see if we can swallow whatever we can.
	      while (fr < fl) {
	        var swallowee = file[fr];

	        this.debug('\nglobstar while', file, fr, pattern, pr, swallowee);

	        // XXX remove this slice.  Just pass the start index.
	        if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
	          this.debug('globstar found match!', fr, fl, swallowee);
	          // found a match.
	          return true
	        } else {
	          // can't swallow "." or ".." ever.
	          // can only swallow ".foo" when explicitly asked.
	          if (swallowee === '.' || swallowee === '..' ||
	            (!options.dot && swallowee.charAt(0) === '.')) {
	            this.debug('dot detected!', file, fr, pattern, pr);
	            break
	          }

	          // ** swallows a segment, and continue.
	          this.debug('globstar swallow a segment, and continue');
	          fr++;
	        }
	      }

	      // no match was found.
	      // However, in partial mode, we can't say this is necessarily over.
	      // If there's more *pattern* left, then
	      if (partial) {
	        // ran out of file
	        this.debug('\n>>> no match, partial?', file, fr, pattern, pr);
	        if (fr === fl) return true
	      }
	      return false
	    }

	    // something other than **
	    // non-magic patterns just have to match exactly
	    // patterns with magic have been turned into regexps.
	    var hit;
	    if (typeof p === 'string') {
	      if (options.nocase) {
	        hit = f.toLowerCase() === p.toLowerCase();
	      } else {
	        hit = f === p;
	      }
	      this.debug('string match', p, f, hit);
	    } else {
	      hit = f.match(p);
	      this.debug('pattern match', p, f, hit);
	    }

	    if (!hit) return false
	  }

	  // Note: ending in / means that we'll get a final ""
	  // at the end of the pattern.  This can only match a
	  // corresponding "" at the end of the file.
	  // If the file ends in /, then it can only match a
	  // a pattern that ends in /, unless the pattern just
	  // doesn't have any more for it. But, a/b/ should *not*
	  // match "a/b/*", even though "" matches against the
	  // [^/]*? pattern, except in partial mode, where it might
	  // simply not be reached yet.
	  // However, a/b/ should still satisfy a/*

	  // now either we fell off the end of the pattern, or we're done.
	  if (fi === fl && pi === pl) {
	    // ran out of pattern and filename at the same time.
	    // an exact hit!
	    return true
	  } else if (fi === fl) {
	    // ran out of file, but still had pattern left.
	    // this is ok if we're doing the match as part of
	    // a glob fs traversal.
	    return partial
	  } else if (pi === pl) {
	    // ran out of pattern, still have file left.
	    // this is only acceptable if we're on the very last
	    // empty segment of a file with a trailing slash.
	    // a/* should match a/b/
	    var emptyFileEnd = (fi === fl - 1) && (file[fi] === '');
	    return emptyFileEnd
	  }

	  // should be unreachable.
	  throw new Error('wtf?')
	};

	// replace stuff like \* with *
	function globUnescape (s) {
	  return s.replace(/\\(.)/g, '$1')
	}

	function regExpEscape (s) {
	  return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
	}

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.


	var isWindows = process.platform === 'win32';


	// JavaScript implementation of realpath, ported from node pre-v6

	var DEBUG = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);

	function rethrow() {
	  // Only enable in debug mode. A backtrace uses ~1000 bytes of heap space and
	  // is fairly slow to generate.
	  var callback;
	  if (DEBUG) {
	    var backtrace = new Error;
	    callback = debugCallback;
	  } else
	    callback = missingCallback;

	  return callback;

	  function debugCallback(err) {
	    if (err) {
	      backtrace.message = err.message;
	      err = backtrace;
	      missingCallback(err);
	    }
	  }

	  function missingCallback(err) {
	    if (err) {
	      if (process.throwDeprecation)
	        throw err;  // Forgot a callback but don't know where? Use NODE_DEBUG=fs
	      else if (!process.noDeprecation) {
	        var msg = 'fs: missing callback ' + (err.stack || err.message);
	        if (process.traceDeprecation)
	          console.trace(msg);
	        else
	          console.error(msg);
	      }
	    }
	  }
	}

	function maybeCallback(cb) {
	  return typeof cb === 'function' ? cb : rethrow();
	}

	var normalize = path$1.normalize;

	// Regexp that finds the next partion of a (partial) path
	// result is [base_with_slash, base], e.g. ['somedir/', 'somedir']
	if (isWindows) {
	  var nextPartRe = /(.*?)(?:[\/\\]+|$)/g;
	} else {
	  var nextPartRe = /(.*?)(?:[\/]+|$)/g;
	}

	// Regex to find the device root, including trailing slash. E.g. 'c:\\'.
	if (isWindows) {
	  var splitRootRe = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/;
	} else {
	  var splitRootRe = /^[\/]*/;
	}

	var realpathSync = function realpathSync(p, cache) {
	  // make p is absolute
	  p = path$1.resolve(p);

	  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
	    return cache[p];
	  }

	  var original = p,
	      seenLinks = {},
	      knownHard = {};

	  // current character position in p
	  var pos;
	  // the partial path so far, including a trailing slash if any
	  var current;
	  // the partial path without a trailing slash (except when pointing at a root)
	  var base;
	  // the partial path scanned in the previous round, with slash
	  var previous;

	  start();

	  function start() {
	    // Skip over roots
	    var m = splitRootRe.exec(p);
	    pos = m[0].length;
	    current = m[0];
	    base = m[0];
	    previous = '';

	    // On windows, check that the root exists. On unix there is no need.
	    if (isWindows && !knownHard[base]) {
	      fs$1.lstatSync(base);
	      knownHard[base] = true;
	    }
	  }

	  // walk down the path, swapping out linked pathparts for their real
	  // values
	  // NB: p.length changes.
	  while (pos < p.length) {
	    // find the next part
	    nextPartRe.lastIndex = pos;
	    var result = nextPartRe.exec(p);
	    previous = current;
	    current += result[0];
	    base = previous + result[1];
	    pos = nextPartRe.lastIndex;

	    // continue if not a symlink
	    if (knownHard[base] || (cache && cache[base] === base)) {
	      continue;
	    }

	    var resolvedLink;
	    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
	      // some known symbolic link.  no need to stat again.
	      resolvedLink = cache[base];
	    } else {
	      var stat = fs$1.lstatSync(base);
	      if (!stat.isSymbolicLink()) {
	        knownHard[base] = true;
	        if (cache) cache[base] = base;
	        continue;
	      }

	      // read the link if it wasn't read before
	      // dev/ino always return 0 on windows, so skip the check.
	      var linkTarget = null;
	      if (!isWindows) {
	        var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
	        if (seenLinks.hasOwnProperty(id)) {
	          linkTarget = seenLinks[id];
	        }
	      }
	      if (linkTarget === null) {
	        fs$1.statSync(base);
	        linkTarget = fs$1.readlinkSync(base);
	      }
	      resolvedLink = path$1.resolve(previous, linkTarget);
	      // track this, if given a cache.
	      if (cache) cache[base] = resolvedLink;
	      if (!isWindows) seenLinks[id] = linkTarget;
	    }

	    // resolve the link, then start over
	    p = path$1.resolve(resolvedLink, p.slice(pos));
	    start();
	  }

	  if (cache) cache[original] = p;

	  return p;
	};


	var realpath = function realpath(p, cache, cb) {
	  if (typeof cb !== 'function') {
	    cb = maybeCallback(cache);
	    cache = null;
	  }

	  // make p is absolute
	  p = path$1.resolve(p);

	  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
	    return process.nextTick(cb.bind(null, null, cache[p]));
	  }

	  var original = p,
	      seenLinks = {},
	      knownHard = {};

	  // current character position in p
	  var pos;
	  // the partial path so far, including a trailing slash if any
	  var current;
	  // the partial path without a trailing slash (except when pointing at a root)
	  var base;
	  // the partial path scanned in the previous round, with slash
	  var previous;

	  start();

	  function start() {
	    // Skip over roots
	    var m = splitRootRe.exec(p);
	    pos = m[0].length;
	    current = m[0];
	    base = m[0];
	    previous = '';

	    // On windows, check that the root exists. On unix there is no need.
	    if (isWindows && !knownHard[base]) {
	      fs$1.lstat(base, function(err) {
	        if (err) return cb(err);
	        knownHard[base] = true;
	        LOOP();
	      });
	    } else {
	      process.nextTick(LOOP);
	    }
	  }

	  // walk down the path, swapping out linked pathparts for their real
	  // values
	  function LOOP() {
	    // stop if scanned past end of path
	    if (pos >= p.length) {
	      if (cache) cache[original] = p;
	      return cb(null, p);
	    }

	    // find the next part
	    nextPartRe.lastIndex = pos;
	    var result = nextPartRe.exec(p);
	    previous = current;
	    current += result[0];
	    base = previous + result[1];
	    pos = nextPartRe.lastIndex;

	    // continue if not a symlink
	    if (knownHard[base] || (cache && cache[base] === base)) {
	      return process.nextTick(LOOP);
	    }

	    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
	      // known symbolic link.  no need to stat again.
	      return gotResolvedLink(cache[base]);
	    }

	    return fs$1.lstat(base, gotStat);
	  }

	  function gotStat(err, stat) {
	    if (err) return cb(err);

	    // if not a symlink, skip to the next path part
	    if (!stat.isSymbolicLink()) {
	      knownHard[base] = true;
	      if (cache) cache[base] = base;
	      return process.nextTick(LOOP);
	    }

	    // stat & read the link if not read before
	    // call gotTarget as soon as the link target is known
	    // dev/ino always return 0 on windows, so skip the check.
	    if (!isWindows) {
	      var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
	      if (seenLinks.hasOwnProperty(id)) {
	        return gotTarget(null, seenLinks[id], base);
	      }
	    }
	    fs$1.stat(base, function(err) {
	      if (err) return cb(err);

	      fs$1.readlink(base, function(err, target) {
	        if (!isWindows) seenLinks[id] = target;
	        gotTarget(err, target);
	      });
	    });
	  }

	  function gotTarget(err, target, base) {
	    if (err) return cb(err);

	    var resolvedLink = path$1.resolve(previous, target);
	    if (cache) cache[base] = resolvedLink;
	    gotResolvedLink(resolvedLink);
	  }

	  function gotResolvedLink(resolvedLink) {
	    // resolve the link, then start over
	    p = path$1.resolve(resolvedLink, p.slice(pos));
	    start();
	  }
	};

	var old = {
		realpathSync: realpathSync,
		realpath: realpath
	};

	var fs_realpath = realpath$1;
	realpath$1.realpath = realpath$1;
	realpath$1.sync = realpathSync$1;
	realpath$1.realpathSync = realpathSync$1;
	realpath$1.monkeypatch = monkeypatch;
	realpath$1.unmonkeypatch = unmonkeypatch;


	var origRealpath = fs$1.realpath;
	var origRealpathSync = fs$1.realpathSync;

	var version = process.version;
	var ok = /^v[0-5]\./.test(version);


	function newError (er) {
	  return er && er.syscall === 'realpath' && (
	    er.code === 'ELOOP' ||
	    er.code === 'ENOMEM' ||
	    er.code === 'ENAMETOOLONG'
	  )
	}

	function realpath$1 (p, cache, cb) {
	  if (ok) {
	    return origRealpath(p, cache, cb)
	  }

	  if (typeof cache === 'function') {
	    cb = cache;
	    cache = null;
	  }
	  origRealpath(p, cache, function (er, result) {
	    if (newError(er)) {
	      old.realpath(p, cache, cb);
	    } else {
	      cb(er, result);
	    }
	  });
	}

	function realpathSync$1 (p, cache) {
	  if (ok) {
	    return origRealpathSync(p, cache)
	  }

	  try {
	    return origRealpathSync(p, cache)
	  } catch (er) {
	    if (newError(er)) {
	      return old.realpathSync(p, cache)
	    } else {
	      throw er
	    }
	  }
	}

	function monkeypatch () {
	  fs$1.realpath = realpath$1;
	  fs$1.realpathSync = realpathSync$1;
	}

	function unmonkeypatch () {
	  fs$1.realpath = origRealpath;
	  fs$1.realpathSync = origRealpathSync;
	}

	var inherits_browser = createCommonjsModule(function (module) {
	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    if (superCtor) {
	      ctor.super_ = superCtor;
	      ctor.prototype = Object.create(superCtor.prototype, {
	        constructor: {
	          value: ctor,
	          enumerable: false,
	          writable: true,
	          configurable: true
	        }
	      });
	    }
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    if (superCtor) {
	      ctor.super_ = superCtor;
	      var TempCtor = function () {};
	      TempCtor.prototype = superCtor.prototype;
	      ctor.prototype = new TempCtor();
	      ctor.prototype.constructor = ctor;
	    }
	  };
	}
	});

	var inherits = createCommonjsModule(function (module) {
	try {
	  var util = util$1;
	  /* istanbul ignore next */
	  if (typeof util.inherits !== 'function') throw '';
	  module.exports = util.inherits;
	} catch (e) {
	  /* istanbul ignore next */
	  module.exports = inherits_browser;
	}
	});

	function posix(path) {
		return path.charAt(0) === '/';
	}

	function win32(path) {
		// https://github.com/nodejs/node/blob/b3fcc245fb25539909ef1d5eaa01dbf92e168633/lib/path.js#L56
		var splitDeviceRe = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;
		var result = splitDeviceRe.exec(path);
		var device = result[1] || '';
		var isUnc = Boolean(device && device.charAt(1) !== ':');

		// UNC paths are always absolute
		return Boolean(result[2] || isUnc);
	}

	var pathIsAbsolute = process.platform === 'win32' ? win32 : posix;
	var posix_1 = posix;
	var win32_1 = win32;
	pathIsAbsolute.posix = posix_1;
	pathIsAbsolute.win32 = win32_1;

	var alphasort_1 = alphasort;
	var alphasorti_1 = alphasorti;
	var setopts_1 = setopts;
	var ownProp_1 = ownProp;
	var makeAbs_1 = makeAbs;
	var finish_1 = finish;
	var mark_1 = mark;
	var isIgnored_1 = isIgnored;
	var childrenIgnored_1 = childrenIgnored;

	function ownProp (obj, field) {
	  return Object.prototype.hasOwnProperty.call(obj, field)
	}




	var Minimatch$1 = minimatch_1.Minimatch;

	function alphasorti (a, b) {
	  return a.toLowerCase().localeCompare(b.toLowerCase())
	}

	function alphasort (a, b) {
	  return a.localeCompare(b)
	}

	function setupIgnores (self, options) {
	  self.ignore = options.ignore || [];

	  if (!Array.isArray(self.ignore))
	    self.ignore = [self.ignore];

	  if (self.ignore.length) {
	    self.ignore = self.ignore.map(ignoreMap);
	  }
	}

	// ignore patterns are always in dot:true mode.
	function ignoreMap (pattern) {
	  var gmatcher = null;
	  if (pattern.slice(-3) === '/**') {
	    var gpattern = pattern.replace(/(\/\*\*)+$/, '');
	    gmatcher = new Minimatch$1(gpattern, { dot: true });
	  }

	  return {
	    matcher: new Minimatch$1(pattern, { dot: true }),
	    gmatcher: gmatcher
	  }
	}

	function setopts (self, pattern, options) {
	  if (!options)
	    options = {};

	  // base-matching: just use globstar for that.
	  if (options.matchBase && -1 === pattern.indexOf("/")) {
	    if (options.noglobstar) {
	      throw new Error("base matching requires globstar")
	    }
	    pattern = "**/" + pattern;
	  }

	  self.silent = !!options.silent;
	  self.pattern = pattern;
	  self.strict = options.strict !== false;
	  self.realpath = !!options.realpath;
	  self.realpathCache = options.realpathCache || Object.create(null);
	  self.follow = !!options.follow;
	  self.dot = !!options.dot;
	  self.mark = !!options.mark;
	  self.nodir = !!options.nodir;
	  if (self.nodir)
	    self.mark = true;
	  self.sync = !!options.sync;
	  self.nounique = !!options.nounique;
	  self.nonull = !!options.nonull;
	  self.nosort = !!options.nosort;
	  self.nocase = !!options.nocase;
	  self.stat = !!options.stat;
	  self.noprocess = !!options.noprocess;
	  self.absolute = !!options.absolute;

	  self.maxLength = options.maxLength || Infinity;
	  self.cache = options.cache || Object.create(null);
	  self.statCache = options.statCache || Object.create(null);
	  self.symlinks = options.symlinks || Object.create(null);

	  setupIgnores(self, options);

	  self.changedCwd = false;
	  var cwd = process.cwd();
	  if (!ownProp(options, "cwd"))
	    self.cwd = cwd;
	  else {
	    self.cwd = path$1.resolve(options.cwd);
	    self.changedCwd = self.cwd !== cwd;
	  }

	  self.root = options.root || path$1.resolve(self.cwd, "/");
	  self.root = path$1.resolve(self.root);
	  if (process.platform === "win32")
	    self.root = self.root.replace(/\\/g, "/");

	  // TODO: is an absolute `cwd` supposed to be resolved against `root`?
	  // e.g. { cwd: '/test', root: __dirname } === path.join(__dirname, '/test')
	  self.cwdAbs = pathIsAbsolute(self.cwd) ? self.cwd : makeAbs(self, self.cwd);
	  if (process.platform === "win32")
	    self.cwdAbs = self.cwdAbs.replace(/\\/g, "/");
	  self.nomount = !!options.nomount;

	  // disable comments and negation in Minimatch.
	  // Note that they are not supported in Glob itself anyway.
	  options.nonegate = true;
	  options.nocomment = true;

	  self.minimatch = new Minimatch$1(pattern, options);
	  self.options = self.minimatch.options;
	}

	function finish (self) {
	  var nou = self.nounique;
	  var all = nou ? [] : Object.create(null);

	  for (var i = 0, l = self.matches.length; i < l; i ++) {
	    var matches = self.matches[i];
	    if (!matches || Object.keys(matches).length === 0) {
	      if (self.nonull) {
	        // do like the shell, and spit out the literal glob
	        var literal = self.minimatch.globSet[i];
	        if (nou)
	          all.push(literal);
	        else
	          all[literal] = true;
	      }
	    } else {
	      // had matches
	      var m = Object.keys(matches);
	      if (nou)
	        all.push.apply(all, m);
	      else
	        m.forEach(function (m) {
	          all[m] = true;
	        });
	    }
	  }

	  if (!nou)
	    all = Object.keys(all);

	  if (!self.nosort)
	    all = all.sort(self.nocase ? alphasorti : alphasort);

	  // at *some* point we statted all of these
	  if (self.mark) {
	    for (var i = 0; i < all.length; i++) {
	      all[i] = self._mark(all[i]);
	    }
	    if (self.nodir) {
	      all = all.filter(function (e) {
	        var notDir = !(/\/$/.test(e));
	        var c = self.cache[e] || self.cache[makeAbs(self, e)];
	        if (notDir && c)
	          notDir = c !== 'DIR' && !Array.isArray(c);
	        return notDir
	      });
	    }
	  }

	  if (self.ignore.length)
	    all = all.filter(function(m) {
	      return !isIgnored(self, m)
	    });

	  self.found = all;
	}

	function mark (self, p) {
	  var abs = makeAbs(self, p);
	  var c = self.cache[abs];
	  var m = p;
	  if (c) {
	    var isDir = c === 'DIR' || Array.isArray(c);
	    var slash = p.slice(-1) === '/';

	    if (isDir && !slash)
	      m += '/';
	    else if (!isDir && slash)
	      m = m.slice(0, -1);

	    if (m !== p) {
	      var mabs = makeAbs(self, m);
	      self.statCache[mabs] = self.statCache[abs];
	      self.cache[mabs] = self.cache[abs];
	    }
	  }

	  return m
	}

	// lotta situps...
	function makeAbs (self, f) {
	  var abs = f;
	  if (f.charAt(0) === '/') {
	    abs = path$1.join(self.root, f);
	  } else if (pathIsAbsolute(f) || f === '') {
	    abs = f;
	  } else if (self.changedCwd) {
	    abs = path$1.resolve(self.cwd, f);
	  } else {
	    abs = path$1.resolve(f);
	  }

	  if (process.platform === 'win32')
	    abs = abs.replace(/\\/g, '/');

	  return abs
	}


	// Return true, if pattern ends with globstar '**', for the accompanying parent directory.
	// Ex:- If node_modules/** is the pattern, add 'node_modules' to ignore list along with it's contents
	function isIgnored (self, path) {
	  if (!self.ignore.length)
	    return false

	  return self.ignore.some(function(item) {
	    return item.matcher.match(path) || !!(item.gmatcher && item.gmatcher.match(path))
	  })
	}

	function childrenIgnored (self, path) {
	  if (!self.ignore.length)
	    return false

	  return self.ignore.some(function(item) {
	    return !!(item.gmatcher && item.gmatcher.match(path))
	  })
	}

	var common = {
		alphasort: alphasort_1,
		alphasorti: alphasorti_1,
		setopts: setopts_1,
		ownProp: ownProp_1,
		makeAbs: makeAbs_1,
		finish: finish_1,
		mark: mark_1,
		isIgnored: isIgnored_1,
		childrenIgnored: childrenIgnored_1
	};

	var sync = globSync;
	globSync.GlobSync = GlobSync;
	var setopts$1 = common.setopts;
	var ownProp$1 = common.ownProp;
	var childrenIgnored$1 = common.childrenIgnored;
	var isIgnored$1 = common.isIgnored;

	function globSync (pattern, options) {
	  if (typeof options === 'function' || arguments.length === 3)
	    throw new TypeError('callback provided to sync glob\n'+
	                        'See: https://github.com/isaacs/node-glob/issues/167')

	  return new GlobSync(pattern, options).found
	}

	function GlobSync (pattern, options) {
	  if (!pattern)
	    throw new Error('must provide pattern')

	  if (typeof options === 'function' || arguments.length === 3)
	    throw new TypeError('callback provided to sync glob\n'+
	                        'See: https://github.com/isaacs/node-glob/issues/167')

	  if (!(this instanceof GlobSync))
	    return new GlobSync(pattern, options)

	  setopts$1(this, pattern, options);

	  if (this.noprocess)
	    return this

	  var n = this.minimatch.set.length;
	  this.matches = new Array(n);
	  for (var i = 0; i < n; i ++) {
	    this._process(this.minimatch.set[i], i, false);
	  }
	  this._finish();
	}

	GlobSync.prototype._finish = function () {
	  assert(this instanceof GlobSync);
	  if (this.realpath) {
	    var self = this;
	    this.matches.forEach(function (matchset, index) {
	      var set = self.matches[index] = Object.create(null);
	      for (var p in matchset) {
	        try {
	          p = self._makeAbs(p);
	          var real = fs_realpath.realpathSync(p, self.realpathCache);
	          set[real] = true;
	        } catch (er) {
	          if (er.syscall === 'stat')
	            set[self._makeAbs(p)] = true;
	          else
	            throw er
	        }
	      }
	    });
	  }
	  common.finish(this);
	};


	GlobSync.prototype._process = function (pattern, index, inGlobStar) {
	  assert(this instanceof GlobSync);

	  // Get the first [n] parts of pattern that are all strings.
	  var n = 0;
	  while (typeof pattern[n] === 'string') {
	    n ++;
	  }
	  // now n is the index of the first one that is *not* a string.

	  // See if there's anything else
	  var prefix;
	  switch (n) {
	    // if not, then this is rather simple
	    case pattern.length:
	      this._processSimple(pattern.join('/'), index);
	      return

	    case 0:
	      // pattern *starts* with some non-trivial item.
	      // going to readdir(cwd), but not include the prefix in matches.
	      prefix = null;
	      break

	    default:
	      // pattern has some string bits in the front.
	      // whatever it starts with, whether that's 'absolute' like /foo/bar,
	      // or 'relative' like '../baz'
	      prefix = pattern.slice(0, n).join('/');
	      break
	  }

	  var remain = pattern.slice(n);

	  // get the list of entries.
	  var read;
	  if (prefix === null)
	    read = '.';
	  else if (pathIsAbsolute(prefix) || pathIsAbsolute(pattern.join('/'))) {
	    if (!prefix || !pathIsAbsolute(prefix))
	      prefix = '/' + prefix;
	    read = prefix;
	  } else
	    read = prefix;

	  var abs = this._makeAbs(read);

	  //if ignored, skip processing
	  if (childrenIgnored$1(this, read))
	    return

	  var isGlobStar = remain[0] === minimatch_1.GLOBSTAR;
	  if (isGlobStar)
	    this._processGlobStar(prefix, read, abs, remain, index, inGlobStar);
	  else
	    this._processReaddir(prefix, read, abs, remain, index, inGlobStar);
	};


	GlobSync.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar) {
	  var entries = this._readdir(abs, inGlobStar);

	  // if the abs isn't a dir, then nothing can match!
	  if (!entries)
	    return

	  // It will only match dot entries if it starts with a dot, or if
	  // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
	  var pn = remain[0];
	  var negate = !!this.minimatch.negate;
	  var rawGlob = pn._glob;
	  var dotOk = this.dot || rawGlob.charAt(0) === '.';

	  var matchedEntries = [];
	  for (var i = 0; i < entries.length; i++) {
	    var e = entries[i];
	    if (e.charAt(0) !== '.' || dotOk) {
	      var m;
	      if (negate && !prefix) {
	        m = !e.match(pn);
	      } else {
	        m = e.match(pn);
	      }
	      if (m)
	        matchedEntries.push(e);
	    }
	  }

	  var len = matchedEntries.length;
	  // If there are no matched entries, then nothing matches.
	  if (len === 0)
	    return

	  // if this is the last remaining pattern bit, then no need for
	  // an additional stat *unless* the user has specified mark or
	  // stat explicitly.  We know they exist, since readdir returned
	  // them.

	  if (remain.length === 1 && !this.mark && !this.stat) {
	    if (!this.matches[index])
	      this.matches[index] = Object.create(null);

	    for (var i = 0; i < len; i ++) {
	      var e = matchedEntries[i];
	      if (prefix) {
	        if (prefix.slice(-1) !== '/')
	          e = prefix + '/' + e;
	        else
	          e = prefix + e;
	      }

	      if (e.charAt(0) === '/' && !this.nomount) {
	        e = path$1.join(this.root, e);
	      }
	      this._emitMatch(index, e);
	    }
	    // This was the last one, and no stats were needed
	    return
	  }

	  // now test all matched entries as stand-ins for that part
	  // of the pattern.
	  remain.shift();
	  for (var i = 0; i < len; i ++) {
	    var e = matchedEntries[i];
	    var newPattern;
	    if (prefix)
	      newPattern = [prefix, e];
	    else
	      newPattern = [e];
	    this._process(newPattern.concat(remain), index, inGlobStar);
	  }
	};


	GlobSync.prototype._emitMatch = function (index, e) {
	  if (isIgnored$1(this, e))
	    return

	  var abs = this._makeAbs(e);

	  if (this.mark)
	    e = this._mark(e);

	  if (this.absolute) {
	    e = abs;
	  }

	  if (this.matches[index][e])
	    return

	  if (this.nodir) {
	    var c = this.cache[abs];
	    if (c === 'DIR' || Array.isArray(c))
	      return
	  }

	  this.matches[index][e] = true;

	  if (this.stat)
	    this._stat(e);
	};


	GlobSync.prototype._readdirInGlobStar = function (abs) {
	  // follow all symlinked directories forever
	  // just proceed as if this is a non-globstar situation
	  if (this.follow)
	    return this._readdir(abs, false)

	  var entries;
	  var lstat;
	  try {
	    lstat = fs$1.lstatSync(abs);
	  } catch (er) {
	    if (er.code === 'ENOENT') {
	      // lstat failed, doesn't exist
	      return null
	    }
	  }

	  var isSym = lstat && lstat.isSymbolicLink();
	  this.symlinks[abs] = isSym;

	  // If it's not a symlink or a dir, then it's definitely a regular file.
	  // don't bother doing a readdir in that case.
	  if (!isSym && lstat && !lstat.isDirectory())
	    this.cache[abs] = 'FILE';
	  else
	    entries = this._readdir(abs, false);

	  return entries
	};

	GlobSync.prototype._readdir = function (abs, inGlobStar) {

	  if (inGlobStar && !ownProp$1(this.symlinks, abs))
	    return this._readdirInGlobStar(abs)

	  if (ownProp$1(this.cache, abs)) {
	    var c = this.cache[abs];
	    if (!c || c === 'FILE')
	      return null

	    if (Array.isArray(c))
	      return c
	  }

	  try {
	    return this._readdirEntries(abs, fs$1.readdirSync(abs))
	  } catch (er) {
	    this._readdirError(abs, er);
	    return null
	  }
	};

	GlobSync.prototype._readdirEntries = function (abs, entries) {
	  // if we haven't asked to stat everything, then just
	  // assume that everything in there exists, so we can avoid
	  // having to stat it a second time.
	  if (!this.mark && !this.stat) {
	    for (var i = 0; i < entries.length; i ++) {
	      var e = entries[i];
	      if (abs === '/')
	        e = abs + e;
	      else
	        e = abs + '/' + e;
	      this.cache[e] = true;
	    }
	  }

	  this.cache[abs] = entries;

	  // mark and cache dir-ness
	  return entries
	};

	GlobSync.prototype._readdirError = function (f, er) {
	  // handle errors, and cache the information
	  switch (er.code) {
	    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
	    case 'ENOTDIR': // totally normal. means it *does* exist.
	      var abs = this._makeAbs(f);
	      this.cache[abs] = 'FILE';
	      if (abs === this.cwdAbs) {
	        var error = new Error(er.code + ' invalid cwd ' + this.cwd);
	        error.path = this.cwd;
	        error.code = er.code;
	        throw error
	      }
	      break

	    case 'ENOENT': // not terribly unusual
	    case 'ELOOP':
	    case 'ENAMETOOLONG':
	    case 'UNKNOWN':
	      this.cache[this._makeAbs(f)] = false;
	      break

	    default: // some unusual error.  Treat as failure.
	      this.cache[this._makeAbs(f)] = false;
	      if (this.strict)
	        throw er
	      if (!this.silent)
	        console.error('glob error', er);
	      break
	  }
	};

	GlobSync.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar) {

	  var entries = this._readdir(abs, inGlobStar);

	  // no entries means not a dir, so it can never have matches
	  // foo.txt/** doesn't match foo.txt
	  if (!entries)
	    return

	  // test without the globstar, and with every child both below
	  // and replacing the globstar.
	  var remainWithoutGlobStar = remain.slice(1);
	  var gspref = prefix ? [ prefix ] : [];
	  var noGlobStar = gspref.concat(remainWithoutGlobStar);

	  // the noGlobStar pattern exits the inGlobStar state
	  this._process(noGlobStar, index, false);

	  var len = entries.length;
	  var isSym = this.symlinks[abs];

	  // If it's a symlink, and we're in a globstar, then stop
	  if (isSym && inGlobStar)
	    return

	  for (var i = 0; i < len; i++) {
	    var e = entries[i];
	    if (e.charAt(0) === '.' && !this.dot)
	      continue

	    // these two cases enter the inGlobStar state
	    var instead = gspref.concat(entries[i], remainWithoutGlobStar);
	    this._process(instead, index, true);

	    var below = gspref.concat(entries[i], remain);
	    this._process(below, index, true);
	  }
	};

	GlobSync.prototype._processSimple = function (prefix, index) {
	  // XXX review this.  Shouldn't it be doing the mounting etc
	  // before doing stat?  kinda weird?
	  var exists = this._stat(prefix);

	  if (!this.matches[index])
	    this.matches[index] = Object.create(null);

	  // If it doesn't exist, then just mark the lack of results
	  if (!exists)
	    return

	  if (prefix && pathIsAbsolute(prefix) && !this.nomount) {
	    var trail = /[\/\\]$/.test(prefix);
	    if (prefix.charAt(0) === '/') {
	      prefix = path$1.join(this.root, prefix);
	    } else {
	      prefix = path$1.resolve(this.root, prefix);
	      if (trail)
	        prefix += '/';
	    }
	  }

	  if (process.platform === 'win32')
	    prefix = prefix.replace(/\\/g, '/');

	  // Mark this as a match
	  this._emitMatch(index, prefix);
	};

	// Returns either 'DIR', 'FILE', or false
	GlobSync.prototype._stat = function (f) {
	  var abs = this._makeAbs(f);
	  var needDir = f.slice(-1) === '/';

	  if (f.length > this.maxLength)
	    return false

	  if (!this.stat && ownProp$1(this.cache, abs)) {
	    var c = this.cache[abs];

	    if (Array.isArray(c))
	      c = 'DIR';

	    // It exists, but maybe not how we need it
	    if (!needDir || c === 'DIR')
	      return c

	    if (needDir && c === 'FILE')
	      return false

	    // otherwise we have to stat, because maybe c=true
	    // if we know it exists, but not what it is.
	  }
	  var stat = this.statCache[abs];
	  if (!stat) {
	    var lstat;
	    try {
	      lstat = fs$1.lstatSync(abs);
	    } catch (er) {
	      if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
	        this.statCache[abs] = false;
	        return false
	      }
	    }

	    if (lstat && lstat.isSymbolicLink()) {
	      try {
	        stat = fs$1.statSync(abs);
	      } catch (er) {
	        stat = lstat;
	      }
	    } else {
	      stat = lstat;
	    }
	  }

	  this.statCache[abs] = stat;

	  var c = true;
	  if (stat)
	    c = stat.isDirectory() ? 'DIR' : 'FILE';

	  this.cache[abs] = this.cache[abs] || c;

	  if (needDir && c === 'FILE')
	    return false

	  return c
	};

	GlobSync.prototype._mark = function (p) {
	  return common.mark(this, p)
	};

	GlobSync.prototype._makeAbs = function (f) {
	  return common.makeAbs(this, f)
	};

	// Returns a wrapper function that returns a wrapped callback
	// The wrapper function should do some stuff, and return a
	// presumably different callback function.
	// This makes sure that own properties are retained, so that
	// decorations and such are not lost along the way.
	var wrappy_1 = wrappy;
	function wrappy (fn, cb) {
	  if (fn && cb) return wrappy(fn)(cb)

	  if (typeof fn !== 'function')
	    throw new TypeError('need wrapper function')

	  Object.keys(fn).forEach(function (k) {
	    wrapper[k] = fn[k];
	  });

	  return wrapper

	  function wrapper() {
	    var args = new Array(arguments.length);
	    for (var i = 0; i < args.length; i++) {
	      args[i] = arguments[i];
	    }
	    var ret = fn.apply(this, args);
	    var cb = args[args.length-1];
	    if (typeof ret === 'function' && ret !== cb) {
	      Object.keys(cb).forEach(function (k) {
	        ret[k] = cb[k];
	      });
	    }
	    return ret
	  }
	}

	var once_1 = wrappy_1(once);
	var strict = wrappy_1(onceStrict);

	once.proto = once(function () {
	  Object.defineProperty(Function.prototype, 'once', {
	    value: function () {
	      return once(this)
	    },
	    configurable: true
	  });

	  Object.defineProperty(Function.prototype, 'onceStrict', {
	    value: function () {
	      return onceStrict(this)
	    },
	    configurable: true
	  });
	});

	function once (fn) {
	  var f = function () {
	    if (f.called) return f.value
	    f.called = true;
	    return f.value = fn.apply(this, arguments)
	  };
	  f.called = false;
	  return f
	}

	function onceStrict (fn) {
	  var f = function () {
	    if (f.called)
	      throw new Error(f.onceError)
	    f.called = true;
	    return f.value = fn.apply(this, arguments)
	  };
	  var name = fn.name || 'Function wrapped with `once`';
	  f.onceError = name + " shouldn't be called more than once";
	  f.called = false;
	  return f
	}
	once_1.strict = strict;

	var reqs = Object.create(null);


	var inflight_1 = wrappy_1(inflight);

	function inflight (key, cb) {
	  if (reqs[key]) {
	    reqs[key].push(cb);
	    return null
	  } else {
	    reqs[key] = [cb];
	    return makeres(key)
	  }
	}

	function makeres (key) {
	  return once_1(function RES () {
	    var cbs = reqs[key];
	    var len = cbs.length;
	    var args = slice(arguments);

	    // XXX It's somewhat ambiguous whether a new callback added in this
	    // pass should be queued for later execution if something in the
	    // list of callbacks throws, or if it should just be discarded.
	    // However, it's such an edge case that it hardly matters, and either
	    // choice is likely as surprising as the other.
	    // As it happens, we do go ahead and schedule it for later execution.
	    try {
	      for (var i = 0; i < len; i++) {
	        cbs[i].apply(null, args);
	      }
	    } finally {
	      if (cbs.length > len) {
	        // added more in the interim.
	        // de-zalgo, just in case, but don't call again.
	        cbs.splice(0, len);
	        process.nextTick(function () {
	          RES.apply(null, args);
	        });
	      } else {
	        delete reqs[key];
	      }
	    }
	  })
	}

	function slice (args) {
	  var length = args.length;
	  var array = [];

	  for (var i = 0; i < length; i++) array[i] = args[i];
	  return array
	}

	// Approach:
	//
	// 1. Get the minimatch set
	// 2. For each pattern in the set, PROCESS(pattern, false)
	// 3. Store matches per-set, then uniq them
	//
	// PROCESS(pattern, inGlobStar)
	// Get the first [n] items from pattern that are all strings
	// Join these together.  This is PREFIX.
	//   If there is no more remaining, then stat(PREFIX) and
	//   add to matches if it succeeds.  END.
	//
	// If inGlobStar and PREFIX is symlink and points to dir
	//   set ENTRIES = []
	// else readdir(PREFIX) as ENTRIES
	//   If fail, END
	//
	// with ENTRIES
	//   If pattern[n] is GLOBSTAR
	//     // handle the case where the globstar match is empty
	//     // by pruning it out, and testing the resulting pattern
	//     PROCESS(pattern[0..n] + pattern[n+1 .. $], false)
	//     // handle other cases.
	//     for ENTRY in ENTRIES (not dotfiles)
	//       // attach globstar + tail onto the entry
	//       // Mark that this entry is a globstar match
	//       PROCESS(pattern[0..n] + ENTRY + pattern[n .. $], true)
	//
	//   else // not globstar
	//     for ENTRY in ENTRIES (not dotfiles, unless pattern[n] is dot)
	//       Test ENTRY against pattern[n]
	//       If fails, continue
	//       If passes, PROCESS(pattern[0..n] + item + pattern[n+1 .. $])
	//
	// Caveat:
	//   Cache all stats and readdirs results to minimize syscall.  Since all
	//   we ever care about is existence and directory-ness, we can just keep
	//   `true` for files, and [children,...] for directories, or `false` for
	//   things that don't exist.

	var glob_1 = glob;

	var EE = events.EventEmitter;
	var setopts$2 = common.setopts;
	var ownProp$2 = common.ownProp;


	var childrenIgnored$2 = common.childrenIgnored;
	var isIgnored$2 = common.isIgnored;



	function glob (pattern, options, cb) {
	  if (typeof options === 'function') cb = options, options = {};
	  if (!options) options = {};

	  if (options.sync) {
	    if (cb)
	      throw new TypeError('callback provided to sync glob')
	    return sync(pattern, options)
	  }

	  return new Glob(pattern, options, cb)
	}

	glob.sync = sync;
	var GlobSync$1 = glob.GlobSync = sync.GlobSync;

	// old api surface
	glob.glob = glob;

	function extend (origin, add) {
	  if (add === null || typeof add !== 'object') {
	    return origin
	  }

	  var keys = Object.keys(add);
	  var i = keys.length;
	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }
	  return origin
	}

	glob.hasMagic = function (pattern, options_) {
	  var options = extend({}, options_);
	  options.noprocess = true;

	  var g = new Glob(pattern, options);
	  var set = g.minimatch.set;

	  if (!pattern)
	    return false

	  if (set.length > 1)
	    return true

	  for (var j = 0; j < set[0].length; j++) {
	    if (typeof set[0][j] !== 'string')
	      return true
	  }

	  return false
	};

	glob.Glob = Glob;
	inherits(Glob, EE);
	function Glob (pattern, options, cb) {
	  if (typeof options === 'function') {
	    cb = options;
	    options = null;
	  }

	  if (options && options.sync) {
	    if (cb)
	      throw new TypeError('callback provided to sync glob')
	    return new GlobSync$1(pattern, options)
	  }

	  if (!(this instanceof Glob))
	    return new Glob(pattern, options, cb)

	  setopts$2(this, pattern, options);
	  this._didRealPath = false;

	  // process each pattern in the minimatch set
	  var n = this.minimatch.set.length;

	  // The matches are stored as {<filename>: true,...} so that
	  // duplicates are automagically pruned.
	  // Later, we do an Object.keys() on these.
	  // Keep them as a list so we can fill in when nonull is set.
	  this.matches = new Array(n);

	  if (typeof cb === 'function') {
	    cb = once_1(cb);
	    this.on('error', cb);
	    this.on('end', function (matches) {
	      cb(null, matches);
	    });
	  }

	  var self = this;
	  this._processing = 0;

	  this._emitQueue = [];
	  this._processQueue = [];
	  this.paused = false;

	  if (this.noprocess)
	    return this

	  if (n === 0)
	    return done()

	  var sync = true;
	  for (var i = 0; i < n; i ++) {
	    this._process(this.minimatch.set[i], i, false, done);
	  }
	  sync = false;

	  function done () {
	    --self._processing;
	    if (self._processing <= 0) {
	      if (sync) {
	        process.nextTick(function () {
	          self._finish();
	        });
	      } else {
	        self._finish();
	      }
	    }
	  }
	}

	Glob.prototype._finish = function () {
	  assert(this instanceof Glob);
	  if (this.aborted)
	    return

	  if (this.realpath && !this._didRealpath)
	    return this._realpath()

	  common.finish(this);
	  this.emit('end', this.found);
	};

	Glob.prototype._realpath = function () {
	  if (this._didRealpath)
	    return

	  this._didRealpath = true;

	  var n = this.matches.length;
	  if (n === 0)
	    return this._finish()

	  var self = this;
	  for (var i = 0; i < this.matches.length; i++)
	    this._realpathSet(i, next);

	  function next () {
	    if (--n === 0)
	      self._finish();
	  }
	};

	Glob.prototype._realpathSet = function (index, cb) {
	  var matchset = this.matches[index];
	  if (!matchset)
	    return cb()

	  var found = Object.keys(matchset);
	  var self = this;
	  var n = found.length;

	  if (n === 0)
	    return cb()

	  var set = this.matches[index] = Object.create(null);
	  found.forEach(function (p, i) {
	    // If there's a problem with the stat, then it means that
	    // one or more of the links in the realpath couldn't be
	    // resolved.  just return the abs value in that case.
	    p = self._makeAbs(p);
	    fs_realpath.realpath(p, self.realpathCache, function (er, real) {
	      if (!er)
	        set[real] = true;
	      else if (er.syscall === 'stat')
	        set[p] = true;
	      else
	        self.emit('error', er); // srsly wtf right here

	      if (--n === 0) {
	        self.matches[index] = set;
	        cb();
	      }
	    });
	  });
	};

	Glob.prototype._mark = function (p) {
	  return common.mark(this, p)
	};

	Glob.prototype._makeAbs = function (f) {
	  return common.makeAbs(this, f)
	};

	Glob.prototype.abort = function () {
	  this.aborted = true;
	  this.emit('abort');
	};

	Glob.prototype.pause = function () {
	  if (!this.paused) {
	    this.paused = true;
	    this.emit('pause');
	  }
	};

	Glob.prototype.resume = function () {
	  if (this.paused) {
	    this.emit('resume');
	    this.paused = false;
	    if (this._emitQueue.length) {
	      var eq = this._emitQueue.slice(0);
	      this._emitQueue.length = 0;
	      for (var i = 0; i < eq.length; i ++) {
	        var e = eq[i];
	        this._emitMatch(e[0], e[1]);
	      }
	    }
	    if (this._processQueue.length) {
	      var pq = this._processQueue.slice(0);
	      this._processQueue.length = 0;
	      for (var i = 0; i < pq.length; i ++) {
	        var p = pq[i];
	        this._processing--;
	        this._process(p[0], p[1], p[2], p[3]);
	      }
	    }
	  }
	};

	Glob.prototype._process = function (pattern, index, inGlobStar, cb) {
	  assert(this instanceof Glob);
	  assert(typeof cb === 'function');

	  if (this.aborted)
	    return

	  this._processing++;
	  if (this.paused) {
	    this._processQueue.push([pattern, index, inGlobStar, cb]);
	    return
	  }

	  //console.error('PROCESS %d', this._processing, pattern)

	  // Get the first [n] parts of pattern that are all strings.
	  var n = 0;
	  while (typeof pattern[n] === 'string') {
	    n ++;
	  }
	  // now n is the index of the first one that is *not* a string.

	  // see if there's anything else
	  var prefix;
	  switch (n) {
	    // if not, then this is rather simple
	    case pattern.length:
	      this._processSimple(pattern.join('/'), index, cb);
	      return

	    case 0:
	      // pattern *starts* with some non-trivial item.
	      // going to readdir(cwd), but not include the prefix in matches.
	      prefix = null;
	      break

	    default:
	      // pattern has some string bits in the front.
	      // whatever it starts with, whether that's 'absolute' like /foo/bar,
	      // or 'relative' like '../baz'
	      prefix = pattern.slice(0, n).join('/');
	      break
	  }

	  var remain = pattern.slice(n);

	  // get the list of entries.
	  var read;
	  if (prefix === null)
	    read = '.';
	  else if (pathIsAbsolute(prefix) || pathIsAbsolute(pattern.join('/'))) {
	    if (!prefix || !pathIsAbsolute(prefix))
	      prefix = '/' + prefix;
	    read = prefix;
	  } else
	    read = prefix;

	  var abs = this._makeAbs(read);

	  //if ignored, skip _processing
	  if (childrenIgnored$2(this, read))
	    return cb()

	  var isGlobStar = remain[0] === minimatch_1.GLOBSTAR;
	  if (isGlobStar)
	    this._processGlobStar(prefix, read, abs, remain, index, inGlobStar, cb);
	  else
	    this._processReaddir(prefix, read, abs, remain, index, inGlobStar, cb);
	};

	Glob.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar, cb) {
	  var self = this;
	  this._readdir(abs, inGlobStar, function (er, entries) {
	    return self._processReaddir2(prefix, read, abs, remain, index, inGlobStar, entries, cb)
	  });
	};

	Glob.prototype._processReaddir2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {

	  // if the abs isn't a dir, then nothing can match!
	  if (!entries)
	    return cb()

	  // It will only match dot entries if it starts with a dot, or if
	  // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
	  var pn = remain[0];
	  var negate = !!this.minimatch.negate;
	  var rawGlob = pn._glob;
	  var dotOk = this.dot || rawGlob.charAt(0) === '.';

	  var matchedEntries = [];
	  for (var i = 0; i < entries.length; i++) {
	    var e = entries[i];
	    if (e.charAt(0) !== '.' || dotOk) {
	      var m;
	      if (negate && !prefix) {
	        m = !e.match(pn);
	      } else {
	        m = e.match(pn);
	      }
	      if (m)
	        matchedEntries.push(e);
	    }
	  }

	  //console.error('prd2', prefix, entries, remain[0]._glob, matchedEntries)

	  var len = matchedEntries.length;
	  // If there are no matched entries, then nothing matches.
	  if (len === 0)
	    return cb()

	  // if this is the last remaining pattern bit, then no need for
	  // an additional stat *unless* the user has specified mark or
	  // stat explicitly.  We know they exist, since readdir returned
	  // them.

	  if (remain.length === 1 && !this.mark && !this.stat) {
	    if (!this.matches[index])
	      this.matches[index] = Object.create(null);

	    for (var i = 0; i < len; i ++) {
	      var e = matchedEntries[i];
	      if (prefix) {
	        if (prefix !== '/')
	          e = prefix + '/' + e;
	        else
	          e = prefix + e;
	      }

	      if (e.charAt(0) === '/' && !this.nomount) {
	        e = path$1.join(this.root, e);
	      }
	      this._emitMatch(index, e);
	    }
	    // This was the last one, and no stats were needed
	    return cb()
	  }

	  // now test all matched entries as stand-ins for that part
	  // of the pattern.
	  remain.shift();
	  for (var i = 0; i < len; i ++) {
	    var e = matchedEntries[i];
	    if (prefix) {
	      if (prefix !== '/')
	        e = prefix + '/' + e;
	      else
	        e = prefix + e;
	    }
	    this._process([e].concat(remain), index, inGlobStar, cb);
	  }
	  cb();
	};

	Glob.prototype._emitMatch = function (index, e) {
	  if (this.aborted)
	    return

	  if (isIgnored$2(this, e))
	    return

	  if (this.paused) {
	    this._emitQueue.push([index, e]);
	    return
	  }

	  var abs = pathIsAbsolute(e) ? e : this._makeAbs(e);

	  if (this.mark)
	    e = this._mark(e);

	  if (this.absolute)
	    e = abs;

	  if (this.matches[index][e])
	    return

	  if (this.nodir) {
	    var c = this.cache[abs];
	    if (c === 'DIR' || Array.isArray(c))
	      return
	  }

	  this.matches[index][e] = true;

	  var st = this.statCache[abs];
	  if (st)
	    this.emit('stat', e, st);

	  this.emit('match', e);
	};

	Glob.prototype._readdirInGlobStar = function (abs, cb) {
	  if (this.aborted)
	    return

	  // follow all symlinked directories forever
	  // just proceed as if this is a non-globstar situation
	  if (this.follow)
	    return this._readdir(abs, false, cb)

	  var lstatkey = 'lstat\0' + abs;
	  var self = this;
	  var lstatcb = inflight_1(lstatkey, lstatcb_);

	  if (lstatcb)
	    fs$1.lstat(abs, lstatcb);

	  function lstatcb_ (er, lstat) {
	    if (er && er.code === 'ENOENT')
	      return cb()

	    var isSym = lstat && lstat.isSymbolicLink();
	    self.symlinks[abs] = isSym;

	    // If it's not a symlink or a dir, then it's definitely a regular file.
	    // don't bother doing a readdir in that case.
	    if (!isSym && lstat && !lstat.isDirectory()) {
	      self.cache[abs] = 'FILE';
	      cb();
	    } else
	      self._readdir(abs, false, cb);
	  }
	};

	Glob.prototype._readdir = function (abs, inGlobStar, cb) {
	  if (this.aborted)
	    return

	  cb = inflight_1('readdir\0'+abs+'\0'+inGlobStar, cb);
	  if (!cb)
	    return

	  //console.error('RD %j %j', +inGlobStar, abs)
	  if (inGlobStar && !ownProp$2(this.symlinks, abs))
	    return this._readdirInGlobStar(abs, cb)

	  if (ownProp$2(this.cache, abs)) {
	    var c = this.cache[abs];
	    if (!c || c === 'FILE')
	      return cb()

	    if (Array.isArray(c))
	      return cb(null, c)
	  }
	  fs$1.readdir(abs, readdirCb(this, abs, cb));
	};

	function readdirCb (self, abs, cb) {
	  return function (er, entries) {
	    if (er)
	      self._readdirError(abs, er, cb);
	    else
	      self._readdirEntries(abs, entries, cb);
	  }
	}

	Glob.prototype._readdirEntries = function (abs, entries, cb) {
	  if (this.aborted)
	    return

	  // if we haven't asked to stat everything, then just
	  // assume that everything in there exists, so we can avoid
	  // having to stat it a second time.
	  if (!this.mark && !this.stat) {
	    for (var i = 0; i < entries.length; i ++) {
	      var e = entries[i];
	      if (abs === '/')
	        e = abs + e;
	      else
	        e = abs + '/' + e;
	      this.cache[e] = true;
	    }
	  }

	  this.cache[abs] = entries;
	  return cb(null, entries)
	};

	Glob.prototype._readdirError = function (f, er, cb) {
	  if (this.aborted)
	    return

	  // handle errors, and cache the information
	  switch (er.code) {
	    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
	    case 'ENOTDIR': // totally normal. means it *does* exist.
	      var abs = this._makeAbs(f);
	      this.cache[abs] = 'FILE';
	      if (abs === this.cwdAbs) {
	        var error = new Error(er.code + ' invalid cwd ' + this.cwd);
	        error.path = this.cwd;
	        error.code = er.code;
	        this.emit('error', error);
	        this.abort();
	      }
	      break

	    case 'ENOENT': // not terribly unusual
	    case 'ELOOP':
	    case 'ENAMETOOLONG':
	    case 'UNKNOWN':
	      this.cache[this._makeAbs(f)] = false;
	      break

	    default: // some unusual error.  Treat as failure.
	      this.cache[this._makeAbs(f)] = false;
	      if (this.strict) {
	        this.emit('error', er);
	        // If the error is handled, then we abort
	        // if not, we threw out of here
	        this.abort();
	      }
	      if (!this.silent)
	        console.error('glob error', er);
	      break
	  }

	  return cb()
	};

	Glob.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar, cb) {
	  var self = this;
	  this._readdir(abs, inGlobStar, function (er, entries) {
	    self._processGlobStar2(prefix, read, abs, remain, index, inGlobStar, entries, cb);
	  });
	};


	Glob.prototype._processGlobStar2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {
	  //console.error('pgs2', prefix, remain[0], entries)

	  // no entries means not a dir, so it can never have matches
	  // foo.txt/** doesn't match foo.txt
	  if (!entries)
	    return cb()

	  // test without the globstar, and with every child both below
	  // and replacing the globstar.
	  var remainWithoutGlobStar = remain.slice(1);
	  var gspref = prefix ? [ prefix ] : [];
	  var noGlobStar = gspref.concat(remainWithoutGlobStar);

	  // the noGlobStar pattern exits the inGlobStar state
	  this._process(noGlobStar, index, false, cb);

	  var isSym = this.symlinks[abs];
	  var len = entries.length;

	  // If it's a symlink, and we're in a globstar, then stop
	  if (isSym && inGlobStar)
	    return cb()

	  for (var i = 0; i < len; i++) {
	    var e = entries[i];
	    if (e.charAt(0) === '.' && !this.dot)
	      continue

	    // these two cases enter the inGlobStar state
	    var instead = gspref.concat(entries[i], remainWithoutGlobStar);
	    this._process(instead, index, true, cb);

	    var below = gspref.concat(entries[i], remain);
	    this._process(below, index, true, cb);
	  }

	  cb();
	};

	Glob.prototype._processSimple = function (prefix, index, cb) {
	  // XXX review this.  Shouldn't it be doing the mounting etc
	  // before doing stat?  kinda weird?
	  var self = this;
	  this._stat(prefix, function (er, exists) {
	    self._processSimple2(prefix, index, er, exists, cb);
	  });
	};
	Glob.prototype._processSimple2 = function (prefix, index, er, exists, cb) {

	  //console.error('ps2', prefix, exists)

	  if (!this.matches[index])
	    this.matches[index] = Object.create(null);

	  // If it doesn't exist, then just mark the lack of results
	  if (!exists)
	    return cb()

	  if (prefix && pathIsAbsolute(prefix) && !this.nomount) {
	    var trail = /[\/\\]$/.test(prefix);
	    if (prefix.charAt(0) === '/') {
	      prefix = path$1.join(this.root, prefix);
	    } else {
	      prefix = path$1.resolve(this.root, prefix);
	      if (trail)
	        prefix += '/';
	    }
	  }

	  if (process.platform === 'win32')
	    prefix = prefix.replace(/\\/g, '/');

	  // Mark this as a match
	  this._emitMatch(index, prefix);
	  cb();
	};

	// Returns either 'DIR', 'FILE', or false
	Glob.prototype._stat = function (f, cb) {
	  var abs = this._makeAbs(f);
	  var needDir = f.slice(-1) === '/';

	  if (f.length > this.maxLength)
	    return cb()

	  if (!this.stat && ownProp$2(this.cache, abs)) {
	    var c = this.cache[abs];

	    if (Array.isArray(c))
	      c = 'DIR';

	    // It exists, but maybe not how we need it
	    if (!needDir || c === 'DIR')
	      return cb(null, c)

	    if (needDir && c === 'FILE')
	      return cb()

	    // otherwise we have to stat, because maybe c=true
	    // if we know it exists, but not what it is.
	  }
	  var stat = this.statCache[abs];
	  if (stat !== undefined) {
	    if (stat === false)
	      return cb(null, stat)
	    else {
	      var type = stat.isDirectory() ? 'DIR' : 'FILE';
	      if (needDir && type === 'FILE')
	        return cb()
	      else
	        return cb(null, type, stat)
	    }
	  }

	  var self = this;
	  var statcb = inflight_1('stat\0' + abs, lstatcb_);
	  if (statcb)
	    fs$1.lstat(abs, statcb);

	  function lstatcb_ (er, lstat) {
	    if (lstat && lstat.isSymbolicLink()) {
	      // If it's a symlink, then treat it as the target, unless
	      // the target does not exist, then treat it as a file.
	      return fs$1.stat(abs, function (er, stat) {
	        if (er)
	          self._stat2(f, abs, null, lstat, cb);
	        else
	          self._stat2(f, abs, er, stat, cb);
	      })
	    } else {
	      self._stat2(f, abs, er, lstat, cb);
	    }
	  }
	};

	Glob.prototype._stat2 = function (f, abs, er, stat, cb) {
	  if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
	    this.statCache[abs] = false;
	    return cb()
	  }

	  var needDir = f.slice(-1) === '/';
	  this.statCache[abs] = stat;

	  if (abs.slice(-1) === '/' && stat && !stat.isDirectory())
	    return cb(null, false, stat)

	  var c = true;
	  if (stat)
	    c = stat.isDirectory() ? 'DIR' : 'FILE';
	  this.cache[abs] = this.cache[abs] || c;

	  if (needDir && c === 'FILE')
	    return cb()

	  return cb(null, c, stat)
	};

	var rimraf_1 = rimraf;
	rimraf.sync = rimrafSync;





	var _0666 = parseInt('666', 8);

	var defaultGlobOpts = {
	  nosort: true,
	  silent: true
	};

	// for EMFILE handling
	var timeout = 0;

	var isWindows$1 = (process.platform === "win32");

	function defaults (options) {
	  var methods = [
	    'unlink',
	    'chmod',
	    'stat',
	    'lstat',
	    'rmdir',
	    'readdir'
	  ];
	  methods.forEach(function(m) {
	    options[m] = options[m] || fs$1[m];
	    m = m + 'Sync';
	    options[m] = options[m] || fs$1[m];
	  });

	  options.maxBusyTries = options.maxBusyTries || 3;
	  options.emfileWait = options.emfileWait || 1000;
	  if (options.glob === false) {
	    options.disableGlob = true;
	  }
	  options.disableGlob = options.disableGlob || false;
	  options.glob = options.glob || defaultGlobOpts;
	}

	function rimraf (p, options, cb) {
	  if (typeof options === 'function') {
	    cb = options;
	    options = {};
	  }

	  assert(p, 'rimraf: missing path');
	  assert.equal(typeof p, 'string', 'rimraf: path should be a string');
	  assert.equal(typeof cb, 'function', 'rimraf: callback function required');
	  assert(options, 'rimraf: invalid options argument provided');
	  assert.equal(typeof options, 'object', 'rimraf: options should be object');

	  defaults(options);

	  var busyTries = 0;
	  var errState = null;
	  var n = 0;

	  if (options.disableGlob || !glob_1.hasMagic(p))
	    return afterGlob(null, [p])

	  options.lstat(p, function (er, stat) {
	    if (!er)
	      return afterGlob(null, [p])

	    glob_1(p, options.glob, afterGlob);
	  });

	  function next (er) {
	    errState = errState || er;
	    if (--n === 0)
	      cb(errState);
	  }

	  function afterGlob (er, results) {
	    if (er)
	      return cb(er)

	    n = results.length;
	    if (n === 0)
	      return cb()

	    results.forEach(function (p) {
	      rimraf_(p, options, function CB (er) {
	        if (er) {
	          if ((er.code === "EBUSY" || er.code === "ENOTEMPTY" || er.code === "EPERM") &&
	              busyTries < options.maxBusyTries) {
	            busyTries ++;
	            var time = busyTries * 100;
	            // try again, with the same exact callback as this one.
	            return setTimeout(function () {
	              rimraf_(p, options, CB);
	            }, time)
	          }

	          // this one won't happen if graceful-fs is used.
	          if (er.code === "EMFILE" && timeout < options.emfileWait) {
	            return setTimeout(function () {
	              rimraf_(p, options, CB);
	            }, timeout ++)
	          }

	          // already gone
	          if (er.code === "ENOENT") er = null;
	        }

	        timeout = 0;
	        next(er);
	      });
	    });
	  }
	}

	// Two possible strategies.
	// 1. Assume it's a file.  unlink it, then do the dir stuff on EPERM or EISDIR
	// 2. Assume it's a directory.  readdir, then do the file stuff on ENOTDIR
	//
	// Both result in an extra syscall when you guess wrong.  However, there
	// are likely far more normal files in the world than directories.  This
	// is based on the assumption that a the average number of files per
	// directory is >= 1.
	//
	// If anyone ever complains about this, then I guess the strategy could
	// be made configurable somehow.  But until then, YAGNI.
	function rimraf_ (p, options, cb) {
	  assert(p);
	  assert(options);
	  assert(typeof cb === 'function');

	  // sunos lets the root user unlink directories, which is... weird.
	  // so we have to lstat here and make sure it's not a dir.
	  options.lstat(p, function (er, st) {
	    if (er && er.code === "ENOENT")
	      return cb(null)

	    // Windows can EPERM on stat.  Life is suffering.
	    if (er && er.code === "EPERM" && isWindows$1)
	      fixWinEPERM(p, options, er, cb);

	    if (st && st.isDirectory())
	      return rmdir(p, options, er, cb)

	    options.unlink(p, function (er) {
	      if (er) {
	        if (er.code === "ENOENT")
	          return cb(null)
	        if (er.code === "EPERM")
	          return (isWindows$1)
	            ? fixWinEPERM(p, options, er, cb)
	            : rmdir(p, options, er, cb)
	        if (er.code === "EISDIR")
	          return rmdir(p, options, er, cb)
	      }
	      return cb(er)
	    });
	  });
	}

	function fixWinEPERM (p, options, er, cb) {
	  assert(p);
	  assert(options);
	  assert(typeof cb === 'function');
	  if (er)
	    assert(er instanceof Error);

	  options.chmod(p, _0666, function (er2) {
	    if (er2)
	      cb(er2.code === "ENOENT" ? null : er);
	    else
	      options.stat(p, function(er3, stats) {
	        if (er3)
	          cb(er3.code === "ENOENT" ? null : er);
	        else if (stats.isDirectory())
	          rmdir(p, options, er, cb);
	        else
	          options.unlink(p, cb);
	      });
	  });
	}

	function fixWinEPERMSync (p, options, er) {
	  assert(p);
	  assert(options);
	  if (er)
	    assert(er instanceof Error);

	  try {
	    options.chmodSync(p, _0666);
	  } catch (er2) {
	    if (er2.code === "ENOENT")
	      return
	    else
	      throw er
	  }

	  try {
	    var stats = options.statSync(p);
	  } catch (er3) {
	    if (er3.code === "ENOENT")
	      return
	    else
	      throw er
	  }

	  if (stats.isDirectory())
	    rmdirSync(p, options, er);
	  else
	    options.unlinkSync(p);
	}

	function rmdir (p, options, originalEr, cb) {
	  assert(p);
	  assert(options);
	  if (originalEr)
	    assert(originalEr instanceof Error);
	  assert(typeof cb === 'function');

	  // try to rmdir first, and only readdir on ENOTEMPTY or EEXIST (SunOS)
	  // if we guessed wrong, and it's not a directory, then
	  // raise the original error.
	  options.rmdir(p, function (er) {
	    if (er && (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM"))
	      rmkids(p, options, cb);
	    else if (er && er.code === "ENOTDIR")
	      cb(originalEr);
	    else
	      cb(er);
	  });
	}

	function rmkids(p, options, cb) {
	  assert(p);
	  assert(options);
	  assert(typeof cb === 'function');

	  options.readdir(p, function (er, files) {
	    if (er)
	      return cb(er)
	    var n = files.length;
	    if (n === 0)
	      return options.rmdir(p, cb)
	    var errState;
	    files.forEach(function (f) {
	      rimraf(path$1.join(p, f), options, function (er) {
	        if (errState)
	          return
	        if (er)
	          return cb(errState = er)
	        if (--n === 0)
	          options.rmdir(p, cb);
	      });
	    });
	  });
	}

	// this looks simpler, and is strictly *faster*, but will
	// tie up the JavaScript thread and fail on excessively
	// deep directory trees.
	function rimrafSync (p, options) {
	  options = options || {};
	  defaults(options);

	  assert(p, 'rimraf: missing path');
	  assert.equal(typeof p, 'string', 'rimraf: path should be a string');
	  assert(options, 'rimraf: missing options');
	  assert.equal(typeof options, 'object', 'rimraf: options should be object');

	  var results;

	  if (options.disableGlob || !glob_1.hasMagic(p)) {
	    results = [p];
	  } else {
	    try {
	      options.lstatSync(p);
	      results = [p];
	    } catch (er) {
	      results = glob_1.sync(p, options.glob);
	    }
	  }

	  if (!results.length)
	    return

	  for (var i = 0; i < results.length; i++) {
	    var p = results[i];

	    try {
	      var st = options.lstatSync(p);
	    } catch (er) {
	      if (er.code === "ENOENT")
	        return

	      // Windows can EPERM on stat.  Life is suffering.
	      if (er.code === "EPERM" && isWindows$1)
	        fixWinEPERMSync(p, options, er);
	    }

	    try {
	      // sunos lets the root user unlink directories, which is... weird.
	      if (st && st.isDirectory())
	        rmdirSync(p, options, null);
	      else
	        options.unlinkSync(p);
	    } catch (er) {
	      if (er.code === "ENOENT")
	        return
	      if (er.code === "EPERM")
	        return isWindows$1 ? fixWinEPERMSync(p, options, er) : rmdirSync(p, options, er)
	      if (er.code !== "EISDIR")
	        throw er

	      rmdirSync(p, options, er);
	    }
	  }
	}

	function rmdirSync (p, options, originalEr) {
	  assert(p);
	  assert(options);
	  if (originalEr)
	    assert(originalEr instanceof Error);

	  try {
	    options.rmdirSync(p);
	  } catch (er) {
	    if (er.code === "ENOENT")
	      return
	    if (er.code === "ENOTDIR")
	      throw originalEr
	    if (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM")
	      rmkidsSync(p, options);
	  }
	}

	function rmkidsSync (p, options) {
	  assert(p);
	  assert(options);
	  options.readdirSync(p).forEach(function (f) {
	    rimrafSync(path$1.join(p, f), options);
	  });

	  // We only end up here once we got ENOTEMPTY at least once, and
	  // at this point, we are guaranteed to have removed all the kids.
	  // So, we know that it won't be ENOENT or ENOTDIR or anything else.
	  // try really hard to delete stuff on windows, because it has a
	  // PROFOUNDLY annoying habit of not closing handles promptly when
	  // files are deleted, resulting in spurious ENOTEMPTY errors.
	  var retries = isWindows$1 ? 100 : 1;
	  var i = 0;
	  do {
	    var threw = true;
	    try {
	      var ret = options.rmdirSync(p, options);
	      threw = false;
	      return ret
	    } finally {
	      if (++i < retries && threw)
	        continue
	    }
	  } while (true)
	}

	var tmp = createCommonjsModule(function (module) {
	/*!
	 * Tmp
	 *
	 * Copyright (c) 2011-2017 KARASZI Istvan <github@spam.raszi.hu>
	 *
	 * MIT Licensed
	 */

	/*
	 * Module dependencies.
	 */




	const _c = fs$1.constants && os.constants ?
	  { fs: fs$1.constants, os: os.constants } :
	  process.binding('constants');


	/*
	 * The working inner variables.
	 */
	const
	  // the random characters to choose from
	  RANDOM_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',

	  TEMPLATE_PATTERN = /XXXXXX/,

	  DEFAULT_TRIES = 3,

	  CREATE_FLAGS = (_c.O_CREAT || _c.fs.O_CREAT) | (_c.O_EXCL || _c.fs.O_EXCL) | (_c.O_RDWR || _c.fs.O_RDWR),

	  EBADF = _c.EBADF || _c.os.errno.EBADF,
	  ENOENT = _c.ENOENT || _c.os.errno.ENOENT,

	  DIR_MODE = 448 /* 0o700 */,
	  FILE_MODE = 384 /* 0o600 */,

	  EXIT = 'exit',

	  SIGINT = 'SIGINT',

	  // this will hold the objects need to be removed on exit
	  _removeObjects = [];

	var
	  _gracefulCleanup = false;

	/**
	 * Random name generator based on crypto.
	 * Adapted from http://blog.tompawlak.org/how-to-generate-random-values-nodejs-javascript
	 *
	 * @param {number} howMany
	 * @returns {string} the generated random name
	 * @private
	 */
	function _randomChars(howMany) {
	  var
	    value = [],
	    rnd = null;

	  // make sure that we do not fail because we ran out of entropy
	  try {
	    rnd = crypto.randomBytes(howMany);
	  } catch (e) {
	    rnd = crypto.pseudoRandomBytes(howMany);
	  }

	  for (var i = 0; i < howMany; i++) {
	    value.push(RANDOM_CHARS[rnd[i] % RANDOM_CHARS.length]);
	  }

	  return value.join('');
	}

	/**
	 * Checks whether the `obj` parameter is defined or not.
	 *
	 * @param {Object} obj
	 * @returns {boolean} true if the object is undefined
	 * @private
	 */
	function _isUndefined(obj) {
	  return typeof obj === 'undefined';
	}

	/**
	 * Parses the function arguments.
	 *
	 * This function helps to have optional arguments.
	 *
	 * @param {(Options|Function)} options
	 * @param {Function} callback
	 * @returns {Array} parsed arguments
	 * @private
	 */
	function _parseArguments(options, callback) {
	  /* istanbul ignore else */
	  if (typeof options === 'function') {
	    return [{}, options];
	  }

	  /* istanbul ignore else */
	  if (_isUndefined(options)) {
	    return [{}, callback];
	  }

	  return [options, callback];
	}

	/**
	 * Generates a new temporary name.
	 *
	 * @param {Object} opts
	 * @returns {string} the new random name according to opts
	 * @private
	 */
	function _generateTmpName(opts) {

	  const tmpDir = _getTmpDir();

	  // fail early on missing tmp dir
	  if (isBlank(opts.dir) && isBlank(tmpDir)) {
	    throw new Error('No tmp dir specified');
	  }

	  /* istanbul ignore else */
	  if (!isBlank(opts.name)) {
	    return path$1.join(opts.dir || tmpDir, opts.name);
	  }

	  // mkstemps like template
	  // opts.template has already been guarded in tmpName() below
	  /* istanbul ignore else */
	  if (opts.template) {
	    var template = opts.template;
	    // make sure that we prepend the tmp path if none was given
	    /* istanbul ignore else */
	    if (path$1.basename(template) === template)
	      template = path$1.join(opts.dir || tmpDir, template);
	    return template.replace(TEMPLATE_PATTERN, _randomChars(6));
	  }

	  // prefix and postfix
	  const name = [
	    (isBlank(opts.prefix) ? 'tmp-' : opts.prefix),
	    process.pid,
	    _randomChars(12),
	    (opts.postfix ? opts.postfix : '')
	  ].join('');

	  return path$1.join(opts.dir || tmpDir, name);
	}

	/**
	 * Gets a temporary file name.
	 *
	 * @param {(Options|tmpNameCallback)} options options or callback
	 * @param {?tmpNameCallback} callback the callback function
	 */
	function tmpName(options, callback) {
	  var
	    args = _parseArguments(options, callback),
	    opts = args[0],
	    cb = args[1],
	    tries = !isBlank(opts.name) ? 1 : opts.tries || DEFAULT_TRIES;

	  /* istanbul ignore else */
	  if (isNaN(tries) || tries < 0)
	    return cb(new Error('Invalid tries'));

	  /* istanbul ignore else */
	  if (opts.template && !opts.template.match(TEMPLATE_PATTERN))
	    return cb(new Error('Invalid template provided'));

	  (function _getUniqueName() {
	    try {
	      const name = _generateTmpName(opts);

	      // check whether the path exists then retry if needed
	      fs$1.stat(name, function (err) {
	        /* istanbul ignore else */
	        if (!err) {
	          /* istanbul ignore else */
	          if (tries-- > 0) return _getUniqueName();

	          return cb(new Error('Could not get a unique tmp filename, max tries reached ' + name));
	        }

	        cb(null, name);
	      });
	    } catch (err) {
	      cb(err);
	    }
	  }());
	}

	/**
	 * Synchronous version of tmpName.
	 *
	 * @param {Object} options
	 * @returns {string} the generated random name
	 * @throws {Error} if the options are invalid or could not generate a filename
	 */
	function tmpNameSync(options) {
	  var
	    args = _parseArguments(options),
	    opts = args[0],
	    tries = !isBlank(opts.name) ? 1 : opts.tries || DEFAULT_TRIES;

	  /* istanbul ignore else */
	  if (isNaN(tries) || tries < 0)
	    throw new Error('Invalid tries');

	  /* istanbul ignore else */
	  if (opts.template && !opts.template.match(TEMPLATE_PATTERN))
	    throw new Error('Invalid template provided');

	  do {
	    const name = _generateTmpName(opts);
	    try {
	      fs$1.statSync(name);
	    } catch (e) {
	      return name;
	    }
	  } while (tries-- > 0);

	  throw new Error('Could not get a unique tmp filename, max tries reached');
	}

	/**
	 * Creates and opens a temporary file.
	 *
	 * @param {(Options|fileCallback)} options the config options or the callback function
	 * @param {?fileCallback} callback
	 */
	function file(options, callback) {
	  var
	    args = _parseArguments(options, callback),
	    opts = args[0],
	    cb = args[1];

	  // gets a temporary filename
	  tmpName(opts, function _tmpNameCreated(err, name) {
	    /* istanbul ignore else */
	    if (err) return cb(err);

	    // create and open the file
	    fs$1.open(name, CREATE_FLAGS, opts.mode || FILE_MODE, function _fileCreated(err, fd) {
	      /* istanbul ignore else */
	      if (err) return cb(err);

	      if (opts.discardDescriptor) {
	        return fs$1.close(fd, function _discardCallback(err) {
	          /* istanbul ignore else */
	          if (err) {
	            // Low probability, and the file exists, so this could be
	            // ignored.  If it isn't we certainly need to unlink the
	            // file, and if that fails too its error is more
	            // important.
	            try {
	              fs$1.unlinkSync(name);
	            } catch (e) {
	              if (!isENOENT(e)) {
	                err = e;
	              }
	            }
	            return cb(err);
	          }
	          cb(null, name, undefined, _prepareTmpFileRemoveCallback(name, -1, opts));
	        });
	      }
	      /* istanbul ignore else */
	      if (opts.detachDescriptor) {
	        return cb(null, name, fd, _prepareTmpFileRemoveCallback(name, -1, opts));
	      }
	      cb(null, name, fd, _prepareTmpFileRemoveCallback(name, fd, opts));
	    });
	  });
	}

	/**
	 * Synchronous version of file.
	 *
	 * @param {Options} options
	 * @returns {FileSyncObject} object consists of name, fd and removeCallback
	 * @throws {Error} if cannot create a file
	 */
	function fileSync(options) {
	  var
	    args = _parseArguments(options),
	    opts = args[0];

	  const discardOrDetachDescriptor = opts.discardDescriptor || opts.detachDescriptor;
	  const name = tmpNameSync(opts);
	  var fd = fs$1.openSync(name, CREATE_FLAGS, opts.mode || FILE_MODE);
	  /* istanbul ignore else */
	  if (opts.discardDescriptor) {
	    fs$1.closeSync(fd);
	    fd = undefined;
	  }

	  return {
	    name: name,
	    fd: fd,
	    removeCallback: _prepareTmpFileRemoveCallback(name, discardOrDetachDescriptor ? -1 : fd, opts)
	  };
	}

	/**
	 * Creates a temporary directory.
	 *
	 * @param {(Options|dirCallback)} options the options or the callback function
	 * @param {?dirCallback} callback
	 */
	function dir(options, callback) {
	  var
	    args = _parseArguments(options, callback),
	    opts = args[0],
	    cb = args[1];

	  // gets a temporary filename
	  tmpName(opts, function _tmpNameCreated(err, name) {
	    /* istanbul ignore else */
	    if (err) return cb(err);

	    // create the directory
	    fs$1.mkdir(name, opts.mode || DIR_MODE, function _dirCreated(err) {
	      /* istanbul ignore else */
	      if (err) return cb(err);

	      cb(null, name, _prepareTmpDirRemoveCallback(name, opts));
	    });
	  });
	}

	/**
	 * Synchronous version of dir.
	 *
	 * @param {Options} options
	 * @returns {DirSyncObject} object consists of name and removeCallback
	 * @throws {Error} if it cannot create a directory
	 */
	function dirSync(options) {
	  var
	    args = _parseArguments(options),
	    opts = args[0];

	  const name = tmpNameSync(opts);
	  fs$1.mkdirSync(name, opts.mode || DIR_MODE);

	  return {
	    name: name,
	    removeCallback: _prepareTmpDirRemoveCallback(name, opts)
	  };
	}

	/**
	 * Removes files asynchronously.
	 *
	 * @param {Object} fdPath
	 * @param {Function} next
	 * @private
	 */
	function _removeFileAsync(fdPath, next) {
	  const _handler = function (err) {
	    if (err && !isENOENT(err)) {
	      // reraise any unanticipated error
	      return next(err);
	    }
	    next();
	  };

	  if (0 <= fdPath[0])
	    fs$1.close(fdPath[0], function (err) {
	      fs$1.unlink(fdPath[1], _handler);
	    });
	  else fs$1.unlink(fdPath[1], _handler);
	}

	/**
	 * Removes files synchronously.
	 *
	 * @param {Object} fdPath
	 * @private
	 */
	function _removeFileSync(fdPath) {
	  try {
	    if (0 <= fdPath[0]) fs$1.closeSync(fdPath[0]);
	  } catch (e) {
	    // reraise any unanticipated error
	    if (!isEBADF(e) && !isENOENT(e)) throw e;
	  } finally {
	    try {
	      fs$1.unlinkSync(fdPath[1]);
	    }
	    catch (e) {
	      // reraise any unanticipated error
	      if (!isENOENT(e)) throw e;
	    }
	  }
	}

	/**
	 * Prepares the callback for removal of the temporary file.
	 *
	 * @param {string} name the path of the file
	 * @param {number} fd file descriptor
	 * @param {Object} opts
	 * @returns {fileCallback}
	 * @private
	 */
	function _prepareTmpFileRemoveCallback(name, fd, opts) {
	  const removeCallbackSync = _prepareRemoveCallback(_removeFileSync, [fd, name]);
	  const removeCallback = _prepareRemoveCallback(_removeFileAsync, [fd, name], removeCallbackSync);

	  if (!opts.keep) _removeObjects.unshift(removeCallbackSync);

	  return removeCallback;
	}

	/**
	 * Simple wrapper for rimraf.
	 *
	 * @param {string} dirPath
	 * @param {Function} next
	 * @private
	 */
	function _rimrafRemoveDirWrapper(dirPath, next) {
	  rimraf_1(dirPath, next);
	}

	/**
	 * Simple wrapper for rimraf.sync.
	 *
	 * @param {string} dirPath
	 * @private
	 */
	function _rimrafRemoveDirSyncWrapper(dirPath, next) {
	  try {
	    return next(null, rimraf_1.sync(dirPath));
	  } catch (err) {
	    return next(err);
	  }
	}

	/**
	 * Prepares the callback for removal of the temporary directory.
	 *
	 * @param {string} name
	 * @param {Object} opts
	 * @returns {Function} the callback
	 * @private
	 */
	function _prepareTmpDirRemoveCallback(name, opts) {
	  const removeFunction = opts.unsafeCleanup ? _rimrafRemoveDirWrapper : fs$1.rmdir.bind(fs$1);
	  const removeFunctionSync = opts.unsafeCleanup ? _rimrafRemoveDirSyncWrapper : fs$1.rmdirSync.bind(fs$1);
	  const removeCallbackSync = _prepareRemoveCallback(removeFunctionSync, name);
	  const removeCallback = _prepareRemoveCallback(removeFunction, name, removeCallbackSync);
	  if (!opts.keep) _removeObjects.unshift(removeCallbackSync);

	  return removeCallback;
	}

	/**
	 * Creates a guarded function wrapping the removeFunction call.
	 *
	 * @param {Function} removeFunction
	 * @param {Object} arg
	 * @returns {Function}
	 * @private
	 */
	function _prepareRemoveCallback(removeFunction, arg, cleanupCallbackSync) {
	  var called = false;

	  return function _cleanupCallback(next) {
	    next = next || function () {};
	    if (!called) {
	      const toRemove = cleanupCallbackSync || _cleanupCallback;
	      const index = _removeObjects.indexOf(toRemove);
	      /* istanbul ignore else */
	      if (index >= 0) _removeObjects.splice(index, 1);

	      called = true;
	      // sync?
	      if (removeFunction.length === 1) {
	        try {
	          removeFunction(arg);
	          return next(null);
	        }
	        catch (err) {
	          // if no next is provided and since we are
	          // in silent cleanup mode on process exit,
	          // we will ignore the error
	          return next(err);
	        }
	      } else return removeFunction(arg, next);
	    } else return next(new Error('cleanup callback has already been called'));
	  };
	}

	/**
	 * The garbage collector.
	 *
	 * @private
	 */
	function _garbageCollector() {
	  /* istanbul ignore else */
	  if (!_gracefulCleanup) return;

	  // the function being called removes itself from _removeObjects,
	  // loop until _removeObjects is empty
	  while (_removeObjects.length) {
	    try {
	      _removeObjects[0]();
	    } catch (e) {
	      // already removed?
	    }
	  }
	}

	/**
	 * Helper for testing against EBADF to compensate changes made to Node 7.x under Windows.
	 */
	function isEBADF(error) {
	  return isExpectedError(error, -EBADF, 'EBADF');
	}

	/**
	 * Helper for testing against ENOENT to compensate changes made to Node 7.x under Windows.
	 */
	function isENOENT(error) {
	  return isExpectedError(error, -ENOENT, 'ENOENT');
	}

	/**
	 * Helper to determine whether the expected error code matches the actual code and errno,
	 * which will differ between the supported node versions.
	 *
	 * - Node >= 7.0:
	 *   error.code {string}
	 *   error.errno {string|number} any numerical value will be negated
	 *
	 * - Node >= 6.0 < 7.0:
	 *   error.code {string}
	 *   error.errno {number} negated
	 *
	 * - Node >= 4.0 < 6.0: introduces SystemError
	 *   error.code {string}
	 *   error.errno {number} negated
	 *
	 * - Node >= 0.10 < 4.0:
	 *   error.code {number} negated
	 *   error.errno n/a
	 */
	function isExpectedError(error, code, errno) {
	  return error.code === code || error.code === errno;
	}

	/**
	 * Helper which determines whether a string s is blank, that is undefined, or empty or null.
	 *
	 * @private
	 * @param {string} s
	 * @returns {Boolean} true whether the string s is blank, false otherwise
	 */
	function isBlank(s) {
	  return s === null || s === undefined || !s.trim();
	}

	/**
	 * Sets the graceful cleanup.
	 */
	function setGracefulCleanup() {
	  _gracefulCleanup = true;
	}

	/**
	 * Returns the currently configured tmp dir from os.tmpdir().
	 *
	 * @private
	 * @returns {string} the currently configured tmp dir
	 */
	function _getTmpDir() {
	  return os.tmpdir();
	}

	/**
	 * If there are multiple different versions of tmp in place, make sure that
	 * we recognize the old listeners.
	 *
	 * @param {Function} listener
	 * @private
	 * @returns {Boolean} true whether listener is a legacy listener
	 */
	function _is_legacy_listener(listener) {
	  return (listener.name === '_exit' || listener.name === '_uncaughtExceptionThrown')
	    && listener.toString().indexOf('_garbageCollector();') > -1;
	}

	/**
	 * Safely install SIGINT listener.
	 *
	 * NOTE: this will only work on OSX and Linux.
	 *
	 * @private
	 */
	function _safely_install_sigint_listener() {

	  const listeners = process.listeners(SIGINT);
	  const existingListeners = [];
	  for (let i = 0, length = listeners.length; i < length; i++) {
	    const lstnr = listeners[i];
	    /* istanbul ignore else */
	    if (lstnr.name === '_tmp$sigint_listener') {
	      existingListeners.push(lstnr);
	      process.removeListener(SIGINT, lstnr);
	    }
	  }
	  process.on(SIGINT, function _tmp$sigint_listener(doExit) {
	    for (let i = 0, length = existingListeners.length; i < length; i++) {
	      // let the existing listener do the garbage collection (e.g. jest sandbox)
	      try {
	        existingListeners[i](false);
	      } catch (err) {
	        // ignore
	      }
	    }
	    try {
	      // force the garbage collector even it is called again in the exit listener
	      _garbageCollector();
	    } finally {
	      if (!!doExit) {
	        process.exit(0);
	      }
	    }
	  });
	}

	/**
	 * Safely install process exit listener.
	 *
	 * @private
	 */
	function _safely_install_exit_listener() {
	  const listeners = process.listeners(EXIT);

	  // collect any existing listeners
	  const existingListeners = [];
	  for (let i = 0, length = listeners.length; i < length; i++) {
	    const lstnr = listeners[i];
	    /* istanbul ignore else */
	    // TODO: remove support for legacy listeners once release 1.0.0 is out
	    if (lstnr.name === '_tmp$safe_listener' || _is_legacy_listener(lstnr)) {
	      // we must forget about the uncaughtException listener, hopefully it is ours
	      if (lstnr.name !== '_uncaughtExceptionThrown') {
	        existingListeners.push(lstnr);
	      }
	      process.removeListener(EXIT, lstnr);
	    }
	  }
	  // TODO: what was the data parameter good for?
	  process.addListener(EXIT, function _tmp$safe_listener(data) {
	    for (let i = 0, length = existingListeners.length; i < length; i++) {
	      // let the existing listener do the garbage collection (e.g. jest sandbox)
	      try {
	        existingListeners[i](data);
	      } catch (err) {
	        // ignore
	      }
	    }
	    _garbageCollector();
	  });
	}

	_safely_install_exit_listener();
	_safely_install_sigint_listener();

	/**
	 * Configuration options.
	 *
	 * @typedef {Object} Options
	 * @property {?number} tries the number of tries before give up the name generation
	 * @property {?string} template the "mkstemp" like filename template
	 * @property {?string} name fix name
	 * @property {?string} dir the tmp directory to use
	 * @property {?string} prefix prefix for the generated name
	 * @property {?string} postfix postfix for the generated name
	 * @property {?boolean} unsafeCleanup recursively removes the created temporary directory, even when it's not empty
	 */

	/**
	 * @typedef {Object} FileSyncObject
	 * @property {string} name the name of the file
	 * @property {string} fd the file descriptor
	 * @property {fileCallback} removeCallback the callback function to remove the file
	 */

	/**
	 * @typedef {Object} DirSyncObject
	 * @property {string} name the name of the directory
	 * @property {fileCallback} removeCallback the callback function to remove the directory
	 */

	/**
	 * @callback tmpNameCallback
	 * @param {?Error} err the error object if anything goes wrong
	 * @param {string} name the temporary file name
	 */

	/**
	 * @callback fileCallback
	 * @param {?Error} err the error object if anything goes wrong
	 * @param {string} name the temporary file name
	 * @param {number} fd the file descriptor
	 * @param {cleanupCallback} fn the cleanup callback function
	 */

	/**
	 * @callback dirCallback
	 * @param {?Error} err the error object if anything goes wrong
	 * @param {string} name the temporary file name
	 * @param {cleanupCallback} fn the cleanup callback function
	 */

	/**
	 * Removes the temporary created file or directory.
	 *
	 * @callback cleanupCallback
	 * @param {simpleCallback} [next] function to call after entry was removed
	 */

	/**
	 * Callback function for function composition.
	 * @see {@link https://github.com/raszi/node-tmp/issues/57|raszi/node-tmp#57}
	 *
	 * @callback simpleCallback
	 */

	// exporting all the needed methods

	// evaluate os.tmpdir() lazily, mainly for simplifying testing but it also will
	// allow users to reconfigure the temporary directory
	Object.defineProperty(module.exports, 'tmpdir', {
	  enumerable: true,
	  configurable: false,
	  get: function () {
	    return _getTmpDir();
	  }
	});

	module.exports.dir = dir;
	module.exports.dirSync = dirSync;

	module.exports.file = file;
	module.exports.fileSync = fileSync;

	module.exports.tmpName = tmpName;
	module.exports.tmpNameSync = tmpNameSync;

	module.exports.setGracefulCleanup = setGracefulCleanup;
	});
	var tmp_1 = tmp.dir;
	var tmp_2 = tmp.dirSync;
	var tmp_3 = tmp.file;
	var tmp_4 = tmp.fileSync;
	var tmp_5 = tmp.tmpName;
	var tmp_6 = tmp.tmpNameSync;
	var tmp_7 = tmp.setGracefulCleanup;

	var es5 = createCommonjsModule(function (module) {
	var isES5 = (function(){
	    return this === undefined;
	})();

	if (isES5) {
	    module.exports = {
	        freeze: Object.freeze,
	        defineProperty: Object.defineProperty,
	        getDescriptor: Object.getOwnPropertyDescriptor,
	        keys: Object.keys,
	        names: Object.getOwnPropertyNames,
	        getPrototypeOf: Object.getPrototypeOf,
	        isArray: Array.isArray,
	        isES5: isES5,
	        propertyIsWritable: function(obj, prop) {
	            var descriptor = Object.getOwnPropertyDescriptor(obj, prop);
	            return !!(!descriptor || descriptor.writable || descriptor.set);
	        }
	    };
	} else {
	    var has = {}.hasOwnProperty;
	    var str = {}.toString;
	    var proto = {}.constructor.prototype;

	    var ObjectKeys = function (o) {
	        var ret = [];
	        for (var key in o) {
	            if (has.call(o, key)) {
	                ret.push(key);
	            }
	        }
	        return ret;
	    };

	    var ObjectGetDescriptor = function(o, key) {
	        return {value: o[key]};
	    };

	    var ObjectDefineProperty = function (o, key, desc) {
	        o[key] = desc.value;
	        return o;
	    };

	    var ObjectFreeze = function (obj) {
	        return obj;
	    };

	    var ObjectGetPrototypeOf = function (obj) {
	        try {
	            return Object(obj).constructor.prototype;
	        }
	        catch (e) {
	            return proto;
	        }
	    };

	    var ArrayIsArray = function (obj) {
	        try {
	            return str.call(obj) === "[object Array]";
	        }
	        catch(e) {
	            return false;
	        }
	    };

	    module.exports = {
	        isArray: ArrayIsArray,
	        keys: ObjectKeys,
	        names: ObjectKeys,
	        defineProperty: ObjectDefineProperty,
	        getDescriptor: ObjectGetDescriptor,
	        freeze: ObjectFreeze,
	        getPrototypeOf: ObjectGetPrototypeOf,
	        isES5: isES5,
	        propertyIsWritable: function() {
	            return true;
	        }
	    };
	}
	});
	var es5_1 = es5.freeze;
	var es5_2 = es5.defineProperty;
	var es5_3 = es5.getDescriptor;
	var es5_4 = es5.keys;
	var es5_5 = es5.names;
	var es5_6 = es5.getPrototypeOf;
	var es5_7 = es5.isArray;
	var es5_8 = es5.isES5;
	var es5_9 = es5.propertyIsWritable;

	var canEvaluate = typeof navigator == "undefined";

	var errorObj = {e: {}};
	var tryCatchTarget;
	var globalObject = typeof self !== "undefined" ? self :
	    typeof window !== "undefined" ? window :
	    typeof commonjsGlobal !== "undefined" ? commonjsGlobal :
	    commonjsGlobal !== undefined ? commonjsGlobal : null;

	function tryCatcher() {
	    try {
	        var target = tryCatchTarget;
	        tryCatchTarget = null;
	        return target.apply(this, arguments);
	    } catch (e) {
	        errorObj.e = e;
	        return errorObj;
	    }
	}
	function tryCatch(fn) {
	    tryCatchTarget = fn;
	    return tryCatcher;
	}

	var inherits$1 = function(Child, Parent) {
	    var hasProp = {}.hasOwnProperty;

	    function T() {
	        this.constructor = Child;
	        this.constructor$ = Parent;
	        for (var propertyName in Parent.prototype) {
	            if (hasProp.call(Parent.prototype, propertyName) &&
	                propertyName.charAt(propertyName.length-1) !== "$"
	           ) {
	                this[propertyName + "$"] = Parent.prototype[propertyName];
	            }
	        }
	    }
	    T.prototype = Parent.prototype;
	    Child.prototype = new T();
	    return Child.prototype;
	};


	function isPrimitive(val) {
	    return val == null || val === true || val === false ||
	        typeof val === "string" || typeof val === "number";

	}

	function isObject(value) {
	    return typeof value === "function" ||
	           typeof value === "object" && value !== null;
	}

	function maybeWrapAsError(maybeError) {
	    if (!isPrimitive(maybeError)) return maybeError;

	    return new Error(safeToString(maybeError));
	}

	function withAppended(target, appendee) {
	    var len = target.length;
	    var ret = new Array(len + 1);
	    var i;
	    for (i = 0; i < len; ++i) {
	        ret[i] = target[i];
	    }
	    ret[i] = appendee;
	    return ret;
	}

	function getDataPropertyOrDefault(obj, key, defaultValue) {
	    if (es5.isES5) {
	        var desc = Object.getOwnPropertyDescriptor(obj, key);

	        if (desc != null) {
	            return desc.get == null && desc.set == null
	                    ? desc.value
	                    : defaultValue;
	        }
	    } else {
	        return {}.hasOwnProperty.call(obj, key) ? obj[key] : undefined;
	    }
	}

	function notEnumerableProp(obj, name, value) {
	    if (isPrimitive(obj)) return obj;
	    var descriptor = {
	        value: value,
	        configurable: true,
	        enumerable: false,
	        writable: true
	    };
	    es5.defineProperty(obj, name, descriptor);
	    return obj;
	}

	function thrower(r) {
	    throw r;
	}

	var inheritedDataKeys = (function() {
	    var excludedPrototypes = [
	        Array.prototype,
	        Object.prototype,
	        Function.prototype
	    ];

	    var isExcludedProto = function(val) {
	        for (var i = 0; i < excludedPrototypes.length; ++i) {
	            if (excludedPrototypes[i] === val) {
	                return true;
	            }
	        }
	        return false;
	    };

	    if (es5.isES5) {
	        var getKeys = Object.getOwnPropertyNames;
	        return function(obj) {
	            var ret = [];
	            var visitedKeys = Object.create(null);
	            while (obj != null && !isExcludedProto(obj)) {
	                var keys;
	                try {
	                    keys = getKeys(obj);
	                } catch (e) {
	                    return ret;
	                }
	                for (var i = 0; i < keys.length; ++i) {
	                    var key = keys[i];
	                    if (visitedKeys[key]) continue;
	                    visitedKeys[key] = true;
	                    var desc = Object.getOwnPropertyDescriptor(obj, key);
	                    if (desc != null && desc.get == null && desc.set == null) {
	                        ret.push(key);
	                    }
	                }
	                obj = es5.getPrototypeOf(obj);
	            }
	            return ret;
	        };
	    } else {
	        var hasProp = {}.hasOwnProperty;
	        return function(obj) {
	            if (isExcludedProto(obj)) return [];
	            var ret = [];

	            /*jshint forin:false */
	            enumeration: for (var key in obj) {
	                if (hasProp.call(obj, key)) {
	                    ret.push(key);
	                } else {
	                    for (var i = 0; i < excludedPrototypes.length; ++i) {
	                        if (hasProp.call(excludedPrototypes[i], key)) {
	                            continue enumeration;
	                        }
	                    }
	                    ret.push(key);
	                }
	            }
	            return ret;
	        };
	    }

	})();

	var thisAssignmentPattern = /this\s*\.\s*\S+\s*=/;
	function isClass(fn) {
	    try {
	        if (typeof fn === "function") {
	            var keys = es5.names(fn.prototype);

	            var hasMethods = es5.isES5 && keys.length > 1;
	            var hasMethodsOtherThanConstructor = keys.length > 0 &&
	                !(keys.length === 1 && keys[0] === "constructor");
	            var hasThisAssignmentAndStaticMethods =
	                thisAssignmentPattern.test(fn + "") && es5.names(fn).length > 0;

	            if (hasMethods || hasMethodsOtherThanConstructor ||
	                hasThisAssignmentAndStaticMethods) {
	                return true;
	            }
	        }
	        return false;
	    } catch (e) {
	        return false;
	    }
	}

	function toFastProperties(obj) {
	    return obj;
	    eval(obj);
	}

	var rident = /^[a-z$_][a-z$_0-9]*$/i;
	function isIdentifier(str) {
	    return rident.test(str);
	}

	function filledRange(count, prefix, suffix) {
	    var ret = new Array(count);
	    for(var i = 0; i < count; ++i) {
	        ret[i] = prefix + i + suffix;
	    }
	    return ret;
	}

	function safeToString(obj) {
	    try {
	        return obj + "";
	    } catch (e) {
	        return "[no string representation]";
	    }
	}

	function isError(obj) {
	    return obj instanceof Error ||
	        (obj !== null &&
	           typeof obj === "object" &&
	           typeof obj.message === "string" &&
	           typeof obj.name === "string");
	}

	function markAsOriginatingFromRejection(e) {
	    try {
	        notEnumerableProp(e, "isOperational", true);
	    }
	    catch(ignore) {}
	}

	function originatesFromRejection(e) {
	    if (e == null) return false;
	    return ((e instanceof Error["__BluebirdErrorTypes__"].OperationalError) ||
	        e["isOperational"] === true);
	}

	function canAttachTrace(obj) {
	    return isError(obj) && es5.propertyIsWritable(obj, "stack");
	}

	var ensureErrorObject = (function() {
	    if (!("stack" in new Error())) {
	        return function(value) {
	            if (canAttachTrace(value)) return value;
	            try {throw new Error(safeToString(value));}
	            catch(err) {return err;}
	        };
	    } else {
	        return function(value) {
	            if (canAttachTrace(value)) return value;
	            return new Error(safeToString(value));
	        };
	    }
	})();

	function classString(obj) {
	    return {}.toString.call(obj);
	}

	function copyDescriptors(from, to, filter) {
	    var keys = es5.names(from);
	    for (var i = 0; i < keys.length; ++i) {
	        var key = keys[i];
	        if (filter(key)) {
	            try {
	                es5.defineProperty(to, key, es5.getDescriptor(from, key));
	            } catch (ignore) {}
	        }
	    }
	}

	var asArray = function(v) {
	    if (es5.isArray(v)) {
	        return v;
	    }
	    return null;
	};

	if (typeof Symbol !== "undefined" && Symbol.iterator) {
	    var ArrayFrom = typeof Array.from === "function" ? function(v) {
	        return Array.from(v);
	    } : function(v) {
	        var ret = [];
	        var it = v[Symbol.iterator]();
	        var itResult;
	        while (!((itResult = it.next()).done)) {
	            ret.push(itResult.value);
	        }
	        return ret;
	    };

	    asArray = function(v) {
	        if (es5.isArray(v)) {
	            return v;
	        } else if (v != null && typeof v[Symbol.iterator] === "function") {
	            return ArrayFrom(v);
	        }
	        return null;
	    };
	}

	var isNode = typeof process !== "undefined" &&
	        classString(process).toLowerCase() === "[object process]";

	var hasEnvVariables = typeof process !== "undefined" &&
	    typeof process.env !== "undefined";

	function env(key) {
	    return hasEnvVariables ? process.env[key] : undefined;
	}

	function getNativePromise() {
	    if (typeof Promise === "function") {
	        try {
	            var promise = new Promise(function(){});
	            if ({}.toString.call(promise) === "[object Promise]") {
	                return Promise;
	            }
	        } catch (e) {}
	    }
	}

	function domainBind(self, cb) {
	    return self.bind(cb);
	}

	var ret = {
	    isClass: isClass,
	    isIdentifier: isIdentifier,
	    inheritedDataKeys: inheritedDataKeys,
	    getDataPropertyOrDefault: getDataPropertyOrDefault,
	    thrower: thrower,
	    isArray: es5.isArray,
	    asArray: asArray,
	    notEnumerableProp: notEnumerableProp,
	    isPrimitive: isPrimitive,
	    isObject: isObject,
	    isError: isError,
	    canEvaluate: canEvaluate,
	    errorObj: errorObj,
	    tryCatch: tryCatch,
	    inherits: inherits$1,
	    withAppended: withAppended,
	    maybeWrapAsError: maybeWrapAsError,
	    toFastProperties: toFastProperties,
	    filledRange: filledRange,
	    toString: safeToString,
	    canAttachTrace: canAttachTrace,
	    ensureErrorObject: ensureErrorObject,
	    originatesFromRejection: originatesFromRejection,
	    markAsOriginatingFromRejection: markAsOriginatingFromRejection,
	    classString: classString,
	    copyDescriptors: copyDescriptors,
	    hasDevTools: typeof chrome !== "undefined" && chrome &&
	                 typeof chrome.loadTimes === "function",
	    isNode: isNode,
	    hasEnvVariables: hasEnvVariables,
	    env: env,
	    global: globalObject,
	    getNativePromise: getNativePromise,
	    domainBind: domainBind
	};
	ret.isRecentNode = ret.isNode && (function() {
	    var version;
	    if (process.versions && process.versions.node) {    
	        version = process.versions.node.split(".").map(Number);
	    } else if (process.version) {
	        version = process.version.split(".").map(Number);
	    }
	    return (version[0] === 0 && version[1] > 10) || (version[0] > 0);
	})();

	if (ret.isNode) ret.toFastProperties(process);

	try {throw new Error(); } catch (e) {ret.lastLineError = e;}
	var util = ret;

	var schedule;
	var noAsyncScheduler = function() {
	    throw new Error("No async scheduler available\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	};
	var NativePromise = util.getNativePromise();
	if (util.isNode && typeof MutationObserver === "undefined") {
	    var GlobalSetImmediate = commonjsGlobal.setImmediate;
	    var ProcessNextTick = process.nextTick;
	    schedule = util.isRecentNode
	                ? function(fn) { GlobalSetImmediate.call(commonjsGlobal, fn); }
	                : function(fn) { ProcessNextTick.call(process, fn); };
	} else if (typeof NativePromise === "function" &&
	           typeof NativePromise.resolve === "function") {
	    var nativePromise = NativePromise.resolve();
	    schedule = function(fn) {
	        nativePromise.then(fn);
	    };
	} else if ((typeof MutationObserver !== "undefined") &&
	          !(typeof window !== "undefined" &&
	            window.navigator &&
	            (window.navigator.standalone || window.cordova)) &&
	          ("classList" in document.documentElement)) {
	    schedule = (function() {
	        var div = document.createElement("div");
	        var opts = {attributes: true};
	        var toggleScheduled = false;
	        var div2 = document.createElement("div");
	        var o2 = new MutationObserver(function() {
	            div.classList.toggle("foo");
	            toggleScheduled = false;
	        });
	        o2.observe(div2, opts);

	        var scheduleToggle = function() {
	            if (toggleScheduled) return;
	            toggleScheduled = true;
	            div2.classList.toggle("foo");
	        };

	        return function schedule(fn) {
	            var o = new MutationObserver(function() {
	                o.disconnect();
	                fn();
	            });
	            o.observe(div, opts);
	            scheduleToggle();
	        };
	    })();
	} else if (typeof setImmediate !== "undefined") {
	    schedule = function (fn) {
	        setImmediate(fn);
	    };
	} else if (typeof setTimeout !== "undefined") {
	    schedule = function (fn) {
	        setTimeout(fn, 0);
	    };
	} else {
	    schedule = noAsyncScheduler;
	}
	var schedule_1 = schedule;

	function arrayMove(src, srcIndex, dst, dstIndex, len) {
	    for (var j = 0; j < len; ++j) {
	        dst[j + dstIndex] = src[j + srcIndex];
	        src[j + srcIndex] = void 0;
	    }
	}

	function Queue(capacity) {
	    this._capacity = capacity;
	    this._length = 0;
	    this._front = 0;
	}

	Queue.prototype._willBeOverCapacity = function (size) {
	    return this._capacity < size;
	};

	Queue.prototype._pushOne = function (arg) {
	    var length = this.length();
	    this._checkCapacity(length + 1);
	    var i = (this._front + length) & (this._capacity - 1);
	    this[i] = arg;
	    this._length = length + 1;
	};

	Queue.prototype.push = function (fn, receiver, arg) {
	    var length = this.length() + 3;
	    if (this._willBeOverCapacity(length)) {
	        this._pushOne(fn);
	        this._pushOne(receiver);
	        this._pushOne(arg);
	        return;
	    }
	    var j = this._front + length - 3;
	    this._checkCapacity(length);
	    var wrapMask = this._capacity - 1;
	    this[(j + 0) & wrapMask] = fn;
	    this[(j + 1) & wrapMask] = receiver;
	    this[(j + 2) & wrapMask] = arg;
	    this._length = length;
	};

	Queue.prototype.shift = function () {
	    var front = this._front,
	        ret = this[front];

	    this[front] = undefined;
	    this._front = (front + 1) & (this._capacity - 1);
	    this._length--;
	    return ret;
	};

	Queue.prototype.length = function () {
	    return this._length;
	};

	Queue.prototype._checkCapacity = function (size) {
	    if (this._capacity < size) {
	        this._resizeTo(this._capacity << 1);
	    }
	};

	Queue.prototype._resizeTo = function (capacity) {
	    var oldCapacity = this._capacity;
	    this._capacity = capacity;
	    var front = this._front;
	    var length = this._length;
	    var moveItemsCount = (front + length) & (oldCapacity - 1);
	    arrayMove(this, 0, this, oldCapacity, moveItemsCount);
	};

	var queue = Queue;

	var firstLineError;
	try {throw new Error(); } catch (e) {firstLineError = e;}




	function Async() {
	    this._customScheduler = false;
	    this._isTickUsed = false;
	    this._lateQueue = new queue(16);
	    this._normalQueue = new queue(16);
	    this._haveDrainedQueues = false;
	    this._trampolineEnabled = true;
	    var self = this;
	    this.drainQueues = function () {
	        self._drainQueues();
	    };
	    this._schedule = schedule_1;
	}

	Async.prototype.setScheduler = function(fn) {
	    var prev = this._schedule;
	    this._schedule = fn;
	    this._customScheduler = true;
	    return prev;
	};

	Async.prototype.hasCustomScheduler = function() {
	    return this._customScheduler;
	};

	Async.prototype.enableTrampoline = function() {
	    this._trampolineEnabled = true;
	};

	Async.prototype.disableTrampolineIfNecessary = function() {
	    if (util.hasDevTools) {
	        this._trampolineEnabled = false;
	    }
	};

	Async.prototype.haveItemsQueued = function () {
	    return this._isTickUsed || this._haveDrainedQueues;
	};


	Async.prototype.fatalError = function(e, isNode) {
	    if (isNode) {
	        process.stderr.write("Fatal " + (e instanceof Error ? e.stack : e) +
	            "\n");
	        process.exit(2);
	    } else {
	        this.throwLater(e);
	    }
	};

	Async.prototype.throwLater = function(fn, arg) {
	    if (arguments.length === 1) {
	        arg = fn;
	        fn = function () { throw arg; };
	    }
	    if (typeof setTimeout !== "undefined") {
	        setTimeout(function() {
	            fn(arg);
	        }, 0);
	    } else try {
	        this._schedule(function() {
	            fn(arg);
	        });
	    } catch (e) {
	        throw new Error("No async scheduler available\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	    }
	};

	function AsyncInvokeLater(fn, receiver, arg) {
	    this._lateQueue.push(fn, receiver, arg);
	    this._queueTick();
	}

	function AsyncInvoke(fn, receiver, arg) {
	    this._normalQueue.push(fn, receiver, arg);
	    this._queueTick();
	}

	function AsyncSettlePromises(promise) {
	    this._normalQueue._pushOne(promise);
	    this._queueTick();
	}

	if (!util.hasDevTools) {
	    Async.prototype.invokeLater = AsyncInvokeLater;
	    Async.prototype.invoke = AsyncInvoke;
	    Async.prototype.settlePromises = AsyncSettlePromises;
	} else {
	    Async.prototype.invokeLater = function (fn, receiver, arg) {
	        if (this._trampolineEnabled) {
	            AsyncInvokeLater.call(this, fn, receiver, arg);
	        } else {
	            this._schedule(function() {
	                setTimeout(function() {
	                    fn.call(receiver, arg);
	                }, 100);
	            });
	        }
	    };

	    Async.prototype.invoke = function (fn, receiver, arg) {
	        if (this._trampolineEnabled) {
	            AsyncInvoke.call(this, fn, receiver, arg);
	        } else {
	            this._schedule(function() {
	                fn.call(receiver, arg);
	            });
	        }
	    };

	    Async.prototype.settlePromises = function(promise) {
	        if (this._trampolineEnabled) {
	            AsyncSettlePromises.call(this, promise);
	        } else {
	            this._schedule(function() {
	                promise._settlePromises();
	            });
	        }
	    };
	}

	function _drainQueue(queue) {
	    while (queue.length() > 0) {
	        _drainQueueStep(queue);
	    }
	}

	function _drainQueueStep(queue) {
	    var fn = queue.shift();
	    if (typeof fn !== "function") {
	        fn._settlePromises();
	    } else {
	        var receiver = queue.shift();
	        var arg = queue.shift();
	        fn.call(receiver, arg);
	    }
	}

	Async.prototype._drainQueues = function () {
	    _drainQueue(this._normalQueue);
	    this._reset();
	    this._haveDrainedQueues = true;
	    _drainQueue(this._lateQueue);
	};

	Async.prototype._queueTick = function () {
	    if (!this._isTickUsed) {
	        this._isTickUsed = true;
	        this._schedule(this.drainQueues);
	    }
	};

	Async.prototype._reset = function () {
	    this._isTickUsed = false;
	};

	var async = Async;
	var firstLineError_1 = firstLineError;
	async.firstLineError = firstLineError_1;

	var Objectfreeze = es5.freeze;

	var inherits$2 = util.inherits;
	var notEnumerableProp$1 = util.notEnumerableProp;

	function subError(nameProperty, defaultMessage) {
	    function SubError(message) {
	        if (!(this instanceof SubError)) return new SubError(message);
	        notEnumerableProp$1(this, "message",
	            typeof message === "string" ? message : defaultMessage);
	        notEnumerableProp$1(this, "name", nameProperty);
	        if (Error.captureStackTrace) {
	            Error.captureStackTrace(this, this.constructor);
	        } else {
	            Error.call(this);
	        }
	    }
	    inherits$2(SubError, Error);
	    return SubError;
	}

	var _TypeError, _RangeError;
	var Warning = subError("Warning", "warning");
	var CancellationError = subError("CancellationError", "cancellation error");
	var TimeoutError = subError("TimeoutError", "timeout error");
	var AggregateError = subError("AggregateError", "aggregate error");
	try {
	    _TypeError = TypeError;
	    _RangeError = RangeError;
	} catch(e) {
	    _TypeError = subError("TypeError", "type error");
	    _RangeError = subError("RangeError", "range error");
	}

	var methods = ("join pop push shift unshift slice filter forEach some " +
	    "every map indexOf lastIndexOf reduce reduceRight sort reverse").split(" ");

	for (var i = 0; i < methods.length; ++i) {
	    if (typeof Array.prototype[methods[i]] === "function") {
	        AggregateError.prototype[methods[i]] = Array.prototype[methods[i]];
	    }
	}

	es5.defineProperty(AggregateError.prototype, "length", {
	    value: 0,
	    configurable: false,
	    writable: true,
	    enumerable: true
	});
	AggregateError.prototype["isOperational"] = true;
	var level = 0;
	AggregateError.prototype.toString = function() {
	    var indent = Array(level * 4 + 1).join(" ");
	    var ret = "\n" + indent + "AggregateError of:" + "\n";
	    level++;
	    indent = Array(level * 4 + 1).join(" ");
	    for (var i = 0; i < this.length; ++i) {
	        var str = this[i] === this ? "[Circular AggregateError]" : this[i] + "";
	        var lines = str.split("\n");
	        for (var j = 0; j < lines.length; ++j) {
	            lines[j] = indent + lines[j];
	        }
	        str = lines.join("\n");
	        ret += str + "\n";
	    }
	    level--;
	    return ret;
	};

	function OperationalError(message) {
	    if (!(this instanceof OperationalError))
	        return new OperationalError(message);
	    notEnumerableProp$1(this, "name", "OperationalError");
	    notEnumerableProp$1(this, "message", message);
	    this.cause = message;
	    this["isOperational"] = true;

	    if (message instanceof Error) {
	        notEnumerableProp$1(this, "message", message.message);
	        notEnumerableProp$1(this, "stack", message.stack);
	    } else if (Error.captureStackTrace) {
	        Error.captureStackTrace(this, this.constructor);
	    }

	}
	inherits$2(OperationalError, Error);

	var errorTypes = Error["__BluebirdErrorTypes__"];
	if (!errorTypes) {
	    errorTypes = Objectfreeze({
	        CancellationError: CancellationError,
	        TimeoutError: TimeoutError,
	        OperationalError: OperationalError,
	        RejectionError: OperationalError,
	        AggregateError: AggregateError
	    });
	    es5.defineProperty(Error, "__BluebirdErrorTypes__", {
	        value: errorTypes,
	        writable: false,
	        enumerable: false,
	        configurable: false
	    });
	}

	var errors = {
	    Error: Error,
	    TypeError: _TypeError,
	    RangeError: _RangeError,
	    CancellationError: errorTypes.CancellationError,
	    OperationalError: errorTypes.OperationalError,
	    TimeoutError: errorTypes.TimeoutError,
	    AggregateError: errorTypes.AggregateError,
	    Warning: Warning
	};

	var thenables = function(Promise, INTERNAL) {
	var util$1 = util;
	var errorObj = util$1.errorObj;
	var isObject = util$1.isObject;

	function tryConvertToPromise(obj, context) {
	    if (isObject(obj)) {
	        if (obj instanceof Promise) return obj;
	        var then = getThen(obj);
	        if (then === errorObj) {
	            if (context) context._pushContext();
	            var ret = Promise.reject(then.e);
	            if (context) context._popContext();
	            return ret;
	        } else if (typeof then === "function") {
	            if (isAnyBluebirdPromise(obj)) {
	                var ret = new Promise(INTERNAL);
	                obj._then(
	                    ret._fulfill,
	                    ret._reject,
	                    undefined,
	                    ret,
	                    null
	                );
	                return ret;
	            }
	            return doThenable(obj, then, context);
	        }
	    }
	    return obj;
	}

	function doGetThen(obj) {
	    return obj.then;
	}

	function getThen(obj) {
	    try {
	        return doGetThen(obj);
	    } catch (e) {
	        errorObj.e = e;
	        return errorObj;
	    }
	}

	var hasProp = {}.hasOwnProperty;
	function isAnyBluebirdPromise(obj) {
	    try {
	        return hasProp.call(obj, "_promise0");
	    } catch (e) {
	        return false;
	    }
	}

	function doThenable(x, then, context) {
	    var promise = new Promise(INTERNAL);
	    var ret = promise;
	    if (context) context._pushContext();
	    promise._captureStackTrace();
	    if (context) context._popContext();
	    var synchronous = true;
	    var result = util$1.tryCatch(then).call(x, resolve, reject);
	    synchronous = false;

	    if (promise && result === errorObj) {
	        promise._rejectCallback(result.e, true, true);
	        promise = null;
	    }

	    function resolve(value) {
	        if (!promise) return;
	        promise._resolveCallback(value);
	        promise = null;
	    }

	    function reject(reason) {
	        if (!promise) return;
	        promise._rejectCallback(reason, synchronous, true);
	        promise = null;
	    }
	    return ret;
	}

	return tryConvertToPromise;
	};

	var promise_array = function(Promise, INTERNAL, tryConvertToPromise,
	    apiRejection, Proxyable) {
	var util$1 = util;

	function toResolutionValue(val) {
	    switch(val) {
	    case -2: return [];
	    case -3: return {};
	    case -6: return new Map();
	    }
	}

	function PromiseArray(values) {
	    var promise = this._promise = new Promise(INTERNAL);
	    if (values instanceof Promise) {
	        promise._propagateFrom(values, 3);
	    }
	    promise._setOnCancel(this);
	    this._values = values;
	    this._length = 0;
	    this._totalResolved = 0;
	    this._init(undefined, -2);
	}
	util$1.inherits(PromiseArray, Proxyable);

	PromiseArray.prototype.length = function () {
	    return this._length;
	};

	PromiseArray.prototype.promise = function () {
	    return this._promise;
	};

	PromiseArray.prototype._init = function init(_, resolveValueIfEmpty) {
	    var values = tryConvertToPromise(this._values, this._promise);
	    if (values instanceof Promise) {
	        values = values._target();
	        var bitField = values._bitField;
	        this._values = values;

	        if (((bitField & 50397184) === 0)) {
	            this._promise._setAsyncGuaranteed();
	            return values._then(
	                init,
	                this._reject,
	                undefined,
	                this,
	                resolveValueIfEmpty
	           );
	        } else if (((bitField & 33554432) !== 0)) {
	            values = values._value();
	        } else if (((bitField & 16777216) !== 0)) {
	            return this._reject(values._reason());
	        } else {
	            return this._cancel();
	        }
	    }
	    values = util$1.asArray(values);
	    if (values === null) {
	        var err = apiRejection(
	            "expecting an array or an iterable object but got " + util$1.classString(values)).reason();
	        this._promise._rejectCallback(err, false);
	        return;
	    }

	    if (values.length === 0) {
	        if (resolveValueIfEmpty === -5) {
	            this._resolveEmptyArray();
	        }
	        else {
	            this._resolve(toResolutionValue(resolveValueIfEmpty));
	        }
	        return;
	    }
	    this._iterate(values);
	};

	PromiseArray.prototype._iterate = function(values) {
	    var len = this.getActualLength(values.length);
	    this._length = len;
	    this._values = this.shouldCopyValues() ? new Array(len) : this._values;
	    var result = this._promise;
	    var isResolved = false;
	    var bitField = null;
	    for (var i = 0; i < len; ++i) {
	        var maybePromise = tryConvertToPromise(values[i], result);

	        if (maybePromise instanceof Promise) {
	            maybePromise = maybePromise._target();
	            bitField = maybePromise._bitField;
	        } else {
	            bitField = null;
	        }

	        if (isResolved) {
	            if (bitField !== null) {
	                maybePromise.suppressUnhandledRejections();
	            }
	        } else if (bitField !== null) {
	            if (((bitField & 50397184) === 0)) {
	                maybePromise._proxy(this, i);
	                this._values[i] = maybePromise;
	            } else if (((bitField & 33554432) !== 0)) {
	                isResolved = this._promiseFulfilled(maybePromise._value(), i);
	            } else if (((bitField & 16777216) !== 0)) {
	                isResolved = this._promiseRejected(maybePromise._reason(), i);
	            } else {
	                isResolved = this._promiseCancelled(i);
	            }
	        } else {
	            isResolved = this._promiseFulfilled(maybePromise, i);
	        }
	    }
	    if (!isResolved) result._setAsyncGuaranteed();
	};

	PromiseArray.prototype._isResolved = function () {
	    return this._values === null;
	};

	PromiseArray.prototype._resolve = function (value) {
	    this._values = null;
	    this._promise._fulfill(value);
	};

	PromiseArray.prototype._cancel = function() {
	    if (this._isResolved() || !this._promise._isCancellable()) return;
	    this._values = null;
	    this._promise._cancel();
	};

	PromiseArray.prototype._reject = function (reason) {
	    this._values = null;
	    this._promise._rejectCallback(reason, false);
	};

	PromiseArray.prototype._promiseFulfilled = function (value, index) {
	    this._values[index] = value;
	    var totalResolved = ++this._totalResolved;
	    if (totalResolved >= this._length) {
	        this._resolve(this._values);
	        return true;
	    }
	    return false;
	};

	PromiseArray.prototype._promiseCancelled = function() {
	    this._cancel();
	    return true;
	};

	PromiseArray.prototype._promiseRejected = function (reason) {
	    this._totalResolved++;
	    this._reject(reason);
	    return true;
	};

	PromiseArray.prototype._resultCancelled = function() {
	    if (this._isResolved()) return;
	    var values = this._values;
	    this._cancel();
	    if (values instanceof Promise) {
	        values.cancel();
	    } else {
	        for (var i = 0; i < values.length; ++i) {
	            if (values[i] instanceof Promise) {
	                values[i].cancel();
	            }
	        }
	    }
	};

	PromiseArray.prototype.shouldCopyValues = function () {
	    return true;
	};

	PromiseArray.prototype.getActualLength = function (len) {
	    return len;
	};

	return PromiseArray;
	};

	var context = function(Promise) {
	var longStackTraces = false;
	var contextStack = [];

	Promise.prototype._promiseCreated = function() {};
	Promise.prototype._pushContext = function() {};
	Promise.prototype._popContext = function() {return null;};
	Promise._peekContext = Promise.prototype._peekContext = function() {};

	function Context() {
	    this._trace = new Context.CapturedTrace(peekContext());
	}
	Context.prototype._pushContext = function () {
	    if (this._trace !== undefined) {
	        this._trace._promiseCreated = null;
	        contextStack.push(this._trace);
	    }
	};

	Context.prototype._popContext = function () {
	    if (this._trace !== undefined) {
	        var trace = contextStack.pop();
	        var ret = trace._promiseCreated;
	        trace._promiseCreated = null;
	        return ret;
	    }
	    return null;
	};

	function createContext() {
	    if (longStackTraces) return new Context();
	}

	function peekContext() {
	    var lastIndex = contextStack.length - 1;
	    if (lastIndex >= 0) {
	        return contextStack[lastIndex];
	    }
	    return undefined;
	}
	Context.CapturedTrace = null;
	Context.create = createContext;
	Context.deactivateLongStackTraces = function() {};
	Context.activateLongStackTraces = function() {
	    var Promise_pushContext = Promise.prototype._pushContext;
	    var Promise_popContext = Promise.prototype._popContext;
	    var Promise_PeekContext = Promise._peekContext;
	    var Promise_peekContext = Promise.prototype._peekContext;
	    var Promise_promiseCreated = Promise.prototype._promiseCreated;
	    Context.deactivateLongStackTraces = function() {
	        Promise.prototype._pushContext = Promise_pushContext;
	        Promise.prototype._popContext = Promise_popContext;
	        Promise._peekContext = Promise_PeekContext;
	        Promise.prototype._peekContext = Promise_peekContext;
	        Promise.prototype._promiseCreated = Promise_promiseCreated;
	        longStackTraces = false;
	    };
	    longStackTraces = true;
	    Promise.prototype._pushContext = Context.prototype._pushContext;
	    Promise.prototype._popContext = Context.prototype._popContext;
	    Promise._peekContext = Promise.prototype._peekContext = peekContext;
	    Promise.prototype._promiseCreated = function() {
	        var ctx = this._peekContext();
	        if (ctx && ctx._promiseCreated == null) ctx._promiseCreated = this;
	    };
	};
	return Context;
	};

	var debuggability = function(Promise, Context) {
	var getDomain = Promise._getDomain;
	var async = Promise._async;
	var Warning = errors.Warning;
	var util$1 = util;
	var es5$1 = es5;
	var canAttachTrace = util$1.canAttachTrace;
	var unhandledRejectionHandled;
	var possiblyUnhandledRejection;
	var bluebirdFramePattern =
	    /[\\\/]bluebird[\\\/]js[\\\/](release|debug|instrumented)/;
	var nodeFramePattern = /\((?:timers\.js):\d+:\d+\)/;
	var parseLinePattern = /[\/<\(](.+?):(\d+):(\d+)\)?\s*$/;
	var stackFramePattern = null;
	var formatStack = null;
	var indentStackFrames = false;
	var printWarning;
	var debugging = !!(util$1.env("BLUEBIRD_DEBUG") != 0 &&
	                        (
	                         util$1.env("BLUEBIRD_DEBUG") ||
	                         util$1.env("NODE_ENV") === "development"));

	var warnings = !!(util$1.env("BLUEBIRD_WARNINGS") != 0 &&
	    (debugging || util$1.env("BLUEBIRD_WARNINGS")));

	var longStackTraces = !!(util$1.env("BLUEBIRD_LONG_STACK_TRACES") != 0 &&
	    (debugging || util$1.env("BLUEBIRD_LONG_STACK_TRACES")));

	var wForgottenReturn = util$1.env("BLUEBIRD_W_FORGOTTEN_RETURN") != 0 &&
	    (warnings || !!util$1.env("BLUEBIRD_W_FORGOTTEN_RETURN"));

	Promise.prototype.suppressUnhandledRejections = function() {
	    var target = this._target();
	    target._bitField = ((target._bitField & (~1048576)) |
	                      524288);
	};

	Promise.prototype._ensurePossibleRejectionHandled = function () {
	    if ((this._bitField & 524288) !== 0) return;
	    this._setRejectionIsUnhandled();
	    var self = this;
	    setTimeout(function() {
	        self._notifyUnhandledRejection();
	    }, 1);
	};

	Promise.prototype._notifyUnhandledRejectionIsHandled = function () {
	    fireRejectionEvent("rejectionHandled",
	                                  unhandledRejectionHandled, undefined, this);
	};

	Promise.prototype._setReturnedNonUndefined = function() {
	    this._bitField = this._bitField | 268435456;
	};

	Promise.prototype._returnedNonUndefined = function() {
	    return (this._bitField & 268435456) !== 0;
	};

	Promise.prototype._notifyUnhandledRejection = function () {
	    if (this._isRejectionUnhandled()) {
	        var reason = this._settledValue();
	        this._setUnhandledRejectionIsNotified();
	        fireRejectionEvent("unhandledRejection",
	                                      possiblyUnhandledRejection, reason, this);
	    }
	};

	Promise.prototype._setUnhandledRejectionIsNotified = function () {
	    this._bitField = this._bitField | 262144;
	};

	Promise.prototype._unsetUnhandledRejectionIsNotified = function () {
	    this._bitField = this._bitField & (~262144);
	};

	Promise.prototype._isUnhandledRejectionNotified = function () {
	    return (this._bitField & 262144) > 0;
	};

	Promise.prototype._setRejectionIsUnhandled = function () {
	    this._bitField = this._bitField | 1048576;
	};

	Promise.prototype._unsetRejectionIsUnhandled = function () {
	    this._bitField = this._bitField & (~1048576);
	    if (this._isUnhandledRejectionNotified()) {
	        this._unsetUnhandledRejectionIsNotified();
	        this._notifyUnhandledRejectionIsHandled();
	    }
	};

	Promise.prototype._isRejectionUnhandled = function () {
	    return (this._bitField & 1048576) > 0;
	};

	Promise.prototype._warn = function(message, shouldUseOwnTrace, promise) {
	    return warn(message, shouldUseOwnTrace, promise || this);
	};

	Promise.onPossiblyUnhandledRejection = function (fn) {
	    var domain = getDomain();
	    possiblyUnhandledRejection =
	        typeof fn === "function" ? (domain === null ?
	                                            fn : util$1.domainBind(domain, fn))
	                                 : undefined;
	};

	Promise.onUnhandledRejectionHandled = function (fn) {
	    var domain = getDomain();
	    unhandledRejectionHandled =
	        typeof fn === "function" ? (domain === null ?
	                                            fn : util$1.domainBind(domain, fn))
	                                 : undefined;
	};

	var disableLongStackTraces = function() {};
	Promise.longStackTraces = function () {
	    if (async.haveItemsQueued() && !config.longStackTraces) {
	        throw new Error("cannot enable long stack traces after promises have been created\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	    }
	    if (!config.longStackTraces && longStackTracesIsSupported()) {
	        var Promise_captureStackTrace = Promise.prototype._captureStackTrace;
	        var Promise_attachExtraTrace = Promise.prototype._attachExtraTrace;
	        var Promise_dereferenceTrace = Promise.prototype._dereferenceTrace;
	        config.longStackTraces = true;
	        disableLongStackTraces = function() {
	            if (async.haveItemsQueued() && !config.longStackTraces) {
	                throw new Error("cannot enable long stack traces after promises have been created\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	            }
	            Promise.prototype._captureStackTrace = Promise_captureStackTrace;
	            Promise.prototype._attachExtraTrace = Promise_attachExtraTrace;
	            Promise.prototype._dereferenceTrace = Promise_dereferenceTrace;
	            Context.deactivateLongStackTraces();
	            async.enableTrampoline();
	            config.longStackTraces = false;
	        };
	        Promise.prototype._captureStackTrace = longStackTracesCaptureStackTrace;
	        Promise.prototype._attachExtraTrace = longStackTracesAttachExtraTrace;
	        Promise.prototype._dereferenceTrace = longStackTracesDereferenceTrace;
	        Context.activateLongStackTraces();
	        async.disableTrampolineIfNecessary();
	    }
	};

	Promise.hasLongStackTraces = function () {
	    return config.longStackTraces && longStackTracesIsSupported();
	};

	var fireDomEvent = (function() {
	    try {
	        if (typeof CustomEvent === "function") {
	            var event = new CustomEvent("CustomEvent");
	            util$1.global.dispatchEvent(event);
	            return function(name, event) {
	                var eventData = {
	                    detail: event,
	                    cancelable: true
	                };
	                es5$1.defineProperty(
	                    eventData, "promise", {value: event.promise});
	                es5$1.defineProperty(eventData, "reason", {value: event.reason});
	                var domEvent = new CustomEvent(name.toLowerCase(), eventData);
	                return !util$1.global.dispatchEvent(domEvent);
	            };
	        } else if (typeof Event === "function") {
	            var event = new Event("CustomEvent");
	            util$1.global.dispatchEvent(event);
	            return function(name, event) {
	                var domEvent = new Event(name.toLowerCase(), {
	                    cancelable: true
	                });
	                domEvent.detail = event;
	                es5$1.defineProperty(domEvent, "promise", {value: event.promise});
	                es5$1.defineProperty(domEvent, "reason", {value: event.reason});
	                return !util$1.global.dispatchEvent(domEvent);
	            };
	        } else {
	            var event = document.createEvent("CustomEvent");
	            event.initCustomEvent("testingtheevent", false, true, {});
	            util$1.global.dispatchEvent(event);
	            return function(name, event) {
	                var domEvent = document.createEvent("CustomEvent");
	                domEvent.initCustomEvent(name.toLowerCase(), false, true,
	                    event);
	                return !util$1.global.dispatchEvent(domEvent);
	            };
	        }
	    } catch (e) {}
	    return function() {
	        return false;
	    };
	})();

	var fireGlobalEvent = (function() {
	    if (util$1.isNode) {
	        return function() {
	            return process.emit.apply(process, arguments);
	        };
	    } else {
	        if (!util$1.global) {
	            return function() {
	                return false;
	            };
	        }
	        return function(name) {
	            var methodName = "on" + name.toLowerCase();
	            var method = util$1.global[methodName];
	            if (!method) return false;
	            method.apply(util$1.global, [].slice.call(arguments, 1));
	            return true;
	        };
	    }
	})();

	function generatePromiseLifecycleEventObject(name, promise) {
	    return {promise: promise};
	}

	var eventToObjectGenerator = {
	    promiseCreated: generatePromiseLifecycleEventObject,
	    promiseFulfilled: generatePromiseLifecycleEventObject,
	    promiseRejected: generatePromiseLifecycleEventObject,
	    promiseResolved: generatePromiseLifecycleEventObject,
	    promiseCancelled: generatePromiseLifecycleEventObject,
	    promiseChained: function(name, promise, child) {
	        return {promise: promise, child: child};
	    },
	    warning: function(name, warning) {
	        return {warning: warning};
	    },
	    unhandledRejection: function (name, reason, promise) {
	        return {reason: reason, promise: promise};
	    },
	    rejectionHandled: generatePromiseLifecycleEventObject
	};

	var activeFireEvent = function (name) {
	    var globalEventFired = false;
	    try {
	        globalEventFired = fireGlobalEvent.apply(null, arguments);
	    } catch (e) {
	        async.throwLater(e);
	        globalEventFired = true;
	    }

	    var domEventFired = false;
	    try {
	        domEventFired = fireDomEvent(name,
	                    eventToObjectGenerator[name].apply(null, arguments));
	    } catch (e) {
	        async.throwLater(e);
	        domEventFired = true;
	    }

	    return domEventFired || globalEventFired;
	};

	Promise.config = function(opts) {
	    opts = Object(opts);
	    if ("longStackTraces" in opts) {
	        if (opts.longStackTraces) {
	            Promise.longStackTraces();
	        } else if (!opts.longStackTraces && Promise.hasLongStackTraces()) {
	            disableLongStackTraces();
	        }
	    }
	    if ("warnings" in opts) {
	        var warningsOption = opts.warnings;
	        config.warnings = !!warningsOption;
	        wForgottenReturn = config.warnings;

	        if (util$1.isObject(warningsOption)) {
	            if ("wForgottenReturn" in warningsOption) {
	                wForgottenReturn = !!warningsOption.wForgottenReturn;
	            }
	        }
	    }
	    if ("cancellation" in opts && opts.cancellation && !config.cancellation) {
	        if (async.haveItemsQueued()) {
	            throw new Error(
	                "cannot enable cancellation after promises are in use");
	        }
	        Promise.prototype._clearCancellationData =
	            cancellationClearCancellationData;
	        Promise.prototype._propagateFrom = cancellationPropagateFrom;
	        Promise.prototype._onCancel = cancellationOnCancel;
	        Promise.prototype._setOnCancel = cancellationSetOnCancel;
	        Promise.prototype._attachCancellationCallback =
	            cancellationAttachCancellationCallback;
	        Promise.prototype._execute = cancellationExecute;
	        propagateFromFunction = cancellationPropagateFrom;
	        config.cancellation = true;
	    }
	    if ("monitoring" in opts) {
	        if (opts.monitoring && !config.monitoring) {
	            config.monitoring = true;
	            Promise.prototype._fireEvent = activeFireEvent;
	        } else if (!opts.monitoring && config.monitoring) {
	            config.monitoring = false;
	            Promise.prototype._fireEvent = defaultFireEvent;
	        }
	    }
	    return Promise;
	};

	function defaultFireEvent() { return false; }

	Promise.prototype._fireEvent = defaultFireEvent;
	Promise.prototype._execute = function(executor, resolve, reject) {
	    try {
	        executor(resolve, reject);
	    } catch (e) {
	        return e;
	    }
	};
	Promise.prototype._onCancel = function () {};
	Promise.prototype._setOnCancel = function (handler) { };
	Promise.prototype._attachCancellationCallback = function(onCancel) {
	};
	Promise.prototype._captureStackTrace = function () {};
	Promise.prototype._attachExtraTrace = function () {};
	Promise.prototype._dereferenceTrace = function () {};
	Promise.prototype._clearCancellationData = function() {};
	Promise.prototype._propagateFrom = function (parent, flags) {
	};

	function cancellationExecute(executor, resolve, reject) {
	    var promise = this;
	    try {
	        executor(resolve, reject, function(onCancel) {
	            if (typeof onCancel !== "function") {
	                throw new TypeError("onCancel must be a function, got: " +
	                                    util$1.toString(onCancel));
	            }
	            promise._attachCancellationCallback(onCancel);
	        });
	    } catch (e) {
	        return e;
	    }
	}

	function cancellationAttachCancellationCallback(onCancel) {
	    if (!this._isCancellable()) return this;

	    var previousOnCancel = this._onCancel();
	    if (previousOnCancel !== undefined) {
	        if (util$1.isArray(previousOnCancel)) {
	            previousOnCancel.push(onCancel);
	        } else {
	            this._setOnCancel([previousOnCancel, onCancel]);
	        }
	    } else {
	        this._setOnCancel(onCancel);
	    }
	}

	function cancellationOnCancel() {
	    return this._onCancelField;
	}

	function cancellationSetOnCancel(onCancel) {
	    this._onCancelField = onCancel;
	}

	function cancellationClearCancellationData() {
	    this._cancellationParent = undefined;
	    this._onCancelField = undefined;
	}

	function cancellationPropagateFrom(parent, flags) {
	    if ((flags & 1) !== 0) {
	        this._cancellationParent = parent;
	        var branchesRemainingToCancel = parent._branchesRemainingToCancel;
	        if (branchesRemainingToCancel === undefined) {
	            branchesRemainingToCancel = 0;
	        }
	        parent._branchesRemainingToCancel = branchesRemainingToCancel + 1;
	    }
	    if ((flags & 2) !== 0 && parent._isBound()) {
	        this._setBoundTo(parent._boundTo);
	    }
	}

	function bindingPropagateFrom(parent, flags) {
	    if ((flags & 2) !== 0 && parent._isBound()) {
	        this._setBoundTo(parent._boundTo);
	    }
	}
	var propagateFromFunction = bindingPropagateFrom;

	function boundValueFunction() {
	    var ret = this._boundTo;
	    if (ret !== undefined) {
	        if (ret instanceof Promise) {
	            if (ret.isFulfilled()) {
	                return ret.value();
	            } else {
	                return undefined;
	            }
	        }
	    }
	    return ret;
	}

	function longStackTracesCaptureStackTrace() {
	    this._trace = new CapturedTrace(this._peekContext());
	}

	function longStackTracesAttachExtraTrace(error, ignoreSelf) {
	    if (canAttachTrace(error)) {
	        var trace = this._trace;
	        if (trace !== undefined) {
	            if (ignoreSelf) trace = trace._parent;
	        }
	        if (trace !== undefined) {
	            trace.attachExtraTrace(error);
	        } else if (!error.__stackCleaned__) {
	            var parsed = parseStackAndMessage(error);
	            util$1.notEnumerableProp(error, "stack",
	                parsed.message + "\n" + parsed.stack.join("\n"));
	            util$1.notEnumerableProp(error, "__stackCleaned__", true);
	        }
	    }
	}

	function longStackTracesDereferenceTrace() {
	    this._trace = undefined;
	}

	function checkForgottenReturns(returnValue, promiseCreated, name, promise,
	                               parent) {
	    if (returnValue === undefined && promiseCreated !== null &&
	        wForgottenReturn) {
	        if (parent !== undefined && parent._returnedNonUndefined()) return;
	        if ((promise._bitField & 65535) === 0) return;

	        if (name) name = name + " ";
	        var handlerLine = "";
	        var creatorLine = "";
	        if (promiseCreated._trace) {
	            var traceLines = promiseCreated._trace.stack.split("\n");
	            var stack = cleanStack(traceLines);
	            for (var i = stack.length - 1; i >= 0; --i) {
	                var line = stack[i];
	                if (!nodeFramePattern.test(line)) {
	                    var lineMatches = line.match(parseLinePattern);
	                    if (lineMatches) {
	                        handlerLine  = "at " + lineMatches[1] +
	                            ":" + lineMatches[2] + ":" + lineMatches[3] + " ";
	                    }
	                    break;
	                }
	            }

	            if (stack.length > 0) {
	                var firstUserLine = stack[0];
	                for (var i = 0; i < traceLines.length; ++i) {

	                    if (traceLines[i] === firstUserLine) {
	                        if (i > 0) {
	                            creatorLine = "\n" + traceLines[i - 1];
	                        }
	                        break;
	                    }
	                }

	            }
	        }
	        var msg = "a promise was created in a " + name +
	            "handler " + handlerLine + "but was not returned from it, " +
	            "see http://goo.gl/rRqMUw" +
	            creatorLine;
	        promise._warn(msg, true, promiseCreated);
	    }
	}

	function deprecated(name, replacement) {
	    var message = name +
	        " is deprecated and will be removed in a future version.";
	    if (replacement) message += " Use " + replacement + " instead.";
	    return warn(message);
	}

	function warn(message, shouldUseOwnTrace, promise) {
	    if (!config.warnings) return;
	    var warning = new Warning(message);
	    var ctx;
	    if (shouldUseOwnTrace) {
	        promise._attachExtraTrace(warning);
	    } else if (config.longStackTraces && (ctx = Promise._peekContext())) {
	        ctx.attachExtraTrace(warning);
	    } else {
	        var parsed = parseStackAndMessage(warning);
	        warning.stack = parsed.message + "\n" + parsed.stack.join("\n");
	    }

	    if (!activeFireEvent("warning", warning)) {
	        formatAndLogError(warning, "", true);
	    }
	}

	function reconstructStack(message, stacks) {
	    for (var i = 0; i < stacks.length - 1; ++i) {
	        stacks[i].push("From previous event:");
	        stacks[i] = stacks[i].join("\n");
	    }
	    if (i < stacks.length) {
	        stacks[i] = stacks[i].join("\n");
	    }
	    return message + "\n" + stacks.join("\n");
	}

	function removeDuplicateOrEmptyJumps(stacks) {
	    for (var i = 0; i < stacks.length; ++i) {
	        if (stacks[i].length === 0 ||
	            ((i + 1 < stacks.length) && stacks[i][0] === stacks[i+1][0])) {
	            stacks.splice(i, 1);
	            i--;
	        }
	    }
	}

	function removeCommonRoots(stacks) {
	    var current = stacks[0];
	    for (var i = 1; i < stacks.length; ++i) {
	        var prev = stacks[i];
	        var currentLastIndex = current.length - 1;
	        var currentLastLine = current[currentLastIndex];
	        var commonRootMeetPoint = -1;

	        for (var j = prev.length - 1; j >= 0; --j) {
	            if (prev[j] === currentLastLine) {
	                commonRootMeetPoint = j;
	                break;
	            }
	        }

	        for (var j = commonRootMeetPoint; j >= 0; --j) {
	            var line = prev[j];
	            if (current[currentLastIndex] === line) {
	                current.pop();
	                currentLastIndex--;
	            } else {
	                break;
	            }
	        }
	        current = prev;
	    }
	}

	function cleanStack(stack) {
	    var ret = [];
	    for (var i = 0; i < stack.length; ++i) {
	        var line = stack[i];
	        var isTraceLine = "    (No stack trace)" === line ||
	            stackFramePattern.test(line);
	        var isInternalFrame = isTraceLine && shouldIgnore(line);
	        if (isTraceLine && !isInternalFrame) {
	            if (indentStackFrames && line.charAt(0) !== " ") {
	                line = "    " + line;
	            }
	            ret.push(line);
	        }
	    }
	    return ret;
	}

	function stackFramesAsArray(error) {
	    var stack = error.stack.replace(/\s+$/g, "").split("\n");
	    for (var i = 0; i < stack.length; ++i) {
	        var line = stack[i];
	        if ("    (No stack trace)" === line || stackFramePattern.test(line)) {
	            break;
	        }
	    }
	    if (i > 0 && error.name != "SyntaxError") {
	        stack = stack.slice(i);
	    }
	    return stack;
	}

	function parseStackAndMessage(error) {
	    var stack = error.stack;
	    var message = error.toString();
	    stack = typeof stack === "string" && stack.length > 0
	                ? stackFramesAsArray(error) : ["    (No stack trace)"];
	    return {
	        message: message,
	        stack: error.name == "SyntaxError" ? stack : cleanStack(stack)
	    };
	}

	function formatAndLogError(error, title, isSoft) {
	    if (typeof console !== "undefined") {
	        var message;
	        if (util$1.isObject(error)) {
	            var stack = error.stack;
	            message = title + formatStack(stack, error);
	        } else {
	            message = title + String(error);
	        }
	        if (typeof printWarning === "function") {
	            printWarning(message, isSoft);
	        } else if (typeof console.log === "function" ||
	            typeof console.log === "object") {
	            console.log(message);
	        }
	    }
	}

	function fireRejectionEvent(name, localHandler, reason, promise) {
	    var localEventFired = false;
	    try {
	        if (typeof localHandler === "function") {
	            localEventFired = true;
	            if (name === "rejectionHandled") {
	                localHandler(promise);
	            } else {
	                localHandler(reason, promise);
	            }
	        }
	    } catch (e) {
	        async.throwLater(e);
	    }

	    if (name === "unhandledRejection") {
	        if (!activeFireEvent(name, reason, promise) && !localEventFired) {
	            formatAndLogError(reason, "Unhandled rejection ");
	        }
	    } else {
	        activeFireEvent(name, promise);
	    }
	}

	function formatNonError(obj) {
	    var str;
	    if (typeof obj === "function") {
	        str = "[function " +
	            (obj.name || "anonymous") +
	            "]";
	    } else {
	        str = obj && typeof obj.toString === "function"
	            ? obj.toString() : util$1.toString(obj);
	        var ruselessToString = /\[object [a-zA-Z0-9$_]+\]/;
	        if (ruselessToString.test(str)) {
	            try {
	                var newStr = JSON.stringify(obj);
	                str = newStr;
	            }
	            catch(e) {

	            }
	        }
	        if (str.length === 0) {
	            str = "(empty array)";
	        }
	    }
	    return ("(<" + snip(str) + ">, no stack trace)");
	}

	function snip(str) {
	    var maxChars = 41;
	    if (str.length < maxChars) {
	        return str;
	    }
	    return str.substr(0, maxChars - 3) + "...";
	}

	function longStackTracesIsSupported() {
	    return typeof captureStackTrace === "function";
	}

	var shouldIgnore = function() { return false; };
	var parseLineInfoRegex = /[\/<\(]([^:\/]+):(\d+):(?:\d+)\)?\s*$/;
	function parseLineInfo(line) {
	    var matches = line.match(parseLineInfoRegex);
	    if (matches) {
	        return {
	            fileName: matches[1],
	            line: parseInt(matches[2], 10)
	        };
	    }
	}

	function setBounds(firstLineError, lastLineError) {
	    if (!longStackTracesIsSupported()) return;
	    var firstStackLines = (firstLineError.stack || "").split("\n");
	    var lastStackLines = (lastLineError.stack || "").split("\n");
	    var firstIndex = -1;
	    var lastIndex = -1;
	    var firstFileName;
	    var lastFileName;
	    for (var i = 0; i < firstStackLines.length; ++i) {
	        var result = parseLineInfo(firstStackLines[i]);
	        if (result) {
	            firstFileName = result.fileName;
	            firstIndex = result.line;
	            break;
	        }
	    }
	    for (var i = 0; i < lastStackLines.length; ++i) {
	        var result = parseLineInfo(lastStackLines[i]);
	        if (result) {
	            lastFileName = result.fileName;
	            lastIndex = result.line;
	            break;
	        }
	    }
	    if (firstIndex < 0 || lastIndex < 0 || !firstFileName || !lastFileName ||
	        firstFileName !== lastFileName || firstIndex >= lastIndex) {
	        return;
	    }

	    shouldIgnore = function(line) {
	        if (bluebirdFramePattern.test(line)) return true;
	        var info = parseLineInfo(line);
	        if (info) {
	            if (info.fileName === firstFileName &&
	                (firstIndex <= info.line && info.line <= lastIndex)) {
	                return true;
	            }
	        }
	        return false;
	    };
	}

	function CapturedTrace(parent) {
	    this._parent = parent;
	    this._promisesCreated = 0;
	    var length = this._length = 1 + (parent === undefined ? 0 : parent._length);
	    captureStackTrace(this, CapturedTrace);
	    if (length > 32) this.uncycle();
	}
	util$1.inherits(CapturedTrace, Error);
	Context.CapturedTrace = CapturedTrace;

	CapturedTrace.prototype.uncycle = function() {
	    var length = this._length;
	    if (length < 2) return;
	    var nodes = [];
	    var stackToIndex = {};

	    for (var i = 0, node = this; node !== undefined; ++i) {
	        nodes.push(node);
	        node = node._parent;
	    }
	    length = this._length = i;
	    for (var i = length - 1; i >= 0; --i) {
	        var stack = nodes[i].stack;
	        if (stackToIndex[stack] === undefined) {
	            stackToIndex[stack] = i;
	        }
	    }
	    for (var i = 0; i < length; ++i) {
	        var currentStack = nodes[i].stack;
	        var index = stackToIndex[currentStack];
	        if (index !== undefined && index !== i) {
	            if (index > 0) {
	                nodes[index - 1]._parent = undefined;
	                nodes[index - 1]._length = 1;
	            }
	            nodes[i]._parent = undefined;
	            nodes[i]._length = 1;
	            var cycleEdgeNode = i > 0 ? nodes[i - 1] : this;

	            if (index < length - 1) {
	                cycleEdgeNode._parent = nodes[index + 1];
	                cycleEdgeNode._parent.uncycle();
	                cycleEdgeNode._length =
	                    cycleEdgeNode._parent._length + 1;
	            } else {
	                cycleEdgeNode._parent = undefined;
	                cycleEdgeNode._length = 1;
	            }
	            var currentChildLength = cycleEdgeNode._length + 1;
	            for (var j = i - 2; j >= 0; --j) {
	                nodes[j]._length = currentChildLength;
	                currentChildLength++;
	            }
	            return;
	        }
	    }
	};

	CapturedTrace.prototype.attachExtraTrace = function(error) {
	    if (error.__stackCleaned__) return;
	    this.uncycle();
	    var parsed = parseStackAndMessage(error);
	    var message = parsed.message;
	    var stacks = [parsed.stack];

	    var trace = this;
	    while (trace !== undefined) {
	        stacks.push(cleanStack(trace.stack.split("\n")));
	        trace = trace._parent;
	    }
	    removeCommonRoots(stacks);
	    removeDuplicateOrEmptyJumps(stacks);
	    util$1.notEnumerableProp(error, "stack", reconstructStack(message, stacks));
	    util$1.notEnumerableProp(error, "__stackCleaned__", true);
	};

	var captureStackTrace = (function stackDetection() {
	    var v8stackFramePattern = /^\s*at\s*/;
	    var v8stackFormatter = function(stack, error) {
	        if (typeof stack === "string") return stack;

	        if (error.name !== undefined &&
	            error.message !== undefined) {
	            return error.toString();
	        }
	        return formatNonError(error);
	    };

	    if (typeof Error.stackTraceLimit === "number" &&
	        typeof Error.captureStackTrace === "function") {
	        Error.stackTraceLimit += 6;
	        stackFramePattern = v8stackFramePattern;
	        formatStack = v8stackFormatter;
	        var captureStackTrace = Error.captureStackTrace;

	        shouldIgnore = function(line) {
	            return bluebirdFramePattern.test(line);
	        };
	        return function(receiver, ignoreUntil) {
	            Error.stackTraceLimit += 6;
	            captureStackTrace(receiver, ignoreUntil);
	            Error.stackTraceLimit -= 6;
	        };
	    }
	    var err = new Error();

	    if (typeof err.stack === "string" &&
	        err.stack.split("\n")[0].indexOf("stackDetection@") >= 0) {
	        stackFramePattern = /@/;
	        formatStack = v8stackFormatter;
	        indentStackFrames = true;
	        return function captureStackTrace(o) {
	            o.stack = new Error().stack;
	        };
	    }

	    var hasStackAfterThrow;
	    try { throw new Error(); }
	    catch(e) {
	        hasStackAfterThrow = ("stack" in e);
	    }
	    if (!("stack" in err) && hasStackAfterThrow &&
	        typeof Error.stackTraceLimit === "number") {
	        stackFramePattern = v8stackFramePattern;
	        formatStack = v8stackFormatter;
	        return function captureStackTrace(o) {
	            Error.stackTraceLimit += 6;
	            try { throw new Error(); }
	            catch(e) { o.stack = e.stack; }
	            Error.stackTraceLimit -= 6;
	        };
	    }

	    formatStack = function(stack, error) {
	        if (typeof stack === "string") return stack;

	        if ((typeof error === "object" ||
	            typeof error === "function") &&
	            error.name !== undefined &&
	            error.message !== undefined) {
	            return error.toString();
	        }
	        return formatNonError(error);
	    };

	    return null;

	})();

	if (typeof console !== "undefined" && typeof console.warn !== "undefined") {
	    printWarning = function (message) {
	        console.warn(message);
	    };
	    if (util$1.isNode && process.stderr.isTTY) {
	        printWarning = function(message, isSoft) {
	            var color = isSoft ? "\u001b[33m" : "\u001b[31m";
	            console.warn(color + message + "\u001b[0m\n");
	        };
	    } else if (!util$1.isNode && typeof (new Error().stack) === "string") {
	        printWarning = function(message, isSoft) {
	            console.warn("%c" + message,
	                        isSoft ? "color: darkorange" : "color: red");
	        };
	    }
	}

	var config = {
	    warnings: warnings,
	    longStackTraces: false,
	    cancellation: false,
	    monitoring: false
	};

	if (longStackTraces) Promise.longStackTraces();

	return {
	    longStackTraces: function() {
	        return config.longStackTraces;
	    },
	    warnings: function() {
	        return config.warnings;
	    },
	    cancellation: function() {
	        return config.cancellation;
	    },
	    monitoring: function() {
	        return config.monitoring;
	    },
	    propagateFromFunction: function() {
	        return propagateFromFunction;
	    },
	    boundValueFunction: function() {
	        return boundValueFunction;
	    },
	    checkForgottenReturns: checkForgottenReturns,
	    setBounds: setBounds,
	    warn: warn,
	    deprecated: deprecated,
	    CapturedTrace: CapturedTrace,
	    fireDomEvent: fireDomEvent,
	    fireGlobalEvent: fireGlobalEvent
	};
	};

	var catch_filter = function(NEXT_FILTER) {
	var util$1 = util;
	var getKeys = es5.keys;
	var tryCatch = util$1.tryCatch;
	var errorObj = util$1.errorObj;

	function catchFilter(instances, cb, promise) {
	    return function(e) {
	        var boundTo = promise._boundValue();
	        predicateLoop: for (var i = 0; i < instances.length; ++i) {
	            var item = instances[i];

	            if (item === Error ||
	                (item != null && item.prototype instanceof Error)) {
	                if (e instanceof item) {
	                    return tryCatch(cb).call(boundTo, e);
	                }
	            } else if (typeof item === "function") {
	                var matchesPredicate = tryCatch(item).call(boundTo, e);
	                if (matchesPredicate === errorObj) {
	                    return matchesPredicate;
	                } else if (matchesPredicate) {
	                    return tryCatch(cb).call(boundTo, e);
	                }
	            } else if (util$1.isObject(e)) {
	                var keys = getKeys(item);
	                for (var j = 0; j < keys.length; ++j) {
	                    var key = keys[j];
	                    if (item[key] != e[key]) {
	                        continue predicateLoop;
	                    }
	                }
	                return tryCatch(cb).call(boundTo, e);
	            }
	        }
	        return NEXT_FILTER;
	    };
	}

	return catchFilter;
	};

	var _finally = function(Promise, tryConvertToPromise, NEXT_FILTER) {
	var util$1 = util;
	var CancellationError = Promise.CancellationError;
	var errorObj = util$1.errorObj;
	var catchFilter = catch_filter(NEXT_FILTER);

	function PassThroughHandlerContext(promise, type, handler) {
	    this.promise = promise;
	    this.type = type;
	    this.handler = handler;
	    this.called = false;
	    this.cancelPromise = null;
	}

	PassThroughHandlerContext.prototype.isFinallyHandler = function() {
	    return this.type === 0;
	};

	function FinallyHandlerCancelReaction(finallyHandler) {
	    this.finallyHandler = finallyHandler;
	}

	FinallyHandlerCancelReaction.prototype._resultCancelled = function() {
	    checkCancel(this.finallyHandler);
	};

	function checkCancel(ctx, reason) {
	    if (ctx.cancelPromise != null) {
	        if (arguments.length > 1) {
	            ctx.cancelPromise._reject(reason);
	        } else {
	            ctx.cancelPromise._cancel();
	        }
	        ctx.cancelPromise = null;
	        return true;
	    }
	    return false;
	}

	function succeed() {
	    return finallyHandler.call(this, this.promise._target()._settledValue());
	}
	function fail(reason) {
	    if (checkCancel(this, reason)) return;
	    errorObj.e = reason;
	    return errorObj;
	}
	function finallyHandler(reasonOrValue) {
	    var promise = this.promise;
	    var handler = this.handler;

	    if (!this.called) {
	        this.called = true;
	        var ret = this.isFinallyHandler()
	            ? handler.call(promise._boundValue())
	            : handler.call(promise._boundValue(), reasonOrValue);
	        if (ret === NEXT_FILTER) {
	            return ret;
	        } else if (ret !== undefined) {
	            promise._setReturnedNonUndefined();
	            var maybePromise = tryConvertToPromise(ret, promise);
	            if (maybePromise instanceof Promise) {
	                if (this.cancelPromise != null) {
	                    if (maybePromise._isCancelled()) {
	                        var reason =
	                            new CancellationError("late cancellation observer");
	                        promise._attachExtraTrace(reason);
	                        errorObj.e = reason;
	                        return errorObj;
	                    } else if (maybePromise.isPending()) {
	                        maybePromise._attachCancellationCallback(
	                            new FinallyHandlerCancelReaction(this));
	                    }
	                }
	                return maybePromise._then(
	                    succeed, fail, undefined, this, undefined);
	            }
	        }
	    }

	    if (promise.isRejected()) {
	        checkCancel(this);
	        errorObj.e = reasonOrValue;
	        return errorObj;
	    } else {
	        checkCancel(this);
	        return reasonOrValue;
	    }
	}

	Promise.prototype._passThrough = function(handler, type, success, fail) {
	    if (typeof handler !== "function") return this.then();
	    return this._then(success,
	                      fail,
	                      undefined,
	                      new PassThroughHandlerContext(this, type, handler),
	                      undefined);
	};

	Promise.prototype.lastly =
	Promise.prototype["finally"] = function (handler) {
	    return this._passThrough(handler,
	                             0,
	                             finallyHandler,
	                             finallyHandler);
	};


	Promise.prototype.tap = function (handler) {
	    return this._passThrough(handler, 1, finallyHandler);
	};

	Promise.prototype.tapCatch = function (handlerOrPredicate) {
	    var len = arguments.length;
	    if(len === 1) {
	        return this._passThrough(handlerOrPredicate,
	                                 1,
	                                 undefined,
	                                 finallyHandler);
	    } else {
	         var catchInstances = new Array(len - 1),
	            j = 0, i;
	        for (i = 0; i < len - 1; ++i) {
	            var item = arguments[i];
	            if (util$1.isObject(item)) {
	                catchInstances[j++] = item;
	            } else {
	                return Promise.reject(new TypeError(
	                    "tapCatch statement predicate: "
	                    + "expecting an object but got " + util$1.classString(item)
	                ));
	            }
	        }
	        catchInstances.length = j;
	        var handler = arguments[i];
	        return this._passThrough(catchFilter(catchInstances, handler, this),
	                                 1,
	                                 undefined,
	                                 finallyHandler);
	    }

	};

	return PassThroughHandlerContext;
	};

	var maybeWrapAsError$1 = util.maybeWrapAsError;

	var OperationalError$1 = errors.OperationalError;


	function isUntypedError(obj) {
	    return obj instanceof Error &&
	        es5.getPrototypeOf(obj) === Error.prototype;
	}

	var rErrorKey = /^(?:name|message|stack|cause)$/;
	function wrapAsOperationalError(obj) {
	    var ret;
	    if (isUntypedError(obj)) {
	        ret = new OperationalError$1(obj);
	        ret.name = obj.name;
	        ret.message = obj.message;
	        ret.stack = obj.stack;
	        var keys = es5.keys(obj);
	        for (var i = 0; i < keys.length; ++i) {
	            var key = keys[i];
	            if (!rErrorKey.test(key)) {
	                ret[key] = obj[key];
	            }
	        }
	        return ret;
	    }
	    util.markAsOriginatingFromRejection(obj);
	    return obj;
	}

	function nodebackForPromise(promise, multiArgs) {
	    return function(err, value) {
	        if (promise === null) return;
	        if (err) {
	            var wrapped = wrapAsOperationalError(maybeWrapAsError$1(err));
	            promise._attachExtraTrace(wrapped);
	            promise._reject(wrapped);
	        } else if (!multiArgs) {
	            promise._fulfill(value);
	        } else {
	            var $_len = arguments.length;var args = new Array(Math.max($_len - 1, 0)); for(var $_i = 1; $_i < $_len; ++$_i) {args[$_i - 1] = arguments[$_i];}            promise._fulfill(args);
	        }
	        promise = null;
	    };
	}

	var nodeback = nodebackForPromise;

	var method =
	function(Promise, INTERNAL, tryConvertToPromise, apiRejection, debug) {
	var util$1 = util;
	var tryCatch = util$1.tryCatch;

	Promise.method = function (fn) {
	    if (typeof fn !== "function") {
	        throw new Promise.TypeError("expecting a function but got " + util$1.classString(fn));
	    }
	    return function () {
	        var ret = new Promise(INTERNAL);
	        ret._captureStackTrace();
	        ret._pushContext();
	        var value = tryCatch(fn).apply(this, arguments);
	        var promiseCreated = ret._popContext();
	        debug.checkForgottenReturns(
	            value, promiseCreated, "Promise.method", ret);
	        ret._resolveFromSyncValue(value);
	        return ret;
	    };
	};

	Promise.attempt = Promise["try"] = function (fn) {
	    if (typeof fn !== "function") {
	        return apiRejection("expecting a function but got " + util$1.classString(fn));
	    }
	    var ret = new Promise(INTERNAL);
	    ret._captureStackTrace();
	    ret._pushContext();
	    var value;
	    if (arguments.length > 1) {
	        debug.deprecated("calling Promise.try with more than 1 argument");
	        var arg = arguments[1];
	        var ctx = arguments[2];
	        value = util$1.isArray(arg) ? tryCatch(fn).apply(ctx, arg)
	                                  : tryCatch(fn).call(ctx, arg);
	    } else {
	        value = tryCatch(fn)();
	    }
	    var promiseCreated = ret._popContext();
	    debug.checkForgottenReturns(
	        value, promiseCreated, "Promise.try", ret);
	    ret._resolveFromSyncValue(value);
	    return ret;
	};

	Promise.prototype._resolveFromSyncValue = function (value) {
	    if (value === util$1.errorObj) {
	        this._rejectCallback(value.e, false);
	    } else {
	        this._resolveCallback(value, true);
	    }
	};
	};

	var bind = function(Promise, INTERNAL, tryConvertToPromise, debug) {
	var calledBind = false;
	var rejectThis = function(_, e) {
	    this._reject(e);
	};

	var targetRejected = function(e, context) {
	    context.promiseRejectionQueued = true;
	    context.bindingPromise._then(rejectThis, rejectThis, null, this, e);
	};

	var bindingResolved = function(thisArg, context) {
	    if (((this._bitField & 50397184) === 0)) {
	        this._resolveCallback(context.target);
	    }
	};

	var bindingRejected = function(e, context) {
	    if (!context.promiseRejectionQueued) this._reject(e);
	};

	Promise.prototype.bind = function (thisArg) {
	    if (!calledBind) {
	        calledBind = true;
	        Promise.prototype._propagateFrom = debug.propagateFromFunction();
	        Promise.prototype._boundValue = debug.boundValueFunction();
	    }
	    var maybePromise = tryConvertToPromise(thisArg);
	    var ret = new Promise(INTERNAL);
	    ret._propagateFrom(this, 1);
	    var target = this._target();
	    ret._setBoundTo(maybePromise);
	    if (maybePromise instanceof Promise) {
	        var context = {
	            promiseRejectionQueued: false,
	            promise: ret,
	            target: target,
	            bindingPromise: maybePromise
	        };
	        target._then(INTERNAL, targetRejected, undefined, ret, context);
	        maybePromise._then(
	            bindingResolved, bindingRejected, undefined, ret, context);
	        ret._setOnCancel(maybePromise);
	    } else {
	        ret._resolveCallback(target);
	    }
	    return ret;
	};

	Promise.prototype._setBoundTo = function (obj) {
	    if (obj !== undefined) {
	        this._bitField = this._bitField | 2097152;
	        this._boundTo = obj;
	    } else {
	        this._bitField = this._bitField & (~2097152);
	    }
	};

	Promise.prototype._isBound = function () {
	    return (this._bitField & 2097152) === 2097152;
	};

	Promise.bind = function (thisArg, value) {
	    return Promise.resolve(value).bind(thisArg);
	};
	};

	var cancel = function(Promise, PromiseArray, apiRejection, debug) {
	var util$1 = util;
	var tryCatch = util$1.tryCatch;
	var errorObj = util$1.errorObj;
	var async = Promise._async;

	Promise.prototype["break"] = Promise.prototype.cancel = function() {
	    if (!debug.cancellation()) return this._warn("cancellation is disabled");

	    var promise = this;
	    var child = promise;
	    while (promise._isCancellable()) {
	        if (!promise._cancelBy(child)) {
	            if (child._isFollowing()) {
	                child._followee().cancel();
	            } else {
	                child._cancelBranched();
	            }
	            break;
	        }

	        var parent = promise._cancellationParent;
	        if (parent == null || !parent._isCancellable()) {
	            if (promise._isFollowing()) {
	                promise._followee().cancel();
	            } else {
	                promise._cancelBranched();
	            }
	            break;
	        } else {
	            if (promise._isFollowing()) promise._followee().cancel();
	            promise._setWillBeCancelled();
	            child = promise;
	            promise = parent;
	        }
	    }
	};

	Promise.prototype._branchHasCancelled = function() {
	    this._branchesRemainingToCancel--;
	};

	Promise.prototype._enoughBranchesHaveCancelled = function() {
	    return this._branchesRemainingToCancel === undefined ||
	           this._branchesRemainingToCancel <= 0;
	};

	Promise.prototype._cancelBy = function(canceller) {
	    if (canceller === this) {
	        this._branchesRemainingToCancel = 0;
	        this._invokeOnCancel();
	        return true;
	    } else {
	        this._branchHasCancelled();
	        if (this._enoughBranchesHaveCancelled()) {
	            this._invokeOnCancel();
	            return true;
	        }
	    }
	    return false;
	};

	Promise.prototype._cancelBranched = function() {
	    if (this._enoughBranchesHaveCancelled()) {
	        this._cancel();
	    }
	};

	Promise.prototype._cancel = function() {
	    if (!this._isCancellable()) return;
	    this._setCancelled();
	    async.invoke(this._cancelPromises, this, undefined);
	};

	Promise.prototype._cancelPromises = function() {
	    if (this._length() > 0) this._settlePromises();
	};

	Promise.prototype._unsetOnCancel = function() {
	    this._onCancelField = undefined;
	};

	Promise.prototype._isCancellable = function() {
	    return this.isPending() && !this._isCancelled();
	};

	Promise.prototype.isCancellable = function() {
	    return this.isPending() && !this.isCancelled();
	};

	Promise.prototype._doInvokeOnCancel = function(onCancelCallback, internalOnly) {
	    if (util$1.isArray(onCancelCallback)) {
	        for (var i = 0; i < onCancelCallback.length; ++i) {
	            this._doInvokeOnCancel(onCancelCallback[i], internalOnly);
	        }
	    } else if (onCancelCallback !== undefined) {
	        if (typeof onCancelCallback === "function") {
	            if (!internalOnly) {
	                var e = tryCatch(onCancelCallback).call(this._boundValue());
	                if (e === errorObj) {
	                    this._attachExtraTrace(e.e);
	                    async.throwLater(e.e);
	                }
	            }
	        } else {
	            onCancelCallback._resultCancelled(this);
	        }
	    }
	};

	Promise.prototype._invokeOnCancel = function() {
	    var onCancelCallback = this._onCancel();
	    this._unsetOnCancel();
	    async.invoke(this._doInvokeOnCancel, this, onCancelCallback);
	};

	Promise.prototype._invokeInternalOnCancel = function() {
	    if (this._isCancellable()) {
	        this._doInvokeOnCancel(this._onCancel(), true);
	        this._unsetOnCancel();
	    }
	};

	Promise.prototype._resultCancelled = function() {
	    this.cancel();
	};

	};

	var direct_resolve = function(Promise) {
	function returner() {
	    return this.value;
	}
	function thrower() {
	    throw this.reason;
	}

	Promise.prototype["return"] =
	Promise.prototype.thenReturn = function (value) {
	    if (value instanceof Promise) value.suppressUnhandledRejections();
	    return this._then(
	        returner, undefined, undefined, {value: value}, undefined);
	};

	Promise.prototype["throw"] =
	Promise.prototype.thenThrow = function (reason) {
	    return this._then(
	        thrower, undefined, undefined, {reason: reason}, undefined);
	};

	Promise.prototype.catchThrow = function (reason) {
	    if (arguments.length <= 1) {
	        return this._then(
	            undefined, thrower, undefined, {reason: reason}, undefined);
	    } else {
	        var _reason = arguments[1];
	        var handler = function() {throw _reason;};
	        return this.caught(reason, handler);
	    }
	};

	Promise.prototype.catchReturn = function (value) {
	    if (arguments.length <= 1) {
	        if (value instanceof Promise) value.suppressUnhandledRejections();
	        return this._then(
	            undefined, returner, undefined, {value: value}, undefined);
	    } else {
	        var _value = arguments[1];
	        if (_value instanceof Promise) _value.suppressUnhandledRejections();
	        var handler = function() {return _value;};
	        return this.caught(value, handler);
	    }
	};
	};

	var synchronous_inspection = function(Promise) {
	function PromiseInspection(promise) {
	    if (promise !== undefined) {
	        promise = promise._target();
	        this._bitField = promise._bitField;
	        this._settledValueField = promise._isFateSealed()
	            ? promise._settledValue() : undefined;
	    }
	    else {
	        this._bitField = 0;
	        this._settledValueField = undefined;
	    }
	}

	PromiseInspection.prototype._settledValue = function() {
	    return this._settledValueField;
	};

	var value = PromiseInspection.prototype.value = function () {
	    if (!this.isFulfilled()) {
	        throw new TypeError("cannot get fulfillment value of a non-fulfilled promise\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	    }
	    return this._settledValue();
	};

	var reason = PromiseInspection.prototype.error =
	PromiseInspection.prototype.reason = function () {
	    if (!this.isRejected()) {
	        throw new TypeError("cannot get rejection reason of a non-rejected promise\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	    }
	    return this._settledValue();
	};

	var isFulfilled = PromiseInspection.prototype.isFulfilled = function() {
	    return (this._bitField & 33554432) !== 0;
	};

	var isRejected = PromiseInspection.prototype.isRejected = function () {
	    return (this._bitField & 16777216) !== 0;
	};

	var isPending = PromiseInspection.prototype.isPending = function () {
	    return (this._bitField & 50397184) === 0;
	};

	var isResolved = PromiseInspection.prototype.isResolved = function () {
	    return (this._bitField & 50331648) !== 0;
	};

	PromiseInspection.prototype.isCancelled = function() {
	    return (this._bitField & 8454144) !== 0;
	};

	Promise.prototype.__isCancelled = function() {
	    return (this._bitField & 65536) === 65536;
	};

	Promise.prototype._isCancelled = function() {
	    return this._target().__isCancelled();
	};

	Promise.prototype.isCancelled = function() {
	    return (this._target()._bitField & 8454144) !== 0;
	};

	Promise.prototype.isPending = function() {
	    return isPending.call(this._target());
	};

	Promise.prototype.isRejected = function() {
	    return isRejected.call(this._target());
	};

	Promise.prototype.isFulfilled = function() {
	    return isFulfilled.call(this._target());
	};

	Promise.prototype.isResolved = function() {
	    return isResolved.call(this._target());
	};

	Promise.prototype.value = function() {
	    return value.call(this._target());
	};

	Promise.prototype.reason = function() {
	    var target = this._target();
	    target._unsetRejectionIsUnhandled();
	    return reason.call(target);
	};

	Promise.prototype._value = function() {
	    return this._settledValue();
	};

	Promise.prototype._reason = function() {
	    this._unsetRejectionIsUnhandled();
	    return this._settledValue();
	};

	Promise.PromiseInspection = PromiseInspection;
	};

	var join =
	function(Promise, PromiseArray, tryConvertToPromise, INTERNAL, async,
	         getDomain) {
	var util$1 = util;
	var canEvaluate = util$1.canEvaluate;
	var tryCatch = util$1.tryCatch;
	var errorObj = util$1.errorObj;
	var reject;

	{
	if (canEvaluate) {
	    var thenCallback = function(i) {
	        return new Function("value", "holder", "                             \n\
            'use strict';                                                    \n\
            holder.pIndex = value;                                           \n\
            holder.checkFulfillment(this);                                   \n\
            ".replace(/Index/g, i));
	    };

	    var promiseSetter = function(i) {
	        return new Function("promise", "holder", "                           \n\
            'use strict';                                                    \n\
            holder.pIndex = promise;                                         \n\
            ".replace(/Index/g, i));
	    };

	    var generateHolderClass = function(total) {
	        var props = new Array(total);
	        for (var i = 0; i < props.length; ++i) {
	            props[i] = "this.p" + (i+1);
	        }
	        var assignment = props.join(" = ") + " = null;";
	        var cancellationCode= "var promise;\n" + props.map(function(prop) {
	            return "                                                         \n\
                promise = " + prop + ";                                      \n\
                if (promise instanceof Promise) {                            \n\
                    promise.cancel();                                        \n\
                }                                                            \n\
            ";
	        }).join("\n");
	        var passedArguments = props.join(", ");
	        var name = "Holder$" + total;


	        var code = "return function(tryCatch, errorObj, Promise, async) {    \n\
            'use strict';                                                    \n\
            function [TheName](fn) {                                         \n\
                [TheProperties]                                              \n\
                this.fn = fn;                                                \n\
                this.asyncNeeded = true;                                     \n\
                this.now = 0;                                                \n\
            }                                                                \n\
                                                                             \n\
            [TheName].prototype._callFunction = function(promise) {          \n\
                promise._pushContext();                                      \n\
                var ret = tryCatch(this.fn)([ThePassedArguments]);           \n\
                promise._popContext();                                       \n\
                if (ret === errorObj) {                                      \n\
                    promise._rejectCallback(ret.e, false);                   \n\
                } else {                                                     \n\
                    promise._resolveCallback(ret);                           \n\
                }                                                            \n\
            };                                                               \n\
                                                                             \n\
            [TheName].prototype.checkFulfillment = function(promise) {       \n\
                var now = ++this.now;                                        \n\
                if (now === [TheTotal]) {                                    \n\
                    if (this.asyncNeeded) {                                  \n\
                        async.invoke(this._callFunction, this, promise);     \n\
                    } else {                                                 \n\
                        this._callFunction(promise);                         \n\
                    }                                                        \n\
                                                                             \n\
                }                                                            \n\
            };                                                               \n\
                                                                             \n\
            [TheName].prototype._resultCancelled = function() {              \n\
                [CancellationCode]                                           \n\
            };                                                               \n\
                                                                             \n\
            return [TheName];                                                \n\
        }(tryCatch, errorObj, Promise, async);                               \n\
        ";

	        code = code.replace(/\[TheName\]/g, name)
	            .replace(/\[TheTotal\]/g, total)
	            .replace(/\[ThePassedArguments\]/g, passedArguments)
	            .replace(/\[TheProperties\]/g, assignment)
	            .replace(/\[CancellationCode\]/g, cancellationCode);

	        return new Function("tryCatch", "errorObj", "Promise", "async", code)
	                           (tryCatch, errorObj, Promise, async);
	    };

	    var holderClasses = [];
	    var thenCallbacks = [];
	    var promiseSetters = [];

	    for (var i = 0; i < 8; ++i) {
	        holderClasses.push(generateHolderClass(i + 1));
	        thenCallbacks.push(thenCallback(i + 1));
	        promiseSetters.push(promiseSetter(i + 1));
	    }

	    reject = function (reason) {
	        this._reject(reason);
	    };
	}}

	Promise.join = function () {
	    var last = arguments.length - 1;
	    var fn;
	    if (last > 0 && typeof arguments[last] === "function") {
	        fn = arguments[last];
	        {
	            if (last <= 8 && canEvaluate) {
	                var ret = new Promise(INTERNAL);
	                ret._captureStackTrace();
	                var HolderClass = holderClasses[last - 1];
	                var holder = new HolderClass(fn);
	                var callbacks = thenCallbacks;

	                for (var i = 0; i < last; ++i) {
	                    var maybePromise = tryConvertToPromise(arguments[i], ret);
	                    if (maybePromise instanceof Promise) {
	                        maybePromise = maybePromise._target();
	                        var bitField = maybePromise._bitField;
	                        if (((bitField & 50397184) === 0)) {
	                            maybePromise._then(callbacks[i], reject,
	                                               undefined, ret, holder);
	                            promiseSetters[i](maybePromise, holder);
	                            holder.asyncNeeded = false;
	                        } else if (((bitField & 33554432) !== 0)) {
	                            callbacks[i].call(ret,
	                                              maybePromise._value(), holder);
	                        } else if (((bitField & 16777216) !== 0)) {
	                            ret._reject(maybePromise._reason());
	                        } else {
	                            ret._cancel();
	                        }
	                    } else {
	                        callbacks[i].call(ret, maybePromise, holder);
	                    }
	                }

	                if (!ret._isFateSealed()) {
	                    if (holder.asyncNeeded) {
	                        var domain = getDomain();
	                        if (domain !== null) {
	                            holder.fn = util$1.domainBind(domain, holder.fn);
	                        }
	                    }
	                    ret._setAsyncGuaranteed();
	                    ret._setOnCancel(holder);
	                }
	                return ret;
	            }
	        }
	    }
	    var $_len = arguments.length;var args = new Array($_len); for(var $_i = 0; $_i < $_len; ++$_i) {args[$_i] = arguments[$_i];}    if (fn) args.pop();
	    var ret = new PromiseArray(args).promise();
	    return fn !== undefined ? ret.spread(fn) : ret;
	};

	};

	var cr = Object.create;
	if (cr) {
	    var callerCache = cr(null);
	    var getterCache = cr(null);
	    callerCache[" size"] = getterCache[" size"] = 0;
	}

	var call_get = function(Promise) {
	var util$1 = util;
	var canEvaluate = util$1.canEvaluate;
	var isIdentifier = util$1.isIdentifier;

	var getMethodCaller;
	var getGetter;
	{
	var makeMethodCaller = function (methodName) {
	    return new Function("ensureMethod", "                                    \n\
        return function(obj) {                                               \n\
            'use strict'                                                     \n\
            var len = this.length;                                           \n\
            ensureMethod(obj, 'methodName');                                 \n\
            switch(len) {                                                    \n\
                case 1: return obj.methodName(this[0]);                      \n\
                case 2: return obj.methodName(this[0], this[1]);             \n\
                case 3: return obj.methodName(this[0], this[1], this[2]);    \n\
                case 0: return obj.methodName();                             \n\
                default:                                                     \n\
                    return obj.methodName.apply(obj, this);                  \n\
            }                                                                \n\
        };                                                                   \n\
        ".replace(/methodName/g, methodName))(ensureMethod);
	};

	var makeGetter = function (propertyName) {
	    return new Function("obj", "                                             \n\
        'use strict';                                                        \n\
        return obj.propertyName;                                             \n\
        ".replace("propertyName", propertyName));
	};

	var getCompiled = function(name, compiler, cache) {
	    var ret = cache[name];
	    if (typeof ret !== "function") {
	        if (!isIdentifier(name)) {
	            return null;
	        }
	        ret = compiler(name);
	        cache[name] = ret;
	        cache[" size"]++;
	        if (cache[" size"] > 512) {
	            var keys = Object.keys(cache);
	            for (var i = 0; i < 256; ++i) delete cache[keys[i]];
	            cache[" size"] = keys.length - 256;
	        }
	    }
	    return ret;
	};

	getMethodCaller = function(name) {
	    return getCompiled(name, makeMethodCaller, callerCache);
	};

	getGetter = function(name) {
	    return getCompiled(name, makeGetter, getterCache);
	};
	}

	function ensureMethod(obj, methodName) {
	    var fn;
	    if (obj != null) fn = obj[methodName];
	    if (typeof fn !== "function") {
	        var message = "Object " + util$1.classString(obj) + " has no method '" +
	            util$1.toString(methodName) + "'";
	        throw new Promise.TypeError(message);
	    }
	    return fn;
	}

	function caller(obj) {
	    var methodName = this.pop();
	    var fn = ensureMethod(obj, methodName);
	    return fn.apply(obj, this);
	}
	Promise.prototype.call = function (methodName) {
	    var $_len = arguments.length;var args = new Array(Math.max($_len - 1, 0)); for(var $_i = 1; $_i < $_len; ++$_i) {args[$_i - 1] = arguments[$_i];}    {
	        if (canEvaluate) {
	            var maybeCaller = getMethodCaller(methodName);
	            if (maybeCaller !== null) {
	                return this._then(
	                    maybeCaller, undefined, undefined, args, undefined);
	            }
	        }
	    }
	    args.push(methodName);
	    return this._then(caller, undefined, undefined, args, undefined);
	};

	function namedGetter(obj) {
	    return obj[this];
	}
	function indexedGetter(obj) {
	    var index = +this;
	    if (index < 0) index = Math.max(0, index + obj.length);
	    return obj[index];
	}
	Promise.prototype.get = function (propertyName) {
	    var isIndex = (typeof propertyName === "number");
	    var getter;
	    if (!isIndex) {
	        if (canEvaluate) {
	            var maybeGetter = getGetter(propertyName);
	            getter = maybeGetter !== null ? maybeGetter : namedGetter;
	        } else {
	            getter = namedGetter;
	        }
	    } else {
	        getter = indexedGetter;
	    }
	    return this._then(getter, undefined, undefined, propertyName, undefined);
	};
	};

	var generators = function(Promise,
	                          apiRejection,
	                          INTERNAL,
	                          tryConvertToPromise,
	                          Proxyable,
	                          debug) {
	var errors$1 = errors;
	var TypeError = errors$1.TypeError;
	var util$1 = util;
	var errorObj = util$1.errorObj;
	var tryCatch = util$1.tryCatch;
	var yieldHandlers = [];

	function promiseFromYieldHandler(value, yieldHandlers, traceParent) {
	    for (var i = 0; i < yieldHandlers.length; ++i) {
	        traceParent._pushContext();
	        var result = tryCatch(yieldHandlers[i])(value);
	        traceParent._popContext();
	        if (result === errorObj) {
	            traceParent._pushContext();
	            var ret = Promise.reject(errorObj.e);
	            traceParent._popContext();
	            return ret;
	        }
	        var maybePromise = tryConvertToPromise(result, traceParent);
	        if (maybePromise instanceof Promise) return maybePromise;
	    }
	    return null;
	}

	function PromiseSpawn(generatorFunction, receiver, yieldHandler, stack) {
	    if (debug.cancellation()) {
	        var internal = new Promise(INTERNAL);
	        var _finallyPromise = this._finallyPromise = new Promise(INTERNAL);
	        this._promise = internal.lastly(function() {
	            return _finallyPromise;
	        });
	        internal._captureStackTrace();
	        internal._setOnCancel(this);
	    } else {
	        var promise = this._promise = new Promise(INTERNAL);
	        promise._captureStackTrace();
	    }
	    this._stack = stack;
	    this._generatorFunction = generatorFunction;
	    this._receiver = receiver;
	    this._generator = undefined;
	    this._yieldHandlers = typeof yieldHandler === "function"
	        ? [yieldHandler].concat(yieldHandlers)
	        : yieldHandlers;
	    this._yieldedPromise = null;
	    this._cancellationPhase = false;
	}
	util$1.inherits(PromiseSpawn, Proxyable);

	PromiseSpawn.prototype._isResolved = function() {
	    return this._promise === null;
	};

	PromiseSpawn.prototype._cleanup = function() {
	    this._promise = this._generator = null;
	    if (debug.cancellation() && this._finallyPromise !== null) {
	        this._finallyPromise._fulfill();
	        this._finallyPromise = null;
	    }
	};

	PromiseSpawn.prototype._promiseCancelled = function() {
	    if (this._isResolved()) return;
	    var implementsReturn = typeof this._generator["return"] !== "undefined";

	    var result;
	    if (!implementsReturn) {
	        var reason = new Promise.CancellationError(
	            "generator .return() sentinel");
	        Promise.coroutine.returnSentinel = reason;
	        this._promise._attachExtraTrace(reason);
	        this._promise._pushContext();
	        result = tryCatch(this._generator["throw"]).call(this._generator,
	                                                         reason);
	        this._promise._popContext();
	    } else {
	        this._promise._pushContext();
	        result = tryCatch(this._generator["return"]).call(this._generator,
	                                                          undefined);
	        this._promise._popContext();
	    }
	    this._cancellationPhase = true;
	    this._yieldedPromise = null;
	    this._continue(result);
	};

	PromiseSpawn.prototype._promiseFulfilled = function(value) {
	    this._yieldedPromise = null;
	    this._promise._pushContext();
	    var result = tryCatch(this._generator.next).call(this._generator, value);
	    this._promise._popContext();
	    this._continue(result);
	};

	PromiseSpawn.prototype._promiseRejected = function(reason) {
	    this._yieldedPromise = null;
	    this._promise._attachExtraTrace(reason);
	    this._promise._pushContext();
	    var result = tryCatch(this._generator["throw"])
	        .call(this._generator, reason);
	    this._promise._popContext();
	    this._continue(result);
	};

	PromiseSpawn.prototype._resultCancelled = function() {
	    if (this._yieldedPromise instanceof Promise) {
	        var promise = this._yieldedPromise;
	        this._yieldedPromise = null;
	        promise.cancel();
	    }
	};

	PromiseSpawn.prototype.promise = function () {
	    return this._promise;
	};

	PromiseSpawn.prototype._run = function () {
	    this._generator = this._generatorFunction.call(this._receiver);
	    this._receiver =
	        this._generatorFunction = undefined;
	    this._promiseFulfilled(undefined);
	};

	PromiseSpawn.prototype._continue = function (result) {
	    var promise = this._promise;
	    if (result === errorObj) {
	        this._cleanup();
	        if (this._cancellationPhase) {
	            return promise.cancel();
	        } else {
	            return promise._rejectCallback(result.e, false);
	        }
	    }

	    var value = result.value;
	    if (result.done === true) {
	        this._cleanup();
	        if (this._cancellationPhase) {
	            return promise.cancel();
	        } else {
	            return promise._resolveCallback(value);
	        }
	    } else {
	        var maybePromise = tryConvertToPromise(value, this._promise);
	        if (!(maybePromise instanceof Promise)) {
	            maybePromise =
	                promiseFromYieldHandler(maybePromise,
	                                        this._yieldHandlers,
	                                        this._promise);
	            if (maybePromise === null) {
	                this._promiseRejected(
	                    new TypeError(
	                        "A value %s was yielded that could not be treated as a promise\u000a\u000a    See http://goo.gl/MqrFmX\u000a\u000a".replace("%s", String(value)) +
	                        "From coroutine:\u000a" +
	                        this._stack.split("\n").slice(1, -7).join("\n")
	                    )
	                );
	                return;
	            }
	        }
	        maybePromise = maybePromise._target();
	        var bitField = maybePromise._bitField;
	        if (((bitField & 50397184) === 0)) {
	            this._yieldedPromise = maybePromise;
	            maybePromise._proxy(this, null);
	        } else if (((bitField & 33554432) !== 0)) {
	            Promise._async.invoke(
	                this._promiseFulfilled, this, maybePromise._value()
	            );
	        } else if (((bitField & 16777216) !== 0)) {
	            Promise._async.invoke(
	                this._promiseRejected, this, maybePromise._reason()
	            );
	        } else {
	            this._promiseCancelled();
	        }
	    }
	};

	Promise.coroutine = function (generatorFunction, options) {
	    if (typeof generatorFunction !== "function") {
	        throw new TypeError("generatorFunction must be a function\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	    }
	    var yieldHandler = Object(options).yieldHandler;
	    var PromiseSpawn$ = PromiseSpawn;
	    var stack = new Error().stack;
	    return function () {
	        var generator = generatorFunction.apply(this, arguments);
	        var spawn = new PromiseSpawn$(undefined, undefined, yieldHandler,
	                                      stack);
	        var ret = spawn.promise();
	        spawn._generator = generator;
	        spawn._promiseFulfilled(undefined);
	        return ret;
	    };
	};

	Promise.coroutine.addYieldHandler = function(fn) {
	    if (typeof fn !== "function") {
	        throw new TypeError("expecting a function but got " + util$1.classString(fn));
	    }
	    yieldHandlers.push(fn);
	};

	Promise.spawn = function (generatorFunction) {
	    debug.deprecated("Promise.spawn()", "Promise.coroutine()");
	    if (typeof generatorFunction !== "function") {
	        return apiRejection("generatorFunction must be a function\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	    }
	    var spawn = new PromiseSpawn(generatorFunction, this);
	    var ret = spawn.promise();
	    spawn._run(Promise.spawn);
	    return ret;
	};
	};

	var map = function(Promise,
	                          PromiseArray,
	                          apiRejection,
	                          tryConvertToPromise,
	                          INTERNAL,
	                          debug) {
	var getDomain = Promise._getDomain;
	var util$1 = util;
	var tryCatch = util$1.tryCatch;
	var errorObj = util$1.errorObj;
	var async = Promise._async;

	function MappingPromiseArray(promises, fn, limit, _filter) {
	    this.constructor$(promises);
	    this._promise._captureStackTrace();
	    var domain = getDomain();
	    this._callback = domain === null ? fn : util$1.domainBind(domain, fn);
	    this._preservedValues = _filter === INTERNAL
	        ? new Array(this.length())
	        : null;
	    this._limit = limit;
	    this._inFlight = 0;
	    this._queue = [];
	    async.invoke(this._asyncInit, this, undefined);
	}
	util$1.inherits(MappingPromiseArray, PromiseArray);

	MappingPromiseArray.prototype._asyncInit = function() {
	    this._init$(undefined, -2);
	};

	MappingPromiseArray.prototype._init = function () {};

	MappingPromiseArray.prototype._promiseFulfilled = function (value, index) {
	    var values = this._values;
	    var length = this.length();
	    var preservedValues = this._preservedValues;
	    var limit = this._limit;

	    if (index < 0) {
	        index = (index * -1) - 1;
	        values[index] = value;
	        if (limit >= 1) {
	            this._inFlight--;
	            this._drainQueue();
	            if (this._isResolved()) return true;
	        }
	    } else {
	        if (limit >= 1 && this._inFlight >= limit) {
	            values[index] = value;
	            this._queue.push(index);
	            return false;
	        }
	        if (preservedValues !== null) preservedValues[index] = value;

	        var promise = this._promise;
	        var callback = this._callback;
	        var receiver = promise._boundValue();
	        promise._pushContext();
	        var ret = tryCatch(callback).call(receiver, value, index, length);
	        var promiseCreated = promise._popContext();
	        debug.checkForgottenReturns(
	            ret,
	            promiseCreated,
	            preservedValues !== null ? "Promise.filter" : "Promise.map",
	            promise
	        );
	        if (ret === errorObj) {
	            this._reject(ret.e);
	            return true;
	        }

	        var maybePromise = tryConvertToPromise(ret, this._promise);
	        if (maybePromise instanceof Promise) {
	            maybePromise = maybePromise._target();
	            var bitField = maybePromise._bitField;
	            if (((bitField & 50397184) === 0)) {
	                if (limit >= 1) this._inFlight++;
	                values[index] = maybePromise;
	                maybePromise._proxy(this, (index + 1) * -1);
	                return false;
	            } else if (((bitField & 33554432) !== 0)) {
	                ret = maybePromise._value();
	            } else if (((bitField & 16777216) !== 0)) {
	                this._reject(maybePromise._reason());
	                return true;
	            } else {
	                this._cancel();
	                return true;
	            }
	        }
	        values[index] = ret;
	    }
	    var totalResolved = ++this._totalResolved;
	    if (totalResolved >= length) {
	        if (preservedValues !== null) {
	            this._filter(values, preservedValues);
	        } else {
	            this._resolve(values);
	        }
	        return true;
	    }
	    return false;
	};

	MappingPromiseArray.prototype._drainQueue = function () {
	    var queue = this._queue;
	    var limit = this._limit;
	    var values = this._values;
	    while (queue.length > 0 && this._inFlight < limit) {
	        if (this._isResolved()) return;
	        var index = queue.pop();
	        this._promiseFulfilled(values[index], index);
	    }
	};

	MappingPromiseArray.prototype._filter = function (booleans, values) {
	    var len = values.length;
	    var ret = new Array(len);
	    var j = 0;
	    for (var i = 0; i < len; ++i) {
	        if (booleans[i]) ret[j++] = values[i];
	    }
	    ret.length = j;
	    this._resolve(ret);
	};

	MappingPromiseArray.prototype.preservedValues = function () {
	    return this._preservedValues;
	};

	function map(promises, fn, options, _filter) {
	    if (typeof fn !== "function") {
	        return apiRejection("expecting a function but got " + util$1.classString(fn));
	    }

	    var limit = 0;
	    if (options !== undefined) {
	        if (typeof options === "object" && options !== null) {
	            if (typeof options.concurrency !== "number") {
	                return Promise.reject(
	                    new TypeError("'concurrency' must be a number but it is " +
	                                    util$1.classString(options.concurrency)));
	            }
	            limit = options.concurrency;
	        } else {
	            return Promise.reject(new TypeError(
	                            "options argument must be an object but it is " +
	                             util$1.classString(options)));
	        }
	    }
	    limit = typeof limit === "number" &&
	        isFinite(limit) && limit >= 1 ? limit : 0;
	    return new MappingPromiseArray(promises, fn, limit, _filter).promise();
	}

	Promise.prototype.map = function (fn, options) {
	    return map(this, fn, options, null);
	};

	Promise.map = function (promises, fn, options, _filter) {
	    return map(promises, fn, options, _filter);
	};


	};

	var nodeify = function(Promise) {
	var util$1 = util;
	var async = Promise._async;
	var tryCatch = util$1.tryCatch;
	var errorObj = util$1.errorObj;

	function spreadAdapter(val, nodeback) {
	    var promise = this;
	    if (!util$1.isArray(val)) return successAdapter.call(promise, val, nodeback);
	    var ret =
	        tryCatch(nodeback).apply(promise._boundValue(), [null].concat(val));
	    if (ret === errorObj) {
	        async.throwLater(ret.e);
	    }
	}

	function successAdapter(val, nodeback) {
	    var promise = this;
	    var receiver = promise._boundValue();
	    var ret = val === undefined
	        ? tryCatch(nodeback).call(receiver, null)
	        : tryCatch(nodeback).call(receiver, null, val);
	    if (ret === errorObj) {
	        async.throwLater(ret.e);
	    }
	}
	function errorAdapter(reason, nodeback) {
	    var promise = this;
	    if (!reason) {
	        var newReason = new Error(reason + "");
	        newReason.cause = reason;
	        reason = newReason;
	    }
	    var ret = tryCatch(nodeback).call(promise._boundValue(), reason);
	    if (ret === errorObj) {
	        async.throwLater(ret.e);
	    }
	}

	Promise.prototype.asCallback = Promise.prototype.nodeify = function (nodeback,
	                                                                     options) {
	    if (typeof nodeback == "function") {
	        var adapter = successAdapter;
	        if (options !== undefined && Object(options).spread) {
	            adapter = spreadAdapter;
	        }
	        this._then(
	            adapter,
	            errorAdapter,
	            undefined,
	            this,
	            nodeback
	        );
	    }
	    return this;
	};
	};

	var promisify$1 = function(Promise, INTERNAL) {
	var THIS = {};
	var util$1 = util;
	var nodebackForPromise = nodeback;
	var withAppended = util$1.withAppended;
	var maybeWrapAsError = util$1.maybeWrapAsError;
	var canEvaluate = util$1.canEvaluate;
	var TypeError = errors.TypeError;
	var defaultSuffix = "Async";
	var defaultPromisified = {__isPromisified__: true};
	var noCopyProps = [
	    "arity",    "length",
	    "name",
	    "arguments",
	    "caller",
	    "callee",
	    "prototype",
	    "__isPromisified__"
	];
	var noCopyPropsPattern = new RegExp("^(?:" + noCopyProps.join("|") + ")$");

	var defaultFilter = function(name) {
	    return util$1.isIdentifier(name) &&
	        name.charAt(0) !== "_" &&
	        name !== "constructor";
	};

	function propsFilter(key) {
	    return !noCopyPropsPattern.test(key);
	}

	function isPromisified(fn) {
	    try {
	        return fn.__isPromisified__ === true;
	    }
	    catch (e) {
	        return false;
	    }
	}

	function hasPromisified(obj, key, suffix) {
	    var val = util$1.getDataPropertyOrDefault(obj, key + suffix,
	                                            defaultPromisified);
	    return val ? isPromisified(val) : false;
	}
	function checkValid(ret, suffix, suffixRegexp) {
	    for (var i = 0; i < ret.length; i += 2) {
	        var key = ret[i];
	        if (suffixRegexp.test(key)) {
	            var keyWithoutAsyncSuffix = key.replace(suffixRegexp, "");
	            for (var j = 0; j < ret.length; j += 2) {
	                if (ret[j] === keyWithoutAsyncSuffix) {
	                    throw new TypeError("Cannot promisify an API that has normal methods with '%s'-suffix\u000a\u000a    See http://goo.gl/MqrFmX\u000a"
	                        .replace("%s", suffix));
	                }
	            }
	        }
	    }
	}

	function promisifiableMethods(obj, suffix, suffixRegexp, filter) {
	    var keys = util$1.inheritedDataKeys(obj);
	    var ret = [];
	    for (var i = 0; i < keys.length; ++i) {
	        var key = keys[i];
	        var value = obj[key];
	        var passesDefaultFilter = filter === defaultFilter
	            ? true : defaultFilter(key);
	        if (typeof value === "function" &&
	            !isPromisified(value) &&
	            !hasPromisified(obj, key, suffix) &&
	            filter(key, value, obj, passesDefaultFilter)) {
	            ret.push(key, value);
	        }
	    }
	    checkValid(ret, suffix, suffixRegexp);
	    return ret;
	}

	var escapeIdentRegex = function(str) {
	    return str.replace(/([$])/, "\\$");
	};

	var makeNodePromisifiedEval;
	{
	var switchCaseArgumentOrder = function(likelyArgumentCount) {
	    var ret = [likelyArgumentCount];
	    var min = Math.max(0, likelyArgumentCount - 1 - 3);
	    for(var i = likelyArgumentCount - 1; i >= min; --i) {
	        ret.push(i);
	    }
	    for(var i = likelyArgumentCount + 1; i <= 3; ++i) {
	        ret.push(i);
	    }
	    return ret;
	};

	var argumentSequence = function(argumentCount) {
	    return util$1.filledRange(argumentCount, "_arg", "");
	};

	var parameterDeclaration = function(parameterCount) {
	    return util$1.filledRange(
	        Math.max(parameterCount, 3), "_arg", "");
	};

	var parameterCount = function(fn) {
	    if (typeof fn.length === "number") {
	        return Math.max(Math.min(fn.length, 1023 + 1), 0);
	    }
	    return 0;
	};

	makeNodePromisifiedEval =
	function(callback, receiver, originalName, fn, _, multiArgs) {
	    var newParameterCount = Math.max(0, parameterCount(fn) - 1);
	    var argumentOrder = switchCaseArgumentOrder(newParameterCount);
	    var shouldProxyThis = typeof callback === "string" || receiver === THIS;

	    function generateCallForArgumentCount(count) {
	        var args = argumentSequence(count).join(", ");
	        var comma = count > 0 ? ", " : "";
	        var ret;
	        if (shouldProxyThis) {
	            ret = "ret = callback.call(this, {{args}}, nodeback); break;\n";
	        } else {
	            ret = receiver === undefined
	                ? "ret = callback({{args}}, nodeback); break;\n"
	                : "ret = callback.call(receiver, {{args}}, nodeback); break;\n";
	        }
	        return ret.replace("{{args}}", args).replace(", ", comma);
	    }

	    function generateArgumentSwitchCase() {
	        var ret = "";
	        for (var i = 0; i < argumentOrder.length; ++i) {
	            ret += "case " + argumentOrder[i] +":" +
	                generateCallForArgumentCount(argumentOrder[i]);
	        }

	        ret += "                                                             \n\
        default:                                                             \n\
            var args = new Array(len + 1);                                   \n\
            var i = 0;                                                       \n\
            for (var i = 0; i < len; ++i) {                                  \n\
               args[i] = arguments[i];                                       \n\
            }                                                                \n\
            args[i] = nodeback;                                              \n\
            [CodeForCall]                                                    \n\
            break;                                                           \n\
        ".replace("[CodeForCall]", (shouldProxyThis
	                                ? "ret = callback.apply(this, args);\n"
	                                : "ret = callback.apply(receiver, args);\n"));
	        return ret;
	    }

	    var getFunctionCode = typeof callback === "string"
	                                ? ("this != null ? this['"+callback+"'] : fn")
	                                : "fn";
	    var body = "'use strict';                                                \n\
        var ret = function (Parameters) {                                    \n\
            'use strict';                                                    \n\
            var len = arguments.length;                                      \n\
            var promise = new Promise(INTERNAL);                             \n\
            promise._captureStackTrace();                                    \n\
            var nodeback = nodebackForPromise(promise, " + multiArgs + ");   \n\
            var ret;                                                         \n\
            var callback = tryCatch([GetFunctionCode]);                      \n\
            switch(len) {                                                    \n\
                [CodeForSwitchCase]                                          \n\
            }                                                                \n\
            if (ret === errorObj) {                                          \n\
                promise._rejectCallback(maybeWrapAsError(ret.e), true, true);\n\
            }                                                                \n\
            if (!promise._isFateSealed()) promise._setAsyncGuaranteed();     \n\
            return promise;                                                  \n\
        };                                                                   \n\
        notEnumerableProp(ret, '__isPromisified__', true);                   \n\
        return ret;                                                          \n\
    ".replace("[CodeForSwitchCase]", generateArgumentSwitchCase())
	        .replace("[GetFunctionCode]", getFunctionCode);
	    body = body.replace("Parameters", parameterDeclaration(newParameterCount));
	    return new Function("Promise",
	                        "fn",
	                        "receiver",
	                        "withAppended",
	                        "maybeWrapAsError",
	                        "nodebackForPromise",
	                        "tryCatch",
	                        "errorObj",
	                        "notEnumerableProp",
	                        "INTERNAL",
	                        body)(
	                    Promise,
	                    fn,
	                    receiver,
	                    withAppended,
	                    maybeWrapAsError,
	                    nodebackForPromise,
	                    util$1.tryCatch,
	                    util$1.errorObj,
	                    util$1.notEnumerableProp,
	                    INTERNAL);
	};
	}

	function makeNodePromisifiedClosure(callback, receiver, _, fn, __, multiArgs) {
	    var defaultThis = (function() {return this;})();
	    var method = callback;
	    if (typeof method === "string") {
	        callback = fn;
	    }
	    function promisified() {
	        var _receiver = receiver;
	        if (receiver === THIS) _receiver = this;
	        var promise = new Promise(INTERNAL);
	        promise._captureStackTrace();
	        var cb = typeof method === "string" && this !== defaultThis
	            ? this[method] : callback;
	        var fn = nodebackForPromise(promise, multiArgs);
	        try {
	            cb.apply(_receiver, withAppended(arguments, fn));
	        } catch(e) {
	            promise._rejectCallback(maybeWrapAsError(e), true, true);
	        }
	        if (!promise._isFateSealed()) promise._setAsyncGuaranteed();
	        return promise;
	    }
	    util$1.notEnumerableProp(promisified, "__isPromisified__", true);
	    return promisified;
	}

	var makeNodePromisified = canEvaluate
	    ? makeNodePromisifiedEval
	    : makeNodePromisifiedClosure;

	function promisifyAll(obj, suffix, filter, promisifier, multiArgs) {
	    var suffixRegexp = new RegExp(escapeIdentRegex(suffix) + "$");
	    var methods =
	        promisifiableMethods(obj, suffix, suffixRegexp, filter);

	    for (var i = 0, len = methods.length; i < len; i+= 2) {
	        var key = methods[i];
	        var fn = methods[i+1];
	        var promisifiedKey = key + suffix;
	        if (promisifier === makeNodePromisified) {
	            obj[promisifiedKey] =
	                makeNodePromisified(key, THIS, key, fn, suffix, multiArgs);
	        } else {
	            var promisified = promisifier(fn, function() {
	                return makeNodePromisified(key, THIS, key,
	                                           fn, suffix, multiArgs);
	            });
	            util$1.notEnumerableProp(promisified, "__isPromisified__", true);
	            obj[promisifiedKey] = promisified;
	        }
	    }
	    util$1.toFastProperties(obj);
	    return obj;
	}

	function promisify(callback, receiver, multiArgs) {
	    return makeNodePromisified(callback, receiver, undefined,
	                                callback, null, multiArgs);
	}

	Promise.promisify = function (fn, options) {
	    if (typeof fn !== "function") {
	        throw new TypeError("expecting a function but got " + util$1.classString(fn));
	    }
	    if (isPromisified(fn)) {
	        return fn;
	    }
	    options = Object(options);
	    var receiver = options.context === undefined ? THIS : options.context;
	    var multiArgs = !!options.multiArgs;
	    var ret = promisify(fn, receiver, multiArgs);
	    util$1.copyDescriptors(fn, ret, propsFilter);
	    return ret;
	};

	Promise.promisifyAll = function (target, options) {
	    if (typeof target !== "function" && typeof target !== "object") {
	        throw new TypeError("the target of promisifyAll must be an object or a function\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	    }
	    options = Object(options);
	    var multiArgs = !!options.multiArgs;
	    var suffix = options.suffix;
	    if (typeof suffix !== "string") suffix = defaultSuffix;
	    var filter = options.filter;
	    if (typeof filter !== "function") filter = defaultFilter;
	    var promisifier = options.promisifier;
	    if (typeof promisifier !== "function") promisifier = makeNodePromisified;

	    if (!util$1.isIdentifier(suffix)) {
	        throw new RangeError("suffix must be a valid identifier\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	    }

	    var keys = util$1.inheritedDataKeys(target);
	    for (var i = 0; i < keys.length; ++i) {
	        var value = target[keys[i]];
	        if (keys[i] !== "constructor" &&
	            util$1.isClass(value)) {
	            promisifyAll(value.prototype, suffix, filter, promisifier,
	                multiArgs);
	            promisifyAll(value, suffix, filter, promisifier, multiArgs);
	        }
	    }

	    return promisifyAll(target, suffix, filter, promisifier, multiArgs);
	};
	};

	var props = function(
	    Promise, PromiseArray, tryConvertToPromise, apiRejection) {
	var util$1 = util;
	var isObject = util$1.isObject;
	var es5$1 = es5;
	var Es6Map;
	if (typeof Map === "function") Es6Map = Map;

	var mapToEntries = (function() {
	    var index = 0;
	    var size = 0;

	    function extractEntry(value, key) {
	        this[index] = value;
	        this[index + size] = key;
	        index++;
	    }

	    return function mapToEntries(map) {
	        size = map.size;
	        index = 0;
	        var ret = new Array(map.size * 2);
	        map.forEach(extractEntry, ret);
	        return ret;
	    };
	})();

	var entriesToMap = function(entries) {
	    var ret = new Es6Map();
	    var length = entries.length / 2 | 0;
	    for (var i = 0; i < length; ++i) {
	        var key = entries[length + i];
	        var value = entries[i];
	        ret.set(key, value);
	    }
	    return ret;
	};

	function PropertiesPromiseArray(obj) {
	    var isMap = false;
	    var entries;
	    if (Es6Map !== undefined && obj instanceof Es6Map) {
	        entries = mapToEntries(obj);
	        isMap = true;
	    } else {
	        var keys = es5$1.keys(obj);
	        var len = keys.length;
	        entries = new Array(len * 2);
	        for (var i = 0; i < len; ++i) {
	            var key = keys[i];
	            entries[i] = obj[key];
	            entries[i + len] = key;
	        }
	    }
	    this.constructor$(entries);
	    this._isMap = isMap;
	    this._init$(undefined, isMap ? -6 : -3);
	}
	util$1.inherits(PropertiesPromiseArray, PromiseArray);

	PropertiesPromiseArray.prototype._init = function () {};

	PropertiesPromiseArray.prototype._promiseFulfilled = function (value, index) {
	    this._values[index] = value;
	    var totalResolved = ++this._totalResolved;
	    if (totalResolved >= this._length) {
	        var val;
	        if (this._isMap) {
	            val = entriesToMap(this._values);
	        } else {
	            val = {};
	            var keyOffset = this.length();
	            for (var i = 0, len = this.length(); i < len; ++i) {
	                val[this._values[i + keyOffset]] = this._values[i];
	            }
	        }
	        this._resolve(val);
	        return true;
	    }
	    return false;
	};

	PropertiesPromiseArray.prototype.shouldCopyValues = function () {
	    return false;
	};

	PropertiesPromiseArray.prototype.getActualLength = function (len) {
	    return len >> 1;
	};

	function props(promises) {
	    var ret;
	    var castValue = tryConvertToPromise(promises);

	    if (!isObject(castValue)) {
	        return apiRejection("cannot await properties of a non-object\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	    } else if (castValue instanceof Promise) {
	        ret = castValue._then(
	            Promise.props, undefined, undefined, undefined, undefined);
	    } else {
	        ret = new PropertiesPromiseArray(castValue).promise();
	    }

	    if (castValue instanceof Promise) {
	        ret._propagateFrom(castValue, 2);
	    }
	    return ret;
	}

	Promise.prototype.props = function () {
	    return props(this);
	};

	Promise.props = function (promises) {
	    return props(promises);
	};
	};

	var race = function(
	    Promise, INTERNAL, tryConvertToPromise, apiRejection) {
	var util$1 = util;

	var raceLater = function (promise) {
	    return promise.then(function(array) {
	        return race(array, promise);
	    });
	};

	function race(promises, parent) {
	    var maybePromise = tryConvertToPromise(promises);

	    if (maybePromise instanceof Promise) {
	        return raceLater(maybePromise);
	    } else {
	        promises = util$1.asArray(promises);
	        if (promises === null)
	            return apiRejection("expecting an array or an iterable object but got " + util$1.classString(promises));
	    }

	    var ret = new Promise(INTERNAL);
	    if (parent !== undefined) {
	        ret._propagateFrom(parent, 3);
	    }
	    var fulfill = ret._fulfill;
	    var reject = ret._reject;
	    for (var i = 0, len = promises.length; i < len; ++i) {
	        var val = promises[i];

	        if (val === undefined && !(i in promises)) {
	            continue;
	        }

	        Promise.cast(val)._then(fulfill, reject, undefined, ret, null);
	    }
	    return ret;
	}

	Promise.race = function (promises) {
	    return race(promises, undefined);
	};

	Promise.prototype.race = function () {
	    return race(this, undefined);
	};

	};

	var reduce = function(Promise,
	                          PromiseArray,
	                          apiRejection,
	                          tryConvertToPromise,
	                          INTERNAL,
	                          debug) {
	var getDomain = Promise._getDomain;
	var util$1 = util;
	var tryCatch = util$1.tryCatch;

	function ReductionPromiseArray(promises, fn, initialValue, _each) {
	    this.constructor$(promises);
	    var domain = getDomain();
	    this._fn = domain === null ? fn : util$1.domainBind(domain, fn);
	    if (initialValue !== undefined) {
	        initialValue = Promise.resolve(initialValue);
	        initialValue._attachCancellationCallback(this);
	    }
	    this._initialValue = initialValue;
	    this._currentCancellable = null;
	    if(_each === INTERNAL) {
	        this._eachValues = Array(this._length);
	    } else if (_each === 0) {
	        this._eachValues = null;
	    } else {
	        this._eachValues = undefined;
	    }
	    this._promise._captureStackTrace();
	    this._init$(undefined, -5);
	}
	util$1.inherits(ReductionPromiseArray, PromiseArray);

	ReductionPromiseArray.prototype._gotAccum = function(accum) {
	    if (this._eachValues !== undefined && 
	        this._eachValues !== null && 
	        accum !== INTERNAL) {
	        this._eachValues.push(accum);
	    }
	};

	ReductionPromiseArray.prototype._eachComplete = function(value) {
	    if (this._eachValues !== null) {
	        this._eachValues.push(value);
	    }
	    return this._eachValues;
	};

	ReductionPromiseArray.prototype._init = function() {};

	ReductionPromiseArray.prototype._resolveEmptyArray = function() {
	    this._resolve(this._eachValues !== undefined ? this._eachValues
	                                                 : this._initialValue);
	};

	ReductionPromiseArray.prototype.shouldCopyValues = function () {
	    return false;
	};

	ReductionPromiseArray.prototype._resolve = function(value) {
	    this._promise._resolveCallback(value);
	    this._values = null;
	};

	ReductionPromiseArray.prototype._resultCancelled = function(sender) {
	    if (sender === this._initialValue) return this._cancel();
	    if (this._isResolved()) return;
	    this._resultCancelled$();
	    if (this._currentCancellable instanceof Promise) {
	        this._currentCancellable.cancel();
	    }
	    if (this._initialValue instanceof Promise) {
	        this._initialValue.cancel();
	    }
	};

	ReductionPromiseArray.prototype._iterate = function (values) {
	    this._values = values;
	    var value;
	    var i;
	    var length = values.length;
	    if (this._initialValue !== undefined) {
	        value = this._initialValue;
	        i = 0;
	    } else {
	        value = Promise.resolve(values[0]);
	        i = 1;
	    }

	    this._currentCancellable = value;

	    if (!value.isRejected()) {
	        for (; i < length; ++i) {
	            var ctx = {
	                accum: null,
	                value: values[i],
	                index: i,
	                length: length,
	                array: this
	            };
	            value = value._then(gotAccum, undefined, undefined, ctx, undefined);
	        }
	    }

	    if (this._eachValues !== undefined) {
	        value = value
	            ._then(this._eachComplete, undefined, undefined, this, undefined);
	    }
	    value._then(completed, completed, undefined, value, this);
	};

	Promise.prototype.reduce = function (fn, initialValue) {
	    return reduce(this, fn, initialValue, null);
	};

	Promise.reduce = function (promises, fn, initialValue, _each) {
	    return reduce(promises, fn, initialValue, _each);
	};

	function completed(valueOrReason, array) {
	    if (this.isFulfilled()) {
	        array._resolve(valueOrReason);
	    } else {
	        array._reject(valueOrReason);
	    }
	}

	function reduce(promises, fn, initialValue, _each) {
	    if (typeof fn !== "function") {
	        return apiRejection("expecting a function but got " + util$1.classString(fn));
	    }
	    var array = new ReductionPromiseArray(promises, fn, initialValue, _each);
	    return array.promise();
	}

	function gotAccum(accum) {
	    this.accum = accum;
	    this.array._gotAccum(accum);
	    var value = tryConvertToPromise(this.value, this.array._promise);
	    if (value instanceof Promise) {
	        this.array._currentCancellable = value;
	        return value._then(gotValue, undefined, undefined, this, undefined);
	    } else {
	        return gotValue.call(this, value);
	    }
	}

	function gotValue(value) {
	    var array = this.array;
	    var promise = array._promise;
	    var fn = tryCatch(array._fn);
	    promise._pushContext();
	    var ret;
	    if (array._eachValues !== undefined) {
	        ret = fn.call(promise._boundValue(), value, this.index, this.length);
	    } else {
	        ret = fn.call(promise._boundValue(),
	                              this.accum, value, this.index, this.length);
	    }
	    if (ret instanceof Promise) {
	        array._currentCancellable = ret;
	    }
	    var promiseCreated = promise._popContext();
	    debug.checkForgottenReturns(
	        ret,
	        promiseCreated,
	        array._eachValues !== undefined ? "Promise.each" : "Promise.reduce",
	        promise
	    );
	    return ret;
	}
	};

	var settle =
	    function(Promise, PromiseArray, debug) {
	var PromiseInspection = Promise.PromiseInspection;
	var util$1 = util;

	function SettledPromiseArray(values) {
	    this.constructor$(values);
	}
	util$1.inherits(SettledPromiseArray, PromiseArray);

	SettledPromiseArray.prototype._promiseResolved = function (index, inspection) {
	    this._values[index] = inspection;
	    var totalResolved = ++this._totalResolved;
	    if (totalResolved >= this._length) {
	        this._resolve(this._values);
	        return true;
	    }
	    return false;
	};

	SettledPromiseArray.prototype._promiseFulfilled = function (value, index) {
	    var ret = new PromiseInspection();
	    ret._bitField = 33554432;
	    ret._settledValueField = value;
	    return this._promiseResolved(index, ret);
	};
	SettledPromiseArray.prototype._promiseRejected = function (reason, index) {
	    var ret = new PromiseInspection();
	    ret._bitField = 16777216;
	    ret._settledValueField = reason;
	    return this._promiseResolved(index, ret);
	};

	Promise.settle = function (promises) {
	    debug.deprecated(".settle()", ".reflect()");
	    return new SettledPromiseArray(promises).promise();
	};

	Promise.prototype.settle = function () {
	    return Promise.settle(this);
	};
	};

	var some =
	function(Promise, PromiseArray, apiRejection) {
	var util$1 = util;
	var RangeError = errors.RangeError;
	var AggregateError = errors.AggregateError;
	var isArray = util$1.isArray;
	var CANCELLATION = {};


	function SomePromiseArray(values) {
	    this.constructor$(values);
	    this._howMany = 0;
	    this._unwrap = false;
	    this._initialized = false;
	}
	util$1.inherits(SomePromiseArray, PromiseArray);

	SomePromiseArray.prototype._init = function () {
	    if (!this._initialized) {
	        return;
	    }
	    if (this._howMany === 0) {
	        this._resolve([]);
	        return;
	    }
	    this._init$(undefined, -5);
	    var isArrayResolved = isArray(this._values);
	    if (!this._isResolved() &&
	        isArrayResolved &&
	        this._howMany > this._canPossiblyFulfill()) {
	        this._reject(this._getRangeError(this.length()));
	    }
	};

	SomePromiseArray.prototype.init = function () {
	    this._initialized = true;
	    this._init();
	};

	SomePromiseArray.prototype.setUnwrap = function () {
	    this._unwrap = true;
	};

	SomePromiseArray.prototype.howMany = function () {
	    return this._howMany;
	};

	SomePromiseArray.prototype.setHowMany = function (count) {
	    this._howMany = count;
	};

	SomePromiseArray.prototype._promiseFulfilled = function (value) {
	    this._addFulfilled(value);
	    if (this._fulfilled() === this.howMany()) {
	        this._values.length = this.howMany();
	        if (this.howMany() === 1 && this._unwrap) {
	            this._resolve(this._values[0]);
	        } else {
	            this._resolve(this._values);
	        }
	        return true;
	    }
	    return false;

	};
	SomePromiseArray.prototype._promiseRejected = function (reason) {
	    this._addRejected(reason);
	    return this._checkOutcome();
	};

	SomePromiseArray.prototype._promiseCancelled = function () {
	    if (this._values instanceof Promise || this._values == null) {
	        return this._cancel();
	    }
	    this._addRejected(CANCELLATION);
	    return this._checkOutcome();
	};

	SomePromiseArray.prototype._checkOutcome = function() {
	    if (this.howMany() > this._canPossiblyFulfill()) {
	        var e = new AggregateError();
	        for (var i = this.length(); i < this._values.length; ++i) {
	            if (this._values[i] !== CANCELLATION) {
	                e.push(this._values[i]);
	            }
	        }
	        if (e.length > 0) {
	            this._reject(e);
	        } else {
	            this._cancel();
	        }
	        return true;
	    }
	    return false;
	};

	SomePromiseArray.prototype._fulfilled = function () {
	    return this._totalResolved;
	};

	SomePromiseArray.prototype._rejected = function () {
	    return this._values.length - this.length();
	};

	SomePromiseArray.prototype._addRejected = function (reason) {
	    this._values.push(reason);
	};

	SomePromiseArray.prototype._addFulfilled = function (value) {
	    this._values[this._totalResolved++] = value;
	};

	SomePromiseArray.prototype._canPossiblyFulfill = function () {
	    return this.length() - this._rejected();
	};

	SomePromiseArray.prototype._getRangeError = function (count) {
	    var message = "Input array must contain at least " +
	            this._howMany + " items but contains only " + count + " items";
	    return new RangeError(message);
	};

	SomePromiseArray.prototype._resolveEmptyArray = function () {
	    this._reject(this._getRangeError(0));
	};

	function some(promises, howMany) {
	    if ((howMany | 0) !== howMany || howMany < 0) {
	        return apiRejection("expecting a positive integer\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	    }
	    var ret = new SomePromiseArray(promises);
	    var promise = ret.promise();
	    ret.setHowMany(howMany);
	    ret.init();
	    return promise;
	}

	Promise.some = function (promises, howMany) {
	    return some(promises, howMany);
	};

	Promise.prototype.some = function (howMany) {
	    return some(this, howMany);
	};

	Promise._SomePromiseArray = SomePromiseArray;
	};

	var timers = function(Promise, INTERNAL, debug) {
	var util$1 = util;
	var TimeoutError = Promise.TimeoutError;

	function HandleWrapper(handle)  {
	    this.handle = handle;
	}

	HandleWrapper.prototype._resultCancelled = function() {
	    clearTimeout(this.handle);
	};

	var afterValue = function(value) { return delay(+this).thenReturn(value); };
	var delay = Promise.delay = function (ms, value) {
	    var ret;
	    var handle;
	    if (value !== undefined) {
	        ret = Promise.resolve(value)
	                ._then(afterValue, null, null, ms, undefined);
	        if (debug.cancellation() && value instanceof Promise) {
	            ret._setOnCancel(value);
	        }
	    } else {
	        ret = new Promise(INTERNAL);
	        handle = setTimeout(function() { ret._fulfill(); }, +ms);
	        if (debug.cancellation()) {
	            ret._setOnCancel(new HandleWrapper(handle));
	        }
	        ret._captureStackTrace();
	    }
	    ret._setAsyncGuaranteed();
	    return ret;
	};

	Promise.prototype.delay = function (ms) {
	    return delay(ms, this);
	};

	var afterTimeout = function (promise, message, parent) {
	    var err;
	    if (typeof message !== "string") {
	        if (message instanceof Error) {
	            err = message;
	        } else {
	            err = new TimeoutError("operation timed out");
	        }
	    } else {
	        err = new TimeoutError(message);
	    }
	    util$1.markAsOriginatingFromRejection(err);
	    promise._attachExtraTrace(err);
	    promise._reject(err);

	    if (parent != null) {
	        parent.cancel();
	    }
	};

	function successClear(value) {
	    clearTimeout(this.handle);
	    return value;
	}

	function failureClear(reason) {
	    clearTimeout(this.handle);
	    throw reason;
	}

	Promise.prototype.timeout = function (ms, message) {
	    ms = +ms;
	    var ret, parent;

	    var handleWrapper = new HandleWrapper(setTimeout(function timeoutTimeout() {
	        if (ret.isPending()) {
	            afterTimeout(ret, message, parent);
	        }
	    }, ms));

	    if (debug.cancellation()) {
	        parent = this.then();
	        ret = parent._then(successClear, failureClear,
	                            undefined, handleWrapper, undefined);
	        ret._setOnCancel(handleWrapper);
	    } else {
	        ret = this._then(successClear, failureClear,
	                            undefined, handleWrapper, undefined);
	    }

	    return ret;
	};

	};

	var using = function (Promise, apiRejection, tryConvertToPromise,
	    createContext, INTERNAL, debug) {
	    var util$1 = util;
	    var TypeError = errors.TypeError;
	    var inherits = util.inherits;
	    var errorObj = util$1.errorObj;
	    var tryCatch = util$1.tryCatch;
	    var NULL = {};

	    function thrower(e) {
	        setTimeout(function(){throw e;}, 0);
	    }

	    function castPreservingDisposable(thenable) {
	        var maybePromise = tryConvertToPromise(thenable);
	        if (maybePromise !== thenable &&
	            typeof thenable._isDisposable === "function" &&
	            typeof thenable._getDisposer === "function" &&
	            thenable._isDisposable()) {
	            maybePromise._setDisposable(thenable._getDisposer());
	        }
	        return maybePromise;
	    }
	    function dispose(resources, inspection) {
	        var i = 0;
	        var len = resources.length;
	        var ret = new Promise(INTERNAL);
	        function iterator() {
	            if (i >= len) return ret._fulfill();
	            var maybePromise = castPreservingDisposable(resources[i++]);
	            if (maybePromise instanceof Promise &&
	                maybePromise._isDisposable()) {
	                try {
	                    maybePromise = tryConvertToPromise(
	                        maybePromise._getDisposer().tryDispose(inspection),
	                        resources.promise);
	                } catch (e) {
	                    return thrower(e);
	                }
	                if (maybePromise instanceof Promise) {
	                    return maybePromise._then(iterator, thrower,
	                                              null, null, null);
	                }
	            }
	            iterator();
	        }
	        iterator();
	        return ret;
	    }

	    function Disposer(data, promise, context) {
	        this._data = data;
	        this._promise = promise;
	        this._context = context;
	    }

	    Disposer.prototype.data = function () {
	        return this._data;
	    };

	    Disposer.prototype.promise = function () {
	        return this._promise;
	    };

	    Disposer.prototype.resource = function () {
	        if (this.promise().isFulfilled()) {
	            return this.promise().value();
	        }
	        return NULL;
	    };

	    Disposer.prototype.tryDispose = function(inspection) {
	        var resource = this.resource();
	        var context = this._context;
	        if (context !== undefined) context._pushContext();
	        var ret = resource !== NULL
	            ? this.doDispose(resource, inspection) : null;
	        if (context !== undefined) context._popContext();
	        this._promise._unsetDisposable();
	        this._data = null;
	        return ret;
	    };

	    Disposer.isDisposer = function (d) {
	        return (d != null &&
	                typeof d.resource === "function" &&
	                typeof d.tryDispose === "function");
	    };

	    function FunctionDisposer(fn, promise, context) {
	        this.constructor$(fn, promise, context);
	    }
	    inherits(FunctionDisposer, Disposer);

	    FunctionDisposer.prototype.doDispose = function (resource, inspection) {
	        var fn = this.data();
	        return fn.call(resource, resource, inspection);
	    };

	    function maybeUnwrapDisposer(value) {
	        if (Disposer.isDisposer(value)) {
	            this.resources[this.index]._setDisposable(value);
	            return value.promise();
	        }
	        return value;
	    }

	    function ResourceList(length) {
	        this.length = length;
	        this.promise = null;
	        this[length-1] = null;
	    }

	    ResourceList.prototype._resultCancelled = function() {
	        var len = this.length;
	        for (var i = 0; i < len; ++i) {
	            var item = this[i];
	            if (item instanceof Promise) {
	                item.cancel();
	            }
	        }
	    };

	    Promise.using = function () {
	        var len = arguments.length;
	        if (len < 2) return apiRejection(
	                        "you must pass at least 2 arguments to Promise.using");
	        var fn = arguments[len - 1];
	        if (typeof fn !== "function") {
	            return apiRejection("expecting a function but got " + util$1.classString(fn));
	        }
	        var input;
	        var spreadArgs = true;
	        if (len === 2 && Array.isArray(arguments[0])) {
	            input = arguments[0];
	            len = input.length;
	            spreadArgs = false;
	        } else {
	            input = arguments;
	            len--;
	        }
	        var resources = new ResourceList(len);
	        for (var i = 0; i < len; ++i) {
	            var resource = input[i];
	            if (Disposer.isDisposer(resource)) {
	                var disposer = resource;
	                resource = resource.promise();
	                resource._setDisposable(disposer);
	            } else {
	                var maybePromise = tryConvertToPromise(resource);
	                if (maybePromise instanceof Promise) {
	                    resource =
	                        maybePromise._then(maybeUnwrapDisposer, null, null, {
	                            resources: resources,
	                            index: i
	                    }, undefined);
	                }
	            }
	            resources[i] = resource;
	        }

	        var reflectedResources = new Array(resources.length);
	        for (var i = 0; i < reflectedResources.length; ++i) {
	            reflectedResources[i] = Promise.resolve(resources[i]).reflect();
	        }

	        var resultPromise = Promise.all(reflectedResources)
	            .then(function(inspections) {
	                for (var i = 0; i < inspections.length; ++i) {
	                    var inspection = inspections[i];
	                    if (inspection.isRejected()) {
	                        errorObj.e = inspection.error();
	                        return errorObj;
	                    } else if (!inspection.isFulfilled()) {
	                        resultPromise.cancel();
	                        return;
	                    }
	                    inspections[i] = inspection.value();
	                }
	                promise._pushContext();

	                fn = tryCatch(fn);
	                var ret = spreadArgs
	                    ? fn.apply(undefined, inspections) : fn(inspections);
	                var promiseCreated = promise._popContext();
	                debug.checkForgottenReturns(
	                    ret, promiseCreated, "Promise.using", promise);
	                return ret;
	            });

	        var promise = resultPromise.lastly(function() {
	            var inspection = new Promise.PromiseInspection(resultPromise);
	            return dispose(resources, inspection);
	        });
	        resources.promise = promise;
	        promise._setOnCancel(resources);
	        return promise;
	    };

	    Promise.prototype._setDisposable = function (disposer) {
	        this._bitField = this._bitField | 131072;
	        this._disposer = disposer;
	    };

	    Promise.prototype._isDisposable = function () {
	        return (this._bitField & 131072) > 0;
	    };

	    Promise.prototype._getDisposer = function () {
	        return this._disposer;
	    };

	    Promise.prototype._unsetDisposable = function () {
	        this._bitField = this._bitField & (~131072);
	        this._disposer = undefined;
	    };

	    Promise.prototype.disposer = function (fn) {
	        if (typeof fn === "function") {
	            return new FunctionDisposer(fn, this, createContext());
	        }
	        throw new TypeError();
	    };

	};

	var any = function(Promise) {
	var SomePromiseArray = Promise._SomePromiseArray;
	function any(promises) {
	    var ret = new SomePromiseArray(promises);
	    var promise = ret.promise();
	    ret.setHowMany(1);
	    ret.setUnwrap();
	    ret.init();
	    return promise;
	}

	Promise.any = function (promises) {
	    return any(promises);
	};

	Promise.prototype.any = function () {
	    return any(this);
	};

	};

	var each = function(Promise, INTERNAL) {
	var PromiseReduce = Promise.reduce;
	var PromiseAll = Promise.all;

	function promiseAllThis() {
	    return PromiseAll(this);
	}

	function PromiseMapSeries(promises, fn) {
	    return PromiseReduce(promises, fn, INTERNAL, INTERNAL);
	}

	Promise.prototype.each = function (fn) {
	    return PromiseReduce(this, fn, INTERNAL, 0)
	              ._then(promiseAllThis, undefined, undefined, this, undefined);
	};

	Promise.prototype.mapSeries = function (fn) {
	    return PromiseReduce(this, fn, INTERNAL, INTERNAL);
	};

	Promise.each = function (promises, fn) {
	    return PromiseReduce(promises, fn, INTERNAL, 0)
	              ._then(promiseAllThis, undefined, undefined, promises, undefined);
	};

	Promise.mapSeries = PromiseMapSeries;
	};

	var filter$1 = function(Promise, INTERNAL) {
	var PromiseMap = Promise.map;

	Promise.prototype.filter = function (fn, options) {
	    return PromiseMap(this, fn, options, INTERNAL);
	};

	Promise.filter = function (promises, fn, options) {
	    return PromiseMap(promises, fn, options, INTERNAL);
	};
	};

	var promise = createCommonjsModule(function (module) {
	module.exports = function() {
	var makeSelfResolutionError = function () {
	    return new TypeError("circular promise resolution chain\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	};
	var reflectHandler = function() {
	    return new Promise.PromiseInspection(this._target());
	};
	var apiRejection = function(msg) {
	    return Promise.reject(new TypeError(msg));
	};
	function Proxyable() {}
	var UNDEFINED_BINDING = {};
	var util$1 = util;

	var getDomain;
	if (util$1.isNode) {
	    getDomain = function() {
	        var ret = process.domain;
	        if (ret === undefined) ret = null;
	        return ret;
	    };
	} else {
	    getDomain = function() {
	        return null;
	    };
	}
	util$1.notEnumerableProp(Promise, "_getDomain", getDomain);

	var es5$1 = es5;
	var Async = async;
	var async$1 = new Async();
	es5$1.defineProperty(Promise, "_async", {value: async$1});
	var errors$1 = errors;
	var TypeError = Promise.TypeError = errors$1.TypeError;
	Promise.RangeError = errors$1.RangeError;
	var CancellationError = Promise.CancellationError = errors$1.CancellationError;
	Promise.TimeoutError = errors$1.TimeoutError;
	Promise.OperationalError = errors$1.OperationalError;
	Promise.RejectionError = errors$1.OperationalError;
	Promise.AggregateError = errors$1.AggregateError;
	var INTERNAL = function(){};
	var APPLY = {};
	var NEXT_FILTER = {};
	var tryConvertToPromise = thenables(Promise, INTERNAL);
	var PromiseArray =
	    promise_array(Promise, INTERNAL,
	                               tryConvertToPromise, apiRejection, Proxyable);
	var Context = context(Promise);
	 /*jshint unused:false*/
	var createContext = Context.create;
	var debug = debuggability(Promise, Context);
	var PassThroughHandlerContext =
	    _finally(Promise, tryConvertToPromise, NEXT_FILTER);
	var catchFilter = catch_filter(NEXT_FILTER);
	var nodebackForPromise = nodeback;
	var errorObj = util$1.errorObj;
	var tryCatch = util$1.tryCatch;
	function check(self, executor) {
	    if (self == null || self.constructor !== Promise) {
	        throw new TypeError("the promise constructor cannot be invoked directly\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	    }
	    if (typeof executor !== "function") {
	        throw new TypeError("expecting a function but got " + util$1.classString(executor));
	    }

	}

	function Promise(executor) {
	    if (executor !== INTERNAL) {
	        check(this, executor);
	    }
	    this._bitField = 0;
	    this._fulfillmentHandler0 = undefined;
	    this._rejectionHandler0 = undefined;
	    this._promise0 = undefined;
	    this._receiver0 = undefined;
	    this._resolveFromExecutor(executor);
	    this._promiseCreated();
	    this._fireEvent("promiseCreated", this);
	}

	Promise.prototype.toString = function () {
	    return "[object Promise]";
	};

	Promise.prototype.caught = Promise.prototype["catch"] = function (fn) {
	    var len = arguments.length;
	    if (len > 1) {
	        var catchInstances = new Array(len - 1),
	            j = 0, i;
	        for (i = 0; i < len - 1; ++i) {
	            var item = arguments[i];
	            if (util$1.isObject(item)) {
	                catchInstances[j++] = item;
	            } else {
	                return apiRejection("Catch statement predicate: " +
	                    "expecting an object but got " + util$1.classString(item));
	            }
	        }
	        catchInstances.length = j;
	        fn = arguments[i];

	        if (typeof fn !== "function") {
	            throw new TypeError("The last argument to .catch() " +
	                "must be a function, got " + util$1.toString(fn));
	        }
	        return this.then(undefined, catchFilter(catchInstances, fn, this));
	    }
	    return this.then(undefined, fn);
	};

	Promise.prototype.reflect = function () {
	    return this._then(reflectHandler,
	        reflectHandler, undefined, this, undefined);
	};

	Promise.prototype.then = function (didFulfill, didReject) {
	    if (debug.warnings() && arguments.length > 0 &&
	        typeof didFulfill !== "function" &&
	        typeof didReject !== "function") {
	        var msg = ".then() only accepts functions but was passed: " +
	                util$1.classString(didFulfill);
	        if (arguments.length > 1) {
	            msg += ", " + util$1.classString(didReject);
	        }
	        this._warn(msg);
	    }
	    return this._then(didFulfill, didReject, undefined, undefined, undefined);
	};

	Promise.prototype.done = function (didFulfill, didReject) {
	    var promise =
	        this._then(didFulfill, didReject, undefined, undefined, undefined);
	    promise._setIsFinal();
	};

	Promise.prototype.spread = function (fn) {
	    if (typeof fn !== "function") {
	        return apiRejection("expecting a function but got " + util$1.classString(fn));
	    }
	    return this.all()._then(fn, undefined, undefined, APPLY, undefined);
	};

	Promise.prototype.toJSON = function () {
	    var ret = {
	        isFulfilled: false,
	        isRejected: false,
	        fulfillmentValue: undefined,
	        rejectionReason: undefined
	    };
	    if (this.isFulfilled()) {
	        ret.fulfillmentValue = this.value();
	        ret.isFulfilled = true;
	    } else if (this.isRejected()) {
	        ret.rejectionReason = this.reason();
	        ret.isRejected = true;
	    }
	    return ret;
	};

	Promise.prototype.all = function () {
	    if (arguments.length > 0) {
	        this._warn(".all() was passed arguments but it does not take any");
	    }
	    return new PromiseArray(this).promise();
	};

	Promise.prototype.error = function (fn) {
	    return this.caught(util$1.originatesFromRejection, fn);
	};

	Promise.getNewLibraryCopy = module.exports;

	Promise.is = function (val) {
	    return val instanceof Promise;
	};

	Promise.fromNode = Promise.fromCallback = function(fn) {
	    var ret = new Promise(INTERNAL);
	    ret._captureStackTrace();
	    var multiArgs = arguments.length > 1 ? !!Object(arguments[1]).multiArgs
	                                         : false;
	    var result = tryCatch(fn)(nodebackForPromise(ret, multiArgs));
	    if (result === errorObj) {
	        ret._rejectCallback(result.e, true);
	    }
	    if (!ret._isFateSealed()) ret._setAsyncGuaranteed();
	    return ret;
	};

	Promise.all = function (promises) {
	    return new PromiseArray(promises).promise();
	};

	Promise.cast = function (obj) {
	    var ret = tryConvertToPromise(obj);
	    if (!(ret instanceof Promise)) {
	        ret = new Promise(INTERNAL);
	        ret._captureStackTrace();
	        ret._setFulfilled();
	        ret._rejectionHandler0 = obj;
	    }
	    return ret;
	};

	Promise.resolve = Promise.fulfilled = Promise.cast;

	Promise.reject = Promise.rejected = function (reason) {
	    var ret = new Promise(INTERNAL);
	    ret._captureStackTrace();
	    ret._rejectCallback(reason, true);
	    return ret;
	};

	Promise.setScheduler = function(fn) {
	    if (typeof fn !== "function") {
	        throw new TypeError("expecting a function but got " + util$1.classString(fn));
	    }
	    return async$1.setScheduler(fn);
	};

	Promise.prototype._then = function (
	    didFulfill,
	    didReject,
	    _,    receiver,
	    internalData
	) {
	    var haveInternalData = internalData !== undefined;
	    var promise = haveInternalData ? internalData : new Promise(INTERNAL);
	    var target = this._target();
	    var bitField = target._bitField;

	    if (!haveInternalData) {
	        promise._propagateFrom(this, 3);
	        promise._captureStackTrace();
	        if (receiver === undefined &&
	            ((this._bitField & 2097152) !== 0)) {
	            if (!((bitField & 50397184) === 0)) {
	                receiver = this._boundValue();
	            } else {
	                receiver = target === this ? undefined : this._boundTo;
	            }
	        }
	        this._fireEvent("promiseChained", this, promise);
	    }

	    var domain = getDomain();
	    if (!((bitField & 50397184) === 0)) {
	        var handler, value, settler = target._settlePromiseCtx;
	        if (((bitField & 33554432) !== 0)) {
	            value = target._rejectionHandler0;
	            handler = didFulfill;
	        } else if (((bitField & 16777216) !== 0)) {
	            value = target._fulfillmentHandler0;
	            handler = didReject;
	            target._unsetRejectionIsUnhandled();
	        } else {
	            settler = target._settlePromiseLateCancellationObserver;
	            value = new CancellationError("late cancellation observer");
	            target._attachExtraTrace(value);
	            handler = didReject;
	        }

	        async$1.invoke(settler, target, {
	            handler: domain === null ? handler
	                : (typeof handler === "function" &&
	                    util$1.domainBind(domain, handler)),
	            promise: promise,
	            receiver: receiver,
	            value: value
	        });
	    } else {
	        target._addCallbacks(didFulfill, didReject, promise, receiver, domain);
	    }

	    return promise;
	};

	Promise.prototype._length = function () {
	    return this._bitField & 65535;
	};

	Promise.prototype._isFateSealed = function () {
	    return (this._bitField & 117506048) !== 0;
	};

	Promise.prototype._isFollowing = function () {
	    return (this._bitField & 67108864) === 67108864;
	};

	Promise.prototype._setLength = function (len) {
	    this._bitField = (this._bitField & -65536) |
	        (len & 65535);
	};

	Promise.prototype._setFulfilled = function () {
	    this._bitField = this._bitField | 33554432;
	    this._fireEvent("promiseFulfilled", this);
	};

	Promise.prototype._setRejected = function () {
	    this._bitField = this._bitField | 16777216;
	    this._fireEvent("promiseRejected", this);
	};

	Promise.prototype._setFollowing = function () {
	    this._bitField = this._bitField | 67108864;
	    this._fireEvent("promiseResolved", this);
	};

	Promise.prototype._setIsFinal = function () {
	    this._bitField = this._bitField | 4194304;
	};

	Promise.prototype._isFinal = function () {
	    return (this._bitField & 4194304) > 0;
	};

	Promise.prototype._unsetCancelled = function() {
	    this._bitField = this._bitField & (~65536);
	};

	Promise.prototype._setCancelled = function() {
	    this._bitField = this._bitField | 65536;
	    this._fireEvent("promiseCancelled", this);
	};

	Promise.prototype._setWillBeCancelled = function() {
	    this._bitField = this._bitField | 8388608;
	};

	Promise.prototype._setAsyncGuaranteed = function() {
	    if (async$1.hasCustomScheduler()) return;
	    this._bitField = this._bitField | 134217728;
	};

	Promise.prototype._receiverAt = function (index) {
	    var ret = index === 0 ? this._receiver0 : this[
	            index * 4 - 4 + 3];
	    if (ret === UNDEFINED_BINDING) {
	        return undefined;
	    } else if (ret === undefined && this._isBound()) {
	        return this._boundValue();
	    }
	    return ret;
	};

	Promise.prototype._promiseAt = function (index) {
	    return this[
	            index * 4 - 4 + 2];
	};

	Promise.prototype._fulfillmentHandlerAt = function (index) {
	    return this[
	            index * 4 - 4 + 0];
	};

	Promise.prototype._rejectionHandlerAt = function (index) {
	    return this[
	            index * 4 - 4 + 1];
	};

	Promise.prototype._boundValue = function() {};

	Promise.prototype._migrateCallback0 = function (follower) {
	    var bitField = follower._bitField;
	    var fulfill = follower._fulfillmentHandler0;
	    var reject = follower._rejectionHandler0;
	    var promise = follower._promise0;
	    var receiver = follower._receiverAt(0);
	    if (receiver === undefined) receiver = UNDEFINED_BINDING;
	    this._addCallbacks(fulfill, reject, promise, receiver, null);
	};

	Promise.prototype._migrateCallbackAt = function (follower, index) {
	    var fulfill = follower._fulfillmentHandlerAt(index);
	    var reject = follower._rejectionHandlerAt(index);
	    var promise = follower._promiseAt(index);
	    var receiver = follower._receiverAt(index);
	    if (receiver === undefined) receiver = UNDEFINED_BINDING;
	    this._addCallbacks(fulfill, reject, promise, receiver, null);
	};

	Promise.prototype._addCallbacks = function (
	    fulfill,
	    reject,
	    promise,
	    receiver,
	    domain
	) {
	    var index = this._length();

	    if (index >= 65535 - 4) {
	        index = 0;
	        this._setLength(0);
	    }

	    if (index === 0) {
	        this._promise0 = promise;
	        this._receiver0 = receiver;
	        if (typeof fulfill === "function") {
	            this._fulfillmentHandler0 =
	                domain === null ? fulfill : util$1.domainBind(domain, fulfill);
	        }
	        if (typeof reject === "function") {
	            this._rejectionHandler0 =
	                domain === null ? reject : util$1.domainBind(domain, reject);
	        }
	    } else {
	        var base = index * 4 - 4;
	        this[base + 2] = promise;
	        this[base + 3] = receiver;
	        if (typeof fulfill === "function") {
	            this[base + 0] =
	                domain === null ? fulfill : util$1.domainBind(domain, fulfill);
	        }
	        if (typeof reject === "function") {
	            this[base + 1] =
	                domain === null ? reject : util$1.domainBind(domain, reject);
	        }
	    }
	    this._setLength(index + 1);
	    return index;
	};

	Promise.prototype._proxy = function (proxyable, arg) {
	    this._addCallbacks(undefined, undefined, arg, proxyable, null);
	};

	Promise.prototype._resolveCallback = function(value, shouldBind) {
	    if (((this._bitField & 117506048) !== 0)) return;
	    if (value === this)
	        return this._rejectCallback(makeSelfResolutionError(), false);
	    var maybePromise = tryConvertToPromise(value, this);
	    if (!(maybePromise instanceof Promise)) return this._fulfill(value);

	    if (shouldBind) this._propagateFrom(maybePromise, 2);

	    var promise = maybePromise._target();

	    if (promise === this) {
	        this._reject(makeSelfResolutionError());
	        return;
	    }

	    var bitField = promise._bitField;
	    if (((bitField & 50397184) === 0)) {
	        var len = this._length();
	        if (len > 0) promise._migrateCallback0(this);
	        for (var i = 1; i < len; ++i) {
	            promise._migrateCallbackAt(this, i);
	        }
	        this._setFollowing();
	        this._setLength(0);
	        this._setFollowee(promise);
	    } else if (((bitField & 33554432) !== 0)) {
	        this._fulfill(promise._value());
	    } else if (((bitField & 16777216) !== 0)) {
	        this._reject(promise._reason());
	    } else {
	        var reason = new CancellationError("late cancellation observer");
	        promise._attachExtraTrace(reason);
	        this._reject(reason);
	    }
	};

	Promise.prototype._rejectCallback =
	function(reason, synchronous, ignoreNonErrorWarnings) {
	    var trace = util$1.ensureErrorObject(reason);
	    var hasStack = trace === reason;
	    if (!hasStack && !ignoreNonErrorWarnings && debug.warnings()) {
	        var message = "a promise was rejected with a non-error: " +
	            util$1.classString(reason);
	        this._warn(message, true);
	    }
	    this._attachExtraTrace(trace, synchronous ? hasStack : false);
	    this._reject(reason);
	};

	Promise.prototype._resolveFromExecutor = function (executor) {
	    if (executor === INTERNAL) return;
	    var promise = this;
	    this._captureStackTrace();
	    this._pushContext();
	    var synchronous = true;
	    var r = this._execute(executor, function(value) {
	        promise._resolveCallback(value);
	    }, function (reason) {
	        promise._rejectCallback(reason, synchronous);
	    });
	    synchronous = false;
	    this._popContext();

	    if (r !== undefined) {
	        promise._rejectCallback(r, true);
	    }
	};

	Promise.prototype._settlePromiseFromHandler = function (
	    handler, receiver, value, promise
	) {
	    var bitField = promise._bitField;
	    if (((bitField & 65536) !== 0)) return;
	    promise._pushContext();
	    var x;
	    if (receiver === APPLY) {
	        if (!value || typeof value.length !== "number") {
	            x = errorObj;
	            x.e = new TypeError("cannot .spread() a non-array: " +
	                                    util$1.classString(value));
	        } else {
	            x = tryCatch(handler).apply(this._boundValue(), value);
	        }
	    } else {
	        x = tryCatch(handler).call(receiver, value);
	    }
	    var promiseCreated = promise._popContext();
	    bitField = promise._bitField;
	    if (((bitField & 65536) !== 0)) return;

	    if (x === NEXT_FILTER) {
	        promise._reject(value);
	    } else if (x === errorObj) {
	        promise._rejectCallback(x.e, false);
	    } else {
	        debug.checkForgottenReturns(x, promiseCreated, "",  promise, this);
	        promise._resolveCallback(x);
	    }
	};

	Promise.prototype._target = function() {
	    var ret = this;
	    while (ret._isFollowing()) ret = ret._followee();
	    return ret;
	};

	Promise.prototype._followee = function() {
	    return this._rejectionHandler0;
	};

	Promise.prototype._setFollowee = function(promise) {
	    this._rejectionHandler0 = promise;
	};

	Promise.prototype._settlePromise = function(promise, handler, receiver, value) {
	    var isPromise = promise instanceof Promise;
	    var bitField = this._bitField;
	    var asyncGuaranteed = ((bitField & 134217728) !== 0);
	    if (((bitField & 65536) !== 0)) {
	        if (isPromise) promise._invokeInternalOnCancel();

	        if (receiver instanceof PassThroughHandlerContext &&
	            receiver.isFinallyHandler()) {
	            receiver.cancelPromise = promise;
	            if (tryCatch(handler).call(receiver, value) === errorObj) {
	                promise._reject(errorObj.e);
	            }
	        } else if (handler === reflectHandler) {
	            promise._fulfill(reflectHandler.call(receiver));
	        } else if (receiver instanceof Proxyable) {
	            receiver._promiseCancelled(promise);
	        } else if (isPromise || promise instanceof PromiseArray) {
	            promise._cancel();
	        } else {
	            receiver.cancel();
	        }
	    } else if (typeof handler === "function") {
	        if (!isPromise) {
	            handler.call(receiver, value, promise);
	        } else {
	            if (asyncGuaranteed) promise._setAsyncGuaranteed();
	            this._settlePromiseFromHandler(handler, receiver, value, promise);
	        }
	    } else if (receiver instanceof Proxyable) {
	        if (!receiver._isResolved()) {
	            if (((bitField & 33554432) !== 0)) {
	                receiver._promiseFulfilled(value, promise);
	            } else {
	                receiver._promiseRejected(value, promise);
	            }
	        }
	    } else if (isPromise) {
	        if (asyncGuaranteed) promise._setAsyncGuaranteed();
	        if (((bitField & 33554432) !== 0)) {
	            promise._fulfill(value);
	        } else {
	            promise._reject(value);
	        }
	    }
	};

	Promise.prototype._settlePromiseLateCancellationObserver = function(ctx) {
	    var handler = ctx.handler;
	    var promise = ctx.promise;
	    var receiver = ctx.receiver;
	    var value = ctx.value;
	    if (typeof handler === "function") {
	        if (!(promise instanceof Promise)) {
	            handler.call(receiver, value, promise);
	        } else {
	            this._settlePromiseFromHandler(handler, receiver, value, promise);
	        }
	    } else if (promise instanceof Promise) {
	        promise._reject(value);
	    }
	};

	Promise.prototype._settlePromiseCtx = function(ctx) {
	    this._settlePromise(ctx.promise, ctx.handler, ctx.receiver, ctx.value);
	};

	Promise.prototype._settlePromise0 = function(handler, value, bitField) {
	    var promise = this._promise0;
	    var receiver = this._receiverAt(0);
	    this._promise0 = undefined;
	    this._receiver0 = undefined;
	    this._settlePromise(promise, handler, receiver, value);
	};

	Promise.prototype._clearCallbackDataAtIndex = function(index) {
	    var base = index * 4 - 4;
	    this[base + 2] =
	    this[base + 3] =
	    this[base + 0] =
	    this[base + 1] = undefined;
	};

	Promise.prototype._fulfill = function (value) {
	    var bitField = this._bitField;
	    if (((bitField & 117506048) >>> 16)) return;
	    if (value === this) {
	        var err = makeSelfResolutionError();
	        this._attachExtraTrace(err);
	        return this._reject(err);
	    }
	    this._setFulfilled();
	    this._rejectionHandler0 = value;

	    if ((bitField & 65535) > 0) {
	        if (((bitField & 134217728) !== 0)) {
	            this._settlePromises();
	        } else {
	            async$1.settlePromises(this);
	        }
	        this._dereferenceTrace();
	    }
	};

	Promise.prototype._reject = function (reason) {
	    var bitField = this._bitField;
	    if (((bitField & 117506048) >>> 16)) return;
	    this._setRejected();
	    this._fulfillmentHandler0 = reason;

	    if (this._isFinal()) {
	        return async$1.fatalError(reason, util$1.isNode);
	    }

	    if ((bitField & 65535) > 0) {
	        async$1.settlePromises(this);
	    } else {
	        this._ensurePossibleRejectionHandled();
	    }
	};

	Promise.prototype._fulfillPromises = function (len, value) {
	    for (var i = 1; i < len; i++) {
	        var handler = this._fulfillmentHandlerAt(i);
	        var promise = this._promiseAt(i);
	        var receiver = this._receiverAt(i);
	        this._clearCallbackDataAtIndex(i);
	        this._settlePromise(promise, handler, receiver, value);
	    }
	};

	Promise.prototype._rejectPromises = function (len, reason) {
	    for (var i = 1; i < len; i++) {
	        var handler = this._rejectionHandlerAt(i);
	        var promise = this._promiseAt(i);
	        var receiver = this._receiverAt(i);
	        this._clearCallbackDataAtIndex(i);
	        this._settlePromise(promise, handler, receiver, reason);
	    }
	};

	Promise.prototype._settlePromises = function () {
	    var bitField = this._bitField;
	    var len = (bitField & 65535);

	    if (len > 0) {
	        if (((bitField & 16842752) !== 0)) {
	            var reason = this._fulfillmentHandler0;
	            this._settlePromise0(this._rejectionHandler0, reason, bitField);
	            this._rejectPromises(len, reason);
	        } else {
	            var value = this._rejectionHandler0;
	            this._settlePromise0(this._fulfillmentHandler0, value, bitField);
	            this._fulfillPromises(len, value);
	        }
	        this._setLength(0);
	    }
	    this._clearCancellationData();
	};

	Promise.prototype._settledValue = function() {
	    var bitField = this._bitField;
	    if (((bitField & 33554432) !== 0)) {
	        return this._rejectionHandler0;
	    } else if (((bitField & 16777216) !== 0)) {
	        return this._fulfillmentHandler0;
	    }
	};

	if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
	    es5$1.defineProperty(Promise.prototype, Symbol.toStringTag, {
	        get: function () {
	            return "Object";
	        }
	    });
	}

	function deferResolve(v) {this.promise._resolveCallback(v);}
	function deferReject(v) {this.promise._rejectCallback(v, false);}

	Promise.defer = Promise.pending = function() {
	    debug.deprecated("Promise.defer", "new Promise");
	    var promise = new Promise(INTERNAL);
	    return {
	        promise: promise,
	        resolve: deferResolve,
	        reject: deferReject
	    };
	};

	util$1.notEnumerableProp(Promise,
	                       "_makeSelfResolutionError",
	                       makeSelfResolutionError);

	method(Promise, INTERNAL, tryConvertToPromise, apiRejection,
	    debug);
	bind(Promise, INTERNAL, tryConvertToPromise, debug);
	cancel(Promise, PromiseArray, apiRejection, debug);
	direct_resolve(Promise);
	synchronous_inspection(Promise);
	join(
	    Promise, PromiseArray, tryConvertToPromise, INTERNAL, async$1, getDomain);
	Promise.Promise = Promise;
	Promise.version = "3.5.5";
	call_get(Promise);
	generators(Promise, apiRejection, INTERNAL, tryConvertToPromise, Proxyable, debug);
	map(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug);
	nodeify(Promise);
	promisify$1(Promise, INTERNAL);
	props(Promise, PromiseArray, tryConvertToPromise, apiRejection);
	race(Promise, INTERNAL, tryConvertToPromise, apiRejection);
	reduce(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug);
	settle(Promise, PromiseArray, debug);
	some(Promise, PromiseArray, apiRejection);
	timers(Promise, INTERNAL, debug);
	using(Promise, apiRejection, tryConvertToPromise, createContext, INTERNAL, debug);
	any(Promise);
	each(Promise, INTERNAL);
	filter$1(Promise, INTERNAL);
	                                                         
	    util$1.toFastProperties(Promise);                                          
	    util$1.toFastProperties(Promise.prototype);                                
	    function fillTypes(value) {                                              
	        var p = new Promise(INTERNAL);                                       
	        p._fulfillmentHandler0 = value;                                      
	        p._rejectionHandler0 = value;                                        
	        p._promise0 = value;                                                 
	        p._receiver0 = value;                                                
	    }                                                                        
	    // Complete slack tracking, opt out of field-type tracking and           
	    // stabilize map                                                         
	    fillTypes({a: 1});                                                       
	    fillTypes({b: 2});                                                       
	    fillTypes({c: 3});                                                       
	    fillTypes(1);                                                            
	    fillTypes(function(){});                                                 
	    fillTypes(undefined);                                                    
	    fillTypes(false);                                                        
	    fillTypes(new Promise(INTERNAL));                                        
	    debug.setBounds(Async.firstLineError, util$1.lastLineError);               
	    return Promise;                                                          

	};
	});

	var old$1;
	if (typeof Promise !== "undefined") old$1 = Promise;
	function noConflict() {
	    try { if (Promise === bluebird) Promise = old$1; }
	    catch (e) {}
	    return bluebird;
	}
	var bluebird = promise();
	bluebird.noConflict = noConflict;
	var bluebird_1 = bluebird;

	var tmpPromise = createCommonjsModule(function (module) {
	// file
	module.exports.fileSync = tmp.fileSync;
	var file = bluebird_1.promisify(tmp.file, {multiArgs: true});

	module.exports.file = function file$promise() {
	  return file.apply(tmp, arguments).spread(function (path, fd, cleanup) {
	    return {path: path, fd: fd, cleanup : cleanup };
	  });
	};

	module.exports.withFile = function withFile(fn) {
	  var cleanup;

	  var params = Array.prototype.slice.call(arguments, 1);

	  return module.exports.file.apply(tmp, params).then(function context(o) {
	    cleanup = o.cleanup;
	    delete o.cleanup;
	    return fn(o);
	  }).finally(function () {
	    // May not pass any arguments to cleanup() or it fails.
	    if (cleanup) {
	      cleanup();
	    }
	  });
	};


	// directory
	module.exports.dirSync = tmp.dirSync;
	var dir = bluebird_1.promisify(tmp.dir, {multiArgs: true});

	module.exports.dir = function dir$promise() {
	  return dir.apply(tmp, arguments).spread(function (path, cleanup) {
	    return {path: path, cleanup: cleanup};
	  });
	};

	module.exports.withDir = function withDir(fn) {
	  var cleanup;

	  var params = Array.prototype.slice.call(arguments, 1);

	  return module.exports.dir.apply(tmp, params).then(function context(o) {
	    cleanup = o.cleanup;
	    delete o.cleanup;
	    return fn(o);
	  }).finally(function () {
	    // May not pass any arguments to cleanup() or it fails.
	    if (cleanup) {
	      cleanup();
	    }
	  });
	};


	// name generation
	module.exports.tmpNameSync = tmp.tmpNameSync;
	module.exports.tmpName = bluebird_1.promisify(tmp.tmpName);

	module.exports.tmpdir = tmp.tmpdir;

	module.exports.setGracefulCleanup = tmp.setGracefulCleanup;
	});
	var tmpPromise_1 = tmpPromise.fileSync;
	var tmpPromise_2 = tmpPromise.file;
	var tmpPromise_3 = tmpPromise.withFile;
	var tmpPromise_4 = tmpPromise.dirSync;
	var tmpPromise_5 = tmpPromise.dir;
	var tmpPromise_6 = tmpPromise.withDir;
	var tmpPromise_7 = tmpPromise.tmpNameSync;
	var tmpPromise_8 = tmpPromise.tmpName;
	var tmpPromise_9 = tmpPromise.tmpdir;
	var tmpPromise_10 = tmpPromise.setGracefulCleanup;

	var uint32 = createCommonjsModule(function (module) {
	(function (root) {

		// Local cache for typical radices
		var radixPowerCache = {
			36: UINT32( Math.pow(36, 5) )
		,	16: UINT32( Math.pow(16, 7) )
		,	10: UINT32( Math.pow(10, 9) )
		,	2:  UINT32( Math.pow(2, 30) )
		};
		var radixCache = {
			36: UINT32(36)
		,	16: UINT32(16)
		,	10: UINT32(10)
		,	2:  UINT32(2)
		};

		/**
		 *	Represents an unsigned 32 bits integer
		 * @constructor
		 * @param {Number|String|Number} low bits     | integer as a string 		 | integer as a number
		 * @param {Number|Number|Undefined} high bits | radix (optional, default=10)
		 * @return 
		 */
		function UINT32 (l, h) {
			if ( !(this instanceof UINT32) )
				return new UINT32(l, h)

			this._low = 0;
			this._high = 0;
			this.remainder = null;
			if (typeof h == 'undefined')
				return fromNumber.call(this, l)

			if (typeof l == 'string')
				return fromString.call(this, l, h)

			fromBits.call(this, l, h);
		}

		/**
		 * Set the current _UINT32_ object with its low and high bits
		 * @method fromBits
		 * @param {Number} low bits
		 * @param {Number} high bits
		 * @return ThisExpression
		 */
		function fromBits (l, h) {
			this._low = l | 0;
			this._high = h | 0;

			return this
		}
		UINT32.prototype.fromBits = fromBits;

		/**
		 * Set the current _UINT32_ object from a number
		 * @method fromNumber
		 * @param {Number} number
		 * @return ThisExpression
		 */
		function fromNumber (value) {
			this._low = value & 0xFFFF;
			this._high = value >>> 16;

			return this
		}
		UINT32.prototype.fromNumber = fromNumber;

		/**
		 * Set the current _UINT32_ object from a string
		 * @method fromString
		 * @param {String} integer as a string
		 * @param {Number} radix (optional, default=10)
		 * @return ThisExpression
		 */
		function fromString (s, radix) {
			var value = parseInt(s, radix || 10);

			this._low = value & 0xFFFF;
			this._high = value >>> 16;

			return this
		}
		UINT32.prototype.fromString = fromString;

		/**
		 * Convert this _UINT32_ to a number
		 * @method toNumber
		 * @return {Number} the converted UINT32
		 */
		UINT32.prototype.toNumber = function () {
			return (this._high * 65536) + this._low
		};

		/**
		 * Convert this _UINT32_ to a string
		 * @method toString
		 * @param {Number} radix (optional, default=10)
		 * @return {String} the converted UINT32
		 */
		UINT32.prototype.toString = function (radix) {
			return this.toNumber().toString(radix || 10)
		};

		/**
		 * Add two _UINT32_. The current _UINT32_ stores the result
		 * @method add
		 * @param {Object} other UINT32
		 * @return ThisExpression
		 */
		UINT32.prototype.add = function (other) {
			var a00 = this._low + other._low;
			var a16 = a00 >>> 16;

			a16 += this._high + other._high;

			this._low = a00 & 0xFFFF;
			this._high = a16 & 0xFFFF;

			return this
		};

		/**
		 * Subtract two _UINT32_. The current _UINT32_ stores the result
		 * @method subtract
		 * @param {Object} other UINT32
		 * @return ThisExpression
		 */
		UINT32.prototype.subtract = function (other) {
			//TODO inline
			return this.add( other.clone().negate() )
		};

		/**
		 * Multiply two _UINT32_. The current _UINT32_ stores the result
		 * @method multiply
		 * @param {Object} other UINT32
		 * @return ThisExpression
		 */
		UINT32.prototype.multiply = function (other) {
			/*
				a = a00 + a16
				b = b00 + b16
				a*b = (a00 + a16)(b00 + b16)
					= a00b00 + a00b16 + a16b00 + a16b16

				a16b16 overflows the 32bits
			 */
			var a16 = this._high;
			var a00 = this._low;
			var b16 = other._high;
			var b00 = other._low;

	/* Removed to increase speed under normal circumstances (i.e. not multiplying by 0 or 1)
			// this == 0 or other == 1: nothing to do
			if ((a00 == 0 && a16 == 0) || (b00 == 1 && b16 == 0)) return this

			// other == 0 or this == 1: this = other
			if ((b00 == 0 && b16 == 0) || (a00 == 1 && a16 == 0)) {
				this._low = other._low
				this._high = other._high
				return this
			}
	*/

			var c16, c00;
			c00 = a00 * b00;
			c16 = c00 >>> 16;

			c16 += a16 * b00;
			c16 &= 0xFFFF;		// Not required but improves performance
			c16 += a00 * b16;

			this._low = c00 & 0xFFFF;
			this._high = c16 & 0xFFFF;

			return this
		};

		/**
		 * Divide two _UINT32_. The current _UINT32_ stores the result.
		 * The remainder is made available as the _remainder_ property on
		 * the _UINT32_ object. It can be null, meaning there are no remainder.
		 * @method div
		 * @param {Object} other UINT32
		 * @return ThisExpression
		 */
		UINT32.prototype.div = function (other) {
			if ( (other._low == 0) && (other._high == 0) ) throw Error('division by zero')

			// other == 1
			if (other._high == 0 && other._low == 1) {
				this.remainder = new UINT32(0);
				return this
			}

			// other > this: 0
			if ( other.gt(this) ) {
				this.remainder = this.clone();
				this._low = 0;
				this._high = 0;
				return this
			}
			// other == this: 1
			if ( this.eq(other) ) {
				this.remainder = new UINT32(0);
				this._low = 1;
				this._high = 0;
				return this
			}

			// Shift the divisor left until it is higher than the dividend
			var _other = other.clone();
			var i = -1;
			while ( !this.lt(_other) ) {
				// High bit can overflow the default 16bits
				// Its ok since we right shift after this loop
				// The overflown bit must be kept though
				_other.shiftLeft(1, true);
				i++;
			}

			// Set the remainder
			this.remainder = this.clone();
			// Initialize the current result to 0
			this._low = 0;
			this._high = 0;
			for (; i >= 0; i--) {
				_other.shiftRight(1);
				// If shifted divisor is smaller than the dividend
				// then subtract it from the dividend
				if ( !this.remainder.lt(_other) ) {
					this.remainder.subtract(_other);
					// Update the current result
					if (i >= 16) {
						this._high |= 1 << (i - 16);
					} else {
						this._low |= 1 << i;
					}
				}
			}

			return this
		};

		/**
		 * Negate the current _UINT32_
		 * @method negate
		 * @return ThisExpression
		 */
		UINT32.prototype.negate = function () {
			var v = ( ~this._low & 0xFFFF ) + 1;
			this._low = v & 0xFFFF;
			this._high = (~this._high + (v >>> 16)) & 0xFFFF;

			return this
		};

		/**
		 * Equals
		 * @method eq
		 * @param {Object} other UINT32
		 * @return {Boolean}
		 */
		UINT32.prototype.equals = UINT32.prototype.eq = function (other) {
			return (this._low == other._low) && (this._high == other._high)
		};

		/**
		 * Greater than (strict)
		 * @method gt
		 * @param {Object} other UINT32
		 * @return {Boolean}
		 */
		UINT32.prototype.greaterThan = UINT32.prototype.gt = function (other) {
			if (this._high > other._high) return true
			if (this._high < other._high) return false
			return this._low > other._low
		};

		/**
		 * Less than (strict)
		 * @method lt
		 * @param {Object} other UINT32
		 * @return {Boolean}
		 */
		UINT32.prototype.lessThan = UINT32.prototype.lt = function (other) {
			if (this._high < other._high) return true
			if (this._high > other._high) return false
			return this._low < other._low
		};

		/**
		 * Bitwise OR
		 * @method or
		 * @param {Object} other UINT32
		 * @return ThisExpression
		 */
		UINT32.prototype.or = function (other) {
			this._low |= other._low;
			this._high |= other._high;

			return this
		};

		/**
		 * Bitwise AND
		 * @method and
		 * @param {Object} other UINT32
		 * @return ThisExpression
		 */
		UINT32.prototype.and = function (other) {
			this._low &= other._low;
			this._high &= other._high;

			return this
		};

		/**
		 * Bitwise NOT
		 * @method not
		 * @return ThisExpression
		 */
		UINT32.prototype.not = function() {
			this._low = ~this._low & 0xFFFF;
			this._high = ~this._high & 0xFFFF;

			return this
		};

		/**
		 * Bitwise XOR
		 * @method xor
		 * @param {Object} other UINT32
		 * @return ThisExpression
		 */
		UINT32.prototype.xor = function (other) {
			this._low ^= other._low;
			this._high ^= other._high;

			return this
		};

		/**
		 * Bitwise shift right
		 * @method shiftRight
		 * @param {Number} number of bits to shift
		 * @return ThisExpression
		 */
		UINT32.prototype.shiftRight = UINT32.prototype.shiftr = function (n) {
			if (n > 16) {
				this._low = this._high >> (n - 16);
				this._high = 0;
			} else if (n == 16) {
				this._low = this._high;
				this._high = 0;
			} else {
				this._low = (this._low >> n) | ( (this._high << (16-n)) & 0xFFFF );
				this._high >>= n;
			}

			return this
		};

		/**
		 * Bitwise shift left
		 * @method shiftLeft
		 * @param {Number} number of bits to shift
		 * @param {Boolean} allow overflow
		 * @return ThisExpression
		 */
		UINT32.prototype.shiftLeft = UINT32.prototype.shiftl = function (n, allowOverflow) {
			if (n > 16) {
				this._high = this._low << (n - 16);
				this._low = 0;
				if (!allowOverflow) {
					this._high &= 0xFFFF;
				}
			} else if (n == 16) {
				this._high = this._low;
				this._low = 0;
			} else {
				this._high = (this._high << n) | (this._low >> (16-n));
				this._low = (this._low << n) & 0xFFFF;
				if (!allowOverflow) {
					// Overflow only allowed on the high bits...
					this._high &= 0xFFFF;
				}
			}

			return this
		};

		/**
		 * Bitwise rotate left
		 * @method rotl
		 * @param {Number} number of bits to rotate
		 * @return ThisExpression
		 */
		UINT32.prototype.rotateLeft = UINT32.prototype.rotl = function (n) {
			var v = (this._high << 16) | this._low;
			v = (v << n) | (v >>> (32 - n));
			this._low = v & 0xFFFF;
			this._high = v >>> 16;

			return this
		};

		/**
		 * Bitwise rotate right
		 * @method rotr
		 * @param {Number} number of bits to rotate
		 * @return ThisExpression
		 */
		UINT32.prototype.rotateRight = UINT32.prototype.rotr = function (n) {
			var v = (this._high << 16) | this._low;
			v = (v >>> n) | (v << (32 - n));
			this._low = v & 0xFFFF;
			this._high = v >>> 16;

			return this
		};

		/**
		 * Clone the current _UINT32_
		 * @method clone
		 * @return {Object} cloned UINT32
		 */
		UINT32.prototype.clone = function () {
			return new UINT32(this._low, this._high)
		};

		if ( module.exports) {
			// Node.js
			module.exports = UINT32;
		} else {
			// Browser
			root['UINT32'] = UINT32;
		}

	})(commonjsGlobal);
	});

	var uint64 = createCommonjsModule(function (module) {
	(function (root) {

		// Local cache for typical radices
		var radixPowerCache = {
			16: UINT64( Math.pow(16, 5) )
		,	10: UINT64( Math.pow(10, 5) )
		,	2:  UINT64( Math.pow(2, 5) )
		};
		var radixCache = {
			16: UINT64(16)
		,	10: UINT64(10)
		,	2:  UINT64(2)
		};

		/**
		 *	Represents an unsigned 64 bits integer
		 * @constructor
		 * @param {Number} first low bits (8)
		 * @param {Number} second low bits (8)
		 * @param {Number} first high bits (8)
		 * @param {Number} second high bits (8)
		 * or
		 * @param {Number} low bits (32)
		 * @param {Number} high bits (32)
		 * or
		 * @param {String|Number} integer as a string 		 | integer as a number
		 * @param {Number|Undefined} radix (optional, default=10)
		 * @return 
		 */
		function UINT64 (a00, a16, a32, a48) {
			if ( !(this instanceof UINT64) )
				return new UINT64(a00, a16, a32, a48)

			this.remainder = null;
			if (typeof a00 == 'string')
				return fromString.call(this, a00, a16)

			if (typeof a16 == 'undefined')
				return fromNumber.call(this, a00)

			fromBits.apply(this, arguments);
		}

		/**
		 * Set the current _UINT64_ object with its low and high bits
		 * @method fromBits
		 * @param {Number} first low bits (8)
		 * @param {Number} second low bits (8)
		 * @param {Number} first high bits (8)
		 * @param {Number} second high bits (8)
		 * or
		 * @param {Number} low bits (32)
		 * @param {Number} high bits (32)
		 * @return ThisExpression
		 */
		function fromBits (a00, a16, a32, a48) {
			if (typeof a32 == 'undefined') {
				this._a00 = a00 & 0xFFFF;
				this._a16 = a00 >>> 16;
				this._a32 = a16 & 0xFFFF;
				this._a48 = a16 >>> 16;
				return this
			}

			this._a00 = a00 | 0;
			this._a16 = a16 | 0;
			this._a32 = a32 | 0;
			this._a48 = a48 | 0;

			return this
		}
		UINT64.prototype.fromBits = fromBits;

		/**
		 * Set the current _UINT64_ object from a number
		 * @method fromNumber
		 * @param {Number} number
		 * @return ThisExpression
		 */
		function fromNumber (value) {
			this._a00 = value & 0xFFFF;
			this._a16 = value >>> 16;
			this._a32 = 0;
			this._a48 = 0;

			return this
		}
		UINT64.prototype.fromNumber = fromNumber;

		/**
		 * Set the current _UINT64_ object from a string
		 * @method fromString
		 * @param {String} integer as a string
		 * @param {Number} radix (optional, default=10)
		 * @return ThisExpression
		 */
		function fromString (s, radix) {
			radix = radix || 10;

			this._a00 = 0;
			this._a16 = 0;
			this._a32 = 0;
			this._a48 = 0;

			/*
				In Javascript, bitwise operators only operate on the first 32 bits 
				of a number, even though parseInt() encodes numbers with a 53 bits 
				mantissa.
				Therefore UINT64(<Number>) can only work on 32 bits.
				The radix maximum value is 36 (as per ECMA specs) (26 letters + 10 digits)
				maximum input value is m = 32bits as 1 = 2^32 - 1
				So the maximum substring length n is:
				36^(n+1) - 1 = 2^32 - 1
				36^(n+1) = 2^32
				(n+1)ln(36) = 32ln(2)
				n = 32ln(2)/ln(36) - 1
				n = 5.189644915687692
				n = 5
			 */
			var radixUint = radixPowerCache[radix] || new UINT64( Math.pow(radix, 5) );

			for (var i = 0, len = s.length; i < len; i += 5) {
				var size = Math.min(5, len - i);
				var value = parseInt( s.slice(i, i + size), radix );
				this.multiply(
						size < 5
							? new UINT64( Math.pow(radix, size) )
							: radixUint
					)
					.add( new UINT64(value) );
			}

			return this
		}
		UINT64.prototype.fromString = fromString;

		/**
		 * Convert this _UINT64_ to a number (last 32 bits are dropped)
		 * @method toNumber
		 * @return {Number} the converted UINT64
		 */
		UINT64.prototype.toNumber = function () {
			return (this._a16 * 65536) + this._a00
		};

		/**
		 * Convert this _UINT64_ to a string
		 * @method toString
		 * @param {Number} radix (optional, default=10)
		 * @return {String} the converted UINT64
		 */
		UINT64.prototype.toString = function (radix) {
			radix = radix || 10;
			var radixUint = radixCache[radix] || new UINT64(radix);

			if ( !this.gt(radixUint) ) return this.toNumber().toString(radix)

			var self = this.clone();
			var res = new Array(64);
			for (var i = 63; i >= 0; i--) {
				self.div(radixUint);
				res[i] = self.remainder.toNumber().toString(radix);
				if ( !self.gt(radixUint) ) break
			}
			res[i-1] = self.toNumber().toString(radix);

			return res.join('')
		};

		/**
		 * Add two _UINT64_. The current _UINT64_ stores the result
		 * @method add
		 * @param {Object} other UINT64
		 * @return ThisExpression
		 */
		UINT64.prototype.add = function (other) {
			var a00 = this._a00 + other._a00;

			var a16 = a00 >>> 16;
			a16 += this._a16 + other._a16;

			var a32 = a16 >>> 16;
			a32 += this._a32 + other._a32;

			var a48 = a32 >>> 16;
			a48 += this._a48 + other._a48;

			this._a00 = a00 & 0xFFFF;
			this._a16 = a16 & 0xFFFF;
			this._a32 = a32 & 0xFFFF;
			this._a48 = a48 & 0xFFFF;

			return this
		};

		/**
		 * Subtract two _UINT64_. The current _UINT64_ stores the result
		 * @method subtract
		 * @param {Object} other UINT64
		 * @return ThisExpression
		 */
		UINT64.prototype.subtract = function (other) {
			return this.add( other.clone().negate() )
		};

		/**
		 * Multiply two _UINT64_. The current _UINT64_ stores the result
		 * @method multiply
		 * @param {Object} other UINT64
		 * @return ThisExpression
		 */
		UINT64.prototype.multiply = function (other) {
			/*
				a = a00 + a16 + a32 + a48
				b = b00 + b16 + b32 + b48
				a*b = (a00 + a16 + a32 + a48)(b00 + b16 + b32 + b48)
					= a00b00 + a00b16 + a00b32 + a00b48
					+ a16b00 + a16b16 + a16b32 + a16b48
					+ a32b00 + a32b16 + a32b32 + a32b48
					+ a48b00 + a48b16 + a48b32 + a48b48

				a16b48, a32b32, a48b16, a48b32 and a48b48 overflow the 64 bits
				so it comes down to:
				a*b	= a00b00 + a00b16 + a00b32 + a00b48
					+ a16b00 + a16b16 + a16b32
					+ a32b00 + a32b16
					+ a48b00
					= a00b00
					+ a00b16 + a16b00
					+ a00b32 + a16b16 + a32b00
					+ a00b48 + a16b32 + a32b16 + a48b00
			 */
			var a00 = this._a00;
			var a16 = this._a16;
			var a32 = this._a32;
			var a48 = this._a48;
			var b00 = other._a00;
			var b16 = other._a16;
			var b32 = other._a32;
			var b48 = other._a48;

			var c00 = a00 * b00;

			var c16 = c00 >>> 16;
			c16 += a00 * b16;
			var c32 = c16 >>> 16;
			c16 &= 0xFFFF;
			c16 += a16 * b00;

			c32 += c16 >>> 16;
			c32 += a00 * b32;
			var c48 = c32 >>> 16;
			c32 &= 0xFFFF;
			c32 += a16 * b16;
			c48 += c32 >>> 16;
			c32 &= 0xFFFF;
			c32 += a32 * b00;

			c48 += c32 >>> 16;
			c48 += a00 * b48;
			c48 &= 0xFFFF;
			c48 += a16 * b32;
			c48 &= 0xFFFF;
			c48 += a32 * b16;
			c48 &= 0xFFFF;
			c48 += a48 * b00;

			this._a00 = c00 & 0xFFFF;
			this._a16 = c16 & 0xFFFF;
			this._a32 = c32 & 0xFFFF;
			this._a48 = c48 & 0xFFFF;

			return this
		};

		/**
		 * Divide two _UINT64_. The current _UINT64_ stores the result.
		 * The remainder is made available as the _remainder_ property on
		 * the _UINT64_ object. It can be null, meaning there are no remainder.
		 * @method div
		 * @param {Object} other UINT64
		 * @return ThisExpression
		 */
		UINT64.prototype.div = function (other) {
			if ( (other._a16 == 0) && (other._a32 == 0) && (other._a48 == 0) ) {
				if (other._a00 == 0) throw Error('division by zero')

				// other == 1: this
				if (other._a00 == 1) {
					this.remainder = new UINT64(0);
					return this
				}
			}

			// other > this: 0
			if ( other.gt(this) ) {
				this.remainder = this.clone();
				this._a00 = 0;
				this._a16 = 0;
				this._a32 = 0;
				this._a48 = 0;
				return this
			}
			// other == this: 1
			if ( this.eq(other) ) {
				this.remainder = new UINT64(0);
				this._a00 = 1;
				this._a16 = 0;
				this._a32 = 0;
				this._a48 = 0;
				return this
			}

			// Shift the divisor left until it is higher than the dividend
			var _other = other.clone();
			var i = -1;
			while ( !this.lt(_other) ) {
				// High bit can overflow the default 16bits
				// Its ok since we right shift after this loop
				// The overflown bit must be kept though
				_other.shiftLeft(1, true);
				i++;
			}

			// Set the remainder
			this.remainder = this.clone();
			// Initialize the current result to 0
			this._a00 = 0;
			this._a16 = 0;
			this._a32 = 0;
			this._a48 = 0;
			for (; i >= 0; i--) {
				_other.shiftRight(1);
				// If shifted divisor is smaller than the dividend
				// then subtract it from the dividend
				if ( !this.remainder.lt(_other) ) {
					this.remainder.subtract(_other);
					// Update the current result
					if (i >= 48) {
						this._a48 |= 1 << (i - 48);
					} else if (i >= 32) {
						this._a32 |= 1 << (i - 32);
					} else if (i >= 16) {
						this._a16 |= 1 << (i - 16);
					} else {
						this._a00 |= 1 << i;
					}
				}
			}

			return this
		};

		/**
		 * Negate the current _UINT64_
		 * @method negate
		 * @return ThisExpression
		 */
		UINT64.prototype.negate = function () {
			var v = ( ~this._a00 & 0xFFFF ) + 1;
			this._a00 = v & 0xFFFF;
			v = (~this._a16 & 0xFFFF) + (v >>> 16);
			this._a16 = v & 0xFFFF;
			v = (~this._a32 & 0xFFFF) + (v >>> 16);
			this._a32 = v & 0xFFFF;
			this._a48 = (~this._a48 + (v >>> 16)) & 0xFFFF;

			return this
		};

		/**

		 * @method eq
		 * @param {Object} other UINT64
		 * @return {Boolean}
		 */
		UINT64.prototype.equals = UINT64.prototype.eq = function (other) {
			return (this._a48 == other._a48) && (this._a00 == other._a00)
				 && (this._a32 == other._a32) && (this._a16 == other._a16)
		};

		/**
		 * Greater than (strict)
		 * @method gt
		 * @param {Object} other UINT64
		 * @return {Boolean}
		 */
		UINT64.prototype.greaterThan = UINT64.prototype.gt = function (other) {
			if (this._a48 > other._a48) return true
			if (this._a48 < other._a48) return false
			if (this._a32 > other._a32) return true
			if (this._a32 < other._a32) return false
			if (this._a16 > other._a16) return true
			if (this._a16 < other._a16) return false
			return this._a00 > other._a00
		};

		/**
		 * Less than (strict)
		 * @method lt
		 * @param {Object} other UINT64
		 * @return {Boolean}
		 */
		UINT64.prototype.lessThan = UINT64.prototype.lt = function (other) {
			if (this._a48 < other._a48) return true
			if (this._a48 > other._a48) return false
			if (this._a32 < other._a32) return true
			if (this._a32 > other._a32) return false
			if (this._a16 < other._a16) return true
			if (this._a16 > other._a16) return false
			return this._a00 < other._a00
		};

		/**
		 * Bitwise OR
		 * @method or
		 * @param {Object} other UINT64
		 * @return ThisExpression
		 */
		UINT64.prototype.or = function (other) {
			this._a00 |= other._a00;
			this._a16 |= other._a16;
			this._a32 |= other._a32;
			this._a48 |= other._a48;

			return this
		};

		/**
		 * Bitwise AND
		 * @method and
		 * @param {Object} other UINT64
		 * @return ThisExpression
		 */
		UINT64.prototype.and = function (other) {
			this._a00 &= other._a00;
			this._a16 &= other._a16;
			this._a32 &= other._a32;
			this._a48 &= other._a48;

			return this
		};

		/**
		 * Bitwise XOR
		 * @method xor
		 * @param {Object} other UINT64
		 * @return ThisExpression
		 */
		UINT64.prototype.xor = function (other) {
			this._a00 ^= other._a00;
			this._a16 ^= other._a16;
			this._a32 ^= other._a32;
			this._a48 ^= other._a48;

			return this
		};

		/**
		 * Bitwise NOT
		 * @method not
		 * @return ThisExpression
		 */
		UINT64.prototype.not = function() {
			this._a00 = ~this._a00 & 0xFFFF;
			this._a16 = ~this._a16 & 0xFFFF;
			this._a32 = ~this._a32 & 0xFFFF;
			this._a48 = ~this._a48 & 0xFFFF;

			return this
		};

		/**
		 * Bitwise shift right
		 * @method shiftRight
		 * @param {Number} number of bits to shift
		 * @return ThisExpression
		 */
		UINT64.prototype.shiftRight = UINT64.prototype.shiftr = function (n) {
			n %= 64;
			if (n >= 48) {
				this._a00 = this._a48 >> (n - 48);
				this._a16 = 0;
				this._a32 = 0;
				this._a48 = 0;
			} else if (n >= 32) {
				n -= 32;
				this._a00 = ( (this._a32 >> n) | (this._a48 << (16-n)) ) & 0xFFFF;
				this._a16 = (this._a48 >> n) & 0xFFFF;
				this._a32 = 0;
				this._a48 = 0;
			} else if (n >= 16) {
				n -= 16;
				this._a00 = ( (this._a16 >> n) | (this._a32 << (16-n)) ) & 0xFFFF;
				this._a16 = ( (this._a32 >> n) | (this._a48 << (16-n)) ) & 0xFFFF;
				this._a32 = (this._a48 >> n) & 0xFFFF;
				this._a48 = 0;
			} else {
				this._a00 = ( (this._a00 >> n) | (this._a16 << (16-n)) ) & 0xFFFF;
				this._a16 = ( (this._a16 >> n) | (this._a32 << (16-n)) ) & 0xFFFF;
				this._a32 = ( (this._a32 >> n) | (this._a48 << (16-n)) ) & 0xFFFF;
				this._a48 = (this._a48 >> n) & 0xFFFF;
			}

			return this
		};

		/**
		 * Bitwise shift left
		 * @method shiftLeft
		 * @param {Number} number of bits to shift
		 * @param {Boolean} allow overflow
		 * @return ThisExpression
		 */
		UINT64.prototype.shiftLeft = UINT64.prototype.shiftl = function (n, allowOverflow) {
			n %= 64;
			if (n >= 48) {
				this._a48 = this._a00 << (n - 48);
				this._a32 = 0;
				this._a16 = 0;
				this._a00 = 0;
			} else if (n >= 32) {
				n -= 32;
				this._a48 = (this._a16 << n) | (this._a00 >> (16-n));
				this._a32 = (this._a00 << n) & 0xFFFF;
				this._a16 = 0;
				this._a00 = 0;
			} else if (n >= 16) {
				n -= 16;
				this._a48 = (this._a32 << n) | (this._a16 >> (16-n));
				this._a32 = ( (this._a16 << n) | (this._a00 >> (16-n)) ) & 0xFFFF;
				this._a16 = (this._a00 << n) & 0xFFFF;
				this._a00 = 0;
			} else {
				this._a48 = (this._a48 << n) | (this._a32 >> (16-n));
				this._a32 = ( (this._a32 << n) | (this._a16 >> (16-n)) ) & 0xFFFF;
				this._a16 = ( (this._a16 << n) | (this._a00 >> (16-n)) ) & 0xFFFF;
				this._a00 = (this._a00 << n) & 0xFFFF;
			}
			if (!allowOverflow) {
				this._a48 &= 0xFFFF;
			}

			return this
		};

		/**
		 * Bitwise rotate left
		 * @method rotl
		 * @param {Number} number of bits to rotate
		 * @return ThisExpression
		 */
		UINT64.prototype.rotateLeft = UINT64.prototype.rotl = function (n) {
			n %= 64;
			if (n == 0) return this
			if (n >= 32) {
				// A.B.C.D
				// B.C.D.A rotl(16)
				// C.D.A.B rotl(32)
				var v = this._a00;
				this._a00 = this._a32;
				this._a32 = v;
				v = this._a48;
				this._a48 = this._a16;
				this._a16 = v;
				if (n == 32) return this
				n -= 32;
			}

			var high = (this._a48 << 16) | this._a32;
			var low = (this._a16 << 16) | this._a00;

			var _high = (high << n) | (low >>> (32 - n));
			var _low = (low << n) | (high >>> (32 - n));

			this._a00 = _low & 0xFFFF;
			this._a16 = _low >>> 16;
			this._a32 = _high & 0xFFFF;
			this._a48 = _high >>> 16;

			return this
		};

		/**
		 * Bitwise rotate right
		 * @method rotr
		 * @param {Number} number of bits to rotate
		 * @return ThisExpression
		 */
		UINT64.prototype.rotateRight = UINT64.prototype.rotr = function (n) {
			n %= 64;
			if (n == 0) return this
			if (n >= 32) {
				// A.B.C.D
				// D.A.B.C rotr(16)
				// C.D.A.B rotr(32)
				var v = this._a00;
				this._a00 = this._a32;
				this._a32 = v;
				v = this._a48;
				this._a48 = this._a16;
				this._a16 = v;
				if (n == 32) return this
				n -= 32;
			}

			var high = (this._a48 << 16) | this._a32;
			var low = (this._a16 << 16) | this._a00;

			var _high = (high >>> n) | (low << (32 - n));
			var _low = (low >>> n) | (high << (32 - n));

			this._a00 = _low & 0xFFFF;
			this._a16 = _low >>> 16;
			this._a32 = _high & 0xFFFF;
			this._a48 = _high >>> 16;

			return this
		};

		/**
		 * Clone the current _UINT64_
		 * @method clone
		 * @return {Object} cloned UINT64
		 */
		UINT64.prototype.clone = function () {
			return new UINT64(this._a00, this._a16, this._a32, this._a48)
		};

		if ( module.exports) {
			// Node.js
			module.exports = UINT64;
		} else {
			// Browser
			root['UINT64'] = UINT64;
		}

	})(commonjsGlobal);
	});

	var UINT32 = uint32;
	var UINT64 = uint64;

	var cuint = {
		UINT32: UINT32,
		UINT64: UINT64
	};

	const UINT64$1 = cuint.UINT64;

	const UINT32_MAX = 4294967295;

	class Filesystem {
	  constructor (src) {
	    this.src = path$1.resolve(src);
	    this.header = { files: {} };
	    this.offset = UINT64$1(0);
	  }

	  searchNodeFromDirectory (p) {
	    let json = this.header;
	    const dirs = p.split(path$1.sep);
	    for (const dir of dirs) {
	      if (dir !== '.') {
	        json = json.files[dir];
	      }
	    }
	    return json
	  }

	  searchNodeFromPath (p) {
	    p = path$1.relative(this.src, p);
	    if (!p) { return this.header }
	    const name = path$1.basename(p);
	    const node = this.searchNodeFromDirectory(path$1.dirname(p));
	    if (node.files == null) {
	      node.files = {};
	    }
	    if (node.files[name] == null) {
	      node.files[name] = {};
	    }
	    return node.files[name]
	  }

	  insertDirectory (p, shouldUnpack) {
	    const node = this.searchNodeFromPath(p);
	    if (shouldUnpack) {
	      node.unpacked = shouldUnpack;
	    }
	    node.files = {};
	    return node.files
	  }

	  async insertFile (p, shouldUnpack, file, options) {
	    const dirNode = this.searchNodeFromPath(path$1.dirname(p));
	    const node = this.searchNodeFromPath(p);
	    if (shouldUnpack || dirNode.unpacked) {
	      node.size = file.stat.size;
	      node.unpacked = true;
	      return Promise.resolve()
	    }

	    const handler = (resolve, reject) => {
	      const size = file.transformed ? file.transformed.stat.size : file.stat.size;

	      // JavaScript can not precisely present integers >= UINT32_MAX.
	      if (size > UINT32_MAX) {
	        const error = new Error(`${p}: file size can not be larger than 4.2GB`);
	        if (reject) {
	          return reject(error)
	        } else {
	          throw error
	        }
	      }

	      node.size = size;
	      node.offset = this.offset.toString();
	      if (process.platform !== 'win32' && (file.stat.mode & 0o100)) {
	        node.executable = true;
	      }
	      this.offset.add(UINT64$1(size));

	      return resolve ? resolve() : Promise.resolve()
	    };

	    const transformed = options.transform && options.transform(p);
	    if (transformed) {
	      const tmpfile = await tmpPromise.file();
	      return new Promise((resolve, reject) => {
	        const out = wrappedFs.createWriteStream(tmpfile.path);
	        const stream = wrappedFs.createReadStream(p);

	        stream.pipe(transformed).pipe(out);
	        return out.on('close', async () => {
	          file.transformed = {
	            path: tmpfile.path,
	            stat: await wrappedFs.lstat(tmpfile.path)
	          };
	          return handler(resolve, reject)
	        })
	      })
	    } else {
	      return handler()
	    }
	  }

	  insertLink (p) {
	    const link = path$1.relative(wrappedFs.realpathSync(this.src), wrappedFs.realpathSync(p));
	    if (link.substr(0, 2) === '..') {
	      throw new Error(`${p}: file links out of the package`)
	    }
	    const node = this.searchNodeFromPath(p);
	    node.link = link;
	    return link
	  }

	  listFiles (options) {
	    const files = [];
	    const fillFilesFromHeader = function (p, json) {
	      if (!json.files) {
	        return
	      }
	      return (() => {
	        const result = [];
	        for (const f in json.files) {
	          const fullPath = path$1.join(p, f);
	          const packState = json.files[f].unpacked === true ? 'unpack' : 'pack  ';
	          files.push((options && options.isPack) ? `${packState} : ${fullPath}` : fullPath);
	          result.push(fillFilesFromHeader(fullPath, json.files[f]));
	        }
	        return result
	      })()
	    };

	    fillFilesFromHeader('/', this.header);
	    return files
	  }

	  getNode (p) {
	    const node = this.searchNodeFromDirectory(path$1.dirname(p));
	    const name = path$1.basename(p);
	    if (name) {
	      return node.files[name]
	    } else {
	      return node
	    }
	  }

	  getFile (p, followLinks) {
	    followLinks = typeof followLinks === 'undefined' ? true : followLinks;
	    const info = this.getNode(p);

	    // if followLinks is false we don't resolve symlinks
	    if (info.link && followLinks) {
	      return this.getFile(info.link)
	    } else {
	      return info
	    }
	  }
	}

	var filesystem = Filesystem;

	// sizeof(T).
	var SIZE_INT32 = 4;
	var SIZE_UINT32 = 4;
	var SIZE_INT64 = 8;
	var SIZE_UINT64 = 8;
	var SIZE_FLOAT = 4;
	var SIZE_DOUBLE = 8;

	// The allocation granularity of the payload.
	var PAYLOAD_UNIT = 64;

	// Largest JS number.
	var CAPACITY_READ_ONLY = 9007199254740992;

	// Aligns 'i' by rounding it up to the next multiple of 'alignment'.
	var alignInt = function (i, alignment) {
	  return i + (alignment - (i % alignment)) % alignment
	};

	// PickleIterator reads data from a Pickle. The Pickle object must remain valid
	// while the PickleIterator object is in use.
	var PickleIterator = (function () {
	  function PickleIterator (pickle) {
	    this.payload = pickle.header;
	    this.payloadOffset = pickle.headerSize;
	    this.readIndex = 0;
	    this.endIndex = pickle.getPayloadSize();
	  }

	  PickleIterator.prototype.readBool = function () {
	    return this.readInt() !== 0
	  };

	  PickleIterator.prototype.readInt = function () {
	    return this.readBytes(SIZE_INT32, Buffer.prototype.readInt32LE)
	  };

	  PickleIterator.prototype.readUInt32 = function () {
	    return this.readBytes(SIZE_UINT32, Buffer.prototype.readUInt32LE)
	  };

	  PickleIterator.prototype.readInt64 = function () {
	    return this.readBytes(SIZE_INT64, Buffer.prototype.readInt64LE)
	  };

	  PickleIterator.prototype.readUInt64 = function () {
	    return this.readBytes(SIZE_UINT64, Buffer.prototype.readUInt64LE)
	  };

	  PickleIterator.prototype.readFloat = function () {
	    return this.readBytes(SIZE_FLOAT, Buffer.prototype.readFloatLE)
	  };

	  PickleIterator.prototype.readDouble = function () {
	    return this.readBytes(SIZE_DOUBLE, Buffer.prototype.readDoubleLE)
	  };

	  PickleIterator.prototype.readString = function () {
	    return this.readBytes(this.readInt()).toString()
	  };

	  PickleIterator.prototype.readBytes = function (length, method) {
	    var readPayloadOffset = this.getReadPayloadOffsetAndAdvance(length);
	    if (method != null) {
	      return method.call(this.payload, readPayloadOffset, length)
	    } else {
	      return this.payload.slice(readPayloadOffset, readPayloadOffset + length)
	    }
	  };

	  PickleIterator.prototype.getReadPayloadOffsetAndAdvance = function (length) {
	    if (length > this.endIndex - this.readIndex) {
	      this.readIndex = this.endIndex;
	      throw new Error('Failed to read data with length of ' + length)
	    }
	    var readPayloadOffset = this.payloadOffset + this.readIndex;
	    this.advance(length);
	    return readPayloadOffset
	  };

	  PickleIterator.prototype.advance = function (size) {
	    var alignedSize = alignInt(size, SIZE_UINT32);
	    if (this.endIndex - this.readIndex < alignedSize) {
	      this.readIndex = this.endIndex;
	    } else {
	      this.readIndex += alignedSize;
	    }
	  };

	  return PickleIterator
	})();

	// This class provides facilities for basic binary value packing and unpacking.
	//
	// The Pickle class supports appending primitive values (ints, strings, etc.)
	// to a pickle instance.  The Pickle instance grows its internal memory buffer
	// dynamically to hold the sequence of primitive values.   The internal memory
	// buffer is exposed as the "data" of the Pickle.  This "data" can be passed
	// to a Pickle object to initialize it for reading.
	//
	// When reading from a Pickle object, it is important for the consumer to know
	// what value types to read and in what order to read them as the Pickle does
	// not keep track of the type of data written to it.
	//
	// The Pickle's data has a header which contains the size of the Pickle's
	// payload.  It can optionally support additional space in the header.  That
	// space is controlled by the header_size parameter passed to the Pickle
	// constructor.
	var Pickle = (function () {
	  function Pickle (buffer) {
	    if (buffer) {
	      this.initFromBuffer(buffer);
	    } else {
	      this.initEmpty();
	    }
	  }

	  Pickle.prototype.initEmpty = function () {
	    this.header = new Buffer(0);
	    this.headerSize = SIZE_UINT32;
	    this.capacityAfterHeader = 0;
	    this.writeOffset = 0;
	    this.resize(PAYLOAD_UNIT);
	    this.setPayloadSize(0);
	  };

	  Pickle.prototype.initFromBuffer = function (buffer) {
	    this.header = buffer;
	    this.headerSize = buffer.length - this.getPayloadSize();
	    this.capacityAfterHeader = CAPACITY_READ_ONLY;
	    this.writeOffset = 0;
	    if (this.headerSize > buffer.length) {
	      this.headerSize = 0;
	    }
	    if (this.headerSize !== alignInt(this.headerSize, SIZE_UINT32)) {
	      this.headerSize = 0;
	    }
	    if (this.headerSize === 0) {
	      this.header = new Buffer(0);
	    }
	  };

	  Pickle.prototype.createIterator = function () {
	    return new PickleIterator(this)
	  };

	  Pickle.prototype.toBuffer = function () {
	    return this.header.slice(0, this.headerSize + this.getPayloadSize())
	  };

	  Pickle.prototype.writeBool = function (value) {
	    return this.writeInt(value ? 1 : 0)
	  };

	  Pickle.prototype.writeInt = function (value) {
	    return this.writeBytes(value, SIZE_INT32, Buffer.prototype.writeInt32LE)
	  };

	  Pickle.prototype.writeUInt32 = function (value) {
	    return this.writeBytes(value, SIZE_UINT32, Buffer.prototype.writeUInt32LE)
	  };

	  Pickle.prototype.writeInt64 = function (value) {
	    return this.writeBytes(value, SIZE_INT64, Buffer.prototype.writeInt64LE)
	  };

	  Pickle.prototype.writeUInt64 = function (value) {
	    return this.writeBytes(value, SIZE_UINT64, Buffer.prototype.writeUInt64LE)
	  };

	  Pickle.prototype.writeFloat = function (value) {
	    return this.writeBytes(value, SIZE_FLOAT, Buffer.prototype.writeFloatLE)
	  };

	  Pickle.prototype.writeDouble = function (value) {
	    return this.writeBytes(value, SIZE_DOUBLE, Buffer.prototype.writeDoubleLE)
	  };

	  Pickle.prototype.writeString = function (value) {
	    var length = Buffer.byteLength(value, 'utf8');
	    if (!this.writeInt(length)) {
	      return false
	    }
	    return this.writeBytes(value, length)
	  };

	  Pickle.prototype.setPayloadSize = function (payloadSize) {
	    return this.header.writeUInt32LE(payloadSize, 0)
	  };

	  Pickle.prototype.getPayloadSize = function () {
	    return this.header.readUInt32LE(0)
	  };

	  Pickle.prototype.writeBytes = function (data, length, method) {
	    var dataLength = alignInt(length, SIZE_UINT32);
	    var newSize = this.writeOffset + dataLength;
	    if (newSize > this.capacityAfterHeader) {
	      this.resize(Math.max(this.capacityAfterHeader * 2, newSize));
	    }
	    if (method != null) {
	      method.call(this.header, data, this.headerSize + this.writeOffset);
	    } else {
	      this.header.write(data, this.headerSize + this.writeOffset, length);
	    }
	    var endOffset = this.headerSize + this.writeOffset + length;
	    this.header.fill(0, endOffset, endOffset + dataLength - length);
	    this.setPayloadSize(newSize);
	    this.writeOffset = newSize;
	    return true
	  };

	  Pickle.prototype.resize = function (newCapacity) {
	    newCapacity = alignInt(newCapacity, PAYLOAD_UNIT);
	    this.header = Buffer.concat([this.header, new Buffer(newCapacity)]);
	    this.capacityAfterHeader = newCapacity;
	  };

	  return Pickle
	})();

	var pickle = Pickle;

	var exports$1 = {
	  createEmpty: function () {
	    return new pickle()
	  },

	  createFromBuffer: function (buffer) {
	    return new pickle(buffer)
	  }
	};

	let filesystemCache = {};

	async function copyFile (dest, src, filename) {
	  const srcFile = path$1.join(src, filename);
	  const targetFile = path$1.join(dest, filename);

	  const [content, stats] = await Promise.all([wrappedFs.readFile(srcFile), wrappedFs.stat(srcFile), wrappedFs.mkdirp(path$1.dirname(targetFile))]);
	  return wrappedFs.writeFile(targetFile, content, { mode: stats.mode })
	}

	async function streamTransformedFile (originalFilename, outStream, transformed) {
	  return new Promise((resolve, reject) => {
	    const stream = wrappedFs.createReadStream(transformed ? transformed.path : originalFilename);
	    stream.pipe(outStream, { end: false });
	    stream.on('error', reject);
	    stream.on('end', () => resolve());
	  })
	}

	const writeFileListToStream = async function (dest, filesystem, out, list, metadata) {
	  for (const file of list) {
	    if (file.unpack) { // the file should not be packed into archive
	      const filename = path$1.relative(filesystem.src, file.filename);
	      await copyFile(`${dest}.unpacked`, filesystem.src, filename);
	    } else {
	      await streamTransformedFile(file.filename, out, metadata[file.filename].transformed);
	    }
	  }
	  return out.end()
	};

	var writeFilesystem = async function (dest, filesystem, files, metadata) {
	  const headerPickle = exports$1.createEmpty();
	  headerPickle.writeString(JSON.stringify(filesystem.header));
	  const headerBuf = headerPickle.toBuffer();

	  const sizePickle = exports$1.createEmpty();
	  sizePickle.writeUInt32(headerBuf.length);
	  const sizeBuf = sizePickle.toBuffer();

	  const out = wrappedFs.createWriteStream(dest);
	  await new Promise((resolve, reject) => {
	    out.on('error', reject);
	    out.write(sizeBuf);
	    return out.write(headerBuf, () => resolve())
	  });
	  return writeFileListToStream(dest, filesystem, out, files, metadata)
	};

	var readArchiveHeaderSync = function (archive) {
	  const fd = wrappedFs.openSync(archive, 'r');
	  let size;
	  let headerBuf;
	  try {
	    const sizeBuf = Buffer.alloc(8);
	    if (wrappedFs.readSync(fd, sizeBuf, 0, 8, null) !== 8) {
	      throw new Error('Unable to read header size')
	    }

	    const sizePickle = exports$1.createFromBuffer(sizeBuf);
	    size = sizePickle.createIterator().readUInt32();
	    headerBuf = Buffer.alloc(size);
	    if (wrappedFs.readSync(fd, headerBuf, 0, size, null) !== size) {
	      throw new Error('Unable to read header')
	    }
	  } finally {
	    wrappedFs.closeSync(fd);
	  }

	  const headerPickle = exports$1.createFromBuffer(headerBuf);
	  const header = headerPickle.createIterator().readString();
	  return { header: JSON.parse(header), headerSize: size }
	};

	var readFilesystemSync = function (archive) {
	  if (!filesystemCache[archive]) {
	    const header = this.readArchiveHeaderSync(archive);
	    const filesystem$1 = new filesystem(archive);
	    filesystem$1.header = header.header;
	    filesystem$1.headerSize = header.headerSize;
	    filesystemCache[archive] = filesystem$1;
	  }
	  return filesystemCache[archive]
	};

	var uncacheFilesystem = function (archive) {
	  if (filesystemCache[archive]) {
	    filesystemCache[archive] = undefined;
	    return true
	  }
	  return false
	};

	var uncacheAll = function () {
	  filesystemCache = {};
	};

	var readFileSync = function (filesystem, filename, info) {
	  let buffer = Buffer.alloc(info.size);
	  if (info.size <= 0) { return buffer }
	  if (info.unpacked) {
	    // it's an unpacked file, copy it.
	    buffer = wrappedFs.readFileSync(path$1.join(`${filesystem.src}.unpacked`, filename));
	  } else {
	    // Node throws an exception when reading 0 bytes into a 0-size buffer,
	    // so we short-circuit the read in this case.
	    const fd = wrappedFs.openSync(filesystem.src, 'r');
	    try {
	      const offset = 8 + filesystem.headerSize + parseInt(info.offset);
	      wrappedFs.readSync(fd, buffer, 0, info.size, offset);
	    } finally {
	      wrappedFs.closeSync(fd);
	    }
	  }
	  return buffer
	};

	var disk = {
		writeFilesystem: writeFilesystem,
		readArchiveHeaderSync: readArchiveHeaderSync,
		readFilesystemSync: readFilesystemSync,
		uncacheFilesystem: uncacheFilesystem,
		uncacheAll: uncacheAll,
		readFileSync: readFileSync
	};

	const { promisify: promisify$2 } = util$1;


	const glob$1 = promisify$2(glob_1);

	async function determineFileType (filename) {
	  const stat = await wrappedFs.lstat(filename);
	  if (stat.isFile()) {
	    return { type: 'file', stat }
	  } else if (stat.isDirectory()) {
	    return { type: 'directory', stat }
	  } else if (stat.isSymbolicLink()) {
	    return { type: 'link', stat }
	  }
	}

	var crawlfs = async function (dir, options) {
	  const metadata = {};
	  const crawled = await glob$1(dir, options);
	  const results = await Promise.all(crawled.map(async filename => [filename, await determineFileType(filename)]));
	  const filenames = results.map(([filename, type]) => {
	    if (type) {
	      metadata[filename] = type;
	    }
	    return filename
	  });
	  return [filenames, metadata]
	};
	var determineFileType_1 = determineFileType;
	crawlfs.determineFileType = determineFileType_1;

	var asar = createCommonjsModule(function (module) {









	/**
	 * Whether a directory should be excluded from packing due to the `--unpack-dir" option.
	 *
	 * @param {string} dirPath - directory path to check
	 * @param {string} pattern - literal prefix [for backward compatibility] or glob pattern
	 * @param {array} unpackDirs - Array of directory paths previously marked as unpacked
	 */
	function isUnpackedDir (dirPath, pattern, unpackDirs) {
	  if (dirPath.startsWith(pattern) || minimatch_1(dirPath, pattern)) {
	    if (!unpackDirs.includes(dirPath)) {
	      unpackDirs.push(dirPath);
	    }
	    return true
	  } else {
	    return unpackDirs.some(unpackDir => dirPath.startsWith(unpackDir))
	  }
	}

	module.exports.createPackage = async function (src, dest) {
	  return module.exports.createPackageWithOptions(src, dest, {})
	};

	module.exports.createPackageWithOptions = async function (src, dest, options) {
	  const globOptions = options.globOptions ? options.globOptions : {};
	  globOptions.dot = options.dot === undefined ? true : options.dot;

	  const pattern = src + (options.pattern ? options.pattern : '/**/*');

	  const [filenames, metadata] = await crawlfs(pattern, globOptions);
	  return module.exports.createPackageFromFiles(src, dest, filenames, metadata, options)
	};

	/**
	 * Create an ASAR archive from a list of filenames.
	 *
	 * @param {string} src: Base path. All files are relative to this.
	 * @param {string} dest: Archive filename (& path).
	 * @param {array} filenames: List of filenames relative to src.
	 * @param {object} metadata: Object with filenames as keys and {type='directory|file|link', stat: fs.stat} as values. (Optional)
	 * @param {object} options: Options passed to `createPackageWithOptions`.
	*/
	module.exports.createPackageFromFiles = async function (src, dest, filenames, metadata, options) {
	  if (typeof metadata === 'undefined' || metadata === null) { metadata = {}; }
	  if (typeof options === 'undefined' || options === null) { options = {}; }

	  src = path$1.normalize(src);
	  dest = path$1.normalize(dest);
	  filenames = filenames.map(function (filename) { return path$1.normalize(filename) });

	  const filesystem$1 = new filesystem(src);
	  const files = [];
	  const unpackDirs = [];

	  let filenamesSorted = [];
	  if (options.ordering) {
	    const orderingFiles = (await wrappedFs.readFile(options.ordering)).toString().split('\n').map(line => {
	      if (line.includes(':')) { line = line.split(':').pop(); }
	      line = line.trim();
	      if (line.startsWith('/')) { line = line.slice(1); }
	      return line
	    });

	    const ordering = [];
	    for (const file of orderingFiles) {
	      const pathComponents = file.split(path$1.sep);
	      let str = src;
	      for (const pathComponent of pathComponents) {
	        str = path$1.join(str, pathComponent);
	        ordering.push(str);
	      }
	    }

	    let missing = 0;
	    const total = filenames.length;

	    for (const file of ordering) {
	      if (!filenamesSorted.includes(file) && filenames.includes(file)) {
	        filenamesSorted.push(file);
	      }
	    }

	    for (const file of filenames) {
	      if (!filenamesSorted.includes(file)) {
	        filenamesSorted.push(file);
	        missing += 1;
	      }
	    }

	    console.log(`Ordering file has ${((total - missing) / total) * 100}% coverage.`);
	  } else {
	    filenamesSorted = filenames;
	  }

	  const handleFile = async function (filename) {
	    if (!metadata[filename]) {
	      metadata[filename] = await crawlfs.determineFileType(filename);
	    }
	    const file = metadata[filename];

	    let shouldUnpack;
	    switch (file.type) {
	      case 'directory':
	        if (options.unpackDir) {
	          shouldUnpack = isUnpackedDir(path$1.relative(src, filename), options.unpackDir, unpackDirs);
	        } else {
	          shouldUnpack = false;
	        }
	        filesystem$1.insertDirectory(filename, shouldUnpack);
	        break
	      case 'file':
	        shouldUnpack = false;
	        if (options.unpack) {
	          shouldUnpack = minimatch_1(filename, options.unpack, { matchBase: true });
	        }
	        if (!shouldUnpack && options.unpackDir) {
	          const dirName = path$1.relative(src, path$1.dirname(filename));
	          shouldUnpack = isUnpackedDir(dirName, options.unpackDir, unpackDirs);
	        }
	        files.push({ filename: filename, unpack: shouldUnpack });
	        return filesystem$1.insertFile(filename, shouldUnpack, file, options)
	      case 'link':
	        filesystem$1.insertLink(filename, file.stat);
	        break
	    }
	    return Promise.resolve()
	  };

	  const insertsDone = async function () {
	    await wrappedFs.mkdirp(path$1.dirname(dest));
	    return disk.writeFilesystem(dest, filesystem$1, files, metadata)
	  };

	  const names = filenamesSorted.slice();

	  const next = async function (name) {
	    if (!name) { return insertsDone() }

	    await handleFile(name);
	    return next(names.shift())
	  };

	  return next(names.shift())
	};

	module.exports.statFile = function (archive, filename, followLinks) {
	  const filesystem = disk.readFilesystemSync(archive);
	  return filesystem.getFile(filename, followLinks)
	};

	module.exports.listPackage = function (archive, options) {
	  return disk.readFilesystemSync(archive).listFiles(options)
	};

	module.exports.extractFile = function (archive, filename) {
	  const filesystem = disk.readFilesystemSync(archive);
	  return disk.readFileSync(filesystem, filename, filesystem.getFile(filename))
	};

	module.exports.extractAll = function (archive, dest) {
	  const filesystem = disk.readFilesystemSync(archive);
	  const filenames = filesystem.listFiles();

	  // under windows just extract links as regular files
	  const followLinks = process.platform === 'win32';

	  // create destination directory
	  wrappedFs.mkdirpSync(dest);

	  return filenames.map((filename) => {
	    filename = filename.substr(1); // get rid of leading slash
	    const destFilename = path$1.join(dest, filename);
	    const file = filesystem.getFile(filename, followLinks);
	    if (file.files) {
	      // it's a directory, create it and continue with the next entry
	      wrappedFs.mkdirpSync(destFilename);
	    } else if (file.link) {
	      // it's a symlink, create a symlink
	      const linkSrcPath = path$1.dirname(path$1.join(dest, file.link));
	      const linkDestPath = path$1.dirname(destFilename);
	      const relativePath = path$1.relative(linkDestPath, linkSrcPath);
	      // try to delete output file, because we can't overwrite a link
	      (() => {
	        try {
	          wrappedFs.unlinkSync(destFilename);
	        } catch (error) {}
	      })();
	      const linkTo = path$1.join(relativePath, path$1.basename(file.link));
	      wrappedFs.symlinkSync(linkTo, destFilename);
	    } else {
	      // it's a file, extract it
	      const content = disk.readFileSync(filesystem, filename, file);
	      wrappedFs.writeFileSync(destFilename, content);
	    }
	  })
	};

	module.exports.uncache = function (archive) {
	  return disk.uncacheFilesystem(archive)
	};

	module.exports.uncacheAll = function () {
	  disk.uncacheAll();
	};
	});
	var asar_1 = asar.createPackage;
	var asar_2 = asar.createPackageWithOptions;
	var asar_3 = asar.createPackageFromFiles;
	var asar_4 = asar.statFile;
	var asar_5 = asar.listPackage;
	var asar_6 = asar.extractFile;
	var asar_7 = asar.extractAll;
	var asar_8 = asar.uncache;
	var asar_9 = asar.uncacheAll;

	var commander = createCommonjsModule(function (module, exports) {
	/**
	 * Module dependencies.
	 */

	var EventEmitter = events.EventEmitter;
	var spawn = child_process.spawn;

	var dirname = path$1.dirname;
	var basename = path$1.basename;


	/**
	 * Inherit `Command` from `EventEmitter.prototype`.
	 */

	util$1.inherits(Command, EventEmitter);

	/**
	 * Expose the root command.
	 */

	exports = module.exports = new Command();

	/**
	 * Expose `Command`.
	 */

	exports.Command = Command;

	/**
	 * Expose `Option`.
	 */

	exports.Option = Option;

	/**
	 * Initialize a new `Option` with the given `flags` and `description`.
	 *
	 * @param {String} flags
	 * @param {String} description
	 * @api public
	 */

	function Option(flags, description) {
	  this.flags = flags;
	  this.required = flags.indexOf('<') >= 0;
	  this.optional = flags.indexOf('[') >= 0;
	  this.bool = flags.indexOf('-no-') === -1;
	  flags = flags.split(/[ ,|]+/);
	  if (flags.length > 1 && !/^[[<]/.test(flags[1])) this.short = flags.shift();
	  this.long = flags.shift();
	  this.description = description || '';
	}

	/**
	 * Return option name.
	 *
	 * @return {String}
	 * @api private
	 */

	Option.prototype.name = function() {
	  return this.long
	    .replace('--', '')
	    .replace('no-', '');
	};

	/**
	 * Return option name, in a camelcase format that can be used
	 * as a object attribute key.
	 *
	 * @return {String}
	 * @api private
	 */

	Option.prototype.attributeName = function() {
	  return camelcase(this.name());
	};

	/**
	 * Check if `arg` matches the short or long flag.
	 *
	 * @param {String} arg
	 * @return {Boolean}
	 * @api private
	 */

	Option.prototype.is = function(arg) {
	  return this.short === arg || this.long === arg;
	};

	/**
	 * Initialize a new `Command`.
	 *
	 * @param {String} name
	 * @api public
	 */

	function Command(name) {
	  this.commands = [];
	  this.options = [];
	  this._execs = {};
	  this._allowUnknownOption = false;
	  this._args = [];
	  this._name = name || '';
	}

	/**
	 * Add command `name`.
	 *
	 * The `.action()` callback is invoked when the
	 * command `name` is specified via __ARGV__,
	 * and the remaining arguments are applied to the
	 * function for access.
	 *
	 * When the `name` is "*" an un-matched command
	 * will be passed as the first arg, followed by
	 * the rest of __ARGV__ remaining.
	 *
	 * Examples:
	 *
	 *      program
	 *        .version('0.0.1')
	 *        .option('-C, --chdir <path>', 'change the working directory')
	 *        .option('-c, --config <path>', 'set config path. defaults to ./deploy.conf')
	 *        .option('-T, --no-tests', 'ignore test hook')
	 *
	 *      program
	 *        .command('setup')
	 *        .description('run remote setup commands')
	 *        .action(function() {
	 *          console.log('setup');
	 *        });
	 *
	 *      program
	 *        .command('exec <cmd>')
	 *        .description('run the given remote command')
	 *        .action(function(cmd) {
	 *          console.log('exec "%s"', cmd);
	 *        });
	 *
	 *      program
	 *        .command('teardown <dir> [otherDirs...]')
	 *        .description('run teardown commands')
	 *        .action(function(dir, otherDirs) {
	 *          console.log('dir "%s"', dir);
	 *          if (otherDirs) {
	 *            otherDirs.forEach(function (oDir) {
	 *              console.log('dir "%s"', oDir);
	 *            });
	 *          }
	 *        });
	 *
	 *      program
	 *        .command('*')
	 *        .description('deploy the given env')
	 *        .action(function(env) {
	 *          console.log('deploying "%s"', env);
	 *        });
	 *
	 *      program.parse(process.argv);
	  *
	 * @param {String} name
	 * @param {String} [desc] for git-style sub-commands
	 * @return {Command} the new command
	 * @api public
	 */

	Command.prototype.command = function(name, desc, opts) {
	  if (typeof desc === 'object' && desc !== null) {
	    opts = desc;
	    desc = null;
	  }
	  opts = opts || {};
	  var args = name.split(/ +/);
	  var cmd = new Command(args.shift());

	  if (desc) {
	    cmd.description(desc);
	    this.executables = true;
	    this._execs[cmd._name] = true;
	    if (opts.isDefault) this.defaultExecutable = cmd._name;
	  }
	  cmd._noHelp = !!opts.noHelp;
	  this.commands.push(cmd);
	  cmd.parseExpectedArgs(args);
	  cmd.parent = this;

	  if (desc) return this;
	  return cmd;
	};

	/**
	 * Define argument syntax for the top-level command.
	 *
	 * @api public
	 */

	Command.prototype.arguments = function(desc) {
	  return this.parseExpectedArgs(desc.split(/ +/));
	};

	/**
	 * Add an implicit `help [cmd]` subcommand
	 * which invokes `--help` for the given command.
	 *
	 * @api private
	 */

	Command.prototype.addImplicitHelpCommand = function() {
	  this.command('help [cmd]', 'display help for [cmd]');
	};

	/**
	 * Parse expected `args`.
	 *
	 * For example `["[type]"]` becomes `[{ required: false, name: 'type' }]`.
	 *
	 * @param {Array} args
	 * @return {Command} for chaining
	 * @api public
	 */

	Command.prototype.parseExpectedArgs = function(args) {
	  if (!args.length) return;
	  var self = this;
	  args.forEach(function(arg) {
	    var argDetails = {
	      required: false,
	      name: '',
	      variadic: false
	    };

	    switch (arg[0]) {
	      case '<':
	        argDetails.required = true;
	        argDetails.name = arg.slice(1, -1);
	        break;
	      case '[':
	        argDetails.name = arg.slice(1, -1);
	        break;
	    }

	    if (argDetails.name.length > 3 && argDetails.name.slice(-3) === '...') {
	      argDetails.variadic = true;
	      argDetails.name = argDetails.name.slice(0, -3);
	    }
	    if (argDetails.name) {
	      self._args.push(argDetails);
	    }
	  });
	  return this;
	};

	/**
	 * Register callback `fn` for the command.
	 *
	 * Examples:
	 *
	 *      program
	 *        .command('help')
	 *        .description('display verbose help')
	 *        .action(function() {
	 *           // output help here
	 *        });
	 *
	 * @param {Function} fn
	 * @return {Command} for chaining
	 * @api public
	 */

	Command.prototype.action = function(fn) {
	  var self = this;
	  var listener = function(args, unknown) {
	    // Parse any so-far unknown options
	    args = args || [];
	    unknown = unknown || [];

	    var parsed = self.parseOptions(unknown);

	    // Output help if necessary
	    outputHelpIfNecessary(self, parsed.unknown);

	    // If there are still any unknown options, then we simply
	    // die, unless someone asked for help, in which case we give it
	    // to them, and then we die.
	    if (parsed.unknown.length > 0) {
	      self.unknownOption(parsed.unknown[0]);
	    }

	    // Leftover arguments need to be pushed back. Fixes issue #56
	    if (parsed.args.length) args = parsed.args.concat(args);

	    self._args.forEach(function(arg, i) {
	      if (arg.required && args[i] == null) {
	        self.missingArgument(arg.name);
	      } else if (arg.variadic) {
	        if (i !== self._args.length - 1) {
	          self.variadicArgNotLast(arg.name);
	        }

	        args[i] = args.splice(i);
	      }
	    });

	    // Always append ourselves to the end of the arguments,
	    // to make sure we match the number of arguments the user
	    // expects
	    if (self._args.length) {
	      args[self._args.length] = self;
	    } else {
	      args.push(self);
	    }

	    fn.apply(self, args);
	  };
	  var parent = this.parent || this;
	  var name = parent === this ? '*' : this._name;
	  parent.on('command:' + name, listener);
	  if (this._alias) parent.on('command:' + this._alias, listener);
	  return this;
	};

	/**
	 * Define option with `flags`, `description` and optional
	 * coercion `fn`.
	 *
	 * The `flags` string should contain both the short and long flags,
	 * separated by comma, a pipe or space. The following are all valid
	 * all will output this way when `--help` is used.
	 *
	 *    "-p, --pepper"
	 *    "-p|--pepper"
	 *    "-p --pepper"
	 *
	 * Examples:
	 *
	 *     // simple boolean defaulting to false
	 *     program.option('-p, --pepper', 'add pepper');
	 *
	 *     --pepper
	 *     program.pepper
	 *     // => Boolean
	 *
	 *     // simple boolean defaulting to true
	 *     program.option('-C, --no-cheese', 'remove cheese');
	 *
	 *     program.cheese
	 *     // => true
	 *
	 *     --no-cheese
	 *     program.cheese
	 *     // => false
	 *
	 *     // required argument
	 *     program.option('-C, --chdir <path>', 'change the working directory');
	 *
	 *     --chdir /tmp
	 *     program.chdir
	 *     // => "/tmp"
	 *
	 *     // optional argument
	 *     program.option('-c, --cheese [type]', 'add cheese [marble]');
	 *
	 * @param {String} flags
	 * @param {String} description
	 * @param {Function|*} [fn] or default
	 * @param {*} [defaultValue]
	 * @return {Command} for chaining
	 * @api public
	 */

	Command.prototype.option = function(flags, description, fn, defaultValue) {
	  var self = this,
	    option = new Option(flags, description),
	    oname = option.name(),
	    name = option.attributeName();

	  // default as 3rd arg
	  if (typeof fn !== 'function') {
	    if (fn instanceof RegExp) {
	      var regex = fn;
	      fn = function(val, def) {
	        var m = regex.exec(val);
	        return m ? m[0] : def;
	      };
	    } else {
	      defaultValue = fn;
	      fn = null;
	    }
	  }

	  // preassign default value only for --no-*, [optional], or <required>
	  if (!option.bool || option.optional || option.required) {
	    // when --no-* we make sure default is true
	    if (!option.bool) defaultValue = true;
	    // preassign only if we have a default
	    if (defaultValue !== undefined) {
	      self[name] = defaultValue;
	      option.defaultValue = defaultValue;
	    }
	  }

	  // register the option
	  this.options.push(option);

	  // when it's passed assign the value
	  // and conditionally invoke the callback
	  this.on('option:' + oname, function(val) {
	    // coercion
	    if (val !== null && fn) {
	      val = fn(val, self[name] === undefined ? defaultValue : self[name]);
	    }

	    // unassigned or bool
	    if (typeof self[name] === 'boolean' || typeof self[name] === 'undefined') {
	      // if no value, bool true, and we have a default, then use it!
	      if (val == null) {
	        self[name] = option.bool
	          ? defaultValue || true
	          : false;
	      } else {
	        self[name] = val;
	      }
	    } else if (val !== null) {
	      // reassign
	      self[name] = val;
	    }
	  });

	  return this;
	};

	/**
	 * Allow unknown options on the command line.
	 *
	 * @param {Boolean} arg if `true` or omitted, no error will be thrown
	 * for unknown options.
	 * @api public
	 */
	Command.prototype.allowUnknownOption = function(arg) {
	  this._allowUnknownOption = arguments.length === 0 || arg;
	  return this;
	};

	/**
	 * Parse `argv`, settings options and invoking commands when defined.
	 *
	 * @param {Array} argv
	 * @return {Command} for chaining
	 * @api public
	 */

	Command.prototype.parse = function(argv) {
	  // implicit help
	  if (this.executables) this.addImplicitHelpCommand();

	  // store raw args
	  this.rawArgs = argv;

	  // guess name
	  this._name = this._name || basename(argv[1], '.js');

	  // github-style sub-commands with no sub-command
	  if (this.executables && argv.length < 3 && !this.defaultExecutable) {
	    // this user needs help
	    argv.push('--help');
	  }

	  // process argv
	  var parsed = this.parseOptions(this.normalize(argv.slice(2)));
	  var args = this.args = parsed.args;

	  var result = this.parseArgs(this.args, parsed.unknown);

	  // executable sub-commands
	  var name = result.args[0];

	  var aliasCommand = null;
	  // check alias of sub commands
	  if (name) {
	    aliasCommand = this.commands.filter(function(command) {
	      return command.alias() === name;
	    })[0];
	  }

	  if (this._execs[name] && typeof this._execs[name] !== 'function') {
	    return this.executeSubCommand(argv, args, parsed.unknown);
	  } else if (aliasCommand) {
	    // is alias of a subCommand
	    args[0] = aliasCommand._name;
	    return this.executeSubCommand(argv, args, parsed.unknown);
	  } else if (this.defaultExecutable) {
	    // use the default subcommand
	    args.unshift(this.defaultExecutable);
	    return this.executeSubCommand(argv, args, parsed.unknown);
	  }

	  return result;
	};

	/**
	 * Execute a sub-command executable.
	 *
	 * @param {Array} argv
	 * @param {Array} args
	 * @param {Array} unknown
	 * @api private
	 */

	Command.prototype.executeSubCommand = function(argv, args, unknown) {
	  args = args.concat(unknown);

	  if (!args.length) this.help();
	  if (args[0] === 'help' && args.length === 1) this.help();

	  // <cmd> --help
	  if (args[0] === 'help') {
	    args[0] = args[1];
	    args[1] = '--help';
	  }

	  // executable
	  var f = argv[1];
	  // name of the subcommand, link `pm-install`
	  var bin = basename(f, path$1.extname(f)) + '-' + args[0];

	  // In case of globally installed, get the base dir where executable
	  //  subcommand file should be located at
	  var baseDir;

	  var resolvedLink = fs$1.realpathSync(f);

	  baseDir = dirname(resolvedLink);

	  // prefer local `./<bin>` to bin in the $PATH
	  var localBin = path$1.join(baseDir, bin);

	  // whether bin file is a js script with explicit `.js` or `.ts` extension
	  var isExplicitJS = false;
	  if (exists(localBin + '.js')) {
	    bin = localBin + '.js';
	    isExplicitJS = true;
	  } else if (exists(localBin + '.ts')) {
	    bin = localBin + '.ts';
	    isExplicitJS = true;
	  } else if (exists(localBin)) {
	    bin = localBin;
	  }

	  args = args.slice(1);

	  var proc;
	  if (process.platform !== 'win32') {
	    if (isExplicitJS) {
	      args.unshift(bin);
	      // add executable arguments to spawn
	      args = (process.execArgv || []).concat(args);

	      proc = spawn(process.argv[0], args, { stdio: 'inherit', customFds: [0, 1, 2] });
	    } else {
	      proc = spawn(bin, args, { stdio: 'inherit', customFds: [0, 1, 2] });
	    }
	  } else {
	    args.unshift(bin);
	    proc = spawn(process.execPath, args, { stdio: 'inherit' });
	  }

	  var signals = ['SIGUSR1', 'SIGUSR2', 'SIGTERM', 'SIGINT', 'SIGHUP'];
	  signals.forEach(function(signal) {
	    process.on(signal, function() {
	      if (proc.killed === false && proc.exitCode === null) {
	        proc.kill(signal);
	      }
	    });
	  });
	  proc.on('close', process.exit.bind(process));
	  proc.on('error', function(err) {
	    if (err.code === 'ENOENT') {
	      console.error('error: %s(1) does not exist, try --help', bin);
	    } else if (err.code === 'EACCES') {
	      console.error('error: %s(1) not executable. try chmod or run with root', bin);
	    }
	    process.exit(1);
	  });

	  // Store the reference to the child process
	  this.runningCommand = proc;
	};

	/**
	 * Normalize `args`, splitting joined short flags. For example
	 * the arg "-abc" is equivalent to "-a -b -c".
	 * This also normalizes equal sign and splits "--abc=def" into "--abc def".
	 *
	 * @param {Array} args
	 * @return {Array}
	 * @api private
	 */

	Command.prototype.normalize = function(args) {
	  var ret = [],
	    arg,
	    lastOpt,
	    index;

	  for (var i = 0, len = args.length; i < len; ++i) {
	    arg = args[i];
	    if (i > 0) {
	      lastOpt = this.optionFor(args[i - 1]);
	    }

	    if (arg === '--') {
	      // Honor option terminator
	      ret = ret.concat(args.slice(i));
	      break;
	    } else if (lastOpt && lastOpt.required) {
	      ret.push(arg);
	    } else if (arg.length > 1 && arg[0] === '-' && arg[1] !== '-') {
	      arg.slice(1).split('').forEach(function(c) {
	        ret.push('-' + c);
	      });
	    } else if (/^--/.test(arg) && ~(index = arg.indexOf('='))) {
	      ret.push(arg.slice(0, index), arg.slice(index + 1));
	    } else {
	      ret.push(arg);
	    }
	  }

	  return ret;
	};

	/**
	 * Parse command `args`.
	 *
	 * When listener(s) are available those
	 * callbacks are invoked, otherwise the "*"
	 * event is emitted and those actions are invoked.
	 *
	 * @param {Array} args
	 * @return {Command} for chaining
	 * @api private
	 */

	Command.prototype.parseArgs = function(args, unknown) {
	  var name;

	  if (args.length) {
	    name = args[0];
	    if (this.listeners('command:' + name).length) {
	      this.emit('command:' + args.shift(), args, unknown);
	    } else {
	      this.emit('command:*', args);
	    }
	  } else {
	    outputHelpIfNecessary(this, unknown);

	    // If there were no args and we have unknown options,
	    // then they are extraneous and we need to error.
	    if (unknown.length > 0) {
	      this.unknownOption(unknown[0]);
	    }
	    if (this.commands.length === 0 &&
	        this._args.filter(function(a) { return a.required; }).length === 0) {
	      this.emit('command:*');
	    }
	  }

	  return this;
	};

	/**
	 * Return an option matching `arg` if any.
	 *
	 * @param {String} arg
	 * @return {Option}
	 * @api private
	 */

	Command.prototype.optionFor = function(arg) {
	  for (var i = 0, len = this.options.length; i < len; ++i) {
	    if (this.options[i].is(arg)) {
	      return this.options[i];
	    }
	  }
	};

	/**
	 * Parse options from `argv` returning `argv`
	 * void of these options.
	 *
	 * @param {Array} argv
	 * @return {Array}
	 * @api public
	 */

	Command.prototype.parseOptions = function(argv) {
	  var args = [],
	    len = argv.length,
	    literal,
	    option,
	    arg;

	  var unknownOptions = [];

	  // parse options
	  for (var i = 0; i < len; ++i) {
	    arg = argv[i];

	    // literal args after --
	    if (literal) {
	      args.push(arg);
	      continue;
	    }

	    if (arg === '--') {
	      literal = true;
	      continue;
	    }

	    // find matching Option
	    option = this.optionFor(arg);

	    // option is defined
	    if (option) {
	      // requires arg
	      if (option.required) {
	        arg = argv[++i];
	        if (arg == null) return this.optionMissingArgument(option);
	        this.emit('option:' + option.name(), arg);
	      // optional arg
	      } else if (option.optional) {
	        arg = argv[i + 1];
	        if (arg == null || (arg[0] === '-' && arg !== '-')) {
	          arg = null;
	        } else {
	          ++i;
	        }
	        this.emit('option:' + option.name(), arg);
	      // bool
	      } else {
	        this.emit('option:' + option.name());
	      }
	      continue;
	    }

	    // looks like an option
	    if (arg.length > 1 && arg[0] === '-') {
	      unknownOptions.push(arg);

	      // If the next argument looks like it might be
	      // an argument for this option, we pass it on.
	      // If it isn't, then it'll simply be ignored
	      if ((i + 1) < argv.length && argv[i + 1][0] !== '-') {
	        unknownOptions.push(argv[++i]);
	      }
	      continue;
	    }

	    // arg
	    args.push(arg);
	  }

	  return { args: args, unknown: unknownOptions };
	};

	/**
	 * Return an object containing options as key-value pairs
	 *
	 * @return {Object}
	 * @api public
	 */
	Command.prototype.opts = function() {
	  var result = {},
	    len = this.options.length;

	  for (var i = 0; i < len; i++) {
	    var key = this.options[i].attributeName();
	    result[key] = key === this._versionOptionName ? this._version : this[key];
	  }
	  return result;
	};

	/**
	 * Argument `name` is missing.
	 *
	 * @param {String} name
	 * @api private
	 */

	Command.prototype.missingArgument = function(name) {
	  console.error("error: missing required argument `%s'", name);
	  process.exit(1);
	};

	/**
	 * `Option` is missing an argument, but received `flag` or nothing.
	 *
	 * @param {String} option
	 * @param {String} flag
	 * @api private
	 */

	Command.prototype.optionMissingArgument = function(option, flag) {
	  if (flag) {
	    console.error("error: option `%s' argument missing, got `%s'", option.flags, flag);
	  } else {
	    console.error("error: option `%s' argument missing", option.flags);
	  }
	  process.exit(1);
	};

	/**
	 * Unknown option `flag`.
	 *
	 * @param {String} flag
	 * @api private
	 */

	Command.prototype.unknownOption = function(flag) {
	  if (this._allowUnknownOption) return;
	  console.error("error: unknown option `%s'", flag);
	  process.exit(1);
	};

	/**
	 * Variadic argument with `name` is not the last argument as required.
	 *
	 * @param {String} name
	 * @api private
	 */

	Command.prototype.variadicArgNotLast = function(name) {
	  console.error("error: variadic arguments must be last `%s'", name);
	  process.exit(1);
	};

	/**
	 * Set the program version to `str`.
	 *
	 * This method auto-registers the "-V, --version" flag
	 * which will print the version number when passed.
	 *
	 * @param {String} str
	 * @param {String} [flags]
	 * @return {Command} for chaining
	 * @api public
	 */

	Command.prototype.version = function(str, flags) {
	  if (arguments.length === 0) return this._version;
	  this._version = str;
	  flags = flags || '-V, --version';
	  var versionOption = new Option(flags, 'output the version number');
	  this._versionOptionName = versionOption.long.substr(2) || 'version';
	  this.options.push(versionOption);
	  this.on('option:' + this._versionOptionName, function() {
	    process.stdout.write(str + '\n');
	    process.exit(0);
	  });
	  return this;
	};

	/**
	 * Set the description to `str`.
	 *
	 * @param {String} str
	 * @param {Object} argsDescription
	 * @return {String|Command}
	 * @api public
	 */

	Command.prototype.description = function(str, argsDescription) {
	  if (arguments.length === 0) return this._description;
	  this._description = str;
	  this._argsDescription = argsDescription;
	  return this;
	};

	/**
	 * Set an alias for the command
	 *
	 * @param {String} alias
	 * @return {String|Command}
	 * @api public
	 */

	Command.prototype.alias = function(alias) {
	  var command = this;
	  if (this.commands.length !== 0) {
	    command = this.commands[this.commands.length - 1];
	  }

	  if (arguments.length === 0) return command._alias;

	  if (alias === command._name) throw new Error('Command alias can\'t be the same as its name');

	  command._alias = alias;
	  return this;
	};

	/**
	 * Set / get the command usage `str`.
	 *
	 * @param {String} str
	 * @return {String|Command}
	 * @api public
	 */

	Command.prototype.usage = function(str) {
	  var args = this._args.map(function(arg) {
	    return humanReadableArgName(arg);
	  });

	  var usage = '[options]' +
	    (this.commands.length ? ' [command]' : '') +
	    (this._args.length ? ' ' + args.join(' ') : '');

	  if (arguments.length === 0) return this._usage || usage;
	  this._usage = str;

	  return this;
	};

	/**
	 * Get or set the name of the command
	 *
	 * @param {String} str
	 * @return {String|Command}
	 * @api public
	 */

	Command.prototype.name = function(str) {
	  if (arguments.length === 0) return this._name;
	  this._name = str;
	  return this;
	};

	/**
	 * Return prepared commands.
	 *
	 * @return {Array}
	 * @api private
	 */

	Command.prototype.prepareCommands = function() {
	  return this.commands.filter(function(cmd) {
	    return !cmd._noHelp;
	  }).map(function(cmd) {
	    var args = cmd._args.map(function(arg) {
	      return humanReadableArgName(arg);
	    }).join(' ');

	    return [
	      cmd._name +
	        (cmd._alias ? '|' + cmd._alias : '') +
	        (cmd.options.length ? ' [options]' : '') +
	        (args ? ' ' + args : ''),
	      cmd._description
	    ];
	  });
	};

	/**
	 * Return the largest command length.
	 *
	 * @return {Number}
	 * @api private
	 */

	Command.prototype.largestCommandLength = function() {
	  var commands = this.prepareCommands();
	  return commands.reduce(function(max, command) {
	    return Math.max(max, command[0].length);
	  }, 0);
	};

	/**
	 * Return the largest option length.
	 *
	 * @return {Number}
	 * @api private
	 */

	Command.prototype.largestOptionLength = function() {
	  var options = [].slice.call(this.options);
	  options.push({
	    flags: '-h, --help'
	  });
	  return options.reduce(function(max, option) {
	    return Math.max(max, option.flags.length);
	  }, 0);
	};

	/**
	 * Return the largest arg length.
	 *
	 * @return {Number}
	 * @api private
	 */

	Command.prototype.largestArgLength = function() {
	  return this._args.reduce(function(max, arg) {
	    return Math.max(max, arg.name.length);
	  }, 0);
	};

	/**
	 * Return the pad width.
	 *
	 * @return {Number}
	 * @api private
	 */

	Command.prototype.padWidth = function() {
	  var width = this.largestOptionLength();
	  if (this._argsDescription && this._args.length) {
	    if (this.largestArgLength() > width) {
	      width = this.largestArgLength();
	    }
	  }

	  if (this.commands && this.commands.length) {
	    if (this.largestCommandLength() > width) {
	      width = this.largestCommandLength();
	    }
	  }

	  return width;
	};

	/**
	 * Return help for options.
	 *
	 * @return {String}
	 * @api private
	 */

	Command.prototype.optionHelp = function() {
	  var width = this.padWidth();

	  // Append the help information
	  return this.options.map(function(option) {
	    return pad(option.flags, width) + '  ' + option.description +
	      ((option.bool && option.defaultValue !== undefined) ? ' (default: ' + JSON.stringify(option.defaultValue) + ')' : '');
	  }).concat([pad('-h, --help', width) + '  ' + 'output usage information'])
	    .join('\n');
	};

	/**
	 * Return command help documentation.
	 *
	 * @return {String}
	 * @api private
	 */

	Command.prototype.commandHelp = function() {
	  if (!this.commands.length) return '';

	  var commands = this.prepareCommands();
	  var width = this.padWidth();

	  return [
	    'Commands:',
	    commands.map(function(cmd) {
	      var desc = cmd[1] ? '  ' + cmd[1] : '';
	      return (desc ? pad(cmd[0], width) : cmd[0]) + desc;
	    }).join('\n').replace(/^/gm, '  '),
	    ''
	  ].join('\n');
	};

	/**
	 * Return program help documentation.
	 *
	 * @return {String}
	 * @api private
	 */

	Command.prototype.helpInformation = function() {
	  var desc = [];
	  if (this._description) {
	    desc = [
	      this._description,
	      ''
	    ];

	    var argsDescription = this._argsDescription;
	    if (argsDescription && this._args.length) {
	      var width = this.padWidth();
	      desc.push('Arguments:');
	      desc.push('');
	      this._args.forEach(function(arg) {
	        desc.push('  ' + pad(arg.name, width) + '  ' + argsDescription[arg.name]);
	      });
	      desc.push('');
	    }
	  }

	  var cmdName = this._name;
	  if (this._alias) {
	    cmdName = cmdName + '|' + this._alias;
	  }
	  var usage = [
	    'Usage: ' + cmdName + ' ' + this.usage(),
	    ''
	  ];

	  var cmds = [];
	  var commandHelp = this.commandHelp();
	  if (commandHelp) cmds = [commandHelp];

	  var options = [
	    'Options:',
	    '' + this.optionHelp().replace(/^/gm, '  '),
	    ''
	  ];

	  return usage
	    .concat(desc)
	    .concat(options)
	    .concat(cmds)
	    .join('\n');
	};

	/**
	 * Output help information for this command
	 *
	 * @api public
	 */

	Command.prototype.outputHelp = function(cb) {
	  if (!cb) {
	    cb = function(passthru) {
	      return passthru;
	    };
	  }
	  process.stdout.write(cb(this.helpInformation()));
	  this.emit('--help');
	};

	/**
	 * Output help information and exit.
	 *
	 * @api public
	 */

	Command.prototype.help = function(cb) {
	  this.outputHelp(cb);
	  process.exit();
	};

	/**
	 * Camel-case the given `flag`
	 *
	 * @param {String} flag
	 * @return {String}
	 * @api private
	 */

	function camelcase(flag) {
	  return flag.split('-').reduce(function(str, word) {
	    return str + word[0].toUpperCase() + word.slice(1);
	  });
	}

	/**
	 * Pad `str` to `width`.
	 *
	 * @param {String} str
	 * @param {Number} width
	 * @return {String}
	 * @api private
	 */

	function pad(str, width) {
	  var len = Math.max(0, width - str.length);
	  return str + Array(len + 1).join(' ');
	}

	/**
	 * Output help information if necessary
	 *
	 * @param {Command} command to output help for
	 * @param {Array} array of options to search for -h or --help
	 * @api private
	 */

	function outputHelpIfNecessary(cmd, options) {
	  options = options || [];
	  for (var i = 0; i < options.length; i++) {
	    if (options[i] === '--help' || options[i] === '-h') {
	      cmd.outputHelp();
	      process.exit(0);
	    }
	  }
	}

	/**
	 * Takes an argument an returns its human readable equivalent for help usage.
	 *
	 * @param {Object} arg
	 * @return {String}
	 * @api private
	 */

	function humanReadableArgName(arg) {
	  var nameOutput = arg.name + (arg.variadic === true ? '...' : '');

	  return arg.required
	    ? '<' + nameOutput + '>'
	    : '[' + nameOutput + ']';
	}

	// for versions before node v0.8 when there weren't `fs.existsSync`
	function exists(file) {
	  try {
	    if (fs$1.statSync(file).isFile()) {
	      return true;
	    }
	  } catch (e) {
	    return false;
	  }
	}
	});
	var commander_1 = commander.Command;
	var commander_2 = commander.Option;

	var _from = "asar";
	var _id = "asar@2.0.1";
	var _inBundle = false;
	var _integrity = "sha512-Vo9yTuUtyFahkVMFaI6uMuX6N7k5DWa6a/8+7ov0/f8Lq9TVR0tUjzSzxQSxT1Y+RJIZgnP7BVb6Uhi+9cjxqA==";
	var _location = "/asar";
	var _phantomChildren = {
	};
	var _requested = {
		type: "tag",
		registry: true,
		raw: "asar",
		name: "asar",
		escapedName: "asar",
		rawSpec: "",
		saveSpec: null,
		fetchSpec: "latest"
	};
	var _requiredBy = [
		"#DEV:/",
		"#USER"
	];
	var _resolved = "https://registry.npmjs.org/asar/-/asar-2.0.1.tgz";
	var _shasum = "8518a1c62c238109c15a5f742213e83a09b9fd38";
	var _spec = "asar";
	var _where = "/Users/seniortechnicalconsultant/Dev/websites/asar-binaries";
	var bin = {
		asar: "./bin/asar.js"
	};
	var bugs = {
		url: "https://github.com/electron/asar/issues"
	};
	var bundleDependencies = false;
	var dependencies = {
		"chromium-pickle-js": "^0.2.0",
		commander: "^2.20.0",
		cuint: "^0.2.2",
		glob: "^7.1.3",
		minimatch: "^3.0.4",
		mkdirp: "^0.5.1",
		"tmp-promise": "^1.0.5"
	};
	var deprecated = false;
	var description = "Creating Electron app packages";
	var devDependencies = {
		"@continuous-auth/semantic-release-npm": "^1.0.3",
		"@semantic-release/changelog": "^3.0.2",
		electron: "^5.0.0",
		"electron-mocha": "^8.0.1",
		lodash: "^4.17.11",
		mocha: "^6.1.4",
		rimraf: "^2.6.3",
		"semantic-release": "^15.13.3",
		standard: "^12.0.1",
		"xvfb-maybe": "^0.2.1"
	};
	var engines = {
		node: ">=8.0"
	};
	var homepage = "https://github.com/electron/asar";
	var license = "MIT";
	var main = "./lib/asar.js";
	var name = "asar";
	var repository = {
		type: "git",
		url: "git+https://github.com/electron/asar.git"
	};
	var scripts = {
		lint: "standard",
		test: "xvfb-maybe electron-mocha --reporter spec && mocha --reporter spec && npm run lint"
	};
	var standard = {
		env: {
			mocha: true
		}
	};
	var version$1 = "2.0.1";
	var _package = {
		_from: _from,
		_id: _id,
		_inBundle: _inBundle,
		_integrity: _integrity,
		_location: _location,
		_phantomChildren: _phantomChildren,
		_requested: _requested,
		_requiredBy: _requiredBy,
		_resolved: _resolved,
		_shasum: _shasum,
		_spec: _spec,
		_where: _where,
		bin: bin,
		bugs: bugs,
		bundleDependencies: bundleDependencies,
		dependencies: dependencies,
		deprecated: deprecated,
		description: description,
		devDependencies: devDependencies,
		engines: engines,
		homepage: homepage,
		license: license,
		main: main,
		name: name,
		repository: repository,
		scripts: scripts,
		standard: standard,
		version: version$1
	};

	var _package$1 = /*#__PURE__*/Object.freeze({
		_from: _from,
		_id: _id,
		_inBundle: _inBundle,
		_integrity: _integrity,
		_location: _location,
		_phantomChildren: _phantomChildren,
		_requested: _requested,
		_requiredBy: _requiredBy,
		_resolved: _resolved,
		_shasum: _shasum,
		_spec: _spec,
		_where: _where,
		bin: bin,
		bugs: bugs,
		bundleDependencies: bundleDependencies,
		dependencies: dependencies,
		deprecated: deprecated,
		description: description,
		devDependencies: devDependencies,
		engines: engines,
		homepage: homepage,
		license: license,
		main: main,
		name: name,
		repository: repository,
		scripts: scripts,
		standard: standard,
		version: version$1,
		'default': _package
	});

	var require$$0 = getCjsExportFromNamespace(_package$1);

	commander.version('v' + require$$0.version)
	  .description('Manipulate asar archive files');

	commander.command('pack <dir> <output>')
	  .alias('p')
	  .description('create asar archive')
	  .option('--ordering <file path>', 'path to a text file for ordering contents')
	  .option('--unpack <expression>', 'do not pack files matching glob <expression>')
	  .option('--unpack-dir <expression>', 'do not pack dirs matching glob <expression> or starting with literal <expression>')
	  .option('--exclude-hidden', 'exclude hidden files')
	  .action(function (dir, output, options) {
	    options = {
	      unpack: options.unpack,
	      unpackDir: options.unpackDir,
	      ordering: options.ordering,
	      version: options.sv,
	      arch: options.sa,
	      builddir: options.sb,
	      dot: !options.excludeHidden
	    };
	    asar.createPackageWithOptions(dir, output, options, function (error) {
	      if (error) {
	        console.error(error.stack);
	        process.exit(1);
	      }
	    });
	  });

	commander.command('list <archive>')
	  .alias('l')
	  .description('list files of asar archive')
	  .option('-i, --is-pack', 'each file in the asar is pack or unpack')
	  .action(function (archive, options) {
	    options = {
	      isPack: options.isPack
	    };
	    var files = asar.listPackage(archive, options);
	    for (var i in files) {
	      console.log(files[i]);
	    }
	    // This is in order to disappear help
	    process.exit(0);
	  });

	commander.command('extract-file <archive> <filename>')
	  .alias('ef')
	  .description('extract one file from archive')
	  .action(function (archive, filename) {
	    fs$1.writeFileSync(path$1.basename(filename),
	      asar.extractFile(archive, filename));
	  });

	commander.command('extract <archive> <dest>')
	  .alias('e')
	  .description('extract archive')
	  .action(function (archive, dest) {
	    asar.extractAll(archive, dest);
	  });

	commander.command('*')
	  .action(function (cmd) {
	    console.log('asar: \'%s\' is not an asar command. See \'asar --help\'.', cmd);
	  });

	commander.parse(process.argv);

	if (commander.args.length === 0) {
	  commander.help();
	}

	var asar_1$1 = {

	};

	return asar_1$1;

}));
