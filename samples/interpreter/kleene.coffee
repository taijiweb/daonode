{solve, special, vari, dummy, cons, vari, macro} = require("../../lib/interpreter/core")
{print_, getvalue, toString} = require("../../lib/interpreter/builtins/general")
{andp, orp, rule, bind, is_} = require("../../lib/interpreter/builtins/logic")
{begin} = require("../../lib/interpreter/builtins/lisp")
{settext, char, digits, spaces, eoi, memo} = require("../../lib/interpreter/builtins/parser")

exports.flatString = flatString = special(1, 'flatString', (solver, cont, x) ->
  solver.cont(x, (v) -> cont(v.flatString?() or 'null')))

exports.kleene = kleene = rule(1, (x) ->
  x = vari('x');  y = vari('y')
  [ [cons(x, y)], andp(char(x), print_(x), kleene(y)),
    [null], print_('end')
  ])

# wrong implementation, don't work.
leftkleene = rule(0, () ->
  x = vari('x')
  [ [], andp(leftkleene(), char(x), print_(x)),
    [], print_('end')
  ])

exports.leftkleene = leftkleene = memo(leftkleene)

exports.kleenePredicate = (pred) ->
  r = rule(1, (x) ->
    x = vari('x');  y = vari('y')
    [ [cons(x, y)], andp(pred(x)#, print_(x)
                        , r(y)),
      [null], print_('end')
    ])
  r

#dightsSpaces = macro(1, (x) -> andp(digits, print_('daf'), spaces, print_('adds')))

exports.dightsSpaces = macro(1, (x) ->
   andp(is_(x, digits)
#      print_('daf'),
      , orp(spaces, eoi)
#      , print_('adds')
   )
)

