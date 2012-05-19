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
  window.current_player = "X";
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
    GridItem.prototype.events = {
      "click .clickable": "update_content"
    };
    function GridItem() {
      this.render = __bind(this.render, this);      GridItem.__super__.constructor.apply(this, arguments);
      this.item.bind("update", this.render);
    }
    GridItem.prototype.render = function() {
      if (this.item.content === "") {
        this.replace("<td id='" + this.item.id + "'><div class='clickable' style='height: 30px; background-color: #fff; width: 30px'></div></td>");
      } else {
        this.replace("<td id='" + this.item.id + "'>" + this.item.content + "</td>");
      }
      return this;
    };
    GridItem.prototype.update_content = function() {
      var a, found, x, _i, _len, _ref, _results;
      console.log("update content");
      found = false;
      _results = [];
      while (!found) {
        _ref = ["7", "6", "5", "4", "3", "2", "1"];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          x = _ref[_i];
          a = Grid.find(x + this.item.id[1]);
          if (a.content === "") {
            a.updateAttributes({
              content: window.current_player
            });
            found = true;
            if (window.current_player === "X") {
              window.current_player = "O";
            } else {
              window.current_player = "X";
            }
            return;
          }
        }
      }
      return _results;
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
      _ref = ["1", "2", "3", "4", "5", "6", "7"];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        _ref2 = ["1", "2", "3", "4", "5", "6", "7"];
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          h = _ref2[_j];
          Grid.create({
            id: i + h,
            content: ""
          });
        }
      }
      this.addall();
    }
    OthelloGame.prototype.addall = function() {
      var a, h, i, key, tr, view, _i, _j, _len, _len2, _ref, _ref2, _results;
      console.log("add all");
      _ref = ["1", "2", "3", "4", "5", "6", "7"];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        tr = $("<tr></tr>");
        _ref2 = ["1", "2", "3", "4", "5", "6", "7"];
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          h = _ref2[_j];
          key = i + h;
          a = Grid.find(key);
          view = new GridItem({
            item: a
          });
          tr.append(view.render().el);
        }
        _results.push($("#connect_four").append(tr));
      }
      return _results;
    };
    OthelloGame.prototype.evaluate = function(move) {
      var a, d, won, y, _i, _len, _ref;
      console.log("evaluate", move);
      won = false;
      _ref = [1, 2, 3];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        d = _ref[_i];
        y = parseInt(move.id[1]) + d;
        a = Grid.find(y + move.id[1]);
        if (a != null) {
          if (move.content === a.content) {
            won = true;
            continue;
          } else {
            won = false;
            break;
          }
        } else {
          won = false;
          break;
        }
      }
      return console.log("won?", won);
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
