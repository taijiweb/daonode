// Generated by CoffeeScript 1.6.2
(function() {
  var Apply, Array, Assign, Begin, BinaryOperation, BinaryOperationApply, CApply, Clamda, Code, Deref, Element, Fun, If, JSCallable, NotImplement, Print, Return, UnaryOperation, UnaryOperationApply, Var, VirtualOperation, VirtualOperationApply, binary, il, toString, unary, vop, _, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require("underscore");

  il = exports;

  exports.NotImplement = NotImplement = (function() {
    function NotImplement(exp, message, stack) {
      this.exp = exp;
      this.message = message != null ? message : '';
      this.stack = stack != null ? stack : this;
    }

    NotImplement.prototype.toString = function() {
      return "" + this.name + " >>> " + this.message;
    };

    return NotImplement;

  })();

  toString = function(o) {
    return (o != null ? typeof o.toString === "function" ? o.toString() : void 0 : void 0) || o;
  };

  Element = (function() {
    function Element() {
      this.name = this.toString();
    }

    Element.prototype.call = function() {
      var args;

      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return new Apply(this, args);
    };

    Element.prototype.toCode = function(compiler) {
      throw NotImplement(this);
    };

    Object.defineProperty(Element.prototype, '$', {
      get: function() {
        return this.constructor;
      }
    });

    return Element;

  })();

  Var = (function(_super) {
    __extends(Var, _super);

    function Var(name) {
      this.name = name;
    }

    Var.prototype.toString = function() {
      return this.name;
    };

    Var.prototype.apply = function(args) {
      return il.apply(this, args);
    };

    return Var;

  })(Element);

  Assign = (function(_super) {
    __extends(Assign, _super);

    function Assign(vari, exp) {
      this.vari = vari;
      this.exp = exp;
      Assign.__super__.constructor.apply(this, arguments);
    }

    Assign.prototype.toString = function() {
      return "" + (toString(this.vari)) + " = " + (toString(this.exp));
    };

    return Assign;

  })(Element);

  Return = (function(_super) {
    __extends(Return, _super);

    function Return(value) {
      this.value = value;
      Return.__super__.constructor.apply(this, arguments);
    }

    Return.prototype.toString = function() {
      return "return(" + (toString(this.value)) + ")";
    };

    return Return;

  })(Element);

  Begin = (function(_super) {
    __extends(Begin, _super);

    function Begin(exps) {
      this.exps = exps;
      Begin.__super__.constructor.apply(this, arguments);
    }

    Begin.prototype.toString = function() {
      var e;

      return "begin(" + (((function() {
        var _i, _len, _ref, _results;

        _ref = this.exps;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          e = _ref[_i];
          _results.push(e.toString());
        }
        return _results;
      }).call(this)).join(',')) + ")";
    };

    return Begin;

  })(Element);

  Array = (function(_super) {
    __extends(Array, _super);

    function Array() {
      _ref = Array.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Array.prototype.toString = function() {
      var e;

      return "[" + (((function() {
        var _i, _len, _ref1, _results;

        _ref1 = this.exps;
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          e = _ref1[_i];
          _results.push(toString(e));
        }
        return _results;
      }).call(this)).join(',')) + "]";
    };

    return Array;

  })(Begin);

  Print = (function(_super) {
    __extends(Print, _super);

    function Print() {
      _ref1 = Print.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    Print.prototype.toString = function() {
      var e;

      return "print(" + (((function() {
        var _i, _len, _ref2, _results;

        _ref2 = this.exps;
        _results = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          e = _ref2[_i];
          _results.push(toString(e));
        }
        return _results;
      }).call(this)).join(',')) + ")";
    };

    return Print;

  })(Begin);

  Clamda = (function(_super) {
    __extends(Clamda, _super);

    function Clamda(v, body) {
      this.v = v;
      this.body = body;
      Clamda.__super__.constructor.apply(this, arguments);
    }

    Clamda.prototype.toString = function() {
      return "(" + (toString(this.v)) + " -> " + (toString(this.body)) + ")";
    };

    Clamda.prototype.call = function(value) {
      return il.capply(this, value);
    };

    return Clamda;

  })(Element);

  JSCallable = (function(_super) {
    __extends(JSCallable, _super);

    function JSCallable(callable) {
      this.callable = callable;
      JSCallable.__super__.constructor.apply(this, arguments);
    }

    JSCallable.prototype.toString = function() {
      return "jscallable(" + this.callable + ")";
    };

    JSCallable.prototype.apply = function(args) {
      return il.apply(this, args);
    };

    return JSCallable;

  })(Element);

  VirtualOperation = (function(_super) {
    __extends(VirtualOperation, _super);

    function VirtualOperation(name) {
      this.name = name;
      VirtualOperation.__super__.constructor.apply(this, arguments);
    }

    VirtualOperation.prototype.toString = function() {
      return "" + this.name;
    };

    VirtualOperation.prototype.call = function() {
      var args;

      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return new VirtualOperationApply(this, args);
    };

    VirtualOperation.prototype.apply = function(args) {
      return new VirtualOperationApply(this, args);
    };

    return VirtualOperation;

  })(Element);

  BinaryOperation = (function(_super) {
    __extends(BinaryOperation, _super);

    function BinaryOperation(symbol) {
      this.symbol = symbol;
      BinaryOperation.__super__.constructor.apply(this, arguments);
    }

    BinaryOperation.prototype.toString = function() {
      return "binary(" + this.symbol + ")";
    };

    BinaryOperation.prototype.apply = function(args) {
      return new BinaryOperationApply(this, args);
    };

    return BinaryOperation;

  })(VirtualOperation);

  UnaryOperation = (function(_super) {
    __extends(UnaryOperation, _super);

    function UnaryOperation() {
      _ref2 = UnaryOperation.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    UnaryOperation.prototype.toString = function() {
      return "unary(" + this.symbol + ")";
    };

    UnaryOperation.prototype.apply = function(args) {
      return new UnaryOperationApply(this, args);
    };

    return UnaryOperation;

  })(BinaryOperation);

  Fun = (function(_super) {
    __extends(Fun, _super);

    function Fun(func) {
      this.func = func;
      Fun.__super__.constructor.apply(this, arguments);
    }

    Fun.prototype.toString = function() {
      return "fun(" + this.func + ")";
    };

    Fun.prototype.apply = function(args) {
      return new Apply(this, args);
    };

    return Fun;

  })(Element);

  Apply = (function(_super) {
    __extends(Apply, _super);

    function Apply(caller, args) {
      this.caller = caller;
      this.args = args;
      Apply.__super__.constructor.apply(this, arguments);
    }

    Apply.prototype.toString = function() {
      var arg;

      return "(" + (toString(this.caller)) + ")(" + (((function() {
        var _i, _len, _ref3, _results;

        _ref3 = this.args;
        _results = [];
        for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
          arg = _ref3[_i];
          _results.push(toString(arg));
        }
        return _results;
      }).call(this)).join(', ')) + ")";
    };

    return Apply;

  })(Element);

  VirtualOperationApply = (function(_super) {
    __extends(VirtualOperationApply, _super);

    function VirtualOperationApply() {
      _ref3 = VirtualOperationApply.__super__.constructor.apply(this, arguments);
      return _ref3;
    }

    VirtualOperationApply.prototype.toString = function() {
      var arg;

      return "vop(" + (toString(this.caller)) + ")(" + (((function() {
        var _i, _len, _ref4, _results;

        _ref4 = this.args;
        _results = [];
        for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
          arg = _ref4[_i];
          _results.push(toString(arg));
        }
        return _results;
      }).call(this)).join(', ')) + ")";
    };

    return VirtualOperationApply;

  })(Apply);

  BinaryOperationApply = (function(_super) {
    __extends(BinaryOperationApply, _super);

    function BinaryOperationApply() {
      _ref4 = BinaryOperationApply.__super__.constructor.apply(this, arguments);
      return _ref4;
    }

    BinaryOperationApply.prototype.toString = function() {
      return "" + (toString(this.args[0])) + (toString(this.caller.symbol)) + (toString(this.args[1]));
    };

    return BinaryOperationApply;

  })(Apply);

  VirtualOperationApply = (function(_super) {
    __extends(VirtualOperationApply, _super);

    function VirtualOperationApply() {
      _ref5 = VirtualOperationApply.__super__.constructor.apply(this, arguments);
      return _ref5;
    }

    VirtualOperationApply.prototype.toString = function() {
      return "" + (toString(this.args[0])) + (toString(this.caller.symbol)) + (toString(this.args[1]));
    };

    return VirtualOperationApply;

  })(Apply);

  UnaryOperationApply = (function(_super) {
    __extends(UnaryOperationApply, _super);

    function UnaryOperationApply() {
      _ref6 = UnaryOperationApply.__super__.constructor.apply(this, arguments);
      return _ref6;
    }

    UnaryOperationApply.prototype.toString = function() {
      return "" + (toString(this.caller.symbol)) + (toString(this.args[0]));
    };

    return UnaryOperationApply;

  })(Apply);

  CApply = (function(_super) {
    __extends(CApply, _super);

    function CApply(cont, value) {
      this.cont = cont;
      this.value = value;
      CApply.__super__.constructor.apply(this, arguments);
    }

    CApply.prototype.toString = function() {
      return "" + (toString(this.cont)) + "(" + (toString(this.value)) + ")";
    };

    return CApply;

  })(Apply);

  Deref = (function(_super) {
    __extends(Deref, _super);

    function Deref(exp) {
      this.exp = exp;
      Deref.__super__.constructor.apply(this, arguments);
    }

    Deref.prototype.toString = function() {
      return "deref(" + (toString(this.exp)) + ")";
    };

    return Deref;

  })(Element);

  Code = (function(_super) {
    __extends(Code, _super);

    function Code(string) {
      this.string = string;
      Code.__super__.constructor.apply(this, arguments);
    }

    Code.prototype.toString = function() {
      return "code(" + this.string + ")";
    };

    return Code;

  })(Element);

  If = (function(_super) {
    __extends(If, _super);

    function If(test, then_, else_) {
      this.test = test;
      this.then_ = then_;
      this.else_ = else_;
      If.__super__.constructor.apply(this, arguments);
    }

    If.prototype.toString = function() {
      return "if_(" + (toString(this.test)) + ", " + (toString(this.then_)) + ", " + (toString(this.else_)) + ")";
    };

    return If;

  })(Element);

  Var.prototype.optimize = function(env, compiler) {
    return env.lookup(this);
  };

  Assign.prototype.optimize = function(env, compiler) {
    return new Assign(compiler.optimize(this.vari, env), compiler.optimize(this.exp, env));
  };

  If.prototype.optimize = function(env, compiler) {
    return new If(compiler.optimize(this.test, env), compiler.optimize(this.then_, env), compiler.optimize(this.else_, env));
  };

  Return.prototype.optimize = function(env, compiler) {
    return new Return(compiler.optimize(this.value, env));
  };

  Clamda.prototype.optimize = function(env, compiler) {
    return new Clamda(this.v, compiler.optimize(this.body, env));
  };

  Apply.prototype.optimize = function(env, compiler) {
    return this;
  };

  CApply.prototype.optimize = function(env, compiler) {
    return compiler.optimize(this.cont.body, env.extend(this.cont.v, compiler.optimize(this.value, env)));
  };

  Begin.prototype.optimize = function(env, compiler) {
    var exp;

    return new this.constructor((function() {
      var _i, _len, _ref7, _results;

      _ref7 = this.exps;
      _results = [];
      for (_i = 0, _len = _ref7.length; _i < _len; _i++) {
        exp = _ref7[_i];
        _results.push(compiler.optimize(exp, env));
      }
      return _results;
    }).call(this));
  };

  Deref.prototype.optimize = function(env, compiler) {
    if (_.isString(this.exp)) {
      return exp;
    } else if (_.isNumber(this.exp)) {
      return exp;
    } else {
      return this;
    }
  };

  Code.prototype.optimize = function(env, compiler) {
    return this;
  };

  JSCallable.prototype.optimize = function(env, compiler) {
    return this;
  };

  Clamda.prototype.toCode = function(compiler) {
    var body, exp;

    body = ((function() {
      var _i, _len, _ref7, _results;

      _ref7 = this.body;
      _results = [];
      for (_i = 0, _len = _ref7.length; _i < _len; _i++) {
        exp = _ref7[_i];
        _results.push(compiler.toCode(exp));
      }
      return _results;
    }).call(this)).join(';');
    return "function(" + (compiler.toCode(this.v)) + "){" + (compiler.toCode(this.body)) + "}";
  };

  Fun.prototype.toCode = function(compiler) {
    return this.func.toString();
  };

  Return.prototype.toCode = function(compiler) {
    return "return " + (compiler.toCode(this.value)) + ";";
  };

  Var.prototype.toCode = function(compiler) {
    return this.name;
  };

  Assign.prototype.toCode = function(compiler) {
    return "" + (compiler.toCode(this.vari)) + " = " + (compiler.toCode(this.exp));
  };

  If.prototype.toCode = function(compiler) {
    return "if (" + (compiler.toCode(this.test)) + ") " + (compiler.toCode(this.then_)) + " else " + (compiler.toCode(this.else_)) + ";";
  };

  Apply.prototype.toCode = function(compiler) {
    var arg;

    return "(" + (compiler.toCode(this.caller)) + ")(" + (((function() {
      var _i, _len, _ref7, _results;

      _ref7 = this.args;
      _results = [];
      for (_i = 0, _len = _ref7.length; _i < _len; _i++) {
        arg = _ref7[_i];
        _results.push(compiler.toCode(arg));
      }
      return _results;
    }).call(this)).join(', ')) + ")";
  };

  BinaryOperationApply.prototype.toCode = function(compiler) {
    return "" + (compiler.toCode(this.args[0])) + (compiler.toCode(this.caller.symbol)) + (compiler.toCode(this.args[1]));
  };

  UnaryOperationApply.prototype.toCode = function(compiler) {
    return "" + (compiler.toCode(this.caller.symbol)) + (compiler.toCode(this.args[0]));
  };

  VirtualOperationApply.prototype.toCode = function(compiler) {
    return this.caller.applyToCode(compiler, this.args);
  };

  CApply.prototype.toCode = function(compiler) {
    return "(" + (compiler.toCode(this.cont)) + ")(" + (compiler.toCode(this.value)) + ")";
  };

  Begin.prototype.toCode = function(compiler) {
    var exp;

    return ((function() {
      var _i, _len, _ref7, _results;

      _ref7 = this.exps;
      _results = [];
      for (_i = 0, _len = _ref7.length; _i < _len; _i++) {
        exp = _ref7[_i];
        _results.push(compiler.toCode(exp));
      }
      return _results;
    }).call(this)).join("; ");
  };

  Array.prototype.toCode = function(compiler) {
    var exp;

    return "[" + (((function() {
      var _i, _len, _ref7, _results;

      _ref7 = this.exps;
      _results = [];
      for (_i = 0, _len = _ref7.length; _i < _len; _i++) {
        exp = _ref7[_i];
        _results.push(compiler.toCode(exp));
      }
      return _results;
    }).call(this)).join(', ')) + "]";
  };

  Print.prototype.toCode = function(compiler) {
    var exp;

    return "console.log(" + (((function() {
      var _i, _len, _ref7, _results;

      _ref7 = this.exps;
      _results = [];
      for (_i = 0, _len = _ref7.length; _i < _len; _i++) {
        exp = _ref7[_i];
        _results.push(compiler.toCode(exp));
      }
      return _results;
    }).call(this)).join(', ')) + ")";
  };

  Deref.prototype.toCode = function(compiler) {
    return "solver.trail.deref(" + (compiler.toCode(this.exp)) + ")";
  };

  Code.prototype.toCode = function(compiler) {
    return this.string;
  };

  JSCallable.prototype.toCode = function(compiler) {
    return this.callable;
  };

  BinaryOperationApply.prototype.toCode = function(compiler) {
    return "(" + (compiler.toCode(this.args[0])) + ")" + this.caller.symbol + "(" + (compiler.toCode(this.args[1])) + ")";
  };

  UnaryOperationApply.prototype.toCode = function(compiler) {
    return "" + this.caller.symbol + "(" + (compiler.toCode(this.args[0])) + ")";
  };

  il.vari = function(name) {
    return new Var(name);
  };

  il.assign = function(vari, exp) {
    return new Assign(vari, exp);
  };

  il.if_ = function(test, then_, else_) {
    return new If(test, then_, else_);
  };

  il.deref = function(exp) {
    return new Deref(exp);
  };

  il.apply = function(caller, args) {
    return new Apply(caller, args);
  };

  il.capply = function(cont, value) {
    return new CApply(cont, value);
  };

  il.begin = function() {
    var exps, length;

    exps = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    length = exps.length;
    if (length === 0) {
      return il.undefined;
    } else if (length === 1) {
      return exps[0];
    } else {
      return new Begin(exps);
    }
  };

  il.array = function() {
    var exps;

    exps = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return new Array(exps);
  };

  il.print = function() {
    var exps;

    exps = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return new Print(exps);
  };

  il["return"] = function(value) {
    return new Return(value);
  };

  il.clamda = function() {
    var body, v;

    v = arguments[0], body = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return new Clamda(v, il.begin.apply(il, body));
  };

  il.code = function(string) {
    return new Code(string);
  };

  il.jscallable = function(callable) {
    return new JSCallable(callable);
  };

  binary = function(symbol) {
    return new BinaryOperation(symbol);
  };

  unary = function(symbol) {
    return new UnaryOperation(symbol);
  };

  il.eq = binary("===");

  il.ne = binary("!==");

  il.lt = binary("<");

  il.le = binary("<=");

  il.gt = binary(">");

  il.ge = binary(">=");

  il.add = binary("+");

  il.sub = binary("-");

  il.mul = binary("*");

  il.div = binary("/");

  il.mod = binary("%");

  il.and_ = binary("&&");

  il.or_ = binary("||");

  il.bitand = binary("&");

  il.bitor = binary("|");

  il.lshift = binary("<<");

  il.rshift = binary(">>");

  il.not_ = unary("!");

  il.neg = unary("-");

  il.bitnot = unary("~");

  il.inc = unary("++");

  il.dec = unary("--");

  vop = function(name, toCode) {
    var Vop, _ref7;

    Vop = (function(_super) {
      __extends(Vop, _super);

      function Vop() {
        _ref7 = Vop.__super__.constructor.apply(this, arguments);
        return _ref7;
      }

      Vop.prototype.applyToCode = toCode;

      return Vop;

    })(VirtualOperation);
    return new Vop(name);
  };

  il.suffixinc = vop('suffixdec', function(compiler, args) {
    return "" + (compiler.toCode(args[0])) + "++";
  });

  il.suffixdec = vop('suffixdec', function(compiler, args) {
    return "" + (compiler.toCode(args[0])) + "--";
  });

  il.protect = vop('protect', function(compiler, args) {
    return "solver.protect(" + (compiler.toCode(args[0])) + ")";
  });

  il.pushCatch = vop('pushCatch', function(compiler, args) {
    return "solver.pushCatch(" + (compiler.toCode(args[0])) + ", " + (compiler.toCode(args[1])) + ")";
  });

  il.popCatch = vop('popCatch', function(compiler, args) {
    return "solver.popCatch(" + (compiler.toCode(args[0])) + ")";
  });

  il.findCatch = vop('findCatch', function(compiler, args) {
    return "solver.findCatch(" + (compiler.toCode(args[0])) + ")";
  });

  il.fake = vop('fake', function(compiler, args) {
    return "solver.fake(" + (compiler.toCode(args[0])) + ")";
  }).apply([]);

  il.restore = vop('restore', function(compiler, args) {
    return "solver.restore(" + (compiler.toCode(args[0])) + ")";
  });

  il.getvalue = vop('getvalue', function(compiler, args) {
    return "solver.trail.getvalue(" + (compiler.toCode(args[0])) + ")";
  });

  il.index = vop('index', function(compiler, args) {
    return "(" + (compiler.toCode(args[0])) + ")[" + (compiler.toCode(args[1])) + "]";
  });

  il.run = vop('run', function(compiler, args) {
    return "solver.run(" + (compiler.toCode(args[0])) + ", " + (compiler.toCode(args[1])) + ")";
  });

  il.failcont = vop('failcont', function(compiler, args) {
    return "solver.failcont(" + (compiler.toCode(args[0])) + ")";
  });

  il.fun = function(f) {
    return new Fun(f);
  };

}).call(this);

/*
//@ sourceMappingURL=interlang.map
*/