// Linear partition
// Partitions a sequence of non-negative integers into k ranges
// Based on Óscar López implementation in Python (http://stackoverflow.com/a/7942946)
// Also see http://www8.cs.umu.se/kurser/TDBAfl/VT06/algorithms/BOOK/BOOK2/NODE45.HTM
// Dependencies: UnderscoreJS (http://www.underscorejs.org)
// Example: linear_partition([9,2,6,3,8,5,8,1,7,3,4], 3) => [[9,2,6,3],[8,5,8],[1,7,3,4]]
// Retrieved on 2013-08-13 from https://github.com/crispymtn/linear-partition/blob/master/linear_partition.coffee
var linear_partition,
  _this = this;

linear_partition = function(seq, k) {
  var ans, i, j, m, n, solution, table, x, y, _i, _j, _k, _l;
  n = seq.length;
  if (k <= 0) {
    return [];
  }
  if (k > n) {
    return seq.map(function(x) {
      return [x];
    });
  }
  table = (function() {
    var _i, _results;
    _results = [];
    for (y = _i = 0; 0 <= n ? _i < n : _i > n; y = 0 <= n ? ++_i : --_i) {
      _results.push((function() {
        var _j, _results1;
        _results1 = [];
        for (x = _j = 0; 0 <= k ? _j < k : _j > k; x = 0 <= k ? ++_j : --_j) {
          _results1.push(0);
        }
        return _results1;
      })());
    }
    return _results;
  })();
  solution = (function() {
    var _i, _ref, _results;
    _results = [];
    for (y = _i = 0, _ref = n - 1; 0 <= _ref ? _i < _ref : _i > _ref; y = 0 <= _ref ? ++_i : --_i) {
      _results.push((function() {
        var _j, _ref1, _results1;
        _results1 = [];
        for (x = _j = 0, _ref1 = k - 1; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; x = 0 <= _ref1 ? ++_j : --_j) {
          _results1.push(0);
        }
        return _results1;
      })());
    }
    return _results;
  })();
  for (i = _i = 0; 0 <= n ? _i < n : _i > n; i = 0 <= n ? ++_i : --_i) {
    table[i][0] = seq[i] + (i ? table[i - 1][0] : 0);
  }
  for (j = _j = 0; 0 <= k ? _j < k : _j > k; j = 0 <= k ? ++_j : --_j) {
    table[0][j] = seq[0];
  }
  for (i = _k = 1; 1 <= n ? _k < n : _k > n; i = 1 <= n ? ++_k : --_k) {
    for (j = _l = 1; 1 <= k ? _l < k : _l > k; j = 1 <= k ? ++_l : --_l) {
      m = _.min((function() {
        var _m, _results;
        _results = [];
        for (x = _m = 0; 0 <= i ? _m < i : _m > i; x = 0 <= i ? ++_m : --_m) {
          _results.push([_.max([table[x][j - 1], table[i][0] - table[x][0]]), x]);
        }
        return _results;
      })(), function(o) {
        return o[0];
      });
      table[i][j] = m[0];
      solution[i - 1][j - 1] = m[1];
    }
  }
  n = n - 1;
  k = k - 2;
  ans = [];
  while (k >= 0) {
    ans = [
      (function() {
        var _m, _ref, _ref1, _results;
        _results = [];
        for (i = _m = _ref = solution[n - 1][k] + 1, _ref1 = n + 1; _ref <= _ref1 ? _m < _ref1 : _m > _ref1; i = _ref <= _ref1 ? ++_m : --_m) {
          _results.push(seq[i]);
        }
        return _results;
      })()
    ].concat(ans);
    n = solution[n - 1][k];
    k = k - 1;
  }
  return [
    (function() {
      var _m, _ref, _results;
      _results = [];
      for (i = _m = 0, _ref = n + 1; 0 <= _ref ? _m < _ref : _m > _ref; i = 0 <= _ref ? ++_m : --_m) {
        _results.push(seq[i]);
      }
      return _results;
    })()
  ].concat(ans);
};
