# API description

## Get global info (GET /api/info)

Example response:

```json
{
  "game_codes": [
    "my_game"
  ],
  "piece_types": [
    "rook",
    "bishop",
    "knight",
    "pawn",
    "priest"
  ],
  "setups": {
    "setup1": {
      "height": 8,
      "pieces": [
        {
          "colour": "black",
          "type": "rook",
          "x": 0,
          "y": 0
        },
        {
          "colour": "black",
          "type": "rook",
          "x": 7,
          "y": 0
        },
        {
          "colour": "white",
          "type": "rook",
          "x": 0,
          "y": 7
        },
        {
          "colour": "white",
          "type": "rook",
          "x": 7,
          "y": 7
        }
      ],
      "width": 8
    }
  }
}
```

## Create game (POST /api/game/create)

POST Params:
 - `time`: Starting time (in seconds)
 - `increment`: Increment per turn (in seconds)
 - `setup`: Name of setup (valid name in setups database)
 - `host_colour`: Which colour the host plays ("black" | "white")
 - `setup`: The name of which setup to use for this game

Creates a new game and if all goes well, returns:

200 OK

Otherwise:

400 Bad Request
application/json

```json
{
    "error": <why the error happened>
}
```

## Get board state (GET /api/game/<game_id>)

Returns on success:

200 OK
applcation/json

```json
{
  "castling": {
    "black": true,
    "white": true
  },
  "game_id": "my_game",
  "height": 8,
  "width": 8,
  "incr_millis": 5000,
  "millis": {
    "black": 120000,
    "white": 120000
  },
  "players": {
    "black": "",
    "white": "jacob"
  },
  "turn": "white"
}
```

## Get valid moves (GET /api/game/<game_id>/valid_moves)

Returns either:

200 OK
application/json

Example structure:

```json
{
  "moves": [
    {
      "from_x": 0,
      "from_y": 7,
      "to_x": 0,
      "to_y": 6
    },
    {
      "from_x": 0,
      "from_y": 7,
      "to_x": 0,
      "to_y": 5
    },
    {
      "from_x": 0,
      "from_y": 7,
      "to_x": 0,
      "to_y": 4
    },
    /* ... some omitted */
    {
      "from_x": 7,
      "from_y": 7,
      "to_x": 1,
      "to_y": 7
    }
  ],
  "player_colour": "white",
  "username": "jacob"
}
```