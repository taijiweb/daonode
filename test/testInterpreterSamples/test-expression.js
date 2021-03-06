// Generated by CoffeeScript 1.6.2
(function() {
  var andp, atom, begin, bind, cons, core, dummy, expression, getvalue, is_, macro, operator, orp, print_, settext, solve, special, toString, vari, xexports, _ref, _ref1, _ref2, _ref3;

  _ref = core = require("../../lib/interpreter/core"), solve = _ref.solve, special = _ref.special, vari = _ref.vari, dummy = _ref.dummy, cons = _ref.cons, vari = _ref.vari, macro = _ref.macro;

  _ref1 = require("../../lib/interpreter/builtins/general"), print_ = _ref1.print_, getvalue = _ref1.getvalue, toString = _ref1.toString;

  _ref2 = require("../../lib/interpreter/builtins/logic"), andp = _ref2.andp, orp = _ref2.orp, bind = _ref2.bind, is_ = _ref2.is_;

  begin = require("../../lib/interpreter/builtins/lisp").begin;

  settext = require("../../lib/interpreter/builtins/parser").settext;

  _ref3 = require("../../samples/interpreter/expression"), expression = _ref3.expression, operator = _ref3.operator, atom = _ref3.atom;

  xexports = {};

  exports.Test = {
    "test operator": function(test) {
      var x;

      x = vari('x');
      console.log(solve(begin(settext('+'), operator(x), x)));
      test.equal(x.binding, '+');
      test.equal(core.status, core.SUCCESS);
      x.binding = x;
      console.log(solve(begin(settext('/'), operator(x), x)));
      test.equal(x.binding, '/');
      test.equal(core.status, core.SUCCESS);
      return test.done();
    }
  };

  xexports.Test = {
    "test kleene": function(test) {
      var x;

      x = vari('x');
      console.log(solve(begin(settext('ab'), kleene(x), flatString(getvalue(x)))));
      test.equal(core.status, core.SUCCESS);
      return test.done();
    }
  };

}).call(this);

/*
//@ sourceMappingURL=test-expression.map
*/
