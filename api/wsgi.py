from flask import Flask, abort, redirect, url_for, render_template, current_app, g, request
import click
import chess
import shelve
import copy

games = {}
piece_types = {
    "king": chess.ParamPiece("king", 0,0,'', {
        'movements': [((-1,-1), 1, False), ((-1,0), 1, False), ((-1, 1), 1, False),
                      ((0,-1), 1, False), ((0,1), 1, False),
                      ((1,-1), 1, False), ((1, 0), 1, False), ((1, 1), 1, False)],
        'knightlike': False
    }),
    "rook": chess.ParamPiece("rook", 0,0,'', {
        'movements': [((0,1), -1, False), ((0,-1), -1, False),
                      ((1,0), -1, False), ((-1,0), -1, False)],
        'knightlike': False
    }),
    "siege_tower": chess.ParamPiece("siege_tower", 0,0,'', {
        'movements': [((0,1), -1, True), ((0,-1), -1, True),
                      ((1,0), -1, True), ((-1,0), -1, True)],
        'knightlike': False
    }),
    "bishop": chess.ParamPiece("bishop", 0,0,'', {
        'movements': [((1,1), -1, False), ((1,-1), -1, False),
                      ((-1,-1), -1, False), ((-1,1), -1, False)],
        'knightlike': False
    }),
    "shaman": chess.ParamPiece("shaman", 0,0,'', {
        'movements': [((1,1), 2, True), ((1,-1), 2, True),
                      ((-1,-1), -1, True), ((-1,1), -1, True)],
        'knightlike': False
    }),
    "knight": chess.ParamPiece("knight", 0,0,'', {
        'movements': [],
        'knightlike': True, 'knightdist_a': 1, 'knightdist_b': 2,
    }),
    "knave": chess.ParamPiece("knave", 0,0,'', {
        'movements': [],
        'knightlike': True, 'knightdist_a': 2, 'knightdist_b': 2,
    }),
    "pawn": chess.PawnPiece(0,0,''),
    "peon": chess.PeonPiece(0,0,''),
    "priest": chess.ParamPiece("priest", 0,0,'', {
        'movements': [((1,1), 2, False), ((1,-1), 2, False),
                      ((-1,-1), 2, False), ((-1,1), 2, False)],
        'knightlike': False
    }),
    "cardinal": chess.ParamPiece("cardinal", 0,0,'', {
        'movements': [((1,1), -1, False), ((1,-1), -1, False),
                      ((-1,-1), -1, False), ((-1,1), -1, False),
                      ((0,1), 1, False), ((0,-1), 1, False),
                      ((1,0), 1, False), ((-1,0), 1, False)],
        'knightlike': False
    }),
    "crusader": chess.ParamPiece("crusader", 0,0,'', {
        'movements': [((1,1), -1, False), ((1,-1), -1, False),
                      ((-1,-1), -1, False), ((-1,1), -1, False)],
        'knightlike': True, 'knightdist_a': 1, 'knightdist_b': 2
    }),
    "paladin": chess.ParamPiece("paladin", 0,0,'', {
        'movements': [((1,1), -1, True), ((1,-1), -1, True),
                      ((-1,-1), -1, True), ((-1,1), -1, True)],
        'knightlike': True, 'knightdist_a': 1, 'knightdist_b': 2
    }),
    "rock": chess.ParamPiece("rock", 0,0,'', {
        'movements': [((0,1), 3, False), ((0,-1), 3, False),
                      ((1,0), 3, False), ((-1,0), 3, False)],
        'knightlike': False
    }),
      "knook": chess.ParamPiece("knook", 0,0,'', {
        'movements': [((0,1), -1, False), ((0,-1), -1, False),
                      ((1,0), -1, False), ((-1,0), -1, False)],
        'knightlike': True, 'knightdist_a': 1, 'knightdist_b': 2,
    }),
    "giraffe": chess.ParamPiece("giraffe", 0,0,'', {
        'movements': [],
        'knightlike': True, 'knightdist_a': 1, 'knightdist_b': 3,
    }),
    "queen": chess.ParamPiece("queen", 0,0,'', {
        'movements': [((0,1), -1, False), ((0,-1), -1, False),
                      ((1,0), -1, False), ((-1,0), -1, False),
                      ((1,1), -1, False), ((1,-1), -1, False),
                      ((-1,-1), -1, False), ((-1,1), -1, False)],
        'knightlike': False
    }),
    "princess": chess.ParamPiece("princess", 0,0,'', {
        'movements': [((0,1), 2, False), ((0,2), 2, False),
                      ((1,0), 2, False), ((-1,0), 2, False),
                      ((1,1), 2, False), ((1,-1), 2, False),
                      ((-1,-1), 2, False), ((-1,1), 2, False)],
        'knightlike': False
    }),
    "empress": chess.ParamPiece("empress", 0,0,'', {
        'movements': [((0,1), -1, False), ((0,-1), -1, False),
                      ((1,0), -1, False), ((-1,0), -1, False),
                      ((1,1), -1, False), ((1,-1), -1, False),
                      ((-1,-1), -1, False), ((-1,1), -1, False)],
        'knightlike': True, 'knightdist_a': 1, 'knightdist_b': 2
    }),
    "shaman": chess.ParamPiece("shaman", 0,0,'', {
        'movements': [((1,1), 2, True), ((1,-1), 2, True),
                      ((-1,1), 2, True), ((-1, -1), 2, True)],
        'knightlike': False
    }),
}

