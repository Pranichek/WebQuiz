from Project.db import DATABASE

room_users = DATABASE.Table(
    'room_users',
    DATABASE.Column('room_id', DATABASE.Integer, DATABASE.ForeignKey('room.id')),
    DATABASE.Column('user_id', DATABASE.Integer, DATABASE.ForeignKey('user.id'))
)

check_socket = DATABASE.Table(
    'check_sockets',
    DATABASE.Column('room_id', DATABASE.Integer, DATABASE.ForeignKey('room.id')),
    DATABASE.Column('user_id', DATABASE.Integer, DATABASE.ForeignKey('user.id'))
)
