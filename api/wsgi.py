from flask import Flask, abort, redirect, url_for, render_template, current_app, g, request
import click
import chess
import shelve
import copy

games = {}
piece_types = {
    "rook": chess.ParamPiece(0,0,'', {
        'movements': [((0,1), -1, False), ((0,-1), -1, False),
                      ((1,0), -1, False), ((-1,0), -1, False)],
        'knightlike': False
    }),
    "bishop": chess.ParamPiece(0,0,'', {
        'movements': [((1,1), -1, False), ((1,-1), -1, False),
                      ((-1,-1), -1, False), ((-1,1), -1, False)],
        'knightlike': False
    }),
    "knight": chess.ParamPiece(0,0,'', {
        'movements': [],
        'knightlike': True, 'knightdist_a': 1, 'knightdist_b': 2,
    }),
    "pawn": chess.PawnPiece(0,0,''),
    "priest": chess.ParamPiece(0,0,'', {
        'movements': [((1,1), 2, False), ((1,-1), 2, False),
                      ((-1,-1), 2, False), ((-1,1), 2, False)],
        'knightlike': False
    }),
    "cardinal": chess.ParamPiece(0,0,'', {
        'movements': [((1,1), -1, False), ((1,-1), -1, False),
                      ((-1,-1), -1, False), ((-1,1), -1, False),
                      ((0,1), 1, False), ((0,-1), 1, False),
                      ((1,0), 1, False), ((-1,0), 1, False)],
        'knightlike': False
    }),
    "crusader": chess.ParamPiece(0,0,'', {
        'movements': [((1,1), -1, False), ((1,-1), -1, False),
                      ((-1,-1), -1, False), ((-1,1), -1, False)],
        'knightlike': True, 'knightdist_a': 1, 'knightdist_b': 2
    }),
    "paladin": chess.ParamPiece(0,0,'', {
        'movements': [((1,1), -1, True), ((1,-1), -1, True),
                      ((-1,-1), -1, True), ((-1,1), -1, True)],
        'knightlike': True, 'knightdist_a': 1, 'knightdist_b': 2
    }),
    "rock": chess.ParamPiece(0,0,'', {
        'movements': [((0,1), 3, False), ((0,-1), 3, False),
                      ((1,0), 3, False), ((-1,0), 3, False)],
        'knightlike': False
    }),
      "knook": chess.ParamPiece(0,0,'', {
        'movements': [((0,1), -1, False), ((0,-1), -1, False),
                      ((1,0), -1, False), ((-1,0), -1, False)],
        'knightlike': True, 'knightdist_a': 1, 'knightdist_b': 2,
    }),
    "giraffe": chess.ParamPiece(0,0,'', {
        'movements': [],
        'knightlike': True, 'knightdist_a': 1, 'knightdist_b': 3,
    }),
    "queen": chess.ParamPiece(0,0,'', {
        'movements': [((0,1), -1, False), ((0,-1), -1, False),
                      ((1,0), -1, False), ((-1,0), -1, False),
                      ((1,1), -1, False), ((1,-1), -1, False),
                      ((-1,-1), -1, False), ((-1,1), -1, False)],
        'knightlike': False
    }),
    "empress": chess.ParamPiece(0,0,'', {
        'movements': [((0,1), -1, False), ((0,-1), -1, False),
                      ((1,0), -1, False), ((-1,0), -1, False),
                      ((1,1), -1, False), ((1,-1), -1, False),
                      ((-1,-1), -1, False), ((-1,1), -1, False)],
        'knightlike': True, 'knightdist_a': 1, 'knightdist_b': 2
    }),
}

setups = {
    "setup1": {
        "width": 8,
        "height": 8,
        "pieces": [
            {'type': 'rook', 'colour': 'black', 'x': 0, 'y': 0},
            {'type': 'rook', 'colour': 'black', 'x': 7, 'y': 0},
            {'type': 'rook', 'colour': 'white', 'x': 0, 'y': 7},
            {'type': 'rook', 'colour': 'white', 'x': 7, 'y': 7},
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

    return {
        "game_id": game_id,
        "width": game.width,
        "height": game.height,
        "millis": game.millis,
        "incr_millis": game.incr_millis,
        "players": game.players,
        "turn": game.turn,
        "castling": game.castling
    }

@app.get("/api/game/<string:game_id>/valid_moves") # Get valid moves for current user
def get_moves(game_id):
    try:
        game = games[game_id]
        username = request.cookies.get("user")
        colour = 'white' if game.players['white'] == username else 'black'
        moves = []
        for p in game.pieces:
            print(f"Looking at piece with colour {p.colour}")
            if p.colour == colour:
                print("Getting moves for piece.")
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
        username = request.cookies.get("user")
        colour = 'white' if game.players['white'] == username else 'black'

        if colour != game.turn:
            return "{'message': 'Not your turn!'}", 400

        from_x = int(request.form['from_x'])
        from_y = int(request.form['from_y'])
        to_x = int(request.form['to_x'])
        to_y = int(request.form['to_y'])

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
            millis = int(request.form['time']) * 1000
            incr_millis = int(request.form['increment']) * 1000
            host_colour = request.form['host_colour']

            setup = setups[request.form["setup"]]

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

            for p in setup["pieces"]:
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