setups = {
    "Standard": {
        "width": 8,
        "height": 8,
        "pieces": [
                {"x":0, "y":0, "type":"rook", "colour":"black"},
                {"x":1, "y":0, "type":"knight", "colour":"black"},
                {"x":2, "y":0, "type":"bishop", "colour":"black"},
                {"x":3, "y":0, "type":"queen", "colour":"black"},
                {"x":4, "y":0, "type":"king", "colour":"black"},
                {"x":5, "y":0, "type":"bishop", "colour":"black"},
                {"x":6, "y":0, "type":"knight", "colour":"black"},
                {"x":7, "y":0, "type":"rook", "colour":"black"},
                {"x":0, "y":1, "type":"pawn", "colour":"black"},
                {"x":1, "y":1, "type":"pawn", "colour":"black"},
                {"x":2, "y":1, "type":"pawn", "colour":"black"},
                {"x":3, "y":1, "type":"pawn", "colour":"black"},
                {"x":4, "y":1, "type":"pawn", "colour":"black"},
                {"x":5, "y":1, "type":"pawn", "colour":"black"},
                {"x":6, "y":1, "type":"pawn", "colour":"black"},
                {"x":7, "y":1, "type":"pawn", "colour":"black"},
                {"x":0, "y":6, "type":"pawn", "colour":"white"},
                {"x":1, "y":6, "type":"pawn", "colour":"white"},
                {"x":2, "y":6, "type":"pawn", "colour":"white"},
                {"x":3, "y":6, "type":"pawn", "colour":"white"},
                {"x":4, "y":6, "type":"pawn", "colour":"white"},
                {"x":5, "y":6, "type":"pawn", "colour":"white"},
                {"x":6, "y":6, "type":"pawn", "colour":"white"},
                {"x":7, "y":6, "type":"pawn", "colour":"white"},
                {"x":0, "y":7, "type":"rook", "colour":"white"},
                {"x":1, "y":7, "type":"knight", "colour":"white"},
                {"x":2, "y":7, "type":"bishop", "colour":"white"},
                {"x":3, "y":7, "type":"queen", "colour":"white"},
                {"x":4, "y":7, "type":"king", "colour":"white"},
                {"x":5, "y":7, "type":"bishop", "colour":"white"},
                {"x":6, "y":7, "type":"knight", "colour":"white"},
                {"x":7, "y":7, "type":"rook", "colour":"white"}
        ]
    },
    "Henry VIII vs. The Church": {
        "width": 10,
        "height": 10,
        "pieces": [
                {"x":0, "y":0, "type":"rook", "colour":"black"},
                {"x":1, "y":0, "type":"crusader", "colour":"black"},
                {"x":2, "y":0, "type":"bishop", "colour":"black"},
                {"x":3, "y":0, "type":"cardinal", "colour":"black"},
                {"x":4, "y":0, "type":"king", "colour":"black"},
                {"x":5, "y":0, "type":"paladin", "colour":"black"},
                {"x":6, "y":0, "type":"cardinal", "colour":"black"},
                {"x":7, "y":0, "type":"bishop", "colour":"black"},
                {"x":8, "y":0, "type":"crusader", "colour":"black"},
                {"x":9, "y":0, "type":"rook", "colour":"black"},
                {"x":0, "y":1, "type":"pawn", "colour":"black"},
                {"x":1, "y":1, "type":"pawn", "colour":"black"},
                {"x":2, "y":1, "type":"pawn", "colour":"black"},
                {"x":3, "y":1, "type":"pawn", "colour":"black"},
                {"x":4, "y":1, "type":"pawn", "colour":"black"},
                {"x":5, "y":1, "type":"pawn", "colour":"black"},
                {"x":6, "y":1, "type":"pawn", "colour":"black"},
                {"x":7, "y":1, "type":"pawn", "colour":"black"},
                {"x":8, "y":1, "type":"pawn", "colour":"black"},
                {"x":9, "y":1, "type":"pawn", "colour":"black"},
                {"x":0, "y":8, "type":"king", "colour":"white"},
                {"x":1, "y":8, "type":"pawn", "colour":"white"},
                {"x":2, "y":8, "type":"pawn", "colour":"white"},
                {"x":3, "y":8, "type":"pawn", "colour":"white"},
                {"x":4, "y":8, "type":"pawn", "colour":"white"},
                {"x":5, "y":8, "type":"pawn", "colour":"white"},
                {"x":6, "y":8, "type":"pawn", "colour":"white"},
                {"x":7, "y":8, "type":"pawn", "colour":"white"},
                {"x":8, "y":8, "type":"pawn", "colour":"white"},
                {"x":9, "y":8, "type":"pawn", "colour":"white"},
                {"x":0, "y":9, "type":"king", "colour":"white"},
                {"x":1, "y":9, "type":"empress", "colour":"white"},
                {"x":2, "y":9, "type":"queen", "colour":"white"},
                {"x":3, "y":8, "type":"princess", "colour":"white"},
                {"x":4, "y":8, "type":"queen", "colour":"white"},
                {"x":5, "y":8, "type":"queen", "colour":"white"},
                {"x":6, "y":8, "type":"queen", "colour":"white"},                {"x":1, "y":9, "type":"knight", "colour":"white"},
                {"x":7, "y":9, "type":"bishop", "colour":"white"},
                {"x":8, "y":9, "type":"knight", "colour":"white"},
                {"x":9, "y":9, "type":"rook", "colour":"white"},
        ]
    },
    "Horse Lords vs. Castle Folk": {
        "width": 6,
        "height": 10,
        "pieces": [
                {"x":0, "y":0, "type":"knook", "colour":"black"},
                {"x":1, "y":0, "type":"princess", "colour":"black"},
                {"x":2, "y":0, "type":"queen", "colour":"black"},
                {"x":3, "y":0, "type":"king", "colour":"black"},
                {"x":4, "y":0, "type":"princess", "colour":"black"},
                {"x":5, "y":0, "type":"knook", "colour":"black"},
                {"x":0, "y":1, "type":"rock", "colour":"black"},
                {"x":1, "y":1, "type":"knave", "colour":"black"},
                {"x":2, "y":1, "type":"priest", "colour":"black"},
                {"x":3, "y":1, "type":"cardinal", "colour":"black"},
                {"x":4, "y":1, "type":"knave", "colour":"black"},
                {"x":5, "y":1, "type":"rock", "colour":"black"},
                {"x":1, "y":2, "type":"peon", "colour":"black"},
                {"x":2, "y":2, "type":"peon", "colour":"black"},
                {"x":3, "y":2, "type":"peon", "colour":"black"},
                {"x":4, "y":2, "type":"peon", "colour":"black"},
                {"x":0, "y":7, "type":"rock", "colour":"white"},
                {"x":5, "y":7, "type":"rock", "colour":"white"},
                {"x":0, "y":8, "type":"siege_tower", "colour":"white"},
                {"x":1, "y":8, "type":"pawn", "colour":"white"},
                {"x":2, "y":8, "type":"pawn", "colour":"white"},
                {"x":3, "y":8, "type":"pawn", "colour":"white"},
                {"x":4, "y":8, "type":"pawn", "colour":"white"},
                {"x":5, "y":8, "type":"siege_tower", "colour":"white"},
                {"x":0, "y":9, "type":"giraffe", "colour":"white"},
                {"x":1, "y":9, "type":"shaman", "colour":"white"},
                {"x":2, "y":9, "type":"empress", "colour":"white"},
                {"x":3, "y":9, "type":"king", "colour":"white"},
                {"x":4, "y":9, "type":"shaman", "colour":"white"},
                {"x":5, "y":9, "type":"giraffe", "colour":"white"},

        ]
    }
}

