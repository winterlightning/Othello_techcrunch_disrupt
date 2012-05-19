(function() {
  var $, Grid, GridItem, OthelloGame, exports;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  $ = jQuery;
  Grid = (function() {
    __extends(Grid, Spine.Model);
    function Grid() {
      Grid.__super__.constructor.apply(this, arguments);
    }
    Grid.configure("Grid", "content");
    return Grid;
  })();
  GridItem = (function() {
    __extends(GridItem, Spine.Controller);
    function GridItem() {
      this.render = __bind(this.render, this);      GridItem.__super__.constructor.apply(this, arguments);
      this.item.bind("update", this.render);
    }
    GridItem.prototype.render = function() {
      this.replace("<td>" + this.item.content + "</td>");
      return this;
    };
    GridItem.prototype.update_content = function() {
      return console.log("update content");
    };
    return GridItem;
  })();
  OthelloGame = (function() {
    __extends(OthelloGame, Spine.Controller);
    OthelloGame.prototype.el = "#reversi_board";
    function OthelloGame() {
      var h, i, _i, _j, _len, _len2, _ref, _ref2;
      OthelloGame.__super__.constructor.apply(this, arguments);
      Grid.bind("update", this.evaluate);
      _ref = ["1", "2", "3", "4", "5", "6", "7", "8"];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        _ref2 = ["1", "2", "3", "4", "5", "6", "7", "8"];
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          h = _ref2[_j];
          Grid.create({
            id: i + h,
            content: "O"
          });
        }
      }
      this.addall();
    }
    OthelloGame.prototype.addall = function() {
      var a, h, i, key, tr, view, _i, _j, _len, _len2, _ref, _ref2, _results;
      console.log("add all");
      _ref = ["1", "2", "3", "4", "5", "6", "7", "8"];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        tr = $("<tr></tr>");
        _ref2 = ["1", "2", "3", "4", "5", "6", "7", "8"];
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          h = _ref2[_j];
          key = i + h;
          a = Grid.find(key);
          view = new GridItem({
            item: a
          });
          tr.append(view.render().el);
        }
        _results.push($("#reversi_board").append(tr));
      }
      return _results;
    };
    return OthelloGame;
  })();
  $(function() {
    return new OthelloGame();
  });
  exports = this;
  exports.OthelloGame = OthelloGame;
  exports.GridItem = GridItem;
  exports.Grid = Grid;
}).call(this);
