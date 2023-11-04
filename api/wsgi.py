class Piece: # A generic piece
    def __init__(self, row, col):
        self.row = row
        self.col = col

class Knight(Piece):
    def __init__(self, row, col):
        Piece.__init__(self, row, col)

class Board:
    def __init__(self, width, height):
        self.width = width
        self.height = height

        self.pieces = []

my_board = Board(8, 8)
my_board.add_piece(Knight(0, 1))