def create_app():
    app = Flask(__name__)

    print("Purchess initialised")
    return app

app = create_app()

@app.get("/api/globals")
def get_globals():
    return {
        "game_codes": list(games.keys()),
        "piece_types": list(piece_types.keys()),
        "setups": setups,
    }

@app.get("/api/game/<string:game_id>") # Get game status
def get_game_state(game_id):
    game = None
    try:
        game = games[game_id]
    except KeyError:
        return {'message': 'Game doesn\'t exist'}, 400

    username = None
    colour = None
    try:
        username = request.cookies.get("user")
        print(f"Looking at game with username {username}")

        if username not in game.players.values(): # The second player to join plays against the host
            if game.players['white'] == '':
                game.players['white'] = username
            elif game.players['black'] == '':
                game.players['black'] = username

        colour = 'white' if game.players['white'] == username else 'black'
    except KeyError:
        colour = 'white'

    return {
        "game_id": game_id,
        "width": game.width,
        "height": game.height,
        "millis": game.millis,
        "incr_millis": game.incr_millis,
        "players": game.players,
        "turn": game.turn,
        "castling": game.castling,
        "pieces": [{"colour": p.colour, "x": p.x, "y": p.y, "type":p.name} for p in game.pieces],
        "winner": game.winner if game.winner else "none",
        "colour": colour
    }

