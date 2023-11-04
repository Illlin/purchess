# API description

## Create game (POST /api/game/create)

Params:
 - `time`: Starting time (in seconds)
 - `increment`: Increment per turn (in seconds)
 - `setup`: Name of setup (valid name in setups database)
 - `host_colour`: Which colour the host plays ("black" | "white" | "random")

Creates a new game and if all goes well, returns:

200 OK
application/json

```json
{
    "id": <game id>,
}
```

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
    "columns": (0...),
    "rows": (0...),
    "pieces": [
        { // Each piece:
            "type": <piece id, e.g. 'knight', 'pawn', 'knook'>,
            "x_pos": (0...columns-1),
            "y_pos": (0...rows-1),
        }, /* ... More pieces */
    ]
}
```

## Get valid moves (GET /api/game/<game_id>/moves)

Returns either:

200 OK
application/json

```json
{
    "moves": [
        {
            "piece_id": <piece id>, // The piece being moved
            "destination": <destination>, // Like "e4", "f8", etc
            "captures": <true if this move captures a piece or false>
    ]
}
```