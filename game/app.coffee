$ = jQuery

#model for each Grid
class Grid extends Spine.Model
  @configure "Grid", "content"

#controller for each Grid
class GridItem extends Spine.Controller
  
  constructor: ->
    super
    @item.bind("update",  @render)
    
  render: =>
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
        Grid.create id: i+h, content: "O"
    
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
      
      @el.append(tr)

$ ->
  new OthelloGame()

exports = this
exports.OthelloGame = OthelloGame
exports.GridItem = GridItem
exports.Grid = Grid