@app.get("/api/game/<string:game_id>/valid_moves") # Get valid moves for current user
def get_moves(game_id):
    try:
        game = games[game_id]
        username = request.cookies.get("user")
        colour = 'white' if game.players['white'] == username else 'black'

        moves = []

        if game.winner != None:
            return {"player_colour": colour, "username": username, "moves": []}

        if colour != game.turn:
            return {"player_colour": colour, "username": username, "moves": []}

        for p in game.pieces:
            print(f"Looking at piece with colour {p.colour}")
            if p.colour == colour:
                for move in p.get_moves(game):
                    moves.append({"from_x": p.x, "from_y": p.y, "to_x": move[0], "to_y": move[1]})

        return {
            "player_colour": colour,
            "username": username,
            "moves": moves
        }
    except KeyError:
        return "{'message': 'Missing param'}", 400

@app.post("/api/game/<string:game_id>/send_move") # Send a move
def send_move(game_id):
    try:
        game = games[game_id]
        print("Cookie")
        username = request.cookies.get("user")
        colour = 'white' if game.players['white'] == username else 'black'

        if colour != game.turn:
            return "{'message': 'Not your turn!'}", 400

        request_json = request.json

        print(request_json)

        from_x = int(request_json['from_x'])
        from_y = int(request_json['from_y'])
        to_x = int(request_json['to_x'])
        to_y = int(request_json['to_y'])

        p = game.piece_at(from_x, from_y)
        if p == None:
            return {'message': 'Invalid move start point'}, 400

        if p.move_to(to_x, to_y, game):
            return {'message': 'Successful move'}
        else:
            return {'message': 'Unable to make this move'}, 400
    except KeyError:
        return {'message': 'Missing param'}, 400

@app.post("/api/game/<string:game_id>") # Create game
def make_game(game_id):
    if game_id in games:
        return "{'message': 'Game by this name exists'}", 400
    else:
        try:
            username = request.cookies.get('user')

            request_data = request.json

            print(request_data)

            millis = int(request_data['time']) * 1000
            incr_millis = int(request_data['increment']) * 1000
            host_colour = request_data['host_colour']

            setup = setups[request_data["setup"]]
            
            

            if host_colour not in ["black", "white"]: abort(400)

            games[game_id] = chess.Board(setup["width"], setup["height"])

            

            games[game_id].millis = {
                'white': millis,
                'black': millis
            }
            games[game_id].incr_millis = incr_millis
            games[game_id].players[host_colour] = username

            games[game_id].width = setup["width"]
            games[game_id].height = setup["height"]

            print("working")
            print(setup)

            for p in setup["pieces"]:
                print(p)
                new_piece = copy.deepcopy(piece_types[p["type"]])
                new_piece.colour = p["colour"]
                new_piece.x = p["x"]
                new_piece.y = p["y"]
                games[game_id].pieces.append(new_piece)
        except KeyError:
            return {'message': 'Missing param'}, 400
        except ValueError:
            return {'message': 'Value Error'}, 400

    return {'message': 'Game creation successful'}