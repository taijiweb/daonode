// Generated by CoffeeScript 1.6.2
(function() {
  var andp, begin, bind, char, cons, digits, dqstring, dummy, eoi, getvalue, is_, literal, macro, number, operator, orp, print_, rule, settext, solve, spaces, special, sqstring, string, toString, vari, _, _ref, _ref1, _ref2, _ref3,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ = require('underscore');

  _ref = require("../lib/core"), solve = _ref.solve, special = _ref.special, vari = _ref.vari, dummy = _ref.dummy, cons = _ref.cons, vari = _ref.vari, macro = _ref.macro;

  _ref1 = require("../lib/builtins/general"), print_ = _ref1.print_, getvalue = _ref1.getvalue, toString = _ref1.toString;

  _ref2 = require("../lib/builtins/logic"), andp = _ref2.andp, orp = _ref2.orp, rule = _ref2.rule, bind = _ref2.bind, is_ = _ref2.is_;

  begin = require("../lib/builtins/lisp").begin;

  _ref3 = require("../lib/builtins/parser"), settext = _ref3.settext, char = _ref3.char, digits = _ref3.digits, spaces = _ref3.spaces, eoi = _ref3.eoi, literal = _ref3.literal, number = _ref3.number, dqstring = _ref3.dqstring, sqstring = _ref3.sqstring;

  exports.expression = function(operator) {
    return rule(null, 'expression', function(x) {
      var e1, e2, op;

      op = vari('op');
      e1 = vari('e1');
      e2 = vari('e2');
      return [[expr(f, e1, e2)], andp(expression(e1), operator(f), expression(e2))];
    });
  };

  exports.operator = rule(1, 'operator', function(x) {
    return [['+'], literal('+'), ['-'], literal('-'), ['*'], literal('*'), ['/'], literal('/')];
  });

  exports.operator = special('operator', function(solver, cont, x) {
    return function(v) {
      var c, data, pos, _ref4;

      _ref4 = solver.state, data = _ref4[0], pos = _ref4[1];
      if (pos >= data.length) {
        return solver.failcont(false);
      }
      c = data[pos];
      x = solver.trail.deref(x);
      if (_.isString(x)) {
        if (x === c) {
          solver.state = [data, pos + 1];
          return cont(c);
        } else {
          return solver.failcont(c);
        }
      } else {
        if (__indexOf.call("+-*/", c) >= 0) {
          x.bind(c, solver.trail);
          solver.state = [data, pos + 1];
          return cont(c);
        } else {
          return solver.failcont(c);
        }
      }
    };
  });

  operator = function(x) {
    return is_(charIn("+-*/"));
  };

  string = function(x) {
    return orp(is_(x, dqstring), is_(x, sqstring));
  };

  exports.atom = rule(1, 'atom', function(x) {
    return [[x], number(x), [x], string(x), [x], andp(literal('('), spaces, expression(x), literal(')'))];
  });

}).call(this);

/*
//@ sourceMappingURL=expression.map
*/
