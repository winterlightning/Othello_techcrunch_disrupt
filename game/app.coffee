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
      @replace( "<td id='#{ @item.id }'><div class='clickable' style='height: 30px; background-color: #fff; width: 30px'></div></td>" )
    else
      @replace( "<td id='#{ @item.id }'>#{@item.content}</td>" )
    @
  
  update_content: ->
    console.log("update content")
    
    found = false
    while not found
      for x in ["7", "6", "5", "4", "3", "2", "1"]
        a = Grid.find(x+@item.id[1])
        
        if a.content is ""
          a.updateAttributes( content: window.current_player )
          found = true
          
          if window.current_player is "X"
            window.current_player = "O"
          else
            window.current_player = "X"
            
          return

#App for the overall game
class OthelloGame extends Spine.Controller
  el: "#reversi_board"

  constructor: ->
    super
    Grid.bind("update",  @evaluate)
    
    for i in ["1", "2", "3", "4", "5", "6", "7"]
      for h in ["1", "2", "3", "4", "5", "6", "7"]
        Grid.create id: i+h, content: ""
    
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
    console.log("########################evaluate", move)
    
    #check for consecutive 4s
    won = false
    
    #check vertical line
    for d in [1, 2, 3]
      y = parseInt(move.id[1]) + d
      a = Grid.find( y+move.id[1] )
      
      if a?
        if move.content is a.content
          won = true
          continue
        else
          won = false
          break
      else
        won = false
        break

    #check horizontal line
    #go to both direction, stop when you encounter nothing or someone else's piece
    #count length at end
    length = 1
    east = true
    west = true
    
    for d in [1, 2, 3]
      
      #check east
      if east
        x = parseInt( move.id[1] ) - d
        
        if Grid.exists(move.id[0]+x)          
          east_grid = Grid.find( move.id[0]+x )
          console.log("grid horiz", east_grid)
          
          if east_grid.content is move.content
            length = length + 1
          else
            east = false
          
          console.log("length", length)
          
      #check west
      
    if length >= 4
      won = true
    
    #check South east
    
    #check South west

    console.log(move.content, "won?", won)
    
$ ->
  new OthelloGame()

exports = this
exports.OthelloGame = OthelloGame
exports.GridItem = GridItem
exports.Grid = Grid