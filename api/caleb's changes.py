            if target != None:
                board.del_at(x, y)
                if target.name="king":
                    end(target.colour)

def end(king_colour):
    if king_colour

def castle():
    if king.moved == FALSE
        for a in board.pieces:
            if a.name == "rook" and a.moved == FALSE and king.y == a.y:
                if king.x > a.x:
                    counter = a.x
                    endpoint = king.x
                    kingx_higher = TRUE
                else:
                    counter = king.x
                    endpoint = a.x
                    kingx_higher = FALSE
                counter +=1
                piece_in_way = FALSE
                while counter < endpoint:
                    if board.piece_at(counter, y) != None:
                        piece_in_way = True
                        break
                if piece_in_way == FALSE:
                    if abs(king.x-a.x) < 2:
                        kingdest = abs(king.x-a.x)
                    else:
                        kingdest = 2
                    if kingx_higher = TRUE:
                        destinations.append((king.x-kingdest, king.y))
                        rook_destination = (king.x-kingdest+1, king.y)
                    else:
                        destinations.append((king.x+kingdest, king.y))
                        rook_destination = (king.x-kingdest-1, king.y)
def en_passant():
    for a in range(-1,2,2):
        target = board.piece_at(pawn.x+a, pawn.y)
        if target.name == "pawn" and target.colour !=pawn.colour:
            if prev_move == target_double_move:
                if pawn.colour == "white":
                    b = 1
                if pawn.colour == "black":
                    b = -1
                if board.piece_at(pawn.x+a, pawn.y+b) == None:
                    destinations.append((pawn.x+a, pawn.y+b))
                    board.del_at(target.x, target.y)