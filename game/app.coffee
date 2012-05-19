$ = jQuery

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

#App for the overall game
class OthelloGame extends Spine.Controller
  el: "#reversi_board"

  constructor: ->
    super
    Grid.bind("update",  @evaluate)
    
    for i in ["1", "2", "3", "4", "5", "6", "7", "8"]
      for h in ["1", "2", "3", "4", "5", "6", "7", "8"]
        Grid.create id: i+h, content: ""
    
    #initialize the first four
    Grid.find("44").updateAttributes( content: "X" )
    Grid.find("45").updateAttributes( content: "O" )
    Grid.find("55").updateAttributes( content: "X" )
    Grid.find("54").updateAttributes( content: "O" )
    
    @addall()

  addall: ->
    console.log("add all")

    for i in ["1", "2", "3", "4", "5", "6", "7", "8"]
      tr = $("<tr></tr>")
        
      for h in ["1", "2", "3", "4", "5", "6", "7", "8"]
        key = i+h
        a = Grid.find(key)
        
        view = new GridItem(item: a)
        tr.append(view.render().el)
      
      $("#reversi_board").append(tr)

  evaluate: ->
    console.log("evaluate")

$ ->
  new OthelloGame()

exports = this
exports.OthelloGame = OthelloGame
exports.GridItem = GridItem
exports.Grid = Grid