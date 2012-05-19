$ = jQuery

window.current_player = "X"

#model for each Grid
class Grid extends Spine.Model
  @configure "Grid", "content"

#controller for each Grid
class GridItem extends Spine.Controller
  
  events:
    "click .clickable": "update_content"
  
  constructor: ->
    super
    @item.bind("update",  @render)
    
  render: =>
    if @item.content is ""
      @replace( "<td><div class='clickable' style='height: 30px; background-color: #fff; width: 30px'></div></td>" )
    else
      @replace( "<td>#{@item.content}</td>" )
    @
  
  update_content: ->
    console.log("update content")
    
    @item.updateAttributes( content: window.current_player )
    
    if window.current_player is "X"
      window.current_player = "O"
    else
      window.current_player = "X"

#App for the overall game
class OthelloGame extends Spine.Controller
  el: "#reversi_board"

  constructor: ->
    super
    Grid.bind("update",  @evaluate)
    
    for i in ["1", "2", "3", "4", "5", "6", "7"]
      for h in ["1", "2", "3", "4", "5", "6", "7"]
        Grid.create id: i+h, content: ""
    
    #initialize the first four
    Grid.find("44").updateAttributes( content: "X" )
    Grid.find("45").updateAttributes( content: "O" )
    Grid.find("55").updateAttributes( content: "X" )
    Grid.find("54").updateAttributes( content: "O" )
    
    @addall()

  addall: ->
    console.log("add all")

    for i in ["1", "2", "3", "4", "5", "6", "7"]
      tr = $("<tr></tr>")
        
      for h in ["1", "2", "3", "4", "5", "6", "7"]
        key = i+h
        a = Grid.find(key)
        
        view = new GridItem(item: a)
        tr.append(view.render().el)
      
      $("#connect_four").append(tr)
    

  evaluate: (move) ->
    console.log("evaluate", move)
    
    #check all 8 direction, if you encounter either space or another piece of the same type, then flip everything in between
    

$ ->
  new OthelloGame()

exports = this
exports.OthelloGame = OthelloGame
exports.GridItem = GridItem
exports.Grid = Grid