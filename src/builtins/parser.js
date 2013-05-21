// Generated by CoffeeScript 1.6.2
(function() {
  var ExpressionError, Trail, TypeError, Var, any, checkFunction, dao, dqstring, greedyany, greedysome, lazyany, lazysome, name, numberTimes1Fun, numberTimes2Fun, parallelFun, solve, some, special, sqstring, times, times1Fun, times2Fun, _, _ref,
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ = require('underscore');

  dao = require("../../src/solve");

  _ref = (function() {
    var _i, _len, _ref, _results;

    _ref = "Trail, solve, Var,  ExpressionError, TypeError, special".split(", ");
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      name = _ref[_i];
      _results.push(dao[name]);
    }
    return _results;
  })(), Trail = _ref[0], solve = _ref[1], Var = _ref[2], ExpressionError = _ref[3], TypeError = _ref[4], special = _ref[5];

  exports.parse = special('parse', function(solver, cont, exp, state) {
    return function(v, solver) {
      var old_state;

      old_state = solver.state;
      solver.state = state;
      return solver.cont(exp, function(v, solver) {
        solver.state = old_state;
        return [cont, v, solver];
      })(v, solver);
    };
  });

  exports.parse = special('parse', function(solver, cont, exp, state) {
    var old_state;

    old_state = solver.state;
    solver.state = state;
    return solver.cont(exp, function(v, solver) {
      solver.state = old_state;
      return [cont, v, solver];
    });
  });

  exports.parsetext = exports.parsesequence = function(exp, sequence) {
    return exports.parse(exp, [sequence, 0]);
  };

  exports.setstate = special('setstate', function(solver, cont, state) {
    return function(v, solver) {
      solver.state = state;
      return cont(v, solver);
    };
  });

  exports.settext = exports.setsequence = function(sequence) {
    return exports.setstate([sequence, 0]);
  };

  exports.getstate = special('getstate', function(solver, cont) {
    return function(v, solver) {
      return cont(solver.state, solver);
    };
  });

  exports.gettext = exports.getsequence = special('gettext', function(solver, cont) {
    return function(v, solver) {
      return cont(solver.state[0], solver);
    };
  });

  exports.getpos = special('getpos', function(solver, cont) {
    return function(v, solver) {
      return cont(solver.state[1], solver);
    };
  });

  exports.eoi = special('eoi', function(solver, cont) {
    return function(v, solver) {
      var data, pos, _ref1;

      _ref1 = solver.state, data = _ref1[0], pos = _ref1[1];
      if (pos >= data.length) {
        return cont(true, solver);
      } else {
        return solver.failcont(v, solver);
      }
    };
  })();

  exports.boi = special('boi', function(solver, cont) {
    return function(v, solver) {
      if (solver.state[1] === 0) {
        return cont(true, solver);
      } else {
        return solver.failcont(v, solver);
      }
    };
  })();

  exports.step = special('step', function(solver, cont, n) {
    if (n == null) {
      n = 1;
    }
    return function(v, solver) {
      var pos, text, _ref1;

      _ref1 = solver.state, text = _ref1[0], pos = _ref1[1];
      solver.state = [text, pos + n];
      return cont(pos + n, solver);
    };
  });

  exports.lefttext = special('lefttext', function(solver, cont) {
    return function(v, solver) {
      var pos, text, _ref1;

      _ref1 = solver.state, text = _ref1[0], pos = _ref1[1];
      return cont(text.slice(pos), solver);
    };
  });

  exports.subtext = exports.subsequence = special('subtext', function(solver, cont, length, start) {
    return function(v, solver) {
      var pos, text, _ref1;

      _ref1 = solver.state, text = _ref1[0], pos = _ref1[1];
      start = (start != null) || pos;
      length = (length != null) || text.length;
      return cont(text.slice(start, start + length), solver);
    };
  });

  exports.nextchar = special('nextchar', function(solver, cont) {
    return function(v, solver) {
      var pos, text, _ref1;

      _ref1 = solver.state, text = _ref1[0], pos = _ref1[1];
      return cont(text[pos], solver);
    };
  });

  exports.follow = special('follow', function(solver, cont, item) {
    var itemCont, state;

    state = null;
    itemCont = solver.cont(item, function(v, solver) {
      solver.state = state;
      return cont(v, solver);
    });
    return function(v, solver) {
      state = solver.state;
      return itemCont(v, solver);
    };
  });

  exports.notfollow = special('notfollow', function(solver, cont, item) {
    var fc, itemCont, state;

    fc = state = null;
    itemCont = solver.cont(item, function(v, solver) {
      solver.state = state;
      return fc(v, solver);
    });
    return function(v, solver) {
      fc = solver.failcont;
      solver.failcont = cont;
      state = solver.state;
      return itemCont(v, solver);
    };
  });

  parallelFun = function(solver, cont, state, args) {
    var leftCont, length;

    length = args.length;
    if (length === 0) {
      return cont;
    } else if (length === 1) {
      return solver.cont(args[0], cont);
    } else {
      leftCont = parallelFun(solver, cont, state, args.slice(1));
      return solver.cont(args[0], function(v, solver) {
        solver.state = state;
        return leftCont(v, solver);
      });
    }
  };

  exports.checkParallel = checkFunction = function(state, baseState) {
    return state[1] === baseState[1];
  };

  exports.parallel = special('parallel', function() {
    var adjustCont, args, cont, length, right, solver, x, xcont, y, ycont;

    solver = arguments[0], cont = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
    length = args.length;
    if (length === 0) {
      throw new ArgumentError(args);
    } else if (length === 1) {
      return solver.cont(args[0], cont);
    } else {
      right = null;
      if (length === 2) {
        x = args[0];
        y = [args[1]];
      } else {
        x = args[0];
        y = args.slice(1);
      }
      adjustCont = function(v, solver) {
        if (checkParallel(solver.state, right)) {
          return cont(v, solver);
        } else {
          return solver.failcont(v, solver);
        }
      };
      ycont = parallelFun(solver, adjustCont, state, y);
      xcont = solver.cont(x, function(v, solver) {
        right = solver.state;
        solver.state = state;
        return ycont(v, solver);
      });
      return xcont;
    }
  });

  exports.may = special('may', function(solver, cont, exp) {
    var exp_cont;

    exp_cont = solver.cont(exp, cont);
    return function(v, solver) {
      solver.appendFailcont(cont);
      return exp_cont(v, solver);
    };
  });

  exports.lazymay = special('lazymay', function(solver, cont, exp) {
    var expCont;

    expCont = solver.cont(exp, cont);
    return function(v, solver) {
      var fc;

      fc = solver.failcont;
      solver.failcont = function(v, solver) {
        solver.failcont = fc;
        return expCont(v, solver);
      };
      return cont(v, solver);
    };
  });

  exports.greedymay = special('greedymay', function(solver, cont, exp) {
    var expCont, fc;

    fc = null;
    expCont = solver.cont(exp, function(v, solver) {
      solver.failcont = fc;
      return cont(v, solver);
    });
    return function(v, solver) {
      fc = solver.failcont;
      solver.failcont = function(v, solver) {
        solver.failcont = fc;
        return cont(v, solver);
      };
      return expCont(v, solver);
    };
  });

  any = function(exp, result, template) {
    if (!reslult) {
      return any1(exp);
    } else {
      return any2(exp, result, template);
    }
  };

  exports.any1 = special('any', function(solver, cont, exp) {
    var anyCont, expCont;

    anyCont = function(v, solver) {
      var fc, state, trail;

      fc = solver.failcont;
      trail = solver.trail;
      solver.trail = new dao.Trail;
      state = solver.state;
      solver.failcont = function(v, solver) {
        solver.trail.undo();
        solver.trail = trail;
        solver.state = state;
        solver.failcont = fc;
        return cont(v, solver);
      };
      return [expCont, v, solver];
    };
    expCont = solver.cont(exp, anyCont);
    return anyCont;
  });

  exports.any2 = special('any', function(solver, cont, exp, result, template) {
    var anyCont, expCont, result1;

    result1 = null;
    anyCont = function(v, solver) {
      var fc, state, trail;

      fc = solver.failcont;
      trail = solver.trail;
      solver.trail = new dao.Trail;
      state = solver.state;
      solver.failcont = function(v, solver) {
        solver.trail.undo();
        solver.trail = trail;
        solver.state = state;
        solver.failcont = fc;
        result.bind(result1);
        return cont(v, solver);
      };
      return [expCont, v, solver];
    };
    expCont = solver.cont(exp, function(v, solver) {
      result1.push(solver.trail.getvalue(template));
      return anyCont(v, solver);
    });
    return function(v, solver) {
      result1 = [];
      return anyCont(v, solver);
    };
  });

  lazyany = function(exp, result, template) {
    if (!reslult) {
      return lazyany1(exp);
    } else {
      return lazyany2(exp, result, template);
    }
  };

  exports.lazyany1 = special('lazyany', function(solver, cont, exp) {
    var anyCont, anyFcont, expcont, fc;

    fc = null;
    anyCont = function(v, solver) {
      solver.failcont = anyFcont;
      return cont(v, solver);
    };
    expcont = solver.cont(exp, anyCont);
    anyFcont = function(v, solver) {
      solver.failcont = fc;
      return [expcont, v, solver];
    };
    return function(v, solver) {
      fc = solver.failcont;
      return anyCont(v, solver);
    };
  });

  exports.lazyany2 = special('lazyany', function(solver, cont, exp, result, template) {
    var anyCont, anyFcont, expcont, fc, result1;

    result1 = fc = null;
    anyCont = function(v, solver) {
      result1.push(solver.trail.getvalue(template));
      solver.failcont = anyFcont;
      return cont(v, solver);
    };
    expcont = solver.cont(exp, anyCont);
    anyFcont = function(v, solver) {
      solver.failcont = fc;
      result.bind(result1);
      return [expcont, v, solver];
    };
    return function(v, solver) {
      result1 = [];
      fc = solver.failcont;
      return anyCont(v, solver);
    };
  });

  greedyany = function(exp, result, template) {
    if (!reslult) {
      return greedyany1(exp);
    } else {
      return greedyany2(exp, result, template);
    }
  };

  exports.greedyany1 = special('greedyany', function(solver, cont, exp) {
    var anyCont, expCont;

    anyCont = function(v, solver) {
      return [expCont, v, solver];
    };
    expCont = solver.cont(exp, anyCont);
    return function(v, solver) {
      var fc;

      fc = solver.failcont;
      solver.failcont = function(v, solver) {
        solver.failcont = fc;
        return cont(v, solver);
      };
      return anyCont(v, solver);
    };
  });

  exports.greedyany2 = special('greedyany', function(solver, cont, exp, result, template) {
    var anyCont, expCont, result1;

    result1 = null;
    anyCont = function(v, solver) {
      result1.push(solver.trail.getvalue(template));
      return [expCont, v, solver];
    };
    expCont = solver.cont(exp, anyCont);
    return function(v, solver) {
      var fc;

      result1 = [];
      fc = solver.failcont;
      solver.failcont = function(v, solver) {
        solver.failcont = fc;
        result.bind(result1);
        return cont(v, solver);
      };
      return anyCont(v, solver);
    };
  });

  some = function(exp, result, template) {
    if (!result) {
      return some1(exp);
    } else {
      return some2(exp, result, template);
    }
  };

  exports.some1 = special('some', function(solver, cont, exp) {
    var expCont, someCont;

    someCont = function(v, solver) {
      var fc, state, trail;

      fc = solver.failcont;
      trail = solver.trail;
      solver.trail = new dao.Trail;
      state = solver.state;
      solver.failcont = function(v, solver) {
        solver.trail.undo();
        solver.trail = trail;
        solver.state = state;
        solver.failcont = fc;
        return cont(v, solver);
      };
      return [expCont, v, solver];
    };
    expCont = solver.cont(exp, someCont);
    return expCont;
  });

  exports.some2 = special('some', function(solver, cont, exp, result, template) {
    var expCont, result1, someCont;

    result1 = null;
    someCont = function(v, solver) {
      var fc, state, trail;

      fc = solver.failcont;
      trail = solver.trail;
      solver.trail = new dao.Trail;
      state = solver.state;
      solver.failcont = function(v, solver) {
        solver.trail.undo();
        solver.trail = trail;
        solver.state = state;
        solver.failcont = fc;
        result.bind(result1);
        return cont(v, solver);
      };
      return [expCont, v, solver];
    };
    expCont = solver.cont(exp, function(v, solver) {
      result1.push(solver.trail.getvalue(template));
      return someCont(v, solver);
    });
    return function(v, solver) {
      result1 = [];
      return expCont(v, solver);
    };
  });

  lazysome = function(exp, result, template) {
    if (!result) {
      return lazysome1(exp);
    } else {
      return lazysome2(exp, result, template);
    }
  };

  exports.lazysome1 = special('lazysome', function(solver, cont, exp) {
    var expcont, fc, someCont, someFcont;

    fc = null;
    someFcont = function(v, solver) {
      solver.failcont = fc;
      return [expcont, v, solver];
    };
    someCont = function(v, solver) {
      solver.failcont = someFcont;
      return cont(v, solver);
    };
    expcont = solver.cont(exp, someCont);
    return function(v, solver) {
      fc = solver.failcont;
      return expcont(v, solver);
    };
  });

  exports.lazysome2 = special('lazysome', function(solver, cont, exp, result, template) {
    var expcont, fc, result1, someCont, someFcont;

    result1 = fc = null;
    someFcont = function(v, solver) {
      solver.failcont = fc;
      result.bind(result1);
      return [expcont, v, solver];
    };
    someCont = function(v, solver) {
      result1.push(solver.trail.getvalue(template));
      solver.failcont = someFcont;
      return cont(v, solver);
    };
    expcont = solver.cont(exp, someCont);
    return function(v, solver) {
      result1 = [];
      fc = solver.failcont;
      return expcont(v, solver);
    };
  });

  greedysome = function(exp, result, template) {
    if (!result) {
      return greedysome1(exp);
    } else {
      return greedysome2(exp, result, template);
    }
  };

  exports.greedysome1 = special('greedysome', function(solver, cont, exp) {
    var expCont, someCont;

    someCont = function(v, solver) {
      return [expCont, v, solver];
    };
    expCont = solver.cont(exp, someCont);
    return function(v, solver) {
      var fc;

      fc = solver.failcont;
      solver.failcont = function(v, solver) {
        solver.failcont = fc;
        return cont(v, solver);
      };
      return expCont(v, solver);
    };
  });

  exports.greedysome2 = special('greedysome', function(solver, cont, exp, result, template) {
    var expCont, result1, someCont;

    result1 = null;
    someCont = function(v, solver) {
      result1.push(solver.trail.getvalue(template));
      return [expCont, v, solver];
    };
    expCont = solver.cont(exp, someCont);
    return function(v, solver) {
      var fc;

      result1 = [];
      fc = solver.failcont;
      solver.failcont = function(v, solver) {
        solver.failcont = fc;
        result.bind(result1);
        return cont(v, solver);
      };
      return expCont(v, solver);
    };
  });

  times = function(exp, expectTimes, result, template) {
    if (!result) {
      return times1(exp, expectTimes);
    } else {
      return times2(exp, expectTimes, result, template);
    }
  };

  numberTimes1Fun = function(solver, cont, exp, expectTimes) {
    var expCont, i;

    expectTimes = Math.ceil(expectTimes);
    if (expectTimes < 0) {
      throw new ValueError(expectTimes);
    } else if (i === 0) {
      return cont;
    } else if (i === 1) {
      return solver.cont(exp, cont);
    } else if (i === 2) {
      expCont = solver.cont(exp, cont);
      return solver.cont(exp, expCont);
    } else {
      i = null;
      expCont = solver.cont(exp, function(v, solver) {
        i++;
        if (i === expectTimes) {
          return cont(v, solver);
        } else {
          return timesCont(v, solver);
        }
      });
      return function(v, solver) {
        var timesCont;

        i = 0;
        return timesCont = function(v, solver) {
          return expCont(v, solver);
        };
      };
    }
  };

  times1Fun = function(solver, cont, exp, expectTimes) {
    var anyCont, cont1, expCont, expecTimes1, i;

    if (_.isNumber(expectTimes)) {
      return numberTimes1Fun(solver, cont, exp, expectTimes);
    } else {
      expecTimes1 = i = null;
      cont1 = function(v, solver) {
        expectTimes1.bind(i);
        return cont(v, solver);
      };
      anyCont = function(v, solver) {
        var fc, state, trail;

        i++;
        fc = solver.failcont;
        trail = solver.trail;
        solver.trail = new dao.Trail;
        state = solver.state;
        solver.failcont = function(v, solver) {
          i--;
          solver.trail.undo();
          solver.trail = trail;
          solver.state = state;
          solver.failcont = fc;
          return cont1(v, solver);
        };
        return [expCont, v, solver];
      };
      expCont = solver.cont(exp, anyCont);
      return solver.cont(expectTimes, function(v, solver) {
        var expectTimes1;

        expectTimes1 = v;
        if (_.isNumber(expectTimes1)) {
          return numberTimes1Fun(solver, cont, exp, expectTimes1);
        } else {
          return function(v, solver) {
            i = 0;
            return anyCont(v, solver);
          };
        }
      });
    }
  };

  exports.times1 = special('times', times1Fun);

  numberTimes2Fun = function(solver, cont, exp, expectTimes, result, template) {
    var expCont, i, result1;

    expectTimes = Math.ceil(expectTimes);
    if (expectTimes < 0) {
      throw new ValueError(expectTimes);
    } else if (i === 0) {
      return function(v, solver) {
        result.bind([]);
        return cont(v, solver);
      };
    } else if (i === 1) {
      return solver.cont(exp, function(v, solver) {
        result.bind([solver.trail.getvalue(template)]);
        return cont(v, solver);
      });
    } else if (i === 2) {
      result1 = [];
      expCont = solver.cont(exp, function(v, solver) {
        result1.push(solver.trail.getvalue(template));
        result.bind(result1);
        return cont(v, solver);
      });
      return solver.cont(exp, function(v, solver) {
        result1.push(solver.trail.getvalue(template));
        return expCont(v, solver);
      });
    } else {
      result1 = i = null;
      expCont = solver.cont(exp, function(v, solver) {
        i++;
        result1.push(solver.trail.getvalue(template));
        if (i === expectTimes) {
          return function(v, solver) {
            result.bind(result1);
            return cont(v, solver);
          };
        } else {
          return timesCont(v, solver);
        }
      });
      return function(v, solver) {
        var timesCont;

        i = 0;
        result1 = [];
        return timesCont = function(v, solver) {
          return expCont(v, solver);
        };
      };
    }
  };

  times2Fun = function(solver, cont, exp, expectTimes, result, template) {
    var anyCont, cont1, expCont, expecTimes1, i;

    if (_.isNumber(expectTimes)) {
      return numberTimes2Fun(solver, cont, exp, expectTimes, result, template);
    } else {
      expecTimes1 = i = null;
      cont1 = function(v, solver) {
        expectTimes1.bind(i);
        return cont(v, solver);
      };
      anyCont = function(v, solver) {
        var fc, state, trail;

        i++;
        fc = solver.failcont;
        trail = solver.trail;
        solver.trail = new dao.Trail;
        state = solver.state;
        solver.failcont = function(v, solver) {
          i--;
          solver.trail.undo();
          solver.trail = trail;
          solver.state = state;
          solver.failcont = fc;
          return cont1(v, solver);
        };
        return [expCont, v, solver];
      };
      expCont = solver.cont(exp, anyCont);
      return solver.cont(expectTimes, function(v, solver) {
        var expectTimes1;

        expectTimes1 = v;
        if (_.isNumber(expectTimes1)) {
          return numberTimes2Fun(solver, cont, exp, expectTimes1, result, template);
        } else {
          return function(v, solver) {
            i = 0;
            return anyCont(v, solver);
          };
        }
      });
    }
  };

  exports.times2 = special('times', times2Fun);

  exports.char = special('char', function(solver, cont, x) {
    return function(v, solver) {
      var c, data, pos, trail, _ref1;

      _ref1 = solver.state, data = _ref1[0], pos = _ref1[1];
      if (pos >= data.length) {
        return solver.failcont(v, solver);
      }
      trail = solver.trail;
      x = trail.deref(x);
      c = data[pos];
      if (x instanceof Var) {
        x.bind(c, solver.trail);
        solver.state = [data, pos + 1];
        return cont(pos + 1, solver);
      } else if (x === c) {
        solver.state = [data, pos + 1];
        return cont(v, solver);
      } else if (_.isString(x)) {
        if (x.length === 1) {
          return solver.failcont(v, solver);
        } else {
          throw new ExpressionError(x);
        }
      } else {
        throw new TypeError(x);
      }
    };
  });

  exports.followChar = special('followChar', function(solver, cont, arg) {
    return function(v, solver) {
      var c, data, pos, trail, x, _ref1;

      _ref1 = solver.state, data = _ref1[0], pos = _ref1[1];
      if (pos >= data.length) {
        return solver.failcont(v, solver);
      }
      trail = solver.trail;
      x = trail.deref(x);
      c = data[pos];
      if (x instanceof Var) {
        throw new TypeError(x);
      } else if (x === c) {
        return cont(pos, solver);
      } else if (_.isString(x)) {
        if (x.length === 1) {
          return solver.failcont(v, solver);
        } else {
          throw new ValueError(x);
        }
      } else {
        throw new TypeError(x);
      }
    };
  });

  exports.notFollowChar = special('followChar', function(solver, cont, x) {
    return function(v, solver) {
      var c, data, pos, trail, _ref1;

      _ref1 = solver.state, data = _ref1[0], pos = _ref1[1];
      if (pos >= data.length) {
        return solver.failcont(v, solver);
      }
      trail = solver.trail;
      x = trail.deref(x);
      c = data[pos];
      if (x instanceof Var) {
        throw new TypeError(x);
      } else if (x === c) {
        return solver.failcont(pos, solver);
      } else if (_.isString(x)) {
        if (x.length === 1) {
          return cont(v, solver);
        } else {
          throw new ValueError(x);
        }
      } else {
        throw new TypeError(x);
      }
    };
  });

  exports.followChars = special('followChar', function(solver, cont, chars) {
    return function(v, solver) {
      var c, data, pos, trail, _ref1;

      chars = trail.deref(chars);
      if (chars instanceof Var) {
        throw new TypeError(chars);
      }
      _ref1 = solver.state, data = _ref1[0], pos = _ref1[1];
      if (pos >= data.length) {
        return solver.failcont(v, solver);
      }
      trail = solver.trail;
      c = data[pos];
      if (__indexOf.call(chars, c) >= 0) {
        return cont(pos, solver);
      } else if (!_.isString(chars)) {
        throw new TypeError(chars);
      } else {
        return solver.failcont(pos, solver);
      }
    };
  });

  exports.notFollowChars = special('followChar', function(solver, cont, chars) {
    return function(v, solver) {
      var c, data, pos, trail, _ref1;

      chars = trail.deref(chars);
      if (chars instanceof Var) {
        throw new TypeError(chars);
      }
      _ref1 = solver.state, data = _ref1[0], pos = _ref1[1];
      if (pos >= data.length) {
        return solver.failcont(v, solver);
      }
      trail = solver.trail;
      c = data[pos];
      if (__indexOf.call(chars, c) >= 0) {
        return solver.failcont(pos, solver);
      } else if (!_.isString(chars)) {
        throw new TypeError(chars);
      } else {
        return cont(pos, solver);
      }
    };
  });

  exports.charWhen = special('charWhen', function(solver, cont, test) {
    return function(v, solver) {
      var c, data, pos, _ref1;

      _ref1 = solver.state, data = _ref1[0], pos = _ref1[1];
      if (pos >= data.length) {
        return solver.failcont(false, solver);
      }
      c = data[pos];
      if (test(c)) {
        return cont(c, solver);
      } else {
        return solver.failcont(c, solver);
      }
    };
  });

  exports.charBetween = function(x, start, end) {
    return exports.charWhen(x, function(c) {
      return (start < c && c < end);
    });
  };

  exports.charIn = function(x, set) {
    return exports.charWhen(x, function(c) {
      return __indexOf.call(set, c) >= 0;
    });
  };

  exports.digit = exports.charWhen(function(c) {
    return ('0' <= c && c <= '9');
  });

  exports.digit1_9 = exports.charWhen(function(c) {
    return ('1' <= c && c <= '9');
  });

  exports.lower = exports.charWhen(function(c) {
    return ('a' <= c && c <= 'z');
  });

  exports.upper = exports.charWhen(function(c) {
    return ('A' <= c && c <= 'Z');
  });

  exports.letter = exports.charWhen(function(c) {
    return (('a' <= c && c <= 'z')) || (('A' <= c && c <= 'Z'));
  });

  exports.underlineLetter = exports.charWhen(function(c) {
    return (c === '_') || (('a' <= c && c <= 'z')) || (('A' <= c && c <= 'Z'));
  });

  exports.underlineLetterDight = exports.charWhen(function(c) {
    return (c === '_') || (('a' <= c && c <= 'z')) || (('A' <= c && c <= 'Z')) || (('0' <= c && c <= '9'));
  });

  exports.tabspace = exports.charIn(' \t');

  exports.whitespace = exports.charIn(' \t\r\n');

  exports.newline = exports.charIn('\r\n');

  exports.spaces = special('spaces', function(solver, cont) {
    return function(v, solver) {
      var c, data, p, pos, _ref1;

      _ref1 = solver.state, data = _ref1[0], pos = _ref1[1];
      if (pos >= data.length) {
        return solver.failcont(false, solver);
      }
      c = data[pos];
      if (c !== ' ') {
        return solver.failcont(c, solver);
      }
      p = pos + 1;
      while (p < length && data[p] === ' ') {
        p++;
      }
      return cont(p - pos, solver);
    };
  });

  exports.spaces0 = special('spaces', function(solver, cont) {
    return function(v, solver) {
      var c, data, p, pos, _ref1;

      _ref1 = solver.state, data = _ref1[0], pos = _ref1[1];
      if (pos >= data.length) {
        return cont(0, solver);
      }
      c = data[pos];
      if (c !== ' ') {
        return cont(c, solver);
      }
      p = pos + 1;
      while (p < length && data[p] === ' ') {
        p++;
      }
      return cont(p - pos, solver);
    };
  });

  exports.stringWhile = special('stringWhile', function(solver, cont, test) {
    return function(v, solver) {
      var c, data, length, p, pos, _ref1;

      _ref1 = solver.state, data = _ref1[0], pos = _ref1[1];
      length = data.length;
      if (pos === length) {
        return solver.failcont(false, solver);
      }
      c = data[pos];
      if (!test(c)) {
        return solver.failcont(c, solver);
      }
      p = pos + 1;
      while (p < length && test(data[p])) {
        p;
      }
      return cont(text.slice(pos, p), solver);
    };
  });

  exports.stringBetween = function(start, end) {
    return exports.stringWhile(function(c) {
      return (start < c && c < end);
    });
  };

  exports.stringIn = function(set) {
    return exports.stringWhile(function(c) {
      return __indexOf.call(set, c) >= 0;
    });
  };

  exports.digits = exports.stringWhile(function(c) {
    return ('0' <= c && c <= '9');
  });

  exports.digits1_9 = exports.stringWhile(function(c) {
    return ('1' <= c && c <= '9');
  });

  exports.lowers = exports.stringWhile(function(c) {
    return ('a' <= c && c <= 'z');
  });

  exports.uppers = exports.stringWhile(function(c) {
    return ('A' <= c && c <= 'Z');
  });

  exports.letters = exports.stringWhile(function(c) {
    return (('a' <= c && c <= 'z')) || (('A' <= c && c <= 'Z'));
  });

  exports.underlineLetters = exports.stringWhile(function(c) {
    return (c === '_') || (('a' <= c && c <= 'z')) || (('A' <= c && c <= 'Z'));
  });

  exports.underlineLetterDights = exports.stringWhile(function(c) {
    return (c === '_') || (('a' <= c && c <= 'z')) || (('A' <= c && c <= 'Z')) || (('0' <= c && c <= '9'));
  });

  exports.tabspaces = exports.stringIn(' \t');

  exports.whitespaces = exports.stringIn(' \t\r\n');

  exports.newlinespaces = exports.stringIn('\r\n');

  exports.stringWhile0 = special('stringWhile0', function(solver, cont, test) {
    return function(v, solver) {
      var c, data, length, p, pos, _ref1;

      _ref1 = solver.state, data = _ref1[0], pos = _ref1[1];
      length = data.length;
      if (pos === length) {
        return cont('', solver);
      }
      c = data[pos];
      if (!test(c)) {
        return cont('', solver);
      }
      p = pos + 1;
      while (p < length && test(data[p])) {
        p;
      }
      return cont(text.slice(pos, p), solver);
    };
  });

  exports.stringBetween0 = function(start, end) {
    return exports.stringWhile0(function(c) {
      return (start < c && c < end);
    });
  };

  exports.stringIn0 = function(set) {
    return exports.stringWhile0(function(c) {
      return __indexOf.call(set, c) >= 0;
    });
  };

  exports.digits0 = exports.stringWhile0(function(c) {
    return ('0' <= c && c <= '9');
  });

  exports.digits1_90 = exports.stringWhile0(function(c) {
    return ('1' <= c && c <= '9');
  });

  exports.lowers0 = exports.stringWhile0(function(c) {
    return ('a' <= c && c <= 'z');
  });

  exports.uppers0 = exports.stringWhile0(function(c) {
    return ('A' <= c && c <= 'Z');
  });

  exports.letters0 = exports.stringWhile0(function(c) {
    return (('a' <= c && c <= 'z')) || (('A' <= c && c <= 'Z'));
  });

  exports.underlineLetters0 = exports.stringWhile0(function(c) {
    return (c === '_') || (('a' <= c && c <= 'z')) || (('A' <= c && c <= 'Z'));
  });

  exports.underlineLetterDights0 = exports.stringWhile0(function(c) {
    return (c === '_') || (('a' <= c && c <= 'z')) || (('A' <= c && c <= 'Z')) || (('0' <= c && c <= '9'));
  });

  exports.tabspaces0 = exports.stringIn0(' \t');

  exports.whitespaces0 = exports.stringIn0(' \t\r\n');

  exports.newlines0 = exports.stringIn0('\r\n');

  exports.float = special('float', function(solver, cont, arg) {
    return function(v, solver) {
      var length, p, pos, text, val, value, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;

      _ref1 = solver.parse_state, text = _ref1[0], pos = _ref1[1];
      length = text.length;
      if (pos >= length) {
        return solver.failcont(v, solver);
      }
      if ((!'0' <= (_ref2 = text[pos]) && _ref2 <= '9') && text[pos] !== '.') {
        return solver.failcont(v, solver);
      }
      p = pos;
      while (p < length && ('0' <= (_ref3 = text[p]) && _ref3 <= '9')) {
        p++;
      }
      if (p < length && text[p] === '.') {
        p++;
      }
      while (p < length && ('0' <= (_ref4 = text[p]) && _ref4 <= '9')) {
        p++;
      }
      if (p < length - 1 && (_ref5 = text[p], __indexOf.call('eE', _ref5) >= 0)) {
        p++;
        p++;
      }
      while (p < length && ('0' <= (_ref6 = text[p]) && _ref6 <= '9')) {
        p++;
      }
      if (text[{
        pos: p
      }] === '.') {
        return solver.failcont(v, solver);
      }
      val = eval(text.slice(pos, p));
      arg = solver.trail.deref(arg);
      value = eval(text[{
        pos: p
      }]);
      if (arg instanceof Var) {
        arg.bind(value, solver.trail);
        return cont(value, solver);
      } else {
        if (_.isNumber(arg)) {
          if (arg === value) {
            return cont(arg, solver);
          } else {
            return solver.failcont(v, solver)(s);
          }
        } else {
          throw new exports.TypeError(arg);
        }
      }
    };
  });

  exports.literal = special('literal', function(solver, cont, arg) {
    return function(v, solver) {
      var i, length, length2, p, pos, text, _ref1;

      arg = solver.trail.deref(arg);
      if (arg instanceof Var) {
        throw new exports.TypeError(arg);
      }
      _ref1 = solver.parse_state, text = _ref1[0], pos = _ref1[1];
      length = text.length;
      if (pos >= length) {
        return solver.failcont(v, solver);
      }
      i = 0;
      p = pos;
      length2 = arg.length;
      while (i < length2 && p < length && arg[i] === text[p]) {
        i++;
        p++;
      }
      if (i === length2) {
        solver.state = [text, p];
        return cont(p, solver);
      } else {
        return solver.failcont(p, solver);
      }
    };
  });

  exports.followLiteral = special('followLiteral', function(solver, cont, arg) {
    return function(v, solver) {
      var i, length, length2, p, pos, text, _ref1;

      arg = solver.trail.deref(arg);
      if (arg instanceof Var) {
        throw new exports.TypeError(arg);
      }
      _ref1 = solver.parse_state, text = _ref1[0], pos = _ref1[1];
      length = text.length;
      if (pos >= length) {
        return solver.failcont(v, solver);
      }
      i = 0;
      p = pos;
      length2 = arg.length;
      while (i < length2 && p < length && arg[i] === text[p]) {
        i++;
        p++;
      }
      if (i === length2) {
        return cont(p, solver);
      } else {
        return solver.failcont(p, solver);
      }
    };
  });

  exports.notFollowLiteral = special('followLiteral', function(solver, cont, arg) {
    return function(v, solver) {
      var i, length, length2, p, pos, text, _ref1;

      arg = solver.trail.deref(arg);
      if (arg instanceof Var) {
        throw new exports.TypeError(arg);
      }
      _ref1 = solver.parse_state, text = _ref1[0], pos = _ref1[1];
      length = text.length;
      if (pos >= length) {
        return solver.failcont(v, solver);
      }
      i = 0;
      p = pos;
      length2 = arg.length;
      while (i < length2 && p < length && arg[i] === text[p]) {
        i++;
        p++;
      }
      if (i === length2) {
        return solver.failcont(p, solver);
      } else {
        return cont(p, solver);
      }
    };
  });

  exports.quoteString = special('quoteString', function(solver, cont, quote) {
    return function(v, solver) {
      var char, length, p, pos, string, text, _ref1;

      string = '';
      _ref1 = solver.parse_state, text = _ref1[0], pos = _ref1[1];
      length = text.length;
      if (pos >= length) {
        return solver.failcont(v, solver);
      }
      quote = solver.trail.deref(quote);
      if (arg instanceof Var) {
        throw new exports.TypeError(arg);
      }
      if (text[pos] !== quote) {
        return solver.failcont(v, solver);
      }
      p = pos + 1;
      while (p < length) {
        char = text[p];
        p += 1;
        if (char === '\\') {
          p++;
        } else if (char === quote) {
          string = text.slice(pos + 1, p);
          break;
        }
      }
      if (p === length) {
        return solver.failcont(v, solver);
      }
      return cont(string, solver);
    };
  });

  dqstring = exports.quoteString('"');

  sqstring = exports.quoteString("'");

}).call(this);

/*
//@ sourceMappingURL=parser.map
*/
