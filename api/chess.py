class Piece: # A generic piece
    def __init__(self, name, x, y, colour):
        self.x = x
        self.y = y
        self.colour = colour

        self.name = name

    def get_moves(self, board):
        return []

    def move_to(self, x, y, board):
        print("Moves: ", self.get_moves(board))
        print("(x, y) = ", (x, y))
        if (x, y) in self.get_moves(board):
            target = board.piece_at(x, y)

            if target != None:
                if target.name == "king":
                    board.winner = self.colour
                board.del_at(x, y)

            self.x, self.y = (x, y)
            board.half_move_number += 1
            board.turn = 'white' if board.turn == 'black' else 'black'

            return True
        else:
            return False

class ParamPiece(Piece):
# params:
#     movements, e.g. [
#       ((0, -1), 5, False),
#       ((0, 1), 5, False),
#       ((-1, 0), 5, False),
#       ((1, 0), 5, False)
#     ]
#     the above defines cardinal movement up to 5 steps, no jumping
#     Each tuple is (offset, max_dist, jumps)

#     knightlike      (bool)
#     knightdist_a    (int)
#     knightdist_b    (int)
    def __init__(self, name, x, y, colour, params):
        Piece.__init__(self, name, x, y, colour)
        
        self.params = params

    def get_moves(self, board):
        destinations = []

        # Sliding and jumping
        for arm in self.params['movements']:
            offx, offy = arm[0]
            dist = arm[1]
            jumper = arm[2]

            if dist == -1: # Infinity distance
                dist = max(board.width, board.height)

            tmpx, tmpy = self.x, self.y
            for i in range(dist):
                tmpx += offx; tmpy += offy

                moving_to = board.piece_at(tmpx, tmpy);

                if tmpx < 0 or tmpx >= board.width or tmpy < 0 or tmpy >= board.height:
                    break # Can't go further than the edge of the screen

                # Sliders stop when they reach a piece
                if not jumper and moving_to != None:
                    if moving_to.colour != self.colour:
                        destinations.append((tmpx, tmpy))
                    break # Finished this arm
                
                # Even a jumper can't move onto own colour
                if moving_to == None or moving_to.colour != self.colour:
                    if (tmpx, tmpy) not in destinations:
                        destinations.append((tmpx, tmpy))

        # Knight-like movement
        if self.params["knightlike"]:
            d = (self.params["knightdist_a"], self.params["knightdist_b"])
            perms = [(1,1),(1,-1),(-1,1),(-1,-1)]
            offsets = [(d[0]*p[0],d[1]*p[1]) for p in perms] + [(d[1]*p[0],d[0]*p[1]) for p in perms]
            knightmoves = [(self.x + o[0], self.y + o[1]) for o in offsets]

            for mv in knightmoves:
                moving_to = board.piece_at(mv[0], mv[1])
                # If moving to blank or other-colour'd square
                if moving_to == None or moving_to.colour != self.colour: # Can't move onto own colour piece
                    if mv[0] >= 0 and mv[0] < board.width and mv[1] >= 0 and mv[1] < board.height and mv not in destinations:
                        destinations.append(mv)

        return destinations

class PawnPiece(Piece):
    def __init__(self, x, y, colour):
        Piece.__init__(self, "pawn", x, y, colour)

        # Which move did I move two squares forward?
        # Used for calculating EN PASSANT
        self.when_moved_two = None

    def get_moves(self, board):
        # White pawns move -y, black pawns move +y
        # White pawns take diagonally at (-1, -1) and (1, -1)
        # Black pawns take diagonally at (-1, 1) and (1, 1)

        destinations = []
        
        offy = -1 if self.colour == 'white' else 1
        can_twostep = (self.y == board.height-2) if self.colour == 'white' else (self.y == 1)

        if (self.y + offy >= 0 and self.y + offy < board.height 
            and board.piece_at(self.x, self.y + offy) == None):
            destinations.append((self.x, self.y + offy))

        if can_twostep:
            twostepy = self.y + offy * 2
            if (twostepy >= 0 and twostepy < board.height 
                and board.piece_at(self.x, twostepy) == None):
                destinations.append((self.x, twostepy))

        takes = [(self.x-1, self.y+offy), (self.x+1, self.y+offy)]
        for t in takes:
            to_take = board.piece_at(*t)
            if to_take != None and to_take.colour != self.colour:
                destinations.append(t)

        return destinations

        # TODO: En passant

class PeonPiece(Piece):
    def __init__(self, x, y, colour):
        Piece.__init__(self, "pawn", x, y, colour)

        # Which move did I move two squares forward?
        # Used for calculating EN PASSANT
        self.when_moved_two = None

    def get_moves(self, board):
        # White pawns move -y, black pawns move +y
        # White pawns take diagonally at (-1, -1) and (1, -1)
        # Black pawns take diagonally at (-1, 1) and (1, 1)

        destinations = []
        
        offy = -1 if self.colour == 'white' else 1
        can_twostep = (self.y == board.height-2) if self.colour == 'white' else (self.y == 1)

        if (self.y + offy >= 0 and self.y + offy < board.height 
            and board.piece_at(self.x, self.y + offy) == None):
            destinations.append((self.x, self.y + offy))

        takes = [(self.x-1, self.y+offy), (self.x+1, self.y+offy)]
        for t in takes:
            to_take = board.piece_at(*t)
            if to_take != None and to_take.colour != self.colour:
                destinations.append(t)

        return destinations

        # TODO: En passant

class Board:
    def __init__(self, width, height):
        self.width = width
        self.height = height

        self.pieces = []

        self.millis = {'white': 0, 'black': 0}
        self.incr_millis = 0
        self.players = {'white': '', 'black': ''}
        self.turn = 'white'
        self.castling = {'white': True, 'black': True} # Castling rights

        self.half_move_number = 0
        self.winner = None

    def piece_at(self, x, y):
        for p in self.pieces:
            if p.x == x and p.y == y:
                return p
        return None

    def del_at(self, x, y):
        for p in self.pieces:
            if p.x == x and p.y == y:
                self.pieces.remove(p)

# TODO: For Caleb :)

# I think we will have no checkmate, just let the king be taken? This is much
# easier to implement and essentially just as good.
# Similarly, I think moving into check should be allowed.

# Game should have an "is ended" state, which is set when a king is taken, and a
# winner field to say who the winner is.

# When a piece is deleted (look at del_at function), check if that piece was a
# king. If it was, then set those game end values.

# Would be good to try and implement castling (might be hard, might be easy), and
# en passant.

# Promotion might be quite easy actually, override the move_to() function for the
# pawn class so that if the pawn gets to the end row it deletes itself and spawns
# another type of piece in its place. Will be harder if you want a pop-up to choose
# which piece to promote (rather than just promoting to queen), you'll need to
# discuss this with sol cause it needs to work well with the frontend.

# Clock maybe? Might not be worth it.