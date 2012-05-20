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
      @replace( "<td id='#{ @item.id }'><div class='clickable' style='height: 50px; background-color: #fff; width: 100%'>&nbsp;</div></td>" )
    else
      if @item.content is "X"
        @replace( "<td id='#{ @item.id }' style='background-color: #020'><div class='content' style='height: 50px; width: 100%'>&nbsp;</div></td>" )
      else
        @replace( "<td id='#{ @item.id }' style='background-color: #00a'><div class='content' style='height: 50px; width: 100%'>&nbsp;</div></td>" )
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
    
    v_length = 1
    #check vertical line
    down = true
    for d in [1, 2, 3]
      y = parseInt(move.id[0]) + d
      #console.log("y:", y)
      if down
        
        if Grid.exists( y.toString()+move.id[1] )
          a = Grid.find( y.toString()+move.id[1] )
          
          #console.log("vertical grid", a, "move", move)
          
          if move.content is a.content
            v_length = v_length + 1
          else
            down = false
        else
          down = false
    
    if v_length >= 4
      console.log("won from veritcal")
      won = true

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
          #console.log("grid horiz", east_grid)
          
          if east_grid.content is move.content
            length = length + 1
          else
            east = false
          
          #console.log("length", length)
          
      #check west
      if west
        x = parseInt( move.id[1] ) + d
        
        if Grid.exists(move.id[0]+x)          
          west_grid = Grid.find( move.id[0]+x )
          #console.log("grid horiz W", west_grid)
          
          if west_grid.content is move.content
            length = length + 1
          else
            west = false

      #console.log("length", length)
      
    if length >= 4
      console.log("won from horizontal")
      won = true
    
    #check east starting diagonal
    e_length = 1
    NE = true
    SW = true
    
    for d in [1, 2, 3]
      
      #check east
      if NE
        x = parseInt( move.id[1] ) - d
        y = parseInt( move.id[0] ) - d
        
        if Grid.exists(y.toString()+x.toString())          
          NE_grid = Grid.find( y.toString()+x.toString() )
          console.log("grid diag E", NE_grid)
          
          if NE_grid.content is move.content
            e_length = e_length + 1
          else
            NE = false
          
          console.log("length", e_length)
          
      #check west
      if SW
        x = parseInt( move.id[1] ) + d
        y = parseInt( move.id[0] ) + d
        
        if Grid.exists(y.toString()+x.toString())          
          SW_grid = Grid.find( y.toString()+x.toString() )
          console.log("grid diag W", SW_grid, "move", move)
          
          if SW_grid.content is move.content
            e_length = e_length + 1
          else
            SW = false    
        
      console.log("length", e_length)
    
    if e_length >= 4
      console.log("won from e diagnal")
      won = true

    #check east starting diagonal
    w_length = 1
    NW = true
    SE = true
    
    for d in [1, 2, 3]
      
      #check east
      if NW
        x = parseInt( move.id[1] ) + d
        y = parseInt( move.id[0] ) - d
        
        if Grid.exists(y.toString()+x.toString())          
          NW_grid = Grid.find( y.toString()+x.toString() )
          console.log("grid diag E", NW_grid)
          
          if NW_grid.content is move.content
            w_length = w_length + 1
          else
            NW = false
          
          console.log("length", w_length)
          
      #check west
      if SE
        x = parseInt( move.id[1] ) - d
        y = parseInt( move.id[0] ) + d
        
        if Grid.exists(y.toString()+x.toString())          
          SE_grid = Grid.find( y.toString()+x.toString() )
          console.log("grid diag W", SE_grid, "move", move)
          
          if SE_grid.content is move.content
            w_length = w_length + 1
          else
            SE = false    
        
      console.log("length", w_length)
      
    if w_length >= 4
      console.log("won from w diagnal")
      won = true    

    gapi.hangout.data.submitDelta('id': move.id, content: move.content)

    if won
      alert(move.content+" won!")
      location.reload()

#take an update and apply it to the local model
window.consume_update = (thestate)->
    console.log("THE STATE IS", thestate)
    a = thestate["id"]
    
    updating = Grid.find(a)
    updating.updateAttributes( content: thestate["content"] )

apiReady = (eventObj) ->
  if eventObj.isApiReady
    console.log "API is ready"
    gapi.hangout.data.onStateChanged.add (eventObj) ->
      console.log("HANDLED")
      console.log("eventOb", eventObj.state)
      window.consume_update eventObj.state

    gapi.hangout.onParticipantsChanged.add (eventObj) ->
      console.log eventObj.participants

    console.log gapi.hangout.data.getState()
    console.log gapi.hangout.getParticipants()
    gapi.hangout.onApiReady.remove apiReady

gapi.hangout.onApiReady.add apiReady  
    
$ ->
  new OthelloGame()

exports = this
exports.OthelloGame = OthelloGame
exports.GridItem = GridItem
exports.Grid = Grid