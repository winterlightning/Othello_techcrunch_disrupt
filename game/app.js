(function() {
  var $, Grid, GridItem, OthelloGame, apiReady, exports;
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
        this.replace("<td id='" + this.item.id + "'><div class='clickable' style='height: 60px; background-color: transparent; width: 100%'>&nbsp;</div></td>");
      } else {
        if (this.item.content === "X") {
          this.replace("<td id='" + this.item.id + "' style='background-color: #BF0426; opacity: 0.7'><div class='content' style='height: 50px; width: 100%'>&nbsp;</div></td>");
        } else {
          this.replace("<td id='" + this.item.id + "' style='background-color: #45648C; opacity: 0.7'><div class='content' style='height: 50px; width: 100%'>&nbsp;</div></td>");
        }
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
      var NE, NE_grid, NW, NW_grid, SE, SE_grid, SW, SW_grid, a, d, down, e_length, east, east_grid, length, v_length, w_length, west, west_grid, won, x, y, _i, _j, _k, _l, _len, _len2, _len3, _len4, _ref, _ref2, _ref3, _ref4;
      console.log("########################evaluate", move);
      won = false;
      v_length = 1;
      down = true;
      _ref = [1, 2, 3];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        d = _ref[_i];
        y = parseInt(move.id[0]) + d;
        if (down) {
          if (Grid.exists(y.toString() + move.id[1])) {
            a = Grid.find(y.toString() + move.id[1]);
            if (move.content === a.content) {
              v_length = v_length + 1;
            } else {
              down = false;
            }
          } else {
            down = false;
          }
        }
      }
      if (v_length >= 4) {
        console.log("won from veritcal");
        won = true;
      }
      length = 1;
      east = true;
      west = true;
      _ref2 = [1, 2, 3];
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        d = _ref2[_j];
        if (east) {
          x = parseInt(move.id[1]) - d;
          if (Grid.exists(move.id[0] + x)) {
            east_grid = Grid.find(move.id[0] + x);
            if (east_grid.content === move.content) {
              length = length + 1;
            } else {
              east = false;
            }
          }
        }
        if (west) {
          x = parseInt(move.id[1]) + d;
          if (Grid.exists(move.id[0] + x)) {
            west_grid = Grid.find(move.id[0] + x);
            if (west_grid.content === move.content) {
              length = length + 1;
            } else {
              west = false;
            }
          }
        }
      }
      if (length >= 4) {
        console.log("won from horizontal");
        won = true;
      }
      e_length = 1;
      NE = true;
      SW = true;
      _ref3 = [1, 2, 3];
      for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
        d = _ref3[_k];
        if (NE) {
          x = parseInt(move.id[1]) - d;
          y = parseInt(move.id[0]) - d;
          if (Grid.exists(y.toString() + x.toString())) {
            NE_grid = Grid.find(y.toString() + x.toString());
            console.log("grid diag E", NE_grid);
            if (NE_grid.content === move.content) {
              e_length = e_length + 1;
            } else {
              NE = false;
            }
            console.log("length", e_length);
          }
        }
        if (SW) {
          x = parseInt(move.id[1]) + d;
          y = parseInt(move.id[0]) + d;
          if (Grid.exists(y.toString() + x.toString())) {
            SW_grid = Grid.find(y.toString() + x.toString());
            console.log("grid diag W", SW_grid, "move", move);
            if (SW_grid.content === move.content) {
              e_length = e_length + 1;
            } else {
              SW = false;
            }
          }
        }
        console.log("length", e_length);
      }
      if (e_length >= 4) {
        console.log("won from e diagnal");
        won = true;
      }
      w_length = 1;
      NW = true;
      SE = true;
      _ref4 = [1, 2, 3];
      for (_l = 0, _len4 = _ref4.length; _l < _len4; _l++) {
        d = _ref4[_l];
        if (NW) {
          x = parseInt(move.id[1]) + d;
          y = parseInt(move.id[0]) - d;
          if (Grid.exists(y.toString() + x.toString())) {
            NW_grid = Grid.find(y.toString() + x.toString());
            console.log("grid diag E", NW_grid);
            if (NW_grid.content === move.content) {
              w_length = w_length + 1;
            } else {
              NW = false;
            }
            console.log("length", w_length);
          }
        }
        if (SE) {
          x = parseInt(move.id[1]) - d;
          y = parseInt(move.id[0]) + d;
          if (Grid.exists(y.toString() + x.toString())) {
            SE_grid = Grid.find(y.toString() + x.toString());
            console.log("grid diag W", SE_grid, "move", move);
            if (SE_grid.content === move.content) {
              w_length = w_length + 1;
            } else {
              SE = false;
            }
          }
        }
        console.log("length", w_length);
      }
      if (w_length >= 4) {
        console.log("won from w diagnal");
        won = true;
      }
      gapi.hangout.data.submitDelta({
        'id': move.id,
        content: move.content
      });
      if (won) {
        alert(move.content + " won!");
        return location.reload();
      }
    };
    return OthelloGame;
  })();
  window.consume_update = function(thestate) {
    var a, updating;
    console.log("THE STATE IS", thestate);
    a = thestate["id"];
    updating = Grid.find(a);
    return updating.updateAttributes({
      content: thestate["content"]
    });
  };
  apiReady = function(eventObj) {
    var cur_player;
    if (eventObj.isApiReady) {
      console.log("API is ready");
      gapi.hangout.data.onStateChanged.add(function(eventObj) {
        console.log("HANDLED");
        console.log("eventOb", eventObj.state);
        return window.consume_update(eventObj.state);
      });
      gapi.hangout.onParticipantsChanged.add(function(eventObj) {
        var cur_player, state;
        console.log("Participant ENTERED TRIGGER");
        state = gapi.hangout.data.getState();
        if (state["x"] != null) {
          window.player = "O";
          cur_player = gapi.hangout.getParticipants()[0];
          $("#o_text").html(cur_player["person"].displayName);
          return $("#x_text").html(state["x"]);
        } else {
          window.player = "X";
          cur_player = gapi.hangout.getParticipants()[0];
          gapi.hangout.data.submitDelta({
            'x': cur_player["person"].displayName
          });
          return $("#x_text").html(cur_player.displayName);
        }
      });
      if (state["x"] != null) {
        window.player = "O";
        cur_player = gapi.hangout.getParticipants()[1];
        $("#o_text").html(cur_player.displayName);
        $("#x_text").html(state["x"]);
      } else {
        window.player = "X";
        cur_player = gapi.hangout.getParticipants()[0];
        gapi.hangout.data.submitDelta({
          'x': cur_player.displayName
        });
        $("#x_text").html(cur_player.displayName);
      }
      console.log(gapi.hangout.getParticipants());
      return gapi.hangout.onApiReady.remove(apiReady);
    }
  };
  gapi.hangout.onApiReady.add(apiReady);
  $(function() {
    return new OthelloGame();
  });
  exports = this;
  exports.OthelloGame = OthelloGame;
  exports.GridItem = GridItem;
  exports.Grid = Grid;
}).call(this);
